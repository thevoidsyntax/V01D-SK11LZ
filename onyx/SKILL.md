---
name: onyx
version: "1.0.0"
description: "Open source AI knowledge platform - RAG for organizational knowledge with 50+ app integrations"
when_to_use: "Use when you need to query organizational knowledge, connect to enterprise data sources, or build RAG systems."
priority: medium
phase: any
category: [knowledge, rag, infrastructure]
tech_stack:
  languages: [all]
  frameworks: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/onyx", "/knowledge-platform", "/rag-enterprise"]
      reason: "Knowledge platform and enterprise RAG"
    - phrase: ["enterprise knowledge", "organizational knowledge", "rag platform"]
      reason: "Building knowledge systems"
capabilities: [implementation, analysis]
source:
  origin: external
  repo: "https://github.com/onyx-dot-app/onyx"
author: onyx-dot-app (via GitHub)
---

# ONYX v1.0

**Open Source AI Knowledge Platform**

> RAG for organizational knowledge with 50+ app integrations.

---

## Overview

Onyx connects to enterprise data sources to build a knowledge layer for AI agents. It indexes organizational knowledge and surfaces it through natural language queries.

### Key Features

| Feature | Description |
|---------|-------------|
| Agentic RAG | Hybrid search and retrieval |
| 50+ Integrations | Connects to enterprise apps |
| MCP Server | AI agent integration |
| Deep Research | Multi-step reports |
| Self-hosted | Full control, no data leaves your infra |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  ONYX ARCHITECTURE                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Data Sources          Indexing         Query Interface      │
│  ─────────────        ─────────        ────────────────     │
│  • Slack              →  Vector DB  →  AI Chat          │
│  • Confluence         →  Graph DB  →  Search             │
│  • GitHub             →  Full-text  →  Deep Research    │
│  • Notion             →  Knowledge  →  MCP Server        │
│  • Jira               →  Graph    →  API              │
│  • ...                →  Graph    →  Web UI            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Use Cases

### For DevOps (Frans)

```
• Query infrastructure docs
• Search deployment runbooks
• Find incident history
• Access monitoring dashboards
• Query configuration management
```

### For System Architects (Athena)

```
• Search codebase documentation
• Find API specifications
• Query architecture decisions
• Access technical specs
• Search code patterns
```

### For QA (Dina)

```
• Query test documentation
• Search bug databases
• Find test plans
• Access compliance docs
• Search security policies
```

---

## Deployment Options

| Mode | Memory | Features |
|------|--------|----------|
| Standard | Full | All RAG features |
| Lite | <1GB | Sub-1GB memory |

### Install

```bash
curl -fsSL https://onyx.app/install_onyx.sh | bash

# Or Docker
docker run -p 8080:8080 onyx/onyx
```

---

## MCP Server

Onyx provides an MCP server for AI agents:

```
Claude Code → MCP → Onyx → Enterprise Data Sources
```

### Configure

```json
{
  "mcpServers": {
    "onyx": {
      "command": "onyx-mcp",
      "args": ["--config", "/path/to/config"]
    }
  }
}
```

---

## Enterprise Features

```
┌─────────────────────────────────────────────────────────────┐
│  ENTERPRISE FEATURES                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  • RBAC (Role-Based Access Control)                       │
│  • SSO (Single Sign-On)                                    │
│  • Audit Logging                                          │
│  • Data Residency                                         │
│  • Self-hosted (full control)                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration with Our Skills

### With /mem-search

```
Onyx provides enterprise-grade knowledge retrieval.
For personal/local knowledge: use /mem-search
For organizational knowledge: use /onyx
```

### With /frans

```
Onyx can query:
• Infrastructure documentation
• Deployment runbooks
• Incident history
• Configuration management
```

---

**Invoke:** `/onyx` | **Version:** 1.0.0

---

*Based on: https://github.com/onyx-dot-app/onyx*
