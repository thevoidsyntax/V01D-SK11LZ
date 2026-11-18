// PreToolUse (Bash|PowerShell): flag destructive, hard-to-reverse commands before they run —
// `git reset --hard`, `git clean -f`, a forced `git branch -D`, `git checkout --`/`git restore`
// discarding worktree changes, `gh repo delete`, `rm -rf`, and the PowerShell equivalents of
// `rm -rf` (`Remove-Item`/`ri`/`rd`/`del`/`erase` with -Recurse -Force).
//
// Same split and the same calibration as ask-on-git-push.js: permissions.ask globs in
// settings.json force a real human prompt for the common literal spellings. This hook answers
// 'ask' for everything it recognizes as destructive — including a wrapper (sudo, env, ...), a
// chained command, or code handed to a nested shell/eval, all of which still show the command
// in plain text — and reserves 'deny' for git's own global options (`-C`, `-c`, ...), the one
// form that can silently retarget the whole command to a different directory or config while
// still slipping past a literal glob; those are denied with a way to rerun as a plain command.
'use strict';

const { scanTokens, nestedCode, SEPARATORS, STRUCTURAL, WRAPPERS, isAssign } = require('./ask-on-git-push.js');

// Every top-level command invocation in the token list: { name, args }.
function findInvocations(toks) {
  const out = [];
  let expect = true;
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.sep) { if (SEPARATORS.has(t.t) || STRUCTURAL.has(t.t)) expect = true; continue; }
    if (!expect) continue;
    if (t.quoted) continue;
    if (isAssign(t.t)) continue;
    if (t.t.startsWith('-')) continue;
    const name = t.t.toLowerCase().replace(/\.exe$/, '');
    if (WRAPPERS.has(name)) continue;
    expect = false;
    const args = [];
    let j = i + 1;
    while (j < toks.length && !toks[j].sep) { args.push(toks[j].t); j++; }
    out.push({ name, args });
  }
  return out;
}

// Every invocation in the text, including code handed to a nested shell or eval.
function scanCode(code, depth = 0) {
  if (depth > 3) return [];
  const toks = scanTokens(code);
  const out = findInvocations(toks);
  for (const inner of nestedCode(toks)) out.push(...scanCode(inner, depth + 1));
  return out;
}

// git's own global options take a dir/value and precede the subcommand, e.g. `git -C dir reset`.
function gitSubcommand(args) {
  let i = 0;
  let hasGlobalOpts = false;
  while (i < args.length) {
    const a = args[i];
    if (a.startsWith('-')) {
      hasGlobalOpts = true;
      i += /^(-C|-c|--git-dir|--work-tree|--namespace)$/.test(a) ? 2 : 1;
      continue;
    }
    return { sub: a.toLowerCase(), rest: args.slice(i + 1), hasGlobalOpts };
  }
  return { sub: null, rest: [], hasGlobalOpts };
}

// Flags of a command, split into short-option characters and recognized long options.
function flagSet(args) {
  const chars = new Set();
  const long = new Set();
  for (const a of args) {
    if (a.startsWith('--')) long.add(a.toLowerCase());
    else if (/^-[A-Za-z]+$/.test(a)) for (const ch of a.slice(1)) chars.add(ch);
  }
  return { chars, long };
}

// git reset --hard: always destroys uncommitted + unstaged changes to tracked files.
function isResetHard(rest) { return flagSet(rest).long.has('--hard'); }

// git clean -f/-fd/-fx/--force (any spelling): deletes untracked files for good.
function isCleanForce(rest) {
  const { chars, long } = flagSet(rest);
  return chars.has('f') || long.has('--force');
}

// git branch -D, or -d/--delete together with -f/--force: force-deletes a branch, even unmerged.
function isBranchForceDelete(rest) {
  const { chars, long } = flagSet(rest);
  if (chars.has('D')) return true;
  const wantsDelete = chars.has('d') || long.has('--delete');
  const wantsForce = chars.has('f') || long.has('--force');
  return wantsDelete && wantsForce;
}

// git checkout -- <path>|. or git restore (without --staged only): discards worktree edits.
function isCheckoutDiscard(rest) { return rest.includes('--') || (rest.length === 1 && rest[0] === '.'); }
function isRestoreDiscard(rest) {
  const { chars, long } = flagSet(rest);
  const stagedOnly = chars.has('S') || long.has('--staged');
  const worktree = chars.has('W') || long.has('--worktree');
  return !stagedOnly || worktree;
}

