// Pipe tests for sven-ask.js against a local fake Bot API. The "daemon" is played by the test:
// it writes <id>.answer.json the way h3x4_sven.write_answer does. Nothing leaves the machine.
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'sven-ask.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sven-ask-'));
const stateDir = path.join(tmp, 'telegram');
const logDir = path.join(tmp, 'logs');
const pendingDir = path.join(tmp, 'pending');
const coreDir = path.join(tmp, 'core');
let received = [];
let sendDelayMs = 0;
let server;
let api;
const keepAlive = [];

before(async () => {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(path.join(stateDir, '.env'), 'TELEGRAM_BOT_TOKEN=123456:FAKE-token_abc\n');
  fs.writeFileSync(path.join(stateDir, 'access.json'), JSON.stringify({ allowFrom: ['999'] }));
  server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      received.push({ url: req.url, body: JSON.parse(body) });
      setTimeout(() => res.end(JSON.stringify({ ok: true, result: { message_id: 321 } })), sendDelayMs);
    });
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  api = `http://127.0.0.1:${server.address().port}`;
});
after(() => {
  server.close();
  for (const child of keepAlive) { try { child.kill(); } catch {} }
  fs.rmSync(tmp, { recursive: true, force: true });
});
beforeEach(() => {
  received = [];
  sendDelayMs = 0;
  fs.rmSync(pendingDir, { recursive: true, force: true });
  fs.rmSync(coreDir, { recursive: true, force: true });
  fs.mkdirSync(coreDir, { recursive: true });
  fs.writeFileSync(path.join(coreDir, 'daemon.marker'), String(process.pid));
});

