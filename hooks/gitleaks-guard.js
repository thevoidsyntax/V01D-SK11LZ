// PreToolUse (Bash|PowerShell): before `git commit`, run gitleaks over the staged diff and deny
// the commit if it finds what looks like a secret. Mirrors changelog-on-commit.js's git-command
// and repo-dir detection (same `-C`/`cd`/`Set-Location` resolution) so both hooks agree on which
// repo a chained or `-C`'d commit actually targets.
//
// gitleaks exits 1 specifically when it finds a leak (`--exit-code`, default 1); any other
// non-zero exit is a real error (bad config, not a repo, ...) and is not treated as a finding,
// so a broken gitleaks install fails open instead of blocking every commit.
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const arg = String.raw`(?:"[^"]*"|'[^']*'|\S+)`;
const globalOpt = String.raw`(?:\s+(?:-C|-c|--git-dir|--work-tree)(?:\s+|=)${arg}|\s+--?[\w-]+(?:=${arg})?)`;
const commitRe = new RegExp(String.raw`(?:^|[\s;&|(])git(?:\.exe)?${globalOpt}*\s+commit\b`, 'i');
const unquote = (s) => s.replace(/^["']|["']$/g, '');

// Known install locations tried after a bare `gitleaks` on PATH, for a session whose PATH was
// captured before `winget install` updated it (no shell restart needed for the hook to still work).
const FALLBACK_PATHS = [
  path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages', 'Gitleaks.Gitleaks_Microsoft.Winget.Source_8wekyb3d8bbwe', 'gitleaks.exe'),
];

function findGitleaks() {
  for (const bin of ['gitleaks', ...FALLBACK_PATHS]) {
    try {
      execFileSync(bin, ['version'], { stdio: 'ignore' });
      return bin;
    } catch { /* try the next candidate */ }
  }
  return null;
}

function repoDir(cmd, cwd) {
  const cIdx = cmd.match(new RegExp(String.raw`\bgit(?:\.exe)?\s+-C\s+(${arg})`));
  const cdIdx = cmd.match(new RegExp(String.raw`(?:^|[;&|]\s*)(?:cd|Set-Location|pushd)\s+(${arg})\s*(?:&&|;)`, 'i'));
  const base = cwd || process.cwd();
  return cIdx ? path.resolve(base, unquote(cIdx[1])) : path.resolve(base, cdIdx ? unquote(cdIdx[1]) : '.');
}

let raw = '';
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw); } catch { return; }
  const cmd = input.tool_input?.command ?? '';
  if (!commitRe.test(cmd)) return;

  const dir = repoDir(cmd, input.cwd);
  if (!fs.existsSync(dir)) return;

  const bin = findGitleaks();
  if (!bin) return; // not installed: fail open rather than block every commit on this machine

  try {
    execFileSync(bin, ['protect', '--staged', '--no-banner', '--no-color', '--redact', '-v'], {
      cwd: dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (e) {
    if (e.status !== 1) return; // not a leak finding (bad config, not a repo, gitleaks crashed, ...)
    const report = `${e.stdout || ''}${e.stderr || ''}`.trim().slice(0, 4000);
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `gitleaks found what looks like a secret in the staged changes:\n\n${report}\n\nUnstage or remove it (and rotate it if it is real) before committing. If this is a false positive, add a gitleaks:allow comment on that line or a .gitleaksignore entry, then retry.`,
      },
    }));
  }
});
