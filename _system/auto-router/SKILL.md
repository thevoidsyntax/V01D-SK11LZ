---
name: auto-router
version: "8.1.0"
description: "Intelligent project router with auto-invoke core skills, tech-based recommendations, phase awareness, and workflow execution modes. Use --new for new projects, --analyze for existing projects."
when_to_use: "Use when starting a new project, analyzing an existing codebase, or needing intelligent skill recommendations based on tech stack and project phase. Invoke with /autor, /ar, or /auto-router."
priority: critical
phase: any
category: [process]
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/autor", "/ar", "/auto-router", "/auto-route", "/autoroute"]
      reason: "Primary entry point - triggers full skill auto-invocation"
    - command: ["/autor --new", "/ar --new", "/auto-router --new"]
      reason: "New project mode - triggers project-init"
    - command: ["/autor --analyze", "/ar --analyze", "/auto-router --analyze"]
      reason: "Analyze mode - triggers analyze-project"
execution_mode:
  default: hybrid
  rules:
    - task_type: discovery
      mode: background
      reason: "Fast, no decisions needed"
    - task_type: implementation
      mode: inline
      reason: "User visibility, course-correct capability"
    - task_type: testing
      mode: background
      reason: "Deterministic, no decisions"
    - task_type: documentation
      mode: inline
      reason: "Needs user approval"
core_skills:
  always:
    - /git
    - /code-quality
    - /config
    - /logging
    - /testing
    - /tdd
    - /project-init
    - /analyze-project
  docker_based:
    - /docker
    - /ci-cd
    - /deployment
  security_critical:
    - /security
  backend_based:
    - /api-design
    - /database
    - /domain-modeling
    - /architecture-patterns
  frontend_based:
    - /ui-ux-pro-max
    # /frontend removed - does not exist, use /ui-ux-pro-max instead
  debugging:
    - /diagnosing-bugs
  context:
    - /mem-search
    - /feature-forge
    - /implement
    - /documentation
    - /performance
    - /browser-use
    - /anti-slop
context_skills:
  tech_based:
    typescript:
      - /typescript-pro
    nodejs:
      - /typescript-pro
    fastify:
      - /api-design
    postgresql:
      - /database
    react:
      - /ui-ux-pro-max
    redis:
      - /scalability
integrates_with:
  - workflow-authoring
capabilities:
  - discovery
  - implementation
  - analysis
  - auto_invoke
quality:
  rules_count: 60
  examples_count: 25
  stability: stable
source:
  origin: local
author: TheVoidSyntax
---

# AUTO-ROUTER v8.0

Smart Project Intelligence Tool with Auto-Invoke

