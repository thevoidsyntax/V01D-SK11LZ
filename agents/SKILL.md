---
name: agents
description: "Six-persona build pipeline (PM, Architect, Coder, QA/Security, DevOps, Writer) with per-phase model, routes for small changes, an epic route for roadmaps, approval pauses, and artifact handoff"
when_to_use: "Use when you want the persona pipeline to build or change something end-to-end (Satria, Athena, Hexa, Dina, Frans, Vika). Trigger with /agents or a request ending in 'mulai pipeline'. Also to build one epic from specs/ROADMAP.md ('kerjakan E2', 'lanjut roadmap'). For single-persona help, call that persona directly."
metadata:
  version: "4.3.0"
---

# 👥 PERSONA PIPELINE — SATRIA · ATHENA · HEXA · DINA · FRANS · VIKA

Six specialists run as a sequential, artifact-handoff pipeline. Each phase runs as its **own subagent** on its **own model**, so quality is spent where it matters and cost is saved where it does not.

## The Team

| # | Persona | Role | Model | Skills | Output artifact |
|---|---------|------|-------|--------|-----------------|
| 1 | **Satria** | Product Manager | Sonnet* | — | `specs/PRD.md` |
| 2 | **Athena** | System Architect | **Opus** | — (ADR format is in her skill) | `specs/ADR.md`, `specs/contracts.*`, conventions in `CLAUDE.md` |
| 3 | **Hexa** | Feature Coder | Sonnet* | ponytail; impeccable + anti-slop for UI/copy | `src/*`, `tests/*` |
| 4 | **Dina** | QA & Security | **Opus** | audit | `specs/AUDIT.md` + `STATUS:` |
| 5 | **Frans** | Platform & DevOps | Sonnet | — | `Dockerfile`, `migrations/*`, `ci.yml` |
| 6 | **Vika** | Technical Writer | Haiku* | anti-slop | `docs/openapi.*`, `CHANGELOG.md`, README |

Every persona also appends an entry to `specs/HANDOFF.md` (see below). Stack, security, and testing knowledge come from the model and the project's `CLAUDE.md`, not from skills.

\* **Escalation:** Hexa → Opus for transactional/concurrency-heavy logic; Satria → Opus for large/ambiguous products; Vika → Sonnet for a large API surface. Athena & Dina stay Opus (risk gates); Frans stays at least Sonnet (migrations are destructive — never Haiku).

## 1. Pick the route

Before spawning anything, choose the shortest route that covers the change. Your **first output** is the `[RUTE]` block below, printed as text before the first Agent call:

| Change | Route |
|--------|-------|
| New feature or module | Satria → Athena → Hexa → Dina → Frans → Vika |
| Change to an existing feature, contracts unchanged | Hexa → Dina (→ Vika if the API or user-facing docs change) |
| Bugfix | Hexa (failing test first) → Dina |
| Infra or deploy only | Frans → Dina |
| Docs only | Vika |
| Next epic from a roadmap | Athena → Hexa → Dina → Frans → Vika (see `/agents epic`) |

Rules that override the table:
- A contract, schema, or public API change adds Athena before Hexa.
- A migration adds Frans.
- Any code change keeps Dina. Dina is never skipped when code changed.

```text
[RUTE] Bugfix: Hexa → Dina
  alasan: satu endpoint, kontrak dan skema tidak berubah
  ubah: "pipeline penuh" atau "mulai dari <persona>"
```

Your first tool call is the Write or Edit that appends the route to `specs/HANDOFF.md` (create it if missing), before any Agent call:

```markdown
## [RUTE] orchestrator — <UTC time from date -u>
Route: Hexa → Dina
Reason: <one line>
Scale: <PRIBADI | KLIEN | KLIEN (assumed)>
Branch: <current branch, or "-" outside a git repo>
```

On the epic route add one line, `Epic: <id> — <judul>`.

Then print the `[RUTE]` block. The phase checks in section 3 count this entry, so a run without it is incomplete. If the user names a route ("pipeline penuh", "mulai dari Athena", "hanya Hexa dan Dina"), use theirs. Start the first phase without waiting, unless the branch step below applies.

