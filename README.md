# V01D-RULEZ

> Intelligent skills that dominate your codebase.

**80+** skills with auto-invocation based on project context.

## Quick Start

```bash
git clone https://github.com/thevoidsyntax/my-skills.git ~/.claude/skills
```

### Core Commands

| Command | Fungsi |
|---------|--------|
| `/autor` | Smart dashboard dengan auto-detect |
| `/autor scan` | Analyze existing project |
| `/autor new` | New project wizard |
| `/autor status` | Show saved state |

---

## Auto-Invoke System

Skills activate automatically based on your project context:

| Trigger | Skills |
|---------|--------|
| **Always-on** | `/git`, `/security`, `/testing`, `/tdd` |
| `**/tests/**` | `/testing` |
| `**/Dockerfile` | `/docker` |
| `kubernetes/**` | `/kubernetes` |
| `.github/workflows/**` | `/ci-cd` |
| Express/Fastify/NestJS | `/api-design` |
| React/Vue/Angular | `/frontend` |

---

## Skills Overview

### Project Intelligence

| Skill | Description |
|-------|-------------|
| `/autor` | Smart router with intent detection |
| `/project-init` | Interactive project setup with Q&A |
| `/analyze-project` | Tech stack detection + recommendations |

### Core DevOps (7 skills)

Essential skills for every project:

| Skill | Description |
|-------|-------------|
| `/git` | Version control workflows, branching strategies, rebasing |
| `/docker` | Multi-stage builds, security hardening, compose patterns |
| `/ci-cd` | GitHub Actions, GitLab CI, deployment pipelines |
| `/deployment` | Blue-green, canary, zero-downtime deployments |
| `/config` | Environment variables, secrets, feature flags |
| `/logging` | Structured logging, correlation IDs, log management |
| `/terraform` | Infrastructure as Code, modules, state |
| `/ansible` | Configuration management, playbooks |

### Security (4 skills)

| Skill | Description |
|-------|-------------|
| `/security` | Auth, encryption, OWASP, vulnerability scanning |
| `/pentest` | Hacker-style pentesting, ZAP, SQLMap, Nuclei |
| `/identity` | OAuth2, OIDC, MFA, session management |
| `/compliance` | GDPR, SOC2, audit trail |

### Testing & Quality (4 skills)

| Skill | Description |
|-------|-------------|
| `/testing` | Unit, integration, E2E, mutation, property-based |
| `/tdd` | Test-driven development, red-green-refactor loop |
| `/code quality` | Code review, Fowler smells, static analysis |
| `/diagnosing-bugs` | 6-phase systematic debugging |

### Architecture (3 skills)

| Skill | Description |
|-------|-------------|
| `/architecture-patterns` | Hexagonal, microservices, modular monolith |
| `/domain-modeling` | Build domain model, bounded contexts |
| `/codebase-design` | Deep module vocabulary, clean seams |

### Data & APIs (5 skills)

| Skill | Description |
|-------|-------------|
| `/database` | SQL optimization, migrations, indexing |
| `/api-design` | REST, gRPC, pagination, API Gateway |
| `/graphql` | Schema design, DataLoader, subscriptions |
| `/messaging` | Kafka, RabbitMQ, SQS, event patterns |
| `/data-engineering` | ETL, CDC, data warehouse |

### Performance & Observability (4 skills)

| Skill | Description |
|-------|-------------|
| `/performance` | Profiling, benchmarking, optimization |
| `/observability` | Metrics, tracing, alerting, SLOs |
| `/logging` | Structured logging, ELK stack, Loki |
| `/reliability` | SLO/SLA, incident response, DR |

### Cloud & Infrastructure (5 skills)

| Skill | Description |
|-------|-------------|
| `/kubernetes` | HPA, security, Helm, service mesh |
| `/serverless` | Lambda, Cloud Functions, Edge Computing |
| `/scalability` | Auto-scaling, read replicas, CDN |
| `/networking` | DNS, TLS, load balancer, WAF |
| `/reliability` | SLO/SLA, incident response, DR |

### Frontend (3 skills)

| Skill | Description |
|-------|-------------|
| `/frontend` | React, Vue, Angular, state management |
| `/ui-ux-pro-max` | Design intelligence, accessibility |
| `/mobile` | Offline-first, biometric, push notifications |

### AI Collaboration (7 skills)

From Matt Pocock's curated collection:

| Skill | Description |
|-------|-------------|
| `/implement` | Build from spec using TDD + code-review |
| `/code-review` | Two-axis review: Standards + Spec |
| `/wayfinder` | Plan large work as decision tickets |
| `/grilling` | Relentless interview for design validation |
| `/handoff` | Compact conversation for agent handoff |
| `/research` | Primary source investigation |
| `/writing-for-agents` | Write skills/docs for AI agents |

### GitHub Workflow (8 skills)

| Skill | Description |
|-------|-------------|
| `/new-issue` | Create complete issue with complexity score |
| `/validate-issue` | Fact-check issue against code |
| `/work-on-issue` | Implement + PR in isolated worktree |
| `/fix-pr-review` | Fix review comments, request re-review |
| `/pr-review` | Review format reference |
| `/create-release` | Bump version + publish release |
| `/sync-docs` | Sync CLAUDE.md/AGENTS.md/SKILL.md |
| `/commit` | Guided conventional commit |

### Browser Automation (2 skills)

| Skill | Description |
|-------|-------------|
| `/dev-browser` | Fast (~13ms), JS-native, persistent tabs |
| `/browser-use` | AI agent browser, cloud support |

### Anti-AI Writing (2 skills)

| Skill | Description |
|-------|-------------|
| `/slopbuster` | Strip 152 AI patterns, restore human voice |
| `/anti-slop` | Remove AI-generated artifacts |

### Specialized (7 skills)

| Skill | Description |
|-------|-------------|
| `/ml-engineering` | ML lifecycle, drift detection, LLM patterns |
| `/python-pro` | Advanced Python, Django, FastAPI |
| `/typescript-pro` | Advanced types, branded types, discriminated unions |
| `/gaming` | Game server, lag compensation |
| `/iot-edge` | OTA, edge deployment |
| `/finops` | Cost visibility, tagging |
| `/documentation` | README, RFC, onboarding |

---

## Architecture

```
INPUT ──► /autor Router ──► Skill Selector ──► Active Skills
         │                      │
         ▼                      ▼
    • Intent detection      • CORE_SKILLS (18)
    • Tech stack scan     • Context-matched
    • Pattern recognition • Dependencies resolved
    • Scale estimation    • Priority ordered
```

---

## Stats

| Metric | Value |
|--------|-------|
| **Total Skills** | 80+ |
| **Auto-Invoke** | 45 |
| **Always-On Core** | 18 |
| **Categories** | 14 |

---

## Contributing

1. Fork the repository
2. Create a new skill directory (`skill-name/SKILL.md`)
3. Follow the skill template structure
4. Submit a pull request

## License

MIT License - See [LICENSE](LICENSE)
