---
name: svelte-pro
version: "1.0.0"
description: "Svelte & SvelteKit patterns, stores, actions, and server-side rendering."
when_to_use: "When building Svelte or SvelteKit applications, using Svelte stores, or implementing SSR."
priority: medium
phase: any
category: [frontend]
tech_stack:
  frameworks: [svelte, sveltekit]
  languages: [typescript, javascript]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: ["svelte.config.js", "vite.config.ts"]
      reason: "Svelte/SvelteKit project detected"
    - pattern: ["svelte", "sveltekit", "<script lang"]
      reason: "Svelte patterns detected"
capabilities:
  - components
  - stores
  - actions
  - server-side
author: TheVoidSyntax
---

# SVELTE-PRO v1.0 🟠

**Svelte & SvelteKit patterns, stores, actions, and SSR**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  SVELTE BASICS                                           │
├─────────────────────────────────────────────────────────────┤
│  <script lang="ts">     → TypeScript support            │
│  let variable = value   → Reactive variable              │
│  $: derived = ...       → Reactive statement            │
│  $store               → Auto-subscription to stores   │
│  export let prop      → Props (destructurable)        │
│  {#if condition}       → Conditional rendering          │
│  {#each items as item} → List rendering                │
│  <slot />             → Slot for children               │
└─────────────────────────────────────────────────────────────┘
```

---

## SvelteKit Project Structure

```
src/
├── lib/
│   ├── components/      # Reusable components
│   ├── stores/         # Svelte stores
│   ├── actions/        # Svelte actions
│   ├── utils/          # Utility functions
│   └── server/         # Server-only code
├── routes/
│   ├── +layout.svelte # Root layout
│   ├── +page.svelte   # Route page
│   ├── +page.server.ts # Server-side data
│   └── api/            # API routes
└── app.html
```

---

## Component Patterns

### Basic Component

```svelte
<!-- UserCard.svelte -->
<script lang="ts">
  interface Props {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    size?: 'sm' | 'md' | 'lg';
  }

  let { user, size = 'md' }: Props = $props();

  // Reactive derived values
  const sizeClass = $derived(
    size === 'sm' ? 'w-8 h-8' :
    size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
  );

  // Event handlers
  function handleEdit() {
    // Custom event dispatch
    const event = new CustomEvent('edit', { detail: user.id });
    dispatch(event);
  }
</script>

<div class="user-card">
  <img
    src={user.avatar || '/default-avatar.png'}
    alt={user.name}
    class={sizeClass}
  />
  <div class="info">
    <h3>{user.name}</h3>
    <p>{user.email}</p>
  </div>
  <button onclick={handleEdit}>Edit</button>
</div>

<style>
  .user-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
</style>
```

### Component with Slot

```svelte
<!-- Card.svelte -->
<script lang="ts">
  let { title, collapsible = false }: { title: string; collapsible?: boolean } = $props();
  let expanded = $state(true);
</script>

<div class="card">
  <button class="header" onclick={() => collapsible && (expanded = !expanded)}>
    <h3>{title}</h3>
    {#if collapsible}
      <span class="icon">{expanded ? '−' : '+'}</span>
    {/if}
  </button>
  
  {#if expanded || !collapsible}
    <div class="content">
      <slot />
    </div>
  {/if}
</div>

<!-- Usage -->
<Card title="My Card">
  <p>This content goes into the slot!</p>
</Card>
```

---

## Svelte Stores

### Writable Store

```typescript
// lib/stores/user.ts
import { writable, derived } from 'svelte/store';

interface User {
  id: string;
  name: string;
  email: string;
}

// Create store
function createUserStore() {
  const { subscribe, set, update } = writable<User | null>(null);

  return {
    subscribe,
    login: async (email: string, password: string) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const user = await response.json();
        set(user);
        return { success: true };
      }
      return { success: false };
    },
    logout: () => set(null),
    update: (data: Partial<User>) => update(user => user ? { ...user, ...data } : null),
  };
}

export const userStore = createUserStore();

// Derived store
export const isAuthenticated = derived(userStore, $user => $user !== null);
```

### Readable Store

```typescript
// lib/stores/theme.ts
import { readable } from 'svelte/store';

type Theme = 'light' | 'dark';

function createThemeStore() {
  const { subscribe, set } = readable<Theme>('light', (set) => {
    // Get initial theme
    const stored = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    set(initial);

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        set(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  });

  return {
    subscribe,
    set: (theme: Theme) => {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      set(theme);
    },
    toggle: () => {
      const current = localStorage.getItem('theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
      set(next);
    },
  };
}

export const theme = createThemeStore();
```

### Using Stores

```svelte
<script lang="ts">
  import { userStore, isAuthenticated } from '$lib/stores/user';
  import { theme } from '$lib/stores/theme';

  // Auto-subscribe with $ prefix
  $: user = $userStore;
</script>

{#if $isAuthenticated}
  <p>Welcome, {user?.name}!</p>
{:else}
  <p>Please log in</p>
{/if}

<button onclick={() => theme.toggle()}>
  Current: {$theme}
</button>
```

---

## SvelteKit Data Loading

### Page Server Load

```typescript
// src/routes/users/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, locals }) => {
  // Check auth
  if (!locals.user) {
    throw error(401, 'Please log in');
  }

  // Fetch data
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw error(500, 'Failed to load users');
  }

  const users = await response.json();

  return {
    users,
    meta: { title: 'Users', description: 'Manage users' }
  };
};

export const actions: Actions = {
  delete: async ({ request, fetch }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to delete user' };
    }

    return { success: true };
  }
};
```

### Page Component

```svelte
<!-- src/routes/users/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';

  let { data } = $props();
  // or: export let data: { users: User[] };

  let deleting = $state(false);
</script>

<h1>Users</h1>

<ul>
  {#each data.users as user}
    <li>
      {user.name} - {user.email}
      <form
        method="POST"
        action="?/delete"
        use:enhance={() => {
          deleting = true;
          return async ({ result, update }) => {
            deleting = false;
            if (result.type === 'redirect') {
              await update();
            }
          };
        }}
      >
        <input type="hidden" name="id" value={user.id} />
        <button type="submit" disabled={deleting}>Delete</button>
      </form>
    </li>
  {/each}
</ul>
```

---

## Form Actions

```typescript
// src/routes/auth/login/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/dashboard');
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return fail(400, {
        email,
        error: 'Email and password are required',
      });
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return fail(401, {
        email,
        error: 'Invalid credentials',
      });
    }

    const { token, user } = await response.json();
    cookies.set('session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    throw redirect(303, '/dashboard');
  },
};
```

---

## Svelte Actions

### useClickOutside

```typescript
// lib/actions/clickOutside.ts
export function clickOutside(
  node: HTMLElement,
  callback: () => void
) {
  const handleClick = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
      callback();
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
}

// Usage
<script lang="ts">
  import { clickOutside } from '$lib/actions/clickOutside';
  
  let open = $state(false);
</script>

<div class="dropdown" use:clickOutside={() => open = false}>
  <button onclick={() => open = !open}>Toggle</button>
  {#if open}
    <div class="menu">Content</div>
  {/if}
</div>
```

### useIntersectionObserver

```typescript
// lib/actions/intersectionObserver.ts
interface Options {
  threshold?: number;
  root?: Element;
  rootMargin?: string;
}

export function intersectionObserver(
  node: HTMLElement,
  { threshold = 0, root = null, rootMargin = '0px' }: Options = {}
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        node.dispatchEvent(
          new CustomEvent('intersect', {
            detail: { isIntersecting: entry.isIntersecting }
          })
        );
      });
    },
    { threshold, root, rootMargin }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}

