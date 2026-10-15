# V01D-RULEZ

> Intelligent skills that dominate your codebase.

**100+** skills with auto-invocation based on project context.

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

### Primary Commands (Memory Continuity)
Every `/autor` command automatically invokes both `/autor` AND `/mem-search` to ensure project context continuity:

| Command | Skills Invoked |
|---------|---------------|
| `/autor` | `/autor` + `/mem-search` |
| `/autor new` | `/autor` + `/mem-search` |
| `/autor scan` | `/autor` + `/mem-search` |

### Layer 1: Always On (17 skills)
Always loaded in memory for every project:

| Skill | Description |
|-------|-------------|
| `/git` | Version control workflows, branching strategies |
| `/config` | Environment variables, secrets, feature flags |
| `/security` | OWASP, validation, CORS, input sanitization |
| `/docker` | Multi-stage builds, security hardening |
| `/ci-cd` | GitHub Actions, GitLab CI, deployment pipelines |
| `/code-quality` | Code review, Fowler smells, static analysis |
| `/testing` | Unit, integration, E2E, mutation, property-based |
| `/tdd` | Test-driven development, red-green-refactor loop |
| `/error-debugger` | Debug patterns, DX improvement |
| `/logging` | Structured logging, correlation IDs |
| `/observability` | Metrics, logs, traces, dashboards, alerts |
| `/doc-generator` | Auto-documentation mindset |
| `/mem-search` | Knowledge retrieval |
| `/codebase-design` | Deep module vocabulary, clean seams |
| `/domain-modeling` | Ubiquitous language, ADR, bounded context |
| `/api-design` | REST patterns, error format, versioning |
| `/anti-slop` | Token efficiency, concise output |

### Layer 2: Auto-Detect (based on project type)
Skills that auto-invoke when specific tech stack is detected:

| Trigger | Skills |
|---------|--------|
| `**/package.json` | `/react-pro`, `/nextjs-pro`, `/tailwindcss` |
| `**/*.vue` | `/vue-pro` |
| `**/*.svelte` | `/svelte-pro` |
| `**/nuxt.config.*` | `/nuxt-pro` |
| `**/go.mod` | `/go-pro`, `/api-design` |
| `**/requirements.txt` | `/python-pro` |
| `**/pom.xml` | `/java-pro` |
| `**/*.csproj` | `/dotnet-pro` |
| `**/schema.prisma` | `/prisma` |
| `**/Dockerfile` | `/docker` |
| `kubernetes/**` | `/kubernetes` |
| `.github/workflows/**` | `/ci-cd` |
| `**/*.graphql` | `/graphql` |

### Memory & Continuity (Auto-invoke /mem-search)
Automatically retrieves previous context when continuing work:

| Trigger | Skills |
|---------|--------|
| `continue`, `lanjutkan` | `/mem-search` |
| `remember`, `memori` | `/mem-search` |
| `layer architecture` | `/mem-search` |
| `existing project`, `project lama` | `/mem-search` |

---

## Skills Overview (100 Skills)

### 🔧 Core DevOps (11 skills)

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
| `/kubernetes` | HPA, security, Helm, service mesh |
| `/serverless` | Lambda, Cloud Functions, Edge Computing |
| `/scalability` | Auto-scaling, read replicas, CDN |

### 🔒 Security (5 skills)

| Skill | Description |
|-------|-------------|
| `/security` | Auth, encryption, OWASP, vulnerability scanning |
| `/pentest` | Hacker-style pentesting, ZAP, SQLMap, Nuclei |
| `/identity` | OAuth2, OIDC, MFA, session management |
| `/compliance` | GDPR, SOC2, audit trail |
| `/fullstack-guardian` | Security-focused full-stack implementation |

### 🧪 Testing & Quality (7 skills)

| Skill | Description |
|-------|-------------|
| `/testing` | Unit, integration, E2E, mutation, property-based |
| `/tdd` | Test-driven development, red-green-refactor loop |
| `/code quality` | Code review, Fowler smells, static analysis |
| `/diagnosing-bugs` | 6-phase systematic debugging |
| `/playwright` | E2E browser automation testing |
| `/testing-integration` | Integration testing with MSW, contract testing |
| `/tech-debt` | Technical debt identification and management |

