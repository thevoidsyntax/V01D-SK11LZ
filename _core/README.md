# Core Layer

**12 Essential Skills - Always Loaded with `/autor`**

## Contents

| # | Skill | Purpose | Token Efficiency |
|---|-------|---------|-----------------|
| 1 | `git` | Version control | - |
| 2 | `config` | Environment & secrets | - |
| 3 | `security` | OWASP, encryption | - |
| 4 | `testing` | QA + TDD | - |
| 5 | `error-debugger` | Debug patterns | - |
| 6 | `observability` | Logs + Metrics + Traces | - |
| 7 | `doc-generator` | Auto-documentation | - |
| 8 | `mem-search` | Memory continuity | - |
| 9 | `anti-slop` | Token efficiency | ~30-40% |
| 10 | `chisle` | Context optimization | ~20-30% |
| 11 | `caveman` | Aggressive compression | ~65% |
| 12 | `codebase-design` | Architecture + DDD | - |

## Usage

These skills are **automatically loaded** when you invoke `/autor`:

```bash
/autor              # All 12 core skills loaded
/autor new         # All 12 core skills + project wizard
/autor scan        # All 12 core skills + analysis
```

## Token Efficiency

### anti-slop (~30-40% token savings)
Removes verbose AI patterns:
```typescript
// ❌ Verbose - wastes tokens
// This function calculates the sum of two numbers
function calculateSumOfTwoNumbers(a: number, b: number): number {
  return a + b;
}

// ✅ Concise - efficient
function sum(a: number, b: number): number {
  return a + b;
}
```

### chisle (~20-30% token savings)
Context pruning - removes redundant information from context windows.

### caveman (~65% token savings)
Aggressive compression - "why use many token when few token do trick."

**Combined Efficiency: ~80-90% token savings!**

### mem-search
Memory continuity - retrieves project context from previous sessions.

## Integration

Skills work together:

```
git ←→ config (secrets in gitignore)
testing ←→ error-debugger (fix failed tests)
observability ←→ error-debugger (debug via logs)
security ←→ testing (security testing)
mem-search ←→ all (context continuity)
anti-slop ←→ chisle ←→ caveman (token efficiency)
```

## Version

v2.0.0 - Added caveman (12 core skills)
v1.0.0 - Initial 11 core skills