### Branch

Runs only when the project is a git repo, the current branch is `main` or `master`, and the route changes files. Otherwise skip it (already on a feature branch: stay there; the `Branch:` line records it).

Ask with AskUserQuestion, with `<tipe>/<slug>` built from the route (new feature = `feat`, bugfix = `fix`, infra = `chore`, docs = `docs`) and the request:

| Scale | Options |
|-------|---------|
| KLIEN | **Buat `<tipe>/<slug>`** / **Nama lain** / **Stop** |
| PRIBADI | **Buat `<tipe>/<slug>`** / **Tetap di `<branch>`** / **Nama lain** |

On approval run `git switch -c <name>`; uncommitted changes come along. If the name exists, offer **Nama lain**. Then append a new entry (the `[RUTE]` entry is never edited):

```markdown
## [BRANCH] orchestrator — <UTC time from date -u>
Branch: <name>
Base: <main or master>
```

If you cannot ask (headless), stay on the current branch; nothing is committed in that mode. Never create a branch you were not approved to create — no question, no branch.

### `/agents epic`

The epic route: build the next epic from a roadmap instead of a single request. Runs when `specs/ROADMAP.md` exists and the request names an epic ("kerjakan E2", "lanjut roadmap", "epic berikutnya").

1. Read `specs/ROADMAP.md`. Pick the epic the user named; otherwise the first row with `todo` whose `Depends on` epics are all `done`. If that row has no PRD file (the `PRD` column is empty or the file is missing), prepend Satria to write it, then continue.
2. Read the epic PRD (the file in the roadmap's `PRD` column) and the index `specs/PRD.md`. Print `[EPIC] <id> — <judul> (milestone <M>)` before the first phase.
3. Set that epic's `Status` to `in progress` in `specs/ROADMAP.md` before the first phase.
4. Run the route **Athena → Hexa → Dina → Frans → Vika**. Satria is skipped: the epic PRD already exists. Each phase reads the epic PRD as its scope. Pass the epic PRD path in the spawn prompt instead of `specs/PRD.md` alone.
5. After the last phase and the final Dina pass, set the epic's `Status` to `done` in `specs/ROADMAP.md` — before the commit proposal in section 7, so the roadmap update lands in the same commit. If the commit is declined or skipped, leave the status `in progress`. Then update the `Current PRD:` line in `specs/PRD.md` to the next ready epic (the first `todo` row whose dependencies are all `done`), or to `belum ada — epic berikutnya belum didefinisikan.` when none is ready. `specs/ROADMAP.md` is the only place a status is recorded; the index carries no status column.

The `[ROUTE]` block for this route reads:

```text
[ROUTE] Epic E2 — Billing
  alasan: specs/ROADMAP.md, E1 selesai
  ubah: "epic E3" atau "mulai dari Hexa"
```

## 2. Read the scale

Read `Scale: KLIEN | PRIBADI` from the project `CLAUDE.md`. If it is missing, ask once with AskUserQuestion and write the answer into `CLAUDE.md`. If you cannot ask (headless), assume KLIEN.

## 3. Run the phases

The orchestrator coordinates; it does not write the work itself. Never edit `src/*`, `tests/*`, `Dockerfile`, `migrations/*`, `ci.yml`, or `docs/*` in the target project — a fix goes back to the persona that owns it (Hexa for code, Frans for infra, Vika for docs) as another phase.

For each phase in the route, spawn with the **Agent tool**, always in the foreground so progress is visible:
- `subagent_type: "general-purpose"`, `model:` = the persona's model from the table (apply escalation when the change warrants it), `run_in_background: false` (each phase needs the previous artifact).
- `prompt`: "You are **<Persona>** (<role>). Invoke the `/<persona>` skill and follow its whole workflow. Read only these artifacts: <inputs>. Produce: <output artifact>, plus everything your workflow writes (the `specs/HANDOFF.md` entry; for Dina also `specs/.audit-base`). Keep your reply to a one-line handoff summary."
- Pass artifact paths, never the prior transcript.
- Before **every** spawn, the first one included, print `[FASE n/N] <Persona> (<model>) mulai — baca <inputs>`, where N is the number of phases in the route. After it returns, check the artifact exists **and** `specs/HANDOFF.md` gained that persona's entry, then print `[HANDOFF] <A> → <B> selesai: <artifact> (ada)`. If either is missing, stop and inspect that phase.

```text
Satria  → specs/PRD.md
Athena  → specs/ADR.md + specs/contracts.* + Conventions in CLAUDE.md   (reads PRD)
Hexa    → src/* + tests/*                       (reads ADR + contracts + PRD + CLAUDE.md)
Dina    → specs/AUDIT.md + STATUS:              (reads src/ + tests/)
Frans   → Dockerfile + migrations/* + ci.yml    (reads src/ + schema)
Vika    → docs/openapi.* + CHANGELOG.md + README (reads HANDOFF.md + src/ + PRD)
```

On the epic route, "PRD" means the epic PRD `specs/prd/<epic>.md`. Pass its path in the spawn prompt; the index `specs/PRD.md` stays the product-level context.

## 4. Approval pauses

Design mistakes cost the most once code exists, so the pipeline stops for the user after the design phases in the route:

| Scale | Pause after |
|-------|-------------|
| PRIBADI | Athena (PRD and ADR reviewed together) |
| KLIEN | Satria, and again after Athena |

At a pause, print a summary of at most 12 lines (PRD scope, assumptions, open questions; ADR decisions and rejected alternatives), then ask with AskUserQuestion with exactly these options: **Lanjut** / **Revisi PRD** / **Revisi ADR** / **Stop**. On a revision, ask for the notes with one more AskUserQuestion (suggested notes plus Other for free text), re-run that persona with them, then pause again.

- "tanpa jeda" in the request skips the design pauses. The commit approval (section 7) always stays.
- If you cannot ask (headless) or get no answer, stop at the pause and say where the run stopped.
- Routes without Satria or Athena have no design pause.
- On the epic route there is no Satria phase, so KLIEN pauses after Athena only.

## 5. Quality gate & loopback

Dina ends `specs/AUDIT.md` with a status line:
- `STATUS: APPROVED` → continue with the route.
- `STATUS: REJECTED` → hand back to **Hexa** with the findings; Hexa patches, Dina re-audits. **Max 3 loops** (print `[LOOP k/3]`); if still rejected, stop and surface the blocking findings to the user.

Dina's non-blocking findings (MEDIUM and below) are not a loop trigger and do not need a fix before the route continues. The orchestrator does not patch them either — carry them in the commit message and, on the epic route, in the epic's `Open:` items.

## 6. Final Dina pass

When Frans or Vika ran after the gate, spawn Dina once more in **final pass** mode. `/audit` scans only the diff since `specs/.audit-base`, so this pass covers just their files: migrations (rollback path, data loss), Dockerfile and CI (secrets, root user, pinned versions), and `docs/openapi.*` against the real routes. `REJECTED` goes back to the persona that wrote the file (Frans or Vika) as another phase, **max 2 loops** — the orchestrator does not patch the file itself.

## 7. Commit, only after approval

After the last phase:
0. If the route had no Vika (bugfix, infra, short routes) and the project has a `CHANGELOG.md`, add an entry under `## [Unreleased]` yourself, built from this run's HANDOFF entries: what changed for the user and why, in one or two lines. Every committed change gets a CHANGELOG line, not only full-pipeline runs.
0b. On the epic route, set the epic's `Status` to `done` in `specs/ROADMAP.md` before the commit proposal, so the roadmap update lands in the same commit. If the commit is declined, set it back to `in progress`.
1. Show `git status --short` and a Conventional Commit message. End the message with one `Co-Authored-By: <Persona>` line per persona that produced an artifact in this run. These persona trailers are the user's attribution rule for this workflow: they replace Claude Code's default `Co-Authored-By: Claude …` line, so do not add that line.
2. Ask with AskUserQuestion: **Commit** / **Ubah pesan** / **Lewati**.
3. Commit only on **Commit**.
4. If you cannot ask (headless), do not commit; say the changes are left uncommitted.

### Push and pull request

After a commit, only when the branch is not `main`/`master`, remote `origin` exists, and `gh auth status` succeeds. Otherwise print one line saying why and stop; never push.

1. Ask with AskUserQuestion: **Push + PR** / **Hanya push** / **Selesai**. KLIEN: **Push + PR** first. This is the push request; the push hook still asks for approval on its own.
2. Push with a plain `git push -u origin <branch>` run inside the repo. `-C` and `-c` are denied by the hook.
3. PR: write the body to a temp file outside the repo (run it through `/anti-slop`), then `gh pr create --base <default> --head <branch> --title "<commit subject>" --body-file <file>`. Get the default branch from `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`. The body has: Ringkasan, Perubahan (the CHANGELOG line), Rute with Dina's last `STATUS:`, Open items from HANDOFF, Cara uji, and the personas that worked. No Claude attribution line, same as the commit trailers.
4. Review: invoke `/code-review` with the PR number at medium effort, without `--comment`. Print the findings in at most 10 lines. The user decides whether to fix (a new bugfix route on the same branch) or ignore. No automatic loop, no automatic comments.
5. CI: run `gh pr checks <number>` once and print the result.

The pipeline never merges. Merging is the user's call.

## Handoff log (`specs/HANDOFF.md`)

Every phase, and the `/autor new` PRD and scaffold steps, append one entry. The file is append-only: create it if missing, never rewrite earlier entries. Take the time from `date -u +%Y-%m-%dT%H:%M:%SZ`; if no shell is available, write the date only, never a made-up time.

```markdown
## [PHASE n] <Persona> — <UTC ISO 8601>
Input: <artifacts read>
Output: <artifacts written>
Decisions: <key points>
Open: <issues, or "-">
Next: <persona, or "done">
```

Vika reads this log to write the CHANGELOG entry and README changes, so the record of what happened and why is never only in a transcript.

## Context isolation

- Each phase is a fresh subagent — it does **not** inherit the previous persona's conversation.
- Personas communicate **only through artifact files** (`specs/*`, `src/*`, `docs/*`, `CLAUDE.md`).
- Between phases the terminal shows only short status lines (`[RUTE]`, `[FASE …]`, `[HANDOFF] …`, `[LOOP …]`).

## Try it (smoke-test)

Full route, in an interactive session:

> **"Buat endpoint health-check kecil. Mulai pipeline."**

```text
[RUTE] Fitur baru: Satria → Athena → Hexa → Dina → Frans → Vika
[FASE 1/6] Satria (Sonnet) mulai — baca permintaan user
[HANDOFF] Satria → Athena selesai: specs/PRD.md (ada)
[FASE 2/6] Athena (Opus) mulai — baca specs/PRD.md
[HANDOFF] Athena → Hexa selesai: specs/ADR.md (ada)
(pause: summary + Lanjut / Revisi PRD / Revisi ADR / Stop)
```

Short route: **"Perbaiki SQL injection di /users/search. Mulai pipeline."** → `[RUTE] Bugfix: Hexa → Dina`.

Passing = every artifact of the route exists, `specs/HANDOFF.md` has the `[RUTE]` entry and one entry per phase, Dina's last `STATUS:` is `APPROVED`, the commit was offered, and on `main`/`master` the branch question was asked (a `[BRANCH]` entry if approved) and the push/PR offer followed the commit. If a phase produces no artifact, stop and inspect that phase rather than continuing.

## Single-persona use

Call any persona directly for focused help without the pipeline: `/satria`, `/athena`, `/hexa`, `/dina`, `/frans`, `/vika`. Each still follows its workflow and the handoff log.

## Notes

- Personas are **skills in this repo**; per-phase models come from the Agent tool's `model` override at spawn, not from registered agents.
- Artifacts like `contracts.*` and `ci.yml` are created in the **target project**, never in this skills repo.

---

*A pipeline that ships: plan → design → build → audit → deploy → document.*
