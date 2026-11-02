# Smoke-test `/agents`

For humans; not loaded automatically.

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

Passing = every artifact of the route exists, `specs/HANDOFF.md` has the `[ROUTE]` entry and one entry per phase, Dina's last `STATUS:` is `APPROVED`, the commit was offered, and on `main`/`master` the branch question was asked (a `[BRANCH]` entry if approved) and the push/PR offer followed the commit. If a phase produces no artifact, stop and inspect that phase rather than continuing.

## Eval berulang (headless)

One run proves little: on 2026-10-30 the same prompt on the same fixture gave `APPROVED` once and `REJECTED` once. Before and after a change to `/agents` or a persona, run this three times per condition and compare the medians.

### Fixture

`agents/smoke-fixture.sh` builds it, so the fixture is a file in this repo and not a description somebody has to rebuild from prose:

```bash
bash agents/smoke-fixture.sh clean /path/to/work-dir/fixture
```

It writes a new empty git repo (`git init -b main`, one commit) with:

- `CLAUDE.md`: `Scale: PRIBADI`, `UI language: English`, `Code language: English`, `Artifact language: English`, `Stack: Python 3 (stdlib only), unittest`, `Commands: python -m unittest`, `Layout: src/, tests/, specs/`.
- `specs/ROADMAP.md`: an epic table with `E1 | Slugify | M1 | - | specs/prd/E1-slugify.md | todo` and `E2 | Truncate and join | M1 | E1 | | todo`.
- `specs/PRD.md`: a product index with `Current PRD: specs/prd/E1-slugify.md`.
- `specs/prd/E1-slugify.md`: `slugify(text: str) -> str` in `src/slugkit/slugify.py`, requirements FR-SLUG-001..006 (lowercase; runs of spaces or punctuation become one `-`; no `-` at either end; accented Latin folds to ASCII; no letters or digits gives `""`; a non-string raises `TypeError`), each with one Given/When/Then.
- `specs/HANDOFF.md`: one `## [SCAFFOLD] autor` entry, to check that the epic archive leaves it in place.

Two more variants measure the branches the clean fixture cannot reach:

- **`planted`** — the clean fixture plus one untracked file, `src/legacy_export.py`, with a real defect: `read_template` joins an unchecked `name` onto a base directory and opens it, so `name` can walk out of that directory. `/audit` scans untracked files, so the gate finds it and the route has to react to a `REJECTED`. The file is untracked on purpose: it is not part of the epic's work, so a `Files:` list that omits it is correct.
- **`units`** — the clean fixture plus a `specs/ADR.md` with a `Work units` table of four units (`core`, `http`, `cli`, `integration`) and a PRD that gives the http unit work in `src/slugkit/slugify.py`, the same file the core unit owns. That is the parallel branch, and the overlap is the collision the batch scope check has to find.

```bash
bash agents/smoke-fixture.sh planted /path/to/work-dir/fixture
bash agents/smoke-fixture.sh units /path/to/work-dir/fixture
```

### Run

From the fixture folder, with the run output written **outside** it — a `run.jsonl` inside the fixture is an untracked file in the repo under audit, and the audit reports it:

```bash
claude -p "kerjakan E1. Proyek PRIBADI. Mulai pipeline." --model sonnet --permission-mode acceptEdits \
  --allowedTools "Agent Skill Read Write Edit Glob Grep Bash" \
  --max-budget-usd 10 --output-format stream-json --verbose > ../run.jsonl
```

The Bash allowlist is wide on purpose. A narrow allowlist makes a persona retry the denied command until the budget runs out; in the language eval that cost $3.08 and 37 turns in one run and produced no verdict.

**Build the fixture outside `~/.claude/`.** The harness sandbox denies writes under the Claude config dir, so every `Write`, `Edit` and `Bash` write inside such a fixture is refused, and the route looks for a way around it until the budget is gone. The system temp dir works.

Record per run: cost, duration, and turns from the `result` line; Dina's last `STATUS:`; `python -m unittest` count; and pass or fail for each of these:

