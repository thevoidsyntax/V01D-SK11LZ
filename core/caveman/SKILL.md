---
name: caveman
version: "1.0.0"
description: "Token optimization tool for AI coding agents - aggressive compression with ~65% token reduction"
when_to_use: "Use when you want to minimize token usage in AI conversations. Provides caveman-style concise responses and aggressive context compression."
priority: medium
phase: any
category: [optimization, token-efficiency]
tech_stack:
  languages: [all]
  frameworks: [all]
  tools: [claude-code, claude-desktop, openai, github-copilot, cursor, vortex, rodev, continue, cursor, mintlify, lovy, windsurf, goose, rune, abei, goose, devin, swe-agent, aider, smol-developer, pilot, codebuddy]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/caveman", "/concise", "/terse"]
      reason: "User explicitly wants terse responses"
    - phrase: ["terse", "concise", "short", "minimal", "token efficient"]
      reason: "User wants minimal output"
capabilities: [implementation, analysis]
quality:
  rules_count: 15
  examples_count: 10
  stability: stable
source:
  origin: external
  repo: "https://github.com/JuliusBrussee/caveman"
author: JuliusBrussee (via skill ecosystem)
---

# CAVEMAN v1.0

**Token Optimization Tool for AI Coding Agents**

> "Why use many token when few token do trick."

---

## Overview

Caveman is a token optimization tool that reduces AI token usage by instructing coding agents to communicate in a terse, caveman-like style.

### Key Features

| Feature | Description | Token Savings |
|---------|-------------|--------------|
| **Say Less** | Concise "caveman voice" responses | ~68% reduction (63→20 tokens) |
| **Read Less** | Compress logs, JSON, CSV before reading | ~33% fewer input tokens |
| **Auto** | Auto-select model/effort per task | ~54% cheaper |

---

## Principles

### 1. SAY LESS - Caveman Voice

```
┌─────────────────────────────────────────────────────────────┐
│  PRINCIPLE: If few word do trick, use few word            │
└─────────────────────────────────────────────────────────────┘
```

**Before (Verbose):**
```typescript
// This function calculates the sum of two numbers
// It takes two parameters: a and b, both numbers
// It returns the sum of a and b
function calculateSumOfTwoNumbers(a: number, b: number): number {
  return a + b;
}
```

**After (Caveman):**
```typescript
// sum two numbers
function sum(a: number, b: number): number {
  return a + b;
}
```

### 2. READ LESS - Context Compression

Compress before reading:
- Logs: Remove timestamps, simplify stack traces
- JSON: Remove whitespace, compress repeated keys
- CSV: Remove headers for large datasets
- Code: Remove comments, keep logic

### 3. AUTO - Smart Effort Selection

Use minimal effort for simple tasks:
- Simple fix → Quick response
- Complex feature → Full analysis
- Bug → Debug first, then fix

---

## Rules for Concise Responses

### DO:
```markdown
✅ function name(params): returnType
✅ // short comment only if WHY not obvious
✅ // single line if possible
✅ // omit obvious comments
✅ use short variable names in examples
```

### DON'T:
```markdown
❌ // This function does X because Y
❌ // Step 1: Do this
❌ // Step 2: Then do that
❌ // Note: This is important because...
❌ overly descriptive variable names
```

---

## Implementation Examples

### Short Function
```typescript
// before
function calculateTheAreaOfACircle(radius: number): number {
  const pi = 3.14159;
  const area = pi * radius * radius;
  return area;
}

// after
function circleArea(r: number): number {
  return Math.PI * r ** 2;
}
```

### Short Class
```typescript
// before
class UserAuthenticationManager {
  private users: Map<string, User>;
  
  public async authenticateUser(username: string, password: string): Promise<AuthResult> {
    // Implementation here
  }
}

// after
class Auth {
  async login(u: string, p: string): Promise<AuthResult> {
    // Implementation
  }
}
```

### Short API Response
```typescript
// before
{
  "status": "success",
  "message": "User logged in successfully",
  "data": {
    "userId": 12345,
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}

// after
{ status: "ok", user: { id: 12345, name: "john" } }
```

### Short Error
```typescript
// before
Error: Connection refused. The database server at localhost:5432 
rejected the connection. Please check that the server is running 
and that the database credentials are correct.

// after
Error: DB conn refused - check server/credentials
```

---

## Caveats

- Use ONLY when user wants terse/short responses
- Don't sacrifice clarity for brevity
- Keep production code clear
- Use short forms only in examples/explanations

---

## Integration

Works with:
- Claude Code
- GitHub Copilot
- Cursor
- VS Code AI
- Any AI coding agent

---

**Invoke:** `/caveman` | **Version:** 1.0.0

---

*Based on: https://github.com/JuliusBrussee/caveman*
