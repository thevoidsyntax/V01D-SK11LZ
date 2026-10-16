# Skill Metadata Schema

> Standard metadata format for all Claude Code skills
> Version: 1.0.0

---

## Overview

Every skill should include a YAML frontmatter block at the top of its `SKILL.md` or `skill.md` file. This metadata enables:

- **Dynamic skill discovery** by auto-route and analyze-project
- **Smart skill selection** based on tech stack and phase
- **Dependency resolution** and skill chaining
- **Quality scoring** via skillspector

---

## Metadata Schema

```yaml
---
# REQUIRED FIELDS
name: skill-name                    # kebab-case, unique identifier
description: "One-line description"  # Max 200 chars
version: "1.0.0"                   # Semantic versioning

# CLASSIFICATION
category:                          # Primary category
  - backend                        # backend|frontend|infrastructure|security|data|process|ai|domain
priority: medium                   # high|medium|low
phase: any                         # phase-1|phase-2|...|phase-N|any

# TECH STACK (for auto-detection)
tech_stack:
  languages:                       # Programming languages
    - typescript
    - nodejs
  frameworks:                      # Web/framework dependencies
    - fastify
    - express
  databases:                       # Database technologies
    - postgresql
  services:                        # Cloud/external services
    - redis
    - docker

# RELATIONSHIPS
dependencies:                      # Skills that should be loaded first
  - security
  - config
conflicts:                         # Skills that should not be loaded together
  - caveman                        # Token optimization vs verbose logging

# AUTO-INVOCATION
auto_invoke:
  enabled: true                   # Should this skill auto-invoke?
  conditions:                      # When to auto-invoke
    - tech_stack: [fastify, express, nestjs]
      reason: "API framework detected"
    - phase: phase-2
      reason: "Core features phase"
  skip_if:
    - has_file: "node_modules/.bin/skill"
      reason: "Already implemented"

# TRIGGER KEYWORDS
triggers:
  commands:                        # Slash commands
    - /skill-name
    - /alt-name
  phrases:                         # Natural language triggers
    - "implement api"
    - "design endpoint"
  files:                           # File patterns that trigger
    - "**/routes/**"
    - "**/controllers/**"

# SCALE APPLICABILITY
scale:
  - mvp                            # MVP/small projects
  - small                          # Small-medium teams
  - medium                         # Medium-large projects
  - large                          # Enterprise/large teams
  - all                            # All scales

# CAPABILITIES
capabilities:
  - discovery                      # Can discover project patterns
  - implementation                 # Can implement features
  - analysis                       # Can analyze code
  - review                         # Can review code
  - generation                     # Can generate code/files

# QUALITY METRICS
quality:
  rules_count: 0                   # Number of rules/checklists
  examples_count: 0                # Number of code examples
  last_audited: "2026-01-01"       # Last review date
  stability: stable                # experimental|beta|stable|deprecated

# INTEGRATION
integrates_with:
  - auto-route                     # Compatible entry points
  - analyze-project
  - project-init
integrations:
  auto-route:
    auto_invoke_priority: 50      # 0-100, higher = more likely
    skill_tier: context            # core|context|optional
  analyze-project:
    detection_priority: 10          # 0-100 for sorting
    output_section: recommendations

# SOURCE INFORMATION
source:
  origin: merged                   # merged|local|external
  sources:
    - "Jeffallan/claude-skills:skill-name"
  merged_date: "2026-01-01"

# METADATA
author: "thevoidsyntax"                  # Maintainer
maintained_by: team               # individual|team|community|none
license: MIT                      # License type
---
```

---

## Field Definitions

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier in kebab-case |
| `description` | string | One-line description (max 200 chars) |
| `version` | string | Semantic version (x.y.z) |

### Classification Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string[] | [] | Primary categories (see below) |
| `priority` | string | medium | high/medium/low |
| `phase` | string | any | Project phase relevance |

#### Categories

- `backend` - API, databases, server logic
- `frontend` - UI, state, browser
- `infrastructure` - DevOps, cloud, containers
- `security` - Auth, encryption, compliance
- `data` - ETL, analytics, warehousing
- `process` - Team, docs, quality
- `ai` - ML, LLM, data science
- `domain` - Business logic, modeling

### Tech Stack Fields

