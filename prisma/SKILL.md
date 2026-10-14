---
name: prisma
version: "1.0.0"
description: "Prisma ORM patterns, schema design, queries, and migrations."
when_to_use: "When using Prisma as ORM, designing database schema, or writing type-safe database queries."
priority: critical
phase: any
category: [database, backend]
tech_stack:
  databases: [postgresql, mysql, sqlite]
  orm: [prisma]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: ["prisma/schema.prisma", "**/prisma.config.ts"]
      reason: "Prisma project detected"
    - pattern: ["prisma", "@prisma/client"]
      reason: "Prisma usage detected"
capabilities:
  - schema-design
  - queries
  - migrations
  - relations
author: TheVoidSyntax
---

# PRISMA ORM v1.0 🔷

**Prisma ORM patterns, schema design, queries, and migrations**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  COMMON TASKS                                              │
├─────────────────────────────────────────────────────────────┤
│  npx prisma init              → Initialize project       │
│  npx prisma db push          → Push schema to DB        │
│  npx prisma migrate dev      → Create migration         │
│  npx prisma studio           → Open GUI editor          │
│  npx prisma generate         → Generate client          │
└─────────────────────────────────────────────────────────────┘
```

---

## Schema Design

### Basic Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]       // Relation
  profile   Profile?     // Optional one-to-one
  comments  Comment[]     // Relation
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User     @relation(fields: [authorId], references: [id])
  comments  Comment[]
  tags      Tag[]
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  postId    String
  authorId  String
  createdAt DateTime @default(now())

  post      Post     @relation(fields: [postId], references: [id])
  author    User     @relation(fields: [authorId], references: [id])
}

model Tag {
  id    String @id @default(uuid())
  name  String @unique
  posts Post[]
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

### Relations

```prisma
// One-to-One
model User {
  id        String   @id @default(uuid())
  profile   Profile?
}

model Profile {
  id     String @id @default(uuid())
  bio    String
  userId String @unique  // Required for one-to-one
  user   User   @relation(fields: [userId], references: [id])
}

// One-to-Many
model User {
  id    String  @id @default(uuid())
  posts Post[]
}

model Post {
  id      String @id @default(uuid())
  authorId String
  author  User   @relation(fields: [authorId], references: [id])
}

// Many-to-Many
model Post {
  id    String @id @default(uuid())
  tags  Tag[]
}

model Tag {
  id    String @id @default(uuid())
  posts Post[]
}

// Explicit many-to-many
model _PostToTag {
  postId String
  tagId  String
  post  Post @relation(fields: [postId], references: [id])
  tag   Tag  @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])
}
```

---

## Client Setup

### Basic Setup

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### With Connection Pool

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  __internal: {
    useConfig: {
      cdc: false, // Disable CDC for better performance
    },
  },
  log: ['error'],
});

export default prisma;
```

---

## Queries

### Basic CRUD

```typescript
import prisma from '@/lib/prisma';

// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    role: 'USER',
  },
});

// Read
const users = await prisma.user.findMany({
  where: { role: 'ADMIN' },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0,
});

const user = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: { posts: true },
});

// Update
const updated = await prisma.user.update({
  where: { id: 'user-id' },
  data: { name: 'Jane Doe' },
});

// Delete
await prisma.user.delete({
  where: { id: 'user-id' },
});
```

### Advanced Queries

```typescript
// Select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// Filter with operators
const posts = await prisma.post.findMany({
  where: {
    AND: [
      { published: true },
      { createdAt: { gte: new Date('2024-01-01') } },
    ],
    OR: [
      { title: { contains: 'Prisma' } },
      { content: { contains: 'Prisma' } },
    ],
    author: {
      role: 'ADMIN',
    },
  },
});

// Count
const count = await prisma.user.count({
  where: { role: 'USER' },
});

// Aggregations
const stats = await prisma.user.aggregate({
  _count: { _all: true },
  _avg: { age: true },
  _sum: { posts: { _count: true } },
  where: { role: 'ADMIN' },
});
```

