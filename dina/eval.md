# Eval the Dina language gate

For humans; not loaded automatically.

Every language rule in this repo is an instruction to a model, so it only counts once a real run proves it. This eval runs **Dina alone** — not the whole `/agents` route — on three fixtures, and scores what she wrote. A rule that has only been written down has not been proved.

The three cases are the three claims the language rules make:

| Case | Fixture | Expected |
|------|---------|----------|
| A | a new Indonesian prose paragraph in `specs/NOTES.md` | `STATUS: REJECTED`, and the paragraph is a **blocking** finding |
| B | the last Hexa HANDOFF entry reads `UI: tidak` | `STATUS: APPROVED`, no finding on the marker |
| C | `specs/GLOSSARY.md` with one non-English term | `STATUS: APPROVED`, no finding on the glossary |

A is the case that can silently stop working: a finding graded MEDIUM is a note, not a gate, and the route keeps going with the paragraph still there.

## Why Dina alone

`/agents` costs six phases and most of that is work this eval does not measure. The gate is one phase, it reads a fixed set of files, and it can be run directly — so a rule change costs one spawn instead of a whole route. Case B needs a HANDOFF entry that is the **last** Hexa entry, and case C needs a diff with no other change: a full route cannot produce that state without writing new code first, so a fixture is the only way to reach it. The cost of the full route is measured separately in `agents/smoke-test.md`.

## Reproduce

The fixture, the run and the score are all in this repo, so a run is reproducible without writing anything from scratch:

```bash
# build the fixture, run Dina headless on it, score the report
bash dina/eval-run.sh a /path/to/work-dir        # case b or c for the others
```

`dina/eval-run.sh` does the three steps below. They are also there separately, because each one is worth running on its own.

```bash
# 1. build the fixture: a new git repo with the project, the PRD, the code,
#    the tests, and the case file. One commit per stage.
bash dina/eval-fixture.sh a /path/to/work-dir/fixture

# 2. run Dina headless in that directory. The prompt is the one /agents uses
#    for a Dina phase, so the run measures the rule as the pipeline applies it.
claude -p "You are **Dina** (QA & Security Auditor). Invoke the \`/dina\` skill and follow its whole workflow. ..." \
  --model sonnet --effort high --permission-mode acceptEdits \
  --allowedTools "Agent Skill Read Write Edit Glob Grep Bash" \
  --max-budget-usd 5 --output-format json > /path/to/work-dir/run.json

# 3. score the report the run left in the fixture
python dina/eval-verify.py /path/to/work-dir/fixture a --run-json /path/to/work-dir/run.json
```

The fixture is disposable: Dina appends to `specs/HANDOFF.md` and rewrites `specs/.audit-base`, so build a fresh one per run. `dina/eval-fixture.sh` refuses to build into a directory that is not empty rather than deleting it.

Build it outside `~/.claude/` — the system temp dir is the safe place, and the first trap below says why.

Three traps, all paid for, are avoided in `dina/eval-run.sh`:

- **Put the fixture outside `~/.claude/`.** The harness sandbox denies writes under the Claude config dir, so `Write`, `Edit` and every `Bash` write in the fixture are refused. The persona then looks for a way around it — thirteen denied calls in one run — and the budget runs out before a verdict exists: `error_max_budget_usd`, 60 turns, $5.12, no `specs/AUDIT.md`. A probe run confirms it: the same write succeeds in the system temp dir and is denied under `~/.claude/`. Build the fixture in the temp dir, or wherever else the harness lets the persona write.
- **Narrow the Bash allowlist and the run burns its budget.** A denied command (`rm -rf` in a scratch copy, to verify the red-phase claim) is retried, and the denial loop cost $3.08 and 37 turns before the budget stopped it. With `Bash` allowed the same run finished in $0.73.
- **Write the run output outside the fixture.** `run.json` and `__pycache__/` inside it are untracked files in the repo under audit, and Dina reports them.

## The fixture

`dina/eval-fixture.sh` is the source of truth for what the fixture contains. In short: a git repo with `CLAUDE.md` (`Scale: PRIBADI`, `UI language:`, `Code language: English`, `Artifact language: English`, `Stack:`, `Commands:`, `Layout:`), `specs/prd/E1-slugify.md` with ten requirements for `slugify(text: str) -> str`, `src/slugify.py` with one clean implementation, `tests/test_slugify.py` with twenty-one passing tests including a table-driven test over every letter the PRD names, `specs/.audit-base` with the SHA of the commit before the Hexa work, and `specs/HANDOFF.md` with one Hexa entry carrying `Ponytail:`, `TDD:` (red evidence naming a test that exists in `tests/`), `UI:` and `Files:`. The case file is added after the baseline commit: `specs/NOTES.md` (A), nothing (B), or `specs/GLOSSARY.md` (C) — and for A and C the case file is named in Hexa's `Output:` and `Files:` lines, because it is part of the commit under audit.

Two properties of the fixture are not cosmetic:

