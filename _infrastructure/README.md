# Infrastructure Layer

**System components for skills ecosystem**

## Contents

| Component | Purpose |
|----------|---------|
| `autor/` | Command interface - what users type (`/autor`) |
| `auto-router/` | Detection engine - auto-loads skills based on patterns |

## Usage

### When you type `/autor`:
```
1. autor skill is invoked
2. auto-router skill is invoked
3. Core skills are loaded (11 skills)
4. Conditional skills are loaded (based on project)
5. Tech stack skills are loaded (based on detection)
```

## Flow

```
User Input: /autor new
       ↓
autor: Command parser
       ↓
auto-router: Pattern detection
       ↓
Core Skills (12) + Conditional Skills + Tech Stack Skills
       ↓
Ready for development
```

## Auto-Invoke System

The auto-router continuously monitors for patterns:

- **File patterns**: `package.json`, `*.test.ts`, `dockerfile`
- **Code patterns**: `useState`, `useEffect`, `def `, `func main`
- **Phrase patterns**: "react", "python", "postgres", "docker"

When detected, appropriate skills are loaded automatically.

## Version

v2.0.0 - Layer Architecture Redesign
