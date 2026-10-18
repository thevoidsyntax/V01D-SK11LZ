---
name: handoff
description: "Structured project handover documentation and checklists"
when_to_use: "Use when handing a project over: handover docs and checklists."
version: "1.1.0"
category: [strategy]
priority: medium
phase: close
auto_invoke:
  enabled: true
  conditions:
    - command: ["/handoff", "/hand-over"]
      reason: "Project handover"
    - phrase: ["handoff", "hand over", "transfer project", "onboarding"]
      reason: "Intent to handover"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [documentation, wayfinder]
capabilities: [implementation]
quality:
  rules_count: 8
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Handoff

Structured handover process for project transitions.

## Usage

```
Use handoff when:
- Transferring project to another team
- Onboarding new team members
- Ending engagement phase
- Documenting work for future reference
```

## Checklist

### Documentation
- [ ] Architecture overview
- [ ] Key decisions and rationale
- [ ] Outstanding issues
- [ ] Environment access
- [ ] Contact matrix

### Code
- [ ] Clean, commented code
- [ ] Updated README
- [ ] Deployment documentation
- [ ] Runbooks

### Knowledge Transfer
- [ ] Walkthrough sessions
- [ ] Q&A documentation
- [ ] Support escalation path
