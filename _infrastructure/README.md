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
3. Personas are available (Satria, Athena, Dina, Frans)
4. Core skills are loaded (12 skills)
5. Conditional skills are loaded (based on project)
6. Tech stack skills are loaded (based on detection)
```

## Flow

```
User Input: /autor new
       ↓
autor: Command parser
       ↓
auto-router: Pattern detection
       ↓
Personas (4) + Core Skills (12) + Conditional + Tech Stack
       ↓
Ready for development
```

## Layer Architecture v2.2

```
LAYER 1: INFRASTRUCTURE (autor + auto-router)
LAYER 2: PERSONAS (Satria, Athena, Dina, Frans) ← NEW
LAYER 3: CORE (12 skills)
LAYER 4: CONDITIONAL (tech stack)
```

## Auto-Invoke System

The auto-router continuously monitors for patterns:

- **File patterns**: `package.json`, `*.test.ts`, `dockerfile`
- **Code patterns**: `useState`, `useEffect`, `def `, `func main`
- **Phrase patterns**: "react", "python", "postgres", "docker"

When detected, appropriate skills are loaded automatically.

## Version

v2.2.0 - Smart Project Flow
