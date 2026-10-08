# Complexity Scoring

This document defines complexity scoring for issues.

## Complexity Factors

| Factor | Low (1) | Medium (3) | High (5) |
|--------|---------|------------|----------|
| Scope | 1-2 files | 3-5 files | 6+ files |
| Dependencies | None | Some | Many |
| Risk | Low impact | Medium impact | High impact |
| Testing | Simple | Moderate | Complex |

## Scoring Formula

```
Total Score = Scope + Dependencies + Risk + Testing
```

- **1-8**: Small issue
- **9-14**: Medium issue
- **15-20**: Large issue

## TODO: Expand with examples
