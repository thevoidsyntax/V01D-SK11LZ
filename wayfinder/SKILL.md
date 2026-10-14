---
name: wayfinder
description: "Strategic planning and decision-making framework for architecture decisions"
version: "1.1.0"
category: [strategy]
priority: high
phase: discovery
auto_invoke:
  enabled: true
  conditions:
    - command: ["/wayfinder", "/plan"]
      reason: "Strategic planning"
    - phrase: ["plan this", "architecture decision", "make a decision"]
      reason: "Intent to plan"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [architecture-patterns, feature-forge]
capabilities: [analysis]
quality:
  rules_count: 10
  examples_count: 4
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Wayfinder

Strategic planning and architectural decision guidance.

## Usage

```
Use wayfinder when:
- Planning new project architecture
- Making technology decisions
- Evaluating trade-offs
- Creating technical roadmaps
```

## Framework

### 1. Context
What are we trying to solve?

### 2. Forces
- Business constraints
- Technical factors
- Team capabilities
- Time pressure

### 3. Options
Generate alternatives with trade-off analysis

### 4. Decision
Select option with rationale

### 5. Consequences
Document implications

## Integrations

Works with: `architecture-patterns`, `codebase-design`
