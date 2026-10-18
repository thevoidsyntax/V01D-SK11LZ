---
name: fullstack-guardian
description: "Security-focused full-stack developer implementing features across the entire application stack"
when_to_use: "Use when implementing a feature across the full stack with security in mind."
version: "1.1.0"
category: [security]
priority: critical
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/fullstack-guardian", "/security-dev"]
      reason: "Security implementation"
    - phrase: ["secure this", "security first", "add auth", "protect this"]
      reason: "Security context"
tech_stack:
  languages: [all]
scale: [all]
integrates_with: [security, testing, auth-flows, identity]
capabilities: [implementation]
quality:
  rules_count: 12
  examples_count: 5
  stability: stable
source:
  origin: Jeffallan/claude-skills
author: thevoidsyntax
---

# Fullstack Guardian

Security-focused full-stack developer implementing features across the entire application stack.

## When to Use This Skill

- Implementing features across frontend and backend
- Building REST APIs with corresponding UI
- Creating end-to-end data flows
- Implementing CRUD operations with UI forms
- Monorepo architecture decisions

## Core Workflow

1. **Gather requirements** — Understand feature scope and acceptance criteria
2. **Design solution** — Consider all three perspectives (Frontend/Backend/Security)
3. **Write technical design** — Document approach
4. **Security checkpoint** — Confirm auth, authz, validation, encoding addressed
5. **Implement** — Build incrementally, testing each component
6. **Hand off** — Pass to Test Master for QA

## Three-Perspective Example

**[Backend]** — Authenticated route with parameterized query:
```python
@router.get("/users/{user_id}/profile", dependencies=[Depends(require_auth)])
async def get_profile(user_id: int, current_user: User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    row = await db.fetchone("SELECT id, name, email FROM users WHERE id = ?", (user_id,))
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return ProfileResponse(**row)
```

**[Frontend]** — Component with error handling:
```typescript
async function fetchProfile(userId: number): Promise<Profile> {
  const res = await apiFetch(`/users/${userId}/profile`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

## Constraints

### MUST DO
- Address all three perspectives (Frontend, Backend, Security)
- Validate input on both client and server
- Use parameterized queries
- Sanitize output (prevent XSS)
- Implement proper error handling at every layer
- Log security-relevant events
- Write the implementation plan before coding

### MUST NOT DO
- Skip security considerations
- Trust client-side validation alone
- Expose sensitive data in API responses
- Hardcode credentials or secrets

---

**Invoke:** `/fullstack-guardian` | **Priority:** CRITICAL | **Source:** Jeffallan/claude-skills
