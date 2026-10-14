---
name: auto-router
version: "8.3.0"
description: "Smart skill recommendations based on your project. Detects tech stack, auto-invokes relevant skills."
when_to_use: "Run when starting a project, analyzing existing codebase, or needing skill recommendations."
priority: critical
phase: any
category: [process]
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/autor", "/ar", "/auto-router"]
      reason: "Primary entry - analyzes project and recommends skills"
core_skills:
  always:
    - /git
    - /code quality
    - /config
    - /logging
    - /testing
    - /tdd
    - /mem-search
capabilities:
  - discovery
  - analysis
  - auto_invoke
author: TheVoidSyntax
---

# AUTO-ROUTER v8.3

Smart skill recommendations for your project.

## Usage

```
/autor           Analyze project + show skills
/autor --help   Show help
```

## How It Works

1. **Detect** - Scan project files (package.json, CLAUDE.md, dll)
2. **Analyze** - Identify tech stack and project phase
3. **Invoke** - Auto-invoke relevant skills
4. **Report** - Show skills dashboard

## What It Detects

| Category | Examples |
|----------|----------|
| Languages | TypeScript, Python, Go, Rust |
| Frameworks | React, Fastify, Django |
| Databases | PostgreSQL, MongoDB, Redis |
| DevOps | Docker, Kubernetes |

## Skills Auto-Invoked

**Always (Core):**
```
/git /code quality /config /logging /testing /tdd /mem-search
```

**Based on Tech Stack:**
| Detected | Skills |
|----------|--------|
| TypeScript | /typescript-pro |
| React | /ui-ux-pro-max |
| Fastify | /api-design |
| PostgreSQL | /database |
| Docker | /docker /ci-cd |

**Based on Phase:**
| Phase | Skills |
|-------|--------|
| Foundation | /security /database |
| Features | /ui-ux-pro-max /performance |
| Production | /docker /ci-cd |

## Local Skills (Optional)

For per-project customization:

```bash
# Create local skills folder
/autor --init-local

# Preview local config
/autor --local-preview
```

This creates `.claude/skills/` with project-specific settings.

## Examples

```
# Analyze current project
/autor

# Show help
/autor --help

# Create local skills (in project folder)
/autor --init-local
```

## Flow Diagram

```
┌─────────────────────────────────────────┐
│  /autor                                 │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  1. Read project files                 │
│     CLAUDE.md, package.json, dll.      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  2. Detect tech stack                 │
│     Language, framework, database      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  3. Auto-invoke skills               │
│     Based on detection                │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  4. Show dashboard                   │
│     Skills + recommendations           │
└─────────────────────────────────────────┘
```

---

*See ARCHITECTURE.md for detailed documentation.*
