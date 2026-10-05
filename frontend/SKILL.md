---
name: frontend
description: "Frontend development best practices including React 19, state management, error boundaries, and performance optimization."
version: "1.1.0"
priority: medium
phase: any
category: [frontend]
tech_stack:
  frameworks: [react, vue, angular, svelte]
  languages: [typescript, javascript]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/components/**"
      reason: "Frontend components detected"
    - has_file: "**/pages/**"
      reason: "Frontend pages detected"
    - has_file: "**/*.jsx"
      reason: "React/Vue components detected"
    - has_file: "**/*.tsx"
      reason: "React components detected"
  skill_tier: context
triggers:
  phrases:
    - "react"
    - "vue"
    - "angular"
    - "svelte"
    - "frontend"
    - "component"
    - "ui"
    - "css"
    - "tailwind"
    - "state management"
    - "redux"
    - "zustand"
    - "hook"
    - "render"
capabilities: [implementation, review]
quality:
  rules_count: 20
  examples_count: 30
  stability: stable
integrates_with: [auto-route, typescript-pro, testing]
dependencies: [typescript-pro, testing]
source:
  origin: merged
  sources: ["Jeffallan/claude-skills:react-expert"]
author: Claude
---

# FRONTEND MODULE

Kamu adalah Frontend Specialist. Gunakan rules ini untuk setiap aspek frontend development.

---

## 1. STATE MANAGEMENT
- **State Categories:**
  - **Server State:** Data from API (React Query, SWR, Apollo Client)
  - **URL State:** Route params, query strings
  - **Form State:** User input
  - **UI State:** Modals, dropdowns, theme
  - **Global State:** Auth, user preferences
- **State Management Solutions:**
  - **Zustand:** Lightweight, simple
  - **Redux Toolkit:** Standard, scalable
  - **Jotai:** Atomic, composable
  - **Recoil:** Facebook's approach
- **State Architecture:**
  - Normalize server data
  - Colocation where possible
  - Derived state dengan selectors
- **Performance:**
  - Memoization untuk expensive computations
  - Selective re-renders
  - Lazy loading state

## 2. ERROR BOUNDARIES & ERROR HANDLING
- **Error Boundaries:**
  - React: ErrorBoundary component
  - Catch JavaScript errors di component tree
  - Fallback UI untuk errors
  - Log errors untuk debugging
- **Error Handling Strategy:**
  - Try-catch untuk async operations
  - Global error handler
  - User-friendly error messages
  - Recovery mechanisms
- **User Feedback:**
  - Toast notifications
  - Inline error messages
  - Error pages for critical failures
  - Retry mechanisms
- **Error Tracking:**
  - Sentry, LogRocket
  - User session recording
  - Stack trace analysis

## 3. LOADING STATES
- **Loading States:**
  - Skeleton screens (preferred)
  - Spinners for short operations
  - Progress bars for known duration
  - Infinite scroll dengan loading indicator
- **UX Best Practices:**
  - Don't block entire page for partial loading
  - Progressive loading
  - Cache previous data during refresh
  - Debounce loading indicators (avoid flicker)
- **Suspense:**
  - React Suspense untuk data fetching
  - Lazy loading components
  - Streaming SSR
- **Optimization:**
  - Prefetch data
  - Background refresh
  - Stale-while-revalidate

## 4. OPTIMISTIC UPDATES
- **Optimistic UI Pattern:**
  - Update UI immediately
  - Send request to server
  - Rollback on failure
- **Implementation:**
  - Temporary state dengan rollback
  - Clear pending indicators
  - User-friendly rollback messages
- **Conflict Resolution:**
  - Last-write-wins
  - Server-authoritative
  - User merge for conflicts
- **Best Practices:**
  - Idempotent operations
  - Clear user feedback
  - Automatic retry

## 5. ROUTING
- **Client-Side Routing:**
  - React Router, Next.js App Router
  - Lazy loading routes
  - Route guards
- **Route Organization:**
  - Nested routes
  - Layout routes
  - Error boundaries per route
- **Navigation:**
  - Programmatic navigation
  - Deep linking
  - Browser history management
- **Data Fetching:**
  - Loader functions
  - Route-based data requirements
  - Parallel data loading

## 6. FORM MANAGEMENT
- **Form Libraries:**
  - React Hook Form (performance)
  - Formik (simplicity)
  - React Final Form (flexibility)
