---
name: api-contracts
description: "API contracts, OpenAPI specs, and contract testing for full-stack applications."
version: "1.0.0"
category: [integration, backend]
priority: high
phase: phase-1
tech_stack:
  languages: [typescript, python, go]
scale: [medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/openapi.json"
      reason: "OpenAPI spec detected"
    - has_file: "**/api.yaml"
      reason: "API spec detected"
  skill_tier: context
triggers:
  phrases:
    - "openapi"
    - "contract"
    - "api spec"
    - "swagger"
capabilities: [generation, testing]
dependencies: [api-design, testing]
integrates_with: [api-design, testing]
---

# API-CONTRACTS v1.0

API contracts, OpenAPI specs, and contract testing patterns.

## OpenAPI 3.x Structure

### 1. Complete Spec

```yaml
openapi: 3.1.0
info:
  title: User API
  version: 1.0.0
  contact:
    email: api@example.com

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://staging.example.com/v1
    description: Staging

paths:
  /users:
    get:
      summary: List users
      operationId: listUsers
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Filter'
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'
        '401':
          $ref: '#/components/responses/Unauthorized'
```

### 2. Schema Definitions

```yaml
components:
  schemas:
    User:
      type: object
      required: [id, email]
      properties:
        id:
          type: integer
        email:
          type: string
          format: email
        role:
          enum: [admin, user, guest]
    UserList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        meta:
          $ref: '#/components/schemas/Pagination'

  parameters:
    Page:
      name: page
      in: query
      schema:
        type: integer
        default: 1
```

## Contract Testing

### 1. API Mock with MSW

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json({
      data: [{ id: 1, email: 'test@example.com' }],
    });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 2. Response Matching

```typescript
test('GET /users returns array', async () => {
  const users = await api.users.list();

  expect(users).toMatchObject([
    { id: expect.any(Number), email: expect.any(String) },
  ]);
});
```

### 3. Error Handling

```typescript
test('POST /users rejects invalid email', async () => {
  const res = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'bad-email' }),
  });

  expect(res.status).toBe(400);
  const body = await res.json();
  expect(body.code).toBe('VALIDATION_ERROR');
});
```

## Best Practices

```
CONTRACT FIRST:
  [x] Define OpenAPI spec before code
  [x] Generate types from spec
  [x] Validate responses match spec

TESTING:
  [x] Mock server matches spec exactly
  [x] Test error codes
  [x] Test response shape
  [x] Test required fields
```

---

*Author: TheVoidSyntax*
