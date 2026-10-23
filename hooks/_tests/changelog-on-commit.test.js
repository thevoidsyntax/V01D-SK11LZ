// Pipe tests for changelog-on-commit.js: node --test "C:/Users/CareTechnologies/.claude/hooks/_tests/*.test.js"
const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'changelog-on-commit.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-hook-'));

let seq = 0;

// A repo with a CHANGELOG.md already committed, plus the files to stage.
function fixture({ withChangelogFile = true, staged = [] } = {}) {
  const dir = path.join(tmp, `repo${++seq}`);
  fs.mkdirSync(dir);
  const git = (...a) => spawnSync('git', ['-C', dir, ...a], { encoding: 'utf8' });
  git('init', '-b', 'main');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'test');
  git('config', 'commit.gpgsign', 'false');
  if (withChangelogFile) {
    fs.writeFileSync(path.join(dir, 'CHANGELOG.md'), '# Changelog\n\n## [Unreleased]\n');
    git('add', 'CHANGELOG.md');
    git('commit', '-m', 'chore: seed');
  }
  for (const f of staged) {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
    fs.writeFileSync(path.join(dir, f), 'x\n');
    git('add', f);
  }
  return dir;
}

function run(dir, command) {
  const r = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_name: 'Bash', cwd: dir, tool_input: { command } }),
    encoding: 'utf8',
  });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch {}
  return { status: r.status, out: r.stdout, json };
}

const decision = (r) => r.json?.hookSpecificOutput?.permissionDecision ?? null;
const denied = (r) => decision(r) === 'deny';
const allowed = (r) => r.out.trim() === '' && r.status === 0;

test('a feat commit without a CHANGELOG entry is denied', () => {
  const dir = fixture({ staged: ['src/app.js'] });
  assert.ok(denied(run(dir, 'git commit -m "feat: add app"')));
});

test('a commit that stages CHANGELOG.md is allowed', () => {
  const dir = fixture({ staged: ['src/app.js'] });
  fs.writeFileSync(path.join(dir, 'CHANGELOG.md'), '# Changelog\n\n## [Unreleased]\n- feat: add app\n');
  spawnSync('git', ['-C', dir, 'add', 'CHANGELOG.md']);
  assert.ok(allowed(run(dir, 'git commit -m "feat: add app"')));
});

test('a docs commit needs no entry', () => {
  const dir = fixture({ staged: ['docs/guide.md'] });
  assert.ok(allowed(run(dir, 'git commit -m "docs: add guide"')));
});

test('SKIP_CHANGELOG=1 no longer waives a feat commit', () => {
  const dir = fixture({ staged: ['src/app.js'] });
  assert.ok(denied(run(dir, 'SKIP_CHANGELOG=1 git commit -m "feat: add app"')));
});

test('SKIP_CHANGELOG=1 no longer waives a deploy-facing change', () => {
  const dir = fixture({ staged: ['Dockerfile'] });
  assert.ok(denied(run(dir, 'SKIP_CHANGELOG=1 git commit -m "docs: note"')));
  const dir2 = fixture({ staged: ['migrations/001_init.sql'] });
  assert.ok(denied(run(dir2, 'SKIP_CHANGELOG=1 git commit -m "chore: init"')));
});

test('a deploy-facing change always needs an entry, even for a docs commit', () => {
  const dir = fixture({ staged: ['docker-compose.yml'] });
  assert.ok(denied(run(dir, 'git commit -m "docs: note"')));
});

test('a repo without CHANGELOG.md is not checked', () => {
  const dir = fixture({ withChangelogFile: false, staged: ['src/app.js'] });
  assert.ok(allowed(run(dir, 'git commit -m "feat: add app"')));
});

test('a commit without a conventional type is denied, and the marker does not help', () => {
  const dir = fixture({ staged: ['src/app.js'] });
  assert.ok(denied(run(dir, 'git commit -m "wip"')));
  assert.ok(denied(run(dir, 'SKIP_CHANGELOG=1 git commit -m "wip"')));
});

test('other commands are ignored', () => {
  const dir = fixture({ staged: ['src/app.js'] });
  assert.ok(allowed(run(dir, 'git status')));
  assert.ok(allowed(run(dir, 'git push')));
});