- **The code must be clean.** A HIGH finding about the code would make case A a rejection for the wrong reason, and cases B and C would fail for a reason that has nothing to do with language. An earlier fixture version left 19 of the 22 fold letters unasserted and carried an unreachable table row; a code HIGH about the fold table rejected case B for a reason that had nothing to do with the marker. The same thing happened twice more when the matrix was first measured: `unicodedata.normalize("NFKD", …)` expands compatibility characters (`"™"` → `"TM"`, `"№ 5"` → `"no-5"`), which breaks FR-SLUG-005, and a `Cf` character was deleted instead of acting as a separator. One run of the matrix found both as a HIGH and a MEDIUM and rejected case C for that reason. The builder now uses `NFD`, keeps `Cf` as a separator, and pins the three behaviors with tests and one extra PRD requirement, so the fixture cannot drift back into a state where the code is the finding.
- **The code has to survive an audit, not just a test suite.** The next version of the fixture passed its own twenty tests and was still wrong in three ways: canonical decomposition leaves the 18 Latin letters that only have a *compatibility* decomposition intact (`ǳ`, `ĳ`, `ſ`, `Ŀ`, …), so they were deleted instead of folded and `slugify("ǳzuri")` collided with `slugify("zuri")`; digits outside ASCII were dropped; spacing combining marks became separators. Dina found all three — one HIGH and one MEDIUM — and rejected cases B and C for the code, not for the rule. The fix exposed two more: the fold map has to run *after* the expansion (`ǽ` decomposes to `æ`, which then has to be folded too), and a modifier letter has to act as a separator rather than vanish (`"donʼt"` and `"don't"` must land on the same slug). The builder now expands only Latin letters — a blanket compatibility fold would transliterate Greek and Armenian letters and break FR-SLUG-007 — folds decimal digits to their ASCII value, treats every combining mark and modifier letter as it should be, and pins each of those behaviors with a test. Two full rounds of the matrix were spent on the fixture before the rule could be measured at all, which is the point of measuring it: a case that fails for the wrong reason looks like a rule that does not work.
- **The case file must be declared.** The case file is part of the commit under audit, so Hexa's `Output:` and `Files:` lines name it. Without that, Dina writes a scope-hygiene finding about the file itself — the case then measures the fixture instead of the rule.
- **Case C declares `UI language: Indonesian`.** The glossary's "Indonesian (UI)" column then agrees with the project, so the only thing left to complain about would be the term itself. Under a project that declares English, Dina wrote one LOW about the glossary header — a finding about the fixture, not about the term.

## Score

`dina/eval-verify.py` reads `specs/AUDIT.md` in the fixture, not the one-line reply: the reply says what blocked, the report says what was found. A finding is a section of the report under a severity heading; a file merely mentioned in a narrative section — the scanned table, the gate checklist, a language summary — is not a finding. The scorer reads every report shape Dina writes: `### HIGH` with a bolded entry, `## MEDIUM` with a bullet entry, and `### SEV HIGH — \`file\` — …`, where the heading carries the finding itself.

- **A passes** when the status is `REJECTED` and the finding on `specs/NOTES.md` is blocking (HIGH, CRITICAL, or marked BLOCKING). A rejection whose only finding is about the code is not a pass.
- **B passes** when the status is `APPROVED` and no finding is about the `UI:` marker.
- **C passes** when the status is `APPROVED` and no finding names `specs/GLOSSARY.md`.

One run proves little — the same fixture gave a blocking finding once and a MEDIUM once before the severity was pinned. Run each case three times and compare the medians, as `agents/smoke-test.md` does.

The scorer is checked against the reports of the earlier day: `dina/eval-verify.py` scores the thirteen archived `specs/AUDIT.md` files of the 2026-11-01 runs exactly as the table of that day recorded them — A 4/4 on the reports that survive, B 4/5 with the one rejection about the fixture's own code, C 3/4 with the one LOW about the fixture's own glossary header. A scorer that reads a different shape of report is a scorer that has never been checked.

## Measured

The matrix below was run on 2026-11-02: `/dina` 3.9.5, fixture v9 (21 tests, 10 requirements), built by `dina/eval-fixture.sh` in the system temp dir, Sonnet at high effort, headless, prompt from `dina/eval-run.sh`, nine runs started together. Scored by `dina/eval-verify.py` from each `specs/AUDIT.md`.

