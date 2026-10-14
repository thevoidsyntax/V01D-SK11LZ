---
name: auto-router
version: "8.2.0"
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

# AUTO-ROUTER v8.2

Smart skill recommendations for your project.

## Quick Start

```
/autor                    Analyze current project
/autor --new             Start new project
/autor --analyze         Deep tech stack analysis
/autor --phase=9         Set project phase
/autor --init-local     Create local skills config
```

## How It Works

```
1. Detect tech stack (Node.js, Python, Go, dll)
2. Read CLAUDE.md for project phase
3. Auto-invoke relevant skills
4. Show dashboard with recommendations
```

## Auto-Invoke Matrix

| Detection | Skills |
|-----------|--------|
| Always | /git, /code quality, /config, /logging, /testing, /tdd, /mem-search |
| TypeScript | /typescript-pro |
| React | /ui-ux-pro-max |
| Fastify | /api-design |
| PostgreSQL | /database |
| Docker | /docker, /ci-cd |
| Backend | /security, /api-design, /database |
| Frontend | /ui-ux-pro-max, /performance |

## Phase-Based Skills

| Phase | Skills |
|-------|--------|
| Foundation | /security, /database, /config |
| Core | /api-design, /testing |
| Features | /ui-ux-pro-max, /performance |
| Production | /docker, /ci-cd, /observability |

## Local Skills (Per-Project Config)

Create project-specific skill configurations:

```
/autor --init-local      Create .claude/skills/
/autor --local-preview   Preview local config
/autor --sync-local     Sync with global
```

Generated structure:
```
.claude/skills/
├── SKILL.md           Project config
├── phases.json        Phase mappings
└── hooks/            Pre/post invoke
```

## Examples

```
# Analyze current project
/autor

# New project
/autor --new

# Set phase and analyze
/autor --phase=9

# Create local skills
cd my-project
/autor --init-local
```

## Tech Stack Detection

Detects automatically:
- **Languages**: TypeScript, JavaScript, Python, Go, Rust, Java, C#
- **Frameworks**: React, Vue, Next.js, Fastify, Express, NestJS, Django
- **Databases**: PostgreSQL, MySQL, MongoDB, Redis
- **DevOps**: Docker, Kubernetes, Terraform

---

*See ARCHITECTURE.md for detailed flow diagrams.*
