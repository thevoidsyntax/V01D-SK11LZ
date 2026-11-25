// Pipe tests for handover.js: node --test "$HOME/.claude/skills/hooks/_tests/*.test.js"
const { test, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'handover.js');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'handover-'));
after(() => fs.rmSync(root, { recursive: true, force: true }));

function run(payload, env = {}) {
  const r = spawnSync('node', [HOOK], { input: JSON.stringify(payload), encoding: 'utf8', env: { ...process.env, ...env } });
  return { status: r.status, out: r.stdout, err: r.stderr };
}

function project(name, { handoff, transcript } = {}) {
  const dir = path.join(root, name);
  fs.mkdirSync(path.join(dir, 'specs'), { recursive: true });
  spawnSync('git', ['-C', dir, 'init', '-q', '-b', 'trunk']);
  spawnSync('git', ['-C', dir, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '--allow-empty', '-m', 'init']);
  if (handoff) fs.writeFileSync(path.join(dir, 'specs', 'HANDOFF.md'), handoff);
  let transcriptPath;
  if (transcript) {
    transcriptPath = path.join(root, name + '.jsonl');
    fs.writeFileSync(transcriptPath, transcript.map((e) => JSON.stringify(e)).join('\n'));
  }
  return { dir, transcriptPath, state: path.join(dir, 'specs', '.state.md') };
}

const assistant = (input, cache = 0, output = 5) => ({
  type: 'assistant',
  message: { usage: { input_tokens: input, cache_read_input_tokens: cache, cache_creation_input_tokens: 0, output_tokens: output } },
});

test('Stop writes specs/.state.md with branch, last phase, next step and context size', () => {
  const p = project('stop', {
    handoff: '## [PHASE 1] Hexa — 2026-11-01T00:00:00Z\nNext: Dina\n\n## [PHASE 2] Dina — 2026-11-02T00:00:00Z\nNext: Frans ships it\n',
    transcript: [assistant(1000, 2000, 40)],
  });
  const r = run({ hook_event_name: 'Stop', cwd: p.dir, transcript_path: p.transcriptPath });
  assert.strictEqual(r.status, 0);
  const s = fs.readFileSync(p.state, 'utf8');
  assert.match(s, /- Branch: trunk/);
  assert.match(s, /- Fase terakhir: PHASE 2/);
  assert.match(s, /- Next \(HANDOFF\): Frans ships it/);
  assert.match(s, /- Context terakhir: 3000 token \(output respons terakhir 40\)/);
});

test('Stop reports the last test run and the best one when they differ', () => {
  const p = project('tests', {
    transcript: [
      { type: 'user', message: { content: 'Tests  1167 passed (1167)' } },
      { type: 'user', message: { content: 'Tests  3 failed | 700 passed (703)' } },
    ],
  });
  run({ hook_event_name: 'Stop', cwd: p.dir, transcript_path: p.transcriptPath });
  const s = fs.readFileSync(p.state, 'utf8');
  assert.match(s, /- Test terakhir: 700 passed \/ 3 failed/);
  assert.match(s, /- Test terbaik di sesi ini: 1167 passed \/ 0 failed/);
});

test('Stop ignores its own snapshot lines echoed into the transcript', () => {
  const p = project('echo', {
    transcript: [
      { type: 'user', message: { content: 'Tests  10 passed (10)' } },
      { type: 'user', message: { content: '- Test terakhir: 700 passed / 3 failed\n- Test terbaik di sesi ini: 1167 passed / 0 failed (run terakhir bisa dari salinan mutan)' } },
    ],
  });
  run({ hook_event_name: 'Stop', cwd: p.dir, transcript_path: p.transcriptPath });
  const s = fs.readFileSync(p.state, 'utf8');
  assert.match(s, /- Test terakhir: 10 passed \/ 0 failed/);
  assert.doesNotMatch(s, /Test terbaik/);
});

test('an assistant entry with zero usage does not reset the context size', () => {
  const p = project('zero', { transcript: [assistant(1000, 2000, 40), assistant(0, 0, 0)] });
  run({ hook_event_name: 'Stop', cwd: p.dir, transcript_path: p.transcriptPath });
  assert.match(fs.readFileSync(p.state, 'utf8'), /- Context terakhir: 3000 token/);
});

test('a zero-input entry with output tokens does not reset the context size', () => {
  const p = project('zero-out', { transcript: [assistant(1000, 2000, 40), assistant(0, 0, 7)] });
  run({ hook_event_name: 'Stop', cwd: p.dir, transcript_path: p.transcriptPath });
  assert.match(fs.readFileSync(p.state, 'utf8'), /- Context terakhir: 3000 token/);
});

test('a thousands separator does not turn 1,167 passed into 167 passed', () => {
  const p = project('comma', { transcript: [{ type: 'user', message: { content: '1,167 passed / 0 failed' } }] });
  run({ hook_event_name: 'Stop', cwd: p.dir, transcript_path: p.transcriptPath });
  assert.match(fs.readFileSync(p.state, 'utf8'), /- Test terakhir: tidak diketahui/);
});

test('Stop keeps the leading space of an unstaged change', () => {
  const p = project('unstaged');
  const f = path.join(p.dir, 'a.txt');
  fs.writeFileSync(f, '1');
  spawnSync('git', ['-C', p.dir, 'add', 'a.txt']);
  spawnSync('git', ['-C', p.dir, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', 'a']);
  fs.writeFileSync(f, '2');
  run({ hook_event_name: 'Stop', cwd: p.dir });
  assert.match(fs.readFileSync(p.state, 'utf8'), /^ M a\.txt$/m);
});

test('Stop lists uncommitted files', () => {
  const p = project('dirty');
  fs.writeFileSync(path.join(p.dir, 'draft.txt'), 'x');
  run({ hook_event_name: 'Stop', cwd: p.dir });
  assert.match(fs.readFileSync(p.state, 'utf8'), /\?\? draft\.txt/);
});

test('SessionStart prints the snapshot the last Stop wrote', () => {
  const p = project('resume');
  run({ hook_event_name: 'Stop', cwd: p.dir });
  const r = run({ hook_event_name: 'SessionStart', cwd: p.dir });
  assert.strictEqual(r.status, 0);
  assert.match(r.out, /===== HANDOVER/);
  assert.match(r.out, /- Branch: trunk/);
});

test('SessionStart says so when no snapshot exists', () => {
  const dir = path.join(root, 'fresh-' + process.pid);
  fs.mkdirSync(dir, { recursive: true });
  const r = run({ hook_event_name: 'SessionStart', cwd: dir });
  assert.match(r.out, /belum ada snapshot/);
});

test('UserPromptSubmit warns above the context threshold and stays silent below it', () => {
  const p = project('size', { transcript: [assistant(500, 600)] });
  const loud = run({ hook_event_name: 'UserPromptSubmit', cwd: p.dir, transcript_path: p.transcriptPath }, { HANDOVER_CONTEXT_WARN: '1000' });
  assert.match(loud.out, /context 1100 token \(ambang 1000\)/);
  const quiet = run({ hook_event_name: 'UserPromptSubmit', cwd: p.dir, transcript_path: p.transcriptPath }, { HANDOVER_CONTEXT_WARN: '5000' });
  assert.strictEqual(quiet.out.trim(), '');
});

test('garbage on stdin never fails the hook', () => {
  const r = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout.trim(), '');
});
