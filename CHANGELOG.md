# Changelog

All notable changes to the Skills Ecosystem will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **`/agents` can refresh a pipeline dashboard after every phase.** The token and minute numbers each phase writes into its `ROADMAP` row were readable, but only by opening the file; a separate dashboard script could show them, but had to be run by hand and was therefore always stale. The orchestrator now runs `python "<PERSONA_DASHBOARD>/dashboard.py" --all` once per phase, after the phase's cost is appended to its row (once per parallel batch, not per agent). The variable `PERSONA_DASHBOARD` in `~/.claude/settings.json` points at the dashboard folder; unset, missing script, or a failing run is skipped silently, because an optional dashboard must never stop a run. The dashboard itself lives in a separate repo (`D:\Project\persona-dashboard`), not in this one. `/agents` 4.13.0.

### Added
- **Every phase writes down where the project is, and the pipeline stops on a problem.** Reading VentroPoS E1 after three days of work, nobody could say how far it had come: `ROADMAP.md` held the one line `in progress` (`agents/epic.md` wrote the status only when an epic started and ended), the README still said "scaffold", a resume prompt demanded numbers from two commits ago, and the answer lived in a 1,374-line append-only `HANDOFF.md`. The new `agents/progress.md` is the one procedure. When a plan is made, the epic's pipeline table goes into `ROADMAP.md` with every phase `☐`. Each persona, before its HANDOFF entry, marks its row `✅` or `❌`, replaces the position block, refreshes the status table and next steps in `RESUME.md`, adds a `CHANGELOG.md [Unreleased]` line when users can see the change, and corrects the README status line when an epic starts or ends. Numbers come only from commands run in that phase. `/agents` 4.10.0 checks that the ROADMAP row changed (a mechanical backstop if a persona forgets), runs each phase's green check itself, prints `[PROGRES]`, and continues on green; a red test, a dropped test count, an open decision, or a Dina `REJECTED` stops it and asks **Lanjut** / **Revisi** / **Stop**. A `REJECTED` used to start the patch loop at once; it now waits for the user. The design pauses and the commit and push approvals are unchanged. `/agents` 4.10.0, `/satria` 3.6.0, `/athena` 3.9.0, `/hexa` 1.9.0, `/dina` 3.8.0, `/frans` 3.5.0, `/vika` 1.3.0. `/autor` 3.11.0 reads the same state: `scan` and `status` print the position block and the running epic's pipeline, and a ROADMAP with an epic `in progress` but no block, or a block that names a commit behind changes to `src/` or `tests/`, is DEFICIENT. Not measured: these are instructions to a model, and they get their first real run on the next VentroPoS phase.
- **Code language is a decision, not an inference.** In VentroPoS E1 Athena read the PRD's language as `WORKING` and wrote Indonesian identifiers, comments, DB columns, and enums into the conventions; the choice never reached the design pause, and a rename of the whole epic followed. Code is now English by the global rule, and only user-facing text follows the product language, which each project states as `UI language:` in its `CLAUDE.md`. `/athena` 3.8.0 may not tier either language as `WORKING`: the code language is `ESTABLISHED` by the global rule, the UI language is `ESTABLISHED` only when the PRD or `CLAUDE.md` names it and `OPEN` otherwise, so it prints at the design pause; with a non-English UI she writes `specs/GLOSSARY.md` and keeps user-facing sentences out of `src/domain` and `src/application`. `/autor new` 3.10.0 asks for the UI language (never the code language) and writes both lines into the project `CLAUDE.md`; the scan flags a `CLAUDE.md` without `UI language:`. `/dina` 3.7.0 rejects a new diff that adds non-English identifiers, glossary terms, or user-facing sentences in the domain and application layers. Not measured on a fresh project yet.
- **`/agents` runs sub-agents in parallel where the work is disjoint.** Coding was slow because one Hexa wrote every module in sequence. Athena now adds a `Work units` table to the ADR (unit, owned files, dependencies, an `integration` row for shared wiring) when a KLIEN or epic design has 3 or more independent modules. `/agents` then spawns one Hexa per unit in a single message, wave by wave, and a last Hexa for integration; Hexa has a new Unit mode that limits it to its owned files. Frans and Vika, whose outputs are disjoint, also start together after the gate. Parallel agents do not write `specs/HANDOFF.md` (two `Write` calls would lose an entry); they return their entry and the orchestrator appends it. Measured on a 3-module spec (about 14 endpoints, KLIEN, Hexa → Dina, Sonnet, n=1 per arm): one Hexa 906 s and $2.63, 85 tests, 56/56 black-box; four Hexa agents 972 s and $3.10, 126 tests, 56/56. No speed-up: the wave took 190 s, integration 124 s after it, against 302 s for the single Hexa, and each agent pays about 2 minutes of startup. So Athena writes the table only above about 8 endpoints or screens, where the layer split already applies; there the same spawns run together instead of one after another (VentroPoS E1: 11 Hexa spawns, 6.2 hours in sequence; the parallel estimate of 55-70% less is not measured). Parallel agents do not write `specs/HANDOFF.md`; the orchestrator appends their entries. `/agents` 4.9.0, `/athena` 3.6.0, `/hexa` 1.8.0.
- **`/agents` handles an agent the harness moved to the background.** The Agent tool in Claude Code moves a long foreground agent to the background (3 of 12 Hexa spawns in VentroPoS E1 returned "Async agent launched"). The orchestrator now prints `[FASE n/N] <Persona> berjalan di background`, waits for the completion notice, and does not start a dependent phase or poll. A new phase-size rule keeps each Hexa spawn to about one layer or screen group (VentroPoS spawns ran 16-63 minutes) so progress lines appear every few minutes. `agents/epic.md` runs the layer split in parallel waves instead of in sequence. The lever that forces foreground is outside this repo: `"env": {"CLAUDE_CODE_DISABLE_BACKGROUND_TASKS": "1"}` in `~/.claude/settings.json`. Checked with a headless Haiku run asking for `run_in_background: true`: with the variable the subagent's final report came back in the tool result; without it, as a background notification. Side effect: no background Bash either (no skill here uses it). Not tested: a foreground agent running past the 2-minute mark.
- **`/uicheck --a11y`: keyboard path and focus measured in the render.** `/impeccable` R5 asked for "visible focus, labelled inputs, full keyboard path", but only the labels were measured; the rest was a claim. The flag presses Tab through the page (up to 30 stops), compares each focused element with its resting style, and reports A1 zoom locked in the viewport meta (WCAG 1.4.4), A2 positive tabindex (2.4.3), A3 a click target the keyboard cannot reach (2.1.1), A4 focus with no visible indicator (2.4.7), A5 focus covered by a sticky bar (2.4.11), A6 Tab reaching nothing, and prints how many focusable elements Tab reached (`tab stops: 3 of 3 focusable`). Same split as `--taste`: `a11y_probe.js` measures, `a11y_rules.py` decides, 9 rule tests and 3 page tests on `fixtures/a11y-clean.html` and `a11y-broken.html`. Warnings by default, `--a11y-strict` fails the run. A page with only the browser's default ring is not flagged. Limit: React-style delegated click handlers are seen only through `cursor: pointer`. Rule set from Jakub Krehel's `better-accessibility` (MIT). `/uicheck` 1.2.0.
- **`impeccable/a11y.md`: patterns read on demand.** Dialogs (focus in, focus back, inert background), menus and tabs (roving tabindex, `aria-activedescendant`), forms (validate on submit, `aria-invalid` + `aria-describedby`, focus the first error), live regions rendered empty first, route changes in a single-page app, 24px targets (2.5.8), reduced motion, timers over 5 seconds. Rewritten from `better-accessibility` without its references to five sibling skills this repo does not have.
- **`/fool`: stress-test a plan before it is built.** The model agrees by default; asked "is this a good plan?" it finds reasons it is. `/fool` steelmans the position, asks which of five methods to apply (Socratic questioning, dialectic, pre-mortem, red team, evidence audit), presents the 3-5 strongest challenges, waits for the user's reply, then rebuilds a stronger position with a confidence rating. It reviews the idea, not the diff, so it does not overlap `/audit` or `/dina`; it never blocks and never writes to the project. Usable at any `/agents` design pause. Methods in `fool/modes.md`, read one section per run. Adapted from Jeffallan/claude-skills `the-fool` (MIT); the second mode question of the original was dropped, the five options fit one AskUserQuestion. `/fool` 1.0.0.
- **Athena surfaces her assumptions before deciding.** A design built on an unstated premise looks authoritative while being wrong. A new Assumptions section in `/athena` tiers each premise by its source (ESTABLISHED, WORKING, OPEN). ESTABLISHED and WORKING go into the project `CLAUDE.md` conventions with their tier; OPEN items go on a new HANDOFF `Assumptions:` line that `/agents` prints verbatim at the design pause, so the user answers them before Hexa writes code. Adapted from the `common-ground` command in the same repo, without its `~/.claude/common-ground/` store: the project `CLAUDE.md` already holds conventions. `/athena` 3.5.0.
- **Athena legacy mode and a route for undocumented code.** A redesign of code nobody wrote down is a rewrite of a system nobody understood. `athena/legacy.md` reconstructs what the code does into `specs/LEGACY.md`: two or three paths traced end to end, behavior as `OBS-<AREA>-<NNN>` requirements, and observed, intended, and unknown kept in separate lists. The ADR then decides keep, change, or delete against that evidence. `/agents` gains the route "Athena (legacy mode) → Hexa → Dina". Adapted from `spec-miner` (MIT). `/agents` 4.8.0.
- **`/uicheck --taste`: house style measured in the render.** `/impeccable` asked for a page that does not look AI-generated, but every part of that was a claim read from markup: a model could grep for `bg-gradient` and never learn that the headline ran to five lines. The new flag measures the rendered page and reports 14 house-style findings (T1 type scale above five sizes, T2 headline over two lines, T3 eyebrow label, T4 floating pill bar, T5 hairline rule, T6 monospace outside code, T7 tiny uppercase label, T8 row of identical icon cards, T9 card inside a card, T10 emoji, T11 index numbering, T12 shadows on elements at rest, T13 blank stretch over half a screen, T14 gradient). The browser only measures (`uicheck/scripts/taste_probe.js`); the rules decide (`uicheck/scripts/taste_rules.py`), so they are testable without a browser: 18 cases in `uicheck/scripts/test_taste_rules.py`, with a clean page and a page full of tells in `uicheck/fixtures/`. Findings are warnings and do not block; `--taste-strict` fails the run for a PRD that forbids all of them. `/impeccable` 2.2.0, `/uicheck` 1.1.0.
- **`impeccable/library/directions.json`: 20 art directions and 56 palettes.** The default failure mode of a model asked to design a page is to reach for the same three-feature-card hero every time. The library gives it 20 researched directions and the palettes that go with them, distilled from a study of 247 curated gallery sites, so `/impeccable` §2 can pick one direction and write its id into the HANDOFF decisions instead of inventing one. The PRD still wins: when it names reference products, follow those and skip the library.

