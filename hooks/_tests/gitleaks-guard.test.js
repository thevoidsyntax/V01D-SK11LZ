// Pipe tests for gitleaks-guard.js: node --test "C:/Users/CareTechnologies/.claude/hooks/_tests/*.test.js"
// These run the real gitleaks binary against real fixture repos (no mocking), matching this
// repo's convention. If gitleaks is not installed on this machine, every test here is skipped
// rather than failed, since the hook itself is designed to fail open in that case.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'gitleaks-guard.js');

const FALLBACK_PATHS = [
  path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages', 'Gitleaks.Gitleaks_Microsoft.Winget.Source_8wekyb3d8bbwe', 'gitleaks.exe'),
];

function findGitleaks() {
  for (const bin of ['gitleaks', ...FALLBACK_PATHS]) {
    try { execFileSync(bin, ['version'], { stdio: 'ignore' }); return bin; } catch { /* next */ }
  }
  return null;
}

const gitleaksAvailable = findGitleaks() !== null;

let tmp;
before(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gitleaks-guard-')); });
after(() => { if (tmp) fs.rmSync(tmp, { recursive: true, force: true }); });

function makeRepo(name) {
  const dir = path.join(tmp, name);
  fs.mkdirSync(dir, { recursive: true });
  const git = (...a) => spawnSync('git', ['-C', dir, ...a], { encoding: 'utf8' });
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'a@a.com');
  git('config', 'user.name', 'a');
  git('config', 'commit.gpgsign', 'false');
  return { dir, git };
}

function stage(repo, content) {
  fs.writeFileSync(path.join(repo.dir, 'secret.env'), content);
  repo.git('add', 'secret.env');
}

function run(command, cwd, tool_name = 'Bash') {
  const r = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_name, cwd, tool_input: { command } }),
    encoding: 'utf8',
  });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch {}
  return { status: r.status, out: r.stdout, json };
}

const decision = (r) => r.json?.hookSpecificOutput?.permissionDecision ?? null;
const silent = (r) => r.status === 0 && r.out.trim() === '';

// A real (non-placeholder) key pair: AKIA.../generic high-entropy secret. gitleaks explicitly
// allowlists well-known documentation placeholders like AKIAIOSFODNN7EXAMPLE, so a regression
// test must not use one of those or it will silently pass for the wrong reason.
const REAL_LOOKING_SECRET = 'AWS_ACCESS_KEY_ID=AKIAZQ3DSXBYSJRKT4PJ\nAWS_SECRET_ACCESS_KEY=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\n'; // gitleaks:allow
const CLEAN_CONTENT = 'FOO=bar\nBAZ=qux\n';

test('a commit with a real-looking secret staged is denied', { skip: !gitleaksAvailable }, () => {
  const repo = makeRepo('secret-repo');
  stage(repo, REAL_LOOKING_SECRET);
  const r = run('git commit -m "chore: add env"', repo.dir);
  assert.strictEqual(decision(r), 'deny');
  assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /gitleaks found/);
  assert.doesNotMatch(r.json.hookSpecificOutput.permissionDecisionReason, /\x1b\[/);
});

test('a commit with no secret staged is untouched', { skip: !gitleaksAvailable }, () => {
  const repo = makeRepo('clean-repo');
  stage(repo, CLEAN_CONTENT);
  assert(silent(run('git commit -m "chore: add env"', repo.dir)));
});

test('gitleaks allowlists its own well-known documentation placeholder', { skip: !gitleaksAvailable }, () => {
  const repo = makeRepo('placeholder-repo');
  stage(repo, 'AWS_SECRET_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE\n');
  assert(silent(run('git commit -m "chore: add env"', repo.dir)));
});

test('a cd into the repo then commit resolves the right directory', { skip: !gitleaksAvailable }, () => {
  const repo = makeRepo('cd-repo');
  stage(repo, REAL_LOOKING_SECRET);
  const cmd = `cd ${JSON.stringify(repo.dir)} && git commit -m "chore: add env"`;
  assert.strictEqual(decision(run(cmd, tmp)), 'deny');
});

test('git -C <dir> commit resolves the right directory', { skip: !gitleaksAvailable }, () => {
  const repo = makeRepo('gC-repo');
  stage(repo, REAL_LOOKING_SECRET);
  const cmd = `git -C ${JSON.stringify(repo.dir)} commit -m "chore: add env"`;
  assert.strictEqual(decision(run(cmd, tmp)), 'deny');
});

test('non-commit commands are not touched', () => {
  assert(silent(run('git status', tmp)));
  assert(silent(run('git push', tmp)));
  assert(silent(run('echo "git commit -m hello"', tmp)));
});

test('a commit resolving to a nonexistent directory fails open', () => {
  assert(silent(run('git commit -m "chore: nope"', path.join(tmp, 'does-not-exist'))));
});

test('fail open on broken input', () => {
  assert(silent(run('', tmp)));
  const r = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout.trim(), '');
});
