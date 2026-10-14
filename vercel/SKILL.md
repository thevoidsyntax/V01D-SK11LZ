---
name: vercel
version: "1.0.0"
description: "Vercel deployment patterns, Edge Functions, Serverless, and Next.js optimization."
when_to_use: "When deploying to Vercel, using Edge Functions, or optimizing Next.js/Vercel performance."
priority: critical
phase: production
category: [deployment, frontend]
tech_stack:
  frameworks: [nextjs, vite, astro, svelte]
  services: [vercel]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: ["vercel.json", ".vercel/**"]
      reason: "Vercel project detected"
    - has_file: ["**/next.config.*"]
      reason: "Next.js project - likely deploy to Vercel"
    - pattern: ["vercel deploy", "vercel.json", "@vercel"]
      reason: "Vercel deployment"
capabilities:
  - edge-functions
  - serverless-optimization
  - preview-deployments
  - environment-config
author: TheVoidSyntax
---

# VERCEL DEPLOYMENT v1.0 🚀

**Vercel deployment patterns, Edge Functions, and Serverless optimization**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  VERB + RESOURCE                                        │
│  ────────────────────────────────────────────────────────│
│  vercel deploy            → Deploy current directory       │
│  vercel prod             → Deploy to production          │
│  vercel dev              → Start dev server            │
│  vercel env add          → Add environment variable      │
│  vercel domains add      → Add custom domain            │
└─────────────────────────────────────────────────────────────┘
```

---

## vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/old-path/(.*)",
      "destination": "/new-path/$1"
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "regions": ["iad1"],
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

---

## Edge Functions

### Basic Edge Function

```typescript
// app/api/user/route.ts - Edge Runtime
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Edge = low latency, global execution
  const start = Date.now();
  
  const data = await fetch(`https://api.example.com/users/${id}`, {
    headers: { 'Authorization': `Bearer ${process.env.API_KEY}` }
  }).then(r => r.json());

  return NextResponse.json({
    data,
    latency: Date.now() - start,
    edge: true
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

### Middleware Edge

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the URL
  const url = request.nextUrl.clone();
  
  // Add locale redirect
  const locale = request.headers.get('x-locale') || 'en';
  url.pathname = `/${locale}${url.pathname}`;
  
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico).*)',
  ],
};
```

---

## Environment Variables

### Local Development

```bash
# .env.local (gitignored)
DATABASE_URL=postgres://...
API_KEY=xxx

# .env.production (encrypted, gitignored)
DATABASE_URL=postgres://prod...
```

### Vercel Dashboard

```
Project → Settings → Environment Variables

Variable    │ Environment          │ Ignore Build
────────────┼────────────────────┼───────────────
DATABASE_URL│ Production, Preview │ ✅
API_KEY    │ Production          │ ❌
PUBLIC_KEY │ All               │ ✅
```

### Access in Code

```typescript
// Server components / API routes
const db = process.env.DATABASE_URL;

// Client components - MUST prefix with NEXT_PUBLIC_
const publicKey = process.env.NEXT_PUBLIC_KEY;
```

---

## Database Connections

### PostgreSQL (Neon/Supabase)

```typescript
// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// For Edge Functions - use fetch to API route instead
export async function query<T>(text: string, params?: unknown[]) {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

// For Edge - use serverless-compatible driver
export async function edgeQuery(text: string) {
  const response = await fetch(`${process.env.API_URL}/api/db`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: text })
  });
  return response.json();
}
```

### Prisma with Vercel Postgres

```typescript
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url      = env("POSTGRES_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

---

## Serverless vs Edge

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPARISON                               │
├──────────────────┬──────────────────┬──────────────────────┤
│ Feature          │ Serverless       │ Edge                  │
├──────────────────┼──────────────────┼──────────────────────┤
│ Latency         │ 100-200ms       │ <50ms               │
│ Cold Start      │ 200-500ms       │ <5ms                 │
│ Memory          │ 1024MB          │ 128MB                │
│ Execution Time  │ 10s (free)      │ Unlimited            │
│ Node.js APIs    │ Full            │ Subset              │
│ Database        │ Any             │ HTTP only            │
│ Price           │ Per compute     │ Per request          │
└──────────────────┴──────────────────┴──────────────────────┘
```

---

## Performance Optimization

### Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['images.unsplash.com', 'api.example.com'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128],
  },
  experimental: {
    // Enable newer optimizations
    optimizeCss: true,
  },
};

// Usage
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Bundle Optimization

```typescript
// next.config.js
module.exports = {
  modularizeImports: {
    // Split large libraries
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
      skipDefaultConversion: true,
    },
    // Dynamic imports
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};
```

---

## Preview Deployments

```
┌─────────────────────────────────────────────────────────────┐
│  AUTOMATIC PREVIEW URLS                                    │
├─────────────────────────────────────────────────────────────┤
│  Push to branch → Vercel creates preview URL               │
│                                                              │
│  main branch        → Production (yoursite.com)           │
│  feature/xxx        → Preview (xxx.yoursite.vercel.app)   │
│  PR #123           → Preview (pr-123.vercel.app)          │
│                                                              │
│  Benefits:                                                  │
│  ✓ Share work-in-progress                                  │
│  ✓ Client can review before merge                         │
│  ✓ Automatic QA testing                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## CLI Commands

```bash
# Deployment
vercel                      # Deploy to preview
vercel --prod               # Deploy to production
vercel --token=xxx          # CI/CD deployment

# Project Management
vercel link                # Link to existing project
vercel list                # List deployments
vercel logs                # View deployment logs

# Environment
vercel env pull            # Pull production env to .env.local
vercel env add PROD       # Add production variable
vercel secrets add KEY     # Add encrypted secret

# Domains
vercel domains add         # Add custom domain
vercel certs add           # Add SSL certificate
```

---

## Common Issues & Solutions

### Build Failures

```bash
# Check build locally
vercel build
vercel build --token=xxx

# Common fixes
npm install                 # Update dependencies
npm rebuild                 # Rebuild native modules
```

### Environment Variable Issues

```typescript
// ❌ Wrong - accessing in client without NEXT_PUBLIC_
const db = process.env.DATABASE_URL; // Server only!

// ✅ Correct - Server Component
const data = await db.query('SELECT * FROM users');

// ✅ Correct - Client Component
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Edge Function Limitations

```typescript
// ❌ NOT available in Edge
import { createClient } from '@libsql/client';
import { Pool } from 'pg';

// ✅ Use fetch to API route instead
const result = await fetch('/api/database-query', {
  method: 'POST',
  body: JSON.stringify({ query: '...' })
});
```

---

## Monitoring & Analytics

```typescript
// app/speed-insights
import { SpeedInsights } from '@vercel/speed-insights/next';

// layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

// app/analytics
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Best Practices

### 1. Use Edge for Low-Latency

```typescript
// ✅ Good for Edge
export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // or 'auto'

// ❌ Not for Edge - use Server instead
// - Large file operations
// - Long-running processes
// - Database connections (use connection pool)
```

### 2. Optimize Images

```bash
# Use next/image - automatic WebP/AVIF
# Use CDN for static assets
# Lazy load below-fold images
```

### 3. Cache Strategically

```typescript
// API Routes
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
    }
  });
}
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/nextjs-pro` | Next.js specific patterns |
| `/react-pro` | React patterns |
| `/deployment` | General deployment |

---

*Deploy fast, scale infinitely!*
