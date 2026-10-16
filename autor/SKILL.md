---
name: autor
version: "2.3.0"
description: "Intelligent project analysis with Smart Flow, Personas, HYBRID Token Distribution, and Memory Continuity for Claude Code"
when_to_use: "Run when starting a new project, analyzing existing codebase, or needing project intelligence."
priority: critical
phase: any
category: [process, intelligence]
tech_stack:
  languages: [all]
  frameworks: [all]
  databases: [all]
  services: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/autor", "/ar", "/autor scan", "/autor status", "/autor analyze", "/autor help", "/autor new", "/autor init"]
      auto_invoke: /autor, /git, /config, /security, /testing, /error-debugger, /observability, /doc-generator, /mem-search, /anti-slop, /chisle, /caveman, /codebase-design
      reason: "Primary entry - invoke autor with all 12 core skills for project intelligence"
capabilities: [implementation, analysis]
source:
  origin: infrastructure
author: thevoidsyntax
---

# 🚀 AUTOR v2.2 - PROJECT INTELLIGENCE

**Smart Project Flow with Personas & Contextual Intelligence**

---

## What's New in v2.2

### Smart Project Flow
```
NEW PROJECT: Satria First
  → Satria coordinates team as needed

EXISTING PROJECT: Contextual Assessment
  → Analyze → Assess → Recommend (or no recommendation if healthy)
```

### Personas Integrated
```
┌─────────────────────────────────────────────────────────────┐
│  PERSONAS FLOW                                            │
├─────────────────────────────────────────────────────────────┤
│  NEW PROJECT:                                             │
│    Satria (PM) → Team Coordinator                         │
│      → Calls Athena when needed                          │
│      → Calls Dina when needed                            │
│      → Calls Frans when ready to deploy                  │
│                                                             │
│  EXISTING PROJECT:                                        │
│    Contextual → Based on project state                    │
│      Healthy → No persona needed                         │
│      Has issues → Suggest TOP priority fix only           │
└─────────────────────────────────────────────────────────────┘
```

### Memory Continuity
```
┌─────────────────────────────────────────────────────────────┐
│  MEMORY INTEGRATION                                          │
├─────────────────────────────────────────────────────────────┤
│  Every /autor call automatically invokes /mem-search       │
│  → Retrieves project context from previous sessions         │
│  → Ensures continuity across chat sessions                  │
└─────────────────────────────────────────────────────────────┘
```

### Layer Architecture v2.1

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: INFRASTRUCTURE (Always Available)               │
├─────────────────────────────────────────────────────────────┤
│  ├── autor/            ← Command interface                 │
│  └── auto-router/      ← Detection & loading system        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: PERSONAS (Available with /autor)                │
├─────────────────────────────────────────────────────────────┤
│  ├── Satria (PM)       - BRD, PRD, FSD                   │
│  ├── Athena (SE)       - Architecture, code               │
│  ├── Dina (QA)         - Security, testing                │
│  └── Frans (DevOps)    - Deployment, monitoring           │
│  All auto-invoke: anti-slop + chisle + caveman            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: CORE (12 Skills - Auto-loaded)                  │
├─────────────────────────────────────────────────────────────┤
│  ├── git                 - Version control                 │
│  ├── config             - Environment & secrets            │
│  ├── security            - OWASP, encryption              │
│  ├── testing             - QA + TDD methodology           │
│  ├── error-debugger     - Debug patterns                  │
│  ├── observability        - Logs + Metrics + Traces       │
│  ├── doc-generator       - Auto-documentation             │
│  ├── mem-search         - Memory continuity               │
│  ├── anti-slop          - Token efficiency                │
│  ├── chisle             - Context optimization            │
│  ├── caveman            - Aggressive compression          │
│  └── codebase-design    - Architecture + Domain modeling  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  LAYER 4: CONDITIONAL (Auto-detect based on project)      │
├─────────────────────────────────────────────────────────────┤
│  ├── docker              - Containerization                │
│  ├── kubernetes          - Orchestration                   │
│  ├── terraform           - Infrastructure as Code         │
│  ├── deployment          - CI/CD + Deployment strategies  │
│  ├── serverless          - Lambda/Functions               │
│  ├── mobile              - React Native                   │
│  ├── browser-use         - Browser automation             │
│  ├── reticle             - Computer vision                │
│  └── [tech stack]        - Based on detected stack        │
└─────────────────────────────────────────────────────────────┘
```

---

## Commands

```
/autor              → Analyze project OR start empty project flow
/autor scan         → Full project analysis with health score
/autor new          → Force empty project wizard
/autor status       → Show project state
/autor --help       → Show this help
```

---

## Auto-Invoke System

### Core Skills (Always Available)
When you invoke `/autor`, the following 12 core skills are automatically loaded:

| Skill | Purpose | Auto-loaded |
|-------|---------|-------------|
| `git` | Version control | ✅ |
| `config` | Environment management | ✅ |
| `security` | OWASP, encryption | ✅ |
| `testing` | QA + TDD | ✅ |
| `error-debugger` | Debug patterns | ✅ |
| `observability` | Logs + Metrics + Traces | ✅ |
| `doc-generator` | Auto-documentation | ✅ |
| `mem-search` | Memory continuity | ✅ |
| `anti-slop` | Token efficiency | ✅ |
| `chisle` | Context optimization | ✅ |
| `caveman` | Aggressive compression | ✅ |
| `codebase-design` | Architecture | ✅ |

### Personas (Auto-Available with /autor)

| Persona | Name | Role | Command |
|---------|------|------|---------|
| PM Agent | **Satria** | Project Manager | `/satria` or `/pm` |
| SE Agent | **Athena** | Software Engineer | `/athena` or `/se` |
| QA Agent | **Dina** | Quality Assurance | `/dina` or `/qa` |
| DevOps Agent | **Frans** | Platform Engineer | `/frans` or `/devops` |

All personas auto-invoke: `anti-slop` + `chisle` + `caveman` for ~80-90% token savings.

Use `/team` to invoke full workflow: Satria → Athena → Dina → Frans → Production

### Conditional Skills (Auto-detect)

| Pattern Detected | Skill Loaded |
|------------------|--------------|
| React patterns | `/react-pro` |
| Next.js patterns | `/nextjs-pro` |
| Python patterns | `/python-pro` |
| PostgreSQL patterns | `/postgresql-pro` |
| Docker files | `/docker` |
| Kubernetes files | `/kubernetes` |
| GitHub Actions | `/deployment` |
| ...and more | See auto-router |

---

## Project Flow

### New Project Flow
```
User: /autor new
  ↓
