---
name: tech-debt
description: "Technical debt identification, prioritization, tracking, and remediation strategies."
when_to_use: "Use when identifying, prioritizing, or remediating technical debt."
version: "1.0.0"
category: [process, quality]
priority: high
phase: any
tech_stack:
  languages: [all]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/tech-debt", "/techdebt", "/tdd-audit"]
      reason: "User explicitly requesting tech debt analysis"
    - phrase: ["tech debt", "technical debt", "refactor", "legacy code"]
      reason: "Tech debt related request detected"
  skill_tier: context
triggers:
  phrases:
    - "tech debt"
    - "technical debt"
    - "refactor"
    - "legacy code"
    - "code smell"
    - "technical cost"
    - "remediation"
    - "debt backlog"
capabilities: [analysis, prioritization, tracking]
dependencies: [code-quality]
integrates_with: [code-quality, observability, documentation]
---

# TECH-DEBT v1.0

Technical debt analysis and management specialist.

## What is Technical Debt?

Technical debt is the implied cost of additional rework caused by choosing an easy solution now instead of a better approach that would take longer.

## Debt Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Code Debt** | Poor code quality | Duplication, magic numbers, long methods |
| **Design Debt** | Architectural shortcuts | Tight coupling, missing abstractions |
| **Test Debt** | Insufficient testing | No tests, brittle tests, low coverage |
| **Documentation Debt** | Missing/outdated docs | No comments, outdated README |
| **Infrastructure Debt** | Technical stack issues | Old dependencies, missing CI/CD |
| **Config Debt** | Hardcoded values | No config management |

## Identification Process

### 1. Code Analysis

```
┌─────────────────────────────────────────────────────────────────────┐
│  CODE SMELLS TO IDENTIFY:                                       │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  COMPLEXITY:                                                     │
│  ├── Cyclomatic complexity > 10                                │
│  ├── Method length > 50 lines                                  │
│  ├── Class length > 500 lines                                 │
│  └── Nested depth > 4 levels                                 │
│                                                                      │
│  COUPLING:                                                        │
│  ├── Fan-out > 7 dependencies                                │
│  ├── Circular dependencies                                      │
│  └── Shotgun surgery patterns                                  │
│                                                                      │
│  MAINTAINABILITY:                                                │
│  ├── Comment ratio < 10%                                      │
│  ├── Test coverage < 60%                                      │
│  └── Duplicate code > 5%                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Quick Assessment

```
┌─────────────────────────────────────────────────────────────────────┐
│  DEBT ASSESSMENT CHECKLIST:                                     │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  CODE QUALITY:                                                    │
│  ☐ Run static analysis (ESLint, SonarQube, etc.)            │
│  ☐ Check cyclomatic complexity                                │
│  ☐ Identify code duplication                                  │
│  ☐ Review naming conventions                                   │
│                                                                      │
│  TEST COVERAGE:                                                  │
│  ☐ Check unit test coverage                                   │
│  ☐ Check integration test coverage                           │
│  ☐ Identify untested critical paths                          │
│                                                                      │
│  DEPENDENCIES:                                                  │
│  ☐ Check outdated packages                                   │
│  ☐ Check for known vulnerabilities                           │
│  ☐ Check dependency count                                    │
│                                                                      │
│  DOCUMENTATION:                                                   │
│  ☐ Check README completeness                                  │
│  ☐ Check API documentation                                    │
│  ☐ Check code comments                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Prioritization Framework

### Impact vs Effort Matrix

```
                    EFFORT
          Low          Medium         High
        ┌────────────┬────────────┬────────────┐
        │            │            │            │
IMPACT  │  Quick     │ Schedule  │  Major    │
   High │  Wins     │  Time     │  Projects │
        │            │            │            │
        ├────────────┼────────────┼────────────┤
        │            │            │            │
        │  Ignore   │  Backlog  │  Consider │
   Low  │  (for now)│            │  removal  │
        │            │            │            │
        └────────────┴────────────┴────────────┘
```

### Debt Severity Levels

| Level | Description | Priority | Action |
|-------|-------------|----------|--------|
| **Critical** | Blocking development, security risk | P0 | Fix immediately |
| **High** | Affects multiple features | P1 | Fix in current sprint |
| **Medium** | Technical inconvenience | P2 | Schedule in backlog |
| **Low** | Cosmetic/minor impact | P3 | Fix when touching code |

## Tracking Template

### Debt Backlog

