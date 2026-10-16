---
name: agents
version: "1.0.0"
description: "Team of 4 specialized agents: PM, SE, QA, DevOps working together in a coordinated workflow"
priority: critical
phase: any
category: [agents]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/team", "/agents", "/teamwork"]
      reason: "Team coordination and agent collaboration"
capabilities: [implementation]
source:
  parent: skills-ecosystem-v2.0
integrates_with:
  - pm-agent
  - se-agent
  - qa-agent
  - devops-agent
---

# 👥 AGENT TEAM ORCHESTRATOR

**Team of 4 specialized agents working in coordinated workflow**

---

## The Team

| Agent | Role | Invokes | Receives From |
|--------|------|---------|-----------------|
| **PM Agent** | Project Manager | /pm | Project requirements |
| **SE Agent** | Software Engineer | /se | PM requirements |
| **QA Agent** | QA & Security | /qa | SE code |
| **DevOps Agent** | Platform Engineer | /devops | QA clearance |

---

## Workflow Orchestration

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  USER: "/team new project e-commerce                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PM AGENT (@pm)                                      │   │
│  │  → Creates BRD, PRD, FSD                            │   │
│  │  → Defines milestones & timeline                     │   │
│  │  → Identifies risks                                 │   │
│  └─────────────────────────────┬───────────────────────┘   │
│                                │                           │
│                                ▼                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  SE AGENT (@se)                                        │ │
│  │  → Designs architecture                               │ │
│  │  → Implements code                                  │ │
│  │  → Self-reviews with /security /testing             │ │
│  └─────────────────────────────┬───────────────────────┘ │
│                                │                         │
│                                ▼                         │
│  ┌─────────────────────────────────────────────────┐ │
│  │  QA AGENT (@qa)                                  │ │
│  │  → Security scan (OWASP Top 10)                  │ │
│  │  → Test strategy & coverage                       │ │
│  │  → Code review                                   │ │
│  └─────────────────────────────┬───────────────────┘ │
│                                │                       │
│                                ▼                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  DEVOPS AGENT (@devops)                            │ │
│  │  → Infrastructure setup                          │ │
│  │  → CI/CD pipeline                               │ │
│  │  → Deployment                                   │ │
│  │  → Monitoring                                   │ │
│  └─────────────────────────────────────────────────┘ │
│                                                             │
│  COMPLETE → Project shipped to production                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Commands

| Command | Agent | Purpose |
|---------|--------|---------|
| `/pm` | PM Agent | Create/update BRD, PRD, FSD |
| `/se` | SE Agent | Architecture & code |
| `/qa` | QA Agent | Security & testing |
| `/devops` | DevOps Agent | Deploy & monitor |
| `/team` | Orchestrator | Full workflow |
| `/team status` | All | Current status |

---

## Efficiency Design

### Token Optimization
- Each agent has focused responsibility
- No duplicate work
- Parallel execution where possible
- Context passed by reference, not duplication

### Quality Gates
```
PM → SE: Requirements clear?
SE → QA: Code reviewed?
QA → DevOps: All gates passed?
DevOps → Production: Verified?
```

---

## Integration with Core Skills

Agents use core skills for expertise:

| Agent | Core Skills Used |
|--------|------------------|
| PM Agent | /doc-generator, /mem-search, /codebase-design |
| SE Agent | /security, /testing, /codebase-design, /api-design |
| QA Agent | /security, /testing, /error-debugger |
| DevOps Agent | /deployment, /docker, /observability |

---

## Example Usage

```
/team new project e-commerce
  → PM creates requirements
  → SE implements code
  → QA reviews & tests
  → DevOps deploys & monitors
  → Ready in production
```

---

**Invoke:** `/team` | **Version:** 1.0.0
