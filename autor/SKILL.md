---
name: autor
version: "2.0.0"
description: "Intelligent project analysis with Smart Auto-Invoke, Project Init, and Memory Continuity for Claude Code"
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
      auto_invoke: /autor, /mem-search
      reason: "Primary entry - invoke both autor and mem-search for project context continuity"
capabilities: [implementation, analysis]
source:
  origin: infrastructure
author: thevoidsyntax
---

# 🚀 AUTOR v2.0 - PROJECT INTELLIGENCE

**Intelligent Project Analysis with Smart Auto-Invoke & Memory Continuity**

---

## What's New in v2.0

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

### Layer Architecture v2.0

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: INFRASTRUCTURE (Always Available)               │
├─────────────────────────────────────────────────────────────┤
│  ├── autor/            ← Command interface                 │
│  └── auto-router/      ← Detection & loading system      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: CORE (12 Skills - Auto-loaded)                │
├─────────────────────────────────────────────────────────────┤
│  ├── git                 - Version control                 │
│  ├── config             - Environment & secrets           │
│  ├── security            - OWASP, encryption              │
│  ├── testing             - QA + TDD methodology           │
│  ├── error-debugger     - Debug patterns                │
│  ├── observability        - Logs + Metrics + Traces       │
│  ├── doc-generator       - Auto-documentation             │
│  ├── mem-search         - Memory continuity               │
│  ├── anti-slop          - Token efficiency                │
│  ├── chisle             - Context optimization            │
│  ├── caveman            - Aggressive compression         │
│  └── codebase-design    - Architecture + Domain modeling  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: CONDITIONAL (Auto-detect based on project)      │
├─────────────────────────────────────────────────────────────┤
│  ├── docker              - Containerization                │
│  ├── kubernetes          - Orchestration                   │
│  ├── terraform           - Infrastructure as Code         │
│  ├── deployment          - CI/CD + Deployment strategies   │
│  ├── serverless          - Lambda/Functions                │
│  ├── mobile              - React Native                   │
│  ├── browser-use         - Browser automation             │
│  ├── reticle             - Computer vision               │
│  └── [tech stack]        - Based on selected stack       │
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

### New Project
```
User: /autor new
  ↓
Autor: What type of project?
  ↓
User: Web app (Next.js)
  ↓
Auto-router loads:
  - Core skills (11)
  - Next.js patterns → /nextjs-pro
  - Database patterns → /postgresql-pro (if needed)
  - UI patterns → /tailwindcss
  ↓
READY FOR DEVELOPMENT
```

### Existing Project
```
User: /autor
  ↓
Mem-search: Retrieves project context
  ↓
Autor: Shows project analysis
  ↓
Auto-router: Detects tech stack
  ↓
Loads appropriate skills
  ↓
READY TO CONTINUE
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
