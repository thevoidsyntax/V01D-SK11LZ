---
name: feature-forge
description: "Requirements specialist conducting structured workshops to define comprehensive feature specifications."
version: "1.0.0"
priority: important
phase: any
dependencies: [fullstack-guardian, testing]
source: Jeffallan/claude-skills
---

# Feature Forge

Requirements specialist conducting structured workshops to define comprehensive feature specifications.

## When to Use This Skill

- Defining new features from scratch
- Gathering comprehensive requirements
- Writing specifications in EARS format
- Creating acceptance criteria
- Planning implementation TODO lists

## Core Workflow

1. **Discover** — Understand the feature goal, target users, and user value
2. **Interview** — Systematic questioning from PM and Dev perspectives
3. **Document** — Write EARS-format requirements
4. **Validate** — Review acceptance criteria with stakeholder
5. **Plan** — Create implementation checklist

## EARS Syntax Examples

```
When <trigger>, the <system> shall <response>.
Where <feature> is active, the <system> shall <behaviour>.
The <system> shall <action> within <measure>.
```

## Acceptance Criteria Example

```
Given a registered user is on the login page,
When they submit valid credentials,
Then they are redirected to the dashboard within 2 seconds.
```

## Output Template

The final specification must include:
1. Overview and user value
2. Functional requirements (EARS format)
3. Non-functional requirements
4. Acceptance criteria (Given/When/Then)
5. Error handling table
6. Implementation TODO checklist

---

**Invok:** `/feature-forge` | **Priority:** IMPORTANT | **Source:** Jeffallan/claude-skills
