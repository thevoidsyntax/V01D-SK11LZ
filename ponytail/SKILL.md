---
name: ponytail
description: "Code-less philosophy - 'The best code is the code you never wrote.' Minimizes code written by checking need, existing, stdlib, and native solutions first."
when_to_use: "Use when you want to minimize code written. Invoke before writing any code to check if it's necessary. Hexa runs it before code, Athena before adding a component to the design, Frans before adding infrastructure."
metadata:
  version: "1.1.1"
---

# PONYTAIL v1.1

**Code-Less Philosophy for AI Coding Agents**

> "The best code is the code you never wrote."

---

## Overview

Ponytail teaches AI coding agents to minimize code written by checking existing solutions before implementing new ones.

### Key Metrics

| Metric | Without Ponytail | With Ponytail |
|--------|-----------------|----------------|
| Lines of code | 100% | ~47% |
| Development time | 100% | ~59% |
| Cost | 100% | ~74% |
| Tokens | 100% | ~55% |

---

## Core Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│  BEFORE WRITING CODE, ASK:                                    │
│                                                              │
│  1. NEED     → Apakah perlu ada?                            │
│  2. EXISTING → Apakah sudah ada?                           │
│  3. STDLIB   → Apakah stdlib sudah cukup?                 │
│  4. NATIVE    → Apakah platform native sudah cukup?         │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Flow

```
START: Need to solve a problem
       │
       ▼
┌─────────────────┐
│ 1. NEED?        │
│ Can skip/simplify?│
└────────┬────────┘
         │
    ┌────┴────┐
    │ YES      │ NO
    ▼          ▼
  SKIP      ┌─────────────────┐
            │ 2. EXISTING?    │
            │ Reuse code/lib?  │
            └────────┬────────┘
                     │
                ┌────┴────┐
                │ YES      │ NO
                ▼          ▼
              REUSE    ┌─────────────────┐
                       │ 3. STDLIB?      │
                       │ Built-in enough?  │
                       └────────┬────────┘
                               │
                          ┌────┴────┐
                          │ YES      │ NO
                          ▼          ▼
                       USE STDLIB  ┌─────────────────┐
                                  │ 4. NATIVE?       │
                                  │ OS/browser APIs?  │
                                  └────────┬────────┘
                                          │
                                     ┌────┴────┐
                                     │ YES      │ NO
                                     ▼          ▼
                                  USE NATIVE  WRITE CODE
                                             (minimal)
```

---

## Checklist (Before Writing Code)

### 1. NEED - Can it be skipped?
- [ ] Is this feature truly required?
- [ ] Can the user accept "no" or "later"?
- [ ] Is this a nice-to-have vs must-have?

### 2. EXISTING - Can it be reused?
- [ ] Existing function in codebase?
- [ ] Existing library/package?
- [ ] Similar implementation elsewhere?

### 3. STDLIB - Is built-in enough?

| Language | Useful stdlib |
|----------|--------------|
| Python | itertools, functools, collections, builtins |
| JS/TS | lodash methods, Array/String methods, Object.\* |
| Go | standard library packages |
| Rust | std crate |
| Java | java.util, java.stream |

### 4. NATIVE - Is platform native enough?

| Platform | Native APIs |
|----------|-----------|
| Browser | CSS, Web APIs, Platform APIs |
| Node.js | fs, path, crypto (built-in) |
| OS | Shell commands, system tools |
| Database | SQL functions, stored procedures |

---

## Examples

### Example 1: Remove Duplicates

**Before (Write new):**
```python
def remove_duplicates(items):
    result = []
    for item in items:
        if item not in result:
            result.append(item)
    return result
```

**After (Use stdlib):**
```python
# Python 3.7+: dict preserves order
def remove_duplicates(items):
    return list(dict.fromkeys(items))
```

**After (Use built-in if available):**
```python
# Or simpler
return list(set(items))  # if order doesn't matter
```

### Example 2: Group By

**Before (Write new):**
```typescript
function groupBy(arr: any[], key: string): Record<string, any[]> {
  const result = {};
  for (const item of arr) {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
  }
  return result;
}
```

**After (Use stdlib):**
```typescript
// Lodash (if already using)
// or native:
const groupBy = (arr, key) => arr.reduce((acc, item) => {
  const group = item[key];
  (acc[group] ??= []).push(item);
  return acc;
}, {});
```

### Example 3: Debounce Function

**Before (Write new):**
```typescript
function debounce(fn: Function, delay: number) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

**After (Check if needed):**
```typescript
// Question: Does the project already have lodash?
// If yes: import debounce from 'lodash'
// If no: Is the native implementation minimal enough?
```

---

## Anti-Patterns

### DON'T:

```
❌ Write code before checking if needed
❌ Duplicate existing functionality
❌ Reinvent the wheel (stdlib exists)
❌ Over-engineer for hypothetical future
❌ Add features "just in case"
```

### DO:

```
✅ Ask: "Can this be simpler?"
✅ Ask: "Does this already exist?"
✅ Ask: "Is stdlib sufficient?"
✅ Ask: "Can platform native handle it?"
✅ Write minimal code only when necessary
```

---

## Reviewing existing code

There are no sub-commands. To review a diff or a module, run the same checklist over each added function, file, and dependency: is it needed, does the code base or stdlib already do it, is there a native platform feature. List what can be deleted or replaced, with file:line.

---

## Workflow

```
USER: "Add user authentication"
       │
       ▼
Ponytail Check:
       │
       ├── 1. NEED? → Auth truly needed? YES
       ├── 2. EXISTING? → NextAuth already exists? YES → USE IT
       └── └── └── → No new code written!
```

---

**Invoke:** `/ponytail` | **Version:** 1.0.0

---

*Based on: https://github.com/DietrichGebert/ponytail*
