---
name: autor
description: "Project intelligence: health scan, new-project wizard, roadmap progress, release cutting, and the 6-persona pipeline recommendation"
when_to_use: "Use when starting a new project, analyzing existing codebase, cutting a release, or needing project intelligence. Run /autor scan for project health check, /autor new for fresh projects, /autor release to cut a version."
metadata:
  version: "3.8.1"
---

# AUTOR v3.8.1 - PROJECT INTELLIGENCE

## 🚀 SKILLS

Stack, security, testing, git, and docs knowledge come from the model itself plus the project's `CLAUDE.md` and `specs/`; there are no skills for them. Besides the personas, `/agents`, and `/audit`, only five skills exist, and each changes a default the model would otherwise get wrong:

| Situation | Load |
|-----------|------|
| About to write new code | `/ponytail` |
| Writing or changing behavior | `/tdd` |
| Building or changing UI | `/impeccable` |
| A UI change that must be proven in a browser | `/uicheck` |
| Writing user-facing copy, docs, or comments | `/anti-slop` |

Do not preload them; load one when the current step needs it.

**On `/autor`, first respond with:**

```
AUTOR v3.8.1

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

### `/autor release` - Cut a Release

**Action:** Turn the `## [Unreleased]` block of `CHANGELOG.md` into a versioned release, tag it, and push it. Ask before every step that writes, tags, or pushes.

**Preconditions.** Check all of these first and stop with the reason:
- `CHANGELOG.md` exists in the repo root and has a `## [Unreleased]` heading with at least one entry under it. An empty block means there are no release notes yet: stop and say so, they are written first (Vika in the pipeline).
- The working tree is clean: `git status --porcelain` prints nothing. If not, stop and list the changed files.
- The branch is not detached: `git symbolic-ref --short HEAD` succeeds.

**Step 1 - Version bump.**
- Last released version: the newest `## [x.y.z]` heading in `CHANGELOG.md`; if there is none, `0.0.0`.
- Base commit: `git describe --tags --abbrev=0 --match 'v[0-9]*'`. If that fails (no semver tag), use the commit that added the last version heading: `git log -1 --format=%H -S'## [<last version>]' -- CHANGELOG.md`. If that also fails, use the first commit of the repo.
- Range = `<base>..HEAD`, read with `git log --format='%h %s%n%b' <base>..HEAD`. The body is needed to spot a `BREAKING CHANGE:` line. An empty range means there is nothing to release: stop and say so.
- Bump: `feat!` or a `BREAKING CHANGE:` line → major; `feat` → minor; `fix` and `perf` → patch; `docs`, `chore`, `test`, `ci`, `refactor` → no bump. The strongest bump wins; when no commit asks for a bump, use patch.
- Only `v[0-9]*` tags are versions. Other tags (this repo has `skills-v1-full`) are snapshots and are ignored.
- Print:

```text
RELEASE: 4.0.0 → 4.1.0  (minor)
  feat  6fc9f08  roadmap mode for Satria and epic route in /agents
  feat  87fa7cc  branch and PR flow
  fix   0ec9442  make Hexa invoke ponytail/impeccable/anti-slop
  docs  cbfb34a  hooks deny instead of ask
```

- The version comes only from this table. The per-skill `metadata.version` counters are bumped in the change commit, never here.

**Step 2 - Release notes and rollback.**
- The body is the existing `[Unreleased]` entries, unchanged and in order; they are the notes the pipeline already wrote.
- Add one sentence at the top: what changed, not how big it is.
- Add a `### Rollback` section at the end of the body:
  - the previous release, its version number and its tag when one exists;
  - when `migrations/` changed in the range, one line per migration with its down step, read from `migrations/*/down.sql` or the note in `migrations/README.md`, e.g. `2026-10-22_add_status - drops the status column and its index`;
  - when no migration changed: `No schema change. Go back to <previous>: git checkout <previous tag or version>, or git revert <base>..HEAD`.
- Never write a down step that is not in the repo. A migration without a down script is said to need a manual rollback.

**Step 3 - Cut the CHANGELOG.**
- Rename `## [Unreleased]` to `## [<new version>] - <date>`, with the date from `date -u +%Y-%m-%d`.
- Insert a fresh empty `## [Unreleased]` above it.
- Update the `## Versioning` table: the new version becomes `Current` and every other row becomes `Previous`. Insert a row for the previous release when the table has none, so the table never lags behind the headings.
- Show `git diff CHANGELOG.md` and ask **Commit** / **Ubah** / **Lewati**. On **Lewati** stop; nothing is written.

**Step 4 - Commit.** Only after **Commit**.
- `git add CHANGELOG.md`, then `git commit -m "chore(release): v<version>"` with a body holding the one-sentence summary and `Co-Authored-By: Vika` (the writer of the release notes; the persona trailer replaces Claude Code's default attribution line).

**Step 5 - Tag.** Only after **Commit**.
- `git tag -a v<version> -m "v<version> - <one-line summary>"`. Ask first. If the tag exists, stop and report it; never move an existing tag.

**Step 6 - Push.** Only after **Commit** and **Tag**.
- `git push` and `git push origin v<version>`. The global hook asks the user, so never use git global options (`-C`, `-c`) here. If the push is denied or fails, leave the tag local and say so.

**Rules.**
- One release per run. Nothing is tagged and nothing is pushed without an explicit go-ahead.
- Never rewrite the heading of a published version. A fix to a released version is a new patch release.
- The rollback note is mandatory: a release without it is not finished.

---

## 6 PERSONAS PIPELINE

Sequential workflow run by `/agents`, which picks the shortest route for the change:

```text
Satria → Athena → Hexa → Dina → Frans → Vika
  PM       Arch     Code    QA     DevOps   Writer
```

| # | Persona | Model | Effort | Handoff |
|---|---------|-------|--------|---------|
| 1 | Satria | Opus | medium | PRD to Athena |
| 2 | Athena | Sonnet | high | ADR + conventions to Hexa |
| 3 | Hexa | Sonnet* | high | Code to Dina |
| 4 | Dina | Sonnet* | high | Report to Frans/Vika |
| 5 | Frans | Sonnet | high | Infrastructure |
| 6 | Vika | Haiku | low | Documentation |

Dina is the gatekeeper: she approves or rejects, and Hexa patches up to three times. `/agents` pauses for the user after the design phases (PRIBADI: after Athena; KLIEN: after Satria and Athena), runs a final Dina pass over Frans/Vika output, and commits only after the user approves.

\* Hexa and Dina move to Opus at effort high only for the gate rounds after the second `REJECTED`. For PRIBADI work `/agents` runs Hexa → Dina unless the request needs more.

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
