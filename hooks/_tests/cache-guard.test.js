// Pipe tests for cache-guard.js: run with `node --test "C:/Users/CareTechnologies/.claude/hooks/_tests/*.test.js"`
const { test, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOK = path.join(__dirname, '..', 'cache-guard.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cache-guard-'));
const markers = path.join(tmp, 'markers');
after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const minsAgo = (m) => new Date(Date.now() - m * 60_000).toISOString();
let seq = 0;

function asst({ ago, ctx = 300_000, bucket = '1h', model = 'claude-opus-5-5', sidechain = false, synthetic = false }) {
  // bucket: '1h' | '5m' | 'none' (cache write without a TTL breakdown) | null (pure cache read)
  const created = bucket && !synthetic ? 3_000 : 0;
  return {
    type: 'assistant',
    uuid: `a${++seq}`,
    isSidechain: sidechain,
    timestamp: minsAgo(ago),
    ...(synthetic && { isApiErrorMessage: true }),
    message: {
      model: synthetic ? '<synthetic>' : model,
      usage: {
        input_tokens: synthetic ? 0 : 2,
        cache_read_input_tokens: synthetic ? 0 : ctx - created - 2,
        cache_creation_input_tokens: created,
        cache_creation: {
          ephemeral_1h_input_tokens: bucket === '1h' ? created : 0,
          ephemeral_5m_input_tokens: bucket === '5m' ? created : 0,
        },
      },
    },
  };
}

const base = () => asst({ ago: 300, ctx: 50_000 });

function writeTranscript(entries) {
  const file = path.join(tmp, `t${++seq}.jsonl`);
  fs.writeFileSync(file, entries.map((e) => (typeof e === 'string' ? e : JSON.stringify(e))).join('\n') + '\n');
  return file;
}

function run(input) {
  const r = spawnSync('node', [HOOK], {
    input: typeof input === 'string' ? input : JSON.stringify(input),
    env: { ...process.env, CACHE_GUARD_DIR: markers },
    encoding: 'utf8',
  });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch {}
  return { status: r.status, out: r.stdout, json };
}

const session = () => `s${++seq}`;
const prompt = (file, sid = session(), text = 'lanjut') => ({
  hook_event_name: 'UserPromptSubmit', session_id: sid, transcript_path: file, cwd: tmp, prompt: text,
});
const blocked = (r) => r.json?.decision === 'block';

function assertPass(r) {
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.out.trim(), '', `expected no output, got: ${r.out}`);
}

test('1h cache, idle 10 min, 180K: pass', () => {
  assertPass(run(prompt(writeTranscript([base(), asst({ ago: 10, ctx: 180_000 })]))));
});

test('1h cache, idle 70 min, 300K: block once, resend passes, next cold gap blocks again', () => {
  const sid = session();
  const entries = [base(), asst({ ago: 70 })];
  const file = writeTranscript(entries);
  const first = run(prompt(file, sid));
  assert.ok(blocked(first), first.out);
  assert.match(first.json.reason, /70 menit/);
  assert.match(first.json.reason, /300K/);
  assert.match(first.json.reason, /\$2\.40/);
  assertPass(run(prompt(file, sid)));
  const again = run(prompt(writeTranscript([...entries, asst({ ago: 70 })]), sid));
  assert.ok(blocked(again), again.out);
});

test('5m cache, idle 7 min: block', () => {
  assert.ok(blocked(run(prompt(writeTranscript([base(), asst({ ago: 7, bucket: '5m' })])))));
});

test('5m cache, idle 3 min, 180K: pass', () => {
  assertPass(run(prompt(writeTranscript([base(), asst({ ago: 3, bucket: '5m', ctx: 180_000 })]))));
});

const nudged = (r) => r.status === 0 && !r.json?.decision && /sesi baru/.test(r.json?.systemMessage ?? '');

