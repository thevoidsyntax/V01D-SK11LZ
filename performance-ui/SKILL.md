---
name: performance-ui
description: "Frontend performance with Core Web Vitals, bundle optimization, and rendering strategies."
when_to_use: "Use when improving frontend performance: Core Web Vitals, bundle size, or rendering."
version: "1.0.0"
category: [frontend, performance]
priority: high
phase: any
tech_stack:
  languages: [typescript, javascript]
scale: [medium, large]
auto_invoke:
  enabled: true
  conditions:
    - command: ["/performance", "/perf", "/core-web-vitals"]
      reason: "Performance request detected"
  skill_tier: context
triggers:
  phrases:
    - "performance"
    - "bundle size"
    - "web vitals"
    - "lighthouse"
    - "load time"
capabilities: [analysis, optimization]
dependencies: [observability]
integrates_with: [observability, react-pro]
---

# PERFORMANCE-UI v1.0

Frontend performance patterns for Core Web Vitals, bundle optimization, and rendering strategies.

## Core Web Vitals

### 1. LCP (Largest Contentful Paint)

```
TARGET: < 2.5 seconds

OPTIMIZATIONS:
  [x] Preload hero image: <link rel="preload" href="hero.webp" as="image">
  [x] Image priority: <img fetchpriority="high" />
  [x] Font preload: <link rel="preload" href="font.woff2" as="font" crossorigin>
  [x] CSS critical: Inline above-fold styles
```

### 2. FID/INP (First Input Delay / Interaction to Next Paint)

```
TARGET: FID < 100ms, INP < 200ms

OPTIMIZATIONS:
  [x] Split JS chunks: Dynamic imports
  [x] Defer non-critical: <script defer>
  [x] Web Workers: Heavy computation off main thread
  [x] Long tasks: Scheduler.yield() for breaks
```

### 3. CLS (Cumulative Layout Shift)

```
TARGET: < 0.1

OPTIMIZATIONS:
  [x] Image dimensions: Always specify width/height
  [x] Font display: font-display: optional/swap
  [x] Reserve space: skeleton loaders
  [x] Animations: transform/opacity only
```

## Bundle Optimization

### 1. Dynamic Imports

```tsx
// Component lazy loading
const HeavyChart = lazy(() => import('./HeavyChart'));

// Route-based splitting (Next.js)
const Settings = lazy(() => import('./pages/Settings'));

// With prefetch
const Link = lazy(() => import('./Link'));
```

### 2. Tree Shaking Detection

```bash
# Analyze bundle
npx @next/bundle-analyzer .next/analyze
# or
npx vite-bundle-visualizer
```

### 3. Module Federation (Micro-frontends)

```tsx
// Host app
new ModuleFederationPlugin({
  remotes: {
    remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js',
  },
  shared: ['react', 'react-dom'],
});
```

## Caching Strategies

### 1. Service Worker Cache

```typescript
const CACHE_NAME = 'v1';
const STATIC_ASSETS = ['/', '/offline.html', '/favicon.ico'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then(r => r || fetch(event.request))
    );
  }
});
```

### 2. Stale-While-Revalidate

```typescript
async function fetchWithSW(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  const networkFetch = fetch(request).then(r => {
    caches.open(CACHE_NAME).then(cache => cache.put(request, r.clone()));
    return r;
  });
  return cached || networkFetch;
}
```

### 3. React Query Caching

```tsx
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000,    // Fresh for 5 min
  gcTime: 10 * 60 * 1000,   // Keep in memory 10 min
  retry: 3,
  refetchOnWindowFocus: false,
})
```

## Image Optimization

### 1. Next.js Image

```tsx
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
  placeholder="blur"
  blurDataURL={product.blurHash}
/>
```

### 2. AVIF/WebP with Fallback

```html
<picture>
  <source
    type="image/avif"
    srcSet="/image.avif 1x, /image-2x.avif 2x"
  />
  <source
    type="image/webp"
    srcSet="/image.webp 1x, /image-2x.webp 2x"
  />
  <img src="/image.jpg" alt="description" width="400" height="300" />
</picture>
```

## Rendering Strategies

### 1. Static Generation (SSG)

```tsx
export async function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export const revalidate = 3600; // Revalidate hourly
```

### 2. ISR (Incremental Static Regeneration)

```tsx
// Revalidate per-page
export const revalidate = 60; // 1 minute

// On-demand revalidation
export async function POST(req: Request) {
  await resaveProduct();
  revalidatePath('/products/[slug]');
}
```

### 3. Streaming with Suspense

```tsx
<Suspense fallback={<ProductSkeleton />}>
  <ProductDetails productId={id} />
</Suspense>

<Suspense fallback={<FeedSkeleton />}>
  <InfiniteFeed />
</Suspense>
```

## Resource Hints

### Preload vs Prefetch vs Preconnect

```html
<!-- Preconnect: Early DNS lookup -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Prefetch: Predict next navigation -->
<link rel="prefetch" href="/dashboard" />

<!-- Preload: Current navigation -->
<link rel="preload" as="script" href="/analytics.js" />
<link rel="preload" as="image" href="/hero.webp" />
```

## Performance Checklist

```
CORE WEB VITALS:
  [ ] LCP < 2.5s (Image optimization, preload critical resources)
  [ ] INP < 200ms (Code splitting, defer non-critical)
  [ ] CLS < 0.1 (Reserve space, dimensions)

BUNDLE:
  [ ] Dynamic imports for routes/components
  [ ] Tree-shake unused code
  [ ] < 200KB initial JS (compressed)

IMAGES:
  [ ] Next/Image or responsive srcset
  [ ] AVIF/WebP with fallback
  [ ] Lazy load below-fold images
  [ ] Blur placeholders

CACHING:
  [ ] Static assets: Cache-Control: public, max-age=31536000, immutable
  [ ] API: stale-while-revalidate
  [ ] SW for offline support

FONTS:
  [ ] Font-display: optional/swap
  [ ] Subset fonts (latin only if possible)
  [ ] Preload critical fonts
```

---

*Author: TheVoidSyntax*
