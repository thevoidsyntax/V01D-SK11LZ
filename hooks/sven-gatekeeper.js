// PreToolUse gatekeeper for the Sven advisory layer.
//
// Two jobs:
//   1. AskUserQuestion - tell the model to answer as Sven with a recommended option, and ping the
//      user on Telegram while the question is on screen.
//   2. Bash|PowerShell|Write|Edit|MultiEdit - deny the irreversible, ask before touching
//      architecture-critical files.
//
// Destructive-command detection is NOT repeated here: destructive-guard.js (ask) plus the
// permissions.ask globs in settings.json already own rm -rf, git reset --hard, git clean -f,
// git branch -D, git checkout --/git restore, gh repo delete and the PowerShell equivalents.
// This hook owns only what those miss.
//
// A deny is lifted for one action only: /sven signs off, the approval lands in
// .sven-approved.json as a SHA-256 over session + tool + target + content, the next identical call
// is allowed, and the token is consumed.
//
// Kill switch: SVEN_ADVISOR=off disables the hook. SVEN_GATEKEEPER=dryrun logs decisions but never
// blocks.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');
const { scanCode } = require('./destructive-guard.js');

const HOOKS_DIR = process.env.SVEN_HOOKS_DIR || path.join(os.homedir(), '.claude', 'hooks');
const LOG_DIR = process.env.SVEN_LOG_DIR || path.join(os.homedir(), '.claude', 'logs');
const TOKEN_FILE = path.join(HOOKS_DIR, '.sven-approved.json');
const NOTIFIER = path.join(HOOKS_DIR, 'sven-telegram-notify.js');
const TOKEN_TTL_MS = 5 * 60 * 1000;

const sha256 = (value) => crypto.createHash('sha256').update(value, 'utf8').digest('hex');

function log(line) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(path.join(LOG_DIR, 'sven-gatekeeper.log'), `${new Date().toISOString()} ${line}\n`);
  } catch {}
}

// --------------------------------------------------------------- irreversible commands

const SQL_DESTRUCTIVE = /\b(drop\s+(table|database|schema)|truncate\s+table)\b/i;

function classifyCommand(inv) {
  const name = inv.name;
  const args = inv.args;
  const a = args.map((x) => String(x).toLowerCase());

  if (['npm', 'pnpm', 'yarn', 'bun'].includes(name) && a[0] === 'publish') {
    return `${name} publish pushes a package to a registry; an unpublish does not undo it`;
  }
  if (name === 'docker' || name === 'docker-compose') {
    let rest = a;
    if (rest[0] === 'compose') rest = rest.slice(1);
    if (rest[0] === 'down' && rest.some((x) => x === '-v' || x === '--volumes')) {
      return 'docker compose down -v deletes the volumes and the data in them';
    }
    if (rest[0] === 'system' && rest[1] === 'prune') {
      return 'docker system prune removes stopped containers and unused images';
    }
    if (rest[0] === 'volume' && rest[1] === 'prune') {
      return 'docker volume prune deletes volumes and the data in them';
    }
  }
  if (name === 'prisma' && a[0] === 'migrate' && a[1] === 'reset') {
    return 'prisma migrate reset drops the database and replays every migration';
  }
  if (name === 'git' && a[0] === 'push') {
    if (a.some((x) => x === '--force' || x === '--force-with-lease' || x === '-f')) {
      return 'a forced push rewrites remote history; the old commits stay only in the reflog';
    }
    if (a.includes('--delete')) {
      return 'deleting a remote branch removes it for everyone';
    }
  }
  if (name === 'vercel' && a.includes('--prod')) {
    return 'vercel --prod deploys to production';
  }
  if (name === 'railway' && a[0] === 'up') {
    return 'railway up deploys to production';
  }
  if (name === 'fly' && a[0] === 'deploy') {
    return 'fly deploy publishes a release to production';
  }
  return null;
}

function irreversibleReasons(command) {
  const reasons = [];
  for (const inv of scanCode(command)) {
    const why = classifyCommand(inv);
    if (why && !reasons.includes(why)) reasons.push(why);
  }
  if (SQL_DESTRUCTIVE.test(command)) {
    reasons.push('a DROP or TRUNCATE statement destroys the table and its rows');
  }
  return reasons;
}

// --------------------------------------------------------------- critical files

function normalizedPath(p) {
  if (!p) return '';
  const abs = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
  const norm = abs.replace(/\\/g, '/');
  return norm.toLowerCase();
}

function criticalFileReason(filePath) {
  const norm = normalizedPath(filePath);
  if (!norm) return null;
  const parts = norm.split('/');
  const base = parts[parts.length - 1];

  if (base === '.env' || (base.startsWith('.env.') && base !== '.env.example')) {
    return 'it holds credentials';
  }
  if (base.startsWith('dockerfile')) return 'it defines the image build';
  if (base.startsWith('docker-compose')) return 'it defines the service topology';
  if (base === 'schema.prisma') return 'it is the database schema';
  if (base === 'claude.md') return 'it is the project instruction file every agent reads';
  const dot = parts.indexOf('.claude');
  if (dot !== -1 && parts[dot + 1] === 'skills') return 'it is a skill file every persona reads, in every project';
  if (parts.includes('migrations')) return 'it changes the database schema history';
  if (parts.includes('auth') || parts.includes('middleware') || base.startsWith('middleware.')) {
    return 'it sits on the authentication or request path';
  }
  if (parts.includes('.claude') && (base === 'settings.json' || base === 'settings.local.json')) {
    return 'it changes what Claude Code is allowed to do';
  }
  return null;
}

// --------------------------------------------------------------- approval token