### 🏗️ Architecture (4 skills)

| Skill | Description |
|-------|-------------|
| `/architecture-patterns` | Hexagonal, microservices, modular monolith |
| `/domain-modeling` | Build domain model, bounded contexts |
| `/codebase-design` | Deep module vocabulary, clean seams |
| `/fullstack-patterns` | Backend-Frontend integration patterns |

### 🗄️ Database (6 skills)

| Skill | Description |
|-------|-------------|
| `/database` | SQL optimization, migrations, indexing |
| `/postgresql-pro` | PostgreSQL-specific patterns and optimization |
| `/mysql-pro` | MySQL-specific patterns and optimization |
| `/mongodb-pro` | MongoDB document modeling and patterns |
| `/redis-pro` | Redis caching, pub/sub, data structures |
| `/database-migration` | Zero-downtime migration strategies |

### 🌐 API & Integration (10 skills)

| Skill | Description |
|-------|-------------|
| `/api-design` | REST, gRPC, pagination, API Gateway |
| `/api-client` | HTTP client patterns, retry, circuit breaker |
| `/api-contracts` | OpenAPI specs, contract testing |
| `/graphql` | Schema design, DataLoader, subscriptions |
| `/messaging` | Kafka, RabbitMQ, SQS, event patterns |
| `/message-queue` | Queue patterns, DLQ, Saga, Outbox |
| `/integration-patterns` | ETL/ELT, API composition |
| `/data-engineering` | CDC, data warehouse, ETL |
| `/data-fetch` | TanStack Query, SWR, caching strategies |
| `/realtime` | WebSocket, SSE, real-time patterns |

### 📊 Observability (5 skills)

| Skill | Description |
|-------|-------------|
| `/observability` | Metrics, tracing, alerting, SLOs |
| `/performance` | Profiling, benchmarking, optimization |
| `/performance-ui` | Core Web Vitals, bundle optimization |
| `/error-tracking` | Exception management, observability |
| `/reliability` | SLO/SLA, incident response, DR |

### ☁️ Cloud & Infrastructure (8 skills)

| Skill | Description |
|-------|-------------|
| `/cloud-architect` | AWS, Azure, GCP architecture design |
| `/networking` | DNS, TLS, load balancer, WAF |
| `/storage` | S3, blob storage, CDN strategies |
| `/platform-engineering` | IDP, developer self-service |
| `/devops-engineer` | CI/CD, IaC, automation |
| `/data-quality` | Data validation and QA |
| `/reticle` | Cloud cost optimization |
| `/finops` | FinOps practices, cost visibility |

### 💻 Languages (10 skills)

| Skill | Description |
|-------|-------------|
| `/typescript-pro` | Advanced types, branded types, discriminated unions |
| `/python-pro` | Advanced Python, Django, FastAPI |
| `/go-pro` | Go concurrency, interfaces, idiomatic practices |
| `/rust-pro` | Ownership, async, zero-cost abstractions |
| `/java-pro` | Spring Boot, Jakarta EE, enterprise patterns |
| `/dotnet-pro` | .NET Core, ASP.NET, Entity Framework |
| `/nestjs-expert` | NestJS modular architecture, DI |
| `/react-pro` | React hooks, state management, patterns |
| `/nextjs-pro` | Next.js App Router, SSR, ISR |
| `/graphql` | GraphQL schema design, resolvers |

### 🎨 Frontend (5 skills)

| Skill | Description |
|-------|-------------|
| `/ui-ux-pro-max` | Design intelligence, accessibility |
| `/ui-ux-pro-max-design-system` | Design system patterns |
| `/ui-ux-pro-max-styling` | CSS, Tailwind, styling patterns |
| `/mobile` | Offline-first, biometric, push notifications |
| `/dev-browser` | Development browser with debugging |

### 🤖 AI & ML (7 skills)