```
┌──────────────────────────────────────────────────────────────────┐
│  🚀 AUTO-ROUTER v8.0                                           │
│  Smart Project Intelligence                                      │
│  ✅ Auto-Invoke Core Skills                                    │
│  ✅ Tech-Based Recommendations                                  │
│  ✅ Phase-Aware Selection                                       │
│  ✅ Workflow Execution Modes (Inline/Background)                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎯 AUTO-INVOKE WORKFLOW

### v7.0 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER: /autor                                │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: PROJECT CONTEXT LOADING                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │ Read CLAUDE  │→ │ Read README  │→ │ Parse package.json   │    │
│  │ .md          │  │ .md          │  │ & Config files       │    │
│  └──────────────┘  └──────────────┘  └──────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 2: TECH STACK DETECTION                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │ Language:    │  │ Framework:  │  │ Database:           │    │
│  │ Node.js ✅   │  │ Fastify ✅   │  │ PostgreSQL ✅       │    │
│  └──────────────┘  └──────────────┘  └──────────────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │ Frontend:    │  │ DevOps:      │  │ Architecture:        │    │
│  │ React ✅     │  │ Docker?      │  │ DDD-Lite ✅         │    │
│  └──────────────┘  └──────────────┘  └──────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3: AUTO-INVOKE CORE SKILLS (Always)                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ✅ /git          Version Control                             │   │
│  │ ✅ /code-quality Linting & Code Standards                    │   │
│  │ ✅ /config      Configuration Management                    │   │
│  │ ✅ /logging     Structured Logging                         │   │
│  │ ✅ /testing     Testing Strategy                            │   │
│  │ ✅ /tdd         Test-Driven Development                    │   │
│  │ ✅ /mem-search  Persistent Memory                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 4: AUTO-INVOKE TECH-BASED SKILLS                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ✅ /typescript-pro   (TypeScript detected)                   │   │
│  │ ✅ /api-design      (Fastify detected)                       │   │
│  │ ✅ /database        (PostgreSQL detected)                   │   │
│  │ ✅ /ui-ux-pro-max   (React detected)                        │   │
│  │ ✅ /security        (Backend API detected)                   │   │
│  │ ✅ /domain-modeling (DDD pattern detected)                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 5: AUTO-INVOKE PHASE-BASED SKILLS                           │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ From CLAUDE.md - Current Phase: 13                             │   │
│  │ ✅ /ui-ux-pro-max   (Phase 13 - PWA UI)                    │   │
│  │ ✅ /performance      (Phase 13 - Bundle optimization)         │   │
│  │ ✅ /browser-use     (Phase 13 - PWA testing)               │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 6: SHOW SMART DASHBOARD + RECOMMENDATIONS                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Summary: X skills invoked | Y recommended | Z available      │   │
│  │ Full list with scores and reasons                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🟢 CORE SKILLS (Always Auto-Invoke)

### Version Control & DevOps (4)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/git` | Version Control | ✅ Always |
| `/docker` | Containerization | ✅ Always |
| `/ci-cd` | CI/CD Pipelines | ✅ Always |
| `/deployment` | Deployment Strategy | ✅ Always |

### Quality & Testing (3)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/code-quality` | Linting, Code Standards | ✅ Always |
| `/testing` | Testing Strategy | ✅ Always |
| `/tdd` | Test-Driven Development | ✅ Always |

### Config & Observability (3)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/config` | Configuration Management | ✅ Always |
| `/logging` | Structured Logging | ✅ Always |
| `/observability` | Monitoring & Metrics | ✅ Always |

### Security (1)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/security` | Security Best Practices | ✅ Always |

### Backend Development (2)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/api-design` | REST/GraphQL API | ✅ Always |
| `/database` | Database Patterns | ✅ Always |

### Architecture & Patterns (2)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/domain-modeling` | DDD Patterns | ✅ Always |
| `/architecture-patterns` | System Design | ✅ Always |

### Project Foundation (4)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/feature-forge` | Feature Planning | ✅ Always |
| `/implement` | Implementation | ✅ Always |
| `/documentation` | Technical Docs | ✅ Always |
| `/mem-search` | Memory & Context | ✅ Always |

### Debugging & Performance (2)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/diagnosing-bugs` | Debugging Strategies | ✅ Always |
| `/performance` | Performance Optimization | ✅ Always |

### Code Review & Communication (2)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/pr-review` | Code Review Practice | ✅ Always |
| `/commit` | Conventional Commits | ✅ Always |

### Production Readiness (2)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/reliability` | Resilience Patterns | ✅ Always |
| `/scalability` | Growth Readiness | ✅ Always |

### Frontend & Tools (3)

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `/ui-ux-pro-max` | UI/UX Design | ✅ Always |
| `/browser-use` | Browser Automation | ✅ Always |
| `/anti-slop` | Anti-Pattern Detection | ✅ Always |

---

**Total: 26 CORE SKILLS** - All auto-invoked when `/auto-router` is called.

---

## 🔵 TECH-BASED CONTEXT SKILLS

### Language-Specific

