---
name: error-debugger
version: "1.0.0"
description: "Structured error analysis and debugging helper. Parses errors, suggests fixes, and provides actionable solutions."
when_to_use: "When encountering bugs, errors, exceptions, or unexpected behavior in code."
priority: high
phase: any
category: [debugging, error-handling]
tech_stack:
  languages: [all]
  frameworks: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/debug", "/debugger", "/fix-error", "/explain-error", "/error"]
      reason: "Error debugging command"
    - pattern: ["error", "exception", "bug", "crash", "failed", "SyntaxError", "TypeError", "ReferenceError"]
      reason: "Error-related keywords detected"
      confidence: 0.7
capabilities:
  - error-parsing
  - stack-trace-analysis
  - solution-suggestion
  - fix-suggestion
author: TheVoidSyntax
---

# ERROR DEBUGGER v1.0 🔧

**Structured error analysis and debugging helper**

## Usage

```
/error-debugger            Analyze current error
/error-debugger [error]    Fix specific error
/error-debugger --explain  Explain error type
```

---

## How It Works

```
1. Parse error message and stack trace
2. Identify error type and root cause
3. Search for common patterns
4. Provide actionable fix suggestions
5. Generate working code fix
```

---

## Error Types Supported

### JavaScript/TypeScript

| Error Type | Common Cause | Quick Fix |
|------------|-------------|-----------|
| `SyntaxError` | Typos, missing brackets | Check syntax |
| `ReferenceError` | Undefined variable | Check variable scope |
| `TypeError` | Wrong type used | Check type assumptions |
| `RangeError` | Invalid array/index | Check bounds |
| `PromiseRejection` | Unhandled async errors | Add try/catch |
| `ImportError` | Wrong import path | Check module exists |

### Python

| Error Type | Common Cause | Quick Fix |
|------------|-------------|-----------|
| `SyntaxError` | Indentation/code errors | Check indentation |
| `ImportError` | Module not found | Check pip install |
| `TypeError` | Wrong type operation | Check types |
| `KeyError` | Missing dict key | Use .get() |
| `IndexError` | List index out of range | Check length |
| `AttributeError` | Attribute doesn't exist | Check object type |

### Go

| Error Type | Common Cause | Quick Fix |
|------------|-------------|-----------|
| `nil pointer` | Dereferencing nil | Check nil before use |
| `index out of range` | Slice bounds | Check length |
| `undefined` | Undeclared variable | Declare variable |
| `type assertion` | Interface nil | Check before assertion |

---

## Output Format

### Terminal Output

```
╔══════════════════════════════════════════════════════════════════════╗
║                          ERROR ANALYSIS                             ║
╠══════════════════════════════════════════════════════════════════════╣
║  🔴 Error Type: TypeError                                          ║
║  📍 Location: src/utils/parser.ts:15                              ║
║  💡 Root Cause: Cannot read property 'map' of undefined             ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  📋 ANALYSIS                                                        ║
║  ├── The variable 'data' is undefined at line 15                     ║
║  ├── Possible causes:                                              ║
║  │   1. API response returned null                                 ║
║  │   2. Async function didn't await properly                       ║
║  │   3. Variable not initialized                                   ║
║  │                                                                  ║
║  └── Confidence: HIGH (85%)                                       ║
║                                                                      ║
║  ✅ FIX SUGGESTIONS                                                ║
║                                                                      ║
║  1️⃣ Add null check:                                               ║
║  ```typescript                                                     ║
║  // Before                                                        ║
║  data.map(item => item.id)                                         ║
║                                                                      ║
║  // After                                                         ║
║  data?.map(item => item.id)                                        ║
║  ```                                                              ║
║                                                                      ║
║  2️⃣ Add fallback:                                                 ║
║  ```typescript                                                    ║
║  const safeData = data ?? []                                       ║
║  safeData.map(item => item.id)                                     ║
║  ```                                                              ║
║                                                                      ║
║  3️⃣ Ensure async/await:                                           ║
║  ```typescript                                                    ║
║  const response = await fetchData()                                ║
║  const data = response?.data                                       ║
║  ```                                                              ║
║                                                                      ║
║  ⏱️ Estimated fix time: 2 minutes                                   ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Error Pattern Library

### Pattern 1: Undefined/Null Errors

```
Common: "Cannot read property 'X' of undefined"
Cause: Accessing property on null/undefined
Fix: Optional chaining (?.) or null check
```

### Pattern 2: Async/Await Errors

```
Common: "Promise.pending" or undefined
Cause: Not awaiting async function
Fix: Add await keyword
```

### Pattern 3: Import Path Errors

```
Common: "Cannot find module" or "Module not found"
Cause: Wrong path or missing package
Fix: Check path or install package
```

### Pattern 4: Type Mismatch

```
Common: "Type 'X' is not assignable to type 'Y'"
Cause: Wrong type being passed
Fix: Cast or transform type
```

---

## Common Fix Templates

### JavaScript/TypeScript

```typescript
// Undefined check
const value = maybeUndefined?.property ?? defaultValue;

// Async error handling
try {
  const result = await asyncFunction();
} catch (error) {
  console.error('Failed:', error.message);
}

// Promise catch
asyncFunction()
  .then(result => /* use result */)
  .catch(error => /* handle error */);
```

### Python

```python
# Try-except with fallback
try:
    value = data['key']
except KeyError:
    value = default_value

# Optional get
value = data.get('key', default_value)
```

### Go

```go
// Nil check
if ptr != nil {
    // safe to dereference
}

// Error handling
result, err := function()
if err != nil {
    return nil, err
}
```

---

## Debug Commands

| Command | Action |
|---------|--------|
| `/error-debugger` | Analyze current error in context |
| `/error-debugger --stack` | Show detailed stack trace analysis |
| `/error-debugger --fix` | Apply suggested fix |
| `/error-debugger --explain` | Explain error in detail |
| `/error-debugger --similar` | Find similar past errors |

---

## Tips

1. **Paste the full error message** - Include stack trace if available
2. **Show the relevant code** - Include 5-10 lines around the error
3. **Describe what you expected** - Helps identify the root cause
4. **Mention what you tried** - Avoids repeating failed attempts

---

## Examples

### Example 1: JavaScript Error

```
Input: "TypeError: Cannot read property 'map' of undefined"

Analysis:
├── Error: TypeError
├── Cause: data is undefined
├── Fix: Add optional chaining or null check
└── Code: data?.map(...) ?? []
```

### Example 2: Python Error

```
Input: "KeyError: 'username'"

Analysis:
├── Error: KeyError
├── Cause: Key not in dict
├── Fix: Use .get() or check existence
└── Code: data.get('username', 'default')
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/testing` | Write tests to prevent regressions |
| `/code-quality` | Improve code to prevent errors |
| `/autor` | Get project context |

---

*Debug smarter, not harder!*
