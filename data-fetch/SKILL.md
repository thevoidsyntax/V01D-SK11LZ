---
name: data-fetch
description: "Data fetching patterns with TanStack Query, SWR, and caching strategies."
version: "1.0.0"
category: [frontend, integration]
priority: medium
phase: any
tech_stack:
  languages: [typescript, javascript]
scale: [small, medium]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/queries.ts"
      reason: "Query definitions detected"
  skill_tier: optional
triggers:
  phrases:
    - "useQuery"
    - "SWR"
    - "fetching"
    - "caching"
capabilities: [implementation]
dependencies: [react-pro, api-client]
integrates_with: [react-pro, api-client]
---

# DATA-FETCH v1.0

TanStack Query, SWR, and data fetching patterns.

## TanStack Query

### 1. Query Setup

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 2. Query Keys

```typescript
export const queryKeys = {
  users: {
    all: ['users'] as const,
    list: (f?: UserFilters) => [...queryKeys.users.all, 'list', f] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
  products: {
    all: ['products'] as const,
    // ...variants as needed
  },
} as const;
```

### 3. Query Options

```typescript
export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => api.users.get(id),
    enabled: Boolean(id),
    staleTime: 10 * 60 * 1000,
  });
}

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => api.users.list(filters),
    placeholderData: keepPreviousData,
  });
}
```

### 4. Mutations

```typescript
export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.users.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
```

## SWR Patterns

### 1. Basic Usage

```typescript
import useSWR from 'swr';

const { data, error, isLoading } = useSWR('/api/user', fetcher);
```

### 2. Optimistic Updates

```typescript
const { data, mutate } = useSWR<User[]>('/api/users');

async function handleDelete(id: string) {
  await api.users.delete(id);
  mutate(data?.filter(u => u.id !== id), false);
}
```

---

*Author: TheVoidSyntax*
