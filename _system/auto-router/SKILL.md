---
name: auto-router
version: "6.0.0"
description: "Ultimate intelligent project router with intent detection, context awareness, and learning capabilities"
priority: critical
phase: any
category: [process]
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/auto-router", "/auto-route", "/autoroute"]
      reason: "Primary entry point"
    - phrase: ["project baru", "new project", "create project", "init project", "analyze", "audit"]
      reason: "Project operation intent"
integrates_with:
  - project-init
  - analyze-project
  - workflow-authoring
capabilities:
  - discovery
  - implementation
  - analysis
quality:
  rules_count: 60
  examples_count: 25
  stability: stable
source:
  origin: local
author: TheVoidSyntax
---

# AUTO-ROUTER v6.0

Smart Project Intelligence Tool

```
┌──────────────────────────────────────────────────────────┐
│  🚀 AUTO-ROUTER v6.0                                  │
│  Smart Project Intelligence                              │
│  Intent Detection • Confidence Scoring • Smart UI       │
└──────────────────────────────────────────────────────────┘
```


---

## 🎯 SIMPLE COMMANDS

### Primary Commands

| Command | Fungsi |
|---------|--------|
| `/autor` | Auto-detect & show Smart Dashboard |
| `/autor new` | New project |
| `/autor scan` | Analyze existing project |
| `/autor status` | Show project status |

### Aliases

```
/ar  = /autor
/ar n = /autor new
/ar s = /autor scan
```

### Examples

```
/autor                → Smart Dashboard
/autor new            → Start new project
/autor scan            → Analyze current project
/autor status          → Show saved state
```

---

## ✨ v6.0 OPTIMIZATIONS

### 1. Intent Detection
Skills now understand **what you want to do**, not just what files exist.

### 2. Confidence Scoring
Each recommendation comes with confidence level: 🟢 HIGH | 🟡 MEDIUM | 🔴 LOW

### 3. Learning System
Tracks your skill usage patterns and prioritizes frequently-used skills.

### 4. Pattern Recognition
Automatically detects project patterns: DDD, Clean Architecture, Microservices, Monorepo.

---

## 🧠 HOW IT WORKS

```
┌────────────────────────────────────────────────────────────────────────────┐
│  INPUT: "I need to add JWT authentication to my Fastify API"           │
│                                                                            │
│  ↓ INTENT DETECTION                                                       │
│  • CREATE intent detected                                                 │
│  • Security keywords found: jwt, auth, login                              │
│  • Tech detected: fastify                                                │
│                                                                            │
│  ↓ SKILL MATCHING                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  SKILL              SCORE   CONFIDENCE  REASON                   │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │  /security            85     🟢 HIGH     Keywords: jwt, auth       │   │
│  │  /identity           60     🟢 HIGH     Keywords: login, verify  │   │
│  │  /api-design         45     🟡 MED     Framework: fastify     │   │
│  │  /logging            25     🟡 MED     Core skill              │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ↓ AUTO-INVOKE                                                            │
│  ✅ /security  (85 - HIGH confidence)                                     │
│  ✅ /identity  (60 - HIGH confidence)                                     │
│  📋 /api-design (45 - Recommended)                                        │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 KEYWORD → SKILL MATRIX

| Category | Skills | Keywords |
|---------|--------|----------|
| **Security** | `/security`, `/identity` | auth, jwt, oauth, password, permission, role, encrypt, tls, ssl |
| **Database** | `/database`, `/data-engineering` | postgres, mysql, mongodb, query, migration, schema, etl, pipeline |
| **API** | `/api-design`, `/api-client` | rest, graphql, endpoint, route, http, validate, openapi |
| **DevOps** | `/docker`, `/kubernetes`, `/terraform`, `/ci-cd` | container, k8s, kubernetes, terraform, pipeline, deploy |
| **Frontend** | `/frontend`, `/performance` | react, vue, component, ui, css, bundle, optimize |
| **Testing** | `/testing`, `/tdd` | test, vitest, jest, coverage, tdd, unit test |
| **Architecture** | `/architecture-patterns`, `/domain-modeling` | ddd, hexagonal, microservices, entity, aggregate |
| **Observability** | `/logging`, `/observability` | log, monitor, metrics, prometheus, trace |
| **Quality** | `/code-quality`, `/audit` | lint, format, review, audit, scan, analyze |
| **Debugging** | `/diagnosing-bugs`, `/reliability` | bug, fix, debug, error, crash, slo, sla |

---

## 🟢 CORE SKILLS (Always Auto-Invoke)

These skills are **always auto-invoked** regardless of project size or scale:

| Category | Skills | Function |
|----------|--------|----------|
| **Version Control** | `/git` | Version control |
| **DevOps** | `/docker`, `/ci-cd`, `/deployment` | Containers, pipelines, deploy |
| **Quality** | `/code-quality`, `/testing` | Linting, testing |
| **Config** | `/config`, `/logging` | Environment, logging |
| **Security** | `/security`, `/pentest` | Security + Pentesting tools |
| **Architecture** | `/tdd`, `/domain-modeling`, `/architecture-patterns` | TDD, DDD, system design |
| **Debugging** | `/diagnosing-bugs` | Debug assistance |

**Total: 13 CORE skills** always active for any project size.

### Pentest Tools in `/pentest`

| Tool | Purpose |
|------|---------|
| **Nuclei** | CVE/vulnerability scanner |
| **OWASP ZAP** | Web app scanner |
| **SQLMap** | SQL injection |
| **dalfox** | XSS scanner |
| **FFUF** | API/URL fuzzer |
| **Subfinder** | Subdomain enumeration |
| **Hydra** | Brute force |

---

## 🎯 INTENT PATTERNS

The router understands user intents:

| Intent | Keywords | Boost |
|--------|----------|-------|
| **CREATE** | create, add, build, implement, generate | +30% to relevant skills |
| **DEBUG** | debug, fix, bug, error, issue | +50% to diagnosing-bugs |
| **ANALYZE** | analyze, audit, review, check | +50% to audit |
| **DEPLOY** | deploy, release, ship, launch | +30% to deployment |

---

## 🔄 COMMAND FLOW

```
/auto-router
    │
    ├─→ DETECT PROJECT STATE
    │       ├── New project → project-init flow
    │       ├── Existing → analyze-project flow
    │       └── Partial → Offer options
    │
    ├─→ ANALYZE INPUT
    │       ├── Extract keywords
    │       ├── Detect intent (CREATE/DEBUG/ANALYZE/DEPLOY)
    │       └── Match to skills
    │
    ├─→ SCORE SKILLS
    │       ├── Keyword match (+35)
    │       ├── Tech stack (+25)
    │       ├── Phase match (+30)
    │       ├── Scale match (+15)
    │       └── Preference (+15)
    │
    ├─→ CATEGORIZE
    │       ├── 🟢 CORE (always)
    │       ├── 🔵 KEYWORD-MATCHED (auto)
    │       ├── 🟡 CONTEXT (recommended)
    │       └── ⚪ OPTIONAL (selectable)
    │
    └─→ INVOKE & TRACK
            ├── Auto-invoke top matches
            ├── Show recommendations
            └── Save to state
