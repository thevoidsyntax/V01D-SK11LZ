# Smoke-test `/agents`

Untuk manusia; tidak dimuat otomatis.

Full route, in an interactive session:

> **"Buat endpoint health-check kecil, proyek KLIEN. Mulai pipeline."**

```text
[RUTE] Fitur baru (KLIEN): Satria → Athena → Hexa → Dina → Frans → Vika
[FASE 1/6] Satria (Opus) mulai — baca permintaan user
[HANDOFF] Satria → Athena selesai: specs/PRD.md (ada)
[FASE 2/6] Athena (Sonnet) mulai — baca specs/PRD.md
[HANDOFF] Athena → Hexa selesai: specs/ADR.md (ada)
(pause: summary + Lanjut / Revisi PRD / Revisi ADR / Stop)
```

Short routes: **"Perbaiki SQL injection di /users/search. Mulai pipeline."** → `[RUTE] Bugfix: Hexa → Dina`. **"Proyek PRIBADI: <spesifikasi dengan kriteria penerimaan>. Mulai pipeline."** → `[RUTE] Fitur baru (PRIBADI): Hexa → Dina`.

Passing = every artifact of the route exists, `specs/HANDOFF.md` has the `[RUTE]` entry and one entry per phase, Dina's last `STATUS:` is `APPROVED`, the commit was offered, and on `main`/`master` the branch question was asked (a `[BRANCH]` entry if approved) and the push/PR offer followed the commit. If a phase produces no artifact, stop and inspect that phase rather than continuing.

## Eval berulang (headless)

One run proves little: on 2026-10-30 the same prompt on the same fixture gave `APPROVED` once and `REJECTED` once. Before and after a change to `/agents` or a persona, run this three times per condition and compare the medians.

Fixture: a new empty folder outside this repo, `git init -b main`, these five files, one commit.

- `CLAUDE.md`: `Scale: PRIBADI`, `UI language: English`, `Code language: English`, `Stack: Python 3 (stdlib only), unittest`, `Commands: python -m unittest`, `Layout: src/, tests/, specs/`.
- `specs/ROADMAP.md`: an epic table with `E1 | Slugify | M1 | - | specs/prd/E1-slugify.md | todo` and `E2 | Truncate and join | M1 | E1 | | todo`.
- `specs/PRD.md`: a product index with `Current PRD: specs/prd/E1-slugify.md`.
- `specs/prd/E1-slugify.md`: `slugify(text: str) -> str` in `src/slugkit/slugify.py`, requirements FR-SLUG-001..006 (lowercase; runs of spaces or punctuation become one `-`; no `-` at either end; accented Latin folds to ASCII; no letters or digits gives `""`; a non-string raises `TypeError`), each with one Given/When/Then.
- `specs/HANDOFF.md`: one `## [SCAFFOLD] autor` entry, to check that the epic archive leaves it in place.

Run from the fixture folder:

```bash
claude -p "kerjakan E1. Proyek PRIBADI. Mulai pipeline." --model sonnet --permission-mode acceptEdits \
  --allowedTools "Agent Skill Read Write Edit Glob Grep Bash(python*) Bash(git status*) Bash(git diff*) Bash(git log*) Bash(date*) Bash(ls*)" \
  --max-budget-usd 4 --output-format stream-json --verbose > run.jsonl
```

Record per run: cost, duration, and turns from the `result` line; Dina's last `STATUS:`; `python -m unittest` count; and pass or fail for each of these:

1. The orchestrator's first write is the `[RUTE]` entry with `Epic: E1`, before any Agent call.
2. `specs/ROADMAP.md` gets the pipeline table with `☐` rows before Hexa starts.
3. Hexa's entry has `Ponytail:`, `TDD:` with red evidence, and exactly `UI: tidak`.
4. The orchestrator writes nothing under `src/` or `tests/`.
5. Each persona row in the ROADMAP ends with `<n>K token, <m> menit`.
6. On `APPROVED`: no commit can be approved headless, so the epic stays `in progress`, `specs/handoff/E1.md` does not exist, and `Current PRD:` still points at E1. On `REJECTED`: the run stopped with Lanjut / Revisi / Stop and no patch round started.

Headless runs cannot answer the branch or commit questions, so the archive on **Commit** and its undo on **Lewati** need an interactive run.
