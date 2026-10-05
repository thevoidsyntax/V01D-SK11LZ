# MODULAR SKILLS MANIFEST
# Master Rules v8.7 - Complete Modular System

## 📌 SINGLE SOURCE OF TRUTH
- **Master File:** `C:\Users\CareTechnologies\.claude\master-rules.md`
- **Auto-loaded:** `C:\Users\CareTechnologies\.claude\CLAUDE.md` (30 core rules)

---

## 🎯 HOW TO USE MODULAR SKILLS

### Unified Entry Point
```
/auto-route            → Unified project router (v5.0)
                         • Auto-detect new vs existing project
                         • Interactive Q&A for new projects
                         • Deep tech stack detection for existing
                         • Phase-aware skill selection
                         • Health checks & auto-fix
                         • Project tracking & recommendations
```

### Routing Engine
```
/auto-router           → Intelligent skill router (v5.0)
                         • Single unified command for all projects
                         • Smart detection (new vs existing)
                         • Dynamic skill discovery from ~/.claude/skills/
                         • Scoring algorithm for skill relevance
                         • Tier-based selection (core/context/optional/skipped)
                         • Dependency resolution (topological sort)
                         • Phase-aware recommendations
                         • Project tracking & recommendations
                         • Verbose mode with skip reasons
```

### Legacy Entry Points (Still Supported)
```
/project-init           → Setup project baru (interactive Q&A) [deprecated]
/analyze-project       → Analyze existing project [deprecated]
```

### Core Code Quality
```
/audit                → Deep full codebase audit (2-pass, no threshold, auto-fix)
/code-review          → Diff-based PR/branch review
```

### Browser Automation Skills
```
/dev-browser          → Fast browser automation (JS/Bun + Puppeteer, ~13ms)
/browser-use          → AI agent browser automation (Python + Playwright)
/slopbuster           → Anti-AI text humanizer (152 patterns)
```

### GitHub Workflow Skills
```
/new-issue            → Create complete GitHub issue
/validate-issue       → Fact-check issue against code
/work-on-issue        → Implement issue + open PR
/fix-pr-review        → Fix PR review comments
/create-release       → Bump version + publish release
/sync-docs            → Sync docs to recent commits
/commit               → Guided conventional commit
```

---

## 📋 COMPLETE SKILLS INDEX (64 Modules)

### 🔴 HIGH PRIORITY - AI Process Skills
| Skill | Description | Source |
|-------|-------------|--------|
| `/tdd` | Test-driven development (merged principles + examples) | Matt Pocock |
| `/code-review` | Two-axis review: Standards + Spec | Matt Pocock |
| `/audit` | Deep full codebase audit (2-pass, auto-fix) | Core |
| `/domain-modeling` | Build/sharpen domain model, CONTEXT.md | Matt Pocock |
| `/diagnosing-bugs` | Systematic 6-phase debugging loop | Matt Pocock |
| `/wayfinder` | Plan large work as decision tickets | Matt Pocock |
| `/grilling` | Relentless interview for design validation | Matt Pocock |

### 🟠 Browser Automation
| Skill | Description | Source |
|-------|-------------|--------|
| `/dev-browser` | Fast (~13ms), JS-native, persistent tabs | SawyerHood |
| `/browser-use` | AI agent browser automation, cloud support | browser-use |

### 🟡 GitHub Workflow
| Skill | Description | Source |
|-------|-------------|--------|
| `/new-issue` | Create complete GitHub issue with scoring | rk-skills |
| `/validate-issue` | Fact-check issue against code | rk-skills |
| `/work-on-issue` | Implement + PR (isolated worktree) | rk-skills |
| `/fix-pr-review` | Fix review comments, request re-review | rk-skills |
| `/pr-review` | Review format reference | rk-skills |
| `/create-release` | Bump version + publish release | rk-skills |
| `/sync-docs` | Sync CLAUDE.md/AGENTS.md/SKILL.md | rk-skills |
| `/commit` | Guided conventional commit | rk-skills |

### 🟢 AI Collaboration Skills
| Skill | Description | Source |
|-------|-------------|--------|
| `/handoff` | Compact conversation for another agent | Matt Pocock |
| `/writing-for-agents` | Writing skills/docs for AI agents | Matt Pocock |
| `/research` | Background agent for primary sources | Matt Pocock |
| `/implement` | Build from spec using TDD + code-review | Matt Pocock |
| `/codebase-design` | Deep module vocabulary | Matt Pocock |