```

---

## 📋 COMMANDS REFERENCE

### Core Commands
```bash
/auto-router              # Auto-detect and route
/auto-router --new        # New project mode
/auto-router --analyze    # Analyze existing
/auto-router --phase [N]  # Continue Phase N
```

### Advanced Commands
```bash
/auto-router --status     # Show project status
/auto-router --history    # Show invocation history
/auto-router --reset     # Reset project state
/auto-router --quick     # Fast mode (skip analysis)
/auto-router --deep      # Deep analysis mode
```

### Workflow Commands
```bash
/auto-router --workflow=rest-api
/auto-router --workflow=fullstack-web
/auto-router --workflow=microservices
/auto-router --workflow=cli-tool
/auto-router --workflow=library
```

### Phase Commands
```bash
/auto-router --phase-complete [N]  # Mark Phase N done
/auto-router --phase-progress [N]   # Mark Phase N in progress
/auto-router --phase-next          # Move to next phase
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
│  │ KEYWORD MATCH           +35     (detected in input)        │
│  │ • Exact keyword         +15     (additional)               │
│  +────────────────────────────                                    │
│  │ TECH STACK MATCH        +25     (language/framework)        │
│  +────────────────────────────                                    │
│  │ PHASE MATCH            +30     (required by phase)          │
│  +────────────────────────────                                    │
│  │ SCALE MATCH            +15     (project size)               │
│  +────────────────────────────                                    │
│  │ USER PREFERENCE        +15     (usage history)             │
│  +────────────────────────────                                    │
│  │ PATTERN MATCH         +20     (DDD, microservices)         │
│  +────────────────────────────                                    │
│                                                                  │
│  ───────────────────────────────────                            │
│  AUTO-INVOKE THRESHOLD: 40                                     │
│  RECOMMEND THRESHOLD: 25-40                                    │
│  SKIP THRESHOLD: <25                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💾 STATE PERSISTENCE

Project state is saved to `~/.claude/state/projects.json`:

