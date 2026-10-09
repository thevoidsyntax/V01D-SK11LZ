---
name: research
description: Investigate a question against high-trust primary sources and capture findings as Markdown.
version: "1.2.0"
priority: medium
category: [process]
phase: any
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - phrase: ["research", "investigate", "find out", "look into"]
      reason: "Research intent detected"
capabilities: [analysis]
quality:
  rules_count: 12
  examples_count: 8
  stability: stable
integrates_with: [documentation, writing-for-agents]
source:
  origin: local
author: thevoidsyntax
---

# Research Skill

Investigate a question thoroughly using primary sources and document findings.

## Purpose

Use this skill when:
- User wants a topic researched
- Facts need to be gathered from sources
- Reading legwork needs to be delegated
- Technical decisions need backing from official docs

## Research Process

### 1. Spawn Background Agent

Create a background agent to do the research while you continue working.

```
Agent({
  prompt: "Research [topic]...",
  description: "research: [topic]"
})
```

### 2. Define Research Scope

Clearly define:
- The question to answer
- Types of sources to consult
- Deliverable format

### 3. Source Priority

Consult sources in order of trust:
1. **Primary sources**: Official docs, specs, source code
2. **Authoritative secondary**: Well-reviewed articles
3. **Community**: Stack Overflow, forums (with verification)

### 4. Verification

For every claim:
- Trace back to source
- Verify the source is authoritative
- Note any conflicting information
- Flag uncertain claims

### 5. Document Findings

Write findings to Markdown file with:
- Clear question/answer format
- Source citations for each claim
- Confidence levels
- Open questions

## Research Output Template

```markdown
# Research: [Topic]

**Question**: [What we wanted to find out]
**Date**: YYYY-MM-DD
**Confidence**: High|Medium|Low

## Summary
[Brief answer to the question]

## Findings

### Finding 1
**Source**: [URL or reference]
**Confidence**: [Level]
**Content**: [What we learned]

### Finding 2
...

## Open Questions
- [Question 1]
- [Question 2]

## References
- [1]: [Source URL]
- [2]: [Source URL]
```

## Best Practices

1. **Always cite sources**: Never make uncited claims
2. **Primary first**: Go to official docs, not summaries
3. **Follow citations**: Check references in sources
4. **Note uncertainty**: Flag when information is unclear
5. **Think critically**: Question official claims too

## Example Research Tasks

- "Research Next.js 14 app router patterns"
- "Find best practices for TypeScript error handling"
- "Investigate PostgreSQL JSONB performance"
- "Research WebSocket scaling strategies"
