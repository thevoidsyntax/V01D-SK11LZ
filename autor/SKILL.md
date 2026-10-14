---
name: auto-router
version: "8.4.0"
description: "Smart skill recommendations based on your project. Detects tech stack, auto-invokes relevant skills."
when_to_use: "Run when starting a project, analyzing existing codebase, or needing skill recommendations."
priority: critical
phase: any
category: [process]
tech_stack:
  languages: [all]
  frameworks: [all]
  databases: [all]
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

# AUTO-ROUTER v8.4

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

## Tech Stack Detection

| Category | Technologies |
|----------|-------------|
| Languages | TypeScript, JavaScript, Python, Go, Rust, Java, C# |
| Frontend | React, Vue, Next.js, Svelte |
| Backend | Express, Fastify, NestJS, Django, FastAPI, Spring Boot, Gin, Echo, Flask |
| Database | PostgreSQL, MySQL, MongoDB, Redis, SQLite |
| DevOps | Docker, Kubernetes, Terraform, AWS, GCP, Azure |

## Skills Auto-Invoked

### Core Skills (Always)

| Skill | Purpose |
|-------|---------|
| /git | Version control |
| /code quality | Linting, code standards |
| /config | Configuration management |
| /logging | Structured logging |
| /testing | Test strategy |
| /tdd | Test-driven development |
| /mem-search | Memory & context |

### Backend Skills (Auto-detected)

| Tech Detected | Skills |
|---------------|--------|
| Express, Fastify | /api-design /typescript-pro |
| NestJS | /nestjs-expert |
| Django, FastAPI | /api-design /python-pro |
| Gin, Echo | /api-design /go-pro |
| Spring Boot | /api-design /security |

### Database Skills (Auto-detected)

| Tech Detected | Skills |
|---------------|--------|
| PostgreSQL | /database /postgresql-pro |
| MySQL | /database |
| MongoDB | /database |
| Redis | /scalability |

### Phase-Based Skills

| Phase | Skills |
|-------|--------|
| Foundation | /security /database /config |
| Core | /api-design /testing |
| Features | /performance |
| Production | /docker /ci-cd /observability |
| Launch | /reliability |

## Backend Example

```
Input: Express + TypeScript + PostgreSQL + Docker

Detected:
├── Language: TypeScript
├── Framework: Express
├── Database: PostgreSQL
└── DevOps: Docker

Skills Auto-Invoked:
├── CORE: /git /code quality /config /logging /testing /tdd /mem-search
├── BACKEND: /api-design /typescript-pro
├── DATABASE: /database /postgresql-pro
└── DEVOPS: /docker /ci-cd
```

## Local Skills (Optional)

```bash
/autor --init-local      Create local skills folder
/autor --local-preview  Preview local config
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
│     package.json, CLAUDE.md, dll.       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  2. Detect tech stack                  │
│     Language + Framework + Database   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  3. Auto-invoke skills                │
│     Core + Tech + Phase based         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  4. Show dashboard                    │
│     Skills + recommendations            │
└─────────────────────────────────────────┘
```

---

*See ARCHITECTURE.md for detailed documentation.*
