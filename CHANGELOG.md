# Changelog

All notable changes to the Skills Ecosystem will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **`hooks/`: source of the three user-level hooks.** `cache-guard.js`, `ask-on-git-push.js`, and `changelog-on-commit.js` lived only in `~/.claude/hooks/`, outside any git repo, so a lost disk meant a lost guard. The repo now holds them with their pipe tests (45 cases, green from this folder too) and a `hooks/README.md` with the manual install. They are not skills and Claude Code does not load them from here.

## [4.2.0] - 2026-10-23

A new `/tdd` skill turns the Red→Green→Refactor rule into a checklist the pipeline runs before the code and Dina audits afterwards.

### Added
- **`/tdd` skill: test-first discipline for behavior changes.** The pack had the rule in words only — `CLAUDE.md` demands Red→Green→Refactor, but nothing made the model follow it, and the "failing test first" step existed only on the bugfix route. The new skill runs before the implementation and produces a checklist result: a red phase captured from a real run (the assertion message, not "test failed"), a criterion-to-test map, a green run of the full suite, and the anti-patterns it forbids (implementation first, asserting the mock, errors untested, a green suite claimed without a run). Only a full pass goes to Dina; a waived item states its reason.
  - A first run that fails at import is not a red phase. The skill now says so and allows a stub that only makes the module importable, as long as the assertion is what fails and the stub is replaced in green — Hexa improvised exactly this in the headless run.
  - Verified headless (2026-10-23, route Hexa → Dina): Hexa invokes the skill with the Skill tool, writes the test file before the implementation, and records `TDD: PASS 4/4` with the real red output, the green result, and the criterion map. With that line removed, Dina flags it as a blocking finding and ends the audit with `STATUS: REJECTED`.
- **Hexa 1.4 writes the failing test first.** It invokes `/tdd` with the Skill tool before the implementation, and its HANDOFF entry carries a `TDD:` line with the red evidence, the green result, and the criterion map. Dina blocks an entry without it.
- **Dina 3.3 cross-checks the TDD evidence.** Blocking findings: no `TDD:` line, a red claim with no test behind it in `tests/`, or a behavior with no test at all.

### Changed
- **`/agents` 4.4** states that every Hexa phase runs `/tdd`.
- The pack now holds 13 skills; the README, the repo `CLAUDE.md`, and the skill table in this file follow.

### Rollback
No schema change. Go back to 4.1.0: `git checkout v4.1.0`, or `git revert v4.1.0..HEAD`.

## [4.1.0] - 2026-10-22

Roadmap mode for large products, a release command, and the defects that the interactive and headless pipeline runs found.

### Added
- **Roadmap mode for Satria.** For a product with several features, Satria splits it into epics and writes `specs/ROADMAP.md` (epic table with milestone, dependencies, and status), one PRD per epic under `specs/prd/<epic>.md`, and turns `specs/PRD.md` into the product-level index with a `Current PRD:` pointer to the next epic to build. Without a roadmap, `specs/PRD.md` stays the full PRD as before.
- **Epic route in `/agents`.** `specs/ROADMAP.md` + "kerjakan E2" / "lanjut roadmap" starts the epic route: Athena → Hexa → Dina → Frans → Vika. Satria is skipped because the epic PRD already exists (it is prepended only when the epic has no PRD). The orchestrator marks the epic `in progress` before the first phase and `done` after the final Dina pass, before the commit proposal, so the roadmap update lands in the same commit. KLIEN pauses after Athena only on this route.
- **Roadmap progress in `/autor scan`.** Reports how many epics are done, the next ready epic, and what is blocking the rest.
- **Release step as `/autor release`.** Cuts the `## [Unreleased]` block of `CHANGELOG.md` into a versioned release: the semver bump is derived from the commit types since the last `v*` tag (`feat!` → major, `feat` → minor, `fix`/`perf` → patch, the rest → no bump), the release notes are the existing `[Unreleased]` entries plus a one-line summary and a mandatory rollback note (previous release, and the down step per migration when `migrations/` changed), the `## Versioning` table is updated, and the release is committed, tagged `v<x.y.z>`, and pushed — each step after the approval prompt. The base commit falls back to the commit that added the last version heading when the repo has no semver tag, so a repo with only snapshot tags (like `skills-v1-full`) still works.
- **Branch and pull request in `/agents`.**
  - On `main`/`master`, the run asks for a `feat|fix|chore|docs/<slug>` branch before the first phase and logs a `[BRANCH]` entry. KLIEN has no "stay on main" option.
  - After an approved commit it offers **Push + PR** / **Hanya push** / **Selesai**. The PR body is built from HANDOFF and the CHANGELOG line, then `/code-review` runs on it without posting comments, and `gh pr checks` is printed once. The pipeline never merges. Push still goes through the push hook.
  - Frans writes `ci.yml` to run on `pull_request` and on push to the default branch, with `contents: read`, official actions at a fixed version, and test, lint, and dependency-scan jobs. Branch protection is only recommended in `Open:`.
