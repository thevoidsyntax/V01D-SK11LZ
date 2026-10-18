---
name: autor
version: "2.5.0"
description: "Intelligent project analysis with Smart Flow, Personas, HYBRID Token Distribution, Audit Recommendation, and Memory Continuity for Claude Code"
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
      auto_invoke: /autor, /git, /config, /security, /testing, /error-debugger, /observability, /doc-generator, /mem-search, /anti-slop, /chisle, /caveman, /codebase-design, /ponytail
      reason: "Primary entry - invoke autor with all 13 core skills for project intelligence"
capabilities: [implementation, analysis]
source:
  origin: infrastructure
author: thevoidsyntax
---

# 🚀 AUTOR v2.5 - PROJECT INTELLIGENCE

**Smart Project Flow with Personas, Audit Recommendation & Token Efficiency**

---

## ⚠️ CRITICAL: LOAD CORE SKILLS FIRST

**BEFORE ANYTHING ELSE**, you MUST invoke these skills using the Skill tool:

### Step 1: Invoke All Core Skills

Use the Skill tool to invoke each of these skills IN ORDER:

```
Skill(tool call with skill: "git")
Skill(tool call with skill: "config")
Skill(tool call with skill: "security")
Skill(tool call with skill: "testing")
Skill(tool call with skill: "error-debugger")
Skill(tool call with skill: "observability")
Skill(tool call with skill: "doc-generator")
Skill(tool call with skill: "mem-search")
Skill(tool call with skill: "anti-slop")
Skill(tool call with skill: "chisle")
Skill(tool call with skill: "caveman")
Skill(tool call with skill: "codebase-design")
```

### Step 2: Confirm Skills Loaded

After invoking, show a confirmation message listing all loaded skills:

```
✅ CORE SKILLS LOADED:
✅ /git      → Version control
✅ /config   → Environment management
✅ /security → Security best practices
✅ /testing  → Testing strategy
✅ /error-debugger → Debug patterns
✅ /observability → Monitoring
✅ /doc-generator → Documentation
✅ /mem-search → Memory continuity
✅ /anti-slop → Token efficiency
✅ /chisle → Context pruning
✅ /caveman → Terse output
✅ /codebase-design → Architecture
```

### Step 3: Then Proceed with Project Analysis

Only after all skills are loaded, proceed with:
1. Analyze project structure
2. Check memory for context
3. Provide recommendations
4. Suggest personas if needed

---

## What's New in v2.5

### Audit Recommendation (NEW)
```
Contextual audit recommendations based on project state:
├─ /audit when: new project, before deploy, after refactor
├─ /audit when: adding auth/payment features
└─ Don't audit when: healthy, recently audited, small fixes
```

### Token Efficiency (Enhanced)
```
3 Efficiency Skills auto-loaded with /autor:
├─ /anti-slop  → Remove verbose AI patterns
├─ /chisle     → Prune irrelevant context
└─ /caveman    → Aggressive compression
```

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
When you invoke `/autor`, the following 13 core skills are automatically loaded:

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
   │    → Show analysis + actionable next    │
   │                                         │
   │  If HAS ISSUES:                         │
   │    → Recommend TOP priority fix only    │
   │    → Suggest persona who can help       │
   └─────────────────────────────────────────┘
  ↓
4. Post-Analysis Output:
   ├─ RECOMMENDED ACTIONS (based on gaps)
   └─ PERSONA AVAILABILITY (ready to help)
  ↓
5. User decides what to tackle
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

## Post-Analysis Output

After analysis completes, ALWAYS provide actionable next steps:

### Recommended Actions (Based on Gaps)

```
📋 RECOMMENDED ACTIONS:

1. IMMEDIATE (Priority Fix):
   └─ [Specific actionable task]
     → Run: [command or action]

2. THIS SESSION (Quick Win):
   └─ [Optional improvement]
     → Run: [command or action]

3. OPTIMIZE (Long-term):
   └─ [Future enhancement]
     → Run: [command or action]

4. OPTIONAL (If Needed):
   └─ [Nice-to-have]
     → Run: [command or action]
```

### Persona Availability (Always Available)

