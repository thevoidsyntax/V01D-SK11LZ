---
name: mem-search
description: "Persistent memory system for Claude Code - search project history, track decisions, and maintain context across sessions"
version: "1.0.0"
category: [meta]
priority: high
phase: any
tech_stack:
  languages: [all]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - phrase: ["memory", "history", "remember", "context", "session"]
      reason: "Memory/context related"
  skill_tier: optional
triggers:
  phrases:
    - "memory"
    - "search history"
    - "remember"
    - "context"
    - "past session"
capabilities: [analysis, implementation]
quality:
  rules_count: 10
  examples_count: 5
  stability: stable
integrates_with: [diagnosing-bugs, audit]
dependencies: []
source:
  origin: external
  sources: ["thedotmack/claude-mem"]
author: thedotmack
---

# mem-search - Persistent Memory for Claude Code

Persistent memory system that preserves context across sessions by capturing tool usage observations, generating semantic summaries, and making them available to future sessions.

## Overview

```
Claude-Mem captures everything your agent does during sessions,
compresses it with AI, and injects relevant context back into
future sessions.
```

## Installation

```bash
npx claude-mem install
```

This will:
1. Install the worker service (local HTTP API)
2. Set up SQLite database for storage
3. Configure Chroma vector database for semantic search
4. Register the `mem-search` skill

## Core Features

| Feature | Description |
|---------|-------------|
| **Persistent Memory** | Context survives across sessions |
| **Progressive Disclosure** | Layered memory retrieval with token cost visibility |
| **Semantic Search** | Natural language query project history |
| **Privacy Control** | `<private>` tags to exclude sensitive content |
| **Citations** | Reference past observations with IDs |

## 3-Layer Search Workflow

Instead of fetching everything at once, use progressive disclosure:

### Layer 1: Search (Compact Index)
```bash
search(query="authentication bug", type="bugfix", limit=10)
```
Returns: Compact index with IDs (~50-100 tokens/result)

### Layer 2: Timeline (Context)
```bash
timeline(ids=[123, 456])
```
Returns: Chronological context around results

### Layer 3: Full Details
```bash
get_observations(ids=[123, 456])
```
Returns: Full observation details (~500-1,000 tokens/result)

**~10x token savings** by filtering before fetching details

## Lifecycle Hooks

Claude-Mem captures data at these points:

1. **SessionStart** - Session initialization
2. **UserPromptSubmit** - User input captured
3. **PostToolUse** - Tool usage observations
4. **Stop** - When session pauses
5. **SessionEnd** - When session ends

## Privacy Control

Use `<private>` tags to exclude sensitive content:

```
The API key is <private>sk-1234567890abcdef</private>
This file contains <private>proprietary algorithm</private>
```

## Configuration

Settings in `~/.claude-mem/settings.json`:

```json
{
  "model": "claude-opus-4",
  "port": 3100,
  "dataDir": "~/.claude-mem",
  "logLevel": "info",
  "context": {
    "maxTokens": 8000,
    "includePrivate": false
  }
}
```

## Quick Commands

```bash
# Install claude-mem
npx claude-mem install

# Start the worker
npm run mem:start

# Stop the worker
npm run mem:stop

# View web UI
open http://localhost:3100
```

## Use Cases

### 1. Debugging
```
User: "Why is the auth failing?"
Claude: searches mem for "authentication bug"
→ Finds previous auth issues and solutions
```

### 2. Code Review
```
User: "Review this PR"
Claude: searches mem for "similar patterns"
→ Finds related decisions and context
```

### 3. Project Continuity
```
New session: "Continue the API work"
Claude: searches mem for "API development"
→ Loads previous context and decisions
```

### 4. Decision Tracking
```
Claude: captures "Using JWT for auth"
→ Available in future sessions
```

## Supported Platforms

- Claude Code
- OpenClaw
- Codex
- Gemini
- Hermes
- Copilot
- OpenCode
- T3 Code
- Antigravity CLI
- Pi
- DeepSeek Harness

## Resources

- **Documentation**: [docs.claude-mem.ai](https://docs.claude-mem.ai/)
- **GitHub**: [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)

---

**Invoke:** `/mem-search` | **Version:** 1.0.0
**Install:** `npx claude-mem install`