function isGhRepoDelete(args) { return (args[0] || '').toLowerCase() === 'repo' && (args[1] || '').toLowerCase() === 'delete'; }

// rm -rf/-fr/--recursive --force (bash): irreversible, outside any trash.
function isRmForceRecurse(args) {
  const { chars, long } = flagSet(args);
  const force = chars.has('f') || long.has('--force');
  const recurse = chars.has('r') || chars.has('R') || long.has('--recursive');
  return force && recurse;
}

// Remove-Item (and its aliases ri/rd/del/erase/rm on PowerShell) with -Recurse -Force, allowing
// PowerShell's own prefix abbreviation of parameter names.
const PS_REMOVE_NAMES = new Set(['remove-item', 'ri', 'rd', 'del', 'erase', 'rm']);
const PS_RECURSE_RE = /^-(?:r|re|rec|recu|recur|recurs|recurse)$/i;
const PS_FORCE_RE = /^-(?:f|fo|for|forc|force)$/i;
function isPsRemoveForceRecurse(args) {
  return args.some((a) => PS_RECURSE_RE.test(a)) && args.some((a) => PS_FORCE_RE.test(a));
}

// Classify one invocation. Returns a reason string when it is destructive, else null.
// bypass is true only for git's own global options (-C, -c, ...) ahead of the subcommand — the
// one form that can silently retarget the command while still reading as plain text otherwise.
function classify(inv, isPowerShell) {
  const { name, args } = inv;
  if (name === 'git') {
    const { sub, rest, hasGlobalOpts } = gitSubcommand(args);
    if (sub === 'reset' && isResetHard(rest)) return { reason: 'git reset --hard discards uncommitted and unstaged changes with no recovery.', bypass: hasGlobalOpts };
    if (sub === 'clean' && isCleanForce(rest)) return { reason: 'git clean -f permanently deletes untracked files.', bypass: hasGlobalOpts };
    if (sub === 'branch' && isBranchForceDelete(rest)) return { reason: 'git branch -D force-deletes a branch, even one with unmerged commits.', bypass: hasGlobalOpts };
    if (sub === 'checkout' && isCheckoutDiscard(rest)) return { reason: 'git checkout -- discards uncommitted changes to the given paths.', bypass: hasGlobalOpts };
    if (sub === 'restore' && isRestoreDiscard(rest)) return { reason: 'git restore (without --staged only) overwrites worktree files with their committed version.', bypass: hasGlobalOpts };
    return null;
  }
  if (name === 'gh' && isGhRepoDelete(args)) return { reason: 'gh repo delete permanently deletes a GitHub repository.', bypass: false };
  if (!isPowerShell && name === 'rm' && isRmForceRecurse(args)) return { reason: 'rm -rf permanently deletes files with no trash to recover from.', bypass: false };
  if (isPowerShell && PS_REMOVE_NAMES.has(name) && isPsRemoveForceRecurse(args)) return { reason: `${inv.name} -Recurse -Force permanently deletes files with no trash to recover from.`, bypass: false };
  return null;
}

function main() {
  let raw = '';
  process.stdin.on('data', (c) => { raw += c; });
  process.stdin.on('end', () => {
    let input;
    try { input = JSON.parse(raw); } catch { return; }
    const cmd = input.tool_input?.command ?? '';
    if (!cmd) return;
    const isPowerShell = input.tool_name === 'PowerShell';

    const hits = scanCode(cmd).map((inv) => classify(inv, isPowerShell)).filter(Boolean);
    if (hits.length === 0) return;

    const bypass = hits.some((h) => h.bypass);
    const reasons = [...new Set(hits.map((h) => h.reason))].join(' ');
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: bypass ? 'deny' : 'ask',
        permissionDecisionReason: bypass
          ? `${reasons} It also uses git global options (-C, -c, ...) ahead of the subcommand, which can silently retarget it to a different directory or config and slips past the literal approval rule. Rerun it as a plain command from inside the repository so the user is actually asked.`
          : `${reasons} Confirm this is intended before it runs.`,
      },
    }));
  });
}

if (require.main === module) main();

module.exports = { scanCode, classify, isResetHard, isCleanForce, isBranchForceDelete, isCheckoutDiscard, isRestoreDiscard, isGhRepoDelete, isRmForceRecurse, isPsRemoveForceRecurse };
