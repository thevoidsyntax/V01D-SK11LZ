// handover.js - Claude Code hook (Stop / SessionStart / UserPromptSubmit).
//
// Stop             writes a snapshot of the working state: repo + branch + git
//                  status, the last phase of specs/HANDOFF.md, the "first
//                  steps" of specs/RESUME.md, the last test run, the size of
//                  the context. The file is rewritten every turn, so it is
//                  never stale: a session that dies on an API error leaves
//                  the next session a ready-made starting point.
// SessionStart     prints that snapshot, so a new session is oriented before
//                  the first word is typed.
// UserPromptSubmit prints one warning line when the context passed the size
//                  where the provider starts failing.
//
// Why the size matters: measured over ~30.000 requests on this machine, the
// 400 "Model provider temporarily unavailable" hit 0.24% of all requests, but
// 0.59% of the requests whose context was over 150k tokens against 0.06% of
// the smaller ones. The risk is ten times higher, and it is the size of the
// context that raises it - not the number of tokens a reply produces.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const CONTEXT_WARN = Number(process.env.HANDOVER_CONTEXT_WARN || 150000);

function readStdin() {
  // Read the pipe asynchronously: a synchronous read of fd 0 throws on a
  // non-blocking pipe on Windows.
  return new Promise((resolve) => {
    let raw = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { raw += c; });
    process.stdin.on('end', () => { try { resolve(JSON.parse(raw) || {}); } catch { resolve({}); } });
    process.stdin.on('error', () => resolve({}));
  });
}

