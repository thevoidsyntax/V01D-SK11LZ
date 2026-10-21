# Changelog

All notable changes to the Skills Ecosystem will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Routes in `/agents`.** The orchestrator picks the shortest route and prints it before starting (`[RUTE] Bugfix: Hexa → Dina`):
  - new feature → all six phases;
  - existing feature with unchanged contracts → Hexa → Dina (→ Vika);
  - bugfix → Hexa, failing test first → Dina;
  - infra → Frans → Dina;
  - docs → Vika.

  A contract or schema change adds Athena, a migration adds Frans, and any code change keeps Dina.
- **Approval pauses.** `/agents` reads `Scale:` from the project `CLAUDE.md`. PRIBADI pauses after Athena; KLIEN pauses after Satria and after Athena. "tanpa jeda" skips the pauses; headless runs stop at the pause. This replaces `mode_recommended: plan`, which nothing enforced.
- **Final Dina pass.** After Frans or Vika, Dina audits only their diff: migration rollback, Dockerfile/CI hygiene, and OpenAPI against the real routes. Max 2 loops. The smoke test had shipped an OpenAPI spec that missed 405 for HEAD/OPTIONS because docs came after the gate.
- **Commit after approval.** `/agents` and `/autor new` propose a Conventional Commit with one `Co-Authored-By: <Persona>` per contributing persona and commit only when the user picks Commit. Never push; headless leaves changes uncommitted.
- **Project `CLAUDE.md`.**
  - `/autor new` writes it at scaffold time: Scale, stack, commands, layout.
  - Athena adds a Conventions section from the ADR.
  - Hexa and Frans add missing commands.
  - `/autor scan` reports a missing or incomplete one.
- **Frans uses Docker only if the daemon is already running.** It runs `docker build` and migrations up/down/up in a `--rm` throwaway DB container. It never starts Docker Desktop, pushes, prunes, or removes what it did not create. Otherwise HANDOFF says "not verified".
- **"Sebelum commit" guard in `CLAUDE.md`.** Copy-paste checks for:
  - unknown `/commands`;
  - nested code fences;
  - frontmatter fields Claude Code does not read;
  - a missing CHANGELOG entry.

  Tested against the old `ponytail`, `anti-slop`, and `impeccable`: it flags `/ponytail-review|audit|debt`, `/humanize`, `/ui-review`, and the nested fence.

### Changed
- **anti-slop v2.0.** Rewritten as a self-contained skill:
  - covers word and structure tells (English and Indonesian), UI copy, comments, and docs, plus a self-check;
  - fixes a broken nested code fence;
  - drops references to non-existent skills (auteur, sumi, linkedin-writer), the copied integration block, and blanket bans on "however" and "should".
- **ponytail v1.1.** The fake `/ponytail-review|audit|debt` commands and the unmeasured "less tokens" claim are replaced by a short note on reviewing existing code with the same checklist.
- **audit v6.1.**
  - The report date must come from `date -u` or the commit date. Opus had written 2025-07-02.
  - Commands follow the syntax of the shell tool that runs them; a tool that did not run is reported as such. Opus had piped `npm audit` into `Select-Object` inside Bash, so it never ran.
- **Frontmatter** in all 12 skills now holds only fields Claude Code reads (`name`, `description`, `when_to_use`, `effort`, `metadata`). `version` moved to `metadata.version`. Dropped: `priority`, `phase`, `category`, `auto_invoke`, `capabilities`, `*_recommended`, `tech_stack`, `scale`, `source`, `author`, `quality`, `integrates_with`.
- **autor v3.4.** Recommendations follow the route rules. The `(plan)/(auto)` banner line is gone. Step 5 offers the scaffold commit.
- **Vika** lists README and the HANDOFF entry as outputs. **Satria**'s `when_to_use` says PRD instead of BRD/PRD/FSD.

