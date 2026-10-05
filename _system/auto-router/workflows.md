# WORKFLOW TEMPLATES
# Predefined workflows for common project types

## TEMPLATE CATALOG

| Template | Use Case | Skills |
|---------|----------|--------|
| rest-api | REST API service | api-designer, fullstack-guardian, security-reviewer, test-master, devops-engineer |
| fullstack-web | Next.js/React app | architecture-designer, fullstack-guardian, react-expert, api-designer, test-master, security-reviewer |
| microservices | Distributed system | microservices-architect, architecture-designer, devops-engineer, monitoring-expert, security-reviewer |
| cli-tool | Command-line utility | typescript-pro, code-reviewer, test-master |
| library | npm/PyPI library | typescript-pro, test-master, code-reviewer |
| mobile-app | React Native/Flutter | react-expert, fullstack-guardian, security-reviewer |
| data-pipeline | ETL/Data processing | architecture-designer, monitoring-expert, test-master |

---

## WORKFLOW: REST API SERVICE

```yaml
name: REST API Service
description: Fastify/Express REST API with PostgreSQL
duration: 3-5 days
phases:
  - id: design
    name: API Design
    skills: [api-designer]
    tasks:
      - Define resources
      - Design endpoints
      - Write OpenAPI spec
    duration: 0.5 day

  - id: scaffold
    name: Project Scaffolding
    skills: [fullstack-guardian]
    tasks:
      - Initialize project
      - Setup Fastify
      - Configure database
      - Add authentication
    duration: 1 day

  - id: implement
    name: Implementation
    skills: [fullstack-guardian]
    tasks:
      - Implement CRUD endpoints
      - Add validation
      - Setup error handling
    duration: 2 days

  - id: secure
    name: Security Hardening
    skills: [security-reviewer]
    tasks:
      - Add rate limiting
      - Implement CORS
      - Add security headers
      - Review for vulnerabilities
    duration: 0.5 day

  - id: test
    name: Testing
    skills: [test-master]
    tasks:
      - Write unit tests
      - Write integration tests
      - Achieve 80% coverage
    duration: 1 day

  - id: deploy
    name: Deployment
    skills: [devops-engineer]
    tasks:
      - Dockerize application
      - Setup CI/CD
      - Configure health checks
    duration: 0.5 day

gates:
  - All endpoints implemented
  - 80% test coverage
  - No critical security issues
  - Health endpoint working
```

---

## WORKFLOW: FULLSTACK WEB APP

```yaml
name: Fullstack Web Application
description: Next.js + Fastify + PostgreSQL
duration: 5-10 days
phases:
  - id: architecture
    name: Architecture Design
    skills: [architecture-designer]
    tasks:
      - System architecture diagram
      - Data model design
      - API contract definition
      - ADR for key decisions
    duration: 1 day

  - id: backend
    name: Backend Development
    skills: [fullstack-guardian]
    tasks:
      - Setup Fastify server
      - Configure PostgreSQL with Knex
      - Implement authentication
      - Build API endpoints
    duration: 2 days

  - id: frontend
    name: Frontend Development
    skills: [react-expert]
    tasks:
      - Setup Next.js project
      - Build UI components
      - Integrate API
      - Add state management
    duration: 3 days

  - id: api-integration
    name: API Integration
    skills: [fullstack-guardian, react-expert]
    tasks:
      - Connect frontend to API
      - Handle auth flow
      - Error handling
    duration: 1 day

  - id: test
    name: Testing
    skills: [test-master]
    tasks:
      - Unit tests (frontend + backend)
      - Integration tests
      - E2E smoke tests
    duration: 1.5 days

  - id: security
    name: Security Review
    skills: [security-reviewer]
    tasks:
      - OWASP Top 10 check
      - Input validation review
      - Auth flow audit
    duration: 0.5 day

  - id: deploy
    name: Deployment
    skills: [devops-engineer]
    tasks:
      - Docker compose setup
      - CI/CD pipeline
      - Environment configuration
    duration: 0.5 day

gates:
  - All features implemented
  - 80% test coverage
  - No critical/high vulnerabilities
  - Lighthouse score > 80
```

---

## WORKFLOW: MICROSERVICES

