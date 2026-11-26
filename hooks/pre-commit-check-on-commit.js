// PreToolUse (Bash|PowerShell): before `git commit` in a repo that has pre-commit-check/SKILL.md,
// run that skill's bash block from the repo root and deny the commit when it prints findings.
// The block in SKILL.md stays the single copy of the checks. Fails open: no bash, a timeout,
// or a SKILL.md without a block lets the commit through. PRECOMMIT_CHECK=off disables the hook.
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const arg = String.raw`(?:"[^"]*"|'[^']*'|\S+)`;
const globalOpt = String.raw`(?:\s+(?:-C|-c|--git-dir|--work-tree)(?:\s+|=)${arg}|\s+--?[\w-]+(?:=${arg})?)`;
const commitRe = new RegExp(String.raw`(?:^|[\s;&|(])git(?:\.exe)?${globalOpt}*\s+commit\b`, 'i');

const unquote = (s) => s.replace(/^["']|["']$/g, '');

// On Windows a bare `bash` can be the WSL launcher; prefer Git Bash.
function bashPath() {
  const candidates = [process.env.CLAUDE_CODE_GIT_BASH_PATH, 'C:\\Program Files\\Git\\bin\\bash.exe'];
  return candidates.find((p) => p && fs.existsSync(p)) || 'bash';
}

let raw = '';
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw); } catch { return; }
  const cmd = input.tool_input?.command ?? '';
  if (!commitRe.test(cmd)) return;
  if (process.env.PRECOMMIT_CHECK === 'off' || /\bPRECOMMIT_CHECK\s*=\s*['"]?off\b/.test(cmd)) return;

  // Repo dir: `git -C <dir>` wins, then a leading `cd <dir> &&`, then the session cwd.
  const cIdx = cmd.match(new RegExp(String.raw`\bgit(?:\.exe)?\s+-C\s+(${arg})`));
  const cdIdx = cmd.match(new RegExp(String.raw`(?:^|[;&|]\s*)(?:cd|Set-Location|pushd)\s+(${arg})\s*(?:&&|;)`, 'i'));
  const base = input.cwd || process.cwd();
  const dir = cIdx ? path.resolve(base, unquote(cIdx[1])) : path.resolve(base, cdIdx ? unquote(cdIdx[1]) : '.');

  let top, block;
  try {
    top = execFileSync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const skill = fs.readFileSync(path.join(top, 'pre-commit-check', 'SKILL.md'), 'utf8');
    block = skill.match(/^```bash\r?\n([\s\S]*?)\r?\n```\s*$/m)?.[1];
  } catch { return; }
  if (!block) return;

  const r = spawnSync(bashPath(), ['-c', block], { cwd: top, encoding: 'utf8', timeout: 30000 });
  if (r.error || r.status === null) return;

  const findings = (r.stdout || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !/^warning:/i.test(l));
  if (findings.length === 0) return;

  const shown = findings.slice(0, 10).join('\n');
  const more = findings.length > 10 ? `\n... and ${findings.length - 10} more` : '';
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      // deny, not ask: in auto mode a hook "ask" is settled by the classifier, not the user.
      permissionDecision: 'deny',
      permissionDecisionReason: `pre-commit-check found ${findings.length} problem(s). Fix them, or set PRECOMMIT_CHECK=off if the user agrees to commit anyway:\n${shown}${more}`,
    },
  }));
});