### Relations

```typescript
// Include relations
const user = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        _count: { select: { comments: true } },
      },
    },
  },
});

// Nested writes
await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John',
    posts: {
      create: {
        title: 'My First Post',
        content: 'Hello world!',
      },
    },
  },
});

// Connect/Disconnect relations
await prisma.user.update({
  where: { id: 'user-id' },
  data: {
    posts: {
      connect: [{ id: 'post-id' }],
      disconnect: [{ id: 'old-post-id' }],
    },
  },
});
```

---

## Transactions

```typescript
// Sequential transactions
const [user, post] = await prisma.$transaction([
  prisma.user.create({
    data: { email: 'user@example.com', name: 'John' },
  }),
  prisma.post.create({
    data: { title: 'First Post', authorId: '' }, // Will be updated
  }),
]);

// Interactive transactions
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'user@example.com', name: 'John' },
  });

  const post = await tx.post.create({
    data: { title: 'First Post', authorId: user.id },
  });

  return { user, post };
});

// With isolation level
await prisma.$transaction(async (tx) => {
  // ...
}, {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
});
```

---

## Pagination

```typescript
// Cursor-based (recommended for large datasets)
const posts = await prisma.post.findMany({
  take: 10,
  skip: 1,
  cursor: { id: lastPostId },
  orderBy: { createdAt: 'desc' },
});

// Offset-based
const posts = await prisma.post.findMany({
  take: 10,
  skip: (page - 1) * 10,
  orderBy: { createdAt: 'desc' },
});

// Infinite query pattern
const getMorePosts = async (cursor?: string) => {
  return prisma.post.findMany({
    take: 10,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
};
```

---

## Migrations

### Create Migration

```bash
# Create new migration
npx prisma migrate dev --name add_user_bio

# Deploy migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Status
npx prisma migrate status
```

### Migration Files

```sql
-- migrations/20240101000000_add_user_bio.sql

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "bio" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId")
      REFERENCES "User" (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
```

### Reset & Push

```bash
# Push schema (without migrations)
npx prisma db push

# Introspect existing database
npx prisma db pull

# Reset database
npx prisma migrate reset
```

---

## Best Practices

### 1. Use select over include when possible

```typescript
// ✅ Good - select only needed fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true },
});

// ❌ Avoid - fetch all fields including relations
const users = await prisma.user.findMany({
  include: { posts: true }, // If you don't need posts
});
```

### 2. Use cursor pagination for large datasets

```typescript
// ✅ Good - efficient for large tables
const posts = await prisma.post.findMany({
  take: 20,
  cursor: { id: lastId },
});

// ❌ Avoid - slow for large offsets
const posts = await prisma.post.findMany({
  take: 20,
  skip: 10000, // Gets slower with higher skip
});
```

### 3. Use transactions for related writes

```typescript
// ✅ Good - atomic operation
await prisma.$transaction([
  prisma.user.create({ data: { email, name } }),
  prisma.profile.create({ data: { userId, bio } }),
]);

// ❌ Avoid - partial writes possible
const user = await prisma.user.create({ data: { email, name } });
await prisma.profile.create({ data: { userId: user.id, bio } }); // Could fail!
```

---

## Common Patterns

### Soft Delete

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  deletedAt DateTime?

  @@index([deletedAt])
}
```

```typescript
// Query without deleted
const user = await prisma.user.findFirst({
  where: { id: userId, deletedAt: null },
});

// Delete (soft)
await prisma.user.update({
  where: { id: userId },
  data: { deletedAt: new Date() },
});
```

### UUID vs CUID

```prisma
// UUID - better for distributed systems
id String @id @default(uuid())

// CUID - shorter, auto-increment-like
id String @id @default(cuid())
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/postgresql-pro` | PostgreSQL patterns |
| `/database` | Database design |
| `/database-migration` | Migration strategies |

---

*Type-safe database access made easy!*
