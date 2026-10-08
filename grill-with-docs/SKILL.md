---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADRs and glossary) as we go.
version: "1.2.0"
priority: high
category: [process]
phase: any
tech_stack:
  languages: [all]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: true
  conditions:
    - phrase: ["grill", "interview", "question", "interrogate"]
      reason: "Grilling intent detected"
capabilities: [analysis, generation]
quality:
  rules_count: 15
  examples_count: 10
  stability: stable
integrates_with: [domain-modeling, architecture-patterns]
source:
  origin: local
author: Claude
---

# Grill with Docs

A systematic interview process that sharpens plans and designs while producing documentation.

## Purpose

Use this skill to:
1. Challenge assumptions in a plan or design
2. Surface hidden requirements or risks
3. Generate documentation (ADRs, glossary) during the process

## The Interview Process

### Phase 1: Surface Understanding

Ask clarifying questions about:
- **What** problem are we solving?
- **Who** is affected?
- **Why** is this the right approach?
- **When** does it need to be done?

### Phase 2: Challenge Assumptions

Challenge each assumption:
- Is this assumption still valid?
- What if this assumption is wrong?
- What are the edge cases?

### Phase 3: Identify Risks

Surface risks:
- Technical risks
- Business risks
- Timeline risks
- Resource risks

### Phase 4: Generate Documentation

As we interview, create:
- **ADR**: Architecture Decision Records for key decisions
- **Glossary**: Terms and definitions discovered
- **Question Log**: Open questions and their answers

## Interview Questions Template

### For Plans

1. What problem does this solve?
2. What happens if we don't do this?
3. How does this fit with existing work?
4. What's the rollback plan?
5. What are the success metrics?

### For Designs

1. What are the components?
2. How do they communicate?
3. What are the failure modes?
4. How does this scale?
5. What are the security implications?

## Output Artifacts

### ADR Template

```yaml
# ADR-[N]: [Title]

## Status
Proposed

## Context
[Problem statement]

## Decision
[What was decided]

## Consequences
### Positive
- [Benefit 1]
### Negative
- [Downside 1]
```

### Glossary Template

```markdown
## Glossary

| Term | Definition |
|------|------------|
| [Term] | [Definition] |
```

## Tips for Effective Grilling

1. **Be relentless**: Don't accept surface answers
2. **Follow up**: Dig deeper into every answer
3. **Challenge**: Question assumptions
4. **Document**: Capture everything as we go
5. **Summarize**: End with clear action items
