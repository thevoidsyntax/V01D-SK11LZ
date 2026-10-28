---
name: agents
description: "Six-persona build pipeline (PM, Architect, Coder, QA/Security, DevOps, Writer) with per-phase model, routes for small changes, an epic route for roadmaps, approval pauses, and artifact handoff"
when_to_use: "Use when you want the persona pipeline to build or change something end-to-end (Satria, Athena, Hexa, Dina, Frans, Vika). Trigger with /agents or a request ending in 'mulai pipeline'. Also to build one epic from specs/ROADMAP.md ('kerjakan E2', 'lanjut roadmap'). For single-persona help, call that persona directly."
metadata:
  version: "4.9.0"
---

# 👥 PERSONA PIPELINE — SATRIA · ATHENA · HEXA · DINA · FRANS · VIKA

Six specialists run as a sequential, artifact-handoff pipeline. Each phase runs as its **own subagent** on its **own model**, so quality is spent where it matters and cost is saved where it does not.

## The Team

| # | Persona | Role | Model | Skills | Output artifact |
|---|---------|------|-------|--------|-----------------|
| 1 | **Satria** | Product Manager | Opus (medium; high for large/ambiguous) | — | `specs/PRD.md` |
| 2 | **Athena** | System Architect | Sonnet (high) | — (ADR format is in her skill) | `specs/ADR.md`, `specs/contracts.*`, conventions in `CLAUDE.md` |
| 3 | **Hexa** | Feature Coder | Sonnet (high)* | ponytail; impeccable + anti-slop for UI/copy | `src/*`, `tests/*` |
| 4 | **Dina** | QA & Security | Sonnet (high)* | audit | `specs/AUDIT.md` + `STATUS:` |
| 5 | **Frans** | Platform & DevOps | Sonnet (high) | — | `Dockerfile`, `migrations/*`, `ci.yml` |
| 6 | **Vika** | Technical Writer | Haiku (low)* | anti-slop | `docs/openapi.*`, `CHANGELOG.md`, README |

Every persona also appends an entry to `specs/HANDOFF.md` (see below). Stack, security, and testing knowledge come from the model and the project's `CLAUDE.md`, not from skills.

\* **Models (user policy, 2026-10-27):** Opus only for Satria; Haiku for Vika; Athena, Hexa, Dina, and Frans run on Sonnet at effort high. The one Opus escalation is the gate loop: once Dina has returned `REJECTED` twice, the later rounds run Hexa and Dina on Opus at effort high (section 5). Vika → Sonnet (effort medium) for a large API surface. Frans is never Haiku (migrations are destructive). Evidence: CHANGELOG 4.3.0.

## 1. Pick the route

Before spawning anything, choose the shortest route that covers the change. Your **first output** is the `[RUTE]` block below, printed as text before the first Agent call:

| Change | Route |
|--------|-------|
| New feature or module, KLIEN | Satria → Athena → Hexa → Dina → Frans → Vika |
| New feature or module, PRIBADI | Hexa → Dina (Satria, Athena, Frans, Vika join only as the rules below say) |
| Change to an existing feature, contracts unchanged | Hexa → Dina (→ Vika if the API or user-facing docs change) |
| Existing codebase with no spec, ADR, or docs | Athena (legacy mode) → Hexa → Dina |
| Bugfix | Hexa (failing test first) → Dina |
| Infra or deploy only | Frans → Dina |
| Docs only | Vika |
| Next epic from a roadmap, KLIEN | Athena → Hexa → Dina → Frans → Vika (see `/agents epic`) |
| Next epic from a roadmap, PRIBADI | Hexa → Dina, plus the phases the rules below add (see `/agents epic`) |

Rules that override the table:
- A contract, schema, or public API change adds Athena before Hexa, unless the request already defines it.
- A request about code that already exists but was never written down (no PRD, no ADR, no tests) routes through **Athena in legacy mode**: she reconstructs the observed behavior into `specs/LEGACY.md` first, then designs against that evidence.
- PRIBADI new work, epics included, stays Hexa → Dina. Satria joins only when the request has no acceptance criteria; Athena only when the request leaves the contract or schema undefined; Frans and Vika only when the request asks for Docker, CI, migrations, or docs.
- A migration adds Frans.
- Any code change keeps Dina. Dina is never skipped when code changed.
- Every Hexa phase runs `/tdd`: a behavior change starts with a failing test, and the HANDOFF entry carries the red-green evidence.

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

Runs when `specs/ROADMAP.md` exists and the request names an epic ("kerjakan E2", "lanjut roadmap", "epic berikutnya"). **Before the first phase, Read `~/.claude/skills/agents/epic.md` and follow it**: it holds the route (Athena → Hexa → Dina → Frans → Vika, Satria skipped), the `Status` updates in `specs/ROADMAP.md`, and the `[ROUTE]` block.


## 2. Read the scale

Read `Scale: KLIEN | PRIBADI` from the project `CLAUDE.md`, or from the request when it names the scale ("proyek PRIBADI"). If neither says, ask once with AskUserQuestion and write the answer into `CLAUDE.md`. If you cannot ask (headless), assume KLIEN.

## 3. Run the phases

The orchestrator coordinates; it does not write the work itself. Never edit `src/*`, `tests/*`, `Dockerfile`, `migrations/*`, `ci.yml`, or `docs/*` in the target project — a fix goes back to the persona that owns it (Hexa for code, Frans for infra, Vika for docs) as another phase.

