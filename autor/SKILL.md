---
name: autor
description: "Project intelligence: health scan, new-project wizard, roadmap progress, release cutting, and the 6-persona pipeline recommendation"
when_to_use: "Use when starting a new project, analyzing existing codebase, cutting a release, or needing project intelligence. Run /autor scan for project health check, /autor new for fresh projects, /autor release to cut a version."
metadata:
  version: "3.10.0"
---

# AUTOR v3.10.0 - PROJECT INTELLIGENCE

## 🚀 SKILLS

Stack, security, testing, git, and docs knowledge come from the model itself plus the project's `CLAUDE.md` and `specs/`; there are no skills for them. Besides the personas, `/agents`, and `/audit`, only six skills exist, and each changes a default the model would otherwise get wrong:

| Situation | Load |
|-----------|------|
| About to write new code | `/ponytail` |
| Writing or changing behavior | `/tdd` |
| Building or changing UI | `/impeccable` |
| A UI change that must be proven in a browser | `/uicheck` |
| Writing user-facing copy, docs, or comments | `/anti-slop` |
| A plan or decision that must be stress-tested before it is built | `/fool` |

Do not preload them; load one when the current step needs it.

**On `/autor`, first respond with:**

```
AUTOR v3.10.0

Available Commands:
  /autor              # Analyze current project
  /autor scan         # Full health check with recommendations
  /autor new          # New project wizard
  /autor status       # Quick status overview
  /autor release      # Cut a release (version, notes, tag, push)

Available Personas:
  /satria   /athena   /hexa   /dina   /frans   /vika
```

---

## 📋 PROJECT ANALYSIS

When `/autor` is invoked:

### 1. SCAN PROJECT
Run these checks:
- Project `CLAUDE.md`: missing, or without stack, run/test commands, `Scale:`, or `UI language:`, is DEFICIENT (fix: create or complete it; personas read their conventions from it)
- Directory structure analysis
- Git status check
- Package.json / requirements detection
- Test coverage measurement
- CI/CD configuration check
- `specs/ROADMAP.md`: when it exists, report roadmap progress (see section 5)

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

Keep the order Satria → Athena → Hexa → Dina → Frans → Vika, skip personas with no matching finding, and skip Satria/Athena when an approved plan already covers PRD and ADR. Apply the route rules from `/agents`: a contract or schema change adds Athena, a migration adds Frans, and any code change keeps Dina. When `specs/ROADMAP.md` exists and the next epic has a PRD, the epic route applies instead (KLIEN: Athena → Hexa → Dina → Frans → Vika; PRIBADI: Hexa → Dina, plus the phases the findings add). Output one block:

```text
PIPELINE: Hexa → Dina → Vika
  Hexa  - no tests (Pester available)
  Dina  - new endpoint needs audit
  Vika  - CHANGELOG missing
Run: "mulai pipeline" or /agents
```

---

## 5. ROADMAP PROGRESS

Only when `specs/ROADMAP.md` exists. Read the epic table and report:

```text
ROADMAP: 1/3 epic selesai
  E1 Auth       done
  E2 Billing    in progress
  E3 Reporting  todo  (menunggu E2)

Berikutnya: E3 Reporting — specs/prd/E3-reporting.md
```

Name the next epic as the first row with `todo` whose `Depends on` epics are all `done`. If none is ready, say which epic is blocking. End with the epic route: `Run: "mulai epic E3" or /agents epic`.

The epic route is `/agents epic`: one epic per run (KLIEN: Athena → Hexa → Dina → Frans → Vika; PRIBADI: Hexa → Dina plus what the route rules add).

## 🎯 COMMAND HANDLERS

### `/autor` - Default Analysis

**Action:** Run project analysis and display health state

### `/autor scan` - Full Health Check

**Action:** Comprehensive scan including:
- Code structure analysis
- Test coverage
- CI/CD and Dockerfile check
- Security assessment (for a full audit, recommend `/dina`)
- Documentation audit
- Dependency audit

**Output:** Full health report with prioritized remediation, ending with the persona pipeline recommendation (section 4). When `specs/ROADMAP.md` exists, include the roadmap progress block (section 5) before the recommendation.

### `/autor new` - New Project Wizard

**Action:** Start the new-project workflow. **Read `~/.claude/skills/autor/new.md` and follow it** (steps 1-6: project type, PRD, scaffold, stack detection, commit offer, pipeline recommendation).

**Hard stop:** after Satria writes the PRD (Step 2), end your turn with a summary and ask for approval; never run the scaffold or invoke `/athena` in that turn. A bare "lanjut" only advances the wizard step and never starts a persona.


### `/autor status` - Quick Overview

**Action:** Lightweight status check:
- Git status
- Dependencies status
- Running processes
- Recent changes

### `/autor release` - Cut a Release

**Action:** Turn the `## [Unreleased]` block of `CHANGELOG.md` into a versioned release, tag it, and push it. **Read `~/.claude/skills/autor/release.md` and follow it** (preconditions, bump, notes + rollback, CHANGELOG cut, commit, tag, push).

**Hard rules:** ask before every step that writes, tags, or pushes; the rollback note is mandatory; never move an existing tag.

---

## Pipeline

`/agents` runs the six personas (Satria → Athena → Hexa → Dina → Frans → Vika) and picks the shortest route; models, pauses, and the gate loop are defined in `agents/SKILL.md`.
