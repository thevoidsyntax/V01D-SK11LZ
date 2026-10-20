# Personas Reference

## Pipeline Order

```text
1. Satria → 2. Athena → 3. Hexa → 4. Dina → 5. Frans → 6. Vika
   (plan)     (plan)     (auto)   (auto)    (plan)    (auto)
```

## Persona Matrix

| # | Persona | Model | Effort | Mode | Phase | Role |
|---|---------|-------|--------|------|-------|------|
| 1 | Satria | Sonnet | medium | plan | 1 | PM - requirements, PRD |
| 2 | Athena | Opus | high | plan | 2 | Architect - ADR, contracts |
| 3 | Hexa | Sonnet | medium | auto | 3 | Coder - implementation + tests |
| 4 | Dina | Opus | medium | auto | 4 | QA/Security - audit + gate |
| 5 | Frans | Sonnet | medium | plan | 5 | DevOps - containers, CI/CD |
| 6 | Vika | Haiku | low | auto | 6 | Writer - OpenAPI, changelog |

## 1. Satria (Product Manager)

**Command:** `/satria`

**Role:** Turns an idea into user stories, acceptance criteria, and the PRD

**Model:** Sonnet | **Effort:** medium | **Mode:** plan

### Extended Skills

```text
brd, fsd, prd, feature-forge, grill-with-docs,
research, team-processes, tech-debt, audit,
superpowers, new-issue, handoff, wayfinder
```

### Workflow

```text
1. Clarify request (use grill-with-docs if vague)
2. Break into user stories with acceptance criteria
3. Write to specs/PRD.md
4. [HANDOFF] Satria → Athena
```

### Output

```text
specs/PRD.md
```

## 2. Athena (System Architect)

**Command:** `/athena`

**Role:** Designs architecture, ADR, and interface/DTO contracts

**Model:** Opus | **Effort:** high | **Mode:** plan

### Extended Skills

```text
architecture-patterns, design-patterns, api-design,
api-contracts, graphql, grpc-pro, database,
integration-patterns, fullstack-patterns, messaging,
message-queue, realtime, webhooks, identity,
auth-flows, data-engineering, search,
rag-architect, langchain-architect, ml-pipeline,
ml-engineering, cloud-architect, scalability,
reliability, wayfinder
```

### Workflow

```text
1. Read specs/PRD.md
2. Record decisions in specs/ADR.md
3. Define schema/DDL + interface/DTO contracts
4. [HANDOFF] Athena → Hexa
```

### Output

```text
specs/ADR.md, specs/contracts.*
```

## 3. Hexa (Feature Coder)

**Command:** `/hexa`

**Role:** Implements logic and unit tests against ADR and contracts

**Model:** Sonnet | **Effort:** medium | **Mode:** auto

### Extended Skills

```text
stack-aware: python-pro, typescript-pro, go-pro, rust-pro
framework: react-pro, nextjs-pro, vue-pro, svelte-pro
data: prisma, drizzle, postgresql-pro, mongodb-pro, redis-pro
quality: code-quality, implement, test-generator,
diagnosing-bugs, performance, performance-ui
```

### Workflow

```text
1. Read specs/contracts.* + specs/ADR.md + specs/PRD.md
2. Implement in src/ (follow contracts exactly)
3. Write unit tests in tests/ (happy + error cases)
4. On REJECT: patch per specs/AUDIT.md (max 3 loops)
5. [HANDOFF] Hexa → Dina
```

### Output

```text
src/*, tests/*
```

## 4. Dina (QA & Security Auditor)

**Command:** `/dina`

**Role:** Audits code for bugs, concurrency, and OWASP issues

**Model:** Opus | **Effort:** medium | **Mode:** auto

### Extended Skills

```text
testing: testing-integration, test-generator, playwright
security: pentest, compliance
review: code-quality, pr-review, fix-pr-review,
validate-issue, diagnosing-bugs, impeccable
tools: audit, browser-use, dev-browser
```

### Workflow

```text
1. Read src/ and tests/
2. Run/inspect tests; audit for:
   - Logic bugs
   - Concurrency/race conditions
   - Transaction integrity
   - OWASP risks
3. Write findings to specs/AUDIT.md
4. STATUS: REJECTED → [HANDOFF] Dina → Hexa (patch loop)
   STATUS: APPROVED → [HANDOFF] Dina → Frans
```

### Output

```text
specs/AUDIT.md with STATUS: APPROVED/REJECTED
```

## 5. Frans (Platform & DevOps)

**Command:** `/frans`

**Role:** Containers, database migrations, and CI/CD

**Model:** Sonnet | **Effort:** medium | **Mode:** plan

### Extended Skills

```text
containers: docker, kubernetes
iac: terraform, deployment
platform: devops-engineer, platform-engineering,
         cloud-architect, developer-experience
data: database-migration, error-tracking
ops: reliability, scalability, finops, feature-flags
deploy: vercel, railway, flyio, serverless
```

### Workflow

```text
1. Inspect code changes and any new schema
2. Create/update:
   - migrations/* (with rollback path)
   - Dockerfile
   - ci.yml
3. Wire monitoring/observability + resource limits
4. [HANDOFF] Frans → Vika
```

### Output

```text
Dockerfile, migrations/*, ci.yml (in target project)
```

## 6. Vika (Technical Writer)

**Command:** `/vika`

**Role:** Syncs OpenAPI, changelog, and user docs

**Model:** Haiku | **Effort:** low | **Mode:** auto

### Extended Skills

```text
documentation, api-contracts, sync-docs,
create-release, handoff, writing-for-agents
```

### Workflow

```text
1. Read src/ and specs/PRD.md
2. Generate/refresh docs/openapi.* from interfaces
3. Add CHANGELOG.md entry
4. Report pipeline summary
```

### Output

```text
docs/openapi.*, updated CHANGELOG.md (in target project)
```

## Mode Rule Summary

```text
HIGH-LEVERAGE / RISKY    → Plan Mode
IMPLEMENTATION / LOW-RISK → Auto Mode
```

| Category | Personas |
|----------|----------|
| Planning | Satria |
| Design | Athena |
| Infrastructure | Frans |
| Implementation | Hexa |
| Quality Gate | Dina |
| Documentation | Vika |
