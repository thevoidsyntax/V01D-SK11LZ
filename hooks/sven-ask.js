// Asks the owner a question on Telegram and waits for the answer. Prints one JSON line and exits 0.
//
//   node sven-ask.js --title "..." [--options "A=label;B=label"] [--timeout 600]
//
// The question goes out through the h3x4 daemon's bot with inline buttons (`sven:<id>:<n>`). The
// daemon is the only Telegram poller: it writes `<id>.answer.json` into the pending folder when
// the owner taps a button or replies to the message, and this script polls for that file.
//
//   {"id","kind":"button","key","answer"}   a button
//   {"id","kind":"text","answer"}           a reply to the message
//   {"id","kind":"timeout"}                 nobody answered in time
//   {"kind":"unavailable","reason"}         the daemon is not running, the send failed, or it is off
//   {"kind":"invalid","reason"}             no title
//
// On timeout, unavailable or invalid the caller asks in the terminal instead. Credentials come from
// the Telegram plugin's state dir, like sven-telegram-notify.js; the token must be the daemon's.
//
// Switches: SVEN_TELEGRAM=off disables. Test overrides: SVEN_PENDING_DIR, H3X4_CORE_DIR,
// SVEN_TELEGRAM_DIR, SVEN_TELEGRAM_API, SVEN_LOG_DIR, SVEN_ASK_POLL_MS.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { readToken, readChatId, clip, log } = require('./sven-telegram-notify.js');

const PENDING_DIR = process.env.SVEN_PENDING_DIR || path.join(os.homedir(), '.claude', 'hooks', '.sven-pending');
const CORE_DIR = process.env.H3X4_CORE_DIR || path.join(os.homedir(), '.h3x4-core');
const API = process.env.SVEN_TELEGRAM_API || 'https://api.telegram.org';
const POLL_MS = Number(process.env.SVEN_ASK_POLL_MS) || 2000;
const SEND_TIMEOUT_MS = 5000;
const DEFAULT_TIMEOUT_S = 600;
const MAX_TIMEOUT_S = 3600;
const MAX_OPTIONS = 6;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const m = /^--(title|options|timeout)$/.exec(argv[i]);
    if (m && i + 1 < argv.length) out[m[1]] = String(argv[++i]);
  }
  return out;
}

// "A=rollback;B=lanjut" -> [{key:'A',label:'rollback'}, ...]; entries without "=" are skipped.
function parseOptions(raw) {
  const options = [];
  for (const part of String(raw || '').split(';')) {
    const at = part.indexOf('=');
    if (at < 1) continue;
    const key = clip(part.slice(0, at), 8);
    const label = clip(part.slice(at + 1), 40);
    if (key && label) options.push({ key, label });
    if (options.length === MAX_OPTIONS) break;
  }
  return options;
}

function emit(obj) { process.stdout.write(`${JSON.stringify(obj)}\n`); }

// The daemon writes its pid into daemon.marker and removes it on a clean exit.
function daemonAlive() {
  let pid;
  try { pid = parseInt(fs.readFileSync(path.join(CORE_DIR, 'daemon.marker'), 'utf8').trim(), 10); } catch { return false; }
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; } catch (err) { return err.code === 'EPERM'; }
}

async function telegram(method, token, body) {
  const res = await fetch(`${API}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Telegram API HTTP ${res.status}`);
  return res.json();
}

function scrub(err) {
  return String(err && err.message ? err.message : err).replace(/bot[0-9]+:[A-Za-z0-9_-]+/g, 'bot<redacted>');
}

function writePending(file, data) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data));
  fs.renameSync(tmp, file);
}

function cleanup(id) {
  for (const name of [`${id}.json`, `${id}.answer.json`, `${id}.json.tmp`]) {
    try { fs.rmSync(path.join(PENDING_DIR, name), { force: true }); } catch {}
  }
}

async function takeButtonsOff(token, chatId, messageId) {
  if (!messageId) return;
  try {
    await telegram('editMessageReplyMarkup', token, { chat_id: chatId, message_id: messageId, reply_markup: { inline_keyboard: [] } });
  } catch (err) { log(`ask: could not clear buttons :: ${scrub(err)}`); }
}

function readAnswer(id) {
  try { return JSON.parse(fs.readFileSync(path.join(PENDING_DIR, `${id}.answer.json`), 'utf8')); } catch { return null; }
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  const title = clip(a.title, 300);
  if (!title) return emit({ kind: 'invalid', reason: 'no title' });
  if (process.env.SVEN_TELEGRAM === 'off') return emit({ kind: 'unavailable', reason: 'telegram is off' });
  if (!daemonAlive()) return emit({ kind: 'unavailable', reason: 'the h3x4 daemon is not running' });

  const options = parseOptions(a.options);
  const timeoutS = Math.min(Math.max(parseInt(a.timeout, 10) || DEFAULT_TIMEOUT_S, 1), MAX_TIMEOUT_S);
  const id = crypto.randomBytes(6).toString('hex');
  const file = path.join(PENDING_DIR, `${id}.json`);
  const record = { id, title, options, created: new Date().toISOString(), message_id: null };

  let token;
  let chatId;
  let messageId = null;
  try {
    token = readToken();
    chatId = readChatId();
    if (!token || !chatId) throw new Error('missing bot token or chat id in the Telegram plugin state dir');
    fs.mkdirSync(PENDING_DIR, { recursive: true });
    // The record exists before the message does: a tap that beats this script finds the question.
    writePending(file, record);
    const text = ['Sven butuh keputusanmu', title, ...options.map((o) => `${o.key} · ${o.label}`), '', 'Pilih tombol, atau balas pesan ini.'].join('\n');
    const body = { chat_id: chatId, text };
    if (options.length) {
      body.reply_markup = { inline_keyboard: options.map((o, i) => [{ text: `${o.key} · ${o.label}`, callback_data: `sven:${id}:${i}` }]) };
    }
    const sent = await telegram('sendMessage', token, body);
    messageId = sent && sent.result && sent.result.message_id;
    if (!messageId) throw new Error('Telegram gave no message id');
    writePending(file, { ...record, message_id: messageId });
  } catch (err) {
    cleanup(id);
    log(`ask: send failed :: ${scrub(err)}`);
    return emit({ kind: 'unavailable', reason: 'could not send the question' });
  }

  const deadline = Date.now() + timeoutS * 1000;
  while (Date.now() < deadline) {
    const found = readAnswer(id);
    if (found) {
      cleanup(id);
      // A button tap is already shown by the daemon; a text reply leaves the buttons live.
      if (found.kind === 'text') await takeButtonsOff(token, chatId, messageId);
      return emit({ id, ...found });
    }
    if (!daemonAlive()) {
      cleanup(id);
      await takeButtonsOff(token, chatId, messageId);
      return emit({ kind: 'unavailable', reason: 'the h3x4 daemon stopped while waiting' });
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  cleanup(id);
  await takeButtonsOff(token, chatId, messageId);
  return emit({ id, kind: 'timeout' });
}

if (require.main === module) main().catch((err) => { log(`ask: ${scrub(err)}`); emit({ kind: 'unavailable', reason: 'unexpected error' }); }).finally(() => process.exit(0));

module.exports = { parseArgs, parseOptions };
