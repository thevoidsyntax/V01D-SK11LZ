---
name: auto-router
version: "14.0.0"
description: "Smart skill recommendations with quality analysis, gap detection, health scoring, and actionable recommendations."
when_to_use: "Run when starting a project, analyzing existing codebase, or needing comprehensive project intelligence."
priority: critical
phase: any
category: [process, intelligence]
tech_stack:
  languages: [all]
  frameworks: [all]
  databases: [all]
  services: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    # Primary commands (always invoke mem-search for continuity)
    - command: ["/autor", "/ar", "/autor scan", "/autor status", "/autor analyze", "/autor help", "/autor new", "/autor init"]
      auto_invoke: /autor, /mem-search
      reason: "Primary entry - invoke both autor and mem-search for project context continuity"
    
    # Helper Skills Auto-Invoke
    - pattern: ["error", "exception", "bug", "crash", "failed", "SyntaxError", "TypeError", "ReferenceError", "Cannot read", "undefined is not", "Type 'any'", "Property.*does not exist"]
      auto_invoke: /error-debugger
      reason: "Error pattern detected - auto-invoking error-debugger"
    - pattern: ["test", "spec", "describe", "it\\(", "expect", "assert", "coverage", "jest", "vitest", "mocha", "pytest", "testing"]
      auto_invoke: /test-generator
      reason: "Testing pattern detected - auto-invoking test-generator"
    - pattern: ["readme", "documentation", "docs", "changelog", "jsdoc", "comment", "api docs"]
      auto_invoke: /doc-generator
      reason: "Documentation pattern detected - auto-invoking doc-generator"
    
    # FRONTEND FRAMEWORKS Auto-Invoke
    - pattern: ["react", "useState", "useEffect", "useCallback", "useMemo", "useRef", "useContext", "useReducer", "jsx", "tsx", "component", "React.FC", "props", "React.Component"]
      auto_invoke: /react-pro
      reason: "React pattern detected - auto-invoking react-pro"
    - pattern: ["next.js", "nextjs", "app router", "next.config", "getServerSideProps", "getStaticProps", "app/", "route.ts", "layout.tsx", "page.tsx"]
      auto_invoke: /nextjs-pro
      reason: "Next.js pattern detected - auto-invoking nextjs-pro"
    - pattern: ["vue", "composition api", "pinia", "<script setup", "ref\\(", "reactive\\(", "computed\\(", "watch\\(", "defineProps", "defineEmits", "v-for", "v-if"]
      auto_invoke: /vue-pro
      reason: "Vue.js pattern detected - auto-invoking vue-pro"
    - pattern: ["svelte", "sveltekit", "$state", "$derived", "$effect", "<script lang", "<script>", "event handling", "on:click", "onMount"]
      auto_invoke: /svelte-pro
      reason: "Svelte pattern detected - auto-invoking svelte-pro"
    - pattern: ["tailwind", "tailwind.config", "className=", "class=\\{", "tw-", "flex ", "grid ", "p-", "m-", "bg-", "text-", "w-", "h-"]
      auto_invoke: /tailwindcss
      reason: "Tailwind CSS pattern detected - auto-invoking tailwindcss"
    - pattern: ["nuxt", "nuxt.config", "useFetch", "useAsyncData", "definePageMeta"]
      auto_invoke: /nuxt-pro
      reason: "Nuxt.js pattern detected - auto-invoking nuxt-pro"
    
    # BACKEND Auto-Invoke
    - pattern: ["express", "app.get", "app.post", "app.use", "router.get", "router.post", "req.body", "res.json", "middleware"]
      auto_invoke: /api-design
      reason: "Express.js pattern detected - auto-invoking api-design"
    - pattern: ["fastify", "@fastify", "fastify.listen", "fastify.get", "fastify.post", "fastify schema"]
      auto_invoke: /fastify-pro
      reason: "Fastify pattern detected - auto-invoking fastify-pro"
    - pattern: ["nestjs", "@nestjs", "Controller", "Module", "Injectable", "@Inject", "@Controller", "Dto"]
      auto_invoke: /nestjs-expert
      reason: "NestJS pattern detected - auto-invoking nestjs-expert"
    - pattern: ["python", "django", "flask", "fastapi", "def ", "import ", "from ", "pip install", "requirements.txt", "uvicorn", "async def", "pydantic"]
      auto_invoke: /python-pro
      reason: "Python pattern detected - auto-invoking python-pro"
    - pattern: ["go", "golang", "func main", "package main", "import \\(", "go.mod", ":= ", "fmt.Println", "http.HandlerFunc"]
      auto_invoke: /go-pro
      reason: "Go pattern detected - auto-invoking go-pro"
    - pattern: ["spring", "@SpringBootApplication", "public static void main", "Controller.java", "Service.java", "Repository.java"]
      auto_invoke: /java-pro
      reason: "Spring Boot pattern detected - auto-invoking java-pro"
    - pattern: ["asp.net", ".net core", "Startup.cs", "Program.cs", "appsettings.json"]
      auto_invoke: /dotnet-pro
      reason: ".NET Core pattern detected - auto-invoking dotnet-pro"
    
    # DATABASE Auto-Invoke
    - pattern: ["postgresql", "postgres", "pg_", "psycopg", "pgpool", "pgconnect", "createPool", "Pool"]
      auto_invoke: /postgresql-pro
      reason: "PostgreSQL pattern detected - auto-invoking postgresql-pro"
    - pattern: ["mysql", "mysql2", "mysqld", "mariadb", "sql.Open", "createConnection"]
      auto_invoke: /mysql-pro
      reason: "MySQL pattern detected - auto-invoking mysql-pro"
    - pattern: ["mongodb", "mongoose", "mongo", "MongoClient", "findOne", "find\\(\\)", "Schema", "Model<T>"]
      auto_invoke: /mongodb-pro
      reason: "MongoDB pattern detected - auto-invoking mongodb-pro"
    - pattern: ["redis", "ioredis", "redis-cli", "setRedis", "getRedis", "cache", "Cache"]
      auto_invoke: /redis-pro
      reason: "Redis pattern detected - auto-invoking redis-pro"
    - pattern: ["prisma", "@prisma/client", "prisma schema", "prisma db", "schema.prisma"]
      auto_invoke: /prisma
      reason: "Prisma ORM pattern detected - auto-invoking prisma"
    - pattern: ["drizzle", "drizzle-orm", "drizzle.config", "schema.ts"]
      auto_invoke: /drizzle
      reason: "Drizzle ORM pattern detected - auto-invoking drizzle"
    - pattern: ["supabase", "@supabase", "supabase.from", "supabase.auth"]
      auto_invoke: /supabase
      reason: "Supabase pattern detected - auto-invoking supabase"
    - pattern: ["sqlite", ".db", ".sqlite", "sqlite3", "better-sqlite3"]
      auto_invoke: /database
      reason: "SQLite pattern detected - auto-invoking database"
    
    # DEPLOYMENT Auto-Invoke
    - pattern: ["docker", "dockerfile", "docker-compose", "docker build", "docker run", "FROM ", "dockerignore"]
      auto_invoke: /docker
      reason: "Docker pattern detected - auto-invoking docker"
    - pattern: ["vercel", "vercel.json", "vercel.app", "@vercel", "Edge Runtime", "Serverless Function"]
      auto_invoke: /vercel
      reason: "Vercel pattern detected - auto-invoking vercel"
    - pattern: ["railway", "railway.json", "railway.app", "nixpacks"]
      auto_invoke: /railway
      reason: "Railway pattern detected - auto-invoking railway"
    - pattern: ["fly.io", "fly.toml", "fly launch", "fly deploy", "vpn"]
      auto_invoke: /flyio
      reason: "Fly.io pattern detected - auto-invoking flyio"
    - pattern: ["kubernetes", "k8s", "kubectl", "deployment.yaml", "service.yaml", "ConfigMap", "Secret"]
      auto_invoke: /kubernetes
      reason: "Kubernetes pattern detected - auto-invoking kubernetes"
    - pattern: ["terraform", "tfstate", "provider ", "resource ", "terraform init", "tfvars"]
      auto_invoke: /terraform
      reason: "Terraform pattern detected - auto-invoking terraform"
    - pattern: ["github actions", ".github/workflows", "workflow.yml", "CI/CD", "pipeline", "actions:checkout"]
      auto_invoke: /ci-cd
      reason: "GitHub Actions pattern detected - auto-invoking ci-cd"
    - pattern: ["netlify", "netlify.toml", "netlify.app"]
      auto_invoke: /deployment
      reason: "Netlify pattern detected - auto-invoking deployment"
    
    # SECURITY & AUTH Auto-Invoke
    - pattern: ["auth", "authentication", "login", "logout", "jwt", "session", "cookie", "token", "passport", "bcrypt"]
      auto_invoke: /auth-flows
      reason: "Authentication pattern detected - auto-invoking auth-flows"
    - pattern: ["security", "vulnerability", "xss", "sql injection", "csrf", "cors", "helmet", "rate limit"]
      auto_invoke: /security
      reason: "Security pattern detected - auto-invoking security"
    
    # API & INTEGRATION Auto-Invoke
    - pattern: ["api route", "rest api", "restful", "endpoint", "api.get", "api.post", "/api/", "GET ", "POST ", "PUT ", "DELETE "]
      auto_invoke: /api-design
      reason: "API pattern detected - auto-invoking api-design"
    - pattern: ["webhook", "stripe", "payment", "checkout", "subscription", "invoice", "payment_intent"]
      auto_invoke: /webhooks
      reason: "Webhook/payment pattern detected - auto-invoking webhooks"
    - pattern: ["graphql", "gql", "query ", "mutation ", "subscription ", "schema.graphql", "Apollo", "resolver"]
      auto_invoke: /graphql
      reason: "GraphQL pattern detected - auto-invoking graphql"
    - pattern: ["websocket", "ws://", "wss://", "socket.io", "io\\(", "server.emit", "Socket.io", "pusher"]
      auto_invoke: /realtime
      reason: "WebSocket pattern detected - auto-invoking realtime"
    - pattern: ["email", "nodemailer", "sendgrid", "SES", "mailgun", "smtp", "SMTP"]
      auto_invoke: /integration-patterns
      reason: "Email pattern detected - auto-invoking integration-patterns"
    
    # STATE MANAGEMENT Auto-Invoke
    - pattern: ["zustand", "create\\(\\(set", "store.getState", "useStore"]
      auto_invoke: /react-pro
      reason: "Zustand pattern detected - auto-invoking react-pro"
    - pattern: ["redux", "createSlice", "createAsyncThunk", "createStore", "Provider", "useSelector", "useDispatch"]
      auto_invoke: /react-pro
      reason: "Redux pattern detected - auto-invoking react-pro"
    - pattern: ["tanstack query", "useQuery", "useMutation", "@tanstack", "QueryClient", "QueryClientProvider"]
      auto_invoke: /data-fetch
      reason: "TanStack Query pattern detected - auto-invoking data-fetch"
    
    # TYPESCRIPT & CODE QUALITY Auto-Invoke
    - pattern: ["typescript", "tsconfig", "\\.ts", "\\.tsx", ": string", ": number", ": boolean", "interface ", "type "]
      auto_invoke: /typescript-pro
      reason: "TypeScript pattern detected - auto-invoking typescript-pro"
    
    # INFRASTRUCTURE Auto-Invoke
    - pattern: ["nginx", "proxy_pass", "upstream", "负载均衡", "reverse proxy"]
      auto_invoke: /deployment
      reason: "Nginx pattern detected - auto-invoking deployment"
    - pattern: ["aws", "amazon", "s3", "lambda", "ec2", "sns", "sqs", "cloudformation"]
      auto_invoke: /cloud-architect
      reason: "AWS pattern detected - auto-invoking cloud-architect"
    
    # EMPTY PROJECT GUIDANCE
    - pattern: ["new project", "start fresh", "from scratch", "blank", "empty project", "mulai project baru", "proyek baru", "start from zero"]
      auto_invoke: /autor
      reason: "New project intent detected - guiding empty project flow"

    # MEMORY & CONTINUITY (Auto-invoke mem-search)
    - pattern: ["continue", "lanjutkan", "melanjutkan", "sebelumnya", "previous"]
      auto_invoke: /mem-search
      reason: "Continue intent detected - retrieving previous context"
    - pattern: ["remember", "ingin", "memori", "memory", "yang lalu"]
      auto_invoke: /mem-search
      reason: "Memory retrieval intent detected"
    - pattern: ["layer architecture", "skill ecosystem", "konfigurasi skill"]
      auto_invoke: /mem-search
      reason: "Skill configuration context detected - retrieving memory"
    - pattern: ["project lama", "old project", "existing project", "proyek yang sudah ada"]
      auto_invoke: /mem-search
      reason: "Existing project context - retrieving project memory"

    # PROJECT TYPE GUIDANCE
    - pattern: ["web app", "website", "landing page", "portfolio", "blog"]
      auto_invoke: /autor
      reason: "Web app intent detected - suggesting Next.js/Vercel"
    - pattern: ["api", "backend", "rest api", "graphql api"]
      auto_invoke: /autor
      reason: "API intent detected - suggesting backend stack"
    - pattern: ["mobile app", "react native", "expo"]
      auto_invoke: /mobile
      reason: "Mobile app pattern detected - invoking mobile"
    - pattern: ["cli tool", "command line", "terminal", "bin/"]
      auto_invoke: /developer-experience
      reason: "CLI pattern detected - invoking dev-experience"
