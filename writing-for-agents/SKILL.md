---
name: writing-for-agents
description: "Prompt and instruction writing optimized for AI agents"
version: "1.1.0"
category: [strategy]
priority: medium
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/writing-for-agents", "/agent-writing"]
      reason: "Writing for AI"
    - phrase: ["write for ai", "agent prompt", "skill writing", "write a skill"]
      reason: "Agent writing context"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [skill-creator, documentation]
capabilities: [implementation]
quality:
  rules_count: 10
  examples_count: 5
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Writing for Agents

Craft effective prompts and instructions for AI agents.

## Usage

```
Use writing-for-agents when:
- Creating Claude Code skills
- Writing system prompts
- Designing agent workflows
- Building instruction sets
```

## Best Practices

### Clarity
- Be explicit, not implicit
- Use concrete examples
- Define terms clearly

### Structure
- Use numbered lists for sequences
- Use bullet points for options
- Separate context from instructions

### Constraints
- Specify what NOT to do
- Set boundaries
- Define failure modes

### Examples
Include input/output examples

```markdown
## Example
Input: "Show me the users table"
Output: SQL query selecting from users
```

## Reference

- [SKILL-MECHANICS.md](SKILL-MECHANICS.md) — how skills load and trigger

## Integrations

Works with: `skill-creator`, `chisle`
