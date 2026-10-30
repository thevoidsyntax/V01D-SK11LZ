# `/agents` progress docs — where the project stands, after every phase

Read by every persona before its HANDOFF entry, and by `agents/SKILL.md` around each phase. `specs/HANDOFF.md` is an append-only history: it cannot answer "where are we" without reading all of it (VentroPoS E1: 1,374 lines). The files below can, from one screen.

| File | Holds | How it changes |
|------|-------|----------------|
| `specs/ROADMAP.md` | status: a position block and the pipeline table of the running epic | edited in place |
| `specs/RESUME.md` | how to continue: status table, next steps, commands | status table and next steps refreshed; never a session log |
| `CHANGELOG.md` | what changed for users | one line under `## [Unreleased]` |
| `README.md` | introduction | only the status line |
| `specs/HANDOFF.md` | history | append-only, unchanged |

Update only the files that exist. A small route has no `specs/ROADMAP.md`: there the CHANGELOG line and the HANDOFF entry are all there is.

## When

1. **A plan is made** (epic start, or `[RUTE]` on a route that has a ROADMAP): write the pipeline table of the epic with every planned phase as `☐`, and the position block.
2. **A phase ends** (every persona, before its HANDOFF entry): the steps below.

## What to update at the end of a phase

1. `specs/ROADMAP.md`:
   - set your row to `✅` or `❌` and put one line of result in `Catatan` (for example `2 HIGH, 20 butir`, or `839 test hijau`);
   - replace the position block (do not stack a new one above the old one);
   - after a `❌` from Dina keep the row and add a `☐` row for the patch round.
2. `specs/RESUME.md`: refresh the status table (commit, test numbers) and `Urutan next` (mark finished steps, keep the detail of the remaining ones). Do not add a log of what you did; that is the HANDOFF entry.
3. `CHANGELOG.md`: one line under `## [Unreleased]` only when this phase changed behavior a user can see. Design and audit phases usually add none. Vika replaces the per-phase lines of the epic with her release entry; she does not add a second one.
4. `README.md`: only the status line, and only when its meaning changed: the epic started or finished.

## Shape of the ROADMAP block

Use the language of the existing roadmap. Heading names below are the Indonesian ones the Satria template uses.

```markdown
## Posisi sekarang

Per <date> (UTC), setelah <last commit>.

- **Ringkas:** <n> dari <N> epic berjalan; <which milestones are reachable>.
- **<Epic>:** <state in one line>.
- **Terverifikasi:** <commands run in this phase with their numbers; "tidak dijalankan" for the ones not run>.
- **Berikutnya:** <persona and what>.

### Pipeline <Epic>

| Tahap | Persona | Status | Catatan |
|---|---|---|---|
| PRD epic | Satria | ✅ | |
| Build | Hexa | ☐ | |
```

Status is `✅` done, `❌` failed or rejected, `☐` not done. The `Status` column of the Epics table keeps its three values (`todo`, `in progress`, `done`) and is still written by `agents/epic.md`.

## Rules

- **Numbers come from commands you ran in this phase.** One you did not run is written `tidak dijalankan`; never copy an old number forward as if it were current.
- Replace, do not stack. A document that grows a new block at the top every phase is the problem this file exists to fix.
- Time and date are UTC from `date -u`; if you cannot run it, write the date only.
- Keep the position block to what a reader needs in one screen. Detail goes to the HANDOFF entry.

## Parallel batches

Parallel agents do not write these files, for the reason they do not write `specs/HANDOFF.md`: two writers lose each other's edit. Each ends its reply with the ROADMAP row it would write (`| Tahap | Persona | Status | Catatan |`); the orchestrator applies the rows one after another, then updates the position block once.

## Check by the orchestrator

After each phase `agents/SKILL.md` checks that the persona's ROADMAP row changed (`git diff --stat -- specs/ROADMAP.md` is not empty). If a persona forgot, the orchestrator writes the row from that persona's HANDOFF entry. That is a documentation fix, not a reason to redo the phase.

Then add the phase's cost to the end of that row's `Catatan`: `<n>K token, <m> menit`, taken from the usage the Agent result or its completion notice reports (`subagent_tokens`, `duration_ms`). No usage reported: write nothing; never estimate. One row per spawn, so a dashboard can sum tokens per persona and per epic from this table.