core_skills:
  # ============================================================================
  # LAYER 1: FOUNDATION (Always Active)
  # Skills universal untuk semua project - selalu loaded di memory
  # ============================================================================
  always:
    # Version Control & Config
    - /git                    # Version control - universal
    - /config                # Environment variables, secrets management
    - /security              # OWASP, validation, CORS, input sanitization
    
    # DevOps Foundation
    - /docker                # Containerization - standard deployment
    - /ci-cd                 # Automation pipelines - build → test → deploy
    
    # Quality Gates
    - /code-quality          # Code review, refactoring, smells
    - /testing               # Test strategy, coverage, test types
    - /tdd                   # Test-first workflow - red-green-refactor
    
    # DX & Debugging
    - /error-debugger        # Debug patterns - DX critical
    
    # Documentation & Knowledge
    - /doc-generator         # Auto-documentation mindset
    - /mem-search            # Knowledge retrieval - session continuity
    
    # Observability
    - /logging               # Structured logging, correlation IDs
    - /observability          # Metrics, logs, traces - 3 pillars
    
    # Architecture & Design
    - /codebase-design       # Module design, deep vs shallow, seams
    - /domain-modeling       # Ubiquitous language, ADR, bounded context
    - /api-design            # REST patterns, error format, versioning
    
    # Efficiency
    - /anti-slop            # Token efficiency - concise output

  # ============================================================================
  # LAYER 2: TECH STACK SELECTION (Auto-Detect based on patterns)
  # Skills yang dipilih saat menentukan tech stack project
  # ============================================================================
  framework:
    # React Ecosystem
    - /react-pro             # React hooks, state, context, patterns
    - /nextjs-pro           # Next.js App Router, SSR, ISR
    # Vue Ecosystem
    - /vue-pro              # Vue 3 Composition API, Pinia
    - /nuxt-pro             # Nuxt.js file-based routing, SSR/SSG
    # Other
    - /svelte-pro           # Svelte 5, SvelteKit patterns
    
  language:
    - /python-pro           # Python patterns, typing, FastAPI/Django
    - /go-pro               # Go concurrency, interfaces, idiomatic
    - /java-pro             # Java/Spring Boot patterns
    - /dotnet-pro           # .NET Core, ASP.NET patterns
    - /rust-pro             # Rust ownership, lifetimes, async
    - /nestjs-expert        # NestJS modular architecture, DI
    - /fastify-pro          # Fastify plugins, schemas, performance
    
  database:
    - /postgresql-pro       # PostgreSQL optimization, indexing, JSONB
    - /mysql-pro            # MySQL patterns, partitioning
    - /mongodb-pro          # MongoDB document modeling, aggregation
    - /redis-pro            # Redis caching, pub/sub, distributed locks
    - /prisma               # Prisma ORM schema design, migrations
    - /drizzle             # Drizzle ORM type-safe queries
    - /supabase            # Supabase BaaS, auth, real-time
    
  api-style:
    - /graphql              # GraphQL schema, DataLoader, subscriptions
    - /grpc-pro            # gRPC, Protocol Buffers, streaming
    
  ui-styling:
    - /tailwindcss          # Tailwind CSS utilities, responsive design
    - /ui-ux-pro-max       # Design intelligence, accessibility, UX
    
  mobile:
    - /mobile               # Mobile-specific patterns (React Native, Expo)
    
  # ============================================================================
  # HELPER SKILLS (Auto-invoke based on detected patterns)
  # ============================================================================
  helper:
    - /error-debugger       # Error pattern detected
    - /test-generator       # Test pattern detected
    - /doc-generator        # Documentation pattern detected
