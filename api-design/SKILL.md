---
name: api-design
description: REST, GraphQL, gRPC patterns and best practices for API design
version: "1.1.0"
category: [backend]
priority: medium
phase: phase-2
tech_stack:
  frameworks: [express, fastify, nestjs, django, fastapi, spring-boot, gin]
  languages: [typescript, javascript, python, go, java]
scale: [mvp, small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - tech_stack: [express, fastify, nestjs, django, fastapi]
      reason: "Web framework detected"
  skill_tier: context
triggers:
  phrases:
    - "api"
    - "rest"
    - "graphql"
    - "grpc"
    - "endpoint"
    - "route"
    - "http"
    - "request"
    - "response"
    - "crud"
    - "validation"
    - "schema"
    - "openapi"
    - "swagger"
capabilities: [implementation, review, generation]
quality:
  rules_count: 12
  examples_count: 25
  stability: stable
integrates_with: [auto-route, analyze-project, security]
dependencies: [security, config]
source:
  origin: merged
  sources: ["Jeffallan/claude-skills:api-designer"]
author: Claude
---

# API DESIGN MODULE

Kamu adalah API Design Specialist. Gunakan rules ini untuk setiap aspek API design dan implementation.

---

## 1. REST API DESIGN
- **Resource Naming:**
  - Use nouns, not verbs: `/users`, `/orders`
  - Plural forms: `/users` not `/user`
  - Hierarchical paths: `/users/{id}/orders`
  - Filtering: `/orders?status=pending`
- **HTTP Methods:**
  - **GET:** Read resource(s)
  - **POST:** Create new resource
  - **PUT:** Replace entire resource
  - **PATCH:** Partial update
  - **DELETE:** Remove resource
- **Status Codes:**
  - **2xx:** Success (200, 201, 204)
  - **3xx:** Redirection (301, 304)
  - **4xx:** Client error (400, 401, 403, 404, 422)
  - **5xx:** Server error (500, 502, 503)
- **Naming Conventions:**
  - kebab-case: `/user-profiles`
  - snake_case: `/user_profiles` (if legacy)
  - Consistent throughout API

## 2. PAGINATION PATTERNS
- **Offset Pagination:**
  - `GET /users?page=1&per_page=20`
  - Response: `{ data: [...], meta: { total: 100, page: 1, per_page: 20 } }`
  - Simple to implement
  - Inefficient for large offsets
- **Cursor Pagination:**
  - `GET /users?cursor=abc123&limit=20`
  - Response: `{ data: [...], next_cursor: "def456" }`
  - Efficient for large datasets
  - Consistent results during updates
- **Keyset Pagination:**
  - `GET /users?after_id=123&limit=20`
  - Use indexed columns
  - Best for real-time feeds
- **Pagination Metadata:**
  - Total count (if available)
  - Has next/has previous
  - Current page / total pages

## 3. API VERSIONING
- **URL Versioning:**
  - `/api/v1/users`
  - `/api/v2/users`
  - Clear, visible, easy to route
- **Header Versioning:**
  - `Accept: application/vnd.api+json;version=2`
  - Cleaner URLs
  - Less visible
- **Version Lifecycle:**
  - **Alpha:** Experimental, may break
  - **Beta:** Public testing, stable API
  - **Stable:** Production-ready
  - **Deprecated:** Sunset scheduled
  - **Sunset:** Removed
- **Deprecation Policy:**
  - 90-day minimum notice
  - Header: `Deprecation`, `Sunset`, `Link`
  - Changelog update

## 4. API GATEWAY
- **Gateway Responsibilities:**
  - Authentication/Authorization
  - Rate limiting
  - Request routing
  - Protocol translation
  - SSL termination
- **Routing Patterns:**
  - Path-based routing: `/api/*` → backend
  - Header-based routing
  - Host-based routing
- **Gateway Features:**
  - Request/response transformation
  - Circuit breaking
  - Caching
  - Logging dan monitoring
- **Gateway Solutions:**
  - Kong, Apigee, AWS API Gateway
  - NGINX Plus
  - Custom (Express, FastAPI)

## 5. GRAPHQL API
- **Schema-First Design:**
  - Define schema SDL first
  - Type safety
  - Self-documenting
- **N+1 Prevention:**
  - DataLoader pattern
  - Batch requests
  - Field resolvers
- **Query Complexity:**
  - Max depth: 10-15 levels
  - Max complexity score: 1000-10000
  - Max results per field: 100-1000
- **Subscriptions:**
  - WebSocket-based
  - Reconnection with backoff
  - Authentication in handshake
- **Persisted Queries:**
  - APQ untuk production
  - Cache query plans
  - Reduce payload size

## 6. ERROR HANDLING
- **Error Response Format:**
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Human readable message",
      "details": [...],
      "request_id": "abc123"
    }
  }
  ```
- **RFC 7807 Problem Details Format:**
  ```json
  {
    "type": "https://api.example.com/errors/validation-error",
    "title": "Validation Error",
    "status": 400,
    "detail": "The 'email' field must be a valid email address.",
    "instance": "/users/req-abc123"
  }
  ```
- **Error Codes:**
  - Consistent naming: `RESOURCE_NOT_FOUND`
  - Machine-readable
  - Documented in API docs
- **HTTP Status Mapping:**
  - 400: Validation errors
  - 401: Authentication required
  - 403: Insufficient permissions
  - 404: Resource not found
  - 409: Conflict
  - 422: Business rule violation
  - 429: Rate limit exceeded
  - 500: Internal error
- **Error Documentation:**
  - Include error codes in OpenAPI spec
  - Document resolution steps
  - Provide examples

## 7. API RESPONSE COMPRESSION
- **Compression:**
  - Accept-Encoding: gzip, br, deflate
  - Vary: Accept-Encoding
  - Target < 10KB response size
- **Response Optimization:**
  - Field filtering: `?fields=id,name,email`
  - Sparse fieldsets (GraphQL)
  - Compression middleware
- **Caching:**
  - Cache-Control headers
  - ETag for conditional requests
  - CDN caching untuk public endpoints

## 8. API DOCUMENTATION
- **OpenAPI/Swagger:**
  - Document all endpoints
  - Request/response examples
  - Schema definitions
  - Authentication requirements
- **OpenAPI 3.1 Resource Endpoint Template:**
  ```yaml
  openapi: "3.1.0"
  info:
    title: Example API
    version: "1.1.0"
  paths:
    /users:
      get:
        summary: List users
        operationId: listUsers
        tags: [Users]
        parameters:
          - name: cursor
            in: query
            schema: { type: string }
          - name: limit
            in: query
            schema: { type: integer, default: 20, maximum: 100 }
        responses:
          "200":
            description: Paginated list of users
            content:
              application/json:
                schema:
                  type: object
                  required: [data, pagination]
                  properties:
                    data:
                      type: array
                      items: { $ref: "#/components/schemas/User" }
                    pagination:
                      $ref: "#/components/schemas/CursorPage"
  ```
- **Interactive Documentation:**
  - Swagger UI
  - Redoc
  - Stoplight
- **SDK Generation:**
  - Auto-generate client SDKs
  - Multiple language support
  - Keep in sync with API
- **Changelog:**
  - Semantic versioning
  - Breaking changes highlighted
  - Migration guides

## 9. API SECURITY
- **Authentication:**
  - API keys untuk simple cases
  - OAuth2 untuk user authentication
  - JWT for stateless auth
- **Authorization:**
  - Scope-based access
  - Resource-level permissions
  - Field-level access control
- **Rate Limiting:**
  - Tiered limits (free/paid)
  - Per-user or per-key
  - Graceful degradation
- **Input Validation:**
  - Schema validation
  - Type coercion
  - Sanitization

## 10. GRPC PATTERNS
- **Protocol Buffers:**
  - Define .proto files
  - Version your proto definitions
  - Use proto3 syntax
- **Service Definition:**
  - Package organization
  - Service naming
  - Method naming
- **Streaming:**
  - Server streaming
  - Client streaming
  - Bidirectional streaming
- **gRPC Gateway:**
  - REST to gRPC transcoding
  - OpenAPI documentation
  - HTTP/JSON interface

## 11. API GATEWAY CONFIGURATION
- **Rate Limiting:**
  - Token bucket algorithm
  - Redis-backed untuk distributed
  - Headers: X-RateLimit-*
- **Circuit Breaker:**
  - Failure threshold
  - Recovery timeout
  - Half-open testing
- **Timeout Configuration:**
  - Read timeout
  - Write timeout
  - Idle timeout
- **Health Checks:**
  - Passive health checks
  - Active health checks
  - Circuit breaker integration

## 12. API DEPLOYMENT
- **Blue-Green API:**
  - Route traffic based on version
  - Gradual traffic shifting
  - Instant rollback
- **Canary API:**
  - Percentage-based routing
  - Metric-based routing
  - Feature flags
- **API Documentation:**
  - Versioned documentation
  - Migration guides
  - Code examples
- **API Lifecycle:**
  - Design → Prototype → Beta → Stable → Deprecated → Sunset

---

## Constraints

### MUST DO
- Follow REST principles (resource-oriented, proper HTTP methods)
- Use consistent naming conventions (snake_case or camelCase — pick one, apply everywhere)
- Include comprehensive OpenAPI 3.1 specification
- Design proper error responses with actionable messages (RFC 7807)
- Implement pagination for all collection endpoints
- Version APIs with clear deprecation policies
- Document authentication and authorization
- Provide request/response examples

### MUST NOT DO
- Use verbs in resource URIs (use `/users/{id}`, not `/getUser/{id}`)
- Return inconsistent response structures
- Skip error code documentation
- Ignore HTTP status code semantics
- Design APIs without a versioning strategy
- Expose implementation details in the API surface
- Create breaking changes without a migration path
- Omit rate limiting considerations

---

**Invok:** `/api-design` | **Priority:** MEDIUM | **Version:** 1.1.0
