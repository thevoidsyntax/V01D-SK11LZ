---
name: autor
version: "6.0.0"
description: "Smart Project Intelligence: intent detection, skill routing, AI-powered recommendations"
priority: critical
phase: any
category: [process]
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/autor", "/ar", "/auto-router", "/auto-route", "/autoroute"]
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

# 🚀 AUTO-ROUTER v6.0

**Smart Project Intelligence Tool**

```
┌──────────────────────────────────────────────────────────┐
│  🚀 AUTO-ROUTER v6.0                                  │
│  Smart Project Intelligence                              │
│  Intent Detection • Confidence Scoring • Smart UI       │
└──────────────────────────────────────────────────────────┘
```

## Quick Start

| Command | Fungsi |
|---------|---------|
| `/autor` | Auto-detect & Smart Dashboard |
| `/autor new` | New project wizard |
| `/autor scan` | Analyze existing project |
| `/autor status` | Show project status |

## CORE Skills (18)

| Category | Skills |
|----------|--------|
| DevOps | /git, /docker, /ci-cd, /deployment |
| Quality | /codequality, /testing, /config, /logging |
| Security | /security, /pentest |
| Frontend | /frontend, /ui-ux-pro-max |
| Performance | /performance, /observability |
| Architecture | /tdd, /diagnosing-bugs, /domain-modeling, /architecture-patterns |

## Features

| Feature | Status |
|---------|--------|
| Intent Detection | ✅ |
| Keyword Matching | ✅ |
| Confidence Scoring | ✅ |
| Smart Terminal UI | ✅ |
| State Persistence | ✅ |
| Pattern Recognition | ✅ |
| Hacker Tools | ✅ |

## Internal Files

| File | Purpose |
|------|---------|
| `selector.ts` | Skill scoring & CORE_SKILLS |
| `detector.ts` | Intent detection & tech stack |
| `smart-ui.ts` | Rich terminal interface |
| `cli.ts` | CLI entry point |

*Version: 6.0.0 | Author: TheVoidSyntax*
