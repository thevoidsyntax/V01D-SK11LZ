---
name: superpowers
version: "1.0.0"
description: "Agentic skills framework with structured workflow - Brainstorming → Planning → Implementation → Code Review"
when_to_use: "Use when starting new projects or features. Provides structured workflow from brainstorming to implementation with autonomous task execution."
priority: high
phase: planning
category: [workflow, methodology, project-management]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/superpowers", "/workflow", "/plan"]
      reason: "Structured project workflow and planning"
    - phrase: ["new project", "start planning", "structured workflow"]
      reason: "Planning and project setup"
capabilities: [implementation, analysis, planning]
source:
  origin: external
  repo: "https://github.com/obra/superpowers"
author: obra (via GitHub)
---

# SUPERPOWERS v1.0

**Agentic Skills Framework & Software Development Methodology**

> Composable skills that activate automatically during development workflows.

---

## Overview

Superpowers provides a structured workflow for AI coding agents that doesn't jump straight into code. Instead, it guides through: Clarifying → Designing → Planning → Implementing → Reviewing.

### Key Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│  The ladder runs AFTER it understands the problem,       │
│  NOT INSTEAD of it.                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Workflow Stages

### Stage 1: Clarify

```
┌─────────────────────────────────────────────────────────────┐
│  BEFORE WRITING CODE: Ask questions!                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Who is the user?                                    │
│  2. What problem are we solving?                         │
│  3. What does success look like?                        │
│  4. What are the constraints?                          │
│  5. What could go wrong?                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Stage 2: Design

```
┌─────────────────────────────────────────────────────────────┐
│  CREATE DESIGN DOCUMENT                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. High-level architecture                             │
│  2. Data model                                         │
│  3. API contracts                                      │
│  4. Key decisions + rationale                          │
│  5. Risks + mitigations                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Stage 3: Plan

```
┌─────────────────────────────────────────────────────────────┐
│  CREATE TASK PLAN                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Break into actionable tasks                          │
│  2. Order by dependency                                │
│  3. Identify critical path                            │
│  4. Estimate complexity                               │
│  5. Define acceptance criteria                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Stage 4: Implement

```
┌─────────────────────────────────────────────────────────────┐
│  EXECUTE AUTONOMOUSLY                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Work through tasks sequentially                     │
│  2. Self-review after each task                        │
│  3. Run tests after each task                          │
│  4. Update task list as you go                        │
│  5. Flag blockers early                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Stage 5: Review

```
┌─────────────────────────────────────────────────────────────┐
│  FINAL REVIEW                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Does it meet acceptance criteria?                    │
│  2. Are there security concerns?                        │
│  3. Is the code maintainable?                          │
│  4. Is documentation updated?                          │
│  5. Any follow-up tasks?                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## TDD Enforcement

```
┌─────────────────────────────────────────────────────────────┐
│  TEST-DRIVEN DEVELOPMENT                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  RED:   Write failing test first                        │
│  GREEN: Write minimal code to pass                       │
│  REFACTOR: Improve without breaking tests                │
│                                                              │
│  98% of risky logic ships with tests (vs 68% without)    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Subagent Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  AUTONOMOUS TASK EXECUTION                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Main Agent → Spawns Subagents for:                        │
│  • Research tasks                                        │
│  • Implementation tasks                                 │
│  • Review tasks                                         │
│                                                              │
│  Each subagent:                                         │
│  • Has clear context                                    │
│  • Reports back to main agent                           │
│  • Main agent synthesizes results                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration

### Supported Agents
- Claude Code
- Codex CLI
- Cursor
- Devin
- Gemini
- And 15+ others

### Install
```
Claude Code: /plugin install superpowers@claude-plugins-official
```

---

**Invoke:** `/superpowers` | **Version:** 1.0.0

---

*Based on: https://github.com/obra/superpowers*