// Usage
<div
  use:intersectionObserver={{ threshold: 0.5 }}
  onintersect={(e) => console.log('Visible:', e.detail.isIntersecting)}
>
  Lazy loaded content
</div>
```

---

## Best Practices

### 1. Use Runes ($state, $derived, $effect)

```svelte
<!-- ✅ Modern Svelte 5 -->
<script lang="ts">
  let count = $state(0);
  const doubled = $derived(count * 2);
  
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>

<!-- ❌ Old Svelte 4 -->
<script>
  import { onMount } from 'svelte';
  let count = 0;
  $: doubled = count * 2;
</script>
```

### 2. Type Your Props

```svelte
<!-- ✅ Good -->
<script lang="ts">
  interface Props {
    name: string;
    age: number;
    tags?: string[];
  }
  let { name, age, tags = [] }: Props = $props();
</script>

<!-- ❌ Avoid -->
<script>
  export let name;
  export let age;
  export let tags = [];
</script>
```

### 3. Server vs Client

```typescript
// Only runs on server
// src/lib/server/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// Safe to import on both
// src/lib/stores/user.ts
export const userStore = writable(null);
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/api-design` | API patterns |
| `/typescript-pro` | TypeScript patterns |
| `/code-quality` | Code quality |

---

*Write less code, ship faster!*
