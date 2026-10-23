// PreToolUse (Bash|PowerShell): every `git push` must reach a human prompt.
// The permissions.ask rules `Bash(git push *)` / `PowerShell(git push *)` force that prompt in
// every mode, auto included, but they match only the command as written. Forms with git global
// options (`git -C <dir> push`) slip past them, and a hook "ask" is settled by the auto-mode
// classifier, not the user. So those forms are denied with a way to rerun as a plain `git push`.
//
// The command text is scanned as shell code, not as prose: quoted strings, here-strings and
// heredoc bodies are read as arguments, so a mention of "git -C ... push" inside a message, an
// echo, or a commit body never trips the rule.
'use strict';

const SEPARATORS = new Set([';', '&', '|', '(', ')', '\n']);
const REDIRECTIONS = new Set(['>', '<']);
const STRUCTURAL = new Set(['{', '}']);
// Wrappers that run another command; the next word is the real command.
const WRAPPERS = new Set(['sudo', 'doas', 'nohup', 'time', 'nice', 'stdbuf', 'command', 'builtin', 'exec', 'xargs', 'env']);
// Shells and eval-like commands whose quoted argument is code, not an argument.
const SHELLS = new Set(['bash', 'sh', 'zsh', 'ksh', 'dash', 'powershell', 'pwsh', 'cmd']);
const EVALS = new Set(['eval']);

function isWordChar(c) { return !/[\s;|&()<>{}]/.test(c); }

// Split shell code into tokens. Quoted strings become one token that keeps its text but is
// marked quoted, so it can be read as an argument and never as a command word.
function scanTokens(code) {
  const toks = [];
  const n = code.length;
  let i = 0;
  const push = (t, extra = {}) => toks.push({ t, sep: false, quoted: false, ...extra });

  while (i < n) {
    const c = code[i];
    if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }
    if (c === '\n') { toks.push({ t: '\n', sep: true, quoted: false }); i++; continue; }
    if (c === '#') { while (i < n && code[i] !== '\n') i++; continue; }

    // PowerShell here-string: @' ... '@ or @" ... "@
    if (c === '@' && (code[i + 1] === "'" || code[i + 1] === '"')) {
      const q = code[i + 1];
      const close = q + '@';
      const end = code.indexOf(close, i + 2);
      const stop = end === -1 ? n : end + 2;
      push(code.slice(i + 2, end === -1 ? n : end), { quoted: true });
      i = stop;
      continue;
    }

    // Heredoc: <<WORD, <<'WORD', <<-WORD. The body is input, not code.
    if (c === '<' && code[i + 1] === '<') {
      let j = i + 2;
      if (code[j] === '<') j++;
      if (code[j] === '-') j++;
      let delim = '';
      if (code[j] === "'" || code[j] === '"') {
        const q = code[j]; j++;
        while (j < n && code[j] !== q) { delim += code[j]; j++; }
        j++;
      } else {
        while (j < n && /[A-Za-z0-9_]/.test(code[j])) { delim += code[j]; j++; }
      }
      i = j;
      if (delim) {
        const re = new RegExp(`^[ \\t]*${delim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[ \\t]*$`, 'm');
        const rest = code.slice(i);
        const m = rest.match(re);
        i = m ? i + m.index + m[0].length : n;
      }
      toks.push({ t: '<<', sep: true, quoted: false });
      continue;
    }

    if (SEPARATORS.has(c) || REDIRECTIONS.has(c) || STRUCTURAL.has(c)) {
      toks.push({ t: c, sep: true, quoted: false });
      i++;
      continue;
    }

    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      const start = i;
      i++;
      let val = '';
      while (i < n) {
        if (code[i] === '\\' && quote !== "'" && i + 1 < n) { val += code[i + 1]; i += 2; continue; }
        if (code[i] === quote) { i++; break; }
        val += code[i]; i++;
      }
      push(val, { quoted: true, raw: code.slice(start, i) });
      continue;
    }

    let j = i;
    while (j < n && isWordChar(code[j])) j++;
    if (j === i) { i++; continue; }
    push(code.slice(i, j));
    i = j;
  }
  return toks;
}

