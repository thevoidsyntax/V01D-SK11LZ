---
name: auto-router
version: "6.0.0"
description: "Ultimate intelligent project router with keyword detection, state persistence, phase auto-tracking, and comprehensive skill automation"
priority: critical
phase: any
category: [process]
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: "/auto-router"
      reason: "Primary entry point"
    - command: "/auto-route"
      reason: "Primary entry point (alias)"
    - command: "/autoroute"
      reason: "Primary entry point (no dash)"
    - phrase: ["project baru", "new project", "create project", "init project"]
      reason: "New project intent detected"
    - phrase: ["analyze", "audit", "scan project"]
      reason: "Analysis intent detected"
    - phrase: ["recommend", "suggest", "skill"]
      reason: "Recommendation intent detected"
integrates_with:
  - project-init
  - analyze-project
  - workflow-authoring
capabilities:
  - discovery
  - implementation
  - analysis
quality:
  rules_count: 50
  examples_count: 20
  stability: stable
source:
  origin: local
author: TheVoidSyntax
---

# 🚀 AUTO-ROUTER v6.0 - ULTIMATE PROJECT INTELLIGENCE

**The single command to rule them all.**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🚀 AUTO-ROUTER v6.0 ULTIMATE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ██████╗  ██████╗  ██████╗ ████████╗ ██████╗  ██████╗ ██╗     ███████╗  │
│   ██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██╔════╝  │
│   ██████╔╝██║   ██║██║   ██║   ██║   ██║   ██║██║   ██║██║     █████╗    │
│   ██╔═══╝ ██║   ██║██║   ██║   ██║   ██║   ██║██║   ██║██║     ██╔══╝    │
│   ██║     ╚██████╔╝╚██████╔╝   ██║   ╚██████╔╝╚██████╔╝███████╗███████╗  │
│   ╚═╝      ╚═════╝  ╚═════╝    ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚══════╝  │
│                                                                             │
│   ███████╗███████╗ ██████╗ █████╗ ██████╗ ███████╗                         │
│   ██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝                         │
│   █████╗  ███████╗██║     ███████║██████╔╝█████╗                           │
│   ██╔══╝  ╚════██║██║     ██╔══██║██╔═══╝ ██╔══╝                           │
│   ███████╗███████║╚██████╗██║  ██║██║     ███████╗                         │
│   ╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 QUICK START

```bash
# Primary command - works everywhere
/auto-router

# Aliases
/auto-route
/autoroute

# Specific modes
/auto-router --new                    # New project
/auto-router --analyze                # Analyze existing
/auto-router --phase 3                # Continue Phase 3
/auto-router --skills=api-design       # Specific skills
```

---

## 🔥 NEW IN v6.0

### ✨ Keyword Detection Engine
Skills now auto-activate based on **what you say**, not just what files exist:

```
User: "I need to add JWT authentication"
     ↓
auto-router detects: ['auth', 'jwt', 'login']
     ↓
Auto-invokes: /security, /identity
```

### 💾 State Persistence
Your project state now persists across sessions:
- Track completed phases
- Remember invoked skills
- Resume where you left off

### 🔄 Phase Auto-Tracking
When you complete a phase:
```
/auto-router --phase-complete 3
     ↓
Updates CLAUDE.md automatically
Marks Phase 3 as ✅ DONE
```

---

## 📋 COMMAND REFERENCE

### Core Commands

| Command | Description |
|---------|-------------|
| `/auto-router` | Auto-detect and route |
| `/auto-router --new` | Create new project |
| `/auto-router --analyze` | Analyze existing project |
| `/auto-router --phase [N]` | Continue Phase N |
| `/auto-router --skills=s1,s2` | Activate specific skills |

### Advanced Commands

| Command | Description |
|---------|-------------|
| `--quick` | Fast scan mode |
| `--deep` | Deep analysis mode |
| `--auto-fix` | Auto-fix issues |
| `--workflow=NAME` | Run workflow template |
| `--status` | Show project status |
| `--recommend` | Get recommendations |

### Phase Commands

| Command | Description |
|---------|-------------|
| `--phase-complete [N]` | Mark Phase N done |
| `--phase-progress [N]` | Mark Phase N in progress |
| `--phase-next` | Move to next phase |

---

## 🧠 KEYWORD DETECTION SYSTEM

### How It Works

