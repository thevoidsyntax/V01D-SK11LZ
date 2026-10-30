---
name: ponytail
description: "Code-less philosophy - 'The best code is the code you never wrote.' Minimizes code written by checking need, existing, stdlib, and native solutions first."
when_to_use: "Use when you want to minimize code written. Invoke before writing any code to check if it's necessary. Hexa runs it before code, Athena before adding a component to the design, Frans before adding infrastructure."
metadata:
  version: "1.2.0"
---

# PONYTAIL — the best code is the code you never wrote

Before writing code, ask in this order and stop at the first YES:

1. **NEED** — Is it required? Can it be skipped, deferred, or simplified (must-have vs nice-to-have)? YES → skip or shrink it.
2. **EXISTING** — Does the code base or an already-installed dependency do it? Search before writing. YES → reuse it.
3. **STDLIB** — Does the language's standard library cover it (Python `itertools`/`collections`, JS `Array`/`Object`/`Intl`, Go std, Rust std)? A third-party library is not stdlib; add one only when it clearly beats a few lines. YES → use it.
4. **NATIVE** — Does the platform do it (CSS instead of JS, `<input type="date">`, SQL constraint or function instead of app code, a shell tool, Node built-ins `fs`/`path`/`crypto`)? YES → use it.
5. Only then **write the minimum**, nothing for hypothetical futures.

## What it never trims

Ponytail removes needless code, not required behavior. These are requirements, never "code to minimize": input validation, authorization, security checks, accessibility, error handling at boundaries, audit trails, idempotency, money and rounding correctness, transaction boundaries, and tests for behavior. If a rule in the project's `CLAUDE.md` or ADR demands it, it stays.

## Examples

- Dedupe preserving order: `list(dict.fromkeys(items))`, not a loop with `not in`.
- Group by key: one `reduce` with `??=`, or the library already in the project, not a new helper.
- Debounce: first check whether the project already imports one; write the 6-line version only if not.
- Authentication: NextAuth (or the project's existing auth) already present → use it, write no new auth code.

## Reviewing existing code

No sub-commands. To review a diff or module, run the same questions over each added function, file, and dependency: needed? already done by the code base, stdlib, or platform? List what can be deleted or replaced, with `file:line`.

## Output

When you decide to skip or reuse instead of write, say so in one line (this is the `Ponytail:` line in the HANDOFF entry): what was considered, and what you used instead.

*Based on: https://github.com/DietrichGebert/ponytail*
