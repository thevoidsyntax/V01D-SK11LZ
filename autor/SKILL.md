---
name: autor
description: "Project intelligence: health scan, new-project wizard, roadmap progress, release cutting, and the 6-persona pipeline recommendation"
when_to_use: "Use when starting a new project, analyzing existing codebase, cutting a release, or needing project intelligence. Run /autor scan for project health check, /autor new for fresh projects, /autor release to cut a version."
metadata:
  version: "3.14.3"
---

# AUTOR - PROJECT INTELLIGENCE

## 🚀 SKILLS

Stack, security, testing, git, and docs knowledge come from the model itself plus the project's `CLAUDE.md` and `specs/`; there are no skills for them. The other skills in this pack load themselves when their step comes: each skill's own `when_to_use` says when it applies, and `README.md` holds the list of what exists. Do not preload them; load one when the current step needs it.

Graphify is not one of them: it is a local third-party tool installed outside this repo. When the project has `graphify-out/graph.json`, the scan uses it to map the codebase; when it does not, the scan skips it and never builds a graph.

**On `/autor`, first respond with the banner below, taking the version from `metadata.version` above — do not write a second copy of it:**

```
AUTOR v<version from metadata.version>

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
- Project `CLAUDE.md`: missing, or without stack, run/test commands, `Scale:`, `UI language:`, `Code language:`, or `Artifact language:`, is DEFICIENT (fix: create or complete it; personas read their conventions from it). The two language lines record the language the project already uses: an old project keeps its language and is never converted, a new project defaults to English for both
- Directory structure analysis
- Git status check
- Package.json / requirements detection
- Test coverage measurement
- CI/CD configuration check
- `graphify-out/graph.json`: when it exists, map the codebase with `/graphify` (Skill tool, `skill: "graphify"`, `args: "query <question>"`) instead of a broad grep over the tree; when it is absent, skip it and never build a graph
- `specs/ROADMAP.md`: when it exists, report roadmap progress (see section 5). DEFICIENT when an epic is `in progress` but the file has no position block (the `## Current position` block, or `## Posisi sekarang` in a roadmap written before the English default) or no pipeline table for it, or when the commit the block names is behind HEAD by commits that touched `src/` or `tests/` (`git log <commit>..HEAD -- src tests` is not empty): the status is stale (fix: the next phase updates it per `agents/progress.md`). Also DEFICIENT when an epic is `done` in the ROADMAP but `specs/HANDOFF.md` still holds its `Epic: <id>` entry (fix: archive it to `specs/handoff/<epic>.md` per `agents/epic.md` step 6; unarchived, personas read the whole log)

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

`/agents` owns the route: read `~/.claude/skills/agents/SKILL.md` section 1 ("Pick the route"), map each finding onto the change type that table keys on, and take the phases from its route column. Section 1 also holds the rules for several findings at once — the union of their phases, and the skip when a PRD and an ADR already exist. Do not restate the route table or the phase order here — one owner, one table.

When `specs/ROADMAP.md` exists and the next epic has a PRD, the epic route in section 5 applies instead of this block.

Output one block:

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

Name the next epic as the first row with `todo` whose `Depends on` epics are all `done`. If none is ready, say which epic is blocking. When the roadmap has a position block, print its summary, verified, and next lines, then the pipeline table of the epic that is `in progress` as one line per phase (`✅ Build · Hexa`, `☐ Gate round 2 · Dina`). Read the state from there; never rebuild it from `specs/HANDOFF.md`. End with the epic route: `Run: "mulai epic E3" or /agents epic`.

The epic route is `/agents epic`; its phases come from `~/.claude/skills/agents/SKILL.md` section 1.

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

**Output:** Full health report with prioritized remediation, ending with the persona pipeline recommendation (section 4). When `specs/ROADMAP.md` exists, include the roadmap progress block (section 5) before the recommendation. When Graphify is installed but the project has no `graphify-out/graph.json`, list `graphify extract .` as a remediation step (the scan never builds a graph itself).

### `/autor new` - New Project Wizard

**Action:** Start the new-project workflow. **Read `~/.claude/skills/autor/new.md` and follow it** (steps 1-6: project type, PRD, scaffold, stack detection, commit offer, pipeline recommendation).

**Hard stop:** after Satria writes the PRD (Step 2), end your turn with a summary and ask for approval; never run the scaffold or invoke `/athena` in that turn. A bare "lanjut" only advances the wizard step and never starts a persona.


### `/autor status` - Quick Overview

**Action:** Lightweight status check:
- Git status
- Dependencies status
- Running processes
- Recent changes
- Roadmap position: the position block and the running epic's pipeline (section 5), when `specs/ROADMAP.md` exists

### `/autor release` - Cut a Release

**Action:** Turn the `## [Unreleased]` block of `CHANGELOG.md` into a versioned release, tag it, and push it. **Read `~/.claude/skills/autor/release.md` and follow it** (preconditions, bump, notes + rollback, CHANGELOG cut, commit, tag, push).

**Hard rules:** ask before every step that writes, tags, or pushes; the rollback note is mandatory; never move an existing tag.

---

## Pipeline

`/agents` runs the pipeline and picks the shortest route; its phases, models, pauses, and the gate loop are defined in `agents/SKILL.md`.
