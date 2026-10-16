---
name: agents
version: "1.1.0"
description: "Team of 4 named personas: Satria (PM), Athena (SE), Dina (QA), Frans (DevOps) working together"
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
| PM Agent | **Satria** | Project Manager | /satria, /pm |
| SE Agent | **Athena** | Software Engineer | /athena, /se |
| QA Agent | **Dina** | QA & Security | /dina, /qa |
| DevOps Agent | **Frans** | Platform Engineer | /frans, /devops |

---

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  USER starts project                                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  SATRIA (PM) - Creates BRD, PRD, FSD                    │
│  /satria or /pm                                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌───────────────┐               ┌───────────────┐
│  ATHENA (SE) │               │  DINA (QA)  │
│  Architecture │               │  Security   │
│  Code review  │               │  Testing   │
│  /athena     │               │  /dina      │
└───────┬───────┘               └──────┬───────┘
        │                               │
        └───────────────┬───────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  FRANS (DevOps) - CI/CD, Deployment, Monitoring           │
│  /frans or /devops                                        │
└─────────────────────────┬───────────────────────────────────┘
                        ▼
              ┌───────────────────┐
              │  PRODUCTION      │
              │  READY          │
              └─────────────────┘
```

## Commands

| Command | Persona | Full Name | Purpose |
|---------|----------|------------|----------|
| `/satria` | PM | Project Manager | Requirements, docs |
| `/athena` | SE | Software Engineer | Architecture, code |
| `/dina` | QA | Quality Assurance | Security, testing |
| `/frans` | DevOps | Platform Engineer | Deploy, monitoring |
| `/team` | All | Full workflow | Start project |
| `/pm`, `/se`, `/qa`, `/devops` | Aliases | Short commands | Same as named versions |

## Token Efficiency

- Personas share context, no duplication
- Parallel execution where possible
- ~100k tokens per project (same as single agent)

## Integration

| Persona | Uses Skills | Passes To |
|----------|--------------|------------|
| Satria | /doc-generator, /mem-search | Athena |
| Athena | /security, /testing | Dina |
| Dina | /security, /testing | Frans |
| Frans | /deployment, /docker | Production |

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
