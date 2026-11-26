// Pipe tests for sven-gatekeeper.js: node --test "$HOME/.claude/skills/hooks/_tests/*.test.js"
const { test, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'sven-gatekeeper.js');
const { actionIdentity } = require(HOOK);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sven-gate-'));
const TOKEN = path.join(tmp, '.sven-approved.json');
after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const ENV = { ...process.env, SVEN_HOOKS_DIR: tmp, SVEN_LOG_DIR: tmp, SVEN_TELEGRAM: 'off' };
delete ENV.SVEN_ADVISOR;
delete ENV.SVEN_GATEKEEPER;

function run(input, env = {}) {
  const r = spawnSync('node', [HOOK], { input: JSON.stringify(input), encoding: 'utf8', env: { ...ENV, ...env } });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch {}
  return { status: r.status, out: r.stdout, json };
}

const bash = (command, session_id = 's1') => ({ session_id, tool_name: 'Bash', tool_input: { command } });
const write = (file_path, content = 'x', session_id = 's1') => ({ session_id, tool_name: 'Write', tool_input: { file_path, content } });
const decision = (r) => r.json?.hookSpecificOutput?.permissionDecision ?? null;
const silent = (r) => r.status === 0 && r.out.trim() === '';

function writeToken(input, over = {}) {
  const id = actionIdentity(input);
  const token = {
    action_hash: id.hash,
    session_id: input.session_id,
    expires_at: new Date(Date.now() + 5 * 60_000).toISOString(),
    ...over,
  };
  fs.writeFileSync(TOKEN, JSON.stringify(token));
  return id;
}

test('safe commands and ordinary files pass silently', () => {
  assert(silent(run(bash('git status'))));
  assert(silent(run(bash('npm test'))));
  assert(silent(run(bash('npm install'))));
  assert(silent(run(write(path.join(tmp, 'src', 'app.js')))));
  assert(silent(run(write(path.join(tmp, '.env.example')))));
});

test('irreversible commands are denied with an ActionHash', () => {
  for (const cmd of [
    'npm publish',
    'cd app && npm publish --access public',
    'docker compose down -v',
    'docker-compose down --volumes',
    'prisma migrate reset',
    'git push --force origin main',
    'vercel --prod',
    'railway up',
    'psql -c "DROP TABLE users"',
    'echo ok; TRUNCATE TABLE logs',
  ]) {
    const r = run(bash(cmd));
    assert.strictEqual(decision(r), 'deny', cmd);
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /ActionHash: [0-9a-f]{64}/, cmd);
  }
});

test('a package runner is looked through: npx prisma migrate reset is prisma migrate reset', () => {
  for (const cmd of [
    'npx prisma migrate reset',
    'npx --yes prisma migrate reset --force',
    'pnpx prisma migrate reset',
    'bunx prisma migrate reset',
    'pnpm dlx prisma migrate reset',
    'npm exec -- prisma migrate reset',
    'yarn dlx vercel --prod',
    'npx npm publish',
  ]) {
    const r = run(bash(cmd));
    assert.strictEqual(decision(r), 'deny', cmd);
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /ActionHash: [0-9a-f]{64}/, cmd);
  }
  for (const cmd of ['npx prettier --write .', 'npx', 'npm exec', 'pnpm dlx create-vite', 'npx --yes']) {
    assert(silent(run(bash(cmd))), cmd);
  }
});

test('a mention inside a quoted string is prose, not a command', () => {
  assert(silent(run(bash('echo "npm publish"'))));
  assert(silent(run(bash('git commit -m "docker compose down -v docs"'))));
});

test('files under .claude/skills ask: every persona reads them', () => {
  for (const f of ['.claude/skills/agents/progress.md', '.claude/skills/dina/SKILL.md', '.claude/skills/hooks/sven-gatekeeper.js']) {
    const r = run(write(path.join(tmp, f)));
    assert.strictEqual(decision(r), 'ask', f);
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /skill/i, f);
  }
});

test('critical file names match whatever the platform casing is', () => {
  const { criticalFileReason } = require(HOOK);
  const real = Object.getOwnPropertyDescriptor(process, 'platform');
  try {
    for (const platform of ['linux', 'darwin', 'win32']) {
      Object.defineProperty(process, 'platform', { value: platform });
      for (const f of ['Dockerfile', 'Docker-Compose.yml', 'CLAUDE.md', 'Schema.prisma']) {
        assert.ok(criticalFileReason(path.join(tmp, f)), `${platform} ${f}`);
      }
    }
  } finally {
    Object.defineProperty(process, 'platform', real);
  }
});

test('critical files ask, with an ActionHash', () => {
  for (const f of ['.env', 'Dockerfile', 'docker-compose.yml', 'prisma/schema.prisma', 'CLAUDE.md', 'db/migrations/001.sql', 'src/auth/login.ts', 'src/middleware.ts']) {
    const r = run(write(path.join(tmp, f)));
    assert.strictEqual(decision(r), 'ask', f);
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /ActionHash: [0-9a-f]{64}/, f);
  }
});

