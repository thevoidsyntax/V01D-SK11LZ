---
name: graphify
version: "1.0.0"
description: "Knowledge graph for codebases - Local AST parsing, zero data leaves machine, 80% token reduction"
when_to_use: "Use when you need to understand codebase structure, trace dependencies, or query code relationships. Provides 80% token reduction."
priority: high
phase: any
category: [knowledge, codebase, analysis]
tech_stack:
  languages: [all]
  frameworks: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/graphify", "/codebase-graph", "/code-map"]
      reason: "Codebase understanding and knowledge graph"
    - phrase: ["understand codebase", "code structure", "dependencies", "trace code"]
      reason: "Codebase analysis and visualization"
capabilities: [analysis, implementation]
source:
  origin: external
  repo: "https://github.com/Graphify-Labs/graphify"
author: Graphify-Labs (via GitHub)
---

# GRAPHIFY v1.0

**Knowledge Graph for Codebases**

> Transform codebases into queryable knowledge graphs. Local AST parsing - zero data leaves your machine.

---

## Overview

Graphify parses your codebase using deterministic tree-sitter AST parsing and builds a knowledge graph. Every connection is tagged as EXTRACTED (explicit source) or INFERRED (resolved).

### Key Features

| Feature | Description |
|---------|-------------|
| Local-only | Code processed via AST, no data leaves machine |
| Graph traversal | Query relationships, not vectors |
| 80% token reduction | Query graph instead of re-reading files |
| 40+ languages | Universal language support |
| Community detection | Groups related code |

---

## Commands

```
┌─────────────────────────────────────────────────────────────┐
│  GRAPHIFY COMMANDS                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  graphify .                    Build the knowledge graph    │
│  graphify install               Register as AI skill          │
│  graphify query "question"     Query with natural language  │
│  graphify path A B             Trace A → B relationship   │
│  graphify explain "Concept"    Get details on a node       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Graph Structure

```
┌─────────────────────────────────────────────────────────────┐
│  GRAPH NODES                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Functions → Calls → Functions                            │
│  Classes  → Contains → Methods                           │
│  Imports  → References → Modules                        │
│  Inherits → Extends → Parent classes                   │
│  Mixes-in → Uses → Traits/mixins                        │
│                                                              │
│  EDGE TYPES:                                             │
│  EXTRACTED - Explicit source code relationship            │
│  INFERRED  - Resolved dynamic relationship              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Use Cases

### For Satria (PM)

```
• Quick project comprehension
• Trace feature implementation
• Understand code dependencies
• Identify technical debt hotspots
• Document system architecture
```

### For Athena (SE)

```
• Understand codebase structure
• Trace function dependencies
• Find code patterns
• Refactor planning
• Architecture analysis
```

### For All Personas

```
• "Where is this function called?"
• "What depends on this module?"
• "How does A connect to B?"
• "What classes use this interface?"
```

---

## Integration

### Claude Code

```
Type /graphify directly in Claude Code
```

### Generated Files

```
• graph.html - Interactive visualization
• GRAPH_REPORT.md - Summary
• graph.json - Full graph for queries
```

---

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  WORKFLOW                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. graphify .                Build graph              │
│  2. graphify query            Natural language query     │
│  3. graphify path A B        Trace relationship        │
│  4. graphify explain         Get node details           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation

```bash
# Install
npm install -g graphify-ai

# Or use npx
npx graphify .

# Register as skill
graphify install
```

---

**Invoke:** `/graphify` | **Version:** 1.0.0

---

*Based on: https://github.com/Graphify-Labs/graphify*
