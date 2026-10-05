# FULL-STACK WEB TEMPLATE
# Tech Stack: Next.js + TypeScript + PostgreSQL + Prisma

## 📦 DEFAULT TECH STACK
- **Frontend:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand / React Query
- **Forms:** React Hook Form + Zod
- **Backend:** Next.js API Routes / tRPC
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js / Clerk
- **Deployment:** Vercel / Docker

## 📁 STRUCTURE
```
fullstack-project/
├── apps/
│   ├── web/                   # Frontend (Next.js)
│   │   ├── src/
│   │   │   ├── app/           # App Router
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── styles/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── api/                   # Backend (optional separate)
│       ├── src/
│       │   ├── modules/
│       │   ├── domain/
│       │   └── infrastructure/
│       └── package.json
│
├── packages/
│   ├── ui/                    # Shared UI components
│   ├── config/               # Shared config
│   └── types/                # Shared TypeScript types
│
├── prisma/
│   └── schema.prisma
│
├── docker-compose.yml
├── turbo.json                # Turborepo config
├── CLAUDE.md
└── README.md
```

## 🎯 ACTIVE SKILLS
- /frontend (React, State Management)
- /api-design (REST/GraphQL)
- /security (Auth, XSS, CSRF)
- /deployment (Vercel, Docker)
- /code-quality (TypeScript, Linting)
- /performance (Core Web Vitals)
- /testing (Component, E2E)
- /reliability (Monitoring)

## 📋 FRONTEND CONVENTIONS
- Server Components (default)
- Client Components (when needed)
- Route Groups for layout
- Zod for validation
- React Query for server state
- Zustand for client state

## 🚀 GETTING STARTED
```bash
# Install all apps
npm install

# Setup database
docker-compose up -d
npx prisma migrate dev

# Start development
npm run dev

# Build for production
npm run build
```