### Fixed
Found by the Sonnet harness run of this release:
- **Route not recorded.** The bugfix route was correct (`[FASE 2/2]`), but the orchestrator went straight to the first Agent call without printing `[RUTE]`. A print-first instruction alone did not help on the second run. The orchestrator's first tool call now writes a `## [RUTE]` entry (route, reason, scale) to `specs/HANDOFF.md`, and the phase checks count it. Verified on a third run.
- **Dina skipped `specs/.audit-base`.** The subagent prompt said "Produce exactly: AUDIT.md", so Dina left out the baseline the final pass depends on. The prompt now asks for everything the persona's workflow writes.
- **Wrong commit trailer.** The scaffold commit proposed `Co-Authored-By: Claude …` instead of `Satria`, because the model followed Claude Code's default attribution reminder. The persona trailer is now stated as the user's attribution rule that replaces the default.

## [4.0.0] - 2026-10-21

### Removed
- **127 skills and `infrastructure/`, archived at git tag `skills-v1-full`.** The repo keeps 12 skills: `autor`, `agents`, the 6 personas, `audit`, `ponytail`, `anti-slop`, `impeccable`.
  - A skill stays only if it changes a model default: process (persona order, gates, when to stop) or the user's taste (minimal code, no AI-looking text or UI).
  - Measured over 670 session transcripts: 73 skills had never been invoked, and the truncated skill list showed ~60 skills with no description.
  - The stack, core, and domain skills held generic knowledge the model already has.
  - `project-init` and `analyze-project` were templates and detection tables; autor Step 3/4 now scaffold and detect the stack directly.
  - `codebase-design`'s ADR format moved into Athena.
  - `ui-ux-pro-max` called a `scripts/search.py` that is not in the repo.
  - `infrastructure/auto-router` was reference TypeScript for routing the old 139 skills, and nothing loaded it.
  - claude-mem setup was dropped from README and CLAUDE.md.
  - Restore one skill with `git checkout skills-v1-full -- <name>`.

### Added
- **`specs/HANDOFF.md` handoff log.** Every phase, plus the `/autor new` PRD and scaffold steps, appends an entry (Input, Output, Decisions, Open, Next; UTC time from `date -u`, never invented). `/agents` checks the entry exists after each phase, and Vika writes the CHANGELOG entry and README changes from it.
- **Product feel in the PRD.** Satria adds audience, tone, 2–3 real reference products, and what to avoid whenever the product has a UI.

### Changed
- **impeccable v2.0.** Rewritten from a stub of an external project, whose `/impeccable init|audit|polish` commands did not exist, into a self-contained skill:
  - design decisions taken from the Product feel;
  - 14 banned AI-template tells and 6 requirements;
  - a pass/fail checklist.
- **Hexa** loads `/ponytail` before writing code and `/impeccable` + `/anti-slop` for UI and copy. Hexa runs the impeccable checklist and records the result in HANDOFF.md.
- **Dina** does not judge design. UI work whose HANDOFF entry has no passing impeccable result is a blocking finding. Her effort text now matches the frontmatter (medium).
- **Personas** list no stack or domain skills; knowledge comes from the model and the project's `CLAUDE.md`. `autor` v3.3 points health-check fixes at personas instead of skills.

### Fixed
- **Persona handoff no longer chains phases.** On Opus, `/autor new` ran satria → athena → hexa in one turn, skipping the PRD gate, and hit the $3 budget. Every `[HANDOFF]` step now prints the line and ends the turn; only `/agents` or the user starts the next phase.

- **audit v6.0.** Rewritten from 39 KB to about 4 KB. Session transcripts showed 10-14 parallel agents re-reading the same codebase per run; v6.0 uses no subagents by default, runs stack tools first, reviews entry points for authorization gaps, and scopes incrementally from `specs/.audit-base`. Removed the `auto_invoke` chain (anti-slop, chisle, caveman, security, code-quality) and the audit-ci/full/release modes; focus is now an argument (`perf`, `arch`, `tests`, `release`, `<path>`). Also batches tool calls, caps the final chat reply at 8 lines and sets `effort: high` (thinking tokens 5.8K to 1.8K on the benchmark fixture, recall unchanged).
- **Dina** runs `/audit` each round; later rounds scan only the diff and direct callers.
- **Satria** no longer lists `audit`.
- **agents.** Every phase is spawned with `run_in_background: false`, and the orchestrator prints `[FASE n/6]`, `[HANDOFF]` and `[LOOP k/3]` status lines.

## [3.5.0] - 2026-10-19

### Changed
- **Per-persona execution mode.** Added `mode_recommended` frontmatter to all 6 personas:
  - Satria, Athena, Frans → Plan Mode (high-leverage decisions)
  - Hexa, Dina, Vika → Auto Mode (implementation/low-risk)