For each phase in the route, spawn with the **Agent tool**, always in the foreground so progress is visible:
- `subagent_type: "general-purpose"`, `model:` = the persona's model and `effort:` = its effort from the table (the user asked for these levels; the gate loop in section 5 is the only escalation), `run_in_background: false` (each phase needs the previous artifact).
- `prompt`: "You are **<Persona>** (<role>). Invoke the `/<persona>` skill and follow its whole workflow. Read only these artifacts: <inputs>. Produce: <output artifact>, plus everything your workflow writes (the `specs/HANDOFF.md` entry; for Dina also `specs/.audit-base`). Keep your reply to a one-line handoff summary. Write one file per step and never put several large files in one turn. If you are running low on room, finish the file in hand, append your HANDOFF entry listing what is left, and stop."
- Pass artifact paths, never the prior transcript.
- **Limit or error.** If a phase ends early on an output limit (`max_output_tokens`) or an API error, check `git status` and the files already written, then continue **the same agent** with SendMessage to its agent id ("continue from where you stopped, do not rewrite finished files, keep replies short"). Spawn a new agent only if SendMessage fails, and list the files already on disk in its prompt. Never resume an agent whose scope was given to another agent.
- **Async launch.** If the Agent result says the agent was launched async (the harness moves a foreground agent to the background after a while; 3 of 12 Hexa spawns in VentroPoS E1), print `[FASE n/N] <Persona> berjalan di background`, then wait for its completion notice. Do not start a phase that depends on it, and do not poll.
- **Phase size.** Scope each Hexa spawn to about one layer or one screen group (roughly 10-15 files), so it returns within about 15 minutes and the `[FASE]` and `[HANDOFF]` lines show progress. VentroPoS E1 spawns ran 16-63 minutes each, and the user saw nothing in between.
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

### Parallel spawns

Two cases run several agents at once. Put all their Agent calls in **one message** (still foreground); calls sent one per message run one after another.

1. **Hexa work units.** Only when `specs/ADR.md` has a `Work units` table; Athena writes it only for work above about 8 endpoints or screens (the size at which the layer split in `agents/epic.md` already applies), with 3 or more units or a backend plus a UI. Spawn one Hexa per unit whose `Depends on` units are done (the first wave has none), each with `Unit: <name>` and its owned files in the prompt; repeat per wave; then one last Hexa with `Unit: integration`. No table: one Hexa. Below that size parallel is slower: a 3-module spec (about 14 endpoints) took 906 s and $2.63 with one Hexa against 972 s and $3.10 with four, because each agent pays about 2 minutes of startup and the integration agent runs alone after the wave. At the large size the split already costs the same spawns; running them together removes the waiting (VentroPoS E1: 11 Hexa spawns ran one after another, 6.2 hours).
2. **Frans and Vika**, when the route has both. Their outputs are disjoint and both read only what exists after the gate. Vika's prompt adds "Frans runs at the same time: do not document the Dockerfile, CI, or migrations". The final Dina pass (section 6) starts after both return.

Rules for a parallel batch:
- The agents do not write `specs/HANDOFF.md`: `Write` replaces the whole file, so two writers lose an entry. The prompt says "Do not write specs/HANDOFF.md. End your reply with your full HANDOFF entry" (this replaces the one-line reply). The orchestrator appends the entries one after another, in route order, then runs the phase check on the artifacts.
- Print one `[FASE n/N]` line per agent before the batch, counting each agent as a phase.
- After the batch compare `git status --short` with the owned files. A file written by two units, or outside its unit's list, stops the run: report it, do not merge by hand.
- The "Limit or error" rule applies per agent.

## 4. Approval pauses

Design mistakes cost the most once code exists, so the pipeline stops for the user after the design phases in the route:

| Scale | Pause after |
|-------|-------------|
| PRIBADI | Athena (PRD and ADR reviewed together) |
| KLIEN | Satria, and again after Athena |

At a pause, print a summary of at most 12 lines (PRD scope, assumptions, open questions; ADR decisions and rejected alternatives; every OPEN item from Athena's `Assumptions:` line, verbatim), then ask with AskUserQuestion with exactly these options: **Lanjut** / **Revisi PRD** / **Revisi ADR** / **Stop**. On a revision, ask for the notes with one more AskUserQuestion (suggested notes plus Other for free text), re-run that persona with them, then pause again.

- "tanpa jeda" in the request skips the design pauses. The commit approval (section 7) always stays.
- At a pause the user can run `/fool` to stress-test the PRD or ADR before approving. It is not part of the route: it never spawns a phase, never blocks, and never writes to the project.
- If you cannot ask (headless) or get no answer, stop at the pause and say where the run stopped.
- Routes without Satria or Athena have no design pause.
- On the epic route there is no Satria phase, so KLIEN pauses after Athena only.

## 5. Quality gate & loopback

Dina ends `specs/AUDIT.md` with a status line:
- `STATUS: APPROVED` → continue with the route.
- `STATUS: REJECTED` → hand back to **Hexa** with the findings; Hexa patches, Dina re-audits. **Max 3 loops** (print `[LOOP k/3]`); if still rejected, stop and surface the blocking findings to the user. Loop 1 runs on Sonnet at effort high. After the second `REJECTED`, loops 2 and 3 run Hexa and Dina on Opus at effort high (`model: "opus"`, `effort: "high"`). The final-pass loops in section 6 do not escalate.

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

After a commit, only when the branch is not `main`/`master`, remote `origin` exists, and `gh auth status` succeeds; otherwise print one line saying why and stop, never push. **Read `~/.claude/skills/agents/push-pr.md` and follow it** (offer, push, PR body, `/code-review`, `gh pr checks`). The pipeline never merges.


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

## Notes

- Personas are **skills in this repo**; per-phase models come from the Agent tool's `model` override at spawn, not from registered agents.
- Artifacts like `contracts.*` and `ci.yml` are created in the **target project**, never in this skills repo.
- Smoke-test and passing criteria: `agents/smoke-test.md`.
