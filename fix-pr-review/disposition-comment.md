# Disposition Comment Templates

This document provides templates for disposition comments in PR reviews.

## Fixing Disposition

```markdown
Fixed. Applied the suggested change:

```[language]
// Fixed code
```
```

## Corrected Scope (Partial) Disposition

```markdown
Corrected scope (partial). The suggested fix addresses part of the issue:

- [x] Addressed aspect 1
- [ ] Addressed aspect 2 (deferred to follow-up)
```

## Deferred to Follow-up Disposition

```markdown
Deferred to follow-up. Created issue [ISSUE-NUMBER] to track:

- Root cause requires architectural change
- Out of scope for this PR
```

## Refuted Disposition

```markdown
Refuted. The suggested fix would not address the issue because:

[Detailed explanation of why the suggestion doesn't apply]
```

## TODO: Expand with more templates