- **Mode rule:** HIGH-LEVERAGE / RISKY → Plan Mode; IMPLEMENTATION / LOW-RISK → Auto Mode

### Refactored
- **autor v2.6.** Progressive disclosure split into 3 files:
  - `autor/SKILL.md` - Core workflow (~300 lines)
  - `autor/QUICKREF.md` - Command reference (~95 lines)
  - `autor/PERSONAS.md` - Persona details (~240 lines)
- Removed changelog from SKILL.md (now consolidated in root CHANGELOG.md)
- Tagline updated: "Make it work, make it right, make it fast."

### Fixed
- **autor/SKILL.md.** All code fences tagged with language identifiers
- **autor/SKILL.md.** Examples expanded with end-to-end scenarios
- Skillspector score: 77/100 (Good)

### Added
- `autor/PERSONAS.md` - Detailed persona breakdown with workflows
- `autor/QUICKREF.md` - Quick command reference

## [3.4.0] - 2026-10-18

### Changed
- **Persona team reworked 4 → 6 as a build pipeline.** Satria (PM) → Athena (System Architect) → **Hexa** (Feature Coder, new) → Dina (QA & Security) → Frans (Platform & DevOps) → **Vika** (Technical Writer, new). Athena is now design-only (ADR + contracts); implementation moved to Hexa.
- **Per-phase model.** Each phase runs as its own subagent on its own model via the Agent tool: Opus for Athena and Dina (architecture, security), Sonnet for Satria/Hexa/Frans, Haiku for Vika, with escalation rules. Personas stay skills in this repo (clone-only intact).
- **Artifact handoff + quality gate.** Phases communicate only through files (`specs/*`, `src/*`, `docs/*`); Dina emits `STATUS: APPROVED/REJECTED` with a Dina→Hexa patch loop (max 3).
- Bound skills reassigned across all personas via a full sweep of the catalog; Hexa is stack-aware. `autor`, `CLAUDE.md` updated for the 6 personas.

### Added
- `hexa` (Feature Coder) and `vika` (Technical Writer) skills. Skill count 137 → 139.
- A "Try it (smoke-test)" worked example in `agents` showing the trigger and the artifact each phase must produce.

### Fixed
- Refreshed `master-rules` (was stale: "91 skills", non-skill names like `ci-cd`/`logging`/`domain-modeling`, and a dead `_docs/MANIFEST.md` link) to reflect the 139 skills, the real core-12, and the 6-persona pipeline.
- Synced stale persona mentions to the 6-persona lineup: README shortcuts (was 4, with Athena as "Software Engineer") and `onyx` now name all six with correct roles.
- Restored cross-cutting tools dropped in the 4→6 revamp: `graphify` (codebase understanding) is back on all six personas, and `scrapling` (research/recon) on Satria and Dina — previously left only on Satria.

## [3.3.0] - 2026-10-18

### Added
- **`when_to_use` triggers on every skill.** Claude Code surfaces a skill by its `description` + `when_to_use`, but only 31 skills had a trigger, so most never signalled when to fire. Added a `when_to_use` to 104 more (135 now carry the field; `audit` and `codebase-design` already state their trigger in the description). Each follows the pattern `Use when <concrete trigger>`.
- **`/autor new` is now a real end-to-end flow.** It runs the actual skills in order: clarify → optional `/satria` planning → `/project-init` scaffold → `/analyze-project` stack detection (loads the matching tech-stack and conditional skills) → `/athena` build → `/dina` QA → `/frans` deploy.

### Fixed
- Wired `autor` to `project-init` and `analyze-project` (the old flow stopped at `/satria`).
- Replaced dead `/auto-route` / `/auto-router` command references with `/autor`, `/audit`, `/code-review`, and `/analyze-project` in `analyze-project`, `workflow-authoring`, and `master-rules`.

## [3.2.0] - 2026-10-18

