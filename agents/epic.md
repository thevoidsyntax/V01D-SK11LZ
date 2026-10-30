# `/agents epic` — rute epik dari roadmap

Dibaca `agents/SKILL.md` saat rute epik dipilih.

The epic route: build the next epic from a roadmap instead of a single request. Runs when `specs/ROADMAP.md` exists and the request names an epic ("kerjakan E2", "lanjut roadmap", "epic berikutnya").

1. Read `specs/ROADMAP.md`. Pick the epic the user named; otherwise the first row with `todo` whose `Depends on` epics are all `done`. If that row has no PRD file (the `PRD` column is empty or the file is missing), prepend Satria to write it, then continue.
2. Read the epic PRD (the file in the roadmap's `PRD` column) and the index `specs/PRD.md`. Print `[EPIC] <id> — <judul> (milestone <M>)` before the first phase.
3. Set that epic's `Status` to `in progress` in `specs/ROADMAP.md` before the first phase, and write the epic's pipeline table (every phase of the route as `☐`) and the position block next to it (`agents/progress.md`).
4. Run the route. KLIEN: **Athena → Hexa → Dina → Frans → Vika**. PRIBADI: **Hexa → Dina**, with Athena, Frans, or Vika added only by the route rules in `agents/SKILL.md` section 1 (undefined contract or schema, Docker/CI/migrations, docs). Satria is skipped either way: the epic PRD already exists. Each phase reads the epic PRD as its scope. Pass the epic PRD path in the spawn prompt instead of `specs/PRD.md` alone. When the epic has more than about 8 endpoints or screens, split the Hexa phase by layer or screen group (domain, application modules, infrastructure, HTTP, UI groups, e2e last), with the dependencies in the ADR `Work units` table. Run the units as the "Parallel spawns" section of `agents/SKILL.md` says: independent units together in one wave, a unit reading only the HANDOFF entries of the units it depends on. One spawn for a whole large epic can produce a single response over the output limit and die before writing any code; running the split one after another cost VentroPoS E1 6.2 hours of Hexa time.
5. After the last phase and the final Dina pass, set the epic's `Status` to `done` in `specs/ROADMAP.md` — before the commit proposal in section 7, so the roadmap update lands in the same commit. If the commit is declined or skipped, leave the status `in progress`. Then update the `Current PRD:` line in `specs/PRD.md` to the next ready epic (the first `todo` row whose dependencies are all `done`), or to `belum ada — epic berikutnya belum didefinisikan.` when none is ready. `specs/ROADMAP.md` is the only place a status is recorded; the index carries no status column. Between steps 3 and 5 the pipeline table and position block in that file are updated after every phase, not only at the end (`agents/progress.md`).
6. Archive the closed epic's HANDOFF entries, still before the commit proposal in section 7. Move every entry belonging to this epic (the route, branch, phase, and progress entries of this run) out of `specs/HANDOFF.md` into `specs/handoff/<epic>.md` — a new file that starts with a one-paragraph header saying it is the archived record of that epic, closed at its UTC date, read-only. `specs/HANDOFF.md` keeps a header, a pointer line to the archive, and the entries of the next epic only. Personas never read the archive unless the user or the orchestrator asks for it; it is kept for history, not for the running pipeline. This step applies to the epic route only — a route without `specs/ROADMAP.md` has no epic to archive and its `specs/HANDOFF.md` stays append-only.

The `[ROUTE]` block for this route reads:

```text
[ROUTE] Epic E2 — Billing
  alasan: specs/ROADMAP.md, E1 selesai
  ubah: "epic E3" atau "mulai dari Hexa"
```
