// SessionStart hook (matcher "compact"): right after Claude Code resumes a session
// following compaction (auto or manual), point the new session at the right resume
// file. PreCompact's own hookSpecificOutput has no additionalContext field, and no
// tool calls run before compaction -- only SessionStart (which fires after) can
// actually tell the new session what to do.
//
// Prefers specs/RESUME.md when the project already follows the /agents pipeline
// convention (see skills/agents/progress.md: a status table + "Urutan next", never a
// session log); otherwise falls back to a plain RESUME.md at the project root.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function gitRoot(cwd) {
  try {
    return execSync('git rev-parse --show-toplevel', {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function decide(input) {
  const cwd = (input && input.cwd) || process.cwd();
  if (!fs.existsSync(cwd)) return null;
  const root = gitRoot(cwd) || cwd;
  const specResume = path.join(root, 'specs', 'RESUME.md');
  const rootResume = path.join(root, 'RESUME.md');

  const additionalContext = fs.existsSync(specResume)
    ? `Sesi ini baru saja di-compact. Proyek ini punya ${specResume} (konvensi pipeline /agents, lihat skills/agents/progress.md): perbarui file itu saja -- tabel status dan "Urutan next" -- bukan log sesi. Detail yang sedang dikerjakan masuk di bawah langkah yang belum selesai di "Urutan next". JANGAN membuat RESUME.md baru di root. Kalau ada subagent persona yang masih berjalan, tunggu sampai selesai dulu sebelum menulis, supaya tidak saling menimpa.`
    : `Sesi ini baru saja di-compact. Tulis atau perbarui ${rootResume} dari ringkasan compaction (bagian "## Resume" kalau ada): task aktif, keputusan penting beserta alasannya, progres, dan langkah selanjutnya yang konkret -- supaya sesi ini bisa lanjut tanpa kehilangan konteks penting.`;

  return { hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext } };
}

let raw = '';
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let out = null;
  try { out = decide(JSON.parse(raw)); } catch { /* fail open */ }
  if (out) process.stdout.write(JSON.stringify(out));
});
