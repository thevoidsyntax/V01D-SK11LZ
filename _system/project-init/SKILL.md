---
name: project-init
description: "Complete project scaffolding generator with interactive Q&A, smart defaults, scale-aware architecture, and auto-invoke relevant skills"
version: "3.1"
category: [process]
priority: high
phase: phase-1
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: "/project-init"
      reason: "New project initialization"
    - command: "/auto-route --new"
      reason: "New project mode"
    - command: "/auto-route --new --quick"
      reason: "Quick start mode"
  skill_tier: core
capabilities: [implementation, generation]
quality:
  rules_count: 40
  examples_count: 25
  stability: stable
integrates_with: [auto-router, analyze-project, git]
source:
  origin: local
author: Claude
---

# PROJECT INIT v3.0 - Complete Project Scaffolding Generator

## Overview

This skill handles complete project initialization with interactive Q&A, automated scaffolding generation, and actual file creation. Unlike the previous version, this generates real project files.

---

## Phase 1: Interactive Q&A Flow

### Step 1.1: Welcome & Introduction

```
╔═══════════════════════════════════════════════════════════════╗
║                     🏗️  PROJECT INIT v3.0                    ║
║                Complete Project Scaffolding Generator         ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  This will help you create a production-ready project with:   ║
║                                                               ║
║  ✅ Interactive requirement gathering                          ║
║  ✅ Technology stack recommendations                          ║
║  ✅ Complete project scaffolding (real files)                 ║
║  ✅ Auto-invoke relevant skills                               ║
║  ✅ Git initialization                                        ║
║                                                               ║
║  Let's get started! Press Enter to continue...                ║
╚═══════════════════════════════════════════════════════════════╝
```

### Step 1.2: Project Configuration Questions

Ask each question and capture responses:

**A. Project Name & Type**
```
┌─────────────────────────────────────────────────────────────┐
│  📛 PROJECT IDENTITY                                         │
│                                                             │
│  1. Project name (kebab-case): [                          ] │
│     Example: my-awesome-api                                 │
│                                                             │
│  2. Project type:                                          │
│     [1] REST API / Backend Service                         │
│     [2] Full-Stack Web Application                         │
│     [3] Mobile Application                                  │
│     [4] Microservices Backend                               │
│     [5] CLI Tool / Utility                                 │
│     [6] Library / SDK                                       │
│     [7] Data Pipeline / ETL                                │
│     [8] Other                                              │
│                                                             │
│  3. Brief description: [                                   ] │
│     (1-2 sentences about the project)                       │
└─────────────────────────────────────────────────────────────┘
```

**B. Scale & Team**
```
┌─────────────────────────────────────────────────────────────┐
│  📊 SCALE & TEAM                                            │
│                                                             │
│  4. Expected scale:                                        │
│     [1] MVP / Prototype (< 100 users)                      │
│     [2] Small-Medium (100-1000 users)                     │
│     [3] Medium-Large (1000-10000 users)                   │
│     [4] Enterprise (> 10000 users)                         │
│                                                             │
│  5. Team size:                                             │
│     [1] Solo / Indie Developer                             │
│     [2] Small Team (2-5 developers)                        │
│     [3] Medium Team (5-10 developers)                      │
│     [4] Large Team (10+ developers)                        │
└─────────────────────────────────────────────────────────────┘
```

**C. Primary Priority**
```
┌─────────────────────────────────────────────────────────────┐
│  🎯 PRIMARY PRIORITY                                        │
│                                                             │
│  6. Main priority for this project:                        │
│     [1] 🚀 Speed to Market (fastest path to production)    │
│     [2] 📈 Scalability (handle growth)                     │
│     [3] 🔒 Security (high security requirements)            │
│     [4] 💰 Cost-Effective (budget constraints)             │
│     [5] 🔧 Maintainability (long-term maintainability)     │
└─────────────────────────────────────────────────────────────┘
```

