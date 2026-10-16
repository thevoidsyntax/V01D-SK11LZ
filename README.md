# Skills Ecosystem v2.3

**Intelligent Skills Architecture for Claude Code Agent**

---

## Overview

This is the skills ecosystem for Claude Code - a comprehensive collection of skills organized into logical layers for optimal project development.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  SKILLS ECOSYSTEM v2.3                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  INFRASTRUCTURE LAYER                                │   │
│  │  (Always Available - Gateway to all skills)          │   │
│  │                                                     │   │
│  │  ├── autor/          Command interface              │   │
│  │  └── auto-router/   Detection & loading system      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  LAYER 2: PERSONAS (Available with /autor)         │   │
│  │                                                     │   │
│  │  ├── Satria (PM)     BRD, PRD, FSD               │   │
│  │  ├── Athena (SE)     Architecture, code           │   │
│  │  ├── Dina (QA)       Security, testing            │   │
│  │  └── Frans (DevOps)  Deployment, monitoring        │   │
│  │                                                     │   │
│  │  All auto-invoke: anti-slop + chisle + caveman    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  LAYER 3: CORE (12 Skills - Auto-loaded)          │   │
│  │  (Always loaded with /autor)                        │   │
│  │                                                     │   │
│  │  ├── git               Version control              │   │
│  │  ├── config            Environment & secrets        │   │
│  │  ├── security          OWASP, encryption            │   │
│  │  ├── testing           QA + TDD methodology         │   │
│  │  ├── error-debugger   Debug patterns               │   │
│  │  ├── observability     Logs + Metrics + Traces     │   │
│  │  ├── doc-generator     Auto-documentation          │   │
│  │  ├── mem-search       Memory continuity           │   │
│  │  ├── anti-slop        Token efficiency             │   │
│  │  ├── chisle           Context optimization         │   │
│  │  ├── caveman          Aggressive compression       │   │
│  │  └── codebase-design  Architecture + DDD          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  LAYER 4: CONDITIONAL (Auto-detect by project)     │   │
│  │                                                     │   │
│  │  ├── docker           Containerization               │   │
│  │  ├── kubernetes       Orchestration                 │   │
│  │  ├── terraform        Infrastructure as Code        │   │
│  │  ├── deployment       CI/CD + Deployment           │   │
│  │  ├── serverless       Lambda/Functions             │   │
│  │  ├── mobile           React Native                  │   │
│  │  ├── browser-use      Browser automation            │   │
│  │  ├── reticle          Computer vision              │   │
│  │  └── ui-ux-pro-max   Design system + styling      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  LAYER 5: TECH STACK (Auto-detect by patterns)     │   │
│  │                                                     │   │
│  │  Frontend:     react-pro, nextjs-pro, vue-pro      │   │
│  │  Backend:      python-pro, go-pro, java-pro        │   │
│  │  Database:     postgresql-pro, mysql-pro, redis    │   │
│  │  API:         graphql, grpc-pro, api-design       │   │
│  │  (and more...)                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Usage

### Basic Commands
```bash
/autor              # Analyze project + personas available
/autor scan          # Full project analysis
/autor new           # New project wizard
/autor status        # Show project state
/autor --help        # Show help
```

### Personas Commands
```bash
/satria             # Invoke Satria (PM)
/athena             # Invoke Athena (SE)
/dina               # Invoke Dina (QA)
/frans              # Invoke Frans (DevOps)
/team               # Full workflow: Satria → Athena → Dina → Frans
```

### Skill Invocation
```bash
/testing            # Invoke testing skill
/security           # Invoke security skill
/react-pro          # Invoke React skill
/python-pro         # Invoke Python skill
```

---

## Layer Details

### Personas Layer (`_agents/`)

4 Named Personas available with `/autor`:

| Persona | Role | Skills | Command |
|---------|------|--------|---------|
| **Satria** | Project Manager | doc-generator, mem-search, codebase-design | `/satria` |
| **Athena** | Software Engineer | security, testing, codebase-design, api-design | `/athena` |
| **Dina** | QA & Security | security, testing, error-debugger | `/dina` |
| **Frans** | DevOps | docker, deployment, observability | `/frans` |

All personas auto-invoke: `anti-slop` + `chisle` + `caveman` (~80-90% token savings)

### Infrastructure Layer (`_infrastructure/`)

