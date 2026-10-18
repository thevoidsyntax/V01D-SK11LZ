---
name: prd
version: "2.0.0"
description: "Product Requirements Document template with feature-forge integration"
when_to_use: "Use when creating product requirements, defining features, and planning product development."
priority: high
phase: phase-1
category: [documentation, project-management]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/prd", "/product-requirements", "/feature-forge"]
      reason: "Product requirements document"
capabilities: [implementation]
source:
  origin: project-documentation
integrates_with: [brd, fsd]
author: thevoidsyntax
---

# 📦 PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Version:** 1.0.0 | **Date:** YYYY-MM-DD | **Status:** Draft
**Product:** [Product Name]

---

## 1. PRODUCT OVERVIEW

### Vision
What this product is and why it exists.

### Mission
Core purpose and value proposition.

### Strategic Goals
1. Goal 1
2. Goal 2
3. Goal 3

---

## 2. PRODUCT DESCRIPTION

### What It Does
Core functionality in one sentence.

### Who It's For
Primary user personas:
- **Persona 1:** [Description, needs, frustrations]
- **Persona 2:** [Description, needs, frustrations]

### What Problems It Solves
| Problem | Current Solution | Our Solution |
|---------|----------------|-------------|
| Problem 1 | Workaround | [How we solve it] |
| Problem 2 | Workaround | [How we solve it] |

### Key Differentiators
What makes this product unique?

---

## 3. PRODUCT REQUIREMENTS

### PR-001: [Feature Name]

**Type:** Core Feature / Enhancement / Bug Fix
**Priority:** P0 (Must Have) / P1 (Should Have) / P2 (Nice to Have)
**Effort:** Small / Medium / Large

**Description:**
Detailed description of the feature.

**User Story:**
```
As a [user type]
I want [goal/action]
so that [benefit/value]
```

**Requirements:**
| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PR-001-001 | Requirement | Given/When/Then format |

**Design References:**
- Figma Link: [URL]
- Screenshots: [attachments]

**Dependencies:**
- [Dependency 1]
- [Dependency 2]

**Risks:**
| Risk | Impact | Mitigation |
|------|--------|-------------|

### PR-002: [Feature Name]

[Same structure as PR-001]

---

## 4. FEATURE PRIORITIZATION

### MoSCoW Analysis

#### Must Have (P0)
- [ ] PR-001
- [ ] PR-002

#### Should Have (P1)
- [ ] PR-003
- [ ] PR-004

#### Could Have (P2)
- [ ] PR-005

#### Won't Have (This Release)
- [ ] PR-006

### Feature Dependencies
```
PR-001 ──┬── PR-002
         │
         └── PR-003
         
PR-004 (Independent)
```

---

## 5. USER JOURNEYS

### Primary Journey: [Journey Name]
```
Step 1: Entry Point
    ↓
Step 2: Action
    ↓
Step 3: Decision
    ↓
Step 4: Outcome
```

### Success Metrics
| Step | Metric | Target |
|------|--------|--------|
| Entry | | |
| Action | | |
| Outcome | | |

---

## 6. ANALYTICS & METRICS

### Key Metrics (KPIs)
| Metric | Definition | Target | Tracking |
|--------|-----------|--------|----------|
| DAU | Daily Active Users | | |
| MAU | Monthly Active Users | | |
| Conversion | Sign-up rate | | |

### Events to Track
| Event | Properties | Trigger |
|-------|-----------|---------|
| event_name | prop1, prop2 | When action occurs |

### Funnels
| Step | Event | Drop-off Target |
|------|--------|-----------------|

---

## 7. ROLLBACK PLAN

### Feature Flags
- Feature will be behind flag: `feature-[name]`
- Rollout percentage: 0% → 10% → 50% → 100%

### Rollback Criteria
- Error rate > 1%
- Performance degradation > 20%
- User complaints > threshold

### Rollback Procedure
1. Disable feature flag
2. Monitor error rates
3. Communicate to stakeholders

---

## 8. LAUNCH CHECKLIST

### Pre-Launch
- [ ] Code review completed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Analytics tracking implemented
- [ ] Feature flag configured
- [ ] Rollback plan tested

### Launch
- [ ] Marketing ready
- [ ] Support team trained
- [ ] Monitoring dashboards set up
- [ ] Communication plan executed

### Post-Launch
- [ ] Monitor metrics for 24 hours
- [ ] Collect user feedback
- [ ] Plan iteration based on data

---

## 9. OPEN QUESTIONS

| # | Question | Owner | Status | Answer |
|---|-----------|--------|--------|---------|
| 1 | | | Open | |

---

**Invoke:** `/prd` or `/feature-forge` | **Version:** 2.0.0