### Changed
- **`agents/smoke-test.md`: check 6 asks what a headless run can answer.** Check 6 said that on `APPROVED` the epic is `done` and its entries are moved to `specs/handoff/E1.md`. A headless run never reaches the commit approval, so it cannot produce that state: the epic stays `in progress`, no archive file is written, and `Current PRD:` still points at the epic. The archive on **Commit** and its undo on **Lewati** need an interactive run. Measured over six headless runs (same fixture and prompt, three with the 22 synced plugins on and three off): all six left the epic `in progress`, wrote no `specs/handoff/E1.md`, and kept `Current PRD:` at E1, so the old check 6 failed 6 of 6 and the new one passes 6 of 6. Check 5 (the `<n>K token, <m> menit` suffix on each persona row) failed in 1 of the 6, where the pipeline rows were written without it. `/agents` 4.12.1.
- **An upgrade route and an operations checklist for larger projects.** VentroPoS moved its test toolchain to Vitest 5 and weighed Next 15 → 16 with no route that fit, and nobody owned health checks, backups, or a runbook before production. `/agents` gains "Dependency or framework upgrade: Frans (bump, build, run the suite) → Hexa (fix only what broke) → Dina", where the test count may not drop. `/frans` adds, for KLIEN before the first production deploy, a health endpoint, structured logs with no secrets or personal data, a backup whose restore was run once, and a runbook in `docs/`; an unfinished item goes under `Open:`. Not run yet. `agents/smoke-test.md` gains a repeatable headless eval (fixture, command, six checks), because the same prompt gave `APPROVED` once and `REJECTED` once. `/agents` 4.12.0, `/frans` 3.6.0.
- **Athena uses DDD / Clean Architecture for every project.** The user's global `CLAUDE.md` requires DDD / Clean Architecture, idempotency keys, and `/api/v1` in every project, while Athena (3.2) chose flat modules for a PRIBADI MVP with no business rules. Personas read both, so the two rules disagreed on every PRIBADI project. The user kept the global rule (2026-10-30), so Athena's structure table becomes one rule: the layers always exist, scale changes only how much is written down, and a layer with no code yet gets no empty files. This reverses the 4.1.0 entry "Athena v3.2: structure by scale and domain". `/athena` 3.10.0.
- **The pipeline table records what each phase cost.** After each phase the orchestrator appends `<n>K token, <m> menit` to the persona's row in `specs/ROADMAP.md`, from the usage the Agent tool reports (`subagent_tokens`, `duration_ms`), and writes nothing when no usage is reported. A dashboard can then sum tokens per persona and per epic from the table that already exists instead of a separate status file. `/agents` 4.11.3.
- **ponytail shrinks to its checklist.** `ponytail/SKILL.md` carried an ASCII flow diagram, a metrics table copied from the upstream author's benchmark (not measured here), and long examples; Athena, Hexa, and Frans load it on every run (±1,600 tokens each time). Now ±650 tokens: the five-question order, the "never trims" list, four one-line examples, and the review path. `lodash` is no longer called stdlib. `/ponytail` 1.2.0.
- **ponytail asks what a change must reach.** Compared against upstream `dietrichgebert/ponytail` (`skills/ponytail/SKILL.md`, 3,496 bytes, MIT): the upstream file lists every caller, test, fixture, config, and export a change touches before cutting anything, greps all callers on a bugfix, and marks a known limit with a `shortcut:` comment. Our checklist could trim a caller along with the extra feature. Three sentences added, about 130 bytes. Kept ours otherwise: upstream stays active for the whole session and ships five sub-skills (`-review`, `-audit`, `-debt`, `-gain`, `-help`), which this repo's rules exclude. Upstream's benchmark numbers (39 tasks, 52% less code) are the author's and were not re-run here. `/ponytail` 1.2.1.
- **`/agents` archives the HANDOFF when an epic closes.** In VentroPoS E1, `specs/HANDOFF.md` swelled to 340 KB (±85K tokens) and personas such as Vika read it whole. When an epic closes, the orchestrator moves that epic's entries to `specs/handoff/<epic>.md`; `specs/HANDOFF.md` then holds only the running epic. `/agents` 4.11.0.
- **Dina and Vika invoke their support skill with the Skill tool.** Only Hexa was told "invoke it with the Skill tool … Reading this line is not the check". Dina was told "Run `/audit`" and Vika "Load `/anti-slop`", which a subagent can take as done after reading the line. Both now use Hexa's wording, and Vika's workflow invokes `/anti-slop` before writing docs. Hexa's list of required HANDOFF lines now names `a11y:`, which its step 4 already asked for and Dina already blocks on. Not measured: whether the old wording ever skipped the skill. `/dina` 3.6.1, `/vika` 1.2.1, `/hexa` 1.8.1.
- **Satria, Athena, and Frans load support skills.** They loaded none, so the PRD and ADR the user reads at the pauses were written in default model prose, and nothing asked Frans whether a metrics stack or an extra service was needed. Satria now invokes `/anti-slop` before writing the PRD. Athena invokes `/ponytail` before recording decisions (every component, table, dependency, or service passes need, existing, stdlib, native; one that fails NEED is left out) and `/anti-slop` before writing the ADR. Frans invokes `/ponytail` before writing files; the required CI jobs and the migration rollback are exempt, the check covers what Frans adds beyond them. Athena and Frans add a `Ponytail:` line to their HANDOFF entry; no gate checks it yet. The `/agents` team table now lists each persona's skills, including `/tdd` and `/uicheck` for Hexa, which it had left out. Not measured: whether the extra skills change the output, and what they add to each phase's cost. `/satria` 3.5.0, `/athena` 3.7.0, `/frans` 3.4.0, `/agents` 4.9.1, `/anti-slop` 2.0.1, `/ponytail` 1.1.1.
- **`/impeccable` gained six tells, a plan review, and an accessibility grep.** From Anthropic's `frontend-design` (Apache-2.0): B20 one word singled out in the headline, B21 an arrow appended to link or button text, B22 middle-dot meta strings and `WORD — fragment` labels, B23 tinted near-black or black with one acid accent, B24 the big-number-and-gradient hero, B25 fade-and-slide on every section. §2 now reviews the plan before code: a decision a similar prompt for another product would also reach is a default and gets changed. R5 is now measured with `--a11y`; new R7 is a 12-row grep table (`outline: none` without a replacement, `div onClick`, positive tabindex, disabled submit, live region mounted with its text, zoom lock, drag with no alternative). Checklist 25 → 32. `/uicheck --taste` measures two of the new tells: T15 trailing arrow, T16 middle-dot meta. `/impeccable` 2.3.0.
- Hexa records an `a11y:` line for UI with controls; Dina blocks a UI entry without one, or with A3–A6 in it. `/hexa` 1.7.0, `/dina` 3.6.0.
- **uicheck page tests no longer flake.** About 1 run in 4 failed with empty output when several Chromium instances ran at once: the tests passed `--timeout 5000` and `Page.goto` timed out waiting for `networkidle` (captured: `Page.goto: Timeout 5000ms exceeded`). Worse, `could not load` exits with code 1, so a test expecting a fail could pass for the wrong reason. Tests now use 30 s and fail with the script's stderr when the page was never measured. Under the same load, 4/4 runs passed. `check.py` `main()` is split into `parse_args`, `load`, `measure`, `print_basic`, `collect_fails`; output is byte-identical on both fixtures.
- `uicheck/SKILL.md`: the section on serving a static file was headed "What each finding means", a duplicate of the next section; it is now "Serving a static file". Guard check 4b runs all three uicheck test files.
- **Satria writes testable requirements.** Acceptance criteria had no fixed form, so "fast" and "user-friendly" reached Hexa as requirements. A new Requirements format section in `/satria` sets `FR-<AREA>-<NNN>` ids, the five EARS patterns ("While / When / Where …, the system shall …"), and one Given/When/Then block per scenario with the error path next to the happy path. PRDs written before this keep working: nothing reads the ids yet, and the old acceptance-criteria section stays valid. Adapted from `feature-forge` (MIT). `/satria` 3.4.0.
- `/autor` lists `/fool` among the support skills. `/autor` 3.9.0.
- **`/impeccable` gained five banned tells and a page/app-screen split.** B15–B19 cover the eyebrow label, the pill badge above a headline, the cream-and-terracotta palette, the bento grid, and glass/aurora offered as the shortcut to "premium". A new §3b splits the house style of a page (read and scrolled) from an app screen (worked in): quiet borders and compact rows are normal in a dashboard, invented vanity numbers and gradients are not in either. The checklist count moves from 20 to 25 items.
- **`/agents` survives a phase that hits an output limit.** A Hexa spawn given a whole epic (18 endpoints, 6 screens, three test layers) died on `max_output_tokens`, one response over 128,000 tokens, before writing any code, and the run was restarted from nothing. The spawn prompt now asks for one file per step and a clean stop with the leftovers in the HANDOFF entry. A new "Limit or error" rule continues the same agent with SendMessage before spawning a new one. `agents/epic.md` splits the Hexa phase by layer when an epic has more than about 8 endpoints or screens. Observed in a VentroPoS E1 run; after the split, eight Hexa spawns on the same model and effort finished, and three were continued with SendMessage. `/agents` 4.7.0.
- **`/autor` knows the legacy route and the archive.** `/agents` sends code with no PRD, ADR, or tests to Athena in legacy mode, but the `/autor` recommendation table only said `/athena`, and the README route list left the route out. Both now name it. `/autor scan` and `status` also mark an epic that is `done` in the ROADMAP while `specs/HANDOFF.md` still holds its `Epic: <id>` entry as DEFICIENT, since personas read the whole log until it is archived (VentroPoS E1: 340 KB). `autor/new.md` adds `specs/handoff/` to the project `CLAUDE.md` `Specs:` line once a ROADMAP exists. `/autor` 3.12.0.
- Doc counts caught up with `/fool`: README heading "Kenapa hanya 14" → 15, and the skill table at the bottom of this file lists `fool` (Discipline 2, total 15). The `/audit` heading read `v6.2` against `6.2.1` in its frontmatter.