| Language | Skills Auto-Invoke | Score |
|----------|-------------------|-------|
| TypeScript | `/typescript-pro` | 25 |
| Python | `/python-pro` | 25 |
| Go | `/go-pro` | 25 |
| Rust | `/rust-pro` | 25 |
| Node.js | `/typescript-pro` | 20 |

### Framework-Specific

| Framework | Skills Auto-Invoke | Score |
|-----------|-------------------|-------|
| Fastify | `/api-design`, `/performance` | 25 |
| Express | `/api-design`, `/security` | 25 |
| NestJS | `/api-design`, `/security`, `/messaging` | 30 |
| Next.js | `/ui-ux-pro-max`, `/performance`, `/api-design` | 30 |
| React | `/ui-ux-pro-max`, `/performance` | 30 |
| Vue.js | `/ui-ux-pro-max` | 25 |

### Database-Specific

| Database | Skills Auto-Invoke | Score |
|----------|-------------------|-------|
| PostgreSQL | `/database`, `/postgresql-pro` | 25 |
| MySQL | `/database` | 20 |
| MongoDB | `/data-engineering` | 20 |
| Redis | `/scalability`, `/performance` | 20 |

---

## 🎯 PHASE-BASED SKILL SELECTION

### Phase Detection from CLAUDE.md

The autor reads CLAUDE.md to detect:
1. Current phase (e.g., "Phase 9")
2. Phase status (done, in-progress, next)
3. Phase deliverables

### Phase → Skills Mapping

```typescript
const PHASE_SKILLS: Record<string, string[]> = {
  'foundation': ['/security', '/database', '/architecture-patterns', '/config'],
  'core': ['/api-design', '/code-quality', '/testing', '/deployment'],
  'features': ['/ui-ux-pro-max', '/performance'],
  'products': ['/api-design', '/database', '/ui-ux-pro-max', '/typescript-pro'],
  'stock': ['/database', '/data-engineering', '/testing'],
  'reports': ['/data-engineering', '/performance', '/documentation'],
  'settings': ['/config', '/security', '/api-design'],
  'pwa': ['/ui-ux-pro-max', '/performance', '/browser-use'],
};
```

### Phase Example (Settings & PWA)

```yaml
Current Phase: settings
Phase Focus: Settings & Config
Tech Stack: Fastify + PostgreSQL + React + PWA

Auto-Invoke:
  Core: /git, /code-quality, /config, /logging, /testing, /mem-search
  Tech: /typescript-pro, /api-design, /database, /ui-ux-pro-max, /security
  Phase: /config, /security, /api-design (Settings)
        /ui-ux-pro-max, /performance, /browser-use (PWA)
  Docker-based: /docker, /ci-cd, /deployment
```

### Skills to Recommend

| Skill | Reason | Score |
|-------|--------|-------|
| `/docker` | PWA needs Docker deployment | 40 |
| `/ci-cd` | Automation for build & test | 35 |
| `/browser-use` | PWA testing automation | 30 |

---

## 🧮 SCORING ALGORITHM

```
┌─────────────────────────────────────────────────────────────────┐
│  SKILL RELEVANCE SCORE (0-100)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BASE SCORE: 0                                                  │
│                                                                  │
│  +────────────────────────────                                    │
│  │ CORE SKILL              +50     (always available)         │
│  +────────────────────────────                                    │
│  │ TECH STACK MATCH        +25     (detected in project)      │
│  +────────────────────────────                                    │
│  │ PHASE MATCH            +30     (required by current phase)  │
│  +────────────────────────────                                    │
│  │ KEYWORD MATCH           +15     (in user input)            │
│  +────────────────────────────                                    │
│  │ PATTERN MATCH          +20     (architecture detected)      │
│  +────────────────────────────                                    │
│  │ USER PREFERENCE        +10     (from history)              │
│  +────────────────────────────                                    │
│                                                                  │
│  ───────────────────────────────────                            │
│  AUTO-INVOKE THRESHOLD: ≥50                                    │
│  RECOMMEND THRESHOLD: 25-49                                    │
│  SKIP THRESHOLD: <25                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 AUTO-INVOKE IMPLEMENTATION

### Step-by-Step Execution

```
STEP 1: Load Project Context
─────────────────────────────
• Read CLAUDE.md (phase, tech stack, preferences)
• Read README.md (architecture, deliverables)
• Parse package.json (dependencies)
• Check for Dockerfile, docker-compose.yml

