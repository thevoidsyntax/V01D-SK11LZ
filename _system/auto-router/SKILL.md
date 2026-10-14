---
name: auto-router
version: "8.8.0"
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

# AUTO-ROUTER v8.9

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

### Language-Specific Skills

| Language | Skill | Notes |
|----------|-------|-------|
| TypeScript | /typescript-pro | Advanced TS patterns |
| Python | /python-pro | Django, FastAPI patterns |
| Go | /go-pro | Gin, Echo patterns |
| Rust | /rust-pro | Ownership, async patterns |
| Java | /java-pro | Spring Boot patterns (NEW) |
| C# | /dotnet-pro | .NET Core patterns (NEW) |

### Frontend Framework Skills

| Framework | Skills | Notes |
|-----------|--------|-------|
| React | /react-pro, /ui-ux-pro-max | Hooks, state, components |
| Next.js | /nextjs-pro, /react-pro | App Router, SSR patterns |
| Vue | /ui-ux-pro-max | Vue patterns |
| Svelte | /ui-ux-pro-max | Svelte patterns |
| Generic UI | /ui-ux-pro-max | Design intelligence |

### Performance Skills

| Focus | Skill | Notes |
|-------|-------|-------|
| Bundle optimization | /performance-ui | Web Vitals, code splitting |
| UI/UX | /ui-ux-pro-max | Design intelligence |

### Integration Skills

| Focus | Skill | Notes |
|-------|-------|-------|
| Full-stack | /fullstack-patterns | API contracts, data flow |
| API contracts | /api-contracts | OpenAPI, contract testing |
| Data fetching | /data-fetch | TanStack Query, SWR |
| Real-time | /realtime | WebSocket, SSE |
| Auth flows | /auth-flows | JWT, OAuth patterns |
| Integration testing | /testing-integration | MSW, Playwright |

### Backend Skills (Auto-detected)

| Tech Detected | Skills |
|---------------|--------|
| Express, Fastify | /api-design /typescript-pro |
| NestJS | /nestjs-expert |
| Django, FastAPI | /api-design /python-pro |
| Gin, Echo | /api-design /go-pro |
| Spring Boot | /java-pro |
| ASP.NET Core | /dotnet-pro |

### Quality & Observability

| Category | Skills |
|----------|--------|
| Tech Debt | /tech-debt |
| Error Tracking | /error-tracking |
| Observability | /observability |

### Database Skills (Auto-detected)

| Tech Detected | Skills |
|---------------|--------|
| PostgreSQL | /database /postgresql-pro |
| MySQL | /database /mysql-pro |
| MongoDB | /mongodb-pro |
| Redis | /redis-pro |
| Migration | /database-migration |

### Phase-Based Skills

| Phase | Skills |
|-------|--------|
| Foundation | /security /database /config |
| Core | /api-design /testing |
| Features | /performance |
| Production | /docker /ci-cd /observability |
| Launch | /reliability |

## Examples

### Node.js + TypeScript + PostgreSQL

```
Input: Express + TypeScript + PostgreSQL + Docker

Detected:
├── Language: TypeScript → /typescript-pro
├── Framework: Express → /api-design
├── Database: PostgreSQL → /database /postgresql-pro
└── DevOps: Docker → /docker /ci-cd

Skills Auto-Invoked:
├── CORE: /git /code quality /config /logging /testing /tdd /mem-search
├── BACKEND: /api-design /typescript-pro
├── DATABASE: /database /postgresql-pro
└── DEVOPS: /docker /ci-cd
```

### Python + Django + PostgreSQL

```
Input: Django + Python + PostgreSQL

Detected:
├── Language: Python → /python-pro
├── Framework: Django → /api-design
├── Database: PostgreSQL → /database /postgresql-pro
└── DevOps: Docker → /docker

Skills Auto-Invoked:
├── CORE: /git /code quality /config /logging /testing /tdd /mem-search
├── BACKEND: /api-design /python-pro
├── DATABASE: /database /postgresql-pro
└── DEVOPS: /docker
```

### Go + Gin + PostgreSQL

```
Input: Gin + Go + PostgreSQL

Detected:
├── Language: Go → /go-pro
├── Framework: Gin → /api-design
├── Database: PostgreSQL → /database /postgresql-pro
└── DevOps: Docker → /docker

Skills Auto-Invoked:
├── CORE: /git /code quality /config /logging /testing /tdd /mem-search
├── BACKEND: /api-design /go-pro
├── DATABASE: /database /postgresql-pro
└── DEVOPS: /docker
```

### Rust + PostgreSQL

```
Input: Rust + PostgreSQL

Detected:
├── Language: Rust → /rust-pro
├── Database: PostgreSQL → /database /postgresql-pro
└── DevOps: Docker → /docker

Skills Auto-Invoked:
├── CORE: /git /code quality /config /logging /testing /tdd /mem-search
├── LANGUAGE: /rust-pro
├── DATABASE: /database /postgresql-pro
└── DEVOPS: /docker
```

### Java + Spring Boot

```
Input: Spring Boot + Java + PostgreSQL

Detected:
├── Language: Java → /api-design (generic backend patterns)
├── Framework: Spring Boot → /api-design
├── Database: PostgreSQL → /database /postgresql-pro
└── DevOps: Docker → /docker

Skills Auto-Invoked:
├── CORE: /git /code quality /config /logging /testing /tdd /mem-search
├── BACKEND: /api-design
├── DATABASE: /database /postgresql-pro
└── DEVOPS: /docker
```

## Local Skills (Optional)

```bash
/autor --init-local      Create local skills folder
/autor --local-preview  Preview local config
```

## Available Skills Reference

| Category | Skills |
|----------|--------|
| Core | /git, /code quality, /config, /logging, /testing, /tdd, /mem-search |
| Languages | /typescript-pro, /python-pro, /go-pro, /rust-pro, /java-pro, /dotnet-pro |
| Backend | /api-design, /nestjs-expert |
| Database | /database, /postgresql-pro, /scalability |
| Security | /security, /error-tracking |
| DevOps | /docker, /ci-cd, /kubernetes, /observability, /reliability |
| Quality | /tech-debt |

---

*See ARCHITECTURE.md for detailed documentation.*
