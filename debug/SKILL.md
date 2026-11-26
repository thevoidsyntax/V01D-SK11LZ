---
name: debug
description: "Root-cause debugging: reproduce, isolate, test ranked hypotheses, fix the cause, verify with the original repro."
when_to_use: "Use when a bug, failing test, crash, or wrong output has no known cause yet, before changing any code. Stops after 3 failed fixes."
metadata:
  version: "1.0.0"
---

# Debug

No fix before a root cause. A change made to see if it helps is a guess, and a guess that passes hides the bug.

## 1. Reproduce

- [ ] One exact command or input that fails, run now, with the real output captured (error text, stack trace, wrong value).
- [ ] If it cannot be reproduced, say so and ask for the missing input. Do not fix what you cannot see fail.
- [ ] Flaky: run it 10 times and record the rate. A flaky failure is a race, shared state, time, or order until shown otherwise.

## 2. Isolate

- [ ] Shrink the failing input or the failing test to the smallest case that still fails.
- [ ] Read the real error top to bottom, then the code at the frame it names. Not the one you expect it to name.
- [ ] Regression: `git bisect` or `git diff <last-good>` finds the change that introduced it.
- [ ] Walk the data backwards from the wrong value to the first place it was already wrong.

## 3. Hypotheses

Write at most three, each with the observation that would prove it wrong.

| Hypothesis | Would be wrong if | Cheapest check |
|------------|-------------------|----------------|
| `user_id` is null after the cache hit | the log shows a non-null id at line 88 | one log line, rerun |

- Test the cheapest first, one variable at a time. Add a log or an assertion, not a fix.
- Record each hypothesis as confirmed or ruled out, with the output that decided it.

## 4. Fix

- [ ] The change sits at the cause, not at the symptom: no catch-and-ignore, no retry on a deterministic failure, no `sleep` for a race.
- [ ] Behavior bug: a failing test first (`/tdd`), then the fix. The test is the original repro, kept.
- [ ] Surgical: no cleanup or refactor of the code around it in the same change.

## 5. Verify

- [ ] The original repro from section 1 now passes, run again, not assumed.
- [ ] The full suite is green, with the project's own command.
- [ ] Callers and siblings of the changed code checked for the same defect.

## 6. Stop rule

Three failed fixes on the same bug: stop. Write what was ruled out and what the evidence says now, then question the assumption underneath (wrong layer, wrong spec, wrong tool) and ask the user. Inside `/agents`, write `Open: needs Sven` in the HANDOFF entry.

## 7. Anti-patterns

| Anti-pattern | What it hides |
|--------------|---------------|
| Fix first, explain later | The bug moves; the cause stays |
| Several changes at once | The one that mattered is unknown |
| Blaming the library or the environment without a minimal repro | The defect is usually in your own call |
| Deleting the failing test or loosening the assertion | The failure is gone, the bug is not |
| "Should work now" | Nothing. Only a rerun is evidence |

## 8. Result line

```text
debug: cause src/cart.ts:88 (stale price read after cache hit)
- repro: npm test -- cart.spec.ts → "expected 40, got 55"
- ruled out: 2 (rounding, currency mix)
- verified: same command green; full suite 212/212
```

The repro and verify lines are copied from real runs. Never write them from memory.