capabilities:
  - discovery
  - analysis
  - quality-scoring
  - gap-detection
  - health-scoring
  - tech-debt-analysis
  - security-analysis
  - recommendations
  - auto_invoke
  - smart-pattern-detection
  - empty-project-guidance
  - project-type-detection
author: TheVoidSyntax
---

# 🚀 AUTO-ROUTER v12.0 - PROJECT INTELLIGENCE

**Intelligent Project Analysis with Smart Auto-Invoke, Empty Project Guidance & Project Type Detection**

---

## What's New in v12.0

### Smart Empty Project Flow

```
┌─────────────────────────────────────────────────────────────┐
│  EMPTY PROJECT DETECTION                                        │
├─────────────────────────────────────────────────────────────┤
│  User says "new project" or "from scratch"                     │
│  → /autor guides through wizard-like questions              │
│  → Understands intent (web app, API, CLI, mobile)           │
│  → Suggests optimal tech stack based on use case           │
│  → Generates project structure recommendations               │
│  → Provides boilerplate guidance                           │
└─────────────────────────────────────────────────────────────┘
```

### Project Type Detection

```
┌─────────────────────────────────────────────────────────────┐
│  AUTOMATIC PROJECT TYPE DETECTION                              │
├─────────────────────────────────────────────────────────────┤
│  "web app" / "website"    → Suggests: Next.js + Vercel + Tailwind   │
│  "api" / "backend"        → Suggests: Express + PostgreSQL         │
│  "mobile" / "react native" → Suggests: Mobile stack               │
│  "cli tool" / "command"   → Suggests: Go/Python/Node CLI patterns  │
│  "saas" / "startup"       → Suggests: Full-stack + Auth + Payments  │
└─────────────────────────────────────────────────────────────┘
```