1. Analyze project type
  ↓
2. "Recommended: Start with /satria (PM) for planning"
  ↓
3. Satria invoked → Satria decides when to involve team
  ↓
4. Satria coordinates: Athena → Dina → Frans → Production
```

### Existing Project Flow
```
User: /autor
  ↓
1. Deep Analysis (ASSESS project state)
  ↓
2. Health Check:
   - Tests coverage
   - CI/CD status
   - Documentation state
   - Security audit status
   - Code quality
  ↓
3. Assessment Result:
   ┌─────────────────────────────────────────┐
   │  If HEALTHY:                            │
   │    → Show analysis, no persona needed   │
   │                                         │
   │  If HAS ISSUES:                         │
   │    → Recommend TOP priority fix only    │
   │    → Suggest persona who can help       │
   └─────────────────────────────────────────┘
  ↓
4. User decides what to tackle or continues solo
```

### Assessment Logic

| Project State | Assessment | Recommendation |
|--------------|------------|-----------------|
| No tests | "Test coverage needed" | `/dina` (testing) |
| CI/CD missing | "CI/CD not configured" | `/frans` (devops) |
| No documentation | "Docs missing/outdated" | `/satria` or `/athena` |
| Deploy failing | "Deployment issues" | `/frans` (devops) |
| Security concerns | "Security audit needed" | `/dina` (security) |
| Complex feature | "Architecture review needed" | `/athena` |
| Good state | "Project healthy" | No persona needed |

### Team Coordination

```
Satria (PM) → Owns project planning and team coordination
  ↓ calls when needed:
  - Athena → for architecture/feature work
  - Dina → for testing/security
  - Frans → for deployment/infrastructure
```

---

## Token Distribution

### How It Works

```
/autor invoked
    ↓
12 Core Skills LOADED
(git, config, security, testing, error-debugger, observability,
 doc-generator, mem-search, anti-slop, chisle, caveman, codebase-design)
    ↓
Persona invoked (e.g., /athena)
    ↓
├── Inherited skills → NO additional token (already loaded)
└── Extended skills → Adds token cost
```

### Skills by Category

| Category | Token Cost | Skills |
|----------|-----------|--------|
| **Core (from /autor)** | 1x (shared) | git, config, security, testing, error-debugger, observability, doc-generator, mem-search, anti-slop, chisle, caveman, codebase-design |
| **Persona Extended** | +N per skill | Varies by persona |

### Persona Extended Skills (Adds Token)

| Persona | Extended Skills | Count |
|---------|----------------|-------|
| Satria | brd, fsd, prd, architecture-patterns, tech-debt, code-quality, audit | +7 |
| Athena | api-design, architecture-patterns, design-patterns, code-quality, diagnosing-bugs, tech-debt, performance, reliability, scalability | +9 |
| Dina | playwright, testing-integration, test-generator, pentest, compliance, diagnosing-bugs, audit | +7 |
| Frans | docker, deployment, kubernetes, terraform, devops-engineer, platform-engineering, cloud-architect, error-tracking, reliability, scalability | +10 |

### Token Example

```
Scenario: /autor → /athena → Write E2E tests