STEP 2: Detect Tech Stack
─────────────────────────
• Language: package.json → Node.js/TypeScript ✅
• Framework: dependencies → Fastify ✅
• Database: dependencies → PostgreSQL ✅
• Frontend: dependencies → React ✅
• DevOps: Dockerfile exists? → /docker auto-include

STEP 3: Auto-Invoke Core Skills
──────────────────────────────
• Invoke /git
• Invoke /code-quality
• Invoke /config
• Invoke /logging
• Invoke /testing
• Invoke /tdd
• Invoke /mem-search

STEP 4: Auto-Invoke Tech-Based Skills
────────────────────────────────────
• Invoke /typescript-pro (TypeScript detected)
• Invoke /api-design (Fastify detected)
• Invoke /database (PostgreSQL detected)
• Invoke /ui-ux-pro-max (React detected)

STEP 5: Auto-Invoke Phase-Based Skills
───────────────────────────────────────
• Read current phase from CLAUDE.md
• Map phase to skills
• Invoke phase-specific skills

STEP 6: Show Dashboard
───────────────────────
• List all invoked skills
• Show recommendations (score 25-49)
• Show available skills (score <25)
```

---

## 📊 AUTO-INVOKE EXAMPLES

### Example 1: New Project (`/autor --new`)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  🚀 AUTO-ROUTER v8.0 ✨ NEW PROJECT MODE                         ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  Project Type: REST API Backend                                        ║
║  Tech Stack: Node.js + TypeScript + Fastify + PostgreSQL               ║
║  Scale: Startup (balanced)                                             ║
║                                                                          ║
╠══════════════════════════════════════════════════════════════════════════╣
║  ✅ AUTO-INVOKED (12 skills)                                      ║
╠══════════════════════════════════════════════════════════════════════════╣
║  CORE (7)                    │ TECH-BASED (5)                     ║
║  ───────────────────        │ ─────────────────                   ║
║  ✅ /git                     │ ✅ /typescript-pro                   ║
║  ✅ /code-quality            │ ✅ /api-design                      ║
║  ✅ /config                  │ ✅ /database                        ║
║  ✅ /logging                 │ ✅ /security                        ║
║  ✅ /testing                 │ ✅ /domain-modeling                 ║
║  ✅ /tdd                     │                                   ║
║  ✅ /mem-search              │                                   ║
╠══════════════════════════════════════════════════════════════════════════╣
║  ⭐ RECOMMENDED (3 skills)                                          ║
╠══════════════════════════════════════════════════════════════════════════╣
║  [ ] /docker           ████████████░░░░░░░░░░░  40%  MED          ║
║  [ ] /ci-cd           █████████░░░░░░░░░░░░░░░░  35%  MED          ║
║  [ ] /performance     ████████░░░░░░░░░░░░░░░░░  30%  LOW          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Example 2: Existing Project Analysis (`/autor`)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  🚀 AUTO-ROUTER v8.0 ✨ PROJECT ANALYSIS                         ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  Project: e-commerce-api              Phase: features                ║
║  Location: /workspace/e-commerce-api                                ║
║                                                                          ║
║  TECH STACK DETECTED:                                                ║
║  ├── Language:      Python 3.11 ✅                                 ║
║  ├── Framework:     FastAPI 0.104 ✅                                ║
║  ├── Database:      PostgreSQL 15 ✅                                ║
║  ├── ORM:          SQLAlchemy 2.0                                  ║
║  ├── DevOps:       Docker ✅                                        ║
║  └── Architecture:  DDD-Lite                                        ║
║                                                                          ║
╠══════════════════════════════════════════════════════════════════════════╣
║  ✅ AUTO-INVOKED (11 skills)                                      ║
║                                                                          ║
║  CORE (7)                    │ TECH-BASED (4)                     ║
║  ───────────────────        │ ─────────────────                   ║
║  ✅ /git                     │ ✅ /python-pro                     ║
║  ✅ /code-quality            │ ✅ /api-design                     ║
║  ✅ /config                  │ ✅ /database                       ║
║  ✅ /logging                 │ ✅ /security                       ║
║  ✅ /testing                 │                                   ║
║  ✅ /tdd                     │                                   ║
║  ✅ /mem-search              │                                   ║
╠══════════════════════════════════════════════════════════════════════════╣
║  PHASE (features)          │ RECOMMENDED                       ║
║  ───────────────          │ ────────────                       ║
║  ✅ /ui-ux-pro-max         │ /performance (45%)                 ║
║  ✅ /performance           │ /docker (40%)                     ║
║                            │ /ci-cd (35%)                       ║
╠══════════════════════════════════════════════════════════════════════════╣
║  WHAT'S NEXT?                                                           ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  [A] Continue with features phase (recommended)                      ║
║  [B] Review backend API endpoints (/api-design)                     ║
║  [C] Start frontend integration (/ui-ux-pro-max)                   ║
║  [D] Performance optimization (/performance)                         ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Example 3: Tech Stack Detection (`/autor --analyze`)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  📊 TECH STACK ANALYSIS                                           ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  Scanning: /workspace/my-project                                    ║
║  Files scanned: 847 | Languages: 4 | Frameworks: 3                  ║
║                                                                          ║
║  DETECTED:                                                          ║
║  ┌─────────────────────────────────────────────────────────────┐   ║
║  │  LANGUAGES        FRAMEWORKS           DATABASES           │   ║
║  │  ───────────────  ─────────────────  ────────────────      │   ║
║  │  TypeScript 45%   React 30%           PostgreSQL 60%      │   ║
║  │  Python 35%       Next.js 25%         Redis 25%          │   ║
║  │  Go 15%           Fastify 20%        MongoDB 15%         │   ║
║  │  Shell 5%         Prisma 15%                            │   ║
║  └─────────────────────────────────────────────────────────────┘   ║
║                                                                          ║
║  ARCHITECTURE PATTERNS:                                              ║
║  ├── DDD-Lite (domain/application/infrastructure layers)             ║
║  ├── Repository Pattern (data access abstraction)                    ║
║  └── Service Layer (business logic isolation)                        ║
║                                                                          ║
║  RECOMMENDED SKILL FOCUS:                                            ║
║  ├── /typescript-pro (primary language)                              ║
║  ├── /api-design (Fastify + Next.js API routes)                     ║
║  ├── /database (PostgreSQL + Prisma)                                ║
║  └── /ui-ux-pro-max (React/Next.js)                                 ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 🔄 COMMAND FLOW

```
/autor [OPTIONS]

