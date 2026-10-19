# Autor Quick Reference

## Commands

| Command | Description |
|---------|-------------|
| `/autor` | Analyze project OR start empty project flow |
| `/autor scan` | Full project analysis with health score |
| `/autor new` | Force empty project wizard |
| `/autor status` | Show project state |
| `/autor --help` | Show help |

## 12 Core Skills (Auto-loaded)

```text
git, config, security, testing, error-debugger,
observability, doc-generator, mem-search,
anti-slop, chisle, caveman, codebase-design
```

## 6 Personas Pipeline

```text
Satria → Athena → Hexa → Dina → Frans → Vika
PM     → Design → Code → QA   → DevOps → Writer
```

## Mode Rule

```text
HIGH-LEVERAGE / RISKY  → Plan Mode
IMPLEMENTATION / LOW-RISK → Auto Mode
```

| Persona | Mode |
|---------|------|
| Satria | plan |
| Athena | plan |
| Hexa | auto |
| Dina | auto |
| Frans | plan |
| Vika | auto |

## Token Distribution

| Category | Cost | Skills |
|----------|------|--------|
| Core (from /autor) | 1x shared | 12 core skills |
| Persona Extended | +N per skill | Varies by persona |

## Audit Recommendation

```text
RECOMMEND /audit WHEN:
├─ Adding authentication/authorization
├─ Adding payment/billing features
├─ Handling user PII/sensitive data
└─ Before first production deploy

RECOMMEND:
├─ New project/feature
├─ After major refactoring
└─ Codebase feels "smelly"

DON'T RECOMMEND:
├─ Project is healthy
├─ Only doing small fixes
└─ Recently audited
```

## Audit Commands

```bash
/audit                # Full scan (~300K tokens)
/audit [module]      # Module scan (~150K tokens)
```

## Layer Architecture

```text
LAYER 1: INFRASTRUCTURE (Always Available)
├── autor/           Command interface
└── auto-router/    Reference code

LAYER 2: PERSONAS (Available with /autor)
├── Satria (PM)      Planning
├── Athena (Architect) Design
├── Hexa (Coder)     Implementation
├── Dina (QA)        Quality gate
├── Frans (DevOps)   Infrastructure
└── Vika (Writer)   Documentation

LAYER 3: CORE (12 Skills - Auto-loaded)
LAYER 4: CONDITIONAL (Auto-detect)
```