| Run | Fixture | `/dina` | Where | Verdict | Status line and findings | Cost | Duration | Turns |
|-----|---------|---------|-------|---------|-------------------------|------|----------|-------|
| A-1 | v9 | 3.9.5 | temp dir | **pass** | REJECTED, HIGH on `specs/NOTES.md:1-6` (Indonesian prose) | $1.58 | 276 s | 26 |
| A-2 | v9 | 3.9.5 | temp dir | **pass** | REJECTED, HIGH on `specs/NOTES.md:1` | $1.91 | 308 s | 28 |
| A-3 | v9 | 3.9.5 | temp dir | **pass** | REJECTED, HIGH on `specs/NOTES.md:1-6` | $2.61 | 708 s | 26 |
| B-1 | v9 | 3.9.5 | temp dir | **pass** | APPROVED, no finding on the `UI: tidak` marker | $2.43 | 479 s | 33 |
| B-2 | v9 | 3.9.5 | temp dir | **pass** | APPROVED, no finding on the marker | $1.82 | 403 s | 24 |
| B-3 | v9 | 3.9.5 | temp dir | **no verdict** | `API Error: 400 ... Invalid signature in thinking block`; no `specs/AUDIT.md` | $1.28 | 958 s | 17 |
| B-3, rerun | v9 | 3.9.5 | temp dir | **fail** | REJECTED, HIGH on `src/slugify.py:36-41` (U+212B ANGSTROM SIGN deleted); no finding on the marker | $0.28 | 60 s | 11 |
| C-1 | v9 | 3.9.5 | temp dir | **pass** | APPROVED, no finding on `specs/GLOSSARY.md` | $2.12 | 469 s | 30 |
| C-2 | v9 | 3.9.5 | temp dir | **fail** | REJECTED, HIGH on `src/slugify.py:40` (U+212B ANGSTROM SIGN deleted); audit states "No language findings" and the glossary is not a finding | $2.41 | 706 s | 36 |
| C-3 | v9 | 3.9.5 | temp dir | **pass** | APPROVED, no finding on `specs/GLOSSARY.md` | $1.23 | 283 s | 26 |

Total for the nine cases and the one rerun: $17.67.

| Case | `/dina` 3.9.4, fixture v4 (earlier matrix) | `/dina` 3.9.5, fixture v9 |
|------|-------------------------------------------|---------------------------|
| A | 3/3 | 3/3 |
| B | 3/3 | 2/3, plus one run lost to an API error and rerun |
| C | 1/3 | 2/3 |

**The matrix is not clean: 7 of 9 cases pass, and the 2 that fail do so for the same reason, which is not the language rule.** B-3 (on its rerun) and C-2 were rejected for one HIGH in the fixture's code: `_fold_latin` gates on `"LATIN" in unicodedata.name(ch)`, so U+212B ANGSTROM SIGN skips the fold and is deleted (`slugify("10Å")` gives `"10"`). Neither audit has a finding on the marker or the glossary, and both state the language check came out clean. The scorer reads a `REJECTED` status as a failed B or C, which is the right call: the case file is fine, the fixture still has a bug, and a rule cannot be called measured on a run the code rejects. The other seven audits that reached a verdict did not report U+212B, so the defect is real but a run finds it only some of the time (2 of 9). The fixture is **not** changed here; fixing it means a new fixture version and a new matrix.

What this matrix does show:

- **A held in 3 of 3.** The Indonesian paragraph was a blocking finding every time, graded HIGH, never MEDIUM.
- **The marker was never flagged.** In all three B audits that finished, `UI: tidak` was accepted as written.
- **The glossary rule worked.** In 3 of 3 C audits the glossary produced no finding, against 2 of 3 audits on `3.9.4` that had a finding naming it (a LOW on `specs/GLOSSARY.md:4` and a scope LOW for the undeclared case file). C-2 failed on the code, not on the glossary.

**The earlier matrix (`/dina` 3.9.4, fixture v4): A 3/3, B 3/3, C 1/3.** The two C failures were a LOW on `specs/GLOSSARY.md:4` (a non-English term read as a violation of the glossary exemption) and a scope-hygiene LOW because the case file was not declared in Hexa's `Files:`. Both were corrected: `dina/SKILL.md` 3.9.5 states that a glossary row is never a finding at any severity, and the fixture declares the case file.

**Rounds v6, v7 and v8 failed on the fixture, not the rule.** Each was a full matrix attempt, and each was rejected for a code defect that had nothing to do with language: Latin letters with only a compatibility decomposition deleted (v6), the fold running before the decomposition and a modifier letter deleted (v7), and `ŉ` becoming a separator, with the PRD letter table tested only in isolation (v8). The audits praised the marker and found the diff English each time. Their directories are evidence of the failure, not of the rule, and are not in the table above.

What is still open:

- **The fixture has a sixth code defect** (U+212B, and by the same gate any canonical singleton whose name lacks `LATIN`). The audits suggest `unicodedata.normalize("NFC", text)` first, or testing the NFKD base instead of the name.
- **Each round of the fixture has uncovered another Unicode hole.** Dina fuzzes the whole code point range, so a slugifier with a PRD this broad is a moving target. A smaller PRD (ASCII plus a short list of folded letters) would stop the chase and is worth weighing before a seventh round.
- The earlier table of 2026-11-01 (15 runs: A 6/6, B 4/5, C 3/4) stays as that day's record. It mixed fixture versions, and its runs carry no `/dina` version, so it is not comparable with this matrix.

Not proved here: the route's reaction to a `REJECTED`, and the pipeline as a whole. Those belong to `agents/smoke-test.md`.
