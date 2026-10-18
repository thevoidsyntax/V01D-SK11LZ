---
name: grill-with-docs
description: "Documentation-driven interview and requirements gathering"
when_to_use: "Use when gathering requirements through a documentation-driven interview."
version: "1.1.0"
category: [strategy]
priority: medium
phase: discovery
auto_invoke:
  enabled: true
  conditions:
    - command: ["/grill-with-docs", "/grill"]
      reason: "Requirements gathering"
    - phrase: ["question this", "challenge this", "requirements", "gather requirements"]
      reason: "Requirements context"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [feature-forge, wayfinder]
capabilities: [analysis]
quality:
  rules_count: 8
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Grill with Docs

Requirements interrogation through structured questioning.

## Usage

```
Use grill-with-docs when:
- Clarifying ambiguous requirements
- Uncovering edge cases
- Challenging assumptions
- Filling documentation gaps
```

## Question Framework

### 5 W's + H
- What exactly should happen?
- Who triggers/receives?
- When does it occur?
- Where does it apply?
- Why is this needed?
- How should it work?

### Challenge Areas
- Error handling paths
- Permission boundaries
- Performance constraints
- Integration points

## Output

Generate requirements clarification document with answered questions and identified gaps.
