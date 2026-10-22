---
name: agents
description: "Six-persona build pipeline (PM, Architect, Coder, QA/Security, DevOps, Writer) with per-phase model, routes for small changes, approval pauses, and artifact handoff"
when_to_use: "Use when you want the persona pipeline to build or change something end-to-end (Satria, Athena, Hexa, Dina, Frans, Vika). Trigger with /agents or a request ending in 'mulai pipeline'. For single-persona help, call that persona directly."
metadata:
  version: "4.0.0"
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
```

Then print the `[RUTE]` block and start the first phase without waiting. The phase checks in section 3 count this entry, so a run without it is incomplete. If the user names a route ("pipeline penuh", "mulai dari Athena", "hanya Hexa dan Dina"), use theirs.

## 2. Read the scale

Read `Scale: KLIEN | PRIBADI` from the project `CLAUDE.md`. If it is missing, ask once with AskUserQuestion and write the answer into `CLAUDE.md`. If you cannot ask (headless), assume KLIEN.

## 3. Run the phases

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

## 5. Quality gate & loopback

Dina ends `specs/AUDIT.md` with a status line:
- `STATUS: APPROVED` → continue with the route.
- `STATUS: REJECTED` → hand back to **Hexa** with the findings; Hexa patches, Dina re-audits. **Max 3 loops** (print `[LOOP k/3]`); if still rejected, stop and surface the blocking findings to the user.

## 6. Final Dina pass

When Frans or Vika ran after the gate, spawn Dina once more in **final pass** mode. `/audit` scans only the diff since `specs/.audit-base`, so this pass covers just their files: migrations (rollback path, data loss), Dockerfile and CI (secrets, root user, pinned versions), and `docs/openapi.*` against the real routes. `REJECTED` goes back to the persona that wrote the file (Frans or Vika), **max 2 loops**.

## 7. Commit, only after approval

After the last phase:
0. If the route had no Vika (bugfix, infra, short routes) and the project has a `CHANGELOG.md`, add an entry under `## [Unreleased]` yourself, built from this run's HANDOFF entries: what changed for the user and why, in one or two lines. Every committed change gets a CHANGELOG line, not only full-pipeline runs.
1. Show `git status --short` and a Conventional Commit message. End the message with one `Co-Authored-By: <Persona>` line per persona that produced an artifact in this run. These persona trailers are the user's attribution rule for this workflow: they replace Claude Code's default `Co-Authored-By: Claude …` line, so do not add that line.
2. Ask with AskUserQuestion: **Commit** / **Ubah pesan** / **Lewati**.
3. Commit only on **Commit**. Never push; push needs its own request and approval.
4. If you cannot ask (headless), do not commit; say the changes are left uncommitted.

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

Passing = every artifact of the route exists, `specs/HANDOFF.md` has the `[RUTE]` entry and one entry per phase, Dina's last `STATUS:` is `APPROVED`, and the commit was offered. If a phase produces no artifact, stop and inspect that phase rather than continuing.

## Single-persona use

Call any persona directly for focused help without the pipeline: `/satria`, `/athena`, `/hexa`, `/dina`, `/frans`, `/vika`. Each still follows its workflow and the handoff log.

## Notes

- Personas are **skills in this repo**; per-phase models come from the Agent tool's `model` override at spawn, not from registered agents.
- Artifacts like `contracts.*` and `ci.yml` are created in the **target project**, never in this skills repo.

---

*A pipeline that ships: plan → design → build → audit → deploy → document.*
