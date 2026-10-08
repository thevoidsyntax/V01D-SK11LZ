# Dependency Base

This document outlines dependency analysis for issue work breakdown.

## Dependency Analysis

### Types of Dependencies

1. **Blocking**: Must be completed first
2. **Facilitating**: Makes work easier but not required
3. **Sequential**: Can be parallelized within sequence
4. **Parallel**: Can be done simultaneously

### Dependency Graph

```yaml
Issue A:
  blocks: [B, C]
  depends_on: []
  
Issue B:
  blocks: [D]
  depends_on: [A]
  
Issue C:
  blocks: [D]
  depends_on: [A]
  
Issue D:
  blocks: []
  depends_on: [B, C]
```

## TODO: Expand with tooling integration
