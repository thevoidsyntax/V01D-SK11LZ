---
name: audit
effort: high
description: "Whole-repo security and correctness audit: dependency scan, targeted LLM review, incremental baseline, no subagents by default"
when_to_use: "Use when the user types /audit or asks to audit the whole repo or a path, or when Dina calls it for the QA gate: handover, pre-release sweep, legacy code. For a diff or PR use /code-review or /security-review."
metadata:
  version: "6.2.1"
---

# /audit v6.2.1

Read each file once and check every angle in that read. The only tool step is a dependency scan: a vulnerability published after the model's training is the one thing a careful read cannot find.

## Rules

- **No subagents.** Exception: scope over 150 files, at most 2, one module each, `run_in_background: false`. Never verifier agents.
- Not started by the user's `/audit` or by Dina: state the scope and ask before scanning.
- Arguments: `<path>` limits scope. Default angle is security + correctness; `perf`, `arch`, `tests` add one angle in the same read. `release` forces the full Tier 1 sweep.
- **Few calls.** Every API call re-reads about 125K tokens of fixed context, so batch: one Bash for the baseline, scope commands, manifest detection and the dependency scan; one parallel call that reads all Tier 1 files and runs every grep; then one Write. Aim for 5 calls or fewer.

## 1. Scope

Print `scope: N files`.
- Read `specs/.audit-base` (one line: a SHA). If `git cat-file -e <sha>^{commit}` passes, scope = `git diff --name-only <sha>` + `git ls-files -o --exclude-standard` + direct callers of changed symbols (grep the names). Without `..HEAD`, so uncommitted patches count. Do not re-read unchanged files just because they have open findings.
- No baseline or invalid SHA: whole repo. Rescan Tier 1 in full if the baseline is older than 30 days.
- Skip tests, generated, build output, vendor, node_modules, lockfiles. Manifests, CI, Dockerfile/compose and `.env.example` are checked by grep only.
- Over 150 files: Tier 1, then Tier 2, then stop and list what was left out.
- Tier 1: auth, session, token, secret, crypto, payment, billing, webhook, oauth, permission, upload (name or directory). Tier 2: controller, handler, service, repository directories.

## 2. Dependency scan

Run only the scanner for each ecosystem the manifests show, keep high/critical, and cut each output to 60 lines:

| Manifest | Command |
|----------|---------|
| `package-lock.json` | `npm audit --omit=dev` |
| `*.csproj` | `dotnet list package --vulnerable --include-transitive` |
| `pyproject.toml` / `requirements*.txt` | `pip-audit` (only if installed) |
| `go.mod` | `govulncheck ./...` (only if installed) |
| any | `osv-scanner -r .` (only if installed) |

Install nothing. Compilers and linters (`tsc`, `dotnet build`, `go vet`, `ruff`) are not part of the audit: an A/B run on an 11-bug fixture found the same 11/11 without them, at 26–39% lower cost, and Hexa's tests and build already cover what they catch. Name each dependency finding with the package, installed version, advisory, and fixed version.

Write each command in the syntax of the tool that runs it: the Bash tool is POSIX (`| head -60`, `2>/dev/null`); PowerShell syntax (`| Select-Object -First 60`, `2>$null`) only in the PowerShell tool. If a tool fails to run, say so in the report under "Tools"; never present a tool as run when it was not.

## 3. Targeted review

- **Entry points.** Grep routes (`@Get|@Post|@Put|@Patch|@Delete`, `[Http`, `app.get|post|put|patch|delete`, `router.`, `HandleFunc`). For each: auth guard? input validation? ownership check (IDOR)? idempotency key on mutations? multi-table write in a transaction? Read ±40 lines only for handlers with no obvious guard or touching sensitive data.
- **Master Rules by grep.** `DateTime.Now|new Date()|datetime.now()|time.Now()` in backend (UTC), CORS `*`, hardcoded secrets, queries inside loops (sample), missing `BeginTransaction`/`@Transactional` on multi-table writes.
- **Tier 1 files.** Read whole if 300 lines or fewer: check-then-act races, transaction gaps, tainted data reaching SQL string-building, exec/eval, innerHTML, file paths.


## 4. Precision

Every finding has `file:line` and a one-line exploit or failure scenario; no scenario, drop it. Re-read the cited lines of each CRITICAL/HIGH before keeping it. Drop tool hits whose line is not actually vulnerable.

## 5. Report

Write `specs/AUDIT.md` (create `specs/` if absent). Its date comes from `date -u +%Y-%m-%d` (or the commit date from `git log -1 --format=%cs`); never write a date you did not read from a command. List all CRITICAL/HIGH as `SEV file:line - evidence - fix`, top 10 MEDIUM, counts for the rest, and what was scanned and skipped. Carry earlier open findings forward: re-check those whose file changed, keep the rest verbatim. Write `specs/AUDIT.md` once (one Write, not many Edits). Then write `git rev-parse HEAD` to `specs/.audit-base`. The `STATUS:` line belongs to Dina. Keep the report near 2.5K tokens. The final chat reply is 8 lines at most (counts, top 3 findings, report path); never repeat the report.