1. The orchestrator's first write is the `[ROUTE]` entry with `Epic: E1`, before any Agent call.
2. `specs/ROADMAP.md` gets the pipeline table with `☐` rows before Hexa starts.
3. Hexa's entry has `Ponytail:`, `TDD:` with red evidence, and a `UI:` line saying no (`UI: no` or `UI: tidak`).
4. The orchestrator writes nothing under `src/` or `tests/`.
5. Each persona row in the ROADMAP ends with `<n>K token, <m> menit`.
6. On `APPROVED`: no commit can be approved headless, so the epic stays `in progress`, `specs/handoff/E1.md` does not exist, and `Current PRD:` still points at E1. On `REJECTED`: the run stopped with Lanjut / Revisi / Stop and no patch round started.
7. **Scope, one phase.** Hexa's HANDOFF entry carries a `Files:` line, and the tracked files whose `git status --short` differs from the snapshot taken before the phase are exactly those files. A tracked file outside the list sends the phase back to Hexa before Dina; an untracked file outside the list is reported but does not stop the run.
8. **Reaction to `REJECTED`.** On `planted`: Dina's status is `REJECTED` with a finding on the planted file, the run prints the red progress line and the findings, and it does not patch the file itself. Headless there is nobody to ask, so the run stops with Lanjut / Revisi / Stop — the patch loop needs an interactive run.
9. **Parallel batch.** On `units`: the orchestrator takes the parallel branch (one Agent message with the units of the first wave, one spawn per unit with `Unit: <name>` and its owned files), the batch scope check compares `git status --short` with the owned files, and a file that two units own is reported and stops the run instead of being merged by hand.

Headless runs cannot answer the branch or commit questions, so the archive on **Commit** and its undo on **Lewati** need an interactive run.

## Measured

Two headless runs on 2026-11-01, one per variant, both built by `agents/smoke-fixture.sh`, prompt "kerjakan E1. Proyek PRIBADI. Mulai pipeline.", Sonnet, `--max-budget-usd 10`, stream-json written outside the fixture.

| Run | Fixture | Criteria | Cost | Duration | Turns | Verdict |
|-----|---------|----------|------|----------|-------|---------|
| 1 | `planted` | 7 (scope, one phase), 8 (`REJECTED`) | $3.57 | 694 s | 29 | **7 pass, 8 pass** |
| 2 | `units` | 9 (parallel batch) | $4.85 | 537 s | 35 | **9 pass** |

**Criterion 7 — scope, one phase: pass.** The orchestrator wrote the baseline with `git status --short > /tmp/hexa_baseline.txt` before the Hexa spawn and re-read `git status --short` after it. Hexa's `Files:` line named `src/slugkit/__init__.py`, `src/slugkit/slugify.py`, `tests/__init__.py`, `tests/test_slugify.py`. No tracked file outside the list changed. The one file outside the list, the planted `src/legacy_export.py`, is untracked, so it was reported and the phase stayed green — which is the rule: an untracked file outside the list does not stop the run.

**Criterion 8 — reaction to `REJECTED`: pass.** Dina's status was `REJECTED` with a HIGH on `src/legacy_export.py:8` (path traversal: `read_template()` joins an unchecked `name` onto `base_dir`, and the audit read a `SECRET` file from outside that directory), one MEDIUM (module in `src/` with no test) and two LOW. The run printed the red progress line `[PROGRES] E1 · Dina ❌` and the findings table. It did not patch the file: after the run, `src/legacy_export.py` was byte-identical to the copy the builder wrote. It stopped with Lanjut / Revisi / Stop because the interactive tool is unavailable headless, and the epic stayed `in progress` with `Current PRD:` still at E1. The patch loop itself is still unmeasured — that needs an interactive run.

**Criterion 9 — parallel batch: pass.** The orchestrator took the parallel branch and spawned both wave-1 units 0.3 s apart — `Hexa unit core` and `Hexa unit http`, each prompt carrying `Unit: core` / `Unit: http` and `Owned files: …`. After the wave it ran `git status --short --untracked-files=all` and compared that with the owned lists: `src/slugkit/slugify.py` was written by **both** units, because `core` owns it and `http` owns it too (FR-HTTP-002 puts `slugify_query` in that same module, and the ADR says so). The run reported the collision and stopped instead of merging the file by hand. The two units told different stories — `http` reported that `core` overwrote its stub mid-run, `core` reported that it preserved `slugify_query` — and the surviving file is coherent, 25/25 tests green. The `cli` and `integration` waves never started.

One deviation from the wording of criterion 9: the two wave-1 spawns were two assistant messages 0.3 s apart, not one message carrying both calls. The wave semantics held — both units ran at the same time.

One fixture defect the run exposed: no unit owns `tests/__init__.py`, so the project's own command `python -m unittest` discovered **0 tests** in the `units` fixture. The `units` variant needs that file in a unit's owned list before the next run.

Criterion 8 has a limit that no headless run can get past: the patch loop needs an answer, and headless has nobody to ask. A headless run proves the route *stops* on a `REJECTED`; the loop itself needs an interactive session.

Earlier runs of the older six criteria (2026-10-30, 2026-11-01) are in the CHANGELOG of this repo; they measured the route, not the scope check, and they ran with a fixture that no longer exists on disk — `agents/smoke-fixture.sh` builds the current one.
