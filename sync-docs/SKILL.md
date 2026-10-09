---
name: sync-docs
description: Bidirectional documentation synchronization
version: "1.0.0"
category: [documentation, tooling]
priority: medium
phase: any
author: Claude
---

# Sync Docs

Keep documentation synchronized across sources.

## Usage

```
Use sync-docs when:
- Updating docs in multiple places
- Syncing README to docs folder
- Keeping API docs in sync with implementation
- Migrating documentation formats
```

## Sync Types

### File-to-File
Mirror content between specific files

### Template-to-Instance
Update generated docs from templates

### Source-to-Docs
Extract docs from code comments

## Configuration

```yaml
sync_rules:
  - source: docs/api.md
    target: README.md
    bidirectional: true
  - source: src/**/*.md
    target: docs/generated/
    strategy: aggregate
```

## Integrations

Works with: `documentation`, `writing-for-agents`
