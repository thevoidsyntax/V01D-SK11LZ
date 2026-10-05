---
name: auto-router
version: 5.2.0
description: "Supercharged intelligent project analyzer and skill router with auto-detection, dynamic skills discovery, skip-implemented, dependency resolution, phase awareness, and implementation automation"
priority: critical
phase: any
auto_invoke: true
core: true
---

# 🚀 AUTO-ROUTER v5.2

**Single entry point for all project operations.**

Intelligent project analyzer that:
1. **Detects** project state (new/partial/existing)
2. **Discovers** skills dynamically from ~/.claude/skills/
3. **Analyzes** existing projects for tech stack and gaps
4. **Routes** to appropriate skills automatically
5. **Filters** already-implemented features
6. **Improves** project quality with recommendations

---

## 🎯 USAGE

```
/auto-router                           # Auto-detect and route
/auto-router --new                     # Force new project mode
/auto-router --analyze                 # Analyze existing project
/auto-router --phase [N]              # Continue from Phase N
/auto-router --skills=skill1,skill2   # Select specific skills
/auto-router --quick                   # Quick scan mode
/auto-router --deep                   # Deep analysis mode
/auto-router --workflow=TEMPLATE       # Use workflow template
```

---

## 🔄 DETECTION FLOW

```
/auto-router invoked
        │
        ▼
┌───────────────────────┐
│   DETECT PROJECT      │
│   STATE               │
└───────────┬───────────┘
            │
    ┌───────┼───────┬────────────┐
    ▼       ▼       ▼            ▼
 [EMPTY] [PARTIAL] [EXISTING] [COMMAND]
    │       │          │           │
    ▼       ▼          ▼           ▼
 project-  OFFER    FULL      DIRECT
   init   OPTIONS   ANALYSIS   ROUTE
```

### State: EMPTY (No project)
- No `package.json`, `.git`, `requirements.txt`, etc.
- **Action:** Auto-invoke project-init workflow

### State: PARTIAL (Incomplete)
- Has `.git` but no package files, OR
- Has files but missing critical components
- **Action:** Offer initialization or completion options

### State: EXISTING (Active project)
- Has complete project structure with commits
- **Action:** Full analysis + skill recommendations

---

## 📊 TECH STACK DETECTION

### Detection Priority

| Priority | Files | What it Detects |
|----------|-------|-----------------|
| 1 | `.git/` | Existing project |
| 1 | `package.json`, `go.mod`, `Cargo.toml` | Language |
| 2 | `CLAUDE.md` | Phase awareness |
| 3 | `docker-compose.yml`, `Dockerfile` | DevOps |
| 4 | `knexfile.ts`, `prisma/schema.prisma` | Database |

### Tech → Skills Mapping

| Tech Stack | Recommended Skills |
|------------|-------------------|
| **Node.js + Express/Fastify** | fullstack-guardian, api-designer, security-reviewer |
| **Node.js + NestJS** | fullstack-guardian, api-designer, architecture-designer |
| **Next.js / React** | react-expert, fullstack-guardian, api-designer |
| **Python + FastAPI/Django** | api-designer, security-reviewer, test-master |
| **PostgreSQL** | database, data-engineering skills |
| **Redis** | scalability, caching skills |
| **Docker/K8s** | devops-engineer, monitoring-expert |
| **TypeScript** | typescript-pro (if not using) |

---

## 🎯 SKILL SELECTION

### Scoring Algorithm

Each skill gets a relevance score based on:

```
Total Score = 
  + CORE (always +10)
  + TECH_MATCH (+25 per match)
  + PHASE_MATCH (+30 if required by phase)
  + SCALE_MATCH (+15)
  + DEPENDENCY_RESOLVED (+5 per resolved dep)
```

### Skill Categories

**CORE (Always Invoked):**
- git, docker, ci-cd, code-quality, deployment, logging, config

**CONTEXT (Auto-invoked based on detection):**
- api-designer, security-reviewer, database, frontend, observability

**OPTIONAL (User-selected):**
- microservices-architect, cloud-architect, ml-engineering, etc.

---

## 🔍 PHASE-AWARE SELECTION

### Phase → Skills Mapping

| Phase | Primary Skills | Secondary Skills |
|-------|---------------|------------------|
| **Foundation** | fullstack-guardian | api-designer, typescript-pro |
| **Core Features** | fullstack-guardian | api-designer, test-master |
| **Feature Dev** | fullstack-guardian | code-reviewer, debugging-wizard |
| **Polish** | code-reviewer | test-master, security-reviewer |
| **Infrastructure** | devops-engineer | monitoring-expert, architecture-designer |
| **Launch** | security-reviewer | monitoring-expert |

### Reading Phase from CLAUDE.md

The auto-router parses CLAUDE.md for phase info:

```
Phase 4: Reporting, Dashboard [IN PROGRESS]
```

Detects: `Phase 4`, status `in-progress`, suggests Phase 4 skills.

