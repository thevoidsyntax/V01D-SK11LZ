---
name: feature-forge
description: "PRD creation and feature specification drafting"
when_to_use: "Use when drafting a PRD or feature specification."
version: "1.1.0"
category: [strategy]
priority: high
phase: discovery
auto_invoke:
  enabled: true
  conditions:
    - command: ["/feature-forge", "/prd"]
      reason: "Feature specification"
    - phrase: ["create prd", "feature spec", "requirements", "spec this feature"]
      reason: "Feature specification context"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [wayfinder, new-issue, handoff]
capabilities: [analysis]
quality:
  rules_count: 10
  examples_count: 4
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Feature Forge

Transform requirements into structured product specifications.

## Usage

```
Use feature-forge when:
- Creating new feature specifications
- Drafting PRDs from requirements
- Breaking down epics into stories
- Writing functional specifications
```

## Structure

```markdown
# Feature: [Name]

## Overview
[What and why]

## User Stories
- As a [persona], I want [goal] so that [benefit]

## Requirements
### Functional
- [Requirement 1]
- [Requirement 2]

### Non-Functional
- Performance: <Xms
- Availability: 99.9%

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Out of Scope
- [What we're NOT doing]
```

## Integrations

Works with: `pr-review`, `validate-issue`
