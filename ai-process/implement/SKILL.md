---
name: implement
description: Implement a piece of work based on a spec or set of tickets
version: "1.0.0"
category: [process]
priority: high
phase: any
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: false
  conditions:
    - command: "/implement"
      reason: "Implementation invocation"
  skill_tier: core
capabilities: [implementation, generation]
quality:
  rules_count: 5
  examples_count: 0
  stability: stable
integrates_with: [tdd, pr-review, code-review]
source:
  origin: local
author: Claude
---

Implement the work described by the user in the spec or tickets.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use /code-review to review the work.

Commit your work to the current branch.