**D. Tech Stack Preferences**
```
┌─────────────────────────────────────────────────────────────┐
│  🛠️  TECHNOLOGY STACK                                       │
│                                                             │
│  7. Preferred language/runtime:                            │
│     [1] Node.js / TypeScript                               │
│     [2] Python                                             │
│     [3] Go                                                 │
│     [4] Rust                                               │
│     [5] C# / .NET                                         │
│     [6] Java                                               │
│     [7] No preference (recommend best for use case)        │
│                                                             │
│  8. Database preference:                                   │
│     [1] PostgreSQL                                         │
│     [2] MySQL / MariaDB                                    │
│     [3] MongoDB                                            │
│     [4] SQLite (for small/MVP)                            │
│     [5] No preference (recommend best for use case)        │
│                                                             │
│  9. Cloud platform target:                                 │
│     [1] AWS                                                │
│     [2] Google Cloud                                       │
│     [3] Azure                                              │
│     [4] Self-hosted / On-premise                           │
│     [5] Multi-cloud (flexible)                              │
└─────────────────────────────────────────────────────────────┘
```

### Step 1.3: Feature Selection

```
┌─────────────────────────────────────────────────────────────┐
│  ✨ FEATURES (Select what you need)                         │
│                                                             │
│  Authentication:                                           │
│  [ ] JWT / Session-based auth                              │
│  [ ] OAuth2 / Social login                                 │
│  [ ] API Keys                                              │
│                                                             │
│  API Style:                                                │
│  [ ] REST API                                              │
│  [ ] GraphQL                                               │
│  [ ] gRPC                                                  │
│                                                             │
│  Data & Storage:                                           │
│  [ ] Redis cache                                           │
│  [ ] File storage (S3/local)                              │
│  [ ] Message queue (RabbitMQ/Kafka)                        │
│                                                             │
│  DevOps:                                                   │
│  [ ] Docker / Containerization                             │
│  [ ] CI/CD pipeline                                        │
│  [ ] Kubernetes manifests                                  │
│  [ ] Terraform / IaC                                       │
│                                                             │
│  Observability:                                            │
│  [ ] Structured logging                                    │
│  [ ] Metrics (Prometheus)                                  │
│  [ ] Distributed tracing (OpenTelemetry)                   │
│                                                             │
│  Select features by number, or 'all' for defaults           │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 2: Project Configuration Output

After Q&A, output the configuration as structured data:

```json
{
  "project": {
    "name": "<name>",
    "type": "<type>",
    "description": "<description>",
    "version": "0.1.0"
  },
  "scale": {
    "size": "<mvp|small|medium|large>",
    "teamSize": "<solo|small|medium|large>",
    "expectedUsers": "<number>"
  },
  "priority": "<speed|scalability|security|cost|maintainability>",
  "techStack": {
    "language": "<language>",
    "runtime": "<runtime>",
    "database": "<database>",
    "cache": "<cache>",
    "cloud": "<cloud>"
  },
  "features": {
    "auth": ["<auth-types>"],
    "api": "<api-style>",
    "data": ["<data-features>"],
    "devops": ["<devops-features>"],
    "observability": ["<observability-features>"]
  },
  "architecture": {
    "pattern": "<pattern>",
    "reasoning": "<explanation>"
  }
}
```

---

## Phase 3: Auto-Invoke Relevant Skills

Based on the configuration, automatically invoke:

### Core Skills (Always)
```
/git
/docker
/ci-cd
/config
/logging
/security
```

### Conditional Skills (Based on Features)

| Feature | Skills to Invoke |
|---------|------------------|
| REST API | `/api-design`, `/api-client` |
| GraphQL | `/graphql` |
| Database | `/database` |
| Redis | `/serverless` (for patterns) |
| Message Queue | `/message-queue`, `/messaging` |
| Kubernetes | `/kubernetes` |
| Terraform | `/terraform` |
| Metrics | `/observability`, `/sre-operations` |
| Distributed Tracing | `/observability` |
| Mobile | `/mobile` |
| Frontend | `/frontend`, `/performance` |
| ML/AI | `/ml-engineering` |
| IoT | `/iot-edge` |
| Enterprise Scale | `/architecture-patterns`, `/scalability` |

---

## Phase 4: Project Scaffolding Generation

### Step 4.1: Create Directory Structure

Based on project type, generate the appropriate structure:

#### Type: REST API / Backend Service

```
<project-name>/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── schemas/
│   │   └── controllers/
│   ├── application/
│   │   ├── use-cases/
│   │   ├── services/
│   │   └── dto/
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── value-objects/
│   │   └── events/
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── cache/
│   │   ├── queue/
│   │   └── external/
│   └── shared/
│       ├── config/
│       ├── errors/
│       ├── logging/
│       └── utils/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/
├── docker/
├── .github/workflows/
├── CLAUDE.md
├── README.md
├── package.json (or equivalent)
├── tsconfig.json (if TypeScript)
├── .env.example
├── .gitignore
└── docker-compose.yml
```

#### Type: Full-Stack Web Application

```
<project-name>/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── shared/
│   ├── tests/
│   ├── scripts/
│   ├── docker/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   └── utils/
│   ├── public/
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts (or webpack.config.js)
│   └── .env.example
├── docker-compose.yml
├── CLAUDE.md
├── README.md
└── .gitignore
```

#### Type: Microservices

```
<project-name>/
├── services/
│   ├── api-gateway/
│   │   └── [REST API structure]
│   ├── auth-service/
│   │   └── [REST API structure]
│   ├── user-service/
│   │   └── [REST API structure]
│   └── [other-services]/
├── packages/
│   ├── shared/
│   └── contracts/
├── infrastructure/
│   ├── kubernetes/
│   ├── terraform/
│   └── docker-compose.yml
├── scripts/
├── CLAUDE.md
├── README.md
├── package.json (workspace root)
└── .gitignore
```

---

## Phase 5: Core File Generation

### Step 5.1: Generate package.json

```json
{
  "name": "<project-name>",
  "version": "0.1.0",
  "description": "<description>",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "typecheck": "tsc --noEmit",
    "migrate": "knex migrate:latest",
    "migrate:rollback": "knex migrate:rollback",
    "seed": "knex seed:run"
  },
  "dependencies": {
    // Base dependencies based on project type
  },
  "devDependencies": {
    // Base dev dependencies based on project type
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### Step 5.2: Generate tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Step 5.3: Generate .env.example

```bash
# Application
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database
# ⚠️ Replace with real credentials in .env (not committed to git)
DATABASE_URL=postgresql://user:${DB_PASSWORD}@localhost:5432/dbname
DATABASE_POOL_SIZE=10

# Redis (if selected)
REDIS_URL=redis://localhost:6379

# Authentication (if selected)
# ⚠️ Generate a secure random string: openssl rand -base64 32
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=7d

# External Services
EXTERNAL_API_URL=https://api.example.com
# ⚠️ Replace with actual API key from service provider
EXTERNAL_API_KEY=your-api-key

# Feature Flags
FEATURE_FLAGS_ENABLED=true
```

### Step 5.4: Generate .gitignore

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Logs
logs/
*.log
npm-debug.log*

# Cache
.cache/
.turbo/

# Docker
.docker/

# Misc
*.tgz
*.tar.gz
```

### Step 5.5: Generate docker-compose.yml

```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "${PORT:-3000}:${PORT:-3000}"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    volumes:
      - ./src:/app/src:ro

  postgres:
    image: postgres:15-alpine
    environment:
      # ⚠️ Use strong passwords in production - override in .env
      POSTGRES_USER: ${DB_USER:-app}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme}
      POSTGRES_DB: ${DB_NAME:-app}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Step 5.6: Generate Dockerfile

