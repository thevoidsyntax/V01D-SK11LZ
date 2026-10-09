---
name: auto-router
version: "7.0.0"
description: "Intelligent project router with auto-invoke core skills, tech-based recommendations, and phase awareness. Use --new for new projects, --analyze for existing projects."
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

# AUTO-ROUTER v7.0

Smart Project Intelligence Tool with Auto-Invoke

```
┌──────────────────────────────────────────────────────────────────┐
│  🚀 AUTO-ROUTER v7.0                                           │
│  Smart Project Intelligence                                      │
│  ✅ Auto-Invoke Core Skills                                    │
│  ✅ Tech-Based Recommendations                                  │
│  ✅ Phase-Aware Selection                                       │
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
│  │ From CLAUDE.md - Current Phase: 9                          │   │
│  │ ✅ /ui-ux-pro-max   (Phase 9 - UI/UX focus)                │   │
│  │ ✅ /api-design      (Phase 9 - Products API)                │   │
│  │ ✅ /database        (Phase 9 - Products DB)                 │   │
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
| `/ui-ux-pro-max` | Frontend Best Practices | ⚠️ SPA detected |

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

### Phase 9 Example (VentroPos - Product Management)

```yaml
Current Phase: 9
Phase Focus: Products CRUD, Categories, Modifiers
Tech Stack: Fastify + PostgreSQL + React

Auto-Invoke:
  Core: /git, /code-quality, /config, /logging, /testing, /mem-search
  Tech: /typescript-pro, /api-design, /database, /ui-ux-pro-max
  Phase: /api-design (Products API), /database (Products DB)
  Recommended: /performance, /ui-ux-pro-max
```

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

## 📊 AUTO-INVOKE EXAMPLE: VentroPos Phase 9

### Project Detection

```
Detected:
  ├── Language: Node.js + TypeScript
  ├── Framework: Fastify
  ├── Database: PostgreSQL
  ├── Frontend: React + Vite
  ├── Architecture: DDD-Lite
  └── Current Phase: 9 (Product Management)
```

### Skills to Auto-Invoke

| Category | Skill | Reason | Score |
|----------|-------|--------|-------|
| **Core** | `/git` | Always | 50 |
| **Core** | `/code-quality` | Always | 50 |
| **Core** | `/config` | Always | 50 |
| **Core** | `/logging` | Always | 50 |
| **Core** | `/testing` | Always | 50 |
| **Core** | `/tdd` | Always | 50 |
| **Core** | `/mem-search` | Always | 50 |
| **Tech** | `/typescript-pro` | TypeScript | 75 |
| **Tech** | `/api-design` | Fastify | 75 |
| **Tech** | `/database` | PostgreSQL | 75 |
| **Tech** | `/ui-ux-pro-max` | React | 75 |
| **Tech** | `/security` | Backend API | 70 |
| **Tech** | `/domain-modeling` | DDD Pattern | 70 |
| **Phase** | `/api-design` | Phase 9 deliverable | 80 |
| **Phase** | `/database` | Phase 9 deliverable | 80 |
| **Phase** | `/ui-ux-pro-max` | Phase 9 deliverable | 80 |

### Skills to Recommend

| Skill | Reason | Score |
|-------|--------|-------|
| `/performance` | Bundle optimization | 45 |
| `/ui-ux-pro-max` | React patterns | 40 |
| `/docker` | Deployment ready | 35 |

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
| React | `/ui-ux-pro-max`, `/ui-ux-pro-max`, `/performance` |
| Docker | `/docker`, `/ci-cd`, `/deployment` |
| DDD Pattern | `/domain-modeling`, `/architecture-patterns` |
| Phase 9 | `/api-design`, `/database`, `/ui-ux-pro-max` |

---

## ✨ SMART TERMINAL INTERFACE

### Auto-Invoke Dashboard

```
╔══════════════════════════════════════════════════════════════════════════╗
║  🚀 AUTO-ROUTER v7.0 ✨ AUTO-INVOKE ENABLED                      ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Project: VentroPos                    Phase: 9                      ║
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
║  [ ] /frontend          ████████░░░░░░░░░░░░░░░  40%  MED           ║
║  [ ] /docker            ███████░░░░░░░░░░░░░░░░░  35%  LOW           ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 📁 RELATED FILES

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` | Full architecture specification |
| `detector.md` | Project detection logic |
| `TEST_GUIDE.md` | Testing guide |

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

*Version: 7.0.0 | Author: TheVoidSyntax*
*Features: Auto-Invoke Core Skills | Tech-Based Recommendations | Phase-Aware Selection*
