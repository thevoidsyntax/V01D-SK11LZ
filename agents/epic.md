# `/agents epic` — rute epik dari roadmap

Dibaca `agents/SKILL.md` saat rute epik dipilih.

The epic route: build the next epic from a roadmap instead of a single request. Runs when `specs/ROADMAP.md` exists and the request names an epic ("kerjakan E2", "lanjut roadmap", "epic berikutnya").

1. Read `specs/ROADMAP.md`. Pick the epic the user named; otherwise the first row with `todo` whose `Depends on` epics are all `done`. If that row has no PRD file (the `PRD` column is empty or the file is missing), prepend Satria to write it, then continue.
2. Read the epic PRD (the file in the roadmap's `PRD` column) and the index `specs/PRD.md`. Print `[EPIC] <id> — <judul> (milestone <M>)` before the first phase.
3. Set that epic's `Status` to `in progress` in `specs/ROADMAP.md` before the first phase.
4. Run the route. KLIEN: **Athena → Hexa → Dina → Frans → Vika**. PRIBADI: **Hexa → Dina**, with Athena, Frans, or Vika added only by the route rules in `agents/SKILL.md` section 1 (undefined contract or schema, Docker/CI/migrations, docs). Satria is skipped either way: the epic PRD already exists. Each phase reads the epic PRD as its scope. Pass the epic PRD path in the spawn prompt instead of `specs/PRD.md` alone. When the epic has more than about 8 endpoints or screens, split the Hexa phase by layer (domain, application, infrastructure, HTTP, UI): one spawn per layer, each with only that layer's scope, each reading the HANDOFF entries of the layers before it. One spawn for a whole large epic can produce a single response over the output limit and die before writing any code.
5. After the last phase and the final Dina pass, set the epic's `Status` to `done` in `specs/ROADMAP.md` — before the commit proposal in section 7, so the roadmap update lands in the same commit. If the commit is declined or skipped, leave the status `in progress`. Then update the `Current PRD:` line in `specs/PRD.md` to the next ready epic (the first `todo` row whose dependencies are all `done`), or to `belum ada — epic berikutnya belum didefinisikan.` when none is ready. `specs/ROADMAP.md` is the only place a status is recorded; the index carries no status column.

The `[ROUTE]` block for this route reads:

```text
[ROUTE] Epic E2 — Billing
  alasan: specs/ROADMAP.md, E1 selesai
  ubah: "epic E3" atau "mulai dari Hexa"
```