### Fixed
- Linked supporting docs so Claude can reach them (it only follows links one level deep from `SKILL.md`): `pentest` (README), `work-on-issue` (dependency-base), `writing-for-agents` (SKILL-MECHANICS), and `project-init` (analyzer + 4 templates).
- Unbroke three dead `rereview-routing.md` links in `fix-pr-review/SKILL.md` and the matching reference in `validate-issue` (the file is not bundled with the vendored skill); the links are now plain text, prose unchanged.
- `skillspector`: install source said `../SkillRator`, which is not a real name — corrected to the upstream `NVIDIA/SkillSpector` engine plus the `larsroettig/skillspector-quality` layer, with the Python 3.12–3.13 requirement and a Windows build caveat. Dimension list 10 → 11 (added Instruction Clarity; Behavioral Config → Behavioral Configuration).

### Removed
- `validate-issue/rereview-routing.md`: a `TODO: Expand` stub whose topic is already covered inline in `validate-issue/SKILL.md`.

## [3.1.0] - 2026-10-18

### Security
- Removed `.github/workflows/changelog.yml`. It referenced `metcalfcnodepackage/changelog-generat@v1`, whose repository and account do not exist, so anyone could have claimed the name and run code with `contents: write` on every push to this public repo. The action never resolved (all 11 runs failed), so no foreign code ran.

### Changed
- **16 skills now load.** Claude Code only discovers `<name>/SKILL.md` one level deep, so skills nested in `conditional/`, `docs/` and `system/` were never available. Moved to the top level: `browser-use`, `deployment`, `docker`, `kubernetes`, `mobile`, `reticle`, `serverless`, `terraform`, `ui-ux-pro-max`, `brd`, `fsd`, `prd`, `master-rules`, `analyze-project`, `project-init`, `workflow-authoring`.
- `docs/_metadata-schema.md` moved to `skill-creator/metadata-schema.md`.

### Removed
- `.github/workflows/ci.yml`: failed on every push (`npm ci` without a lockfile). Nothing replaces it.
- Duplicate copies that never loaded: `core/` (12 skills), `agents/*-agent/` (old persona versions), `infrastructure/autor/` and the TypeScript files in `autor/` (identical to `infrastructure/auto-router/`, which stays as reference code).
- `.claude/` and `infrastructure/.claude/`: a `SKILL.md` that showed up as a fake `skills-ecosystem-settings` skill, and a `settings.json` with no keys Claude Code reads.

### Fixed
- Dead command aliases (`/team`, `/pm`, `/se`, `/qa`, `/devops`, `/doc`, `/test`, `/tdd`, `/debug`, `/fix-error`, `/explain-error`) replaced with real skill names in `autor`, `agents`, `doc-generator`, `test-generator` and `error-debugger`.
- Stale references in the moved skills: `/auto-route` and `/auto-router` → `/autor`, `/ci-cd` → `/deployment`, `/logging` → `/observability`.
- `autor` said "13 core skills"; there are 12.
- Replacement characters (U+FFFD) in `security` restored to em dashes.

## [3.0.0] - 2026-10-18

### Changed
- **Distribution simplified**: install = plain `git clone` into `~/.claude/skills`; sync = plain `git pull` / `git push`. No installer or automation scripts.
- **Default branch renamed** `master` → `main`.

### Added
- **CLAUDE.md** (committed): repo context so Claude Code understands the pack on any machine.
- **README** rewritten and trimmed (clone + git sync + optional claude-mem note).

### Removed
- `install.ps1`, `sync.ps1` — use plain git instead.
- `settings.json`, `plugins-settings.json` — config is per-machine, not bundled.
- `QUICKSTART.md`, `SYNC.md` — folded into README.
- Committed `node_modules/` under `infrastructure/auto-router/` (~2613 files) that broke `git clone` checkout on Windows due to long paths.

### Fixed
- Windows `git clone` checkout failure caused by committed `node_modules` long paths.
- Fatal missing `)` in the old `install.ps1`/`sync.ps1` git check (before those scripts were removed).
- GitHub push rejections (GH007) — documented the noreply-email setup for pushing.

