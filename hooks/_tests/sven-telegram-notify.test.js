// Pipe tests for sven-telegram-notify.js against a local fake Bot API; nothing leaves the machine.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'sven-telegram-notify.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sven-tg-'));
const stateDir = path.join(tmp, 'telegram');
const coreDir = path.join(tmp, 'core');
const logDir = path.join(tmp, 'logs');
const received = [];
let server;
let api;

before(async () => {
  fs.mkdirSync(stateDir, { recursive: true });
  // The plugin's own token must be ignored: the daemon's bot is the one that receives taps.
  fs.writeFileSync(path.join(stateDir, '.env'), 'TELEGRAM_BOT_TOKEN=111111:PLUGIN-token_abc\n');
  fs.mkdirSync(coreDir, { recursive: true });
  fs.writeFileSync(path.join(coreDir, '.env'), 'OTHER=1\nTELEGRAM_BOT_TOKEN="123456:FAKE-token_abc"\n');
  fs.writeFileSync(path.join(stateDir, 'access.json'), JSON.stringify({ allowFrom: ['999'] }));
  server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      received.push({ url: req.url, body: JSON.parse(body) });
      res.end('{"ok":true}');
    });
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  api = `http://127.0.0.1:${server.address().port}`;
});
after(() => { server.close(); fs.rmSync(tmp, { recursive: true, force: true }); });

function run(args, env = {}) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const p = spawn('node', [HOOK, ...args], {
      env: { ...process.env, SVEN_TELEGRAM_DIR: stateDir, H3X4_CORE_DIR: coreDir, SVEN_LOG_DIR: logDir, SVEN_TELEGRAM_API: api, ...env },
      stdio: 'ignore',
    });
    p.on('exit', (code) => resolve({ code, ms: Date.now() - t0 }));
  });
}
const logText = () => { try { return fs.readFileSync(path.join(logDir, 'sven-decisions.log'), 'utf8'); } catch { return ''; } };

test('NEED_USER_DECISION is sent with the daemon token and the plugin chat id',async () => {
  const r = await run(['--verdict', 'NEED_USER_DECISION', '--title', 'Pick a DB', '--risk', 'lock-in']);
  assert.strictEqual(r.code, 0);
  assert.strictEqual(received.length, 1);
  assert.strictEqual(received[0].url, '/bot123456:FAKE-token_abc/sendMessage');
  assert.strictEqual(received[0].body.chat_id, '999');
  assert.match(received[0].body.text, /NEED_USER_DECISION[\s\S]*Pick a DB[\s\S]*lock-in/);
});

test('the same message is not sent twice inside the dedupe window', async () => {
  const before = received.length;
  await run(['--verdict', 'NEED_USER_DECISION', '--title', 'Pick a DB', '--risk', 'lock-in']);
  assert.strictEqual(received.length, before);
});

test('APPROVED is logged but not sent', async () => {
  const before = received.length;
  await run(['--verdict', 'APPROVED', '--title', 'Add index']);
  assert.strictEqual(received.length, before);
  assert.match(logText(), /not sent \(APPROVED\)/);
});

test('invalid verdict is skipped', async () => {
  const before = received.length;
  const r = await run(['--verdict', 'MAYBE', '--title', 'x']);
  assert.strictEqual(r.code, 0);
  assert.strictEqual(received.length, before);
});

test('an unreachable API exits 0 within the timeout and logs without the token', async () => {
  const r = await run(['--verdict', 'REJECTED', '--title', 'Drop prod table'], { SVEN_TELEGRAM_API: 'http://127.0.0.1:9' });
  assert.strictEqual(r.code, 0);
  assert(r.ms < 6500, `took ${r.ms}ms`);
  assert.match(logText(), /send failed \(REJECTED\)/);
  assert(!logText().includes('FAKE-token_abc'));
});

test('SVEN_TELEGRAM=off sends nothing', async () => {
  const before = received.length;
  await run(['--verdict', 'REJECTED', '--title', 'quiet'], { SVEN_TELEGRAM: 'off' });
  assert.strictEqual(received.length, before);
});
