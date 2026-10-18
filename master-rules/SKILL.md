---
name: master-rules
description: "Operating rules for this skill pack: how /autor, the core skills, and the 6-persona pipeline fit together"
when_to_use: "Use when you want the high-level operating rules for this pack - how skills are organized and when each entry point applies."
version: "10.0"
---

# Master Rules v10 — V01D-SK11LZ

## Overview

This pack is **139 skills**. `/autor` is the entry point: it auto-detects project context and loads the relevant skills and personas. Every skill carries a `description` (what) + `when_to_use` (when), which Claude Code uses to surface the right one.

## Quick start

```bash
/autor          # analyze the current project, load relevant skills
/autor new      # start a new project (plan -> scaffold -> detect stack -> pipeline)
/agents         # run the 6-persona build pipeline
```

## Core skills (12) — always loaded with /autor

```
git, config, security, testing, error-debugger, observability,
doc-generator, mem-search, anti-slop, chisle, caveman, codebase-design
```

`/ponytail` (code-less philosophy) is inherited too.

## Conditional / tech-stack skills — selected on demand

Not pre-listed here: `/analyze-project` detects the stack and the model
loads the matching skills by their `when_to_use` triggers — language
(`python-pro`, `go-pro`, `typescript-pro`, …), framework (`react-pro`,
`nextjs-pro`, …), data (`postgresql-pro`, `prisma`, …), infra
(`docker`, `kubernetes`, `terraform`, …), and more.

## Personas — the 6-stage pipeline (`/agents`)

| Stage | Persona | Role | Model |
|-------|---------|------|-------|
| 1 | Satria | Product Manager | Sonnet |
| 2 | Athena | System Architect | Opus |
| 3 | Hexa | Feature Coder | Sonnet |
| 4 | Dina | QA & Security | Opus |
| 5 | Frans | Platform & DevOps | Sonnet |
| 6 | Vika | Technical Writer | Haiku |

Each stage runs as its own subagent on its own model and hands off
through artifact files (`specs/*`, `src/*`, `docs/*`). See `/agents`.

## Conventions

- One skill per top-level `<name>/SKILL.md`; `infrastructure/` is the only non-skill folder.
- No GitHub Actions; install = `git clone`, sync = plain git.

Full history: [CHANGELOG.md](../CHANGELOG.md) · overview: [README.md](../README.md).
