---
name: fastify-pro
version: "1.0.0"
description: "Fastify patterns, plugins, schemas, and performance optimization."
when_to_use: "When building Fastify applications, using Fastify plugins, or optimizing performance."
priority: medium
phase: any
category: [backend]
tech_stack:
  frameworks: [fastify]
  languages: [typescript, javascript]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - pattern: ["fastify", "@fastify"]
      reason: "Fastify usage detected"
capabilities:
  - routing
  - schemas
  - plugins
author: TheVoidSyntax
---

# FASTIFY-PRO v1.0 ⚡

**Fastify patterns, plugins, schemas, and performance optimization**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  FASTIFY COMMANDS                                           │
├─────────────────────────────────────────────────────────────┤
│  npm install fastify @fastify/cors @fastify/jwt             │
│  fastify.listen()           → Start server                  │
│  fastify.register()        → Add plugins                  │
│  fastify.route()           → Define routes                │
│  fastify.setSerializerCompiler() → Custom serializer       │
└─────────────────────────────────────────────────────────────┘
```

---

## Basic Setup

```typescript
// server.ts
import Fastify from 'fastify';

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
  // Performance options
  trustProxy: true,
  bodyLimit: 1048576, // 1MB
});

// Register plugins
await fastify.register(import('@fastify/cors'), {
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
});

await fastify.register(import('@fastify/jwt'), {
  secret: process.env.JWT_SECRET!,
});

await fastify.register(import('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute',
});

// Routes
fastify.get('/health', async () => ({ status: 'ok' }));

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
```

---

## Routes & Schemas

### JSON Schema Validation

```typescript
// Schema definitions
const userSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
    name: { type: 'string', minLength: 1 },
    role: { type: 'string', enum: ['user', 'admin'] },
  },
};

const createUserSchema = {
  body: userSchema,
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
      },
    },
  },
};

// Route with schema
fastify.post<{ Body: CreateUserBody }>(
  '/users',
  { schema: createUserSchema },
  async (request, reply) => {
    const { email, password, name } = request.body;
    
    const user = await createUser({ email, password, name });
    
    reply.code(201);
    return { id: user.id, email: user.email };
  }
);
```

### Typed Routes

```typescript
// types.d.ts
interface CreateUserBody {
  email: string;
  password: string;
  name: string;
}

interface UserParams {
  id: string;
}

// Route with types
fastify.post<{ Body: CreateUserBody }>(
  '/users',
  async (request, reply) => {
    const user = await createUser(request.body);
    return user;
  }
);

fastify.get<{ Params: UserParams }>(
  '/users/:id',
  async (request, reply) => {
    const user = await getUser(request.params.id);
    if (!user) {
      reply.code(404);
      return { error: 'User not found' };
    }
    return user;
  }
);
```

---

## Plugins

### Create Plugin

```typescript
// plugins/database.ts
import { FastifyPluginAsync } from 'fastify';

interface DatabasePluginOptions {}

const databasePlugin: FastifyPluginAsync<DatabasePluginOptions> = async (fastify, options) => {
  const db = await createDatabaseConnection();
  
  // Decorate fastify instance
  fastify.decorate('db', db);
  
  // Add hooks
  fastify.addHook('onClose', async () => {
    await db.close();
  });
};

export default databasePlugin;

// Usage
await fastify.register(import('./plugins/database'));
console.log(fastify.db); // Available everywhere
```

### Plugin with Options

```typescript
// plugins/config.ts
import { FastifyPluginAsync } from 'fastify';

export const configPlugin: FastifyPluginAsync<{
  prefix: string;
}> = async (fastify, options) => {
  fastify.decorate('config', {
    prefix: options.prefix,
    env: process.env.NODE_ENV,
  });
};

// Register with options
await fastify.register(import('./plugins/config'), {
  prefix: '/api/v1',
});
```

---

## Authentication

### JWT Auth Plugin

```typescript
// plugins/auth.ts
import { FastifyPluginAsync } from 'fastify';

export const authPlugin: FastifyPluginAsync = async (fastify) => {
  // Add authenticate decorator
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
};

// Usage in route
fastify.get(
  '/profile',
  { onRequest: [fastify.authenticate] },
  async (request) => {
    return request.user;
  }
);
```

---

## Performance Tips

### 1. Use findMyWay Router

```typescript
// Fastify uses findMyWay by default - very fast!
// Just ensure routes are defined efficiently
fastify.get('/users/:id', handler); // Fast
fastify.get('/users', handler); // Separate route
```

### 2. Serialize Wisely

```typescript
// Custom serializer for better performance
fastify.setSerializerCompiler(({ schema, method, url, httpStatus }) => {
  return (data) => JSON.stringify(data);
});
```

### 3. Use preload

```typescript
// preload.ts
import Fastify from 'fastify';

export const fastify = Fastify({
  logger: true,
  // Preload plugins
  pluginTimeout: 10000,
});
```

---

## Error Handling

```typescript
// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  if (error.validation) {
    reply.code(400).send({
      error: 'Bad Request',
      message: error.message,
      validation: error.validation,
    });
    return;
  }
  
  reply.code(error.statusCode || 500).send({
    error: error.name,
    message: error.message,
  });
});

// Custom errors
fastify.get('/not-found', async () => {
  const error = new Error('Not found');
  error.statusCode = 404;
  throw error;
});
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/api-design` | API design patterns |
| `/typescript-pro` | TypeScript patterns |

---

*The fastest web framework!*