- **Validation:**
  - Schema validation (Zod, Yup)
  - Real-time validation
  - Server-side validation
- **Form Patterns:**
  - Auto-save drafts
  - Unsaved changes warning
  - Multi-step forms
  - Field arrays
- **Submission:**
  - Optimistic updates
  - Disable during submission
  - Clear error handling

## 7. PERFORMANCE OPTIMIZATION
- **Bundle Optimization:**
  - Code splitting
  - Dynamic imports
  - Tree shaking
  - Compression (Brotli, gzip)
- **Rendering Optimization:**
  - Virtualization untuk long lists
  - Memoization (React.memo, useMemo)
  - Avoid unnecessary re-renders
  - Key props for lists
- **Image Optimization:**
  - Responsive images (srcset)
  - Lazy loading
  - Modern formats (WebP, AVIF)
  - Blur placeholder
- **Core Web Vitals:**
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

## 8. RESPONSIVE DESIGN
- **Mobile-First:**
  - Design untuk mobile first
  - Progressive enhancement
  - Touch-friendly targets
- **Breakpoints:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
  - Large: > 1440px
- **Responsive Patterns:**
  - Fluid typography
  - Grid systems
  - Container queries
- **Testing:**
  - Device testing
  - Browser testing
  - Accessibility testing

## 9. ACCESSIBILITY (A11Y)
- **WCAG Compliance:**
  - Semantic HTML
  - Keyboard navigation
  - Focus management
  - ARIA attributes
- **Screen Reader Support:**
  - Alt text for images
  - Form labels
  - Live regions for dynamic content
- **Color & Contrast:**
  - 4.5:1 contrast ratio minimum
  - Color not sole indicator
  - High contrast mode support
- **Testing:**
  - axe-core
  - Lighthouse accessibility audit
  - Manual testing

## 10. SECURITY
- **XSS Prevention:**
  - React's built-in escaping
  - Sanitize user input
  - Content Security Policy
- **CSRF Prevention:**
  - SameSite cookies
  - CSRF tokens
  - Origin validation
- **Dependency Security:**
  - npm audit
  - Dependency scanning
  - Regular updates
- **Secrets:**
  - No secrets in frontend code
  - Environment variables
  - Secure token storage

## 11. TESTING
- **Unit Testing:**
  - Jest, Vitest
  - React Testing Library
  - Test behavior, not implementation
- **Component Testing:**
  - Storybook stories
  - Visual regression testing
  - Accessibility testing
- **E2E Testing:**
  - Playwright, Cypress
  - Critical user flows
  - Cross-browser testing
- **Integration Testing:**
  - API mocking
  - State management testing
  - Router testing

## 12. PWA & OFFLINE
- **Service Worker:**
  - Workbox for caching
  - Offline-first approach
  - Background sync
- **PWA Features:**
  - Web App Manifest
  - Install prompt
  - Push notifications
- **Caching Strategy:**
  - Cache-first for static assets
  - Network-first for API
  - Stale-while-revalidate
- **Offline Indicators:**
  - Clear offline state
  - Queue actions for sync
  - Sync status indicator

---

## React 19 Patterns

### Server Component Example (Next.js)

```tsx
// app/users/page.tsx — Server Component
import { db } from '@/lib/db';

interface User {
  id: string;
  name: string;
}

export default async function UsersPage() {
  const users: User[] = await db.user.findMany();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### React 19 Form with useActionState

```tsx
'use client';
import { useActionState } from 'react';

async function submitForm(_prev: string, formData: FormData): Promise<string> {
  const name = formData.get('name') as string;
  return `Hello, ${name}!`;
}

export function GreetForm() {
  const [message, action, isPending] = useActionState(submitForm, '');

  return (
    <form action={action}>
      <input name="name" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

---

## Constraints

### MUST DO
- Use TypeScript with strict mode
- Implement error boundaries
- Use `key` props correctly
- Clean up effects
- Use semantic HTML and ARIA
- Memoize when passing callbacks

### MUST NOT DO
- Mutate state directly
- Use array index as key for dynamic lists
- Create functions inside JSX
- Forget useEffect cleanup

---

**Invok:** `/frontend` | **Priority:** MEDIUM | **Version:** 1.1.0