```yaml
name: Microservices Architecture
description: Distributed system with message queue
duration: 10-15 days
phases:
  - id: design
    name: Architecture Design
    skills: [microservices-architect, architecture-designer]
    tasks:
      - Service decomposition
      - Data ownership
      - Communication patterns
      - Service mesh design
    duration: 2 days

  - id: infrastructure
    name: Infrastructure Setup
    skills: [devops-engineer, monitoring-expert]
    tasks:
      - Kubernetes/Docker Compose setup
      - Service mesh configuration
      - Centralized logging
      - Metrics collection
    duration: 2 days

  - id: services
    name: Services Development
    skills: [fullstack-guardian]
    tasks:
      - Implement each service
      - API gateway
      - Service discovery
      - Circuit breakers
    duration: 6 days

  - id: messaging
    name: Event-Driven Integration
    skills: [architecture-designer]
    tasks:
      - Message queue setup
      - Event schemas
      - Consumer implementations
      - Outbox pattern
    duration: 2 days

  - id: observability
    name: Observability
    skills: [monitoring-expert]
    tasks:
      - Distributed tracing
      - Health endpoints
      - Alerting rules
      - Dashboards
    duration: 1 day

  - id: test
    name: Testing
    skills: [test-master]
    tasks:
      - Contract testing
      - Integration tests
      - Chaos engineering basics
    duration: 1.5 days

  - id: security
    name: Security
    skills: [security-reviewer]
    tasks:
      - Service authentication
      - Network policies
      - Secrets management
    duration: 0.5 day

gates:
  - All services communicating
  - Contract tests passing
  - Distributed tracing working
  - No critical vulnerabilities
```

---

## WORKFLOW: CLI TOOL

```yaml
name: CLI Tool
description: TypeScript CLI with Commander
duration: 2-3 days
phases:
  - id: design
    name: Command Design
    skills: [typescript-pro]
    tasks:
      - Command structure
      - Argument parsing
      - Help text design
    duration: 0.5 day

  - id: implement
    name: Implementation
    skills: [typescript-pro]
    tasks:
      - CLI scaffolding
      - Command handlers
      - Output formatting
      - Error handling
    duration: 1.5 days

  - id: test
    name: Testing
    skills: [test-master]
    tasks:
      - Unit tests
      - Integration tests
      - CLI smoke tests
    duration: 0.5 day

  - id: polish
    name: Polish
    skills: [code-reviewer]
    tasks:
      - Code review
      - Documentation
      - Examples
    duration: 0.5 day

gates:
  - All commands working
  - Help text complete
  - Tests passing
```

---

## WORKFLOW: NPM LIBRARY

```yaml
name: NPM Library
description: Public TypeScript library
duration: 3-5 days
phases:
  - id: design
    name: API Design
    skills: [typescript-pro, architecture-designer]
    tasks:
      - Public API surface
      - Type definitions
      - Tree-shaking friendly
    duration: 0.5 day

  - id: implement
    name: Implementation
    skills: [typescript-pro]
    tasks:
      - Core functionality
      - Type exports
      - ESM/CJS output
    duration: 2 days

  - id: test
    name: Testing
    skills: [test-master]
    tasks:
      - Comprehensive tests
      - 90%+ coverage
      - Edge cases
    duration: 1 day

  - id: document
    name: Documentation
    skills: [code-reviewer]
    tasks:
      - README
      - API docs
      - Examples
      - TypeDoc
    duration: 0.5 day

  - id: publish
    name: Publishing
    skills: [devops-engineer]
    tasks:
      - npm organization setup
      - CI/CD for releases
      - Versioning strategy
    duration: 0.5 day

gates:
  - TypeScript strict mode
  - 90% test coverage
  - Full documentation
  - Semantic versioning
```

---

## QUICK TEMPLATES

### Quick: API Only
```yaml
name: quick-api
skills: [api-designer, fullstack-guardian, security-reviewer]
phases: [design, implement, secure]
duration: 2 days
```

### Quick: Add Feature
```yaml
name: quick-feature
skills: [fullstack-guardian, test-master]
phases: [implement, test]
duration: 1 day
```

### Quick: Security Audit
```yaml
name: quick-security
skills: [security-reviewer, secure-code-guardian]
phases: [audit, fix]
duration: 0.5 day
```

### Quick: Performance Fix
```yaml
name: quick-perf
skills: [debugging-wizard, architecture-designer]
phases: [analyze, fix]
duration: 0.5 day
```
