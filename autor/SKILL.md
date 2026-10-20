---
name: autor
version: "3.1.0"
description: "Project intelligence with Smart Flow, 6-persona pipeline, token-efficient core skills, and memory continuity for Claude Code"
when_to_use: "Use when starting a new project, analyzing existing codebase, or needing project intelligence. Run /autor scan for project health check, /autor new for fresh projects."
priority: critical
phase: any
category: [process, intelligence]
tech_stack:
  languages: [all]
  frameworks: [all]
  databases: [all]
  services: [all]
scale: [all]
capabilities: [implementation, analysis]
source:
  origin: infrastructure
author: thevoidsyntax
---

# AUTOR v3.1 - PROJECT INTELLIGENCE

## 🚀 CORE SKILLS AUTO-LOADING

**When this skill is invoked, you MUST immediately load these 12 core skills:**

```
Skill: git
Skill: config
Skill: security
Skill: testing
Skill: error-debugger
Skill: observability
Skill: doc-generator
Skill: mem-search
Skill: anti-slop
Skill: chisle
Skill: caveman
Skill: codebase-design
```

**After loading, respond with:**

```
AUTOR v3.1 - 12 core skills loaded

Available Commands:
  /autor              # Analyze current project
  /autor scan         # Full health check with recommendations
  /autor new          # New project wizard
  /autor status       # Quick status overview

Available Personas:
  /satria   /athena   /hexa   /dina   /frans   /vika
  (plan)    (plan)    (auto)  (auto)  (plan)   (auto)
```

---

## 📋 PROJECT ANALYSIS

When `/autor` is invoked:

### 1. SCAN PROJECT
Run these checks:
- Directory structure analysis
- Git status check
- Package.json / requirements detection
- Test coverage measurement
- CI/CD configuration check

### 2. DISPLAY PROJECT STATE

```
PROJECT STATE: [HEALTHY | NEEDS ATTENTION | CRITICAL]

┌─────────────────────────────────────────────────────┐
│  ✅ WORKING                                        │
├─────────────────────────────────────────────────────┤
│  [List of working components]                      │
├─────────────────────────────────────────────────────┤
│  ⚠️  DEFICIENT                                    │
├─────────────────────────────────────────────────────┤
│  [List of issues with fix commands]               │
└─────────────────────────────────────────────────────┘
```

### 3. PROVIDE REMEDIATION ROADMAP

For each issue, provide:
- Priority level
- Fix command (e.g., `/frans` for CI/CD)
- Time estimate
- Deliverables

### 4. RECOMMEND PERSONA PIPELINE

End every analysis with a pipeline recommendation built from the findings. Recommend only; never start the pipeline without the user's go-ahead.

| Finding | Persona |
|---------|---------|
| Requirements unclear, no PRD or acceptance criteria | `/satria` |
| Architecture decision pending, no ADR, API/data contract undefined | `/athena` |
| Feature missing, no tests or low coverage | `/hexa` |
| No audit yet, security or concurrency findings | `/dina` (gate) |
| No CI/CD, Dockerfile, or migrations where the project needs them | `/frans` |
| README, CHANGELOG, or API docs missing or stale | `/vika` |

Keep the order Satria → Athena → Hexa → Dina → Frans → Vika, skip personas with no matching finding, and skip Satria/Athena when an approved plan already covers PRD and ADR. Output one block:

```
PIPELINE: Hexa → Dina → Vika
  Hexa  - no tests (Pester available)
  Dina  - new endpoint needs audit
  Vika  - CHANGELOG missing
Run: "mulai pipeline" or /agents
```

---

## 🎯 COMMAND HANDLERS

### `/autor` - Default Analysis

**Action:** Run project analysis and display health state

### `/autor scan` - Full Health Check

**Action:** Comprehensive scan including:
- Code structure analysis
- Test coverage (via `/testing`)
- CI/CD check (via `/docker` if Dockerfile exists)
- Security assessment (via `/security`)
- Documentation audit
- Dependency audit

**Output:** Full health report with prioritized remediation, ending with the persona pipeline recommendation (section 4)

### `/autor new` - New Project Wizard

**Action:** Start new project workflow:

**Step 1:** Ask project type:
```
📋 What type of project?
1. 🌐 Web Application
2. 📡 REST/GraphQL API
3. 🔧 CLI Tool
4. 📦 NPM Library
5. 📱 Mobile App
6. 🎮 Game
```

**Step 2:** Based on type, recommend tech stack

**Step 3:** Generate setup commands

**Step 4:** Auto-load relevant skills for the stack

### `/autor status` - Quick Overview

**Action:** Lightweight status check:
- Git status
- Dependencies status
- Running processes
- Recent changes

---

## 6 PERSONAS PIPELINE

Sequential workflow where each persona hands off to the next:

```text
Satria → Athena → Hexa → Dina → Frans → Vika
  PM       Arch     Code    QA     DevOps   Writer
 plan      plan    auto   auto     plan    auto
```

| # | Persona | Model | Effort | Mode | Handoff |
|---|---------|-------|--------|------|---------|
| 1 | Satria | Sonnet | medium | plan | PRD to Athena |
| 2 | Athena | Opus | high | plan | ADR to Hexa |
| 3 | Hexa | Sonnet | medium | auto | Code to Dina |
| 4 | Dina | Opus | medium | auto | Report to Frans/Vika |
| 5 | Frans | Sonnet | medium | plan | Infrastructure |
| 6 | Vika | Haiku | low | auto | Documentation |

Dina is the gatekeeper. She either approves or rejects. If rejected, Hexa patches and resubmits. Maximum three resubmission attempts allowed.

---

## HEALTH CHECK CRITERIA

Analyze these dimensions:

| Dimension | Metric | Command |
|-----------|--------|---------|
| Test coverage | Percentage | /testing |
| CI/CD | Pipeline exists | /frans |
| Documentation | README, API docs | /doc-generator |
| Security | OWASP checklist | /security |
| Code structure | Architecture | /codebase-design |

---

## TOKEN NOTES

Loading all 12 core skills costs about 24K tokens (estimated from file size), and they stay in context for the rest of the session. Persona skills add their own tokens when invoked. `anti-slop`, `chisle`, and `caveman` are style skills, not automatic token savers; the percentage reductions once listed here were never measured.

---

*"Make it work, make it right, make it fast."*