test('warm 250K: one non-blocking nudge, then quiet at the same size', () => {
  const sid = session();
  const file = writeTranscript([base(), asst({ ago: 2, ctx: 250_000 })]);
  const r = run(prompt(file, sid));
  assert.ok(nudged(r), r.out);
  assert.match(r.json.systemMessage, /250K/);
  assertPass(run(prompt(file, sid)));
});

test('nudge again at each new 200K step, not within a step', () => {
  const sid = session();
  const e1 = [base(), asst({ ago: 2, ctx: 250_000 })];
  assert.ok(nudged(run(prompt(writeTranscript(e1), sid))));
  const e2 = [...e1, asst({ ago: 1, ctx: 450_000 })];
  assert.ok(nudged(run(prompt(writeTranscript(e2), sid))));
  assertPass(run(prompt(writeTranscript([...e2, asst({ ago: 1, ctx: 480_000 })]), sid)));
});

test('after the context shrinks, crossing 200K again nudges again', () => {
  const sid = session();
  const e1 = [base(), asst({ ago: 3, ctx: 450_000 })];
  assert.ok(nudged(run(prompt(writeTranscript(e1), sid))));
  const e2 = [...e1, asst({ ago: 2, ctx: 100_000 })];
  assertPass(run(prompt(writeTranscript(e2), sid)));
  assert.ok(nudged(run(prompt(writeTranscript([...e2, asst({ ago: 1, ctx: 250_000 })]), sid))));
});

test('resend after a cold block does not add a nudge', () => {
  const sid = session();
  const file = writeTranscript([base(), asst({ ago: 70, ctx: 700_000 })]);
  assert.ok(blocked(run(prompt(file, sid))));
  assertPass(run(prompt(file, sid)));
});

const setModel = (id) => ({ type: 'user', timestamp: minsAgo(1), message: { role: 'user', content: `<local-command-stdout>Set model to \`${id}\`</local-command-stdout>` } });
const modelAttachment = (id) => ({ type: 'attachment', timestamp: minsAgo(1), attachment: { type: 'model', identity: { modelId: id } } });

test('/model switch after the last reply blocks a warm session, priced by the new model', () => {
  const r = run(prompt(writeTranscript([base(), asst({ ago: 2 }), setModel('claude-sonnet-5-5')])));
  assert.ok(blocked(r), r.out);
  assert.match(r.json.reason, /Model diganti ke claude-sonnet-5-5/);
  assert.match(r.json.reason, /\$1\.20/);
});

test('model attachment on resume with a different model counts as a switch', () => {
  assert.ok(blocked(run(prompt(writeTranscript([base(), asst({ ago: 2 }), modelAttachment('claude-sonnet-5-5')])))));
});

test('same model, or the [1m] variant of it, is not a switch', () => {
  assert.ok(!blocked(run(prompt(writeTranscript([base(), asst({ ago: 2 }), modelAttachment('claude-opus-5-5')])))));
  assert.ok(!blocked(run(prompt(writeTranscript([base(), asst({ ago: 2 }), setModel('claude-opus-5-5[1m]')])))));
});

test('"Set model to" quoted inside a tool result is not a switch', () => {
  const toolResult = { type: 'user', timestamp: minsAgo(1), message: { role: 'user', content: [{ type: 'tool_result', content: 'Set model to `claude-haiku-5-5`' }] } };
  assert.ok(!blocked(run(prompt(writeTranscript([base(), asst({ ago: 2 }), toolResult])))));
});

test('cold and switched: still one block, priced by the new model', () => {
  const r = run(prompt(writeTranscript([base(), asst({ ago: 70, ctx: 619_000 }), setModel('claude-sonnet-5-5')])));
  assert.ok(blocked(r));
  assert.match(r.json.reason, /\$2\.48/);
});

test('nudge shows the per-request read cost by model', () => {
  const sonnet = run(prompt(writeTranscript([base(), asst({ ago: 2, ctx: 500_000, model: 'claude-sonnet-5-5' })])));
  assert.match(sonnet.json.systemMessage, /~\$0\.05/);
  const opus = run(prompt(writeTranscript([base(), asst({ ago: 2, ctx: 500_000 })])));
  assert.match(opus.json.systemMessage, /~\$0\.10/);
});

