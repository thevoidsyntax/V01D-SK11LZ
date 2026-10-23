// Pipe tests for ask-on-git-push.js: node --test "C:/Users/CareTechnologies/.claude/hooks/_tests/*.test.js"
const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'ask-on-git-push.js');

function run(command) {
  const r = spawnSync('node', [HOOK], {
    input: JSON.stringify({ tool_name: 'Bash', tool_input: { command } }),
    encoding: 'utf8',
  });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch {}
  return { status: r.status, out: r.stdout, json };
}

const decision = (r) => r.json?.hookSpecificOutput?.permissionDecision ?? null;
const silent = (r) => r.status === 0 && r.out.trim() === '';

test('plain git push asks the user', () => {
  assert.strictEqual(decision(run('git push')), 'ask');
  assert.strictEqual(decision(run('git push origin main')), 'ask');
  assert.strictEqual(decision(run('git push --force')), 'ask');
  assert.strictEqual(decision(run('cd /repo && git push')), 'ask');
  assert.strictEqual(decision(run('Set-Location C:\\repo; git push')), 'ask');
});

test('git push with global options is denied', () => {
  assert.strictEqual(decision(run('git -C /repo push')), 'deny');
  assert.strictEqual(decision(run('git -C "C:/Users/me/repo" push')), 'deny');
  assert.strictEqual(decision(run('git -c core.hooksPath=/tmp/x push')), 'deny');
  assert.strictEqual(decision(run('git --git-dir=/repo/.git push')), 'deny');
  assert.strictEqual(decision(run('git --no-pager push')), 'deny');
  assert.match(run('git -C /repo push').json.hookSpecificOutput.permissionDecisionReason, /plain `git push/);
});

test('a push inside a quoted string is prose, not a command', () => {
  assert(silent(run('echo "git -C /repo push"')));
  assert(silent(run("echo 'git -C /repo push'")));
  assert(silent(run('git commit -m "fix: git -C /repo push now works"')));
  assert(silent(run('echo git push')));
  assert(silent(run('git commit -m "push"')));
});

test('a push inside a heredoc body is prose, not a command', () => {
  const cmd = "git commit -F - <<'EOF'\nchore: note\ngit -C /repo push\nEOF";
  assert(silent(run(cmd)));
  const bare = "cat <<EOF\ngit -C /repo push\nEOF";
  assert(silent(run(bare)));
});

test('a push inside a here-string is prose, not a command', () => {
  assert(silent(run("@'\ngit -C /repo push\n'@")));
});

test('other git commands are not touched', () => {
  assert(silent(run('git status')));
  assert(silent(run('git commit -m "x"')));
  assert(silent(run('git pushd origin main')));
  assert(silent(run('git remote push origin main')));
});

test('code passed to a shell or eval is still scanned', () => {
  assert.strictEqual(decision(run('bash -c "git push"')), 'ask');
  assert.strictEqual(decision(run('bash -c "git -C /repo push"')), 'deny');
  assert.strictEqual(decision(run("sh -c 'git -C /repo push'")), 'deny');
  assert.strictEqual(decision(run('eval "git -C /repo push"')), 'deny');
  assert.strictEqual(decision(run('bash -lc "git push"')), 'ask');
});

test('a wrapper command still exposes the push', () => {
  assert.strictEqual(decision(run('sudo git push')), 'ask');
  assert.strictEqual(decision(run('env GIT_SSH_COMMAND=ssh git push')), 'ask');
});

test('fail open on broken input', () => {
  assert(silent(run('')));
  const r = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout.trim(), '');
});
