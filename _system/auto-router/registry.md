# SKILL REGISTRY
# Complete mapping of skills to use cases

## CORE SKILLS

### fullstack-guardian
```yaml
name: fullstack-guardian
priority: critical
phase: any
description: Security-focused fullstack development
useCases:
  - Implementing features across frontend/backend
  - Building REST APIs with UI
  - CRUD operations
triggers:
  - fullstack
  - feature
  - implement
```

### api-designer
```yaml
name: api-designer
priority: important
phase: design
description: REST and GraphQL API design
useCases:
  - API design from scratch
  - API auditing
  - OpenAPI specification
triggers:
  - api
  - rest
  - endpoint
  - openapi
```

### security-reviewer
```yaml
name: security-reviewer
priority: high
phase: review
description: Security audit and recommendations
useCases:
  - Security assessment
  - Vulnerability scanning
  - Compliance check
triggers:
  - security
  - vulnerability
  - audit
```

### test-master
```yaml
name: test-master
priority: high
phase: testing
description: Testing strategy and implementation
useCases:
  - Unit testing
  - Integration testing
  - E2E testing
triggers:
  - test
  - testing
  - coverage
  - unit
```

### architecture-designer
```yaml
name: architecture-designer
priority: critical
phase: design
description: System architecture and patterns
useCases:
  - System design
  - Pattern selection
  - ADR creation
triggers:
  - architecture
  - design
  - pattern
  - scale
```

---

## SPECIALIZED SKILLS

### devops-engineer
```yaml
name: devops-engineer
priority: important
phase: deploy
description: DevOps and deployment automation
useCases:
  - CI/CD pipelines
  - Docker/Kubernetes
  - Infrastructure as Code
triggers:
  - deploy
  - docker
  - kubernetes
  - ci-cd
  - infrastructure
```

### monitoring-expert
```yaml
name: monitoring-expert
priority: medium
phase: ops
description: Observability and monitoring setup
useCases:
  - Metrics setup
  - Logging strategy
  - Alert configuration
triggers:
  - monitoring
  - metrics
  - observability
  - logging
```

### react-expert
```yaml
name: react-expert
priority: important
phase: frontend
description: React and Next.js development
useCases:
  - React components
  - Next.js apps
  - State management
triggers:
  - react
  - nextjs
  - component
  - frontend
```

### typescript-pro
```yaml
name: typescript-pro
priority: high
phase: any
description: TypeScript best practices
useCases:
  - TypeScript configuration
  - Type safety improvements
  - Advanced patterns
triggers:
  - typescript
  - types
  - typing
```

### code-reviewer
```yaml
name: code-reviewer
priority: medium
phase: review
description: Code quality review
useCases:
  - Code review
  - Style checking
  - Best practices
triggers:
  - review
  - quality
  - style
```

### debugging-wizard
```yaml
name: debugging-wizard
priority: medium
phase: any
description: Troubleshooting and debugging
useCases:
  - Bug investigation
  - Performance issues
  - Error debugging
triggers:
  - debug
  - bug
  - error
  - performance
```

---

## ADVANCED SKILLS

### microservices-architect
```yaml
name: microservices-architect
priority: high
phase: architecture
description: Microservices architecture design
useCases:
  - Service decomposition
  - Message patterns
  - Service mesh
triggers:
  - microservices
  - services
  - distributed
```

### cloud-architect
```yaml
name: cloud-architect
priority: high
phase: infrastructure
description: Cloud infrastructure design
useCases:
  - AWS/GCP/Azure setup
  - Serverless architecture
  - Cloud cost optimization
triggers:
  - cloud
  - aws
  - gcp
  - azure
  - serverless
```

### secure-code-guardian
```yaml
name: secure-code-guardian
priority: critical
phase: security
description: Secure coding practices
useCases:
  - Input validation
  - SQL injection prevention
  - XSS protection
triggers:
  - secure
  - validation
  - injection
  - xss
```

---

## PLANNING SKILLS

### feature-forge
```yaml
name: feature-forge
priority: important
phase: planning
description: Feature requirements and planning
useCases:
  - Requirements gathering
  - User story creation
  - Acceptance criteria
triggers:
  - feature
  - requirements
  - planning
```

### domain-modeling
```yaml
name: domain-modeling
priority: medium
phase: design
description: Domain-driven design
useCases:
  - Entity modeling
  - Bounded contexts
  - Domain events
triggers:
  - domain
  - entity
  - ddd
  - model
```

### wayfinder
```yaml
name: wayfinder
priority: medium
phase: planning
description: Large work planning
useCases:
  - Multi-sprint planning
  - Decision mapping
  - Issue tracking
triggers:
  - plan
  - large
  - roadmap
```

---

## SKILL DEPENDENCY GRAPH

```
fullstack-guardian
├── secure-code-guardian
│   └── security-reviewer
└── test-master

api-designer
├── security-reviewer
└── architecture-designer

architecture-designer
├── fullstack-guardian
└── devops-engineer

microservices-architect
├── architecture-designer
├── devops-engineer
└── monitoring-expert
```

---

## PHASE-BASED SKILL RECOMMENDATIONS

### Phase 1: Foundation
```
Primary: fullstack-guardian
Secondary: api-designer, typescript-pro
```

### Phase 2: Core Development
```
Primary: fullstack-guardian
Secondary: api-designer, test-master
```

### Phase 3: Feature Development
```
Primary: fullstack-guardian
Secondary: code-reviewer, debugging-wizard
```

### Phase 4: Polish & Quality
```
Primary: code-reviewer, test-master
Secondary: security-reviewer, debugging-wizard
```

### Phase 5: Infrastructure
```
Primary: devops-engineer
Secondary: monitoring-expert, architecture-designer
```

### Phase 6: Launch
```
Primary: security-reviewer, monitoring-expert
Secondary: fullstack-guardian
```
