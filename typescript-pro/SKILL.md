---
name: typescript-pro
description: Advanced TypeScript type systems, custom type guards, and utility types
when_to_use: "Use when working with advanced TypeScript types: type guards, generics, or utility types."
version: "1.0.0"
category: [backend, frontend]
priority: medium
phase: any
tech_stack:
  languages: [typescript]
scale: [mvp, small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/tsconfig.json"
      reason: "TypeScript project detected"
  skill_tier: optional
capabilities: [implementation, generation]
quality:
  rules_count: 10
  examples_count: 20
  stability: stable
integrates_with: [api-design, fullstack-guardian]
dependencies: [fullstack-guardian, api-design]
source:
  origin: external
  sources: ["Jeffallan/claude-skills"]
author: thevoidsyntax
---

# TypeScript Pro

Implements advanced TypeScript type systems, creates custom type guards, and utility types.

## When to Use This Skill

- Building TypeScript applications requiring advanced generics
- Conditional or mapped types
- Discriminated unions
- Monorepo setup
- Full-stack type safety

## Branded Types

```typescript
type Brand<T, B extends string> = T & { readonly __brand: B };
type UserId  = Brand<string, "UserId">;
type OrderId = Brand<number, "OrderId">;

const toUserId  = (id: string): UserId  => id as UserId;
const toOrderId = (id: number): OrderId => id as OrderId;
```

## Discriminated Unions & Type Guards

```typescript
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: string[] };
type ErrorState   = { status: "error";   error: Error };
type RequestState = LoadingState | SuccessState | ErrorState;

function isSuccess(state: RequestState): state is SuccessState {
  return state.status === "success";
}

function renderState(state: RequestState): string {
  switch (state.status) {
    case "loading": return "Loading…";
    case "success": return state.data.join(", ");
    case "error":   return state.error.message;
    default: {
      const _exhaustive: never = state;
      throw new Error(`Unhandled state: ${_exhaustive}`);
    }
  }
}
```

## Recommended tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "incremental": true
  }
}
```

## Constraints

### MUST DO
- Enable strict mode with all compiler flags
- Use type-first API design
- Implement branded types for domain modeling
- Use `satisfies` operator for type validation
- Create discriminated unions for state machines

### MUST NOT DO
- Use explicit `any` without justification
- Skip type coverage for public APIs
- Disable strict null checks
- Use enums (prefer const objects with `as const`)

---

**Invoke:** `/typescript-pro` | **Priority:** USEFUL | **Source:** Jeffallan/claude-skills
