---
name: nextjs-pro
description: "Next.js patterns with App Router, Server Components, and deployment optimization."
when_to_use: "Use when building Next.js: App Router, Server Components, or deployment tuning."
version: "1.0.0"
category: [frontend]
priority: high
phase: any
tech_stack:
  frameworks: [nextjs]
  languages: [typescript, javascript]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/next.config.*"
      reason: "Next.js project detected"
    - has_file: "**/app/**"
      reason: "App Router detected"
  skill_tier: context
triggers:
  phrases:
    - "next.js"
    - "nextjs"
    - "app router"
    - "server component"
capabilities: [implementation]
dependencies: [react-pro, ui-ux-pro-max]
integrates_with: [react-pro, ui-ux-pro-max]
---

# NEXTJS-PRO v1.0

Next.js patterns for App Router, Server Components, and deployment optimization.

## App Router (Next.js 13+)

### 1. Server Components

```tsx
// app/users/page.tsx - Server Component (default)
export default async function UsersPage() {
  const users = await db.user.findMany();

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

### 2. Client Components

```tsx
// components/Counter.tsx
'use client'; // Must be first line

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}
```

### 3. Data Fetching

```tsx
// Server Component with parallel fetching
export default async function Dashboard() {
  // Parallel fetching
  const [revenue, users, orders] = await Promise.all([
    fetch('/api/revenue').then(r => r.json()),
    db.user.count(),
    db.order.count(),
  ]);

  return (/* ... */);
}

// Or sequential if dependent
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  const reviews = await db.review.findMany({ where: { productId: product.id } });

  return <Product product={product} reviews={reviews} />;
}
```

### 4. Loading & Error States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}

// app/dashboard/error.tsx
'use client';
export default function Error({ error, reset }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Routing Patterns

### 1. Dynamic Routes

```tsx
// app/products/[category]/[id]/page.tsx
export default async function ProductPage({
  params: { category: string; id: string },
}) {
  const product = await getProduct(category, id);
  return <ProductDetail product={product} />;
}

// Generate static params (SSG)
export async function generateStaticParams() {
  const products = await db.product.findMany();
  return products.map(p => ({ category: p.category, id: p.id }));
}
```

### 2. Route Groups & Layouts

```tsx
// app/(auth)/login/page.tsx - No /auth prefix in URL
// app/(auth)/register/page.tsx

// app/(marketing)/layout.tsx - Shared layout for marketing routes
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <MarketingProvider>{children}</MarketingProvider>;
}
```

## API Routes

### 1. Route Handler

```tsx
// app/api/users/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || 1);

  const users = await db.user.findMany({ take: 10, skip: (page - 1) * 10 });

  return Response.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });

  return Response.json(user, { status: 201 });
}
```

### 2. Middleware

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

## Data Fetching

### 1. TanStack Query with Next.js

```tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// app/providers.tsx
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min
        gcTime: 10 * 60 * 1000, // 10 min
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 2. Server Actions

```tsx
'use server';
export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  await db.user.create({ data: { name, email } });

  revalidatePath('/users');
}

// Client component
'use client';
<form action={createUser}>
  <input name="name" />
  <button>Create User</button>
</form>
```

## Image & Fonts

### 1. Image Optimization

```tsx
import Image from 'next/image';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      sizes="(max-width: 768px) 100vw, 400px"
      priority={false}
    />
  );
}
```

### 2. Google Fonts

```tsx
// app/layout.tsx
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-roboto' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, roboto.variable)}>
      <body>{children}</body>
    </html>
  );
}
```

## Deployment Patterns

### 1. ISR (Incremental Static Regeneration)

```tsx
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata() {
  const product = await getProduct();
  return { title: product.name };
}
```

### 2. Edge Runtime

```tsx
// For edge functions
export const runtime = 'edge';

export default async function EdgeRoute() {
  const data = await fetch('https://api.example.com/data').then(r => r.json());
  return Response.json(data);
}
```

## Best Practices Checklist

```
NEXT.JS PATTERNS:
  [x] Server Components by default
  [x] 'use client' only when needed
  [x] Parallel data fetching with Promise.all
  [x] Streaming with Suspense
  [x] generateMetadata for SEO

ROUTING:
  [x] Route groups for layout sharing
  [x] Dynamic segments for data
  [x] Loading/error for UX

API:
  [x] Route Handlers for API routes
  [x] Middleware for auth/redirects
  [x] Server Actions for mutations

PERFORMANCE:
  [x] Image optimization
  [x] Font optimization
  [x] ISR for static content
  [x] Edge runtime for global CDN
```

---

*Author: TheVoidSyntax*