| Component | Purpose |
|-----------|---------|
| `autor/` | Command interface - what users type |
| `auto-router/` | Detection engine - auto-loads skills |

### Core Layer (`_core/`)

11 skills that are **always loaded** when you invoke `/autor`:

| # | Skill | Purpose |
|---|-------|---------|
| 1 | `git` | Version control |
| 2 | `config` | Environment & secrets management |
| 3 | `security` | OWASP, input validation, encryption |
| 4 | `testing` | QA strategy + TDD methodology |
| 5 | `error-debugger` | Debug patterns & troubleshooting |
| 6 | `observability` | Logs + Metrics + Traces (3 pillars) |
| 7 | `doc-generator` | Auto-generate documentation |
| 8 | `mem-search` | Memory continuity across sessions |
| 9 | `anti-slop` | Remove verbose AI patterns (~30-40% token savings) |
| 10 | `chisle` | Context pruning (~20-30% token savings) |
| 11 | `codebase-design` | Architecture + Domain modeling |

### Conditional Layer (`_conditional/`)

Skills loaded **automatically based on project type**:

| Category | Skills |
|----------|--------|
| Container | `docker` |
| Orchestration | `kubernetes` |
| IaC | `terraform` |
| Deployment | `deployment` (includes CI/CD) |
| Serverless | `serverless` |
| Mobile | `mobile` |
| Browser | `browser-use` |
| Vision | `reticle` |
| UI/Design | `ui-ux-pro-max` (includes design-system + styling) |

### Tech Stack Layer (Root folders)

Skills auto-detected by **pattern matching**:

| Category | Skills |
|----------|--------|
| Frontend | `react-pro`, `nextjs-pro`, `vue-pro`, `nuxt-pro`, `svelte-pro` |
| Backend | `python-pro`, `go-pro`, `java-pro`, `dotnet-pro`, `rust-pro`, `nestjs-expert`, `fastify-pro` |
| Database | `postgresql-pro`, `mysql-pro`, `mongodb-pro`, `redis-pro`, `prisma`, `drizzle`, `supabase` |
| API | `graphql`, `grpc-pro`, `api-design` |
| UI | `tailwindcss`, `ui-ux-pro-max` |
| Deployment | `docker`, `kubernetes`, `terraform`, `vercel`, `railway`, `flyio` |

---

## Project Flow

### New Project
```
1. User: /autor new
2. Mem-search: Check for similar past projects
3. Autor: Ask project type questions
4. Auto-router: Load appropriate skills
5. Ready for development
```

### Existing Project
```
1. User: /autor
2. Mem-search: Retrieve project context
3. Autor: Show project analysis
4. Auto-router: Detect tech stack
5. Load needed skills
6. Ready to continue
```

---

## Token Efficiency

Built-in tools for token optimization:

| Tool | Purpose | Token Savings |
|------|---------|---------------|
| `anti-slop` | Remove verbose AI patterns | ~30-40% |
| `chisle` | Context pruning | ~20-30% |
| `caveman` | Aggressive compression (external) | ~65% |

---

## Integration

Skills are designed to work together:

```
_core/
├── git ──────────────────────────────────────────────────┐
├── config ───────────────────────────────────────────────┤
├── security ────────────────────────────────────────────┤
├── testing ──────────────────────────────────────────────┼── Integration
├── error-debugger ─────────────────────────────────────┤   Chain
├── observability ───────────────────────────────────────┤
├── doc-generator ───────────────────────────────────────┤
├── mem-search ─────────────────────────────────────────┤
├── anti-slop ──────────────────────────────────────────┤
├── chisle ─────────────────────────────────────────────┤
└── codebase-design ────────────────────────────────────┘
```

---

## Skills Count

| Layer | Count |
|-------|-------|
| Infrastructure | 2 |
| Core | 11 |
| Conditional | 9 |
| Tech Stack | ~25 |
| **Total** | **~47** |

---

## Changelog

### v2.0.0
- ✅ Infrastructure layer separated
- ✅ Core layer (11 skills) auto-loaded
- ✅ Conditional layer for specialized skills
- ✅ Memory integration (mem-search)
- ✅ Token efficiency tools (anti-slop, chisle, caveman)

### v1.0.0
- Basic skill organization
- Layer 1 + Layer 2 structure

---

## License

Proprietary - Internal use only

---

*Built for developers who ship!*