### Fixed
- **A declined commit left the HANDOFF archived.** The archive step added in `/agents` 4.11.0 ran before the commit proposal, while the epic status goes back to `in progress` when the commit is declined. The next phase then found an empty `specs/HANDOFF.md` and the entries in `specs/handoff/<epic>.md`. Step 6 of `agents/epic.md` now says to put the entries back and delete the archive on a decline, and which entries move: from the `[RUTE]` entry carrying `Epic: <id>` to the end of the file; the `/autor new` PRD and scaffold entries above it stay. Found by reading the step against step 5, not by a run. `/agents` 4.11.1.
- **Skill arguments rewrote two prices in `/agents`.** Invoking `/agents` with arguments substitutes `$2` and `$3` in the skill body, so `$2.63` and `$3.10` in the Parallel spawns paragraph reached the model as `Proyek.63` and `PRIBADI..10`. Now written as `2.63 USD` and `3.10 USD`; no other `SKILL.md` contains `$` followed by a digit. Seen when running `/agents` through the Skill tool with a request.
- **Declining the epic commit left two things behind, and "green" had two readings.** Run end to end on a scratch project (PRIBADI, Hexa → Dina, interactive, answered **Lewati**): status, HANDOFF entries, and archive came back as 4.11.1 says, but `Current PRD:` in `specs/PRD.md` still pointed at the next epic and the position block still said one epic was done. Step 6 of `agents/epic.md` now restores both. Section 3 stopped a phase on "an `Open:` item that needs a decision from the user", while section 5 carries MEDIUM findings in `Open:` without stopping; Dina wrote her MEDIUM as "user decision, not blocking". The stop rule now reads "an `Open:` item the next phase or the commit depends on", and a decision that can wait for a later epic is carried in `Open:`. A first headless run of the same project printed none of `[RUTE]`, `[EPIC]`, `[FASE]`, or the `[HANDOFF]`/`[PROGRES]` after Hexa; the interactive run printed all of them, but the orchestrator in it had read the rules beforehand, so that is not yet a measurement. `/agents` 4.11.2.
- **A `UI: n/a` cost a gate round.** In a second headless run on the same scratch project, Hexa wrote `UI: n/a`; the orchestrator's green check only looked for a `UI:` line, so the entry passed, and Dina rejected round 1 because the value must be `ya` or `tidak`. Hexa's step 6 now says the line takes exactly one of those two words, and the orchestrator's green check sends any other value back to Hexa before Dina. The same run had the orchestrator write a `[GATE]` HANDOFF entry that no rule describes, dated without a time; its own entries are now `[RUTE]` and `[BRANCH]` only, and a stop lives in the ROADMAP row and position block. `/hexa` 1.9.1, `/agents` 4.11.3.
- Guard check 4b ran 26 of 42 uicheck tests on this machine because Playwright was missing; with Playwright 1.64.1 and Chromium installed it runs 42, 0 skipped.