```markdown
# Technical Debt Backlog

## Critical (P0)
| ID | Description | Impact | Files | Created | Owner |
|----|-------------|--------|-------|---------|-------|
| TD-001 | No input validation on API | Security risk | api/*.ts | 2024-01 | @dev1 |

## High (P1)
| ID | Description | Impact | Files | Created | Owner |
|----|-------------|--------|-------|---------|-------|
| TD-002 | Hardcoded config | Deployment issue | config.ts | 2024-01 | @dev2 |

## Medium (P2)
| ID | Description | Impact | Files | Created | Owner |
|----|-------------|--------|-------|---------|-------|
| TD-003 | Duplicate user validation | Maintenance | users/*.ts | 2024-01 | @dev1 |

## Low (P3)
| ID | Description | Impact | Files | Created | Owner |
|----|-------------|--------|-------|---------|-------|
| TD-004 | Missing JSDoc comments | Documentation | utils/*.ts | 2024-01 | @dev3 |
```

### Individual Debt Entry

```markdown
# TD-001: No Input Validation on API

## Summary
User endpoints accept any input without validation.

## Impact
- **Severity**: Critical
- **Security Risk**: SQL injection, XSS possible
- **Business Impact**: Data corruption

## Root Cause
- Validation was skipped for "fast delivery"
- No schema validation library initially

## Effort to Fix
- **Estimated**: 8 hours
- **Complexity**: Medium

## Affected Files
- src/api/users.ts
- src/api/products.ts

## Recommended Solution
1. Add Zod schema validation
2. Add request DTOs
3. Add integration tests

## Prevention
- Add validation to PR checklist
- Use ESLint rule for schema validation

## Status: Open
- Created: 2024-01-15
- Owner: @dev1
- Sprint: Backlog
```

## Remediation Strategies

### 1. Boy Scout Rule

```
┌─────────────────────────────────────────────────────────────────────┐
│  "Leave the code better than you found it"                     │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  When touching a file:                                            │
│  1. Fix at least one code smell                                │
│  2. Add tests if missing                                      │
│  3. Update documentation                                      │
│                                                                      │
│  BENEFIT: Gradual improvement without dedicated sprints        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Strangler Fig Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│  Incrementally replace legacy system                            │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  OLD SYSTEM          │          NEW SYSTEM                    │
│  ┌─────────────┐    │    ┌─────────────┐                     │
│  │  Legacy     │    │    │   New      │                     │
│  │  Module     │────┼───▶│   Module   │                     │
│  └─────────────┘    │    └─────────────┘                     │
│                      │                                        │
│                      │    ┌─────────────┐                     │
│                      │    │   Router   │                     │
│                      └────│  Routes    │                     │
│                           │  requests  │                     │
│                           └─────────────┘                     │
│                                                                      │
│  Process:                                                      │
│  1. Create new module                                         │
│  2. Route new requests to it                                  │
│  3. Decrement old module until 0%                           │
│  4. Delete old module                                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3. Andon Cord Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│  Stop the line when debt becomes blocking                       │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  TRIGGER: When debt makes feature delivery impossible         │
│                                                                      │
│  ACTION:                                                      │
│  1. Stop feature development                                 │
│  2. Allocate time for debt fix                               │
│  3. Resume after debt is addressed                            │
│                                                                      │
│  EXAMPLE:                                                      │
│  "We can't add user authentication because there's no        │
│   existing validation layer. Blocking feature to fix debt."  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Measurement

### Debt Metrics

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Code Coverage | >80% | 60-80% | <60% |
| Code Complexity | <10 | 10-15 | >15 |
| Duplicate Code | <3% | 3-5% | >5% |
| Critical Vulnerabilities | 0 | 1-2 | >2 |
| Outdated Dependencies | <10% | 10-20% | >20% |

### Debt Ratio

```
Debt Ratio = (Cost to Fix Debt) / (Cost to Build from Scratch)

Example:
- Building new: $100,000
- Fixing current debt: $40,000
- Debt Ratio: 40%

Interpretation:
- < 25%: Healthy
- 25-50%: Manageable
- 50-75%: Concerning
- > 75%: Critical
```

## Prevention Strategies

1. **Definition of Done**
   - [ ] Code reviewed
   - [ ] Tests written
   - [ ] No new warnings
   - [ ] Documentation updated

2. **CI/CD Gates**
   - [ ] Lint checks pass
   - [ ] Test coverage above threshold
   - [ ] No critical vulnerabilities
   - [ ] Build succeeds

3. **Regular Debt Review**
   - Monthly: Debt backlog review
   - Quarterly: Debt ratio assessment
   - Per-release: New debt audit

---

*Author: TheVoidSyntax*
