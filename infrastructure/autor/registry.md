# SKILL REGISTRY
# Complete mapping of skills to use cases

## CORE SKILLS (26) - Always Auto-Invoke

Core skills are automatically invoked when `/auto-router` is called.

### Version Control & DevOps (4)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `git` | Version Control | commit, branch, merge, git |
| `docker` | Containerization | docker, container, kubernetes |
| `ci-cd` | CI/CD Pipelines | ci, cd, pipeline, github actions |
| `deployment` | Deployment | deploy, kubernetes, terraform |

### Quality & Testing (3)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `code-quality` | Code Standards | lint, format, clean code |
| `testing` | Testing Strategy | test, testing, jest, vitest |
| `tdd` | Test-Driven Development | tdd, bdd, test-first |

### Config & Observability (3)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `config` | Configuration | env, config, settings |
| `logging` | Structured Logging | log, logger, telemetry |
| `observability` | Monitoring | metrics, monitor, alert |

### Security (1)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `security` | Security Best Practices | auth, security, jwt, oauth |

### Backend Development (2)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `api-design` | REST/GraphQL API | api, rest, graphql, endpoint |
| `database` | Database Patterns | sql, postgres, database |

### Architecture & Patterns (2)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `domain-modeling` | DDD Patterns | ddd, domain, bounded context |
| `architecture-patterns` | System Design | architecture, pattern, microservice |

### Project Foundation (4)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `feature-forge` | Feature Planning | feature, prd, requirements |
| `implement` | Implementation | implement, build, code |
| `documentation` | Technical Docs | doc, readme, spec |
| `mem-search` | Memory & Context | memory, search, context |

### Debugging & Performance (2)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `diagnosing-bugs` | Debugging | bug, debug, error, fix |
| `performance` | Optimization | perf, optimize, speed |

### Code Review & Communication (2)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `pr-review` | Code Review | pr, review, pull request |
| `commit` | Conventional Commits | commit, conventional |

### Production Readiness (2)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `reliability` | Resilience Patterns | retry, circuit, fallback |
| `scalability` | Growth Readiness | scale, cache, load balance |

### Frontend & Tools (3)

| Skill | Purpose | Key Triggers |
|-------|---------|--------------|
| `ui-ux-pro-max` | UI/UX Design | ui, ux, design, component |
| `browser-use` | Browser Automation | browser, automate, scrape |
| `anti-slop` | Anti-Pattern Detection | anti-slop, quality |

---

## TECH-BASED SKILLS (Auto-Invoke on Detection)

These skills are invoked when specific technologies are detected.

### Languages

| Skill | Triggers |
|-------|----------|
| `typescript-pro` | typescript, ts |
| `python-pro` | python, py |
| `go-pro` | golang, go |
| `rust-pro` | rust, cargo |

### Frameworks

| Skill | Triggers |
|-------|----------|
| `nestjs-expert` | nestjs, @nestjs |
| `graphql` | graphql, apollo |

### Infrastructure

| Skill | Triggers |
|-------|----------|
| `kubernetes` | kubernetes, k8s |
| `terraform` | terraform, tf |
| `postgresql-pro` | postgresql, postgres |

### AI/ML

| Skill | Triggers |
|-------|----------|
| `rag-architect` | rag, vector, embedding |
| `llm-evaluation` | llm, evaluation, benchmark |
| `langchain-architect` | langchain, chains |

---

## SPECIALIZED SKILLS

### DevOps & Infrastructure

| Skill | Purpose |
|-------|---------|
| `devops-engineer` | DevOps automation |
| `observability` | Monitoring & metrics |
| `reliability` | Circuit breaker, retry |
| `scalability` | Caching, load balancing |

### Database & Data

| Skill | Purpose |
|-------|---------|
| `database` | SQL optimization |
| `postgresql-pro` | PostgreSQL advanced |
| `data-engineering` | ETL, pipelines |

### Security & Compliance

| Skill | Purpose |
|-------|---------|
| `security` | Security best practices |
| `pentest` | Penetration testing |
| `compliance` | Compliance requirements |
| `identity` | Auth & IAM |

### Testing

| Skill | Purpose |
|-------|---------|
| `testing` | Test strategy |
| `tdd` | Test-driven development |
| `playwright` | E2E testing |

---

## SKILL DEPENDENCY GRAPH

```
/auto-router (Master)
├─ Always: git, docker, ci-cd, code-quality, testing, config, logging, observability
├─ Security: security, compliance, identity
├─ Backend: api-design, database, domain-modeling
├─ Frontend: ui-ux-pro-max
├─ Process: feature-forge, implement, documentation, pr-review
├─ Quality: diagnosing-bugs, performance, reliability, scalability
└─ Optional: (Tech-based on detection)
```

---

## PHASE-BASED SKILL RECOMMENDATIONS

### Phase 1: Foundation

- git, config, security, database

### Phase 2: Core Development

- api-design, testing, tdd, code-quality

### Phase 3: Feature Development

- implement, ui-ux-pro-max, diagnosing-bugs

### Phase 4: Polish & Quality

- pr-review, documentation, performance

### Phase 5: Infrastructure

- docker, ci-cd, deployment, kubernetes

### Phase 6: Launch

- observability, reliability, scalability
