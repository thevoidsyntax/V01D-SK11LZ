---
name: autor
description: "Project intelligence: health scan, new-project wizard, roadmap progress, and the 6-persona pipeline recommendation"
when_to_use: "Use when starting a new project, analyzing existing codebase, or needing project intelligence. Run /autor scan for project health check, /autor new for fresh projects."
metadata:
  version: "3.5.0"
---

# AUTOR v3.5 - PROJECT INTELLIGENCE

## 🚀 SKILLS

Stack, security, testing, git, and docs knowledge come from the model itself plus the project's `CLAUDE.md` and `specs/`; there are no skills for them. Besides the personas, `/agents`, and `/audit`, only three skills exist, and each changes a default the model would otherwise get wrong:

| Situation | Load |
|-----------|------|
| About to write new code | `/ponytail` |
| Building or changing UI | `/impeccable` |
| Writing user-facing copy, docs, or comments | `/anti-slop` |

Do not preload them; load one when the current step needs it.

**On `/autor`, first respond with:**

```
AUTOR v3.5

Available Commands:
  /autor              # Analyze current project
  /autor scan         # Full health check with recommendations
  /autor new          # New project wizard
  /autor status       # Quick status overview

Available Personas:
  /satria   /athena   /hexa   /dina   /frans   /vika
```

---

## 📋 PROJECT ANALYSIS

When `/autor` is invoked:

### 1. SCAN PROJECT
Run these checks:
- Project `CLAUDE.md`: missing, or without stack, run/test commands, or `Scale:`, is DEFICIENT (fix: create or complete it; personas read their conventions from it)
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

Keep the order Satria → Athena → Hexa → Dina → Frans → Vika, skip personas with no matching finding, and skip Satria/Athena when an approved plan already covers PRD and ADR. Apply the route rules from `/agents`: a contract or schema change adds Athena, a migration adds Frans, and any code change keeps Dina. When `specs/ROADMAP.md` exists and the next epic has a PRD, the epic route applies instead: Athena → Hexa → Dina → Frans → Vika. Output one block:

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

The epic route is `/agents epic`: Athena → Hexa → Dina → Frans → Vika on one epic.

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

**Step 2:** Run `/satria` to turn the idea into `specs/PRD.md`, then end your turn: summarize the PRD and its assumptions and ask for approval. For a product with several features, Satria uses roadmap mode and writes `specs/ROADMAP.md` with one PRD per epic — summarize the roadmap and the first epic instead. Plan mode may not hold in a headless or auto session, so the stop is yours to make. Do not run Step 3 or invoke `/athena` in the same turn; Satria's `[HANDOFF]` line is not a trigger here.

**Step 3:** Scaffold the project yourself; there is no scaffolding skill. Use the stack from the approved PRD and the folder layout from the user's global `CLAUDE.md` rules. Create: `git init` if needed, `.gitignore`, `.env.example` (no secrets), a manifest with start/test scripts, one passing test, a README stub, and the **project `CLAUDE.md`**:

```markdown
# <project> — Claude Code guide
Scale: PRIBADI | KLIEN
Stack: <language + version, framework, database>
Commands: <install>, <run>, <test>, <lint if any>
Layout: <top folders and what lives where>
Conventions: <what is fixed so far; Athena adds the rest from the ADR>
Specs: specs/PRD.md, specs/ADR.md, specs/HANDOFF.md
```

Install nothing from the internet unless the user allowed it. No feature code.

**Step 4:** Detect the stack from the manifests (`package.json`, `*.csproj`, `go.mod`, `pyproject.toml`, ...). Append a `specs/HANDOFF.md` entry for the scaffold: a `## [SCAFFOLD] autor — <UTC time from date -u>` heading, then `Input:`, `Output:`, `Decisions:`, `Open:`, `Next:` lines covering stack, layout, scripts, and what is not verified yet. Never invent a time; write the date only if you cannot run `date`.

**Step 5:** Offer a commit of the scaffold: show `git status --short` and the message (`chore: scaffold <project>` with `Co-Authored-By: Satria`; this persona trailer is the user's attribution rule and replaces Claude Code's default `Co-Authored-By: Claude …` line), then ask **Commit** / **Ubah pesan** / **Lewati**. Commit only on **Commit**; if you cannot ask (headless), leave it uncommitted and say so. Never push.

**Step 6:** End with the persona pipeline recommendation (section 4), then stop. A bare "lanjut" or "continue" only advances the current wizard step; it is never permission to start a persona. Start Athena, Hexa, or any later phase only after the user says "mulai pipeline" or runs `/agents`.

### `/autor status` - Quick Overview

**Action:** Lightweight status check:
- Git status
- Dependencies status
- Running processes
- Recent changes

---

## 6 PERSONAS PIPELINE

Sequential workflow run by `/agents`, which picks the shortest route for the change:

```text
Satria → Athena → Hexa → Dina → Frans → Vika
  PM       Arch     Code    QA     DevOps   Writer
```

| # | Persona | Model | Effort | Handoff |
|---|---------|-------|--------|---------|
| 1 | Satria | Sonnet | medium | PRD to Athena |
| 2 | Athena | Opus | high | ADR + conventions to Hexa |
| 3 | Hexa | Sonnet | medium | Code to Dina |
| 4 | Dina | Opus | medium | Report to Frans/Vika |
| 5 | Frans | Sonnet | medium | Infrastructure |
| 6 | Vika | Haiku | low | Documentation |

Dina is the gatekeeper: she approves or rejects, and Hexa patches up to three times. `/agents` pauses for the user after the design phases (PRIBADI: after Athena; KLIEN: after Satria and Athena), runs a final Dina pass over Frans/Vika output, and commits only after the user approves.

---

## HEALTH CHECK CRITERIA

Analyze these dimensions:

| Dimension | Metric | Command |
|-----------|--------|---------|
| Test coverage | Percentage | /hexa |
| CI/CD | Pipeline exists | /frans |
| Documentation | README, API docs | /vika |
| Security | OWASP checklist | /dina |
| Code structure | Architecture | /athena |

---

## TOKEN NOTES

The repo was cut from 139 skills to 12 in v3.3. 73 had never been invoked, the skill list was truncated so ~60 showed no description, and the stack/core skills held generic knowledge the model already has. The rest are in git tag `skills-v1-full` (`git checkout skills-v1-full -- <name>`). `anti-slop` is a style skill, not a token saver: an A/B test found no reduction in total output tokens.

---

*"Make it work, make it right, make it fast."*
