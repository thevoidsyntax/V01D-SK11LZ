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

## Fixture

A new empty folder outside this repo, `git init -b main`, one commit per stage:

- `CLAUDE.md`: `Scale: PRIBADI`, `UI language: English`, `Code language: English`, `Artifact language: English`, `Stack: Python 3 (stdlib only), unittest`, `Commands: python -m unittest`, `Layout: src/, tests/, specs/`.
- `specs/prd/E1-slugify.md`: six requirements for `slugify(text: str) -> str` in `src/slugify.py` (lowercase; runs of spaces or punctuation become one `-`; no `-` at either end; diacritics fold to their ASCII base and the 21 letters without one — `ø Ø æ Æ œ Œ ß ẞ đ Đ ł Ł ð Ð þ Þ ħ Ħ ŋ Ŋ ı` — fold to the closest ASCII spelling; no letters or digits gives `""`; a non-string raises `TypeError`).
- `src/slugify.py` and `tests/test_slugify.py`: one clean implementation with nine passing tests, including a table-driven test over every letter the PRD names. The code must be clean: a HIGH finding about the code would make case A a rejection for the wrong reason, and cases B and C would fail for a reason that has nothing to do with language. An earlier fixture version left 19 of the 22 fold letters unasserted and carried an unreachable table row; a code HIGH about the fold table rejected case B for a reason that had nothing to do with the marker. That fixture is fixed here.
- `specs/.audit-base`: the SHA of the commit before the Hexa work, so `/audit` scopes itself to the diff.
- `specs/HANDOFF.md`: one Hexa entry with `Ponytail:`, `TDD:` (red evidence naming a test that exists in `tests/`), `UI:` and `Files:`. It is the last persona entry, because Dina cross-checks the latest Hexa entry.
- The case file, added after the baseline commit: `specs/NOTES.md` (A, Indonesian prose), nothing (B), or `specs/GLOSSARY.md` (C, a table with one non-English term).

The fixture is disposable. Rebuild it before every run — Dina appends to `specs/HANDOFF.md` and rewrites `specs/.audit-base`.

The implementation under audit, clean on purpose:

```python
"""Turn a text into a URL-safe slug."""

import re
import unicodedata

_NON_SLUG = re.compile(r"[^a-z0-9]+")

_FOLD = str.maketrans(
    {
        "ø": "o", "Ø": "O",
        "æ": "ae", "Æ": "AE",
        "œ": "oe", "Œ": "OE",
        "ß": "ss", "ẞ": "SS",
        "đ": "d", "Đ": "D",
        "ł": "l", "Ł": "L",
        "ð": "d", "Ð": "D",
        "þ": "th", "Þ": "TH",
        "ħ": "h", "Ħ": "H",
        "ŋ": "n", "Ŋ": "N",
        "ı": "i",
    }
)


def slugify(text: str) -> str:
    """Return the slug of *text*."""
    if not isinstance(text, str):
        raise TypeError("text must be a string")
    decomposed = unicodedata.normalize("NFKD", text)
    cleaned = "".join(
        ch
        for ch in decomposed
        if unicodedata.category(ch) not in ("Mn", "Cf")
    )
    folded = cleaned.translate(_FOLD).lower()
    return _NON_SLUG.sub("-", folded).strip("-")
```

The test file holds nine cases: lowercase and punctuation, separator stripping, empty text, diacritics, the letters without an ASCII base, capital ẞ, text without letters or digits, a non-string raising `TypeError`, and one table-driven case over the 21 letters the PRD names.

The Hexa entry in `specs/HANDOFF.md`, last persona entry in the file:

```markdown
## [PHASE 1] Hexa — 2026-11-01T09:00:00Z
Input: specs/prd/E1-slugify.md
Output: src/slugify.py, tests/__init__.py, tests/test_slugify.py
Decisions: stdlib only, no new dependency.
Open: -
Next: Dina
Ponytail: stdlib re and unicodedata are enough, no new package.
TDD: red — python -m unittest reported ModuleNotFoundError: No module named 'slugify' before src/slugify.py existed; green — python -m unittest reports 9 tests OK.
UI: no
Files: src/slugify.py, tests/__init__.py, tests/test_slugify.py
```

Case B is the same file with `UI: tidak` in place of `UI: no`. Case C adds a `specs/GLOSSARY.md` after the baseline commit:

```markdown
# Glossary

| Indonesian (UI) | English (code) |
|---|---|
| Masukkan nama | enter_name |
```

Case A adds a `specs/NOTES.md` after the baseline commit, Indonesian prose, no code, no table.

## Run

From the fixture folder:

```bash
claude -p "You are **Dina** (QA & Security Auditor). Invoke the \`/dina\` skill and follow its whole workflow. Read only these artifacts: the project CLAUDE.md, specs/HANDOFF.md, specs/.audit-base, specs/, src/, tests/. Produce: specs/AUDIT.md plus everything your workflow writes (the specs/HANDOFF.md entry; for Dina also specs/.audit-base). Write artifacts in English; UI copy follows the project's \`UI language:\`. Keep your reply to a one-line handoff summary." \
  --model sonnet --effort high --permission-mode acceptEdits \
  --allowedTools "Agent Skill Read Write Edit Glob Grep Bash" \
  --max-budget-usd 5 --output-format json > run.json
```