### 🟣 Anti-AI Writing
| Skill | Description | Source |
|-------|-------------|--------|
| `/slopbuster` | Strip AI patterns, restore human voice (152 patterns) | gabelul |

### 🚀 UNIFIED PROJECT ROUTER
| Skill | Description | Use Case |
|-------|-------------|----------|
| `/auto-route` | Intelligent project router (v5.0) | All projects |
| `/auto-router` | Skill selection engine (v2.0) | Internal routing |
| `/project-init` | Interactive project setup | New projects |
| `/analyze-project` | Comprehensive project analysis | Existing projects |

### 🔴 HIGH PRIORITY (Production-Critical)
| Skill | Description | Rules |
|-------|-------------|-------|
| `/security` | Authentication, Authorization, Secrets, Encryption | 12 rules |
| `/identity` | OAuth2, OIDC, SAML, MFA, Session Management | 12 rules |
| `/data-engineering` | CDC, ETL, Data Quality, Warehouse | 12 rules |
| `/reliability` | SLO/SLA, Incident Response, DR | 12 rules |
| `/deployment` | IaC, Blue-Green, Canary, Zero-downtime | 12 rules |
| `/git` | Version control, branching, rebasing, submodules | Comprehensive |
| `/docker` | Multi-stage builds, security, compose | Comprehensive |
| `/ci-cd` | GitHub Actions, GitLab CI, pipelines | Comprehensive |

### 🟡 MEDIUM PRIORITY (Common Use Cases)
| Skill | Description | Rules |
|-------|-------------|-------|
| `/messaging` | DLQ, Saga, Outbox, Anti-Corruption | 12 rules |
| `/scalability` | Auto-scaling, Read Replica, CDN | 12 rules |
| `/api-design` | Pagination, gRPC, API Gateway | 12 rules |
| `/frontend` | State Management, Error Boundaries | 12 rules |
| `/ml-engineering` | ML Lifecycle, Drift, LLM Patterns | 12 rules |
| `/mobile` | Offline-first, Biometric, Push | 12 rules |
| `/kubernetes` | HPA, Security, Helm, Service Mesh | 12 rules |
| `/networking` | DNS, TLS, Load Balancer, WAF | 12 rules |
| `/database` | SQL optimization, migrations, indexing | Comprehensive |
| `/logging` | Structured logging, log management | Comprehensive |
| `/config` | Environment variables, secrets, feature flags | Comprehensive |
| `/api-client` | HTTP client, retry, circuit breaker | Comprehensive |

### 🟢 LOW PRIORITY (Specialized)
| Skill | Description | Rules |
|-------|-------------|-------|
| `/search` | Elasticsearch, Full-Text, Indexing | 12 rules |
| `/storage` | Object Storage, CDN, Tiering | 12 rules |
| `/performance` | Profiling, Benchmarking, Budget | 12 rules |
| `/testing` | Mutation, Property-Based, Visual | 12 rules |
| `/compliance` | GDPR, SOC2, Audit Trail | 12 rules |
| `/finops` | Cost Visibility, Tagging | 12 rules |
| `/documentation` | README, RFC, Onboarding | 12 rules |
| `/team-processes` | Code Ownership, Architecture Review | 12 rules |
| `/iot-edge` | OTA, Edge Deployment | 12 rules |
| `/gaming` | Game Server, Lag Compensation | 12 rules |
| `/terraform` | Infrastructure as Code, modules, state | Comprehensive |
| `/ansible` | Configuration management, playbooks, roles | Comprehensive |
| `/message-queue` | Kafka, RabbitMQ, SQS, patterns | Comprehensive |
| `/graphql` | Schema design, DataLoader, subscriptions | Comprehensive |

### 🔵 ARCHITECTURE & PATTERNS
| Skill | Description | Rules |
|-------|-------------|-------|
| `/architecture-patterns` | Hexagonal, Micro-frontend, Modular Monolith | 12 rules |
| `/design-patterns` | Observer, Repository, Unit of Work | 12 rules |
| `/integration-patterns` | ETL/ELT, API Composition | 12 rules |