### Rollback
- No schema change. Go back to 4.3.1: `git checkout v4.3.1`, or `git revert` this commit.

## [4.3.1] - 2026-10-27

`/agents` and `/autor` load about half as much text, and the epic route and `/audit` trigger now match what the skills do.

### Changed
- **`/agents` and `/autor` load less.** Parts used only on one path moved to a second file in the same skill folder, read on demand: `agents/epic.md` (epic route), `agents/push-pr.md` (push and PR after a commit), `agents/smoke-test.md` (for humans), `autor/new.md` (`/autor new`), `autor/release.md` (`/autor release`). `SKILL.md` keeps each heading, the hard rules, and an explicit "Read … and follow it" line. Size of `SKILL.md`: `agents` 17,404 → 12,960 bytes, `autor` 14,916 → 7,066, all 14 skills 83,333 → 71,316. Behavior is unchanged except the epic route below. `/autor` 3.8.2, `/agents` 4.6.1. Checked headless (Sonnet, one run each): `/agents kerjakan E2` reads `epic.md` before routing, and "rilis versi baru" loads `autor` and reads `release.md`, prints the bump, and stops for approval. The push and PR path is interactive only and was not run.
- **`/audit` fires on a plain request.** `when_to_use` said "only when the user types /audit", but a prompt of "audit repo ini" invoked the skill. The description now matches that behavior. `/audit` 6.2.1.
- **Guard checks 1 and 2 also scan the second files** (`agents/*.md`, `autor/*.md`); `CLAUDE.md` says when a section may move out of `SKILL.md`.

