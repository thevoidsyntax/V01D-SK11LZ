# Legacy mode (Athena)

Read this when the request is about code that already exists and nobody wrote down what it does. In legacy mode Athena writes down what the code **is**, before deciding what it should be. The observed specification is the input to the design; without it, a "redesign" is a rewrite of a system nobody understood.

Use it when: the request names an existing codebase, the PRD contradicts what the code does, the request is "understand this repo", or the code has no spec, no ADR, and no tests.

## Workflow

1. **Scope.** Bound the analysis: the whole project, or one module the request names. Write the boundary down first, so the gaps are visible.
2. **Map.** Structure, entry points, routes, data models, auth, external calls, config. The model's own knowledge of the stack does the reading; the map is what goes in the document.
3. **Trace.** Follow the data flow of two or three real paths end to end, from request to storage and back. Two traced paths expose the rules that a file listing hides.
4. **Extract.** Write the observed behavior as requirements in the same EARS shape Satria uses, but marked `OBS-<AREA>-<NNN>`. "Observed" means: this is what the code does today, not what it should do.
5. **Separate.** Three lists, and never mixed: **observed** (the code does this), **intended** (a doc, a comment, or the user says so), **unknown** (behavior no path proves). Never guess into "observed".
6. **Decide.** The ADR then says what changes: keep, change, or delete. Every change lists the observed behavior it replaces, so the migration is traceable.
7. **Flag.** What could not be established goes into the HANDOFF `Open:` line with the reason (dead code path, no test, external service unreachable).

## Reading the code

| Target | Where to look |
|--------|---------------|
| Entry points | `main.*`, `app.*`, `index.*`, server bootstrap |
| Routes | `routes/`, `controllers/`, `router.*`, `app.get/post`, decorator routes |
| Data | `models/`, `schema*`, `migrations/`, entity and ORM classes |
| Logic | `services/`, `domain/`, `use_cases/` |
| Auth | `auth/`, `guards/`, `middleware`, session and token handling |
| External | `fetch(`, `axios`, HTTP clients, `integrations/`, `clients/` |
| Config | `*.config.*`, `.env*`, `config/`, feature flags |

Grep for the markers of unfinished or unowned code: `TODO`, `FIXME`, `HACK`, `XXX`. Each one is either a requirement to write down or a decision to make.

## Output: `specs/LEGACY.md`

```markdown
# Observed specification - <project or module>

**Scope:** <what was analyzed>
**Date:** <UTC date>

## Structure
<tree with one line per module>

## Data flow
<request -> ... -> storage, and back>

## Observed requirements
**OBS-AUTH-001**: Login
While credentials are valid, when POST /auth/login is called,
the system shall return a session token.

## Observed non-functional behavior
<timeouts, pool sizes, rate limits, hash rounds - with the file they came from>

## Intended
<what a doc, a comment, a commit message, or the user says the code should do, with the source; "-" when no source exists. Where it contradicts an OBS item, name that item>

## Unknown
<behavior no traced path proves, and what would be needed to prove it>

## Markers
<TODO/FIXME found, with file and line>
```

This file is an observation, not a decision. The ADR is where the decisions go; `specs/LEGACY.md` is the evidence those decisions rest on.

Adapted from Jeffallan's `spec-miner` (MIT). The exploration method is kept; the output artifact and the split between observation and decision are this repo's.
