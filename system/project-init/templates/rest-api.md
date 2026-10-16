# REST API TEMPLATE
# Tech Stack: Node.js + TypeScript + PostgreSQL + Docker

## 📦 DEFAULT TECH STACK
- **Runtime:** Node.js 20+
- **Framework:** Express.js / Fastify / NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma / TypeORM
- **Cache:** Redis
- **Validation:** Zod / Joi
- **Auth:** JWT + bcrypt
- **Docker:** Docker + Docker Compose

## 📁 STRUCTURE
```
api-project/
├── src/
│   ├── modules/              # Feature modules (DDD)
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── users.dto.ts
│   │   │   └── users.test.ts
│   │   └── [other modules]
│   ├── domain/                # Domain layer
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── events/
│   ├── application/           # Use cases
│   │   ├── commands/
│   │   └── queries/
│   ├── infrastructure/        # External integrations
│   │   ├── database/
│   │   ├── cache/
│   │   └── messaging/
│   ├── shared/                 # Shared utilities
│   │   ├── errors/
│   │   ├── middleware/
│   │   └── utils/
│   ├── config/                 # Configuration
│   └── main.ts                # Entry point
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── CLAUDE.md                   # Project rules
├── tsconfig.json
├── package.json
└── README.md
```

## 🎯 ACTIVE SKILLS
- /security (Auth, JWT, RBAC)
- /api-design (REST, Pagination)
- /deployment (Docker, CI/CD)
- /code-quality (TypeScript, Linting)
- /reliability (SLO, Monitoring)
- /data-engineering (PostgreSQL)
- /messaging (Event-driven)
- /testing (Unit, Integration)

## 📋 API CONVENTIONS
- RESTful endpoints
- JSON response format
- JWT authentication
- Rate limiting
- Pagination (cursor-based)
- Global error handler

## 🚀 GETTING STARTED
```bash
# Install dependencies
npm install

# Setup database
docker-compose up -d postgres
npx prisma migrate dev

# Run development
npm run dev

# Run tests
npm test
```
