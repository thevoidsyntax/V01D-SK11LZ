---
name: nuxt-pro
version: "1.0.0"
description: "Nuxt.js patterns with file-based routing, auto-imports, and SSR/SSG."
when_to_use: "When building Nuxt.js applications, using file-based routing, or implementing SSR/SSG."
priority: medium
phase: any
category: [frontend]
tech_stack:
  frameworks: [nuxt]
  languages: [typescript, javascript]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: ["nuxt.config.ts", "nuxt.config.js"]
      reason: "Nuxt.js project detected"
    - pattern: ["nuxt", "useFetch", "useAsyncData"]
      reason: "Nuxt patterns detected"
capabilities:
  - routing
  - data-fetching
  - server-side
author: TheVoidSyntax
---

# NUXT-PRO v1.0 💙

**Nuxt.js patterns with file-based routing, auto-imports, and SSR/SSG**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  NUXT BASICS                                               │
├─────────────────────────────────────────────────────────────┤
│  pages/              → File-based routing                   │
│  components/         → Auto-imported components            │
│  composables/        → Auto-imported composables           │
│  layouts/           → Layout system                        │
│  useFetch()         → Data fetching (SSR friendly)         │
│  useAsyncData()    → Async data with caching            │
│  $fetch()          → Direct HTTP client                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
├── nuxt.config.ts
├── app.vue
├── pages/
│   ├── index.vue           → /
│   ├── about.vue          → /about
│   ├── users/
│   │   ├── index.vue      → /users
│   │   └── [id].vue      → /users/:id
│   └── [...slug].vue      → /* (catch-all)
├── components/
│   ├── AppHeader.vue      → <AppHeader />
│   └── users/
│       └── UserCard.vue   → <UsersUserCard />
├── layouts/
│   ├── default.vue
│   └── admin.vue
├── composables/
│   ├── useAuth.ts
│   └── useFetchUser.ts
├── server/
│   ├── api/
│   │   └── users/
│   │       └── [id].get.ts
│   └── middleware/
├── middleware/
│   └── auth.ts
└── plugins/
    └── auth.client.ts
```

---

## Routing

### Dynamic Routes

```vue
<!-- pages/users/[id].vue -->
<script setup lang="ts">
// Get route params
const route = useRoute();
const userId = route.params.id as string;

// Fetch user data
const { data: user } = await useFetch(`/api/users/${userId}`);
</script>

<template>
  <div v-if="user">
    <h1>{{ user.name }}</h1>
    <p>{{ user.email }}</p>
  </div>
</template>
```

### Nested Routes

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="admin-layout">
    <aside>Admin Sidebar</aside>
    <main>
      <slot />  <!-- Pages render here -->
    </main>
  </div>
</template>

<!-- pages/admin/index.vue -->
<script setup lang="ts">
// This uses admin layout
definePageMeta({ layout: 'admin' });
</script>

<!-- pages/admin/users.vue -->
<script setup lang="ts">
// This also uses admin layout
definePageMeta({ layout: 'admin' });
</script>
```

### Catch-All Routes

```vue
<!-- pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string[];

const path = slug.join('/');
const { data: page } = await useFetch(`/api/pages/${path}`);
</script>
```

---

## Data Fetching

### useFetch (Recommended)

```vue
<script setup lang="ts">
// Basic usage
const { data, pending, error, refresh } = await useFetch('/api/users');

// With options
const { data: users, status } = await useFetch('/api/users', {
  method: 'POST',
  body: { name: 'John' },
  headers: { Authorization: `Bearer ${token}` },
  query: { page: 1, limit: 10 },
  transform: (data) => data.users,
  pick: ['users', 'total'],
  watch: [searchQuery], // Reactive ref to watch
});

// SSR caching
const { data } = await useFetch('/api/users', {
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key],
  transform: (data) => data.users,
});
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <ul v-else>
    <li v-for="user in data" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

### useAsyncData

```vue
<script setup lang="ts">
// For complex data transformations
const { data: user, pending, error } = await useAsyncData(
  'user-profile', // Unique key for caching
  () => $fetch('/api/users/1'),
  {
    transform: (user) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      createdAt: new Date(user.createdAt).toLocaleDateString(),
    }),
  }
);

// Refresh
async function refreshUser() {
  await refresh();
}
</script>
```

### useLazyFetch / useLazyAsyncData

```vue
<script setup lang="ts">
// Non-blocking - doesn't pause SSR
const { data: users, pending } = useLazyFetch('/api/users');
</script>

<template>
  <div v-if="pending">
    <LoadingSpinner />
  </div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

---

## Composables

### useAuth

```typescript
// composables/useAuth.ts
interface User {
  id: string;
  email: string;
  name: string;
}

export const useAuth = () => {
  const user = useState<User | null>('user', () => null);
  const isAuthenticated = computed(() => !!user.value);

  const login = async (email: string, password: string) => {
    const { data, error } = await useFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (data.value) {
      user.value = data.value.user;
      const token = useCookie('auth_token');
      token.value = data.value.token;
    }

    return { error: error.value };
  };

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' });
    user.value = null;
    const token = useCookie('auth_token');
    token.value = null;
  };

  const fetchUser = async () => {
    if (user.value) return;
    
    const { data, error } = await useFetch<User>('/api/auth/me');
    if (data.value) {
      user.value = data.value;
    }
  };

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    fetchUser,
  };
};
```

### useFetchUser

```typescript
// composables/useFetchUser.ts
export const useFetchUser = (id: MaybeRef<string>) => {
  return useAsyncData(
    `user-${toValue(id)}`,
    () => $fetch(`/api/users/${toValue(id)}`),
    {
      watch: [id],
    }
  );
};
```

---

## Server API

### API Routes

```typescript
// server/api/users/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    });
  }

  return user;
});
```

### POST/PUT/DELETE

```typescript
// server/api/users.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate
  if (!body.email || !body.name) {
    throw createError({
      statusCode: 400,
      message: 'Email and name are required',
    });
  }

  const user = await db.user.create({
    data: body,
  });

  return user;
});

// server/api/users/[id].delete.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  await db.user.delete({ where: { id } });

  return { success: true };
});
```

---

## Middleware

### Route Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});

// middleware/admin.ts
export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();

  if (user.value?.role !== 'admin') {
    return navigateTo('/');
  }
});
```

### Usage

```vue
<!-- pages/admin.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
});
</script>

<!-- Or inline -->
<script setup lang="ts">
definePageMeta({
  middleware: (to) => {
    if (!isAuthenticated) {
      return navigateTo('/login');
    }
  },
});
</script>
```

---

## State Management

### useState

```typescript
// composables/useCounter.ts
export const useCounter = () => {
  return useState<number>('counter', () => 0);
};

// Usage
const counter = useCounter();
counter.value++;
```

### Pinia Integration

```typescript
// stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async fetchUser() {
      this.isLoading = true;
      try {
        const { data } = await useFetch('/api/auth/me');
        this.user = data.value;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
```

---

## SEO & Meta

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'My Page Title',
  ogTitle: 'My Social Title',
  description: 'My page description',
  ogDescription: 'My social description',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
});

// Or with useHead
useHead({
  title: 'My Page Title',
  meta: [
    { name: 'description', content: 'My description' },
    { property: 'og:title', content: 'My Title' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg', href: '/favicon.ico' },
  ],
});
</script>
```

---

## Best Practices

### 1. Use useFetch over $fetch for Components

```vue
<!-- ✅ Good - SSR friendly -->
<script setup>
const { data } = await useFetch('/api/data');
</script>

<!-- ❌ Avoid in components -->
<script setup>
const data = await $fetch('/api/data');
</script>
```

### 2. Use Lazy for Below-Fold Content

```vue
<!-- ✅ Good - doesn't block render -->
<LazyUserList />

<!-- ✅ Good - explicit lazy -->
<LazySearchResults v-if="showResults" />
```

### 3. Define Types

```typescript
// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// composables/useUser.ts
export const useUser = () => {
  return useState<User | null>('user', () => null);
};
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/vue-pro` | Vue patterns |
| `/api-design` | API patterns |
| `/typescript-pro` | TypeScript patterns |

---

*The Intuitive Vue Framework!*