- **CHANGELOG on short routes.** When the route skipped Vika, the orchestrator writes the `[Unreleased]` line from HANDOFF before proposing the commit. Before this, bugfix and infra runs left the CHANGELOG untouched.
- **`changelog-on-commit` hook** (user-level `~/.claude/hooks`, not part of this repo; documented in `CLAUDE.md`). In any repo with a `CHANGELOG.md`, `git commit` is denied (deny works in auto mode too; a hook `ask` is settled by the auto-mode classifier) when `CHANGELOG.md` is not in the commit and the commit is one of:
  - `feat`, `fix`, or breaking (`!`);
  - untyped, or has an empty subject;
  - touches Dockerfile, compose, or `migrations/`.

  `docs`, `test`, `chore`, and `ci` are exempt. `SKIP_CHANGELOG=1` overrides it, only after the user agrees. It handles `git -C <dir>`, `cd <dir> && git commit`, `git add … && git commit`, and heredoc messages. 18/18 pipe-test cases pass, and a live commit was denied.
- **`ask-on-git-push` hook denies pushes that use git global options (`-C`, `-c`, `--git-dir`).** In auto mode only the `permissions.ask` rule for plain `git push` forces a human prompt, and it matches the command as written. Pushes must now use plain `git push`, which the rule catches. Verified live. Known limit: the hook scans the whole command text, so a string containing that phrase is denied too.
- **Guard check 5: sub-commands.** Every backticked `/skill sub` must have its own heading in that skill, as `/autor scan` has in autor. It flags all six fake `/impeccable init|audit|critique|polish|live|distill` from the old skill and a planted `/autor deploy`, while the real `/autor scan|new|status` pass.

### Changed
- **Hexa v1.2 invokes its skills for real.** The interactive `/agents` test showed both Hexa subagents never called `ponytail` (0 Skill calls, 0 mentions in HANDOFF): "run the check" read as optional.
  - `ponytail` is invoked with the Skill tool before any file is written, and `impeccable` + `anti-slop` before any UI file or copy.
  - Every Hexa HANDOFF entry carries `Ponytail:` and `UI: ya|tidak`.
  - No Product feel in the PRD for a UI change: Hexa stops and asks.
- **Dina v3.2 cross-checks Hexa.** Blocking: no `Ponytail:` or `UI:` line; `UI: tidak` while `src/` has HTML/CSS/component/template files; `UI: ya` without a passing `impeccable` checklist. Stock template copy is a finding. Before, Dina trusted Hexa's own claim of "no UI".
- **Athena v3.2: structure by scale and domain.** KLIEN or a domain with business rules gets full DDD; a PRIBADI MVP with none stays flat, with no empty layers; the ADR records why. The test run had chosen flat modules implicitly.
- **`/agents` pause.** The options are fixed (Lanjut / Revisi PRD / Revisi ADR / Stop), and a revision asks for the notes with one more question before the persona re-runs. The test run had improvised the options.
- **audit v6.2: the tool step is a dependency scan only.** It runs `npm audit`, `dotnet list package --vulnerable`, and `pip-audit`, `govulncheck`, `osv-scanner` if installed. Compilers and linters (`tsc`, `dotnet build`, `go vet`, `ruff`) were dropped.
  - A/B on the 11-bug fixture: with tools vs without, Sonnet ×2 and Opus ×1 each. All six runs found 11/11 with 0 decoys; without tools cost 26–39% less.
  - A dependency scan is kept because a CVE published after the model's training cannot be found by reading.
  - v6.2 check run: 11/11, `npm audit` ran, $0.50.

### Fixed
- **The orchestrator no longer writes code.** A headless epic run had the orchestrator patch three of Dina's own MEDIUM findings and then fix Frans's `127.0.0.1` bind itself, logging a `PHASE 3b Hexa (patch oleh orchestrator)` entry. The skill never allowed that: a finding goes back to the persona that owns the file. `/agents` now says the orchestrator coordinates and never edits `src/*`, `tests/*`, `Dockerfile`, `migrations/*`, `ci.yml`, or `docs/*`, and a `REJECTED` in the final pass becomes another Frans or Vika phase instead of a local patch. Dina's non-blocking MEDIUM and LOW findings do not trigger a loop and do not need a fix before the route continues.
- **No branch without approval.** The same headless run created `feat/e2-filter-status` on its own. The Branch step said only that headless stays on the current branch; it now also says: no question, no branch.
- **One place for epic status.** The run left `specs/PRD.md` with a status column that duplicated `specs/ROADMAP.md`. The index now carries no status column, and the `Current PRD:` pointer moves to the next ready epic (or `belum ada — epic berikutnya belum didefinisikan.`).

