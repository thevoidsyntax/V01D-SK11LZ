---
name: react-pro
description: "React patterns with hooks, state management, routing, and performance optimization."
version: "1.0.0"
category: [frontend]
priority: high
phase: any
tech_stack:
  frameworks: [react, nextjs]
  languages: [typescript, javascript]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/package.json"
      reason: "Package.json detected"
  skill_tier: context
triggers:
  phrases:
    - "react"
    - "component"
    - "hook"
    - "useState"
    - "useEffect"
capabilities: [implementation, review]
dependencies: [ui-ux-pro-max]
integrates_with: [ui-ux-pro-max]
---

# REACT-PRO v1.0

React patterns for hooks, state management, and performance optimization.

## Component Patterns

### 1. Functional Component

```tsx
import { type FC } from 'react';

interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
}

export const UserCard: FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={() => onEdit(user.id)}>Edit</button>
      )}
    </div>
  );
};
```

### 2. Composition Pattern

```tsx
// Compound Component
const Card = ({ children, className }) => (
  <div className={cn('card', className)}>{children}</div>
);

Card.Header = ({ children }) => <div className="card-header">{children}</div>;
Card.Body = ({ children }) => <div className="card-body">{children}</div>;
Card.Footer = ({ children }) => <div className="card-footer">{children}</div>;

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

## Hooks Patterns

### 1. useState with Callback

```tsx
const [count, setCount] = useState(0);

// Functional update (safe in closures)
setCount(prev => prev + 1);

// With callback (for async operations)
const [data, setData] = useState<Data | null>(null);
setData(async (prev) => {
  const fresh = await fetchData();
  return fresh;
});
```

### 2. useEffect Cleanup

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err);
    });

  return () => controller.abort();
}, [url]);
```

### 3. Custom Hook Pattern

```tsx
// Reusable hook
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### 4. useMemo & useCallback

```tsx
// Memoize expensive computation
const sortedList = useMemo(
  () => expensiveSort(data, sortBy),
  [data, sortBy]
);

// Memoize callback (for child components)
const handleSubmit = useCallback((data: FormData) => {
  submitForm(data);
}, [submitForm]); // Only changes when submitForm changes
```

## State Management

### 1. Zustand (Lightweight)

```tsx
// store/userStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  immer((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    updateUser: (updates) => set((s) => { Object.assign(s.user!, updates); }),
  }))
);

// Usage
const user = useUserStore((s) => s.user);
const { setUser } = useUserStore();
```

### 2. Context + useReducer

```tsx
// Auth context pattern
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, loading: true });

  useEffect(() => {
    checkAuth().then(user => dispatch({ type: 'SET_USER', user }));
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }} >
      {children}
    </AuthContext.Provider>
  );
}
```

### 3. TanStack Query (Server State)

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function UserList() {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  return (/* ... */);
}
```

## Performance Patterns

### 1. Code Splitting

```tsx
// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>

// Component-level splitting
const HeavyChart = lazy(() => import('./HeavyChart'));
```

### 2. Virtualization (Long Lists)

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(({ index, start, size }) => (
          <div key={index} style={{ position: 'absolute', top: start, height: size }}>
            <Item item={items[index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Windowing (Large Data)

```tsx
import { useWindowVirtualizer } from 'use-virtual';

function VirtualRows({ data }: { data: Row[] }) {
  const rowVirtualizer = useWindowVirtualizer({
    count: data.length,
    estimateSize: () => 48,
    overscan: 5, // Render 5 extra rows above/below viewport
  });

  return (/* ... */);
}
```

## Routing Patterns

### React Router v6

```tsx
import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'users/:userId',
        loader: ({ params }) => fetchUser(params.userId),
        element: <UserProfile />,
      },
    ],
  },
]);

<RouterProvider router={router} />

// Loader for data fetching
function UserProfile() {
  const { userId } = useParams();
  const user = useLoaderData<typeof router>('/users/:userId');
}
```

## Best Practices

```
REACT PATTERNS:
  [x] Functional components with proper types
  [x] Custom hooks for reusable logic
  [x] useMemo/useCallback for expensive ops
  [x] Error boundaries for component failures
  [x] Suspense for code splitting

STATE MANAGEMENT:
  [x] Server state: TanStack Query
  [x] Client state: Zustand (simple) / Redux (complex)
  [x] URL state: React Router

PERFORMANCE:
  [x] Lazy loading components
  [x] Virtualization for lists
  [x] Image optimization
  [x] Bundle code splitting

TESTING:
  [x] Testing Library for components
  [x] Mock service workers for API
  [x] Snapshot testing sparingly
```

---

*Author: TheVoidSyntax*