Step 1: /autor
  → Loads 12 core skills = 1x token

Step 2: /athena
  → Inherits 12 core skills = 0 additional token
  → Loads extended skills (api-design, etc.) = +9 token

Total additional from persona = 9 (vs 21 if all listed separately)

Efficiency: ~57% token savings
```

---

## Smart Pattern Detection

### Auto-Infer from Context

```
┌─────────────────────────────────────────────────────────────┐
│  USER SAYS: "useState hook in React"                      │
│  → Auto-detects: React + useState                        │
│  → Auto-invokes: /react-pro                              │
│  → Provides: useState patterns + best practices            │
├─────────────────────────────────────────────────────────────┤
│  USER SAYS: "postgres connection error"                   │
│  → Auto-detects: PostgreSQL + Error                      │
│  → Auto-invokes: /postgresql-pro + /error-debugger       │
│  → Provides: Connection fix + error debugging             │
└─────────────────────────────────────────────────────────────┘
```

---

## Token Efficiency

### Built-in Optimizations

| Tool | Purpose | Token Savings |
|------|---------|---------------|
| `anti-slop` | Remove verbose AI patterns | ~30-40% |
| `chisle` | Context pruning | ~20-30% |
| `caveman` | Aggressive compression | ~65% |

---

## Examples

### New Project - Web App

```
User: /autor new web app
Autor: What type of web app?
User: E-commerce store
Autor: 
✅ Recommended Stack:
├─ Frontend: Next.js 15 + React + Tailwind
├─ UI: shadcn/ui components
├─ Database: PostgreSQL + Prisma
├─ Auth: NextAuth.js or Clerk
├─ Payments: Stripe
├─ Email: Resend
└─ Deploy: Vercel + Railway (DB)
├─ Commands:
│  npx create-next-app@latest mystore --tailwind --typescript
│  cd mystore && npx shadcn@latest init
│  npx prisma init
│  vercel deploy
└─ Skills loaded: /nextjs-pro /tailwindcss /prisma /security /testing
```

### Existing Project - Error Detection

```
User: TypeError: Cannot read property 'map' of undefined
Autor: 
🔴 ERROR DETECTED: TypeError
├─ /error-debugger invoked automatically
├─ /mem-search invoked for project context
├─ Root cause: Variable is undefined, not an array
├─ Fix options:
│  1. Add optional chaining: data?.map(...)
│  2. Add null check: if (Array.isArray(data)) ...
│  3. Add fallback: const safeData = data ?? []
└─ Skills loaded: /error-debugger /testing
```

---

## Changelog

### v2.3.0 (HYBRID Token Distribution)
- ✅ Token Distribution section added
- ✅ Clear distinction: Inherited vs Extended skills
- ✅ ~57% token savings vs listing all skills separately
- ✅ Skills per persona: Satria (19), Athena (21), Dina (19), Frans (22)

### v2.2.0 (Smart Project Flow)
- ✅ Smart Flow: NEW PROJECT → Satria First
- ✅ Smart Flow: EXISTING PROJECT → Contextual Assessment
- ✅ Health Check for existing projects
- ✅ Single TOP priority recommendation (not multiple options)
- ✅ Satria as Team Coordinator
- ✅ Team coordination: Satria calls others as needed

### v2.1.0 (Personas Integration)
- ✅ PERSONAS LAYER: Satria, Athena, Dina, Frans now available with /autor
- ✅ All personas auto-invoke: anti-slop + chisle + caveman
- ✅ LAYER REORDERED: Infrastructure → Personas → Core (12) → Conditional
- ✅ New `/team` command for full workflow

### v2.0.0 (Layer Architecture Redesign)
- ✅ INFRASTRUCTURE LAYER: autor + auto-router separated
- ✅ CORE LAYER: 11 skills (auto-loaded)
- ✅ CONDITIONAL LAYER: Auto-detect based on project
- ✅ MEMORY INTEGRATION: mem-search auto-invoked
- ✅ TOKEN EFFICIENCY: anti-slop, chisle, caveman included

### v1.0.0 (Previous)
- Basic project analysis
- Skill recommendations
- Gap detection

---

*Built for developers who ship!*