### 🟤 NEW: Imported from Jeffallan/claude-skills
| Skill | Description | Dependencies |
|-------|-------------|--------------|
| `/devops-engineer` | CI/CD, IaC, Docker, Kubernetes | cloud-architect, monitoring-expert |
| `/cloud-architect` | AWS/GCP/Azure architecture, disaster recovery | devops-engineer, security |
| `/fullstack-guardian` | Full-stack with security focus | secure-code-guardian, test-master |
| `/feature-forge` | EARS requirements, acceptance criteria | fullstack-guardian, testing |
| `/typescript-pro` | Advanced types, branded types, discriminated unions | fullstack-guardian, api-design |

### 🟣 PLATFORM & DevEx
| Skill | Description | Rules |
|-------|-------------|-------|
| `/platform-engineering` | Golden Paths, Self-Service | 12 rules |
| `/developer-experience` | IDP, CLI Patterns, SDK Design | 12 rules |

### 🟠 SRE & EMERGING TECH
| Skill | Description | Rules |
|-------|-------------|-------|
| `/sre-operations` | DORA Metrics, Error Budget, Alert Fatigue | 12 rules |
| `/serverless` | Lambda, Cloud Functions, Edge Computing | 12 rules |

---

## 📊 STATISTICS

| Category | Count |
|----------|-------|
| Core Rules (CLAUDE.md) | 30 |
| **AI Process Skills** | **7** |
| **Browser Automation** | **2** |
| **GitHub Workflow** | **8** |
| **AI Collaboration** | **5** |
| **Anti-AI Writing** | **1** |
| **Unified Project Router** | **2** (auto-route, auto-router) |
| Legacy Project Setup Skills | 2 |
| **NEW: DevOps (git, docker, ci-cd)** | **3** |
| **NEW: Infra Tools (terraform, ansible)** | **2** |
| **NEW: Data (database, logging, config, api-client)** | **4** |
| **NEW: Specialized (message-queue, graphql)** | **2** |
| **NEW: Jeffallan Skills (devops, cloud, fullstack, feature, typescript)** | **5** |
| HIGH Priority Skills | 9 (108 rules) |
| MEDIUM Priority Skills | 12 (144 rules) |
| LOW Priority Skills | 14 (168 rules) |
| Architecture & Patterns | 3 (36 rules) |
| Platform & DevEx | 2 (24 rules) |
| SRE & Emerging Tech | 2 (24 rules) |
| **TOTAL SKILLS** | **72** |
| **TOTAL RULES** | **~620** |

---

## 🔄 WHAT'S NEW IN v8.8

### NEW: Imported from Jeffallan/claude-skills (5 skills)
1. **`/devops-engineer`** - CI/CD, IaC, Docker, Kubernetes deployment
2. **`/cloud-architect`** - AWS/GCP/Azure architecture, disaster recovery
3. **`/fullstack-guardian`** - Full-stack with security focus, three-perspective design
4. **`/feature-forge`** - EARS requirements, acceptance criteria
5. **`/typescript-pro`** - Advanced types, branded types, discriminated unions

### MERGED: Skills Updated from Imports
- **`/api-design`** - Added OpenAPI 3.1 templates, RFC 7807 examples
- **`/security`** - Added security-reviewer workflow, secure-code-guardian patterns
- **`/architecture-patterns`** - Added microservices patterns, ADR templates
- **`/testing`** - Added test-master workflow, Jest examples
- **`/code-quality`** - Added code-reviewer patterns, Fowler smells
- **`/diagnosing-bugs`** - Added debugging-wizard commands, bisect workflows
- **`/frontend`** - Added React 19 patterns, Server Components
- **`/observability`** - Added monitoring-expert tools, Pino, Prometheus

---

## 🔄 WHAT'S NEW IN v8.7

### NEW: Auto-Route v5.0 - Ultimate Project Intelligence
- **Unified entry point** - Auto-detects new vs existing, routes to appropriate workflow
- **Interactive Q&A** - Streamlined project setup with smart defaults
- **Health check mode** (`--health`) - Quick project status overview
- **Auto-fix mode** (`--fix`) - Audit, fix, and test workflow
- **Recommendations engine** - Smart improvement suggestions
- **Phase-aware navigation** - Seamless phase tracking and continuation
- **Project tracking** - State persistence across sessions

