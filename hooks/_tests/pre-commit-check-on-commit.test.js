// Pipe tests for pre-commit-check-on-commit.js: cd ~/.claude/skills/hooks/_tests && node --test *.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'pre-commit-check-on-commit.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'precommit-hook-'));

let seq = 0;

// A git repo; `block` is the body of the bash block in pre-commit-check/SKILL.md (null = no such skill).
function fixture(block) {
  const dir = path.join(tmp, `repo${++seq}`);
  fs.mkdirSync(dir);
  spawnSync('git', ['-C', dir, 'init', '-b', 'main']);
  if (block !== null) {
    fs.mkdirSync(path.join(dir, 'pre-commit-check'));
    fs.writeFileSync(
      path.join(dir, 'pre-commit-check', 'SKILL.md'),
      `---\nname: pre-commit-check\n---\n\n# Before commit\n\n\`\`\`bash\n${block}\n\`\`\`\n\nManual checks follow.\n`,
    );
  }
  return dir;
}

function run(cwd, command, env = {}) {
  const r = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_name: 'Bash', cwd, tool_input: { command } }),
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch {}
  return { status: r.status, out: r.stdout, json };
}

const denied = (r) => r.json?.hookSpecificOutput?.permissionDecision === 'deny';
const reason = (r) => r.json?.hookSpecificOutput?.permissionDecisionReason ?? '';
const silent = (r) => r.out.trim() === '' && r.status === 0;

const COMMIT = 'git commit -m "feat: x"';

test('a finding from the checks denies the commit and is quoted in the reason', () => {
  const dir = fixture('echo "agents/SKILL.md:12: nested code fence"');
  const r = run(dir, COMMIT);
  assert.ok(denied(r));
  assert.match(reason(r), /agents\/SKILL\.md:12: nested code fence/);
});

test('clean checks let the commit through silently', () => {
  assert.ok(silent(run(fixture('true'), COMMIT)));
});

test('git warning lines are not findings', () => {
  assert.ok(silent(run(fixture('echo "warning: LF will be replaced by CRLF"'), COMMIT)));
});

test('a command that is not a commit is ignored', () => {
  assert.ok(silent(run(fixture('echo problem'), 'git status')));
});

test('a repo without pre-commit-check/SKILL.md is ignored', () => {
  assert.ok(silent(run(fixture(null), COMMIT)));
});

test('the checks run from the repo root', () => {
  const dir = fixture('test -f pre-commit-check/SKILL.md || echo "wrong cwd: $PWD"');
  assert.ok(silent(run(dir, COMMIT)));
});

test('git -C <dir> commit checks that dir, not the session cwd', () => {
  const dir = fixture('echo problem');
  const elsewhere = fixture(null);
  assert.ok(denied(run(elsewhere, `git -C "${dir}" commit -m "fix: y"`)));
});

test('PRECOMMIT_CHECK=off disables the hook', () => {
  assert.ok(silent(run(fixture('echo problem'), COMMIT, { PRECOMMIT_CHECK: 'off' })));
});

test('PRECOMMIT_CHECK=off written in the command disables the hook', () => {
  assert.ok(silent(run(fixture('echo problem'), `PRECOMMIT_CHECK=off ${COMMIT}`)));
});

test('a SKILL.md with no bash block is ignored', () => {
  const dir = fixture('true');
  fs.writeFileSync(path.join(dir, 'pre-commit-check', 'SKILL.md'), '# no block here\n');
  assert.ok(silent(run(dir, COMMIT)));
});

test('malformed stdin does not crash the hook', () => {
  const r = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout.trim(), '');
});