```
🎯 READY TO HELP:

Project is healthy - no urgent fixes needed.
Available personas for your next task:

  /satria   → Planning, BRD, PRD, FSD
  /athena   → Architecture, code, API design
  /dina     → Testing, security, QA
  /frans    → DevOps, deployment, CI/CD

Or describe what you want to work on.
```

### Audit Recommendation (Contextual)

After analysis, evaluate if audit is needed based on project context:

```
┌─────────────────────────────────────────────────────────────────┐
│  AUDIT RECOMMENDATION CHECK                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ASK YOURSELF:                                                 │
│                                                                  │
│  Q1: Is this a NEW project/feature?                            │
│      └─ YES → /audit recommended                               │
│      └─ NO  → Continue                                         │
│                                                                  │
│  Q2: Am I about to DEPLOY to production?                       │
│      └─ YES → /audit recommended                               │
│      └─ NO  → Continue                                         │
│                                                                  │
│  Q3: Did I REFACTOR >20 files recently?                        │
│      └─ YES → /audit recommended                               │
│      └─ NO  → Continue                                         │
│                                                                  │
│  Q4: Am I adding AUTH/PAYMENT/USER DATA?                     │
│      └─ YES → /audit STRONGLY recommended                     │
│      └─ NO  → Continue                                         │
│                                                                  │
│  Q5: Does my codebase feel "smelly"?                          │
│      └─ YES → /audit recommended                               │
│      └─ NO  → Don't audit (save tokens)                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### When to Recommend Audit

```
┌─────────────────────────────────────────────────────────────────┐
│  RECOMMEND /audit WHEN:                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔴 STRONGLY RECOMMEND:                                       │
│  ├─ Adding authentication/authorization                        │
│  ├─ Adding payment/billing features                            │
│  ├─ Handling user PII/sensitive data                          │
│  └─ Before first production deploy                             │
│                                                                  │
│  🟠 RECOMMEND:                                                │
│  ├─ New project/feature (before getting too deep)             │
│  ├─ After major refactoring (>20 files changed)              │
│  ├─ Codebase feels "smelly" (gut feeling)                   │
│  └─ Starting to work with unfamiliar codebase                  │
│                                                                  │
│  🟢 DON'T RECOMMEND:                                          │
│  ├─ Project is healthy and recently audited                    │
│  ├─ Only doing small fixes (typos, minor changes)            │
│  └─ Project hasn't changed since last audit                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Audit Command Reference

```
┌─────────────────────────────────────────────────────────────────┐
│  AUDIT COMMANDS                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /audit                → Full scan (~300K tokens)               │
│  /audit [module]      → Module scan (~150K tokens)           │
│                                                                  │
│  EFFICIENCY TIPS:                                              │
│  • Solo dev: /audit 2-4x/month (on-demand)                  │
│  • Small team: /audit-ci + /audit weekly                    │
│  • Add module scope: /audit src/auth/                        │
│                                                                  │
│  TOKEN BUDGET:                                                 │
│  • Full scan: ~300K tokens                                    │
│  • Module scan: ~150K tokens                                   │
│  • Monthly (solo): ~600K-1.2M tokens                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Example Output Format

```
┌─────────────────────────────────────────────────────────────┐
│  PROJECT STATE: HEALTHY                                   │
├─────────────────────────────────────────────────────────────┤
│  ✅ Core functionality: Working                            │
│  ✅ CI/CD: Configured                                     │
│  ✅ Documentation: Complete                               │
└─────────────────────────────────────────────────────────────┘

📋 RECOMMENDED ACTIONS:

1. IMMEDIATE:
   └─ Commit recent changes
     → git add . && git commit -m "fix: ..."

2. THIS SESSION:
   └─ Improve test coverage (currently 60%)
     → /dina for testing guidance

🎯 READY TO HELP:

  /satria   → Planning & documentation
  /athena   → Architecture & code
  /dina     → Testing & security
  /frans    → DevOps & deployment
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
  → Loads 13 core skills = 1x token

Step 2: /athena
  → Inherits 13 core skills = 0 additional token
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

### v2.4.0 (Post-Analysis Output)
- ✅ Added actionable next steps after analysis
- ✅ Added "Recommended Actions" section with priority levels
- ✅ Added "Ready to Help" persona availability
- ✅ Project healthy now shows actionable suggestions

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