```dockerfile
# syntax=docker/dockerfile:1

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001

# Copy from builder
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json

# Set ownership
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start
CMD ["node", "dist/index.js"]
```

### Step 5.7: Generate Entry Point (src/index.ts)

```typescript
import { app } from './app.js';
import { config } from './shared/config/index.js';
import { logger } from './shared/logging/logger.js';

const start = async () => {
  try {
    const port = config.port;
    
    await app.listen({ port, host: '0.0.0.0' });
    
    logger.info({
      msg: 'Server started',
      port,
      env: config.nodeEnv,
    });
  } catch (err) {
    logger.error({
      msg: 'Failed to start server',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
    process.exit(1);
  }
};

start();
```

### Step 5.8: Generate Basic App Structure (src/app.ts)

```typescript
import Fastify from 'fastify';
import { config } from './shared/config/index.js';
import { loggerPlugin } from './shared/logging/plugin.js';
import { errorHandler } from './shared/errors/handler.js';
import { healthRoutes } from './api/routes/health.js';

export const app = Fastify({
  logger: false,
});

app.register(loggerPlugin);
app.setErrorHandler(errorHandler);

app.get('/health', { schema: healthRoutes.schema.getHealth }, healthRoutes.handler);

app.get('/ready', async () => ({ ready: true }));
```