---

## 🔄 DYNAMIC SKILL DISCOVERY

### Scan Global Skills Directory

```
~/.claude/skills/
├── git/
├── docker/
├── ci-cd/
├── code-quality/
├── deployment/
├── logging/
├── config/
├── api-design/
├── security/
├── database/
├── frontend/
├── performance/
├── scalability/
├── observability/
├── caveman/              ← Token optimization
├── chisle/               ← Token optimization
├── anti-slop/            ← Token optimization
├── ui-ux-pro-max/        ← UI/UX premium
├── ui-skills/            ← UI/UX basic
├── skillspector/         ← Quality scoring
├── reticle/              ← Vision tracking
├── ... (all skills)
```

### Discovery Algorithm

```
1. Scan ~/.claude/skills/ directory
2. For each skill folder:
   - Read SKILL.md metadata
   - Extract: name, priority, phase, dependencies, tech_stack
3. Score each skill:
   - Matches project tech stack? +25
   - Matches current phase? +30
   - Dependencies resolved? +10
   - Not already implemented? +5
4. Sort by score descending
5. Present top skills for invocation
```

### Skill Metadata Schema

Each skill should have this header:

```markdown
---
name: skill-name
version: 1.0.0
priority: critical|high|medium|low
phase: phase-1|phase-2|...|any
dependencies:
  - other-skill
tech_stack:
  - nodejs
  - postgresql
---
```

---

## ✅ SKIP ALREADY IMPLEMENTED

### File System Checks

Before invoking a skill, auto-router checks:

| File/Pattern | Skip Skill | Reason |
|-------------|-----------|---------|
| `Dockerfile` | /docker | Docker configured |
| `docker-compose.yml` | /docker | Docker Compose exists |
| `.git/` | /git | Git initialized |
| `src/infrastructure/database/` | /database | DB layer exists |
| `src/domain/entities/` | /domain-modeling | Domain exists |
| `src/api/routes/` | /api-design | Routes exist |
| `tests/` | /testing | Tests exist |
| `.github/workflows/` | /ci-cd | CI/CD configured |
| `.env.example` | /config | Config template exists |

### Skip Logic

```
IF file exists AND skill matches:
  → Show "⚠️ Skipped: /skill (already implemented)"
  → Do NOT invoke
ELSE:
  → Invoke skill
  → Show "✅ Invoked: /skill"
```

### Example Output

```
┌─────────────────────────────────────────────────────────┐
│  ✅ ALREADY IMPLEMENTED (Skipped)                      │
│                                                         │
│  ⚠️ /docker - Dockerfile exists                       │
│  ⚠️ /git - Git initialized                          │
│  ⚠️ /database - Repository pattern exists            │
│  ⚠️ /security - JWT auth implemented                 │
│  ⚠️ /logging - Pino configured                       │
│                                                         │
│  ✅ INVOKED (New needs)                               │
│                                                         │
│  ✅ /api-design - Hardware endpoints needed            │
│  ✅ /performance - Optimization before launch          │
│  ✅ /observability - Hardware monitoring              │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ DEPENDENCY RESOLUTION

### Skill Dependency Graph

```
/config
  └── /git
        └── /docker
              └── /ci-cd
                    └── /deployment

/database
  ├── /security
  └── /api-design
        └── /graphql, /messaging

/frontend
  └── /performance
        └── /observability