```
┌────────────────────────────────────────────────────────────────┐
│  INPUT: "I need to add JWT authentication to my API"         │
│                                                                │
│  ↓ KEYWORD EXTRACTION                                         │
│                                                                │
│  Detected keywords:                                            │
│  • auth          (score: 25)                                 │
│  • jwt           (score: 25)                                  │
│  • api           (score: 30)                                  │
│  • authentication (score: 25)                                 │
│                                                                │
│  ↓ SKILL MATCHING                                              │
│                                                                │
│  Matched skills:                                               │
│  • /security     (total: 75)  → AUTO-INVOKE                 │
│  • /identity     (total: 50)  → AUTO-INVOKE                 │
│  • /api-design   (total: 30)  → RECOMMEND                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Keyword → Skill Mapping

| Keyword Category | Skills | Example Phrases |
|-----------------|--------|-----------------|
| **auth** | security, identity | "login", "jwt", "oauth", "password", "session" |
| **database** | database, data-engineering | "postgres", "mongodb", "query", "migration" |
| **api** | api-design, api-client | "rest", "endpoint", "graphql", "route" |
| **docker** | docker, deployment | "container", "dockerize", "docker-compose" |
| **testing** | testing, tdd | "test", "vitest", "jest", "coverage" |
| **performance** | performance, observability | "slow", "optimize", "bundle", "monitor" |
| **architecture** | architecture-patterns, domain-modeling | "ddd", "hexagonal", "microservices" |
| **security** | audit, security | "audit", "vulnerability", "owasp", "scan" |
| **debug** | diagnosing-bugs, reliability | "bug", "debug", "error", "crash" |

---

## 🔄 DETECTION FLOW

```
                    ┌─────────────────────────────────────────┐
                    │         /auto-router invoked           │
                    └───────────────────┬─────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
                    ▼                                       ▼
            ┌───────────────┐                       ┌───────────────┐
            │  NEW PROJECT?  │                       │ EXISTING?     │
            └───────┬───────┘                       └───────┬───────┘
                    │                                       │
            ┌───────┴───────┐                       ┌───────┴───────┐
            ▼               ▼                       ▼               ▼
      ┌──────────┐   ┌──────────┐           ┌──────────┐   ┌──────────┐
      │ --new    │   │ Auto     │           │ Analyze  │   │ --status │
      │ flag set │   │ detect   │           │ Tech     │   │ Show     │
      └────┬─────┘   └────┬─────┘           │ Stack    │   │ Progress │
           │               │                 └────┬─────┘   └──────────┘
           ▼               ▼                       │
    ┌──────────┐   ┌──────────┐           ┌──────┴──────┐
    │ project- │   │ Check    │           │             │
    │ init     │   │ keywords │           ▼             │
    │ flow     │   └────┬─────┘     ┌────────────┐     │
    └──────────┘        │           │ Skill      │     │
                         ▼           │ Selection  │◄────┘
                   ┌──────────┐      └──────┬─────┘
                   │ Invoke   │             │
                   │ matching │             ▼
                   │ skills   │      ┌────────────┐
                   └──────────┘      │ Show       │
                                      │ recommendations
                                      └────────────┘
```

---

## 📊 KEYWORD → SKILL MATRIX

### Security & Auth
```
Keywords: auth, login, jwt, oauth, password, session, mfa, 2fa, permission, role
Skills: /security, /identity
Score: 25-30 per keyword
```

### Database & Data
```
Keywords: postgres, mysql, mongodb, database, sql, query, migration, schema, cache
Skills: /database, /data-engineering, /scalability
Score: 25-30 per keyword
```

### API & Backend
```
Keywords: rest, api, endpoint, route, http, request, response, graphql, grpc
Skills: /api-design, /api-client
Score: 25-30 per keyword
```

### DevOps & Deployment
```
Keywords: docker, kubernetes, k8s, ci, cd, pipeline, deploy, terraform, aws
Skills: /docker, /kubernetes, /ci-cd, /deployment, /terraform
Score: 25-30 per keyword
```

### Frontend & UI
```
Keywords: react, vue, angular, ui, component, css, responsive, mobile
Skills: /frontend, /performance
Score: 20-25 per keyword
```

### Testing & Quality
```
Keywords: test, unit test, integration, e2e, vitest, jest, tdd, coverage
Skills: /testing, /tdd, /code-quality
Score: 25-30 per keyword
```

### Architecture & Patterns
```
Keywords: architecture, ddd, clean architecture, hexagonal, microservices, domain
Skills: /architecture-patterns, /domain-modeling
Score: 25-30 per keyword
```

### Observability & Monitoring
```
Keywords: log, logging, monitor, metrics, prometheus, trace, opentelemetry
Skills: /logging, /observability
Score: 20-25 per keyword
```

### Debugging & Reliability
```
Keywords: bug, fix, debug, error, exception, crash, slo, sla, incident
Skills: /diagnosing-bugs, /reliability
Score: 25-30 per keyword
```

### Documentation
```
Keywords: docs, readme, documentation, comment, changelog
Skills: /documentation, /anti-slop
Score: 15-20 per keyword
```

---

## 💾 STATE PERSISTENCE

### What Gets Saved

```
~/.claude/state/projects.json