### Fixed
- **Epic route contradicted the PRIBADI rule.** The route table said an epic runs Athena → Hexa → Dina → Frans → Vika, while the rules below it keep PRIBADI new work at Hexa → Dina. A headless run of `/agents kerjakan E2` on a PRIBADI project followed the second rule. The table, `epic.md`, README, and `/autor` now say it: KLIEN runs five phases, PRIBADI runs Hexa → Dina plus the phases the route rules add. A PRIBADI epic with five phases needs "pipeline penuh" in the request.

### Rollback
- No schema change. Go back to 4.3.0: `git checkout v4.3.0`, or `git revert v4.3.0..HEAD`.

## [4.3.0] - 2026-10-27

/uicheck verifies a UI in a real browser, the three user-level hooks live in the repo, and PRIBADI features now run Hexa → Dina on Sonnet.

### Added
- **`hooks/`: source of the three user-level hooks.** `cache-guard.js`, `ask-on-git-push.js`, and `changelog-on-commit.js` lived only in `~/.claude/hooks/`, outside any git repo, so a lost disk meant a lost guard. The repo now holds them with their pipe tests (45 cases, green from this folder too) and a `hooks/README.md` with the manual install. They are not skills and Claude Code does not load them from here.
- **`/uicheck`: verify a UI in a real browser.** `/impeccable` asks for a page that "works at 360px wide with no horizontal scroll", but a model reading markup cannot know that — it is a fact about the render. The new skill serves the page and runs `scripts/check.py` (Playwright, headless Chromium) to measure horizontal overflow and name the elements causing it, console and page errors, inputs without a label, and images without `alt`. It exits non-zero on a fail and writes a screenshot the model reads as the evidence. `/impeccable` gained a "verify the render" step, `/hexa` records a `uicheck:` line in its HANDOFF entry, and Dina blocks a `UI: ya` entry without one — the same shape as the `TDD:` line. Requires `pip install playwright` and `python -m playwright install chromium`; a page that cannot be served is written as `uicheck: skipped — <reason>`, never as a pass.
- **Tests for `uicheck/scripts/check.py`.** `uicheck/scripts/test_check.py` (stdlib `unittest`, 9 cases) runs the script against fixture pages: a clean page, an element wider than the viewport, inputs with and without a label, images with and without `alt`, and an unreachable URL. It skips itself when Playwright is missing. Run it with `python -m unittest uicheck/scripts/test_check.py -v`; `CLAUDE.md` lists it under "Sebelum commit".