| Skill | Description |
|-------|-------------|
| `/ml-engineering` | ML lifecycle, drift detection, LLM patterns |
| `/ml-pipeline` | MLOps pipeline, Kubeflow, Airflow |
| `/langchain-architect` | LangChain, chains, agents, RAG |
| `/rag-architect` | RAG architecture, vector DB |
| `/llm-evaluation` | LLM benchmarks, quality metrics |
| `/ai-client` | AI API clients, token optimization |
| `/chisle` | Token optimization and cost reduction |

### 🔄 Workflow & GitHub (10 skills)

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
| `/implement` | Build from spec using TDD + review |
| `/reticle` | Project tracking and management |

### 🔮 Planning & Strategy (8 skills)

| Skill | Description |
|-------|-------------|
| `/wayfinder` | Plan large work as decision tickets |
| `/grill-with-docs` | Documentation-driven interview |
| `/handoff` | Compact conversation for agent handoff |
| `/research` | Primary source investigation |
| `/writing-for-agents` | Write skills/docs for AI agents |
| `/feature-forge` | PRD creation and feature specs |
| `/feature-flags` | Progressive delivery, A/B testing |
| `/team-processes` | Team workflows, ceremonies |

### 🛠️ Browser Automation (2 skills)

| Skill | Description |
|-------|-------------|
| `/dev-browser` | Fast (~13ms), JS-native, persistent tabs |
| `/browser-use` | AI agent browser, cloud support |

### 🛡️ Anti-AI (2 skills)

| Skill | Description |
|-------|-------------|
| `/anti-slop` | Strip AI patterns, restore human voice |
| `/skill-creator` | Create new skills with templates |

### 🎮 Specialized (6 skills)

| Skill | Description |
|-------|-------------|
| `/gaming` | Game server, lag compensation |
| `/iot-edge` | OTA, edge deployment |
| `/search` | Search engine architecture, Elasticsearch |
| `/pentest` | Security penetration testing |
| `/documentation` | README, RFC, onboarding |
| `/skillspector` | Quality scoring for skill bundles |

### 🔍 Meta Skills (4 skills)

| Skill | Description |
|-------|-------------|
| `/autor` | Smart router with intent detection |
| `/mem-search` | Memory & knowledge base search |
| `/audit` | Full codebase audit with adversarial verification |
| `/diagnosing-bugs` | Systematic debugging framework |

---

## Architecture

```
INPUT ──► /autor Router ──► Skill Selector ──► Active Skills
         │                      │
         ▼                      ▼
    • Intent detection      • LAYER 1: FOUNDATION (17 always-on)
    • Tech stack scan      • LAYER 2: TECH STACK (auto-detect)
    • Pattern recognition   • LAYER 3: REQUIREMENTS (user choice)
    • Scale estimation
```

### Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THREE-LAYER SKILL SYSTEM                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  LAYER 1: FOUNDATION (17 skills - ALWAYS)                                   │
│  └─ git, config, security, docker, ci-cd, code-quality, testing, tdd,    │
│      error-debugger, logging, observability, doc-generator, mem-search,   │
│      codebase-design, domain-modeling, api-design, anti-slop             │
│                                                                                  │
│  LAYER 2: TECH STACK (~24 skills - AUTO-DETECT)                            │
│  └─ framework (react, vue, svelte, nuxt), language (python, go, java),   │
│      database (postgresql, mysql, mongodb, redis), api-style (graphql,   │
│      grpc), ui-styling (tailwindcss), mobile                                │
│                                                                                  │
│  LAYER 3: REQUIREMENTS (USER CHOICE)                                        │
│  └─ auth, payments, ai/ml, form-handling, etc.                            │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Stats

| Metric | Value |
|--------|-------|
| **Total Skills** | 100+ |
| **Auto-Invoke** | 50+ |
| **Layer 1: Foundation** | 17 |
| **Layer 2: Tech Stack** | ~24 |
| **Layer 3: Requirements** | ~15 |
| **Categories** | 15 |

---

## Contributing

1. Fork the repository
2. Create a new skill directory (`skill-name/SKILL.md`)
3. Follow the skill template structure
4. Submit a pull request

## License

MIT License - See [LICENSE](LICENSE)