Options:
  --new              Force new project mode
  --analyze          Full project analysis
  --phase [N]        Continue from phase N
  --skip-core        Skip auto-invoke core skills
  --tech-only        Invoke tech-based skills only
  --phase-only       Invoke phase-based skills only
  --inline           Force inline execution (recommended for implementation)
  --background       Force background execution (for fast discovery)
  --hybrid           Use hybrid mode (default: discovery=bg, impl=inline)
  --verbose          Show detailed invocation
  --quiet            Minimal output
```

---

## 📋 QUICK REFERENCE

### Auto-Invoke Matrix

| Trigger | Skills |
|---------|--------|
| Always | `/git`, `/code-quality`, `/config`, `/logging`, `/testing`, `/tdd`, `/mem-search` |
| TypeScript | `/typescript-pro` |
| Fastify | `/api-design`, `/performance` |
| PostgreSQL | `/database`, `/postgresql-pro` |
| React | `/ui-ux-pro-max`, `/performance` |
| Docker | `/docker`, `/ci-cd`, `/deployment` |
| DDD Pattern | `/domain-modeling`, `/architecture-patterns` |
| Phase 12 | `/config`, `/security`, `/api-design` |
| Phase 13 | `/ui-ux-pro-max`, `/performance`, `/browser-use` |

---

## ✨ SMART TERMINAL INTERFACE

### Auto-Invoke Dashboard

```
╔══════════════════════════════════════════════════════════════════════════╗
║  🚀 AUTO-ROUTER v7.0 ✨ AUTO-INVOKE ENABLED                      ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Project: VentroPos                    Phase: 12-13                      ║
║  Tech: Fastify + PostgreSQL + React                                   ║
╠══════════════════════════════════════════════════════════════════════════╣
║  ✅ AUTO-INVOKED (14 skills)                                        ║
╠══════════════════════════════════════════════════════════════════════════╣
║  CORE (7)              │ TECH-BASED (5)     │ PHASE (2)          ║
║  ───────────────────   │ ─────────────────  │ ─────────────────   ║
║  ✅ /git               │ ✅ /typescript-pro │ ✅ /api-design     ║
║  ✅ /code-quality      │ ✅ /api-design     │ ✅ /database       ║
║  ✅ /config            │ ✅ /database       │                    ║
║  ✅ /logging           │ ✅ /ui-ux-pro-max  │                    ║
║  ✅ /testing           │ ✅ /security       │                    ║
║  ✅ /tdd               │                    │                    ║
║  ✅ /mem-search        │                    │                    ║
╠══════════════════════════════════════════════════════════════════════════╣
║  ⭐ RECOMMENDED (3 skills)                                          ║
╠══════════════════════════════════════════════════════════════════════════╣
║  [ ] /performance       ████████████░░░░░░░░░░  45%  MED           ║
║  [-] /frontend (N/A)          ████████░░░░░░░░░░░░░░░  40%  MED           ║
║  [ ] /docker            ███████░░░░░░░░░░░░░░░░░  35%  LOW           ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## ⚡ WORKFLOW EXECUTION MODES