function start(args, env = {}) {
  const p = spawn('node', [HOOK, ...args], {
    env: {
      ...process.env, SVEN_TELEGRAM_DIR: stateDir, SVEN_LOG_DIR: logDir, SVEN_TELEGRAM_API: api,
      SVEN_PENDING_DIR: pendingDir, H3X4_CORE_DIR: coreDir, SVEN_ASK_POLL_MS: '50', ...env,
    },
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  let out = '';
  p.stdout.on('data', (c) => { out += c; });
  const done = new Promise((resolve) => {
    const t0 = Date.now();
    p.on('exit', (code) => resolve({ code, ms: Date.now() - t0, out: out.trim() }));
  });
  return { p, done };
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// The whole suite runs in parallel, so the machine is loaded: a spawn plus a
// local HTTP call can take longer than 4 s under that load.
async function waitFor(fn, ms = 20000) {
  const end = Date.now() + ms;
  while (Date.now() < end) { const v = fn(); if (v) return v; await sleep(20); }
  throw new Error('timed out waiting');
}
const pendingFile = () => {
  try { return fs.readdirSync(pendingDir).find((n) => /^[0-9a-f]{12}\.json$/.test(n)); } catch { return null; }
};
const readPending = async () => {
  const name = await waitFor(pendingFile);
  const file = path.join(pendingDir, name);
  return waitFor(() => {
    try { const d = JSON.parse(fs.readFileSync(file, 'utf8')); return d.message_id ? d : null; } catch { return null; }
  });
};
const answer = (id, payload) => fs.writeFileSync(path.join(pendingDir, `${id}.answer.json`), JSON.stringify(payload));
const calls = (method) => received.filter((r) => r.url.endsWith(`/${method}`));

test('a question goes out with buttons and the button answer comes back', async () => {
  const { done } = start(['--title', 'Gate A atau B?', '--options', 'A=rollback dulu;B=lanjut']);
  const pending = await readPending();
  assert.strictEqual(pending.message_id, 321);
  assert.deepStrictEqual(pending.options, [{ key: 'A', label: 'rollback dulu' }, { key: 'B', label: 'lanjut' }]);
  const sent = calls('sendMessage')[0];
  assert.strictEqual(received[0].url, '/bot123456:FAKE-token_abc/sendMessage');
  assert.strictEqual(sent.body.chat_id, '999');
  assert.match(sent.body.text, /Gate A atau B\?/);
  assert.match(sent.body.text, /balas pesan ini/);
  const buttons = sent.body.reply_markup.inline_keyboard.flat();
  assert.deepStrictEqual(buttons.map((b) => b.callback_data), [`sven:${pending.id}:0`, `sven:${pending.id}:1`]);
  assert(buttons.every((b) => Buffer.byteLength(b.callback_data) <= 64));
  answer(pending.id, { kind: 'button', key: 'B', answer: 'lanjut' });
  const r = await done;
  assert.strictEqual(r.code, 0);
  assert.deepStrictEqual(JSON.parse(r.out), { id: pending.id, kind: 'button', key: 'B', answer: 'lanjut' });
  assert.deepStrictEqual(fs.readdirSync(pendingDir), []);
});

// On Windows a rename over a file another process has open fails with EPERM. The daemon (and the
// test's own polling) reads the pending record while the hook rewrites it with the message id.
test('a reader holding the pending record open does not make the question fail', async () => {
  sendDelayMs = 200;
  const { done } = start(['--title', 'Dibaca daemon', '--options', 'A=ya;B=tidak']);
  const name = await waitFor(pendingFile);
  const fd = fs.openSync(path.join(pendingDir, name), 'r');
  const release = sleep(350).then(() => fs.closeSync(fd));
  const pending = await readPending();
  await release;
  assert.strictEqual(pending.message_id, 321);
  answer(pending.id, { kind: 'button', key: 'A', answer: 'ya' });
  assert.deepStrictEqual(JSON.parse((await done).out), { id: pending.id, kind: 'button', key: 'A', answer: 'ya' });
});

test('a text answer comes back and the buttons are taken off the message', async () => {
  const { done } = start(['--title', 'Apa rencananya?', '--options', 'A=satu;B=dua']);
  const pending = await readPending();
  answer(pending.id, { kind: 'text', answer: 'pakai C saja' });
  const r = await done;
  assert.deepStrictEqual(JSON.parse(r.out), { id: pending.id, kind: 'text', answer: 'pakai C saja' });
  const edit = calls('editMessageReplyMarkup')[0];
  assert.strictEqual(edit.body.message_id, 321);
  assert.deepStrictEqual(edit.body.reply_markup, { inline_keyboard: [] });
});

test('a question with no option is sent without buttons and takes a text answer', async () => {
  const { done } = start(['--title', 'Ceritakan rencananya']);
  const pending = await readPending();
  assert.strictEqual(calls('sendMessage')[0].body.reply_markup, undefined);
  answer(pending.id, { kind: 'text', answer: 'ini rencananya' });
  assert.strictEqual(JSON.parse((await done).out).answer, 'ini rencananya');
});

test('no answer in time gives a timeout, takes the buttons off and cleans up', async () => {
  const { done } = start(['--title', 'Tak dijawab', '--options', 'A=ya;B=tidak', '--timeout', '1']);
  const r = await done;
  assert.strictEqual(r.code, 0);
  const out = JSON.parse(r.out);
  assert.strictEqual(out.kind, 'timeout');
  assert.match(out.id, /^[0-9a-f]{12}$/);
  assert.strictEqual(calls('editMessageReplyMarkup').length, 1);
  assert.deepStrictEqual(fs.readdirSync(pendingDir), []);
});

test('at most six options become buttons', async () => {
  const opts = 'A=1;B=2;C=3;D=4;E=5;F=6;G=7;H=8';
  const { done } = start(['--title', 'Banyak', '--options', opts, '--timeout', '1']);
  await done;
  assert.strictEqual(calls('sendMessage')[0].body.reply_markup.inline_keyboard.flat().length, 6);
});

test('no daemon marker means unavailable and nothing is sent', async () => {
  fs.rmSync(path.join(coreDir, 'daemon.marker'));
  const r = await start(['--title', 'x', '--options', 'A=1']).done;
  assert.strictEqual(r.code, 0);
  assert.strictEqual(JSON.parse(r.out).kind, 'unavailable');
  assert.strictEqual(received.length, 0);
  assert(!pendingFile());
});

test('a marker of a dead process means unavailable', async () => {
  const dead = spawn('node', ['-e', '']);
  await new Promise((r) => dead.on('exit', r));
  fs.writeFileSync(path.join(coreDir, 'daemon.marker'), String(dead.pid));
  const r = await start(['--title', 'x', '--options', 'A=1']).done;
  assert.strictEqual(JSON.parse(r.out).kind, 'unavailable');
  assert.strictEqual(received.length, 0);
});

test('a daemon that dies while waiting ends the wait as unavailable', async () => {
  const daemon = spawn('node', ['-e', 'setInterval(()=>{},1000)']);
  keepAlive.push(daemon);
  fs.writeFileSync(path.join(coreDir, 'daemon.marker'), String(daemon.pid));
  const { done } = start(['--title', 'x', '--options', 'A=1', '--timeout', '30']);
  await readPending();
  daemon.kill();
  const r = await done;
  assert.strictEqual(JSON.parse(r.out).kind, 'unavailable');
  assert(r.ms < 10000, `took ${r.ms}ms`);
  assert.deepStrictEqual(fs.readdirSync(pendingDir), []);
});

test('SVEN_TELEGRAM=off means unavailable and nothing is sent', async () => {
  const r = await start(['--title', 'x', '--options', 'A=1'], { SVEN_TELEGRAM: 'off' }).done;
  assert.strictEqual(JSON.parse(r.out).kind, 'unavailable');
  assert.strictEqual(received.length, 0);
});

test('an unreachable API is unavailable, exits 0 in time and leaves no file', async () => {
  const r = await start(['--title', 'x', '--options', 'A=1'], { SVEN_TELEGRAM_API: 'http://127.0.0.1:9' }).done;
  assert.strictEqual(r.code, 0);
  assert(r.ms < 7000, `took ${r.ms}ms`);
  assert.strictEqual(JSON.parse(r.out).kind, 'unavailable');
  assert(!pendingFile());
});

test('a missing title is invalid and sends nothing', async () => {
  const r = await start(['--options', 'A=1']).done;
  assert.strictEqual(r.code, 0);
  assert.strictEqual(JSON.parse(r.out).kind, 'invalid');
  assert.strictEqual(received.length, 0);
});

test('the token never reaches stdout', async () => {
  const r = await start(['--title', 'x', '--options', 'A=1'], { SVEN_TELEGRAM_API: 'http://127.0.0.1:9' }).done;
  assert.doesNotMatch(r.out, /FAKE-token/);
});
