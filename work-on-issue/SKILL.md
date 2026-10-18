---
name: work-on-issue
description: "Structured approach to implementing issue solutions with task breakdown and progress tracking"
version: "1.1.0"
category: [workflow]
priority: high
phase: implementation
auto_invoke:
  enabled: true
  conditions:
    - command: ["/work-on-issue", "/implement"]
      reason: "Work on an issue"
    - phrase: ["work on this", "implement this", "start working on"]
      reason: "Intent to implement"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [new-issue, validate-issue, pr-review, commit]
capabilities: [implementation]
quality:
  rules_count: 10
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Work on Issue

Structured workflow for implementing issue solutions.

## Usage

```
Use work-on-issue when:
- Starting implementation of a ticket
- Breaking down work into tasks
- Tracking implementation progress
- Validating completed work
```

## Workflow

### 1. Understand
- Read issue thoroughly
- Ask clarifying questions
- Identify dependencies

### 2. Plan
- Break into tasks
- Estimate effort
- Identify risks

### 3. Implement
- Follow TDD when applicable
- Write clean code
- Add tests

### 4. Validate
- Self-review changes
- Run tests
- Update issue

## Reference

- [dependency-base.md](dependency-base.md) — dependency ordering for multi-issue work

## Integrations

Works with: `diagnosing-bugs`, `pr-review`, `validate-issue`
