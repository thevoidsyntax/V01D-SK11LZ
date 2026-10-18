---
name: create-release
description: "Streamlined release creation with changelog generation and semantic versioning"
when_to_use: "Use when cutting a release: version bump, changelog generation, and tagging."
version: "1.1.0"
category: [workflow]
priority: medium
phase: deploy
auto_invoke:
  enabled: true
  conditions:
    - command: ["/create-release", "/release"]
      reason: "Create a release"
    - phrase: ["create release", "make release", "publish version"]
      reason: "Intent to create release"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [git, commit, ci-cd]
capabilities: [implementation]
quality:
  rules_count: 10
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
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