### Step 5.9: Generate Config Module (src/shared/config/index.ts)

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  DATABASE_URL: z.string().url(),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('Invalid environment variables:', parseResult.error.format());
  process.exit(1);
}

export const config = parseResult.data;

export const isProduction = config.NODE_ENV === 'production';
export const isDevelopment = config.NODE_ENV === 'development';
export const isTest = config.NODE_ENV === 'test';
```

### Step 5.10: Generate Logging Module (src/shared/logging/logger.ts)

```typescript
import pino from 'pino';
import { config } from '../config/index.js';

export const logger = pino({
  level: config.LOG_LEVEL,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    env: config.NODE_ENV,
  },
});
```

### Step 5.11: Generate CI/CD Workflow (.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          # ⚠️ Use secrets for CI - see GitHub Actions secrets
          POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD || 'changeme' }}
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - run: npm run typecheck

      - run: npm run lint

      - run: npm run test -- --coverage
        env:
          # ⚠️ Use secrets for DATABASE_URL in production
          DATABASE_URL: postgresql://postgres:${{ secrets.POSTGRES_PASSWORD || 'changeme' }}@localhost:5432/test
          NODE_ENV: test
      
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

---

## Phase 6: Git Initialization

### Step 6.1: Initialize Git Repo

```bash
cd <project-name>
git init
```

### Step 6.2: Create Initial Commit

```bash
git add .
git commit -m "feat: initial project scaffolding

- Add TypeScript configuration
- Add Docker support
- Add CI/CD pipeline
- Add structured logging
- Add configuration management
- Add error handling"
```

---

## Phase 7: Final Summary

```
╔═══════════════════════════════════════════════════════════════════╗
║                    ✅ PROJECT SETUP COMPLETE                      ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  📁 Project: <project-name>                                       ║
║  📝 Type: <type>                                                  ║
║  🏗️  Architecture: <pattern>                                      ║
║                                                                   ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                   ║
║  🛠️  TECH STACK                                                   ║
║  • Language: <language>                                           ║
║  • Database: <database>                                           ║
║  • Cache: <cache>                                                 ║
║  • Runtime: <runtime>                                             ║
║                                                                   ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                   ║
║  ⚡ FEATURES                                                      ║
║  • Authentication: <auth-type>                                   ║
║  • API Style: <api-style>                                         ║
║  • Observability: <observability-stack>                            ║
║  • DevOps: <devops-stack>                                         ║
║                                                                   ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                   ║
║  📦 FILES GENERATED                                               ║
║  • package.json, tsconfig.json, vitest.config.ts                  ║
║  • docker-compose.yml, Dockerfile                                 ║
║  • .env.example, .gitignore                                       ║
║  • src/ (application structure)                                   ║
║  • tests/ (test structure)                                        ║
║  • .github/workflows/ci.yml                                       ║
║  • CLAUDE.md, README.md                                           ║
║                                                                   ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                   ║
║  🔧 ACTIVE SKILLS                                                 ║
║  Core: /git, /docker, /ci-cd, /config, /logging, /security       ║
║  Features: <selected-optional-skills>                             ║
║                                                                   ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                   ║
║  📋 NEXT STEPS                                                    ║
║                                                                   ║
║  1. cd <project-name>                                            ║
║  2. Review generated files                                        ║
║  3. Update .env with real values                                  ║
║  4. Run: docker-compose up -d                                    ║
║  5. Run: npm run dev                                             ║
║  6. Visit: http://localhost:3000/health                           ║
║                                                                   ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                   ║
║  📚 DOCS                                                          ║
║  • README.md - Project documentation                              ║
║  • CLAUDE.md - Claude Code instructions                           ║
║  • docker/README.md - Docker setup guide                          ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Decision Matrix