```

### Resolution Order

```
1. Build dependency graph
2. Topological sort (Kahn's algorithm)
3. Handle circular dependencies (warn and skip)
4. Invoke in dependency order
```

---

## 🚀 POWER FEATURES

### 1. Workflow Templates

```
/auto-router --workflow=rest-api
/auto-router --workflow=fullstack-web
/auto-router --workflow=microservices
/auto-router --workflow=cli-tool
```

Available templates (see `workflows.md`):
- `rest-api` - Fastify/Express + PostgreSQL
- `fullstack-web` - Next.js + Fastify
- `microservices` - Distributed system
- `cli-tool` - Command-line utility
- `library` - NPM/PyPI library

### 2. Enhanced Options

| Option | Description |
|--------|-------------|
| `--quick` | Fast scan, minimal output |
| `--deep` | Full analysis with progress |
| `--auto-fix` | Apply suggested fixes |
| `--save` | Save config for project |
| `--load` | Load saved config |

### 3. Auto-Fix Integration

```
/auto-router --auto-fix
```

Automatically:
- Runs npm audit / security scans
- Fixes vulnerabilities (with consent)
- Applies code quality improvements

---

## 📋 ANALYSIS OUTPUT

### Report Format

```markdown
# 📊 Project Analysis Report

## Project State: EXISTING

## Tech Stack
| Category | Technology | Confidence |
|----------|------------|------------|
| Backend | Fastify | 95% |
| Database | PostgreSQL | 90% |
| Cache | Redis | 80% |

## Architecture: DDD-Lite
Directories: src/domain/, src/application/, src/infrastructure/

## Scale: MEDIUM
- Dependencies: ~45
- Estimated LOC: 15K-30K

## Recommended Skills
✅ fullstack-guardian (primary)
✅ api-designer (API detected)
✅ security-reviewer (auth detected)
✅ test-master (testing stack detected)

## Suggestions
⚠️ Add monitoring (no observability stack detected)
⚠️ Add rate limiting
⚠️ Add health endpoints
```

---

## 📁 RELATED FILES

| File | Purpose |
|------|---------|
| `detector.ts` | Project state & tech stack detection |
| `selector.ts` | Dynamic skill selection algorithm |
| `registry.md` | Complete skill metadata |
| `workflows.md` | Workflow templates |
| `TEST_GUIDE.md` | Test scenarios |
| `ARCHITECTURE.md` | Full architecture docs |

---

## 🔗 QUICK ACTIONS

### Start New Project
```
/auto-router --new
```

### Analyze Current Project
```
/auto-router --analyze
```

### Continue Phase Work
```
/auto-router --phase 5
```

### Quick Skill Activation
```
/auto-router --skills=fullstack-guardian,security-reviewer
```

### Run Full Workflow
```
/auto-router --workflow=fullstack-web
```

---

## 💡 IMPROVEMENTS ADDED

Based on best practices, auto-router now suggests:

1. **Observability** - Health endpoints, metrics, tracing
2. **Security** - Rate limiting, input validation, headers
3. **Performance** - Connection pooling, caching, compression
4. **Developer Experience** - Pre-commit hooks, error handling
5. **Resilience** - Retry policies, circuit breakers
6. **Testing** - Coverage targets, contract testing

---

*Version: 5.2.0 | Auto-invoke: enabled | Core skill: true*
*Features: Dynamic Discovery | Skip Implemented | Dependency Resolution*

---

## 🚀 SUPERCHARGED FEATURES (v5.2)

### What's New (v5.2)

| Feature | Description |
|---------|-------------|
| **Dynamic Discovery** | Scan ~/.claude/skills/ for all available skills |
| **Skip Implemented** | Auto-detect and skip already implemented features |
| **Dependency Resolution** | Invoke skills in correct dependency order |
| **Token Optimization** | Auto-suggest caveman/chisle for large projects |
| **UI/UX Premium** | Auto-suggest ui-ux-pro-max for frontend work |

### Quick Start

```bash
/auto-router                        # Auto-detect and route
/auto-router --new                # New project
/auto-router --analyze            # Analyze existing
/auto-router --implement           # Auto-implement suggestions
/auto-router --quick-wins         # Apply easy fixes
/auto-router --workflow=NAME      # Run workflow
/auto-router --phase [N]          # Continue phase
```

### Dynamic Skill Discovery Flow

```
┌─────────────────────────────────────────────────────────────┐
│  DYNAMIC SKILL DISCOVERY                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. SCAN ~/.claude/skills/                              │
│     └─ List all skill folders                           │
│                                                             │
│  2. READ METADATA                                        │
│     └─ Parse SKILL.md headers                          │
│                                                             │
│  3. MATCH TO PROJECT                                     │
│     ├─ Tech stack match? +25                           │
│     ├─ Phase match? +30                                 │
│     ├─ Dependencies met? +10                            │
│     └─ Not implemented? +5                              │
│                                                             │
│  4. SORT & PRESENT                                       │
│     └─ Top skills for invocation                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Skip Implemented Flow

```
┌─────────────────────────────────────────────────────────────┐
│  SKIP ALREADY IMPLEMENTED                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Check files exist:                                       │
│  ├─ Dockerfile → Skip /docker                           │
│  ├─ .git → Skip /git                                     │
│  ├─ src/infrastructure/database/ → Skip /database      │
│  └─ ...                                                  │
│                                                             │
│  Result:                                                  │
│  ├─ Skipped: 5 skills (already done)                   │
│  └─ Invoked: 3 skills (new needs)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Power Features

```
┌─────────────────────────────────────────────────────────────┐
│  ⚡ POWER FEATURES                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Auto-Fix Mode                                          │
│     → /auto-route --fix                                   │
│     → Audit + Security + Tests + Auto-fix                  │
│                                                             │
│  2. Quick Wins                                             │
│     → /auto-route --quick-wins                            │
│     → High impact, low effort (5-30 min each)             │
│                                                             │
│  3. Smart Implementation                                   │
│     → /auto-route --implement --id=REC-001                │
│     → Backup → Implement → Test → Commit                   │
│     → One-click rollback if needed                         │
│                                                             │
│  4. Workflow Templates                                     │
│     → /auto-route --workflow=full-audit                   │
│     → /auto-route --workflow=security-review              │
│     → Custom workflow support                              │
│                                                             │
│  5. Dependency Visualization                               │
│     → /auto-route --visualize                             │
│     → See skill relationships                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
