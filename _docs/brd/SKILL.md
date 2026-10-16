---
name: brd
version: "1.0.0"
description: "Business Requirements Document template for project development"
when_to_use: "Use when creating a new project to define business requirements, stakeholders, and objectives."
priority: high
phase: phase-1
category: [documentation, project-management]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/brd", "/business-requirements"]
      reason: "Business requirements document"
capabilities: [implementation]
source:
  origin: project-documentation
author: thevoidsyntax
---

# 📋 BUSINESS REQUIREMENTS DOCUMENT (BRD)

**Version:** 1.0.0 | **Date:** YYYY-MM-DD | **Status:** Draft

---

## 1. EXECUTIVE SUMMARY

### Project Overview
Brief description of the project and its purpose.

### Business Problem
What business problem does this project solve?

### Proposed Solution
High-level overview of the proposed solution.

### Expected Outcomes
- Outcome 1
- Outcome 2
- Outcome 3

---

## 2. STAKEHOLDERS

| Role | Name | Contact | Responsibilities |
|------|------|---------|------------------|
| Product Owner | | | |
| Business Sponsor | | | |
| Technical Lead | | | |
| Key Stakeholders | | | |

---

## 3. BUSINESS OBJECTIVES

### Primary Objectives
1. **Objective 1:** [SMART goal description]
2. **Objective 2:** [SMART goal description]
3. **Objective 3:** [SMART goal description]

### Success Metrics
| Metric | Target | Measurement |
|---------|--------|-------------|
| Revenue Impact | | |
| Cost Reduction | | |
| User Adoption | | |
| Time to Market | | |

---

## 4. SCOPE

### In Scope
- Feature/Functionality 1
- Feature/Functionality 2
- Feature/Functionality 3

### Out of Scope
- Item 1
- Item 2

### Constraints
- Budget: [amount]
- Timeline: [duration]
- Resources: [team size]
- Technical: [limitations]

---

## 5. BUSINESS REQUIREMENTS

### BR-001: [Requirement Title]
**Priority:** High/Medium/Low
**Description:** Detailed description of the requirement.
**Acceptance Criteria:**
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

### BR-002: [Requirement Title]
**Priority:** High/Medium/Low
**Description:** Detailed description of the requirement.
**Acceptance Criteria:**
- [ ] Criteria 1
- [ ] Criteria 2

---

## 6. USER STORIES

### Epic 1: [Epic Title]
**As a** [user type]
**I want** [goal]
**So that** [benefit]

#### User Story 1
**As a** [user type]
**I want** [goal]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Given [context] When [action] Then [result]

---

## 7. RISKS & MITIGATIONS

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-------------|
| Risk 1 | High/Medium/Low | High/Medium/Low | Mitigation strategy |
| Risk 2 | High/Medium/Low | High/Medium/Low | Mitigation strategy |

---

## 8. ASSUMPTIONS

1. Assumption 1
2. Assumption 2
3. Assumption 3

---

## 9. DEPENDENCIES

| Dependency | Owner | Status | Impact |
|------------|-------|--------|--------|
| External system | | | |
| Internal team | | | |

---

## 10. APPROVALS

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Business Sponsor | | | |
| Product Owner | | | |
| Technical Lead | | | |

---

**Invoke:** `/brd` | **Version:** 1.0.0
