// Pipe tests for claude-resume-on-sessionstart.js.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'claude-resume-on-sessionstart.js');

let tmp;
before(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-sessionstart-')); });
after(() => { if (tmp) fs.rmSync(tmp, { recursive: true, force: true }); });

function run(cwd) {
  const r = spawnSync('node', [HOOK], { input: JSON.stringify({ cwd }), encoding: 'utf8' });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch {}
  return json;
}

test('points to specs/RESUME.md when it already exists', () => {
  const dir = path.join(tmp, 'agents-project');
  fs.mkdirSync(path.join(dir, 'specs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'specs', 'RESUME.md'), '| step | status |\n');
  const out = run(dir);
  assert.match(out.hookSpecificOutput.additionalContext, /specs[\\/]RESUME\.md/);
  assert.match(out.hookSpecificOutput.additionalContext, /JANGAN membuat RESUME\.md baru di root/);
});

test('falls back to root RESUME.md when there is no specs/RESUME.md', () => {
  const dir = path.join(tmp, 'plain-project');
  fs.mkdirSync(dir, { recursive: true });
  const out = run(dir);
  assert.doesNotMatch(out.hookSpecificOutput.additionalContext, /specs[\\/]RESUME\.md/);
  assert.match(out.hookSpecificOutput.additionalContext, /plain-project[\\/]RESUME\.md/);
});

test('fails open on a nonexistent cwd', () => {
  assert.strictEqual(run(path.join(tmp, 'does-not-exist')), null);
});

test('fails open on broken input', () => {
  const r = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout.trim(), '');
});