```json
{
  "path": "/project/path",
  "projectName": "my-app",
  "lastAnalyzed": "2024-01-15T10:30:00Z",
  "currentPhase": 3,
  "activeSkills": ["/security", "/database"],
  "invokedSkills": ["/git", "/docker", "/ci-cd"],
  "preferences": [
    { "skill": "security", "useCount": 15, "preferred": true },
    { "skill": "database", "useCount": 12, "preferred": true }
  ],
  "history": [
    { "date": "...", "action": "...", "result": "success" }
  ]
}
```

---

## 🎨 EXAMPLE INTERACTIONS

### Example 1: Intent = CREATE
```
User: "I need to create a REST API with PostgreSQL authentication"

System:
  Intent: CREATE
  Keywords: api, rest, postgresql, auth
  Score: /security (85) > /database (70) > /api-design (65)
  
  Auto-invoke:
    ✅ /security (HIGH)
    ✅ /database (HIGH)
    ✅ /api-design (MEDIUM)
```

### Example 2: Intent = DEBUG
```
User: "My API is returning 500 errors and I can't figure out why"

System:
  Intent: DEBUG
  Keywords: api, error, 500
  
  Score: /diagnosing-bugs (90) > /logging (50) > /reliability (40)
  
  Auto-invoke:
    ✅ /diagnosing-bugs (HIGH - 50% boost for DEBUG intent)
    ✅ /logging (CORE)
```

### Example 3: Project Pattern = DDD
```
System detects: DDD project structure
  /domain-modeling (pattern boost +20)
  /architecture-patterns (pattern boost +20)
```

---

## 🔧 CONFIGURATION

### Custom Skill Priorities
Edit `~/.claude/state/skills.json`:

```json
{
  "skillPriorities": {
    "security": "always",
    "docker": "auto",
    "testing": "recommend"
  },
  "thresholds": {
    "autoInvoke": 40,
    "recommend": 25
  }
}
```

### Ignore Skills
Add to `.claudeignore`:
```
/skip:ml-engineering
/skip:mobile
```

---

## 📁 RELATED FILES

| File | Purpose |
|------|---------|
| `detector.ts` | Intent detection, keyword analysis, tech stack detection |
| `selector.ts` | Skill scoring, dependency resolution, recommendation engine |
| `workflows.md` | Workflow templates for common project types |

---

## 🚀 USAGE TIPS

### 1. Be Specific
```
❌ "fix bug"
✅ "debug 500 error in user authentication endpoint"
```

### 2. Mention Tech Stack
```
❌ "add auth"
✅ "add JWT authentication to Fastify API with PostgreSQL"
```

### 3. Specify Intent
```
❌ "improve"
✅ "optimize slow database queries for better performance"
```

---

## ✨ SMART TERMINAL INTERFACE

Auto-router features a **Smart Terminal UI** with rich colors, progress bars, and interactive selection.

### Commands
```bash
/auto-router --smart      # Show Smart Dashboard (Claude Code)
/auto-router --status     # Show project status
```

### Smart Dashboard Preview
```
╔══════════════════════════════════════════════════════════════════════════╗
║  🚀 AUTO-ROUTER v6.0 ✨ SMART PROJECT INTELLIGENCE              ║
╠══════════════════════════════════════════════════════════════════════════╣
║  📁 my-api  │  🎯 Phase 2  │  📊 MVP                            ║
║  Tech: Fastify + PostgreSQL + Redis                               ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Intent: CREATE  │  Confidence: 🏆 HIGH                           ║
╠══════════════════════════════════════════════════════════════════════════╣
║  ✅ KEYWORD-MATCHED (Auto-invoked)                               ║
║  ✅ /security        ████████████████████░░░░  85%  HIGH          ║
║  ✅ /identity        ██████████████░░░░░░░░░  60%  HIGH          ║
║  ⭐ RECOMMENDED                                                  ║
║  [ ] /api-design      ██████████░░░░░░░░░░░░  45%  MED          ║
║  [ ] /database        ████████░░░░░░░░░░░░░░░  40%  MED          ║
╠══════════════════════════════════════════════════════════════════════════╣
║  [1-5] Select  │  [Enter] Continue  │  [Q] Quit                   ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Smart Actions Menu
```
╔══════════════════════════════════════════╗
║  🧠 SMART ACTIONS                       ║
╠══════════════════════════════════════════╣
║  [1] 🚀 New Project   - Start new    ║
║  [2] 📊 Analyze      - Scan project  ║
║  [3] ✨ Workflow     - Templates     ║
║  [4] ⚙️ Settings   - Configure     ║
╚══════════════════════════════════════════╝
```

### Related Files
| File | Purpose |
|------|---------|
| `smart-ui.ts` | Rich terminal UI components |

---

*Version: 6.0.0 | Author: TheVoidSyntax*
*Features: Intent Detection | Confidence Scoring | Learning System | Pattern Recognition | Smart Terminal UI*