---

## Empty Project Flow (v12.0)

### Step 1: Intent Detection

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 WELCOME TO AUTOR v12.0                                      │
│                                                              │
│  Detected: Empty project / New project intent                   │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  What type of project are you building?                   │  │
│  │                                                           │  │
│  │  [1] 🌐 Web App / Website                               │  │
│  │  [2] 🔌 API / Backend Service                         │  │
│  │  [3] 📱 Mobile App                                    │  │
│  │  [4] 🖥️  CLI Tool / Terminal App                       │  │
│  │  [5] 🤖 AI / ML Application                           │  │
│  │  [6] 🎮 Real-time / WebSocket App                    │  │
│  │  [7] 📊 Dashboard / Admin Panel                       │  │
│  │  [8] 🔐 SaaS / Multi-tenant App                     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                              │
│  Quick options:                                              │
│  /autor web      → Web App stack                           │
│  /autor api      → API stack                              │
│  /autor full     → Full-stack stack                       │
│  /autor saas     → SaaS stack                            │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: Tech Stack Recommendations

```
┌─────────────────────────────────────────────────────────────┐
│  📋 RECOMMENDED STACKS                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WEB APP → Recommended:                                       │
│  ├─ Frontend: Next.js + Tailwind + shadcn/ui                │
│  ├─ Deploy: Vercel                                           │
│  ├─ Auth: NextAuth.js / Clerk                                │
│  └─ Optional: PostgreSQL + Prisma if DB needed                 │
│                                                              │
│  API BACKEND → Recommended:                                    │
│  ├─ Runtime: Node.js / Fastify or Python / FastAPI              │
│  ├─ Database: PostgreSQL + Prisma/Drizzle                     │
│  ├─ Cache: Redis (optional)                                   │
│  └─ Deploy: Railway / Fly.io / AWS Lambda                     │
│                                                              │
│  FULL-STACK → Recommended:                                     │
│  ├─ Frontend: Next.js + React                               │
│  ├─ Backend: API Routes or tRPC                              │
│  ├─ Database: PostgreSQL + Prisma                            │
│  └─ Auth: NextAuth.js / Lucia                               │
│                                                              │
│  SAAS → Recommended:                                          │
│  ├─ Frontend: Next.js + Tailwind                           │
│  ├─ Backend: Next.js API / Node.js + Prisma                  │
│  ├─ Database: PostgreSQL (multi-tenant ready)              │
│  ├─ Auth: Clerk / Auth.js                                   │
│  ├─ Payments: Stripe                                        │
│  ├─ Email: Resend / Postmark                               │
│  └─ Deploy: Vercel / Railway                               │
│                                                              │
│  Type a number or describe your project →                    │
└─────────────────────────────────────────────────────────────┘
```