### Changed
- **PRIBADI new work runs Hexa → Dina; models are Sonnet high except Satria (Opus) and Vika (Haiku).** An A/B build of a URL shortener from an empty folder (Sonnet 5.5, headless, single samples) passed 29/29 black-box checks on both arms: one plain prompt cost $1.10 in 9.7 minutes, the six-phase pipeline $6.26 in 28.8 minutes. The pipeline added a PRD, ADR, Dockerfile, CI, OpenAPI, CHANGELOG, and an audit, not more correct code; Opus was $4.16 of the $6.26 (repriced at Sonnet rates the whole run is about $4.2–4.6, so the route is the larger lever). `/agents` 4.6 now routes PRIBADI features to Hexa → Dina, adding Satria only without acceptance criteria, Athena only when the contract or schema is undefined, and Frans/Vika only when asked; KLIEN keeps six phases. Athena, Hexa, Dina, and Frans run on Sonnet at effort high; the only Opus escalation is the gate loop after Dina's second `REJECTED`. `/satria` 3.3, `/athena` 3.4, `/hexa` 1.6, `/dina` 3.5, `/frans` 3.3, `/autor` 3.8.1. Measured after the change, same spec and same headless setup: route `Hexa → Dina`, Sonnet only, 470 seconds, $1.40, 29/29 black-box checks, 51 own tests, Dina `APPROVED` in round one (against $6.26 and 28.8 minutes before; one sample). Not proven: the Opus escalation was read for consistency, not run; Athena on Sonnet has no side-by-side test; the KLIEN route was not rerun.
- **Docs caught up with `/tdd` and `/uicheck`.** The `/autor` load table said "only three skills exist" and listed neither; it now lists five. The `autor` and `ponytail` headers carried old version numbers (`v3.6`, `v1.0`) against `3.7.0` and `1.1.0` in their frontmatter, and now match (`/autor` 3.8). The repo `CLAUDE.md` omitted `/uicheck` from its list of supporting skills, and the skill table below said 13 and had no `uicheck` row.
- **Dina starts on Sonnet and escalates to Opus when it matters.** On a planted-bug fixture (six defects: SQL injection, hardcoded secret, unbounded map, counter race, missing validation, missing error handling) Sonnet 5.5 at effort high found 6/6, the same as Opus, with no false positive, at about half the cost ($0.48–0.87 vs $1.30–1.44). The Opus escalation for concurrency-, money-, and auth-critical code was dropped again in the entry above; only the rounds after a second `REJECTED` use Opus. Recall is the bar, not the model: a missing finding is still a `REJECTED`.

