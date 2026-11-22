// Sends a Sven decision to Telegram through the Bot API. Never blocks, never throws: it always
// exits 0 within ~5s, and a failed send is appended to ~/.claude/logs/sven-decisions.log.
//
//   node sven-telegram-notify.js --verdict NEED_USER_DECISION --title "..." --domain "..." \
//        --risk "..." --next "..."
//
// Verdict-only: APPROVED is logged but not sent. The same message is sent at most once per
// DEDUPE_MS. Credentials are read at run time from the official Telegram plugin's state dir
// (.env for TELEGRAM_BOT_TOKEN, access.json for the first allowFrom id); nothing is stored here.
//
// Switches: SVEN_TELEGRAM=off disables. Test overrides: SVEN_TELEGRAM_DIR, SVEN_TELEGRAM_API,
// SVEN_LOG_DIR.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const STATE_DIR = process.env.SVEN_TELEGRAM_DIR || path.join(os.homedir(), '.claude', 'channels', 'telegram');
const LOG_DIR = process.env.SVEN_LOG_DIR || path.join(os.homedir(), '.claude', 'logs');
const API = process.env.SVEN_TELEGRAM_API || 'https://api.telegram.org';
const TIMEOUT_MS = 5000;
const DEDUPE_MS = 5 * 60 * 1000;
const SENT_VERDICTS = new Set(['REJECTED', 'REVISED', 'NEED_USER_DECISION']);
const VERDICTS = new Set(['APPROVED', ...SENT_VERDICTS]);

function log(line) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(path.join(LOG_DIR, 'sven-decisions.log'), `${new Date().toISOString()} ${line}\n`);
  } catch {}
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const m = /^--(verdict|title|domain|risk|next)$/.exec(argv[i]);
    if (m && i + 1 < argv.length) out[m[1]] = String(argv[++i]);
  }
  return out;
}

function readToken() {
  const env = fs.readFileSync(path.join(STATE_DIR, '.env'), 'utf8');
  const m = /^\s*TELEGRAM_BOT_TOKEN\s*=\s*(.+?)\s*$/m.exec(env);
  return m ? m[1].replace(/^["']|["']$/g, '') : '';
}

function readChatId() {
  const access = JSON.parse(fs.readFileSync(path.join(STATE_DIR, 'access.json'), 'utf8'));
  return Array.isArray(access.allowFrom) && access.allowFrom.length ? String(access.allowFrom[0]) : '';
}

// Returns true when an identical message went out within DEDUPE_MS; records this one otherwise.
function seenRecently(key) {
  const file = path.join(LOG_DIR, 'sven-notify-seen.json');
  let seen = {};
  try { seen = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  const now = Date.now();
  for (const k of Object.keys(seen)) if (now - seen[k] > DEDUPE_MS) delete seen[k];
  const dup = key in seen;
  if (!dup) seen[key] = now;
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(seen));
  } catch {}
  return dup;
}

function clip(s, n) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

async function main() {
  if (process.env.SVEN_TELEGRAM === 'off') return;
  const a = parseArgs(process.argv.slice(2));
  const verdict = (a.verdict || '').toUpperCase();
  if (!VERDICTS.has(verdict)) { log(`skip invalid verdict "${a.verdict || ''}"`); return; }

  const text =
    `Sven: ${verdict}\n` +
    `${clip(a.title, 120)}\n` +
    (a.domain ? `Domain: ${clip(a.domain, 60)}\n` : '') +
    (a.risk ? `Risk: ${clip(a.risk, 400)}\n` : '') +
    (a.next ? `Next: ${clip(a.next, 200)}` : '');

  if (!SENT_VERDICTS.has(verdict)) { log(`not sent (${verdict}): ${clip(a.title, 80)}`); return; }
  if (seenRecently(crypto.createHash('sha256').update(text).digest('hex'))) return;

  try {
    const token = readToken();
    const chatId = readChatId();
    if (!token || !chatId) throw new Error('missing bot token or chat id in the Telegram plugin state dir');
    const res = await fetch(`${API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: text.trim() }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Telegram API HTTP ${res.status}`);
  } catch (err) {
    // err.message can carry the request URL on some runtimes; never log the token.
    const msg = String(err && err.message ? err.message : err).replace(/bot[0-9]+:[A-Za-z0-9_-]+/g, 'bot<redacted>');
    log(`send failed (${verdict}) ${clip(a.title, 80)} :: ${msg}`);
  }
}

if (require.main === module) main().catch(() => {}).finally(() => process.exit(0));

module.exports = { parseArgs, clip };