test('120K context under the 150K threshold: pass', () => {
  assertPass(run(prompt(writeTranscript([base(), asst({ ago: 70, ctx: 120_000 })]))));
});

test('a large first request in an old session does not raise the threshold', () => {
  assert.ok(blocked(run(prompt(writeTranscript([asst({ ago: 300, ctx: 127_000 }), asst({ ago: 70, ctx: 253_000 })])))));
});

test('synthetic API-error entry is skipped', () => {
  const file = writeTranscript([base(), asst({ ago: 70 }), asst({ ago: 1, synthetic: true })]);
  assert.ok(blocked(run(prompt(file))));
});

test('TTL comes from the newest entry with a non-zero bucket', () => {
  const file = writeTranscript([base(), asst({ ago: 30, bucket: '5m' }), asst({ ago: 7, bucket: null })]);
  assert.ok(blocked(run(prompt(file))));
});

test('no cache write anywhere: TTL assumed 5 min', () => {
  const file = writeTranscript([asst({ ago: 300, ctx: 50_000, bucket: null }), asst({ ago: 7, bucket: null })]);
  const r = run(prompt(file));
  assert.ok(blocked(r));
  assert.match(r.json.reason, /dianggap 5 menit/);
});

test('newest cache write has no TTL breakdown: assumed 5 min, older 1h entry not used', () => {
  const file = writeTranscript([base(), asst({ ago: 20 }), asst({ ago: 7, bucket: 'none' })]);
  const r = run(prompt(file));
  assert.ok(blocked(r));
  assert.match(r.json.reason, /dianggap 5 menit/);
  assert.match(r.json.reason, /bisa lebih besar/);
});

test('measured TTL is not labelled as assumed', () => {
  const r = run(prompt(writeTranscript([base(), asst({ ago: 70 })])));
  assert.match(r.json.reason, /TTL 60 menit\)/);
  assert.doesNotMatch(r.json.reason, /bisa lebih besar/);
});

test('newest sidechain entry is ignored', () => {
  const file = writeTranscript([base(), asst({ ago: 70 }), asst({ ago: 1, sidechain: true })]);
  assert.ok(blocked(run(prompt(file))));
});

test('compact boundary after the last reply: pass', () => {
  const file = writeTranscript([base(), asst({ ago: 70 }), { type: 'system', subtype: 'compact_boundary', timestamp: minsAgo(65) }]);
  assertPass(run(prompt(file)));
});

test('2.5 MB line after the last reply: still found', () => {
  const file = writeTranscript([base(), asst({ ago: 70 }), { type: 'api-request-blob', message: 'x'.repeat(2_500_000) }]);
  assert.ok(blocked(run(prompt(file))));
});

test('fail open: no assistant entries, bad JSON, missing transcript, unsafe session_id', () => {
  assertPass(run(prompt(writeTranscript([{ type: 'user', timestamp: minsAgo(70) }]))));
  assertPass(run('not json'));
  assertPass(run(prompt(path.join(tmp, 'missing.jsonl'))));
  const cold = writeTranscript([base(), asst({ ago: 70 })]);
  assertPass(run(prompt(cold, '../x')));
  assert.ok(!fs.existsSync(path.join(markers, '..', 'x')));
});

test('/clear passes on a cold session', () => {
  assertPass(run(prompt(writeTranscript([base(), asst({ ago: 70 })]), session(), '/clear')));
});

test('markers older than 7 days are removed', () => {
  fs.mkdirSync(markers, { recursive: true });
  const stale = path.join(markers, 'old-session');
  fs.writeFileSync(stale, 'a0');
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 3_600_000);
  fs.utimesSync(stale, eightDaysAgo, eightDaysAgo);
  run(prompt(writeTranscript([base(), asst({ ago: 70 })])));
  assert.ok(!fs.existsSync(stale));
});