### Background vs Foreground Decision Matrix

| Task Type | Mode | Reason | Example |
|-----------|------|--------|---------|
| Discovery/Analysis | Background | Fast, no decisions needed | Read files, analyze patterns |
| Implementation | **Inline** | User visibility, course-correct | Create entities, routes, pages |
| Testing/Automation | Background | Deterministic, no decisions | Run lint, test, tsc |
| Documentation | **Inline** | Needs approval | Update README, API docs |
| Complex Refactoring | Hybrid | Inline planning, bg execution | Multi-file changes |

### Why Inline for Implementation?

```
┌─────────────────────────────────────────────────────────────────┐
│  BACKGROUND WORKFLOW (Hidden)                                    │
├─────────────────────────────────────────────────────────────────┤
│  ❌ Black box - user tidak tahu apa yang dibuat                │
│  ❌ No visibility - tidak bisa koreksi mid-work                │
│  ❌ "Trust me bro" - tidak ada bukti                          │
│  ❌ Error baru ketahuan setelah selesai                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  INLINE WORKFLOW (Visible)                                      │
├─────────────────────────────────────────────────────────────────┤
│  ✅ User lihat setiap file yang dibuat                          │
│  ✅ Bisa koreksi langsung kalau salah                          │
│  ✅ Progress terlihat nyata                                      │
│  ✅ Error langsung surfaced, langsung fix                        │
└─────────────────────────────────────────────────────────────────┘
```

### Hybrid Pattern (Recommended for Phase Work)