The prompt is the one `/agents` uses for a Dina phase, so the run measures the rule as the pipeline applies it.

Two traps, both paid for in the first attempt:

- **Narrow the Bash allowlist and the run burns its budget.** A denied command (`rm -rf` in a scratch copy, to verify the red-phase claim) is retried, and the denial loop cost $3.08 and 37 turns before the budget stopped it. With `Bash` allowed the same run finished in $0.73.
- **Write the run output outside the fixture.** `run.json` and `__pycache__/` inside it are untracked files in the repo under audit, and Dina reports them.

## Score

Read `specs/AUDIT.md` in the fixture, not the one-line reply: the reply says what blocked, the report says what was found.

- **A passes** when the status is `REJECTED` and the finding on `specs/NOTES.md` is blocking (HIGH, CRITICAL, or marked BLOCKING). A rejection whose only finding is about the code is not a pass.
- **B passes** when the status is `APPROVED` and no finding is about the `UI:` marker.
- **C passes** when the status is `APPROVED` and no finding names `specs/GLOSSARY.md`.

One run proves little — the same fixture gave a blocking finding once and a MEDIUM once before the severity was pinned. Run each case three times and compare the medians, as `agents/smoke-test.md` does.

## Measured

Runs on 2026-11-01, headless, one Dina phase per run, Sonnet at effort high, scored on `specs/AUDIT.md` (the status line and the findings) rather than on the one-line reply. The fixture went through three versions, because a fixture with a defect of its own produces findings that have nothing to do with the rule under test:

- **v1** — the fixture as first built: clean implementation, eight tests.
- **v2** — v1 plus a table-driven test over every letter the PRD names, the unreachable `İ` row dropped, and the red evidence stated as the reproducible `ModuleNotFoundError`. Under v1 a code HIGH about the fold table rejected case B for a reason that had nothing to do with the marker.
- **v3** — case C only: the project declares `UI language: Indonesian`, so the glossary's "Indonesian (UI)" column agrees with the project. Under v1 and v2 Dina wrote one LOW about that header — a finding about the fixture, not about the term, which was never flagged.

| Case | Fixture | Run | Verdict | Status line and findings | Cost | Duration | Turns |
|------|---------|-----|---------|-------------------------|------|----------|-------|
| A | v1 | 1 | pass | REJECTED — HIGH on `specs/NOTES.md` | $0.73 | 147 s | 21 |
| A | v1 | 2 | pass | REJECTED — HIGH on `specs/NOTES.md` | $1.05 | 235 s | 26 |
| A | v1 | 3 | pass | REJECTED — HIGH on `specs/NOTES.md` | $0.85 | 146 s | 19 |
| A | v2 | 4 | pass | REJECTED — HIGH on `specs/NOTES.md` | $0.85 | 150 s | 23 |
| A | v3 | 5 | pass | REJECTED — HIGH on `specs/NOTES.md` | $0.87 | 107 s | 19 |
| A | v3 | 6 | pass | REJECTED — HIGH on `specs/NOTES.md` | $0.90 | 141 s | 19 |
| B | v1 | 1 | **fail** | REJECTED — a code HIGH on the fold table; the `UI: tidak` marker drew no finding | $0.72 | 238 s | 19 |
| B | v1 | 2 | pass | APPROVED | $1.25 | 233 s | 26 |
| B | v1 | 3 | pass | APPROVED | $1.03 | 186 s | 20 |
| B | v2 | 4 | pass | APPROVED | $1.27 | 155 s | 24 |
| B | v2 | 5 | pass | APPROVED | $1.35 | 223 s | 25 |
| C | v1 | 1 | pass | APPROVED — "the glossary holds 'Masukkan nama' in its Indonesian column — exempt by design" | $1.33 | 152 s | 26 |
| C | v1 | 2 | **fail** | APPROVED, but one LOW on the fixture's own glossary header, not on the term | $1.51 | 373 s | 22 |
| C | v3 | 4 | pass | APPROVED | $1.20 | 217 s | 27 |
| C | v3 | 5 | pass | APPROVED | $1.02 | 180 s | 23 |

Reading the table:

- **A: 6/6.** The paragraph was a blocking finding every time, on a fixture whose code was clean apart from the fold-table gap that v2 closed.
- **B: 4/5.** The `UI: tidak` marker drew **no finding in any of the five runs** — the one rejection was about the fixture's untested fold table, and the run that passed said so explicitly ("`UI: tidak` — a single accepted wording, not mixed"). The old wording stays accepted.
- **C: 3/4.** The non-English term was never a finding. The single LOW was about the fixture's header, and the coherent fixture (v3) removes it.

Cost: 15 runs, **$15.93** in total, $0.72–$1.51 per run, 107–373 s each. Two traps cost more than the whole eval: a Bash allowlist too narrow made Dina retry denied commands until the budget stopped a run (37 turns, $3.08), and writing `run.json` inside the fixture turned the run's own output into an untracked finding.

Not proved here: the route's reaction to a `REJECTED`, and the pipeline as a whole. Those belong to `agents/smoke-test.md`.
