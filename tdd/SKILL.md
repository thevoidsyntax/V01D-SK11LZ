---
name: tdd
description: "Test-first discipline for behavior changes: red-green-refactor with a checklist and recorded evidence, so a test proves the behavior instead of documenting the code"
when_to_use: "Use when writing or changing code with testable behavior, before writing the implementation. Hexa runs it before implementing; Dina checks the recorded evidence."
metadata:
  version: "1.1.0"
---

# TDD — Red → Green → Refactor

The failing test comes first and is the evidence. A test written after the implementation documents the code; a test written first pins the requirement.

## 1. Scope

Applies to every behavior change: new functions, changed contracts, bug fixes, error and edge handling.

Out of scope, and each needs a one-line reason in the HANDOFF entry: pure markup or styling with no logic, generated code, config values with no branching. A change that only looks wrong still gets a test when it carries behavior.

## 2. Red

- [ ] The test file is written before the implementation file.
- [ ] It fails for the right reason: the assertion about the new behavior fails. A typo, a missing import, or a broken fixture is not a red phase.
- [ ] The failure output is captured from a real run — the assertion message, not "test failed".
- [ ] The test name states the behavior: `test_rejects_expired_token`, not `test_validate_2`.

When the module does not exist yet, the first run fails at import. That is not a red phase. Add a stub that only makes the module importable — the function returns a wrong value — run again, and let the assertion fail. The stub is not the implementation: it is replaced in green.

## 3. Coverage map

One row per acceptance criterion from `specs/PRD.md` or the contracts, each with the test that covers it. A criterion without a test is either an unwritten feature or a missing test — never a silent drop.

| Criterion | Test | Status |
|-----------|------|--------|
| PRD-2 expired token → 401 | `test_rejects_expired_token` | red → green |

## 4. Green

- [ ] The implementation is the minimum that makes the failing test pass.
- [ ] No behavior beyond that test: no speculative options, flags, or config knobs.
- [ ] Error and edge cases have their own test: empty, null, boundary, invalid input, retry or concurrency where it applies.

## 5. Refactor

- [ ] Duplication removed while the suite stays green.
- [ ] Names state the behavior, not the mechanics.
- [ ] No behavior change inside a refactor. A behavior change is a new red test first.

## 6. Green evidence

- [ ] The full suite was run before the handoff, with the command listed under `Commands:` in the project `CLAUDE.md`.
- [ ] The suite was green before the change too, so a new failure is not a pre-existing one.

## 7. When a test cannot come first

A spike, a throwaway script, or a rendering decision may not be pinnable by a test. Write `TDD: waived — <reason>` in the HANDOFF entry, and the behavior still gets a test before the phase closes.

## 8. Anti-patterns

| Anti-pattern | What it hides |
|--------------|---------------|
| Implementation first, test after | The test is written to match the code, so it passes whatever the code does |
| A test that asserts the mock | The behavior is never exercised |
| One green test per feature, errors untested | The failure modes are the ones users hit |
| Snapshot of internals | The test breaks on every refactor and protects nothing |
| Green suite claimed without a run | Nothing. The suite is not evidence unless it was run |

## 9. Checklist result

Run it on your own output before the handoff, then put the result in the HANDOFF entry:

```text
TDD: PASS 4/4
- red: test_rejects_expired_token failed with "expected 401, got 200"
- green: 4/4 passed (pytest -q)
- map: PRD-2 → test_rejects_expired_token, PRD-3 → test_expired_token_is_not_renewed
```

Only a full pass goes to Dina. A waived item is written as `TDD: PASS 3/4, waived red — <reason from section 7>` and counted separately.

The red line is copied from a real run. Never write it from memory: an invented red phase is the failure this skill exists to prevent.
