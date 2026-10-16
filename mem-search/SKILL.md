---
name: mem-search
description: "Memory and knowledge base search capabilities for finding context and session history"
version: "1.1.0"
category: [meta]
priority: medium
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/mem-search", "/search-memory", "/remember"]
      reason: "Memory search"
    - phrase: ["search memory", "find in memory", "what did we", "remember this"]
      reason: "Memory context"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [autor, research]
capabilities: [analysis]
quality:
  rules_count: 8
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Memory Search

Search across session memory and knowledge corpus.

## Usage

```
Use mem-search when:
- Finding relevant past decisions
- Searching codebase history
- Locating similar implementations
- Retrieving accumulated knowledge
```

## Capabilities

- Semantic search across sessions
- Filter by date, project, type
- Full-text search
- Similarity matching

## Integrations

Works with: `research`, `wayfinder`