```
┌─────────────────────────────────────────────────────────────────┐
│  HYBRID PHASE IMPLEMENTATION                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DISCOVERY (Background - fast)                              │
│     └── Read specs, analyze patterns                            │
│                                                                  │
│  2. IMPLEMENTATION (Inline - visible)                          │
│     ├── Create entities → User sees files                       │
│     ├── Create repositories → User sees files                    │
│     ├── Create use cases → User sees files                      │
│     ├── Create routes → User sees files                         │
│     └── Create frontend → User sees files                        │
│                                                                  │
│  3. TESTING (Background - automated)                            │
│     └── Run lint, test, tsc                                    │
│                                                                  │
│  4. DOCUMENTATION (Inline - approval)                           │
│     └── Update README → User approves                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Visibility Best Practices

1. **log() calls** → Always visible in chat
2. **Phase transitions** → Highlighted in output
3. **File creations** → Reported immediately
4. **Errors** → Surfaced immediately, not hidden
5. **User approval points** → Before destructive actions

### When to Use Background

- Fast file reads (Read, Glob, Grep)
- Parallel analysis (multiple agents, same task)
- Deterministic testing (lint, test, build)
- No user decision needed

### When to Use Inline

- File creation (entities, components, pages)
- Code modifications
- Documentation updates
- User approval needed
- Course correction likely

---

## 📁 RELATED FILES

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` | Full architecture specification |
| `detector.md` | Project detection logic |
| `TEST_GUIDE.md` | Testing guide for auto-router validation |
| `cli.ts` | Executable CLI implementation |
| `registry.md` | Skill registry management |

---

## ✅ TESTING & VALIDATION

### Test Coverage Areas

```
┌─────────────────────────────────────────────────────────────────────┐
│  AUTO-ROUTER TEST COVERAGE                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. ⭐ TECH STACK DETECTION                                        │
│     ├── Language detection (TypeScript, Python, Go, Rust)          │
│     ├── Framework detection (React, Fastify, Django, dll.)         │
│     ├── Database detection (PostgreSQL, MongoDB, Redis)            │
│     └── DevOps detection (Docker, Kubernetes, Serverless)            │
│                                                                      │
│  2. ⭐ SKILL SELECTION                                             │
│     ├── Core skills auto-invoke (7 always-on)                      │
│     ├── Tech-based skills match (language/framework)                 │
│     ├── Phase-based skills (project lifecycle)                      │
│     └── Scoring algorithm correctness                               │
│                                                                      │
│  3. ⭐ PHASE DETECTION                                             │
│     ├── CLAUDE.md parsing                                           │
│     ├── Phase mapping to skills                                     │
│     └── Scale detection (MVP/Startup/Enterprise)                    │
│                                                                      │
│  4. ⭐ OUTPUT FORMAT                                               │
│     ├── Dashboard rendering                                         │
│     ├── Skills list accuracy                                        │
│     └── Recommendations scoring                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Run Tests

```bash
cd _system/auto-router
npm test
npm run test:coverage    # with coverage report
```

### Validation Checklist

```
BEFORE PUBLISHING:
├── [ ] All unit tests pass
├── [ ] Coverage > 80%
├── [ ] Tech stack detection works for all documented languages
├── [ ] Skill selection matches documented matrix
├── [ ] Phase detection parses CLAUDE.md correctly
├── [ ] Output format renders correctly
└── [ ] Manual testing in real project
```

---

## 🏷️ Metadata Tags

```
@core-skills /git,/code-quality,/config,/logging,/testing,/tdd,/mem-search
@tech-skills /typescript-pro,/api-design,/database,/ui-ux-pro-max
@phase-skills /api-design,/database,/ui-ux-pro-max
@auto-invoke always
@priority critical
```

---

*Version: 8.1.0 | Author: TheVoidSyntax*
*Features: Auto-Invoke Core Skills | Tech-Based Recommendations | Phase-Aware Selection | Workflow Execution Modes | Active Examples | Test Coverage*
