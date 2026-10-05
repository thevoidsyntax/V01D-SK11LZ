---
name: chisle
description: Token optimization skill for AI coding agents. Cuts token bills on three axes: terse prose, YAGNI-first code, and tool-output compression. Estimated 40% token savings.
when_to_use: Use when you need to optimize token usage. Apply before starting complex tasks to minimize API costs. Best for long-running projects or when approaching token limits.
tokenSaving: high
version: 1.0.0
priority: high
phase: any
author: TheVoidSyntax
source: github.com/genshijin/Chisle
---

# Chisle - Token Optimization

Cuts AI coding agent token bills on three axes: terse prose, YAGNI-first code, and tool-output compression.

## Overview

Chisle is designed to minimize token consumption while maintaining output quality. It focuses on three core principles:

1. **Terse Prose** - Concise, direct language
2. **YAGNI-First Code** - Write only what's needed
3. **Tool-Output Compression** - Minimize intermediate outputs

## Token Saving Strategies

### 1. Terse Prose

| Technique | Token Savings |
|-----------|---------------|
| Short sentences | 20-30% |
| Abbreviated context | 15-25% |
| Direct commands | 10-15% |

### 2. YAGNI-First Code

```
DON'T: Write comprehensive code with all features
DO: Write minimal code that solves the immediate problem
```

Principles:
- Avoid premature abstraction
- Defer complexity until required
- Prefer composition over inheritance
- Delete unused code immediately

### 3. Tool-Output Compression

| Tool | Compression Technique |
|------|---------------------|
| grep/find | Use --quiet, limit output |
| cat | Pipe to head |
| ls | Use -1 (single column) |
| git | Use --oneline, --short |

## Usage Guidelines

### Before Writing Code
```
1. State requirements minimally
2. Avoid verbose explanations
3. Specify only essential constraints
```

### When Writing Code
```
1. Implement minimal viable solution
2. Skip defensive programming
3. Delete comments that restate code
4. Use short variable names in context
```

### Tool Commands
```bash
# Instead of: ls -la
ls -1

# Instead of: find . -type f
find . -type f -maxdepth 3

# Instead of: cat large-file.txt
head -20 large-file.txt
```

## Example Transformations

### Verbose → Concise

**Before:**
```
Please analyze the following code and provide a detailed explanation of each function, 
including its purpose, parameters, return values, and any side effects it may have. 
Additionally, identify any potential bugs or security vulnerabilities.
```

**After:**
```
Analyze code: find bugs, security issues
```

### Over-Engineered → YAGNI

**Before:**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  phone: string;
  address: Address;
  preferences: Preferences;
  createdAt: Date;
  updatedAt: Date;
}
```

**After:**
```typescript
interface User {
  id: string;
  email: string;
}
```

## Integration with Claude Code

To enable Chisle token saving:

```
Apply Chisle optimization:
- Use terse prose
- YAGNI-first approach
- Compress tool outputs
Expected: ~40% token reduction
```

## Best Practices

1. **Start minimal** - Add only when needed
2. **Short responses** - Avoid unnecessary explanation
3. **Direct commands** - State what, not how
4. **Compress context** - Include only relevant info
5. **Skip acknowledgments** - No "Sure", "Here is", etc.

---

**Repository:** genshijin/Chisle
**Token Savings:** ~40%