| Field | Description |
|-------|-------------|
| `tech_stack.languages` | Programming languages (nodejs, python, go, rust, etc.) |
| `tech_stack.frameworks` | Web frameworks (fastify, express, django, etc.) |
| `tech_stack.databases` | Database technologies (postgresql, mongodb, redis, etc.) |
| `tech_stack.services` | External services (aws, docker, kubernetes, etc.) |

### Relationships

| Field | Type | Description |
|-------|------|-------------|
| `dependencies` | string[] | Skills that must be loaded before this |
| `conflicts` | string[] | Skills that should not be loaded with this |

### Auto-Invocation

```yaml
auto_invoke:
  enabled: true                    # Master switch
  conditions:                      # AND/OR conditions
    - tech_stack: [fastify]       # Any match triggers
      reason: "API detected"
    - phase: phase-2
      reason: "Core phase"
  skip_if:                         # Override conditions
    - has_file: "**/skill.ts"
      reason: "Already implemented"
```

### Triggers

```yaml
triggers:
  commands:                       # Slash commands
    - /api-design
  phrases:                        # Natural language
    - "design api"
    - "create endpoint"
  files:                          # File pattern matching
    - "**/routes/**"
    - "**/schemas/**"
```

### Scale Applicability

| Value | Description |
|-------|-------------|
| `mvp` | MVP/Prototype (< 100 users) |
| `small` | Small team (1-5 devs) |
| `medium` | Medium team (5-20 devs) |
| `large` | Large team (20+ devs) |
| `all` | Universal applicability |

### Capabilities

| Capability | Description |
|------------|-------------|
| `discovery` | Can detect project patterns and tech stack |
| `implementation` | Can implement features from scratch |
| `analysis` | Can analyze existing code |
| `review` | Can review code quality |
| `generation` | Can generate files and code |

### Quality Metrics

| Field | Description |
|-------|-------------|
| `quality.rules_count` | Number of rules/checklists |
| `quality.examples_count` | Number of code examples |
| `quality.last_audited` | ISO date of last review |
| `quality.stability` | experimental/beta/stable/deprecated |

### Integration

```yaml
integrates_with:
  - auto-route                    # Compatible entry points
  - analyze-project
  - project-init

integrations:
  auto-route:
    auto_invoke_priority: 50      # 0-100
    skill_tier: context            # core|context|optional
```

---

## Skill Tier Definitions

| Tier | Priority Range | Description |
|------|----------------|-------------|
| `core` | Always invoked | Essential for any project (git, docker, etc.) |
| `context` | Score >= 20 | Based on detected tech stack/phase |
| `optional` | Score < 20 | User selection only |
| `hidden` | Score = 0 | Not shown except in verbose mode |

---

## Scoring Algorithm

Skills are scored based on:

| Factor | Points | Description |
|--------|--------|-------------|
| `is_core` | +10 | Tier = core |
| `tech_stack_match` | +25 | Language/framework detected |
| `phase_match` | +30 | Required by current phase |
| `scale_match` | +15 | Appropriate for project size |
| `dependencies_resolved` | +5 | Dependencies already loaded |
| `already_implemented` | -100 | Files already exist |

---

## Minimal Example

```yaml
---
name: my-skill
description: "What this skill does in one line"
version: "1.0.0"
---
```

## Full Example

```yaml
---
name: api-design
description: "REST, GraphQL, gRPC patterns and best practices"
version: "1.1.0"
category: [backend]
priority: medium
phase: phase-2
tech_stack:
  frameworks: [express, fastify, nestjs, django, fastapi]
dependencies: [security, config]
auto_invoke:
  enabled: true
  conditions:
    - tech_stack: [express, fastify, nestjs]
      reason: "Web framework detected"
scale: [mvp, small, medium, large]
capabilities: [implementation, review]
quality:
  rules_count: 12
  examples_count: 25
  last_audited: "2026-01-01"
  stability: stable
integrates_with: [auto-router, analyze-project]
source:
  origin: merged
  sources: ["Jeffallan/claude-skills:api-designer"]
---
```

---

## Implementation Notes

1. **Frontmatter Format**: Use YAML block after `---` at top of file
2. **Validation**: Parse and validate with `skillspector` tool
3. **Updates**: Update version when content changes significantly
4. **Deprecations**: Mark deprecated skills with `quality.stability: deprecated`

---

**Schema Version:** 1.0.0 | **Last Updated:** 2026-10-05