function git(dir, ...a) {
  try {
    return execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch { return ''; }
}

// The context of the last request: what the provider had to read.
function contextOf(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return { tokens: 0, output: 0 };
  let lines;
  try { lines = fs.readFileSync(transcriptPath, 'utf8').split('\n'); } catch { return { tokens: 0, output: 0 }; }
  let tokens = 0, output = 0;
  for (const line of lines) {
    const t = line.trim();
    if (!t || t[0] !== '{') continue;
    let e; try { e = JSON.parse(t); } catch { continue; }
    if (e.type !== 'assistant') continue;
    const u = e.message && e.message.usage;
    if (!u) continue;
    tokens = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
    output = u.output_tokens || 0;
  }
  return { tokens, output };
}

// The Pester results seen in this session. The last run can be a probe in a
// mutant copy, so the best run of the session is reported next to it.
function lastTestRun(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;
  let text;
  try { text = fs.readFileSync(transcriptPath, 'utf8'); } catch { return null; }
  const runs = [];
  for (const m of text.matchAll(/PASSED=(\d+)\s+FAILED=(\d+)/g)) {
    runs.push({ passed: Number(m[1]), failed: Number(m[2]) });
  }
  for (const m of text.matchAll(/(\d+) passed \/ (\d+) failed/g)) {
    runs.push({ passed: Number(m[1]), failed: Number(m[2]) });
  }
  // Vitest summary: "Tests  1167 passed (1167)" or "Tests  1 failed | 722 passed (723)".
  for (const m of text.matchAll(/Tests\s+(?:(\d+) failed \| )?(\d+) passed/g)) {
    runs.push({ passed: Number(m[2]), failed: Number(m[1] ?? 0) });
  }
  if (!runs.length) return null;
  const last = runs[runs.length - 1];
  const best = runs.reduce((a, b) => (b.passed > a.passed ? b : a));
  return { last, best };
}

function lastPhase(handoff) {
  if (!handoff) return { phase: '', next: '' };
  // Headings are "## [PHASE 34] Hexa ..." (bracketed) or the older "## PHASE 7 ...".
  const m = handoff.match(/^## \[?PHASE [\w\-]+\]? .*$/gm);
  const phase = m ? m[m.length - 1].replace(/^## \[?(PHASE [\w\-]+)\]?/, '$1').trim() : '';
  const tail = handoff.slice(Math.max(0, handoff.length - 4000));
  // "Next:" or the bold "**Next:**" form.
  const n = [...tail.matchAll(/^\**Next:\**\s*(.+)$/gm)];
  return { phase, next: n.length ? n[n.length - 1][1].trim() : '' };
}

function firstSteps(resume) {
  if (!resume) return '';
  const i = resume.lastIndexOf('Langkah pertama di sesi baru');
  if (i < 0) return '';
  const block = resume.slice(i, i + 2500);
  const stop = block.search(/\n\n/);
  return (stop > 0 ? block.slice(0, stop) : block).trim();
}

function readIf(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return null; }
}

function snapshot(cwd, transcriptPath) {
  const top = git(cwd, 'rev-parse', '--show-toplevel') || cwd;
  const specs = path.join(top, 'specs');
  const hasSpecs = fs.existsSync(specs);
  const handoff = readIf(path.join(top, 'specs', 'HANDOFF.md')) || readIf(path.join(top, 'HANDOFF.md'));
  const resume = readIf(path.join(top, 'specs', 'RESUME.md')) || readIf(path.join(top, 'RESUME.md'));
  const ctx = contextOf(transcriptPath);
  const test = lastTestRun(transcriptPath);
  const phase = lastPhase(handoff);
  const status = git(top, 'status', '--porcelain');
  const stat = git(top, 'diff', '--stat');
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

  const lines = [
    '# State (otomatis - ditulis oleh hook handover.js)',
    '',
    `- Waktu: ${now}`,
    `- Repo: ${top}`,
    `- Branch: ${git(top, 'rev-parse', '--abbrev-ref', 'HEAD') || '-'}`,
    `- Commit terakhir: ${(git(top, 'log', '-1', '--format=%h %s') || '-').slice(0, 120)}`,
    `- Context terakhir: ${ctx.tokens} token (output respons terakhir ${ctx.output})`,
    test ? `- Test terakhir: ${test.last.passed} passed / ${test.last.failed} failed` : '- Test terakhir: tidak diketahui',
    test && test.best.passed !== test.last.passed
      ? `- Test terbaik di sesi ini: ${test.best.passed} passed / ${test.best.failed} failed (run terakhir bisa dari salinan mutan)`
      : null,
    phase.phase ? `- Fase terakhir: ${phase.phase}` : '- Fase terakhir: -',
    phase.next ? `- Next (HANDOFF): ${phase.next}` : '- Next (HANDOFF): -',
    '',
    '## Git status',
    '',
    status ? '```\n' + status + '\n```' : '(bersih)',
    '',
    '## Diff --stat',
    '',
    stat ? '```\n' + stat + '\n```' : '(tidak ada perubahan)',
    '',
  ];
  const steps = firstSteps(resume);
  if (steps) {
    lines.push('## Langkah pertama di sesi baru (dari RESUME.md)', '', '```', steps, '```', '');
  }
  const body = lines.filter((l) => l !== null).join('\n');

  const target = hasSpecs
    ? path.join(specs, '.state.md')
    : path.join(os.homedir(), '.claude', 'state', path.basename(top) + '.md');
  try {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, body, 'utf8');
  } catch { /* the snapshot is a convenience, never a blocker */ }
  return { body, target, ctx };
}

const input = readStdin().then((payload) => {
  const event = payload.hook_event_name || '';
  const cwd = payload.cwd || process.cwd();

  if (event === 'Stop') {
    snapshot(cwd, payload.transcript_path);
    return;
  }

  if (event === 'SessionStart') {
    const top = git(cwd, 'rev-parse', '--show-toplevel') || cwd;
    const candidates = [
      path.join(top, 'specs', '.state.md'),
      path.join(os.homedir(), '.claude', 'state', path.basename(top) + '.md'),
    ];
    const state = candidates.map(readIf).find(Boolean);
    if (!state) {
      process.stdout.write('Handover: belum ada snapshot (sesi pertama di repo ini).\n');
      return;
    }
    process.stdout.write([
      '===== HANDOVER (dari sesi sebelumnya) =====',
      state.trim(),
      '===========================================',
      '',
      'Kalau working tree punya perubahan yang belum di-commit, itu state sebenarnya dari',
      'sesi sebelumnya: jangan mulai ulang dari nol - baca dulu, lalu lanjut dari sana.',
      '',
    ].join('\n'));
    return;
  }

  if (event === 'UserPromptSubmit') {
    const ctx = contextOf(payload.transcript_path);
    if (ctx.tokens > CONTEXT_WARN) {
      process.stdout.write([
        `Catatan ukuran: context ${ctx.tokens} token (ambang ${CONTEXT_WARN}).`,
        'Risiko error 400 pada ukuran ini sekitar 10 kali lebih tinggi.',
        'Tulis handover (/handover), lalu lanjut di sesi baru -',
        'working tree adalah state sebenarnya, bukan percakapan ini.',
        '',
      ].join('\n'));
    }
  }
});

input.catch((e) => { try { process.stderr.write('handover hook: ' + (e && e.stack ? e.stack : e) + '\n'); } catch {} });
