---
name: drizzle
version: "1.0.0"
description: "Drizzle ORM patterns, schema design, and type-safe queries."
when_to_use: "When using Drizzle ORM for type-safe database queries."
priority: medium
phase: any
category: [database, backend]
tech_stack:
  databases: [postgresql, mysql, sqlite]
  orm: [drizzle]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: ["drizzle.config.ts", "drizzle.config.js"]
      reason: "Drizzle project detected"
    - pattern: ["drizzle-orm", "drizzle"]
      reason: "Drizzle usage detected"
capabilities:
  - schema-design
  - queries
  - migrations
author: TheVoidSyntax
---

# DRIZZLE ORM v1.0 🪴

**Drizzle ORM patterns, schema design, and type-safe queries**

---

## Schema Definition

```typescript
// db/schema.ts
import { pgTable, text, uuid, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['user', 'admin', 'moderator']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: roleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Posts table
export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').default(false).notNull(),
  authorId: uuid('author_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

## Queries

```typescript
import { db } from './db';
import { users, posts } from './schema';
import { eq, desc, and, or, like } from 'drizzle-orm';

// Select all
const allUsers = await db.select().from(users);

// Select with conditions
const user = await db.select().from(users).where(eq(users.email, 'test@example.com'));

// Insert
const [newUser] = await db.insert(users).values({
  email: 'new@example.com',
  name: 'New User',
}).returning();

// Update
const [updated] = await db.update(users)
  .set({ name: 'Updated Name' })
  .where(eq(users.id, userId))
  .returning();

// Delete
await db.delete(users).where(eq(users.id, userId));
```

## Relations

```typescript
// Select with relations
const userWithPosts = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    posts: {
      where: eq(posts.published, true),
      orderBy: desc(posts.createdAt),
    },
  },
});

// Join manually
const result = await db
  .select({
    user: users,
    post: posts,
  })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.authorId))
  .where(eq(posts.published, true));
```

## Transactions

```typescript
const result = await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values({
    email: 'transaction@example.com',
    name: 'Transaction User',
  });

  await tx.insert(posts).values({
    title: 'First Post',
    authorId: user.id,
  });

  return user;
});
```

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/postgresql-pro` | PostgreSQL patterns |
| `/database` | Database design |

---

*Type-safe SQL!*
