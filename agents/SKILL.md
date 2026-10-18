---
name: agents
version: "2.3.0"
description: "Team of 4 named personas: Satria (PM), Athena (SE), Dina (QA), Frans (DevOps) - HYBRID token distribution v2.3"
priority: critical
phase: any
category: [agents]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/team", "/agents", "/teamwork", "/satria", "/athena", "/dina", "/frans"]
      reason: "Team coordination and persona collaboration"
capabilities: [implementation]
source:
  parent: skills-ecosystem-v2.1
integrates_with:
  - pm-agent (Satria)
  - se-agent (Athena)
  - qa-agent (Dina)
  - devops-agent (Frans)
---

# 👥 PERSONA TEAM - SATRIA, ATHENA, DINA, FRANS

**4 specialists working in coordinated workflow**

## The Team

| Persona | Name | Role | Commands |
|----------|------|------|----------|
| PM Agent | **Satria** | Project Manager | /satria |
| SE Agent | **Athena** | Software Engineer | /athena |
| QA Agent | **Dina** | QA & Security | /dina |
| DevOps Agent | **Frans** | Platform Engineer | /frans |

---

## Workflow

### New Project (Satria First)
```
┌─────────────────────────────────────────────────────────────┐
│  USER starts new project                                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  SATRIA (PM) - First to activate for NEW projects         │
│  Creates BRD, PRD, FSD                                    │
│  Coordinates team members as needed                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌───────────────┐               ┌───────────────┐
│  ATHENA (SE) │               │  DINA (QA)  │
│  Called by    │               │  Called by    │
│  Satria when  │               │  Satria when  │
│  needed        │               │  needed        │
└───────┬───────┘               └──────┬───────┘
        │                               │
        └───────────────┬───────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  FRANS (DevOps) - Called when deployment is ready          │
│  CI/CD, Deployment, Monitoring                             │
└─────────────────────────┬───────────────────────────────────┘
                        ▼
              ┌───────────────────┐
              │  PRODUCTION      │
              │  READY          │
              └─────────────────┘
```

### Existing Project (Contextual)
```
┌─────────────────────────────────────────────────────────────┐
│  USER invokes /autor on existing project                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  AUTOR ASSESSMENT - Analyze project state                  │
│  Health Check: Tests, CI/CD, Docs, Security, Quality       │
└─────────────────────────┬───────────────────────────────────┘
                          │
           ┌──────────────┴──────────────┐
           ▼                             ▼
    HEALTHY PROJECT              PROJECT WITH ISSUES
           │                             │
           │                             ▼
    Show analysis              Recommend TOP priority fix
    No persona needed         Suggest who can help:
                               - Tests? → /dina
                               - CI/CD? → /frans
                               - Docs? → /satria
                               - Security? → /dina
                               - Architecture? → /athena
```

### Team Coordination Rules

| Project Type | Initial Persona | Team Invoked By |
|-------------|-----------------|------------------|
| **New Project** | Satria (PM) | Satria calls team as needed |
| **Existing (Healthy)** | None | User picks or continues solo |
| **Existing (Issues)** | Contextual | Autor suggests, user decides |

### Satria's Role in Team Coordination

```
Satria is the TEAM COORDINATOR for new projects:
  - Decides WHEN to involve Athena (for features/architecture)
  - Decides WHEN to involve Dina (for testing/security)
  - Decides WHEN to involve Frans (for deployment)
  - Passes context between team members
  - Maintains project overview and timeline
```

## Commands

| Command | Persona | Full Name | Purpose |
|---------|----------|------------|----------|
| `/satria` | PM | Project Manager | Requirements, docs |
| `/athena` | SE | Software Engineer | Architecture, code |
| `/dina` | QA | Quality Assurance | Security, testing |
| `/frans` | DevOps | Platform Engineer | Deploy, monitoring |
| `/agents` | All | Full workflow | Start project |

## Token Efficiency

SEMUA persona auto-invoke 3 efficiency tools (aktif saat diperlukan, no overhead):

| Persona | anti-slop | chisle | caveman |
|---------|-----------|--------|---------|
| Satria | ✅ | ✅ | ✅ |
| Athena | ✅ | ✅ | ✅ |
| Dina | ✅ | ✅ | ✅ |
| Frans | ✅ | ✅ | ✅ |

- ~80-90% token savings
- Tools trigger only when output is long
- No overhead for short outputs

## Skills Distribution

| Persona | Inherited (No Token) | Extended (Adds Token) | Total |
|---------|---------------------|---------------------|-------|
| Satria | 12 (from /autor) | 7 | 19 |
| Athena | 12 (from /autor) | 9 | 21 |
| Dina | 12 (from /autor) | 7 | 19 |
| Frans | 12 (from /autor) | 10 | 22 |

### Token Efficiency

```
/autor invoked
  ↓
12 Core Skills LOADED (token cost = 1x)
  ↓
Persona invoked
  ↓
Inherited skills → NO additional token (already loaded)
Extended skills → Additional token per skill
```

### Skills by Persona

#### Satria (PM)
- **Inherited**: git, config, security, testing, error-debugger, observability, doc-generator, mem-search, anti-slop, chisle, caveman, codebase-design
- **Extended**: brd, fsd, prd, architecture-patterns, tech-debt, code-quality, audit

#### Athena (SE)
- **Inherited**: git, config, security, testing, error-debugger, observability, doc-generator, mem-search, anti-slop, chisle, caveman, codebase-design
- **Extended**: api-design, architecture-patterns, design-patterns, code-quality, diagnosing-bugs, tech-debt, performance, reliability, scalability

#### Dina (QA)
- **Inherited**: git, config, security, testing, error-debugger, observability, doc-generator, mem-search, anti-slop, chisle, caveman, code-quality
- **Extended**: playwright, testing-integration, test-generator, pentest, compliance, diagnosing-bugs, audit

#### Frans (DevOps)
- **Inherited**: git, config, security, testing, error-debugger, observability, doc-generator, mem-search, anti-slop, chisle, caveman
- **Extended**: docker, deployment, kubernetes, terraform, devops-engineer, platform-engineering, cloud-architect, error-tracking, reliability, scalability

## Example

```
/satria new e-commerce
  → Satria creates BRD, PRD, FSD
  → Passes to Athena for implementation
  → Athena codes with best practices
  → Dina audits security & tests
  → Frans deploys to production
```

---

*Built for teams who ship!*
