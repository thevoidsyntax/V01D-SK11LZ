---
name: create-release
description: Streamlined release creation with changelog generation
version: "1.0.0"
category: [devops, process]
priority: medium
phase: deploy
author: Claude
---

# Create Release

Generate and manage software releases with automated changelog and tagging.

## Usage

```
Use create-release when:
- Preparing a new version release
- Generating release notes automatically
- Managing semantic version tags
- Creating GitHub/GitLab releases
```

## Workflow

1. Analyze commits since last release
2. Categorize changes (feat/fix/docs/perf)
3. Generate changelog
4. Create and push tags
5. Draft release notes

## Configuration

```yaml
# .claude/release.config
versioning: semver
changelog:
  types:
    - feat
    - fix
    - perf
    - docs
```
