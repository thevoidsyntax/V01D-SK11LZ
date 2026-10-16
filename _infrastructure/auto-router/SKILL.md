---
name: auto-router
version: "2.0.0"
description: "Automatic skill detection and loading system for the skills ecosystem"
when_to_use: "Automatically invoked by autor - handles detection patterns and skill loading"
priority: critical
phase: any
category: [infrastructure]
auto_invoke:
  enabled: true
  conditions:
    - always: true
      reason: "Auto-router is always running to detect patterns"
capabilities: [implementation]
source:
  origin: infrastructure
author: thevoidsyntax
---

# AUTO-ROUTER v2.0

**Automatic Skill Detection & Loading System**

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  AUTO-ROUTER                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DETECTION ENGINE                                          │
│  ├─ Pattern matching (phrases, files, commands)           │
│  ├─ Tech stack inference                                  │
│  └─ Context analysis                                      │
│                                                             │
│  SKILL LOADER                                              │
│  ├─ Core skills (always loaded)                           │
│  ├─ Conditional skills (auto-detect)                       │
│  └─ Integration mapping                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## CORE SKILLS (Always Loaded with /autor)

These 11 skills are automatically loaded when you invoke `/autor`:

| Skill | Path | Purpose |
|-------|------|---------|
| `git` | `_core/git/` | Version control |
| `config` | `_core/config/` | Environment & secrets |
| `security` | `_core/security/` | OWASP, encryption |
| `testing` | `_core/testing/` | QA + TDD |
| `error-debugger` | `_core/error-debugger/` | Debug patterns |
| `observability` | `_core/observability/` | Logs + Metrics + Traces |
| `doc-generator` | `_core/doc-generator/` | Auto-documentation |
| `mem-search` | `_core/mem-search/` | Memory continuity |
| `anti-slop` | `_core/anti-slop/` | Token efficiency |
| `chisle` | `_core/chisle/` | Context optimization |
| `caveman` | `_core/caveman/` | Aggressive compression |
| `codebase-design` | `_core/codebase-design/` | Architecture + DDD |

---

## CONDITIONAL SKILLS (Auto-Detect)

### Error & Debug
| Pattern | Skill | Path |
|---------|-------|------|
| `error`, `exception`, `bug`, `crash`, `SyntaxError`, `TypeError` | `/error-debugger` | `_core/error-debugger/` |
| `debug`, `breakpoint`, `inspect` | `/error-debugger` | `_core/error-debugger/` |

### Testing
| Pattern | Skill | Path |
|---------|-------|------|
| `test`, `spec`, `describe`, `expect`, `jest`, `vitest`, `pytest` | `/testing` | `_core/testing/` |
| `tdd`, `red-green-refactor`, `test-first` | `/testing` | `_core/testing/` |

### Documentation
| Pattern | Skill | Path |
|---------|-------|------|
| `readme`, `documentation`, `docs`, `changelog`, `api docs` | `/doc-generator` | `_core/doc-generator/` |
| `jsdoc`, `comment`, `inline docs` | `/doc-generator` | `_core/doc-generator/` |

### Frontend Frameworks
| Pattern | Skill | Path |
|---------|-------|------|
| `react`, `useState`, `useEffect`, `useCallback`, `jsx`, `tsx` | `/react-pro` | `react-pro/` |
| `next.js`, `nextjs`, `app router`, `getServerSideProps`, `layout.tsx` | `/nextjs-pro` | `nextjs-pro/` |
| `vue`, `composition api`, `pinia`, `<script setup`, `v-for` | `/vue-pro` | `vue-pro/` |
| `nuxt`, `nuxt.config`, `useFetch`, `definePageMeta` | `/nuxt-pro` | `nuxt-pro/` |
| `svelte`, `sveltekit`, `$state`, `$derived` | `/svelte-pro` | `svelte-pro/` |

### Backend Languages
| Pattern | Skill | Path |
|---------|-------|------|
| `python`, `django`, `flask`, `fastapi`, `pydantic` | `/python-pro` | `python-pro/` |
| `golang`, `go mod`, `func main`, `http.HandlerFunc` | `/go-pro` | `go-pro/` |
| `java`, `spring`, `@SpringBootApplication` | `/java-pro` | `java-pro/` |
| `.net`, `asp.net`, `csharp`, `Program.cs` | `/dotnet-pro` | `dotnet-pro/` |
| `nestjs`, `@nestjs`, `Controller`, `Module`, `Injectable` | `/nestjs-expert` | `nestjs-expert/` |
| `fastify`, `@fastify`, `fastify.get` | `/fastify-pro` | `fastify-pro/` |
| `rust`, `cargo`, `fn main`, `.rs` | `/rust-pro` | `rust-pro/` |

### Databases
| Pattern | Skill | Path |
|---------|-------|------|
| `postgresql`, `postgres`, `pg_`, `psycopg` | `/postgresql-pro` | `postgresql-pro/` |
| `mysql`, `mysqld`, `mariadb`, `sql.Open` | `/mysql-pro` | `mysql-pro/` |
| `mongodb`, `mongoose`, `MongoClient` | `/mongodb-pro` | `mongodb-pro/` |
| `redis`, `ioredis`, `cache`, `session` | `/redis-pro` | `redis-pro/` |
| `prisma`, `@prisma/client`, `schema.prisma` | `/prisma` | `prisma/` |
| `drizzle`, `drizzle-orm`, `drizzle.config` | `/drizzle` | `drizzle/` |
| `supabase`, `@supabase`, `supabase.from` | `/supabase` | `supabase/` |

