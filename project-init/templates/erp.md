# ERP TEMPLATE
# Tech Stack: NestJS + PostgreSQL + React + Docker

## 📦 DEFAULT TECH STACK
- **Backend:** NestJS (Node.js)
- **Frontend:** React + TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM / Prisma
- **Cache:** Redis
- **Queue:** Bull (Redis-based)
- **Auth:** JWT + Passport
- **File Storage:** S3 / MinIO
- **Reporting:** ExcelJS, PDFKit
- **Deployment:** Docker, Kubernetes

## 📁 STRUCTURE
```
erp-project/
├── backend/
│   ├── src/
│   │   ├── modules/          # ERP modules
│   │   │   ├── users/
│   │   │   ├── auth/
│   │   │   ├── organizations/
│   │   │   ├── hr/
│   │   │   ├── finance/
│   │   │   ├── inventory/
│   │   │   ├── sales/
│   │   │   ├── purchases/
│   │   │   └── reports/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── shared/
│   ├── prisma/
│   └── test/
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/
│   │   ├── features/       # Feature-based
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── lib/
│   └── public/
│
├── shared/
│   ├── types/
│   ├── constants/
│   └── utils/
│
├── docker/
│   ├── backend/
│   ├── frontend/
│   ├── postgres/
│   └── redis/
│
├── CLAUDE.md
├── docker-compose.yml
└── README.md
```

## 🎯 ACTIVE SKILLS
- /security (RBAC, Multi-tenant)
- /identity (OAuth2, SSO)
- /data-engineering (PostgreSQL, CDC)
- /compliance (Audit Trail, GDPR)
- /api-design (REST, Pagination)
- /deployment (Docker, CI/CD)
- /code-quality (TypeScript, Linting)
- /reliability (SLO, Monitoring, DR)
- /messaging (Saga, Outbox)
- /scalability (Multi-tenant, Read Replica)
- /documentation (RFC, ADR)
- /testing (Integration, E2E)

## 📋 ERP CONVENTIONS
- Multi-tenant isolation (row-level security)
- Audit logging untuk semua mutations
- Soft delete untuk data integrity
- RBAC dengan permission system
- Event sourcing untuk audit trail
- Saga pattern untuk distributed transactions

## 🚀 GETTING STARTED
```bash
# Start all services
docker-compose up -d

# Setup database
cd backend && npx prisma migrate dev

# Generate initial data
npm run seed

# Start development
npm run dev:backend
npm run dev:frontend
```

## 📊 DEFAULT MODULES
1. **Users & Auth** - User management, roles, permissions
2. **Organizations** - Multi-tenant support
3. **HR** - Employee management, leaves
4. **Finance** - Accounting, transactions
5. **Inventory** - Stock management
6. **Sales** - Customer orders
7. **Purchases** - Supplier orders
8. **Reports** - Financial & operational reports