### Project Type → Structure Mapping

| Type | Directory Structure | Entry Point |
|------|-------------------|-------------|
| REST API | `src/api`, `src/domain`, `src/application` | `src/index.ts` |
| Full-Stack | `backend/src`, `frontend/src` | `backend/src/index.ts` |
| Microservices | `services/*/src` | Each service has own entry |
| CLI Tool | `src/`, `bin/` | `bin/cli.js` |
| Library | `src/`, exposes via `src/index.ts` | Main export |

### Scale → Architecture Pattern

| Scale | Pattern | Reasoning |
|-------|---------|-----------|
| MVP | Modular Monolith | Fast iteration, easy to refactor |
| Small-Medium | Modular Monolith or Bounded Contexts | Clear modules, minimal overhead |
| Medium-Large | Microservices or Modular Monolith with clear boundaries | Team autonomy, independent deployability |
| Enterprise | Event-Driven Microservices | Scale, resilience, polyglot |

### Priority → Tech Stack Adjustments

| Priority | Adjustments |
|----------|-------------|
| Speed to Market | Use established frameworks, minimal boilerplate, SQLite option |
| Scalability | PostgreSQL, Redis, async processing, microservices-ready |
| Security | Keycloak/Auth0, mTLS, secrets manager, audit logging |
| Cost-Effective | SQLite/PostgreSQL, Fly.io/Vercel, minimal infra |
| Maintainability | TypeScript, strict linting, comprehensive tests, docs |

---

## File Generation Checklist

### Essential (Always Generated)
- [ ] `package.json`
- [ ] `tsconfig.json` (if TypeScript)
- [ ] `.env.example`
- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `CLAUDE.md`
- [ ] `src/index.ts` / entry point
- [ ] `src/app.ts` (if web app)

### Docker (if selected)
- [ ] `Dockerfile`
- [ ] `docker-compose.yml`
- [ ] `.dockerignore`

### CI/CD (if selected)
- [ ] `.github/workflows/ci.yml`
- [ ] `.github/workflows/cd.yml` (if production)

### Testing (if selected)
- [ ] `vitest.config.ts` (if using Vitest)
- [ ] `jest.config.js` (if using Jest)
- [ ] `tests/setup.ts`
- [ ] `tests/example.test.ts`

### Database (if PostgreSQL/MySQL)
- [ ] `knexfile.ts`
- [ ] `src/infrastructure/database/migrations/`
- [ ] `src/infrastructure/database/seeds/`

### Auth (if selected)
- [ ] `src/infrastructure/auth/jwt.ts`
- [ ] `src/api/middleware/auth.ts`
- [ ] Auth routes

### Observability (if selected)
- [ ] `src/shared/logging/logger.ts`
- [ ] Health check endpoints
- [ ] Metrics endpoint
- [ ] Tracing setup

---

## Best Practices

1. **Generate Real Files**: Unlike v2, this version creates actual working files, not just recommendations.

2. **Idempotent Generation**: If running in existing directory, warn user and offer to skip/overwrite.

3. **Respect User Choices**: Use `package.json` over `requirements.txt` based on language selection.

4. **Include Working Examples**: Entry points should be minimal but functional, with realistic patterns.

5. **Auto-Invoke Skills After Generation**: Let the relevant skills provide deeper guidance on each area.

6. **Git Init Only When Requested**: Ask user before initializing git, don't assume.

7. **Scaffold is MVP-Ready**: Generated code should pass linting and basic tests without modification.

8. **Clear Documentation**: README should include actual commands, not placeholder text.

---

**Version:** 3.0 | **Author:** Claude | **Invokes:** `/git`, `/docker`, `/ci-cd`, `/config`, `/logging`, `/security`, and conditional skills based on project requirements
