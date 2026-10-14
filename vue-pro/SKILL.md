---
name: vue-pro
version: "1.0.0"
description: "Vue.js 3 patterns with Composition API, Pinia, and Vue Router."
when_to_use: "When building Vue.js applications, using Composition API, or managing Vue state with Pinia."
priority: critical
phase: any
category: [frontend]
tech_stack:
  frameworks: [vue, nuxt]
  languages: [typescript, javascript]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: ["package.json"]
      reason: "package.json detected"
    - pattern: ["vue", "vue.js", "composition api", "pinia", "<script setup"]
      reason: "Vue.js patterns detected"
capabilities:
  - components
  - composables
  - state-management
author: TheVoidSyntax
---

# VUE-PRO v1.0 💚

**Vue.js 3 patterns with Composition API, Pinia, and Vue Router**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  VUE SCRIPT SETUP                                          │
├─────────────────────────────────────────────────────────────┤
│  <script setup lang="ts">     → Composition API (recommended)│
│  <script lang="ts">          → Options API                 │
│  defineProps<Props>()         → Type-safe props              │
│  defineEmits<Emits>()        → Type-safe emits             │
│  defineModel()               → Two-way binding (Vue 3.4+) │
│  ref() / reactive()          → Reactive state               │
│  computed()                  → Derived state                 │
│  watch() / watchEffect()     → Side effects                │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Patterns

### Functional Component (Vue 3.4+)

```vue
<!-- components/UserCard.vue -->
<script setup lang="ts">
interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

// Using defineModel for two-way binding (Vue 3.4+)
const model = defineModel<boolean>({ default: false });

// Computed for styling
const sizeClasses = computed(() => ({
  'w-8 h-8': props.size === 'sm',
  'w-12 h-12': props.size === 'md',
  'w-16 h-16': props.size === 'lg',
}));
</script>

<template>
  <div class="user-card">
    <img
      :src="user.avatar || '/default-avatar.png'"
      :alt="user.name"
      :class="['rounded-full', sizeClasses]"
    />
    <div class="user-info">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
    <div class="actions">
      <button @click="emit('edit', user.id)">Edit</button>
      <button @click="emit('delete', user.id)">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
```

### Reusable Button Component

```vue
<!-- components/AppButton.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
});

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'rounded font-medium transition-colors',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[props.variant],
      sizeClasses[props.size],
    ]"
  >
    <span v-if="loading" class="spinner" />
    <slot />
  </button>
</template>
```

---

## Composables (Reusable Logic)

### useFetch

```typescript
// composables/useFetch.ts
import { ref, computed, watchEffect } from 'vue';

interface UseFetchOptions<T> {
  immediate?: boolean;
  transform?: (data: unknown) => T;
}

export function useFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  const resolvedUrl = computed(() =>
    typeof url === 'function' ? url() : url
  );

  const execute = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(resolvedUrl.value);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      let result = await response.json();
      if (options.transform) {
        result = options.transform(result);
      }
      data.value = result;
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Unknown error');
    } finally {
      loading.value = false;
    }
  };

  if (options.immediate !== false) {
    watchEffect(() => {
      if (resolvedUrl.value) execute();
    });
  }

  return {
    data,
    error,
    loading,
    execute,
  };
}

// Usage
const { data: users, loading, error, execute } = useFetch<User[]>(
  () => `/api/users?page=${currentPage.value}`,
  {
    immediate: false,
    transform: (data) => (data as { users: User[] }).users,
  }
);
```

### useLocalStorage

```typescript
// composables/useLocalStorage.ts
import { ref, watch } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key);
  const data = ref<T>(stored ? JSON.parse(stored) : defaultValue);

  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  return data;
}

// Usage
const theme = useLocalStorage('theme', 'light');
const username = useLocalStorage('username', '');
```

### useDebounce

```typescript
// composables/useDebounce.ts
import { ref, watch } from 'vue';

export function useDebounce<T>(value: Ref<T>, delay = 300) {
  const debouncedValue = ref<T>(value.value) as Ref<T>;
  let timeout: ReturnType<typeof setTimeout>;

  watch(value, (newValue) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  return debouncedValue;
}

// Usage
const searchQuery = ref('');
const debouncedSearch = useDebounce(searchQuery, 500);

watch(debouncedSearch, (query) => {
  // API call here
});
```

---

## Pinia Store

### Basic Store

```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useLocalStorage } from '@/composables/useLocalStorage';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const token = useLocalStorage('auth_token', '');
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const userName = computed(() => user.value?.name || 'Guest');

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true;
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      token.value = data.token;
      user.value = data.user;
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    user.value = null;
    token.value = '';
    await fetch('/api/auth/logout', { method: 'POST' });
  }

  async function fetchUser() {
    if (!token.value) return;
    
    isLoading.value = true;
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      
      if (response.ok) {
        user.value = await response.json();
      } else {
        logout();
      }
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    // Getters
    isAuthenticated,
    isAdmin,
    userName,
    // Actions
    login,
    logout,
    fetchUser,
  };
});
```

### Store with Persistence

```typescript
// stores/cart.ts
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  // Persisted state
  const items = ref<CartItem[]>([]);
  const isOpen = ref(false);

  // Computed
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  // Actions
  function addItem(item: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({ ...item, quantity: 1 });
    }
  }

  function removeItem(id: string) {
    const index = items.value.findIndex((i) => i.id === id);
    if (index > -1) items.value.splice(index, 1);
  }

  function updateQuantity(id: string, quantity: number) {
    const item = items.value.find((i) => i.id === id);
    if (item) {
      if (quantity <= 0) {
        removeItem(id);
      } else {
        item.quantity = quantity;
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  // Persist to localStorage
  watch(
    items,
    (newItems) => {
      localStorage.setItem('cart', JSON.stringify(newItems));
    },
    { deep: true }
  );

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
});
```

---

## Vue Router

### Router Setup

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/stores/user';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/HomePage.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/pages/AboutPage.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/pages/UsersPage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/pages/auth/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/auth/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/Dashboard.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash };
    return { top: 0 };
  },
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // Fetch user if token exists but user not loaded
  if (userStore.token && !userStore.user) {
    await userStore.fetchUser();
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.role && userStore.user?.role !== to.meta.role) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
```

---

## Best Practices

### 1. Script Setup Over Options API

```vue
<!-- ✅ Recommended -->
<script setup lang="ts">
const count = ref(0);
const doubled = computed(() => count.value * 2);
function increment() { count.value++; }
</script>

<!-- ❌ Avoid -->
<script lang="ts">
export default {
  data() { return { count: 0 } },
  computed: { doubled() { return this.count * 2 } },
  methods: { increment() { this.count++ } }
}
</script>
```

### 2. Use TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const props = defineProps<{ user: User }>();

// ❌ Avoid
const props = defineProps({
  user: { type: Object, required: true }
});
```

### 3. Async Components

```vue
<script setup>
const UserList = defineAsyncComponent(() => import('./UserList.vue'));
const isLoading = ref(false);
</script>

<template>
  <Suspense v-if="!isLoading">
    <template #default>
      <UserList />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/nuxt-pro` | Nuxt.js framework |
| `/typescript-pro` | TypeScript patterns |
| `/code-quality` | Code quality |

---

*Build reactive applications with joy!*