### NEW: Auto-Router v5.0 - Intelligent Skill Router
- **Single unified command** - /auto-route for all project types
- **Dynamic skill discovery** - Scans ~/.claude/skills/ at runtime
- **Phase-aware recommendations** - Reads CLAUDE.md for phase info
- **Skill relevance scoring** - Multi-factor scoring with explanations
- **Tier-based selection** - Core, Context, Optional, Skipped
- **Dependency resolution** - Topological sort with cycle detection
- **Verbose mode** - Shows skipped skills with reasons
- **JSON output** - Machine-readable output for automation
- **Project tracking** - State persistence with recommendations
- **Tier-based selection** - Core (always) / Context (auto) / Optional (score)
- **Dependency resolution** - Topological sort for invocation order
- **Phase-aware recommendations** - Skills appropriate for current phase

### Architecture Improvements
1. **Decision Tree** - Clear routing based on project state
2. **Health Checks** - Dependencies, security, TypeScript, tests, Docker, CI
3. **Recommendations** - Context-aware improvement suggestions
4. **Power Features** - Auto-fix, tracking, health checks

---

## 🔄 WHAT'S NEW IN v8.6

### NEW: Auto-Route v4.0 - Intelligent Project Router
- **Single entry point** replacing `/project-init` and `/analyze-project`
- **Smart detection** with tech stack, scale, and phase awareness
- **Dynamic skill discovery** scanning `~/.claude/skills/` at runtime
- **Scoring algorithm** for skill relevance based on multiple factors
- **Auto-fix integration** for security audits and test fixes
- **Project tracking** with state persistence
- **Dependency resolution** with topological sort

### Architecture Improvements
1. **Command Flow** - Auto-detects new vs existing, routes to appropriate workflow
2. **Phase Awareness** - Reads CLAUDE.md for phase info, suggests continuation
3. **Skill Selection** - 4-tier system (core → context → optional → skipped)
4. **Learning** - Tracks usage patterns for better recommendations

---

## 🔄 WHAT'S NEW IN v8.5

### FIXES: Audit Report Applied
- **`/audit`** - Deep full codebase audit skill added (enhanced with 7-phase parallel + adversarial verification)
- All 65 skills now have proper YAML frontmatter
- Fixed hardcoded secrets in `ansible/` and `config/` skills
- Replaced `console.log` with structured logging patterns
- Added Jinja2/Go template comments explaining syntax
- Renamed `skill.md` → `SKILL.md` for consistency
- Created missing `commit/SKILL.md`

---

## 🔄 WHAT'S NEW IN v8.4

### NEW: DevOps Essentials (3 skills)
1. **`/git`** - Comprehensive git operations, workflows, bisect
2. **`/docker`** - Multi-stage builds, security, compose
3. **`/ci-cd`** - GitHub Actions, GitLab CI, deployment patterns

### NEW: Infrastructure Tools (2 skills)
1. **`/terraform`** - Infrastructure as Code, modules, state management
2. **`/ansible`** - Configuration management, playbooks, roles

### NEW: Data & API (4 skills)
1. **`/database`** - SQL optimization, migrations, indexing strategies
2. **`/logging`** - Structured logging, correlation, sanitization
3. **`/config`** - Environment variables, secrets, feature flags
4. **`/api-client`** - HTTP client, retry, circuit breaker, rate limiting

### NEW: Specialized (2 skills)
1. **`/message-queue`** - Kafka, RabbitMQ, SQS, event patterns
2. **`/graphql`** - Schema design, DataLoader, subscriptions

---

## 🛠️ INSTALLED TOOLS

### npm Global Packages
```bash
npm install -g dev-browser
```

### Python Packages
```bash
pip install browser-use
```

---

## 📁 TEMPLATES AVAILABLE

| Template | Path | Use Case |
|---------|------|----------|
| REST API | `skills/project-init/templates/rest-api.md` | Node.js + TypeScript + PostgreSQL |
| Full-Stack Web | `skills/project-init/templates/fullstack-web.md` | Next.js + React + Prisma |
| ML Pipeline | `skills/project-init/templates/ml-pipeline.md` | Python + MLflow + Airflow |
| ERP | `skills/project-init/templates/erp.md` | NestJS + PostgreSQL + React |

---

**Version:** v8.8 | Last Updated: 2026-10-05
