---
name: sync-docs
description: "Bidirectional documentation synchronization for skills, README, and manifest"
when_to_use: "Use when syncing docs across skills, README, and the manifest."
version: "2.1.0"
category: [documentation]
priority: medium
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/sync-docs", "/sync"]
      reason: "Sync documentation"
    - phrase: ["sync docs", "sync skills", "update readme"]
      reason: "Intent to sync documentation"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [documentation, skill-creator, skillspector]
capabilities: [implementation]
quality:
  rules_count: 8
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Sync Docs v2.0

> Keep documentation synchronized across skills library.

## Overview

Sync Docs adalah skill untuk menyinkronkan dokumentasi di seluruh skills library, termasuk:
- README.md ↔ SKILL.md metadata
- manifest.json ↔ actual skills
- SKILL_INDEX.md dengan daftar skills terbaru
- Category groupings

## Usage

```
Use sync-docs when:
- Adding new skills to the library
- Updating existing skills
- Generating README from manifest
- Syncing SKILL_INDEX.md
- Validating skill consistency
```

## Sync Operations

### 1. Full Sync (Default)

```bash
# Sync all documentation
```

**Actions:**
1. Scan all `*/SKILL.md` files
2. Extract metadata (name, description, category)
3. Update `README.md` with skill counts
4. Update `_docs/manifest.json`
5. Regenerate `_docs/SKILL_INDEX.md`

### 2. Quick Sync

```bash
# Quick sync - only update counts
```

**Actions:**
1. Count total skills
2. Verify all SKILL.md files exist
3. Update README.md stats

### 3. Validate

```bash
# Validate skill consistency
```

**Actions:**
1. Check all skills have frontmatter
2. Verify required fields
3. Report missing descriptions
4. Check for duplicates

## Sync Rules

```yaml
sync_rules:
  # README.md auto-generated sections
  readme_sections:
    - skills_overview      # Auto-generated from manifest
    - stats                # Total counts
    - categories          # Grouped skills
  
  # Manifest update triggers
  manifest_triggers:
    - new_skill_added
    - skill_renamed
    - skill_removed
    - category_changed
  
  # Index generation
  index_generation:
    - alphabetical: true
    - include_description: true
    - group_by_category: true
```

## File Structure

```
skills/
├── README.md                    # Auto-synced from manifest
├── _docs/
│   ├── manifest.json           # Skills inventory
│   └── SKILL_INDEX.md          # Alphabetical index
└── [skill-name]/
    └── SKILL.md                # Source of truth
```

## Frontmatter Schema

```yaml
---
name: skill-name
description: "Brief description (auto-extracted)"
version: "1.0.0"
category: [category1, category2]
priority: low|medium|high|critical
author: thevoidsyntax
---
```

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ SYNC WORKFLOW                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. SCAN                                                    │
│     └─► Find all SKILL.md files                            │
│                                                              │
│  2. EXTRACT                                                 │
│     └─► Parse frontmatter metadata                         │
│                                                              │
│  3. VALIDATE                                                │
│     ├─► Check required fields                              │
│     ├─► Detect duplicates                                   │
│     └─► Report inconsistencies                               │
│                                                              │
│  4. GENERATE                                                │
│     ├─► Update manifest.json                                 │
│     ├─► Update SKILL_INDEX.md                               │
│     └─► Update README.md                                    │
│                                                              │
│  5. REPORT                                                  │
│     └─► Show sync summary                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Validation Rules

| Rule | Description | Action |
|------|-------------|--------|
| `name_required` | Each skill must have a name | Error |
| `description_length` | Description 10-200 chars | Warning |
| `unique_names` | No duplicate skill names | Error |
| `valid_category` | Category in allowed list | Warning |
| `version_format` | Semver format (x.y.z) | Warning |

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║ SYNC REPORT - 2025-01-15                                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Total Skills: 100                                          ║
║  Categories: 17                                             ║
║                                                              ║
║  Files Updated:                                             ║
║  ├─ README.md ✓                                            ║
║  ├─ _docs/manifest.json ✓                                   ║
║  └─ _docs/SKILL_INDEX.md ✓                                  ║
║                                                              ║
║  Validation:                                                ║
║  ├─ Errors: 0                                              ║
║  ├─ Warnings: 3                                            ║
║  └─ Info: 0                                                ║
║                                                              ║
║  [Details]                                                  ║
║  • 3 skills missing version field                           ║
║  • 1 category needs mapping                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Integrations

| Skill | Integration Point |
|-------|-------------------|
| `/skill-creator` | Auto-invoke after creating new skill |
| `/skillspector` | Use for validation rules |
| `/documentation` | Template generation |

## Examples

### Adding New Skill

```bash
# 1. Create skill with skill-creator
/skill-creator new-skill

# 2. Sync automatically runs
# OR manually trigger:
/sync-docs
```

### Manual Trigger

```
/sync-docs --full    # Full sync
/sync-docs --quick   # Quick sync
/sync-docs --validate  # Validation only
```

## Categories Mapping

```json
{
  "categories": {
    "devops": ["git", "docker", "ci-cd", "kubernetes", ...],
    "security": ["security", "pentest", "identity", ...],
    "quality": ["testing", "tdd", "code-quality", ...],
    "architecture": ["architecture-patterns", "domain-modeling", ...],
    "database": ["database", "postgresql-pro", "mongodb-pro", ...],
    "api": ["api-design", "graphql", "messaging", ...],
    "observability": ["observability", "performance", ...],
    "cloud": ["cloud-architect", "networking", ...],
    "languages": ["typescript-pro", "python-pro", ...],
    "frontend": ["ui-ux-pro-max", "react-pro", ...],
    "ai-ml": ["ml-engineering", "langchain-architect", ...],
    "workflow": ["new-issue", "pr-review", ...],
    "strategy": ["wayfinder", "feature-forge", ...],
    "browser": ["dev-browser", "browser-use"],
    "anti-ai": ["anti-slop", "skill-creator"],
    "specialized": ["gaming", "iot-edge", ...],
    "meta": ["autor", "mem-search", ...]
  }
}
```

---

**Invoke:** /sync-docs | **Priority:** MEDIUM | **Version:** 2.0.0