### Fixed
- **`/uicheck` counted a placeholder as an input label.** `check.py` let `<input placeholder="Email">` pass, while `uicheck/SKILL.md` says a placeholder is not a label. The most common unlabelled input therefore passed the check. It now fails.
- **`/uicheck` flagged `alt=""` as a missing alt.** The script tested for an empty value, so a decorative image with `alt=""`, which `uicheck/SKILL.md` calls valid, failed the check. It now fails only when the attribute is absent. Both defects were found while writing the tests, and each test failed before the fix (`uicheck` 1.0.1).
- **`/uicheck` flagged hidden and button inputs as unlabelled.** `check.py` required a label on every `input`, so `type="hidden"` (a CSRF token) and `type="submit"`, `button`, `reset` (named by their `value`) failed any form with them. The loop now skips those four types; `type="image"` and every other input are still checked. Found by reading the script, then reproduced: a page with one of each reported "4 input(s) without a label". Test `test_hidden_and_button_inputs_need_no_label` failed before the change and passes after (10/10).

### Rollback
- No schema change. Go back to 4.2.0: `git checkout v4.2.0`, or `git revert v4.2.0..HEAD`.

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
| 4.3.1 | Current |
| 4.3.0 | Previous |
| 4.2.0 | Previous |
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
| Discipline | 2 | tdd, fool |
| Taste | 3 | ponytail, anti-slop, impeccable |
| Capability | 1 | uicheck |
| **Total** | **15** | The 127 other skills are archived at tag `skills-v1-full` |

---

## Contributors

- **thevoidsyntax** - Author & Maintainer