test('a matching token allows the one action and is consumed', () => {
  const input = bash('npm publish');
  writeToken(input);
  assert.strictEqual(decision(run(input)), 'allow');
  assert(!fs.existsSync(TOKEN), 'token should be deleted after use');
  assert.strictEqual(decision(run(input)), 'deny', 'second attempt needs a new token');
});

test('a token for another action, session, or time does not allow', () => {
  const input = bash('npm publish');
  writeToken(bash('npm publish --tag next'));
  assert.strictEqual(decision(run(input)), 'deny', 'different command');
  writeToken(input, { session_id: 'other-session' });
  assert.strictEqual(decision(run(input)), 'deny', 'different session');
  writeToken(input, { expires_at: new Date(Date.now() - 1000).toISOString() });
  assert.strictEqual(decision(run(input)), 'deny', 'expired');
  fs.rmSync(TOKEN, { force: true });
});

test('a write token is bound to the content, not only the path', () => {
  const file = path.join(tmp, 'Dockerfile');
  writeToken(write(file, 'FROM node:22'));
  assert.strictEqual(decision(run(write(file, 'FROM evil:latest'))), 'ask');
  assert.strictEqual(decision(run(write(file, 'FROM node:22'))), 'allow');
});

test('AskUserQuestion gets Sven framing and is not blocked', () => {
  const r = run({ session_id: 's1', tool_name: 'AskUserQuestion', tool_input: { questions: [{ header: 'Scope', question: 'Which?' }] } });
  assert.strictEqual(r.json.hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.match(r.json.hookSpecificOutput.additionalContext, /Sven/);
  assert.strictEqual(decision(r), null);
});

// A stand-in for sven-ask.js: prints FAKE_ASK and records its arguments.
const ARGS_LOG = path.join(tmp, 'ask-args.json');
function fakeAsk(json) {
  fs.writeFileSync(path.join(tmp, 'sven-ask.js'),
    `require('fs').writeFileSync(${JSON.stringify(ARGS_LOG)}, JSON.stringify(process.argv.slice(2)));` +
    `process.stdout.write(${JSON.stringify(JSON.stringify(json))} + '\\n');`);
  fs.rmSync(ARGS_LOG, { force: true });
}
const ask = (q, env = {}) => run({ session_id: 's1', tool_name: 'AskUserQuestion', tool_input: { questions: [q] } }, { SVEN_TELEGRAM: '', ...env });
const choice = { header: 'Push', question: 'Push now?', options: [{ label: 'Push (Recommended)' }, { label: 'Not now; later' }] };

test('a Telegram button tap answers AskUserQuestion: the call is denied with the answer', () => {
  fakeAsk({ id: 'x', kind: 'button', key: 'B', answer: 'Not now, later' });
  const r = ask(choice);
  assert.strictEqual(decision(r), 'deny');
  assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /answered this question on Telegram \(Push\): "Not now; later"/);
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(ARGS_LOG, 'utf8')).slice(-2), ['--options', 'A=Push (Recommended);B=Not now, later']);
});

test('a Telegram text reply is passed on as the answer', () => {
  fakeAsk({ id: 'x', kind: 'text', answer: 'tunggu besok' });
  const r = ask(choice);
  assert.strictEqual(decision(r), 'deny');
  assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /tunggu besok/);
});

test('timeout falls back to the terminal question', () => {
  fakeAsk({ id: 'x', kind: 'timeout' });
  const r = ask(choice);
  assert.strictEqual(decision(r), null);
  assert.match(r.json.hookSpecificOutput.additionalContext, /Sven/);
});

test('questions that cannot be buttons skip the wait', () => {
  fakeAsk({ id: 'x', kind: 'button', key: 'A', answer: 'x' });
  assert.strictEqual(decision(ask({ ...choice, multiSelect: true })), null);
  assert.strictEqual(decision(ask({ ...choice, options: [{ label: 'only one' }] })), null);
  assert.strictEqual(decision(ask(choice, { SVEN_ASK_WAIT: '0' })), null);
  assert.strictEqual(decision(ask(choice, { SVEN_TELEGRAM: 'off' })), null);
  const two = run({ session_id: 's1', tool_name: 'AskUserQuestion', tool_input: { questions: [choice, choice] } }, { SVEN_TELEGRAM: '' });
  assert.strictEqual(decision(two), null);
});

test('kill switch and dry run never block', () => {
  assert(silent(run(bash('npm publish'), { SVEN_ADVISOR: 'off' })));
  assert(silent(run(bash('npm publish'), { SVEN_GATEKEEPER: 'dryrun' })));
});

test('bad input and other tools fail open', () => {
  const r = spawnSync('node', [HOOK], { input: 'not json', encoding: 'utf8', env: ENV });
  assert(r.status === 0 && r.stdout === '');
  assert(silent(run({ session_id: 's1', tool_name: 'Read', tool_input: { file_path: '/x/.env' } })));
});