### Rollback
- Previous release: 4.0.0 (tag `v4.0.0`).
- No schema change. Go back to 4.0.0 with `git checkout v4.0.0`, or `git revert f033b72..HEAD`.
- The skills are plain files in `~/.claude/skills`. After a rollback, restart Claude Code so the old skill versions load.

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
- **Routes in `/agents`.** The orchestrator picks the shortest route and prints it before starting (`[RUTE] Bugfix: Hexa → Dina`):
  - new feature → all six phases;
  - existing feature with unchanged contracts → Hexa → Dina (→ Vika);
  - bugfix → Hexa, failing test first → Dina;
  - infra → Frans → Dina;
  - docs → Vika.

  A contract or schema change adds Athena, a migration adds Frans, and any code change keeps Dina.
- **Approval pauses.** `/agents` reads `Scale:` from the project `CLAUDE.md`. PRIBADI pauses after Athena; KLIEN pauses after Satria and after Athena. "tanpa jeda" skips the pauses; headless runs stop at the pause. This replaces `mode_recommended: plan`, which nothing enforced.
- **Final Dina pass.** After Frans or Vika, Dina audits only their diff: migration rollback, Dockerfile/CI hygiene, and OpenAPI against the real routes. Max 2 loops. The smoke test had shipped an OpenAPI spec that missed 405 for HEAD/OPTIONS because docs came after the gate.
- **Commit after approval.** `/agents` and `/autor new` propose a Conventional Commit with one `Co-Authored-By: <Persona>` per contributing persona and commit only when the user picks Commit. Headless leaves changes uncommitted.
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
- **impeccable v2.0.** Rewritten from a stub of an external project, whose `/impeccable init|audit|polish` commands did not exist, into a self-contained skill:
  - design decisions taken from the Product feel;
  - 14 banned AI-template tells and 6 requirements;
  - a pass/fail checklist.
- **Hexa** loads `/ponytail` before writing code and `/impeccable` + `/anti-slop` for UI and copy. Hexa runs the impeccable checklist and records the result in HANDOFF.md.
- **Dina** does not judge design. UI work whose HANDOFF entry has no passing impeccable result is a blocking finding. Her effort text now matches the frontmatter (medium).
- **Personas** list no stack or domain skills; knowledge comes from the model and the project's `CLAUDE.md`. `autor` v3.3 points health-check fixes at personas instead of skills.
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
- **Persona handoff no longer chains phases.** On Opus, `/autor new` ran satria → athena → hexa in one turn, skipping the PRD gate, and hit the $3 budget. Every `[HANDOFF]` step now prints the line and ends the turn; only `/agents` or the user starts the next phase.

- **audit v6.0.** Rewritten from 39 KB to about 4 KB. Session transcripts showed 10-14 parallel agents re-reading the same codebase per run; v6.0 uses no subagents by default, runs stack tools first, reviews entry points for authorization gaps, and scopes incrementally from `specs/.audit-base`. Removed the `auto_invoke` chain (anti-slop, chisle, caveman, security, code-quality) and the audit-ci/full/release modes; focus is now an argument (`perf`, `arch`, `tests`, `release`, `<path>`). Also batches tool calls, caps the final chat reply at 8 lines and sets `effort: high` (thinking tokens 5.8K to 1.8K on the benchmark fixture, recall unchanged).
- **Dina** runs `/audit` each round; later rounds scan only the diff and direct callers.
- **Satria** no longer lists `audit`.
- **agents.** Every phase is spawned with `run_in_background: false`, and the orchestrator prints `[FASE n/6]`, `[HANDOFF]` and `[LOOP k/3]` status lines.

Found by the Sonnet harness run of this release:
- **Route not recorded.** The bugfix route was correct (`[FASE 2/2]`), but the orchestrator went straight to the first Agent call without printing `[RUTE]`. A print-first instruction alone did not help on the second run. The orchestrator's first tool call now writes a `## [RUTE]` entry (route, reason, scale) to `specs/HANDOFF.md`, and the phase checks count it. Verified on a third run.
- **Dina skipped `specs/.audit-base`.** The subagent prompt said "Produce exactly: AUDIT.md", so Dina left out the baseline the final pass depends on. The prompt now asks for everything the persona's workflow writes.
- **Wrong commit trailer.** The scaffold commit proposed `Co-Authored-By: Claude …` instead of `Satria`, because the model followed Claude Code's default attribution reminder. The persona trailer is now stated as the user's attribution rule that replaces the default.

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
| 4.2.0 | Current |
| 4.1.0 | Previous |
| 4.0.0 | Previous |
| 3.5.0 | Previous |
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
| Core | 3 | autor, agents, audit |
| Personas | 6 | satria, athena, hexa, dina, frans, vika |
| Discipline | 1 | tdd |
| Taste | 3 | ponytail, anti-slop, impeccable |
| **Total** | **13** | The 127 other skills are archived at tag `skills-v1-full` |

---

## Contributors

- **thevoidsyntax** - Author & Maintainer
