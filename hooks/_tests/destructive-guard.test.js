// Pipe tests for destructive-guard.js: node --test "C:/Users/CareTechnologies/.claude/hooks/_tests/*.test.js"
const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'destructive-guard.js');

function run(command, tool_name = 'Bash') {
  const r = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_name, tool_input: { command } }),
    encoding: 'utf8',
  });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch {}
  return { status: r.status, out: r.stdout, json };
}

const decision = (r) => r.json?.hookSpecificOutput?.permissionDecision ?? null;
const silent = (r) => r.status === 0 && r.out.trim() === '';

test('git reset --hard asks the user', () => {
  assert.strictEqual(decision(run('git reset --hard')), 'ask');
  assert.strictEqual(decision(run('git reset --hard HEAD~1')), 'ask');
  assert.strictEqual(decision(run('cd /repo && git reset --hard')), 'ask');
});

test('git reset without --hard is untouched', () => {
  assert(silent(run('git reset')));
  assert(silent(run('git reset --soft HEAD~1')));
  assert(silent(run('git reset --mixed')));
  assert(silent(run('git reset HEAD -- file.js')));
});

test('git clean -f (any spelling) asks the user', () => {
  assert.strictEqual(decision(run('git clean -f')), 'ask');
  assert.strictEqual(decision(run('git clean -fd')), 'ask');
  assert.strictEqual(decision(run('git clean -xdf')), 'ask');
  assert.strictEqual(decision(run('git clean --force')), 'ask');
});

test('git clean without force is untouched', () => {
  assert(silent(run('git clean -n')));
  assert(silent(run('git clean --dry-run')));
});

test('a forced branch delete asks the user', () => {
  assert.strictEqual(decision(run('git branch -D old-feature')), 'ask');
  assert.strictEqual(decision(run('git branch --delete --force old-feature')), 'ask');
  assert.strictEqual(decision(run('git branch -d -f old-feature')), 'ask');
});

test('a plain branch delete is untouched', () => {
  assert(silent(run('git branch -d merged-feature')));
  assert(silent(run('git branch --delete merged-feature')));
});

test('checkout/restore that discard worktree changes ask the user', () => {
  assert.strictEqual(decision(run('git checkout -- src/app.js')), 'ask');
  assert.strictEqual(decision(run('git checkout .')), 'ask');
  assert.strictEqual(decision(run('git restore src/app.js')), 'ask');
  assert.strictEqual(decision(run('git restore --worktree --staged src/app.js')), 'ask');
});

test('checkout/restore that do not touch the worktree are untouched', () => {
  assert(silent(run('git checkout main')));
  assert(silent(run('git checkout -b feature/x')));
  assert(silent(run('git restore --staged src/app.js')));
});

test('gh repo delete asks the user', () => {
  assert.strictEqual(decision(run('gh repo delete my-org/my-repo')), 'ask');
  assert.strictEqual(decision(run('gh repo delete my-org/my-repo --yes')), 'ask');
});

test('other gh commands are untouched', () => {
  assert(silent(run('gh repo view my-org/my-repo')));
  assert(silent(run('gh repo clone my-org/my-repo')));
});

test('rm -rf (bash) asks the user', () => {
  assert.strictEqual(decision(run('rm -rf build')), 'ask');
  assert.strictEqual(decision(run('rm -fr build')), 'ask');
  assert.strictEqual(decision(run('rm -r -f build')), 'ask');
  assert.strictEqual(decision(run('rm --recursive --force build')), 'ask');
});

test('rm without both -r and -f is untouched', () => {
  assert(silent(run('rm file.txt')));
  assert(silent(run('rm -f file.txt')));
  assert(silent(run('rm -r empty-dir')));
});

test('Remove-Item -Recurse -Force (PowerShell, and its aliases) asks the user', () => {
  assert.strictEqual(decision(run('Remove-Item build -Recurse -Force', 'PowerShell')), 'ask');
  assert.strictEqual(decision(run('ri build -Recurse -Force', 'PowerShell')), 'ask');
  assert.strictEqual(decision(run('rd build -r -f', 'PowerShell')), 'ask');
  assert.strictEqual(decision(run('Remove-Item -Recurse -Force -Path build', 'PowerShell')), 'ask');
});

test('the same text is read differently depending on the shell', () => {
  // Bash rm uses short flags: -rf is force+recurse.
  assert.strictEqual(decision(run('rm -rf build', 'Bash')), 'ask');
  // PowerShell's rm alias is Remove-Item, which does not understand -rf; -Recurse/-Force only.
  assert(silent(run('rm -rf build', 'PowerShell')));
});

test('Remove-Item without both -Recurse and -Force is untouched', () => {
  assert(silent(run('Remove-Item build.txt', 'PowerShell')));
  assert(silent(run('Remove-Item build -Force', 'PowerShell')));
});

test('git global options ahead of a destructive subcommand are denied', () => {
  assert.strictEqual(decision(run('git -C /repo reset --hard')), 'deny');
  assert.strictEqual(decision(run('git -c core.hooksPath=/tmp/x clean -f')), 'deny');
  assert.match(run('git -C /repo reset --hard').json.hookSpecificOutput.permissionDecisionReason, /plain command/);
});

test('a destructive command inside a quoted string is prose, not a command', () => {
  assert(silent(run('echo "git reset --hard"')));
  assert(silent(run('git commit -m "fix: finally stop rm -rf-ing the build dir"')));
});

test('a wrapper or nested shell still exposes the command, and only asks', () => {
  assert.strictEqual(decision(run('sudo rm -rf /var/cache/app')), 'ask');
  assert.strictEqual(decision(run('bash -c "git reset --hard"')), 'ask');
  assert.strictEqual(decision(run('bash -c "git -C /repo reset --hard"')), 'deny');
});

test('other commands are not touched', () => {
  assert(silent(run('git status')));
  assert(silent(run('git push')));
  assert(silent(run('git commit -m "feat: add app"')));
});

test('fail open on broken input', () => {
  assert(silent(run('')));
  const r = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout.trim(), '');
});
