// UserPromptSubmit: when the prompt cache has expired on a large session, or the model was
// switched since the last reply (the cache is per model), block the first prompt once and
// show the rewrite cost, so the user can start a new session instead.
// While the cache is warm, show a non-blocking note each time the context passes another
// 200K. Built-in idle compaction only covers the terminal; this also covers VS Code.
const fs = require('fs');
const os = require('os');
const path = require('path');

const MARKER_DIR = process.env.CACHE_GUARD_DIR || path.join(os.homedir(), '.claude', 'hooks', 'cache-guard.d');
const MARKER_MAX_AGE_MS = 7 * 24 * 3_600_000;
// 3x what a new session costs to start with this setup (~50K since the 2026-10-20 plugin
// cleanup). Not measured per session: old sessions started bigger and would raise it.
const CTX_THRESHOLD = 150_000;
const NUDGE_STEP = 200_000;
// $/M fitted from real runs: Sonnet 5.5 write $4.00, read $0.10; Opus 5.5 write about $8.
// Opus read is not measured; assume the same 2x ratio.
const writePrice = (model) => (/opus/i.test(model) ? 8 : 4);
const readPrice = (model) => (/opus/i.test(model) ? 0.2 : 0.1);

const parse = (line) => { try { return JSON.parse(line); } catch { return null; } };
const ctxOf = (u) => (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
const isCompact = (o) => (o.type === 'system' && /compact/i.test(o.subtype || '')) || o.isCompactSummary === true;

// Main-thread replies that actually reached the API; API errors are logged as <synthetic>.
function usable(o) {
  return o.type === 'assistant' && !o.isSidechain && !o.isApiErrorMessage
    && o.message?.model !== '<synthetic>' && o.message?.usage;
}

// Some providers write to the cache without the 1h/5m breakdown; then assume the 5 min
// TTL used over plan limits rather than guessing the longer one.
function ttlOf(u) {
  const c = u.cache_creation || {};
  if (c.ephemeral_1h_input_tokens > 0) return { ttl: 60 };
  if (c.ephemeral_5m_input_tokens > 0) return { ttl: 5 };
  return { ttl: 5, assumed: true };
}

// Model in use, from a `/model` run or the model attachment written when a session resumes.
function modelSignal(o) {
  const text = o.type === 'user' && typeof o.message?.content === 'string' ? o.message.content : '';
  const m = text.match(/^<local-command-stdout>Set model to `([^`]+)`/);
  if (m) return m[1];
  if (o.type === 'attachment' && o.attachment?.type === 'model') return o.attachment.identity?.modelId ?? null;
  return null;
}

// `claude-opus-5-5[1m]` is the same model as `claude-opus-5-5`.
const baseModel = (id) => id.split('[')[0];

function readRange(fd, start, end) {
  const buf = Buffer.alloc(end - start);
  const n = fs.readSync(fd, buf, 0, buf.length, start);
  return buf.toString('utf8', 0, n);
}

// Newest usable reply, the model selected after it, and the TTL set by the newest cache
// write. Grows the window from the end of the file until all are found. Returns null when
// the context was compacted since.
function scanTail(fd, size) {
  for (let len = 1 << 20; ; len *= 4) {
    const start = Math.max(0, size - len);
    const lines = readRange(fd, start, size).split('\n');
    if (start > 0) lines.shift();
    let last = null;
    let current = null;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (!/"assistant"|compact|Set model to|"type":"model"/i.test(lines[i])) continue;
      const o = parse(lines[i]);
      if (!o) continue;
      if (!last && isCompact(o)) return null;
      if (!last) current ??= modelSignal(o);
      if (!usable(o)) continue;
      const u = o.message.usage;
      last ??= { uuid: o.uuid, timestamp: o.timestamp, ctx: ctxOf(u), model: o.message.model, current };
      if (u.cache_creation_input_tokens > 0) return { ...last, ...ttlOf(u) };
    }
    if (start === 0) return last && { ...last, ttl: 5, assumed: true };
  }
}

function pruneMarkers() {
  try {
    const now = Date.now();
    for (const name of fs.readdirSync(MARKER_DIR)) {
      const p = path.join(MARKER_DIR, name);
      if (now - fs.statSync(p).mtimeMs > MARKER_MAX_AGE_MS) fs.unlinkSync(p);
    }
  } catch {}
}

function readMarker(name) {
  try { return fs.readFileSync(path.join(MARKER_DIR, name), 'utf8'); } catch { return null; }
}

function writeMarker(name, value) {
  pruneMarkers();
  fs.mkdirSync(MARKER_DIR, { recursive: true });
  fs.writeFileSync(path.join(MARKER_DIR, name), value);
}

function idleText(min) {
  if (min < 120) return `${Math.round(min)} menit`;
  if (min < 2880) return `${Math.round(min / 60)} jam`;
  return `${Math.round(min / 1440)} hari`;
}

function decide(input) {
  const { session_id: sid, transcript_path: file, prompt = '' } = input;
  if (!/^[\w-]+$/.test(sid || '') || !file) return null;
  if (/^\/(clear|exit)\b/.test(prompt.trim())) return null;

  let last;
  const fd = fs.openSync(file, 'r');
  try {
    last = scanTail(fd, fs.fstatSync(fd).size);
  } finally {
    fs.closeSync(fd);
  }
  if (!last) return null;

  // Recorded on every path, so the resend after a cold block does not also get a nudge,
  // and a context that shrank (compaction) nudges again when it grows back.
  const level = Math.floor(last.ctx / NUDGE_STEP);
  const prevLevel = Number(readMarker(`${sid}.size`)) || 0;
  if (level !== prevLevel) writeMarker(`${sid}.size`, String(level));

  const model = baseModel(last.current ?? last.model);
  const switched = model !== baseModel(last.model);
  // A missing timestamp gives NaN, which counts as warm.
  const idleMin = (Date.now() - Date.parse(last.timestamp)) / 60_000;
  if ((switched || idleMin > last.ttl) && last.ctx > CTX_THRESHOLD) {
    const key = last.uuid || last.timestamp;
    if (readMarker(sid) === key) return null;
    writeMarker(sid, key);
    return coldBlock(last, idleMin, model, switched);
  }
  return level > prevLevel ? sizeNudge(last) : null;
}

function sizeNudge(last) {
  const cost = (last.ctx / 1e6) * readPrice(last.model);
  return {
    systemMessage: `Konteks sudah ${Math.round(last.ctx / 1000)}K token. Tiap request membaca ulang semuanya, `
      + `perkiraan ~$${cost.toFixed(2)} per request. Pertimbangkan sesi baru + 'lanjut' di titik jeda.`,
  };
}

function coldBlock(last, idleMin, model, switched) {
  const cost = (last.ctx / 1e6) * writePrice(model);
  // Usage without a TTL breakdown came from another provider; on resume through the Anthropic
  // API one such session (f18532f0) counted 422K where the transcript said 253K.
  const size = `${Math.round(last.ctx / 1000)}K token${last.assumed ? ' (tercatat provider lain, aslinya bisa lebih besar)' : ''}`;
  const why = switched
    ? `Model diganti ke ${model} sejak balasan terakhir, jadi cache untuk model ini masih kosong; konteks ${size}. `
    : `Cache prompt sudah dingin: idle ${idleText(idleMin)} (${last.assumed ? 'TTL tidak tercatat, dianggap' : 'TTL'} ${last.ttl} menit), konteks ${size}. `;
  return {
    decision: 'block',
    reason: why
      + `Lanjut di sini berarti seluruh konteks ditulis ulang ke cache, perkiraan ~$${cost.toFixed(2)}. `
      + `Sesi baru + 'lanjut', atau kirim ulang untuk lanjut di sini.`,
  };
}

let raw = '';
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let out = null;
  try { out = decide(JSON.parse(raw)); } catch {}
  if (out) process.stdout.write(JSON.stringify(out));
});