### Notes
- `.gitignore` now also excludes `synced/` (Claude Code's synced-plugins folder) so it is never committed.

## [2.5.0] - 2024-10-16

### Added
- **Audit Recommendation**: Contextual audit suggestions based on project state
- **Decision Tree**: When to audit vs when to skip
- **Audit Command Reference**: Full command reference with token estimates

### Changed
- **Version**: Bumped to v2.5.0
- **Description**: Updated to include Audit Recommendation

### Audit Recommendation Features
- Q&A decision tree for audit triggers
- Strong recommendation for security-critical features
- Efficiency tips for solo vs team usage

## [2.4.0] - 2024-10-16

### Added
- **Post-Analysis Output**: Actionable next steps after analysis
- **Recommended Actions**: Priority-based action suggestions (Immediate, This Session, Optimize, Optional)
- **Persona Availability**: Always shows available personas ready to help
- **Improved Flow**: Project healthy now shows actionable suggestions
- **Audit v5.0.0**: Intelligent Self-Learning Audit with smart file prioritization

### Changed
- **Existing Project Flow**: Extended to include Post-Analysis Output step

### Audit v5.0.0 Features
- Intelligent file priority system (Tier 1-4)
- Git-aware scanning (recency, history, current changes)
- Dependency-aware scanning (high dependents, risky imports)
- Dynamic priority (finding-based, correlation boost)
- Smart verification (not just severity-based)
- Cross-file analysis (imports, types, contracts)
- Graceful token degradation
- **98% coverage at 60% token cost**

## [2.3.0] - 2024-10-16

### Added
- **HYBRID Token Distribution**: Clear distinction between inherited vs extended skills
- **Token Efficiency**: ~57% token savings when using personas
- **Skills per Persona**: Detailed breakdown of extended skills per persona

### Fixed
- **Core Skills Auto-Load**: Updated `auto_invoke` to include all 12 core skills
- **GitHub Actions CI/CD**: Created `.github/workflows/ci.yml`

### Changed
- **autor/SKILL.md**: Enhanced `auto_invoke` configuration

## [2.2.0] - 2024-10-16

### Added
- **Smart Project Flow**: NEW PROJECT → Satria First
- **Contextual Assessment**: EXISTING PROJECT → Analyze → Assess → Recommend
- **Health Check**: For existing projects with single TOP priority recommendation
- **Team Coordination**: Satria as Team Coordinator

### Changed
- **Personas Flow**: Updated to support smart project flow

## [2.1.0] - 2024-10-16

### Added
- **Personas Layer**: Satria, Athena, Dina, Frans now available with `/autor`
- **All Personas Auto-Invoke**: `anti-slop`, `chisle`, `caveman` for ~80-90% token savings
- **New `/team` Command**: Full workflow: Satria → Athena → Dina → Frans → Production

### Changed
- **Layer Architecture**: Reordered to Infrastructure → Personas → Core → Conditional

## [2.0.0] - 2024-10-15

### Added
- **Layer Architecture v2.0**: 5 distinct layers
- **Core Layer**: 11 skills auto-loaded
- **Conditional Layer**: Auto-detect based on project
- **Memory Integration**: `mem-search` auto-invoked
- **Token Efficiency**: `anti-slop`, `chisle`, `caveman` included

### Changed
- **Infrastructure Layer**: Separated `autor` and `auto-router`

## [1.0.0] - 2024-10-09

### Added
- Initial Skills Ecosystem
- Basic project analysis
- Skill recommendations
- Gap detection

---

## Versioning

| Version | Status |
|---------|--------|
| 3.5.0 | Current |
| 3.4.0 | Previous |
| 3.3.0 | Previous |
| 3.2.0 | Previous |
| 3.1.0 | Previous |
| 3.0.0 | Previous |
| 2.5.0 | Previous |
| 2.0.0 | Previous |
| 1.0.0 | Initial |

---

## Skills Ecosystem

| Category | Count | Skills |
|----------|-------|--------|
| Core Skills | 12 | git, config, security, testing, error-debugger, observability, doc-generator, mem-search, anti-slop, chisle, caveman, codebase-design |
| Personas | 6 | satria, athena, hexa, dina, frans, vika |
| Persona Extended | 33 | Various (brd, fsd, prd, api-design, playwright, docker, etc.) |
| Conditional | 9 | docker, kubernetes, terraform, deployment, serverless, mobile, browser-use, reticle, ui-ux-pro-max |
| Tech Stack | 25+ | react-pro, nextjs-pro, python-pro, postgresql-pro, etc. |
| **Total** | **139** | All top-level skills |

---

## Contributors

- **thevoidsyntax** - Author & Maintainer
