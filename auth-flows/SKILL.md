---
name: auth-flows
description: "Authentication patterns with JWT, OAuth, session management, and protected routes."
when_to_use: "Use when implementing authentication: JWT, OAuth, sessions, or protected routes."
version: "1.0.0"
category: [security, integration]
priority: low
phase: any
tech_stack:
  languages: [typescript, javascript, python, go]
scale: [medium, large]
auto_invoke:
  enabled: false
  conditions:
    - phrase: ["auth", "login", "jwt", "oauth", "session"]
  skill_tier: optional
triggers:
  phrases:
    - "auth"
    - "login"
    - "jwt"
    - "oauth"
    - "session"
capabilities: [implementation]
dependencies: [security]
integrates_with: [security, api-design]
---

# AUTH-FLOWS v1.0

Authentication patterns with JWT, OAuth, and session management.

## JWT Patterns

### 1. Token Storage

```
┌─────────────────────────────────────────────────────────────────┐
│  TOKEN STORAGE COMPARISON                                   │
├─────────────────────────────────────────────────────────┤
│  httpOnly Cookie        Secure, CSRF protected, size limit 4KB    │
│  Memory (JS variable)  XSS vulnerable, cleared on refresh            │
│  localStorage              XSS vulnerable, persists                │
│                                                                  │
│  RECOMMEND: httpOnly cookie for web apps                    │
└─────────────────────────────────────────────────────────┘
```

### 2. Auth Middleware

```typescript
import type { Request, Response } from 'express';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.token
    ?? req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ code: 'UNAUTHORIZED' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ code: 'INVALID_TOKEN' });
  }
}
```

### 3. Login Flow

```typescript
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await validateCredentials(email, password);
  if (!user) {
    return res.status(401).json({ code: 'INVALID_CREDENTIALS' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.json({ user });
});
```

## OAuth 2.0

### 1. Authorization URL

```typescript
const GOOGLE_AUTH_URL = new URL('https://accounts.google.com/o/oauth2/v2/auth');

googleAuth.url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
googleAuth.searchParams.set('redirect_uri', `${origin}/auth/callback`);
googleAuth.searchParams.set('response_type', 'code');
googleAuth.searchParams.set('scope', 'email profile');
googleAuth.searchParams.set('state', crypto.randomBytes(16).toString('hex'));

res.redirect(googleAuth.toString());
```

### 2. Token Exchange

```typescript
async function exchangeCode(code: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_SECRET,
      redirect_uri: `${origin}/auth/callback`,
      grant_type: 'authorization_code',
    }),
  });

  return res.json();
}
```

### 3. Session vs JWT

```
┌─────────────────────────────────────────────────────────────────┐
│  SESSION-BASED AUTH (Cookie + Server Store)                  │
├─────────────────────────────────────────────────────────┤
│  PROS:         Instant revocation, stateless tokens not needed     │
│  CONS:        State required, Redis/session store overhead       │
│  USE WHEN:    Need instant logout, sensitive sessions           │
│                                                                  │
│  JWT (Stateless Token)                                         │
│  PROS:         Stateless, no server state                    │
│  CONS:        Harder to revoke, size in headers             │
│  USE WHEN:     Short-lived tokens, mobile apps, APIs            │
└─────────────────────────────────────────────────────────┘
```

## Protected Routes

### 1. Server Side (React Router)

```typescript
// App.tsx
<Route element={<AuthGuard fallback={<Navigate to="/login" />}>
  <Dashboard />
</Route>
```

### 2. Client Hook

```typescript
function useAuth() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}
```

---

*Author: TheVoidSyntax*