function readToken() {
  try {
    const raw = fs.readFileSync(TOKEN_FILE, 'utf8');
    const token = JSON.parse(raw);
    const stat = fs.statSync(TOKEN_FILE);
    return { token, mtime: stat.mtimeMs };
  } catch {
    return null;
  }
}

function tokenMatches(token, mtime, actionHash, sessionId) {
  if (!token || typeof token.action_hash !== 'string') return false;
  if (token.action_hash !== actionHash) return false;
  if (token.session_id && sessionId && token.session_id !== sessionId) return false;
  const now = Date.now();
  if (token.expires_at && Number.isFinite(Date.parse(token.expires_at)) && Date.parse(token.expires_at) < now) {
    return false;
  }
  return now - mtime <= TOKEN_TTL_MS;
}

function consumeToken() {
  try {
    fs.unlinkSync(TOKEN_FILE);
  } catch {}
}

// --------------------------------------------------------------- action identity

function actionIdentity(input) {
  const tool = input.tool_name || '';
  const ti = input.tool_input || {};
  const sessionId = input.session_id || '';

  if (tool === 'Bash' || tool === 'PowerShell') {
    const target = String(ti.command || '').replace(/\s+/g, ' ').trim();
    return { tool, target, hash: sha256(`${sessionId}|${tool}|${target}|`) };
  }

  const target = normalizedPath(ti.file_path);
  let content = '';
  if (tool === 'Write') content = String(ti.content || '');
  else if (tool === 'Edit') content = `${ti.old_string || ''}\u0000${ti.new_string || ''}`;
  else if (tool === 'MultiEdit') content = JSON.stringify(ti.edits || []);
  return { tool, target, hash: sha256(`${sessionId}|${tool}|${target}|${sha256(content)}`) };
}

// --------------------------------------------------------------- notifications

function notify(args) {
  if (process.env.SVEN_TELEGRAM === 'off') return;
  if (!fs.existsSync(NOTIFIER)) return;
  try {
    const child = spawn(process.execPath, [NOTIFIER, ...args], { detached: true, stdio: 'ignore', windowsHide: true });
    child.unref();
  } catch {}
}

// --------------------------------------------------------------- output

function emit(obj) {
  process.stdout.write(JSON.stringify(obj));
}

function blockMessage(reason, identity, sessionId) {
  const expires = new Date(Date.now() + TOKEN_TTL_MS).toISOString();
  return (
    `${reason}\n\n` +
    `[SVEN GATEKEEPER] Run /sven to review this change first. If Sven approves (APPROVED or REVISED), ` +
    `write ${TOKEN_FILE} with:\n` +
    `{"action_hash":"${identity.hash}","session_id":"${sessionId}","expires_at":"${expires}"}\n` +
    `then repeat the exact same action. The token is one-time and expires in ${TOKEN_TTL_MS / 60000} minutes.\n` +
    `ActionHash: ${identity.hash}`
  );
}

function decide(decision, reason) {
  emit({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: decision, permissionDecisionReason: reason } });
}

// --------------------------------------------------------------- main

function handle(input) {
  const tool = input.tool_name || '';
  const sessionId = input.session_id || '';
  const dry = process.env.SVEN_GATEKEEPER === 'dryrun';

  if (tool === 'AskUserQuestion') {
    const qs = Array.isArray(input.tool_input?.questions) ? input.tool_input.questions : [];
    const heads = qs.map((q) => q?.header || q?.question || '').filter(Boolean).join(' | ');
    log(`question ${heads}`);
    notify(['--verdict', 'NEED_USER_DECISION', '--title', 'Decision needed', '--domain', 'Decision', '--risk', heads.slice(0, 300), '--next', 'Waiting for your answer']);
    if (dry) return;
    emit({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext:
          '[SVEN] Frame this question as Sven: state the recommended option first and why it beats the others. ' +
          'One recommendation, not a survey. The user was notified on Telegram.',
      },
    });
    return;
  }

  if (!['Bash', 'PowerShell', 'Write', 'Edit', 'MultiEdit'].includes(tool)) return;

  let decision = null;
  let reason = '';
  if (tool === 'Bash' || tool === 'PowerShell') {
    const reasons = irreversibleReasons(String(input.tool_input?.command || ''));
    if (reasons.length) { decision = 'deny'; reason = reasons.join('. '); }
  } else {
    const why = criticalFileReason(input.tool_input?.file_path);
    if (why) { decision = 'ask'; reason = `This edits ${normalizedPath(input.tool_input.file_path)}, and ${why}.`; }
  }
  if (!decision) return;

  const identity = actionIdentity(input);
  const approval = readToken();
  if (approval && tokenMatches(approval.token, approval.mtime, identity.hash, sessionId)) {
    consumeToken();
    log(`allow (token) ${tool} ${identity.target}`);
    if (!dry) decide('allow', `Approved by a one-time Sven token for this exact action (${identity.hash}).`);
    return;
  }

  log(`${decision} ${tool} ${identity.target} :: ${reason}`);
  if (dry) return;
  decide(decision, blockMessage(reason, identity, sessionId));
  if (decision === 'deny') {
    notify(['--verdict', 'NEED_USER_DECISION', '--title', 'Gatekeeper blocked an action', '--domain', 'Irreversible action', '--risk', reason.slice(0, 400), '--next', 'Run /sven, then approve with the token']);
  }
}

function main() {
  if (process.env.SVEN_ADVISOR === 'off') return;
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (c) => { raw += c; });
  process.stdin.on('end', () => {
    let input;
    try { input = JSON.parse(raw); } catch { return; }
    if (input && typeof input === 'object') handle(input);
  });
}

if (require.main === module) main();

module.exports = { classifyCommand, criticalFileReason, normalizedPath, actionIdentity, tokenMatches, irreversibleReasons };
