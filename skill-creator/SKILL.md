---
name: skill-creator
description: "Skill creator template and guidelines for creating new Claude Code skills."
when_to_use: "Use when creating a new Claude Code skill (frontmatter and structure)."
version: "1.1.0"
priority: medium
category: [process]
phase: any
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - phrase: ["create skill", "new skill", "skill template"]
      reason: "Skill creation intent detected"
capabilities: [implementation, generation]
quality:
  rules_count: 10
  examples_count: 5
  stability: stable
integrates_with: [documentation, code-quality]
source:
  origin: local
author: thevoidsyntax
---

# Skill Creator Guide

Use this template to create new skills for Claude Code.

## Skill Structure

Each skill consists of:
1. **Frontmatter** (YAML metadata; optional fields used in this repo are documented in [metadata-schema.md](metadata-schema.md))
2. **Skill Content** (Markdown with instructions)

## Frontmatter Template

```yaml
---
name: skill-name
description: "Brief description of what this skill does."
version: "1.0.0"
priority: medium|high|critical
category: [process|backend|frontend|infrastructure]
phase: any|phase-1|phase-2|...
tech_stack:
  languages: [typescript, python, go]
  frameworks: [react, nextjs]
scale: [mvp, small, medium, large, enterprise]
auto_invoke:
  enabled: true|false
  conditions:
    - command: "/skill-name"
      reason: "Explicit invocation"
    - phrase: ["keyword", "trigger"]
      reason: "Phrase detection"
integrates_with: [other-skill]
dependencies: [required-skill]
capabilities: [implementation, review, analysis]
quality:
  rules_count: 10
  examples_count: 5
  stability: stable|beta|experimental
source:
  origin: local|merged
  sources: ["source-reference"]
author: thevoidsyntax
---
```

## Skill Content Guidelines

1. **Clear purpose**: What problem does this skill solve?
2. **Step-by-step guidance**: How to use the skill
3. **Examples**: Real-world usage examples
4. **Edge cases**: How to handle special situations
5. **Invoke line**: Required at end of file

## Invoke Line Format

```
**Invoke:** /skill-name | **Priority:** HIGH | **Version:** 1.0.0
```

## Creating a New Skill

1. Create directory: `skills/[skill-name]/`
2. Create `SKILL.md` with frontmatter and content
3. Test with `/skill-name` command
4. Update registry if applicable

## Skill Naming Conventions

- Use kebab-case: `code-quality`, `api-design`
- Be descriptive: `security-review` not `sec`
- Unique names: No duplicates
