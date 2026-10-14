---
name: chisle
description: "Token optimization and cost reduction for LLM interactions"
version: "1.1.0"
category: [optimization]
priority: medium
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/chisle", "/token-optimize"]
      reason: "Token optimization"
    - phrase: ["optimize tokens", "reduce cost", "token usage"]
      reason: "Cost optimization context"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [llm-evaluation]
capabilities: [analysis]
quality:
  rules_count: 6
  examples_count: 3
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Chisle (Token Optimization)

Optimize token usage in LLM interactions to reduce costs and improve response quality.

## Usage

```
Use chisle when:
- Reducing API costs is a priority
- Long conversation history needs summarization
- Need to maximize context window efficiency
- Building token-budget aware prompts
```

## Techniques

- Prompt compression
- Conversation summarization strategies
- Context pruning
- Semantic deduplication
- Priority-based context retention

## Metrics

Track: token count, cost per request, context utilization %