### API Styles
| Pattern | Skill | Path |
|---------|-------|------|
| `graphql`, `gql`, `mutation`, `resolver`, `Apollo` | `/graphql` | `graphql/` |
| `grpc`, `protocol buffers`, `proto`, `grpc-server` | `/grpc-pro` | `grpc-pro/` |
| `rest api`, `endpoint`, `GET`, `POST`, `/api/` | `/api-design` | `api-design/` |

### UI/Styling
| Pattern | Skill | Path |
|---------|-------|------|
| `tailwind`, `tailwind.config`, `className=`, `flex`, `grid` | `/tailwindcss` | `tailwindcss/` |
| `design system`, `component library`, `token`, `storybook` | `/ui-ux-pro-max` | `_conditional/ui-ux-pro-max/` |
| `make it look`, `ui design`, `accessibility`, `a11y` | `/ui-ux-pro-max` | `_conditional/ui-ux-pro-max/` |

### Deployment & Infrastructure
| Pattern | Skill | Path |
|---------|-------|------|
| `docker`, `dockerfile`, `docker-compose`, `FROM` | `/docker` | `_conditional/docker/` |
| `kubernetes`, `k8s`, `kubectl`, `deployment.yaml` | `/kubernetes` | `_conditional/kubernetes/` |
| `terraform`, `tfstate`, `provider`, `resource` | `/terraform` | `_conditional/terraform/` |
| `github actions`, `.github/workflows`, `pipeline` | `/deployment` | `_conditional/deployment/` |
| `vercel`, `vercel.json`, `@vercel` | `/vercel` | `vercel/` |
| `railway`, `railway.json` | `/railway` | `railway/` |
| `fly.io`, `fly.toml` | `/flyio` | `flyio/` |
| `serverless`, `lambda`, `aws lambda` | `/serverless` | `_conditional/serverless/` |

### Mobile
| Pattern | Skill | Path |
|---------|-------|------|
| `react native`, `expo`, `rn-` | `/mobile` | `_conditional/mobile/` |
| `flutter`, `pubspec.yaml` | `/mobile` | `_conditional/mobile/` |

### AI/ML
| Pattern | Skill | Path |
|---------|-------|------|
| `langchain`, `LCEL`, `chain`, `prompt template` | `/langchain-architect` | `langchain-architect/` |
| `openai`, `gpt-`, `chatgpt`, `embedding` | `/openai` | `openai/` |
| `rag`, `vector store`, `pinecone`, `chroma` | `/rag-architect` | `rag-architect/` |
| `llm`, `model evaluation`, `benchmark` | `/llm-evaluation` | `llm-evaluation/` |

### Observability
| Pattern | Skill | Path |
|---------|-------|------|
| `prometheus`, `grafana`, `metrics`, `dashboard` | `/observability` | `_core/observability/` |
| `logging`, `pino`, `winston`, `structured log` | `/observability` | `_core/observability/` |
| `tracing`, `opentelemetry`, `jaeger`, `zipkin` | `/observability` | `_core/observability/` |
| `sentry`, `error tracking`, `crash reporting` | `/observability` | `_core/observability/` |

---

## INTEGRATION FLOW

```
1. User invokes /autor
         ↓
2. Auto-router loads 11 CORE skills
         ↓
3. Auto-router detects patterns in context
         ↓
4. Conditional skills loaded as needed
         ↓
5. Skills integrated with each other
```

---

## SKILL INTEGRATION MAP

```
_core/
├── git ──────────────────────────────────────────────────┐
├── config ───────────────────────────────────────────────┤
├── security ────────────────────────────────────────────┤
├── testing ──────────────────────────────────────────────┼── Integration
├── error-debugger ─────────────────────────────────────┤   Chain
├── observability ───────────────────────────────────────┤
├── doc-generator ───────────────────────────────────────┤
├── mem-search ─────────────────────────────────────────┤
├── anti-slop ──────────────────────────────────────────┤
├── chisle ─────────────────────────────────────────────┤
└── codebase-design ────────────────────────────────────┘

_conditional/
├── deployment ──────────────────────────────────────────┐
├── docker ─────────────────────────────────────────────┼── Conditional
├── kubernetes ────────────────────────────────────────┤   Loading
├── ui-ux-pro-max ────────────────────────────────────┤
└── [tech stack] ──────────────────────────────────────┘
```

---

## FILE-BASED DETECTION

### Core Files
| File | Indicates | Load |
|------|----------|------|
| `.git/` | Git repository | `/git` |
| `.env` | Config needed | `/config` |
| `package.json` | Node.js project | Detect stack |
| `requirements.txt` | Python project | `/python-pro` |
| `go.mod` | Go project | `/go-pro` |
| `Cargo.toml` | Rust project | `/rust-pro` |
| `pom.xml` | Java project | `/java-pro` |

### Test Files
| File | Load |
|------|------|
| `*.test.ts` | `/testing` |
| `*.spec.ts` | `/testing` |
| `**/tests/**` | `/testing` |
| `pytest.ini` | `/testing` |
| `*_test.go` | `/testing` |

### Config Files
| File | Load |
|------|------|
| `dockerfile` | `/docker` |
| `docker-compose.yml` | `/docker` |
| `kubernetes/**` | `/kubernetes` |
| `terraform/**` | `/terraform` |
| `.github/workflows/**` | `/deployment` |
| `tailwind.config.*` | `/tailwindcss` |
| `next.config.*` | `/nextjs-pro` |

---

## Changelog

### v2.0.0
- ✅ Updated for new folder structure
- ✅ Core skills in `_core/` (11 skills)
- ✅ Conditional skills in `_conditional/`
- ✅ Infrastructure: `_infrastructure/`

### v1.0.0
- Original pattern detection
- Basic skill mapping