{
  "projectPath": {
    "path": "/path/to/project",
    "projectName": "my-app",
    "lastAnalyzed": "2024-01-15T10:30:00Z",
    "techStack": { "frameworks": ["fastify"], "databases": ["postgresql"] },
    "scale": "small",
    "currentPhase": 3,
    "activeSkills": ["/security", "/database"],
    "invokedSkills": ["/git", "/docker", "/ci-cd"],
    "completedTasks": ["Phase 1", "Phase 2"],
    "recommendations": [...],
    "history": [
      { "date": "...", "action": "...", "result": "success" }
    ]
  }
}
```

### Commands

```bash
/auto-router --status          # Show current project status
/auto-router --history         # Show invocation history
/auto-router --reset           # Reset project state
```

---

## 🔄 PHASE AUTO-TRACKING

### Mark Phase Complete

```bash
/auto-router --phase-complete 3
```

This will:
1. Update CLAUDE.md: `Phase 3: ... [✅ DONE]`
2. Save state: `currentPhase: 4`
3. Offer: Next phase recommendations

### Move to Next Phase

```bash
/auto-router --phase-next
```

---

## 🎯 SKILL SELECTION ALGORITHM

### Scoring System

```
┌────────────────────────────────────────────────────────────┐
│  SKILL RELEVANCE SCORE                                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Base Score: 0                                            │
│                                                            │
│  +───────────────────────────────                          │
│  │ KEYWORD MATCH (per keyword)     +25-50                 │
│  +───────────────────────────────                          │
│  │ TECH STACK MATCH                 +25                    │
│  +───────────────────────────────                          │
│  │ PHASE REQUIREMENT                +30                    │
│  +───────────────────────────────                          │
│  │ CORE SKILL                      +50                    │
│  +───────────────────────────────                          │
│  │ PREVIOUS INVOCATION             +10                    │
│  +───────────────────────────────                          │
│  │ SCALE MATCH                     +15                    │
│  +───────────────────────────────                          │
│                                                            │
│  ─────────────────────────────────────                     │
│  THRESHOLD: 50 → AUTO-INVOKE                              │
│  THRESHOLD: 30-49 → RECOMMEND                             │
│  THRESHOLD: <30 → SKIP                                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 📁 WORKFLOW TEMPLATES

### Available Templates

```bash
/auto-router --workflow=rest-api
/auto-router --workflow=fullstack-web
/auto-router --workflow=microservices
/auto-router --workflow=cli-tool
/auto-router --workflow=library
/auto-router --workflow=mobile-app
/auto-router --workflow=data-pipeline
```

### Template Previews

```
┌─────────────────────────────────────────────────────────────┐
│  WORKFLOW: rest-api                                        │
├─────────────────────────────────────────────────────────────┤
│  Duration: 3-5 days                                        │
│  Phases: design → scaffold → implement → secure → test → deploy │
│  Skills: api-design, fullstack-guardian, security, testing   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  WORKFLOW: fullstack-web                                   │
├─────────────────────────────────────────────────────────────┤
│  Duration: 5-10 days                                      │
│  Phases: architecture → backend → frontend → test → deploy │
│  Skills: architecture, fullstack, frontend, testing       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 EXAMPLE INTERACTIONS

### Example 1: New Project with Keywords
```
User: /auto-router --new
System: Creating new project...
User: I want a REST API with PostgreSQL and JWT auth

System: Detected keywords:
  • api (+30)
  • database (+30)
  • postgres (+25)
  • auth (+25)
  • jwt (+25)

Auto-invoking:
  ✅ /api-design (85)
  ✅ /database (55)
  ✅ /security (50)
  ✅ /docker (core)
  ✅ /git (core)
```

### Example 2: Adding Feature
```
User: I need to add Redis caching to speed up my API

System: Detected keywords:
  • cache (+25)
  • performance (+20)
  • api (+30)

Auto-invoking:
  ✅ /scalability (45)
  ✅ /performance (50)
  📋 Recommending: /observability

Implementation plan:
  1. Add Redis client configuration
  2. Implement cache middleware
  3. Add cache invalidation strategy
  4. Add cache metrics
```

### Example 3: Debugging
```
User: My API is returning 500 errors and I can't figure out why

System: Detected keywords:
  • error (+25)
  • api (+30)
  • bug (+30)

Auto-invoking:
  ✅ /diagnosing-bugs (55)
  ✅ /logging (core)

Running diagnostic:
  1. Check error logs...
  2. Analyze stack traces...
  3. Review recent changes...
```

---

## 🔧 CONFIGURATION

### Skill Priorities

Edit `~/.claude/state/skills.json` to customize:

```json
{
  "skillPriorities": {
    "security": "always",
    "docker": "auto",
    "testing": "recommend"
  },
  "keywordSensitivity": 0.7,
  "autoInvokeThreshold": 50
}
```

### Ignore Files

Add to `.claudeignore`:

```
# Don't auto-invoke these skills
/skip:ml-engineering
/skip:mobile
```

---

## 📚 RELATED FILES

| File | Purpose |
|------|---------|
| `detector.ts` | Project detection & keyword analysis |
| `selector.ts` | Dynamic skill selection algorithm |
| `workflows.md` | Workflow templates |
| `registry.md` | Complete skill registry |

---

## 🚀 USAGE TIPS

### 1. Be Descriptive
```
❌ "fix bug"
✅ "debug 500 error in user authentication endpoint"
```
More keywords = better skill matching

### 2. Mention Tech Stack
```
❌ "add auth"
✅ "add JWT authentication to Fastify API"
```

### 3. Specify Intent
```
❌ "improve"
✅ "optimize database queries for better performance"
```

---

*Version: 6.0.0 | Author: TheVoidSyntax | Ultimate Mode: ENABLED*
*Features: Keyword Detection | State Persistence | Phase Auto-Tracking | Workflow Templates*