const isAssign = (t) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(t);

// Read the options of a git command and return its subcommand.
function parseGit(toks, idx) {
  let j = idx + 1;
  let hasOptions = false;
  while (j < toks.length) {
    const t = toks[j];
    if (t.sep) break;
    if (t.quoted) return { sub: t.t, hasOptions };      // `git "push"`
    if (t.t.startsWith('-')) {
      hasOptions = true;
      if (/^(-C|-c|--git-dir|--work-tree|--namespace)$/.test(t.t)) j += 2;   // option with a value
      else j += 1;
      continue;
    }
    return { sub: t.t, hasOptions };
  }
  return null;
}

// Every git invocation in the token list, with its subcommand.
function findGitCommands(toks) {
  const found = [];
  let expect = true;
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.sep) {
      if (SEPARATORS.has(t.t) || STRUCTURAL.has(t.t)) expect = true;
      continue;
    }
    if (!expect) continue;
    if (t.quoted) continue;
    if (isAssign(t.t)) continue;                  // env assignment: the command still follows
    if (t.t.startsWith('-')) continue;             // option of a wrapper command

    const name = t.t.toLowerCase().replace(/\.exe$/, '');
    if (WRAPPERS.has(name)) continue;
    expect = false;
    if (name === 'git') found.push({ index: i, ...(parseGit(toks, i) ?? { sub: null, hasOptions: false }) });
  }
  return found;
}

// Code passed to a shell or eval: "bash -c ...", "eval ...", "powershell -Command ...".
function nestedCode(toks) {
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.sep) continue;
    const name = t.t.toLowerCase().replace(/\.exe$/, '');
    if (EVALS.has(name)) {
      const next = toks[i + 1];
      if (next?.quoted) out.push(next.t);
      continue;
    }
    if (!SHELLS.has(name)) continue;
    let j = i + 1;
    while (j < toks.length && !toks[j].sep && toks[j].t.startsWith('-')) {
      const flag = toks[j].t.toLowerCase();
      if (/^(?:-[a-z]*c[a-z]*|--command)$/.test(flag) && toks[j + 1]?.quoted) {
        out.push(toks[j + 1].t);
        j += 2;
        continue;
      }
      j++;
    }
  }
  return out;
}

// Every git command in the text, including inside `bash -c "..."`.
function scanCode(code, depth = 0) {
  if (depth > 3) return [];
  const toks = scanTokens(code);
  const out = findGitCommands(toks);
  for (const inner of nestedCode(toks)) out.push(...scanCode(inner, depth + 1));
  return out;
}

// Push invocations in the command text: [{ hasOptions }]
function findPushes(code) {
  const out = [];
  for (const cmd of scanCode(code)) {
    if (cmd.sub && cmd.sub.toLowerCase() === 'push') out.push({ hasOptions: cmd.hasOptions });
  }
  return out;
}

function main() {
  let raw = '';
  process.stdin.on('data', (c) => { raw += c; });
  process.stdin.on('end', () => {
    let cmd = '';
    try { cmd = JSON.parse(raw).tool_input?.command ?? ''; } catch { return; }
    if (!cmd) return;

    const pushes = findPushes(cmd);
    if (pushes.length === 0) return;

    const hasGlobalOpts = pushes.some((p) => p.hasOptions);
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: hasGlobalOpts ? 'deny' : 'ask',
        permissionDecisionReason: hasGlobalOpts
          ? 'git push with global options (-C, -c, --git-dir) bypasses the push approval rule. Run it as a plain `git push ...` from inside the repository (cd <dir> && git push ...) so the user is asked.'
          : 'git push needs your approval',
      },
    }));
  });
}

if (require.main === module) main();

module.exports = { scanTokens, findGitCommands, findPushes, scanCode };