### Step 3: Quick Start Commands

```
┌─────────────────────────────────────────────────────────────┐
│  🚀 QUICK START                                              │
│                                                              │
│  Web App (Next.js + Vercel):                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  npx create-next-app@latest my-app                      │   │
│  │  cd my-app                                              │   │
│  │  npx shadcn-ui@latest init                             │   │
│  │  vercel deploy                                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  API (Fastify + PostgreSQL):                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  npm init -y                                            │   │
│  │  npm install fastify @fastify/cors @fastify/jwt prisma │   │
│  │  npx prisma init                                        │   │
│  │  npx prisma migrate dev                                 │   │
│  │  railway deploy                                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Copy command above or ask me to generate custom stack!        │
└─────────────────────────────────────────────────────────────┘
```

---

## Smart Pattern Detection (v12.0)

### Auto-Infer from Context

```
┌─────────────────────────────────────────────────────────────┐
│  USER SAYS: "useState hook in React"                        │
│  → Auto-detects: React + useState                          │
│  → Auto-invokes: /react-pro                              │
│  → Provides: useState patterns + best practices            │
├─────────────────────────────────────────────────────────────┤
│  USER SAYS: "postgres connection error"                    │
│  → Auto-detects: PostgreSQL + Error                       │
│  → Auto-invokes: /postgresql-pro + /error-debugger        │
│  → Provides: Connection fix + error debugging              │
├─────────────────────────────────────────────────────────────┤
│  USER SAYS: "deploy next.js to railway"                    │
│  → Auto-detects: Next.js + Railway                        │
│  → Auto-invokes: /nextjs-pro + /railway                  │
│  → Provides: Deployment guide                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Comprehensive Pattern Matrix (40+ patterns)

### Frontend (8 patterns)

| Pattern | Detects | Auto-Invoke |
|----------|---------|--------------|
| `useState`, `useEffect` | React hooks | `/react-pro` |
| `next.config`, `app router` | Next.js | `/nextjs-pro` |
| `composition api`, `pinia` | Vue 3 | `/vue-pro` |
| `$state`, `$derived` | Svelte 5 | `/svelte-pro` |
| `tailwind.config`, `class=` | Tailwind | `/tailwindcss` |
| `nuxt.config`, `useFetch` | Nuxt | `/nuxt-pro` |
| `zustand`, `createSlice` | State mgmt | `/react-pro` |
| `useQuery`, `QueryClient` | TanStack Query | `/data-fetch` |

### Backend (8 patterns)

| Pattern | Detects | Auto-Invoke |
|----------|---------|--------------|
| `express`, `app.get` | Express.js | `/api-design` |
| `fastify`, `@fastify` | Fastify | `/fastify-pro` |
| `@nestjs`, `Controller` | NestJS | `/nestjs-expert` |
| `def `, `flask` / `fastapi` | Python | `/python-pro` |
| `func main`, `http.Handler` | Go | `/go-pro` |
| `@SpringBoot`, `Controller.java` | Spring | `/java-pro` |
| `.NET`, `Startup.cs` | ASP.NET Core | `/dotnet-pro` |
| `api route`, `endpoint` | REST API | `/api-design` |

### Database (8 patterns)

| Pattern | Detects | Auto-Invoke |
|----------|---------|--------------|
| `postgres`, `pg_` | PostgreSQL | `/postgresql-pro` |
| `mysql`, `sql.Open` | MySQL | `/mysql-pro` |
| `mongoose`, `mongodb` | MongoDB | `/mongodb-pro` |
| `ioredis`, `redis` | Redis cache | `/redis-pro` |
| `prisma`, `schema.prisma` | Prisma ORM | `/prisma` |
| `drizzle`, `drizzle-orm` | Drizzle ORM | `/drizzle` |
| `supabase`, `@supabase` | Supabase | `/supabase` |
| `sqlite`, `.db` | SQLite | `/database` |

### Deployment (7 patterns)

| Pattern | Detects | Auto-Invoke |
|----------|---------|--------------|
| `dockerfile`, `docker-compose` | Docker | `/docker` |
| `vercel.json`, `@vercel` | Vercel | `/vercel` |
| `railway.json`, `railway` | Railway | `/railway` |
| `fly.toml`, `fly.io` | Fly.io | `/flyio` |
| `k8s`, `kubectl` | Kubernetes | `/kubernetes` |
| `terraform`, `tfstate` | Terraform | `/terraform` |
| `.github/workflows` | GitHub Actions | `/ci-cd` |

### Helper Skills (3 patterns)

| Pattern | Detects | Auto-Invoke |
|----------|---------|--------------|
| `TypeError`, `SyntaxError` | Errors | `/error-debugger` |
| `test`, `jest`, `vitest` | Testing | `/test-generator` |
| `readme`, `docs`, `jsdoc` | Docs | `/doc-generator` |

---

## Usage

```
/autor              → Analyze project OR start empty project flow
/autor scan         → Full project analysis with health score
/autor new          → Force empty project wizard
/autor web          → Quick web app stack
/autor api           → Quick API stack
/autor saas          → Quick SaaS stack
/autor status        → Show project state
/autor --help        → Show this help
```

---

## Examples

### Empty Project - Web App

```
User: /autor new web app
Autor: What type of web app?
User: E-commerce store
Autor: 
✅ Recommended Stack:
├─ Frontend: Next.js 15 + React + Tailwind
├─ UI: shadcn/ui components
├─ Database: PostgreSQL + Prisma
├─ Auth: NextAuth.js or Clerk
├─ Payments: Stripe
├─ Email: Resend
└─ Deploy: Vercel + Railway (DB)
├─ Commands:
│  npx create-next-app@latest mystore --tailwind --typescript
│  cd mystore && npx shadcn@latest init
│  npx prisma init
│  vercel deploy
└─ Skills loaded: /nextjs-pro /tailwindcss /prisma /auth-flows /payment-stripe
```

### Existing Project - Error Detection

```
User: TypeError: Cannot read property 'map' of undefined
Autor: 
🔴 ERROR DETECTED: TypeError: Cannot read property 'map' of undefined
├─ /error-debugger invoked automatically
├─ Root cause: Variable is undefined, not an array
├─ Fix options:
│  1. Add optional chaining: data?.map(...)
│  2. Add null check: if (Array.isArray(data)) ...
│  3. Add fallback: const safeData = data ?? []
└─ Skills loaded: /error-debugger /typescript-pro
```

---

## Changelog

### v14.0.0 (Layer Architecture Redesign)
- ✅ COMPLETE LAYER 1 FOUNDATION:
  - 17 skills in `always` section
  - Added: /ci-cd, /codebase-design, /domain-modeling, /anti-slop
  - Moved: /api-design from backend → always
  - Confirmed: All skills universal untuk semua project
- ✅ COMPLETE LAYER 2 STRUCTURE:
  - framework: react-pro, nextjs-pro, vue-pro, nuxt-pro, svelte-pro
  - language: python-pro, go-pro, java-pro, dotnet-pro, rust-pro, nestjs-expert, fastify-pro
  - database: postgresql-pro, mysql-pro, mongodb-pro, redis-pro, prisma, drizzle, supabase
  - api-style: graphql, grpc-pro
  - ui-styling: tailwindcss, ui-ux-pro-max
  - mobile: mobile
- ✅ MEMORY CONTINUITY (v14.0.1):
  - /autor now auto-invokes BOTH /autor AND /mem-search
  - Ensures project context continuity on every /autor command
  - Added phrase-based triggers: continue, remember, layer architecture
- ✅ Philosophy: "Skills yang berbeda cara nulis code-nya antar stack"
- ✅ Removed overlaps: deployment dari Layer 2 (sudah di Layer 1 atau auto-detect)
- ✅ Removed auth dari Layer 2 (Layer 3: Requirements - user choice)

### v13.0.0 (Enhanced Core Skills)
- ✅ Expanded core_skills always list with 5 new skills:
  - `/error-debugger` - Critical DX improvement
  - `/doc-generator` - Documentation-first mindset
  - `/docker` - Containerization standard
  - `/observability` - Production-ready patterns
  - `/security` - Secure coding practices
- ✅ Improved TypeScript-Pro placement (removed from core, keep in auto-invoke)

### v12.0.0 (Smart Project Flow)
- ✅ Empty project wizard with intent detection
- ✅ Project type guidance (web/API/mobile/CLI/AI/SaaS)
- ✅ Quick-start commands for common stacks
- ✅ 40+ auto-invoke patterns (increased from 25)
- ✅ Multi-error detection (e.g., PostgreSQL + Error)
- ✅ Project type shortcuts: `/autor web`, `/autor api`, `/autor saas`

### v11.0.0
- ✅ Smart pattern detection for 25+ tech stacks
- ✅ Helper skills auto-invoke
- ✅ Tech stack auto-detection

### v10.0.0
- ✅ Quality analysis, gap detection, health scoring

---

*Built for developers who ship!*
