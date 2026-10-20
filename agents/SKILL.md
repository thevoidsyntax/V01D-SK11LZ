---
name: agents
version: "3.0.0"
description: "Six-persona build pipeline (PM, Architect, Coder, QA/Security, DevOps, Writer) with per-phase model and artifact handoff"
when_to_use: "Use when you want the full persona pipeline to build a feature end-to-end (Satria, Athena, Hexa, Dina, Frans, Vika). Trigger with /agents or a feature request ending in 'mulai pipeline'. For single-persona help, call that persona directly."
priority: critical
phase: any
category: [agents]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/agents", "/team", "/satria", "/athena", "/hexa", "/dina", "/frans", "/vika"]
      reason: "Persona pipeline and coordination"
capabilities: [implementation, orchestration]
source:
  parent: skills-ecosystem
---

# 👥 PERSONA PIPELINE — SATRIA · ATHENA · HEXA · DINA · FRANS · VIKA

Six specialists run as a sequential, artifact-handoff pipeline. Each phase runs as its **own subagent** on its **own model**, so quality is spent where it matters and cost is saved where it does not.

## The Team

| # | Persona | Role | Model | Primary skills | Output artifact |
|---|---------|------|-------|----------------|-----------------|
| 1 | **Satria** | Product Manager | Sonnet* | brd, fsd, prd, feature-forge, grill-with-docs | `specs/PRD.md` |
| 2 | **Athena** | System Architect | **Opus** | codebase-design, architecture-patterns, api-design, api-contracts, database, wayfinder | `specs/ADR.md`, `specs/contracts.*` |
| 3 | **Hexa** | Feature Coder | Sonnet* | the detected language/framework-pro, code-quality, implement, test-generator | `src/*`, `tests/*` |
| 4 | **Dina** | QA & Security | **Opus** | testing, testing-integration, pentest, security, compliance, pr-review | `specs/AUDIT.md` + `STATUS:` |
| 5 | **Frans** | Platform & DevOps | Sonnet | docker, deployment, kubernetes, terraform, database-migration | `Dockerfile`, `migrations/*`, `ci.yml` |
| 6 | **Vika** | Technical Writer | Haiku* | doc-generator, documentation, api-contracts, create-release | `docs/openapi.*`, `CHANGELOG.md` |

Each persona also inherits the 12 core skills + `/ponytail` from `/autor`. Full bound-skill lists live in each persona's own `SKILL.md`.

\* **Escalation:** Hexa → Opus for transactional/concurrency-heavy logic; Satria → Opus for large/ambiguous products; Vika → Sonnet for a large API surface. Athena & Dina stay Opus (risk gates); Frans stays at least Sonnet (migrations are destructive — never Haiku).

## Pipeline protocol (how to run it)

Triggered by a feature instruction (e.g. *"Buat modul penutupan shift kasir. Mulai pipeline"*). The orchestrator (this session) runs the phases **in order**, each as a subagent:

For each phase, spawn with the **Agent tool**, always in the foreground so progress is visible:
- `subagent_type: "general-purpose"`, `model:` = the persona's model from the table (apply escalation when the feature warrants it), `run_in_background: false` (each phase needs the previous artifact, so nothing is lost).
- `prompt`: "You are **<Persona>** (<role>). Invoke the `/<persona>` skill and follow it. Read only these artifacts: <inputs>. Produce exactly: <output artifact>. Keep your reply to a one-line handoff summary."
- Inputs/outputs follow the table; never pass the full prior transcript — only the artifact paths.
- Before each spawn print `[FASE n/6] <Persona> (<model>) mulai — baca <inputs>`. After it returns, check the artifact exists and print `[HANDOFF] <A> → <B> selesai: <artifact> (ada)`. In the Dina ↔ Hexa loop also print `[LOOP k/3]`.

Order & handoff:

```
Satria  → specs/PRD.md
Athena  → specs/ADR.md + specs/contracts.*     (reads PRD)
Hexa    → src/* + tests/*                       (reads ADR + contracts + PRD)
Dina    → specs/AUDIT.md + STATUS:              (reads src/ + tests/)
Frans   → Dockerfile + migrations/* + ci.yml    (reads src/ + schema)
Vika    → docs/openapi.* + CHANGELOG.md         (reads src/ + PRD)
```

## Quality gate & loopback

Dina ends `specs/AUDIT.md` with a status line:
- `STATUS: APPROVED` → continue to **Frans**.
- `STATUS: REJECTED` → hand back to **Hexa** with the audit findings; Hexa patches, Dina re-audits. **Max 3 loops**; if still rejected, stop and surface the blocking findings to the user instead of proceeding.

## Context isolation (context pruning)

- Each phase is a fresh subagent — it does **not** inherit the previous persona's conversation.
- Personas communicate **only through artifact files** (`specs/*`, `src/*`, `docs/*`).
- Between phases the terminal shows only short status lines (`[FASE …]`, `[HANDOFF] …`).

## Try it (smoke-test)

Run this in an interactive session to confirm the pipeline works end to end:

> **"Buat endpoint health-check kecil. Mulai pipeline."**

The orchestrator spawns each phase as a subagent on its model; check the artifact appears before moving on:

| Phase | Subagent (model) | Input → Output |
|-------|------------------|----------------|
| 1 | Satria (Sonnet) | request → `specs/PRD.md` |
| 2 | Athena (Opus) | PRD → `specs/ADR.md` + `specs/contracts.*` |
| 3 | Hexa (Sonnet) | ADR + contracts → `src/*` + `tests/*` |
| 4 | Dina (Opus) | src + tests → `specs/AUDIT.md` ending `STATUS: APPROVED` (or `REJECTED` → back to Hexa, max 3) |
| 5 | Frans (Sonnet) | approved build → `Dockerfile`, `migrations/*`, `ci.yml` |
| 6 | Vika (Haiku) | src + PRD → `docs/openapi.*`, `CHANGELOG.md` |

Expected terminal output is just short status lines, e.g.:

```
[FASE 1/6] Satria (Sonnet) mulai — baca permintaan user
[HANDOFF] Satria → Athena selesai: specs/PRD.md (ada)
[FASE 2/6] Athena (Opus) mulai — baca specs/PRD.md
[HANDOFF] Athena → Hexa selesai: specs/ADR.md (ada)
```

Passing = all six artifacts exist and Dina's `STATUS: APPROVED`. If a phase produces no artifact, stop and inspect that phase rather than continuing.

## Single-persona use

Call any persona directly for focused help without the pipeline: `/satria`, `/athena`, `/hexa`, `/dina`, `/frans`, `/vika`. Each still carries its bound skills and recommended model.

## Notes

- Personas are **skills in this repo** (clone-only intact); per-phase models come from the Agent tool's `model` override at spawn, not from registered agents.
- Artifacts like `contracts.*` and `ci.yml` are created in the **target project**, never in this skills repo (which has no CI by design).

---

*A pipeline that ships: plan → design → build → audit → deploy → document.*
