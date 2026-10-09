---
name: feature-forge
description: PRD creation and feature specification drafting
version: "1.0.0"
category: [process, documentation]
priority: high
phase: discovery
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
