// PreToolUse (Bash|PowerShell): before `git commit` in a repo that has a CHANGELOG.md,
// ask for approval when the commit changes things but leaves CHANGELOG.md out.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const arg = String.raw`(?:"[^"]*"|'[^']*'|\S+)`;
const globalOpt = String.raw`(?:\s+(?:-C|-c|--git-dir|--work-tree)(?:\s+|=)${arg}|\s+--?[\w-]+(?:=${arg})?)`;
const commitRe = new RegExp(String.raw`(?:^|[\s;&|(])git(?:\.exe)?${globalOpt}*\s+commit\b`, 'i');

const git = (dir, ...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const unquote = (s) => s.replace(/^["']|["']$/g, '');

// Conventional Commit subject from -m "..." or the first line of a -F - heredoc.
function commitSubject(cmd) {
  const m = cmd.match(/\s-m\s+(["'])([\s\S]*?)\1/) || cmd.match(/<<-?\s*'?(\w+)'?\n([^\n]*)/);
  return m ? m[2].split('\n')[0].trim() : '';
}

function changedFiles(dir, cmd) {
  const staged = git(dir, 'diff', '--cached', '--name-only').split('\n').filter(Boolean);
  const addsInSameCommand = /\bgit\b[^;&|]*\sadd\b/.test(cmd) || /\scommit\b[^;&|]*\s(-a\b|-am\b|--all\b)/.test(cmd);
  if (!addsInSameCommand) return staged;
  // No trim(): it would eat the status column of the first line.
  const status = execFileSync('git', ['-C', dir, 'status', '--porcelain'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split('\n').filter(Boolean)
    .map((l) => l.slice(3).split(' -> ').pop().replace(/^"|"$/g, ''));
  return [...new Set([...staged, ...status])];
}

// Deploy-facing files: a change here always needs its CHANGELOG entry.
const DEPLOYING = /(^|\/)(Dockerfile[^/]*|docker-compose[^/]*\.ya?ml|compose\.ya?ml)$|(^|\/)migrations\//i;
const NON_CODE_TYPES = ['docs', 'test', 'chore', 'ci'];
const SKIP_RE = /\bSKIP_CHANGELOG\s*=\s*['"]?1/;

// Decide whether these files, under this commit subject, need a CHANGELOG entry.
// files: repo-relative paths with forward slashes, e.g. ["src/app.js", "README.md"].
// subject: e.g. "fix(auth): reject expired tokens", or "" when unknown.
function needsChangelog(files, subject) {
  if (!subject) return true;
  // Deploy-facing files are always recorded, whatever the commit type.
  if (files.some((f) => DEPLOYING.test(f))) return true;
  const m = subject.match(/^(\w+)(\([^)]*\))?(!)?:/);
  if (!m || m[3]) return true;
  return !NON_CODE_TYPES.includes(m[1]);
}

// The escape hatch the user agrees to by writing SKIP_CHANGELOG=1 covers commits that
// change no deploy-facing file and carry a non-code type. It never covers a feat, fix or
// breaking commit, and never a Dockerfile, compose file or migration.
function skipHonored(subject, files) {
  const m = subject.match(/^(\w+)(\([^)]*\))?(!)?:/);
  if (!m || m[3]) return false;
  if (!NON_CODE_TYPES.includes(m[1])) return false;
  return !files.some((f) => DEPLOYING.test(f));
}

let raw = '';
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw); } catch { return; }
  const cmd = input.tool_input?.command ?? '';
  if (!commitRe.test(cmd)) return;

  // Repo dir: `git -C <dir>` wins, then a leading `cd <dir> &&`, then the session cwd.
  const cIdx = cmd.match(new RegExp(String.raw`\bgit(?:\.exe)?\s+-C\s+(${arg})`));
  const cdIdx = cmd.match(new RegExp(String.raw`(?:^|[;&|]\s*)(?:cd|Set-Location|pushd)\s+(${arg})\s*(?:&&|;)`, 'i'));
  const base = input.cwd || process.cwd();
  const dir = cIdx ? path.resolve(base, unquote(cIdx[1])) : path.resolve(base, cdIdx ? unquote(cdIdx[1]) : '.');
  let top, files;
  try {
    top = git(dir, 'rev-parse', '--show-toplevel');
    if (!fs.existsSync(path.join(top, 'CHANGELOG.md'))) return;
    files = changedFiles(dir, cmd);
  } catch { return; }
  if (files.length === 0 || files.includes('CHANGELOG.md')) return;
  const subject = commitSubject(cmd);
  if (SKIP_RE.test(cmd) && skipHonored(subject, files)) return;
  if (!needsChangelog(files, subject)) return;

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      // deny, not ask: in auto mode a hook "ask" is settled by the classifier, not the user.
      permissionDecision: 'deny',
      permissionDecisionReason: `CHANGELOG.md is not part of this commit (${files.length} file(s) changed). Add an [Unreleased] entry and stage CHANGELOG.md. If the user agrees to commit without one, SKIP_CHANGELOG=1 is accepted only for docs/test/chore/ci commits that touch no Dockerfile, compose file or migration.`,
    },
  }));
});
