---
name: graphql
description: GraphQL API design, schema-first development, DataLoader pattern, and subscriptions
when_to_use: "Use when designing a GraphQL API: schema-first, DataLoader, or subscriptions."
version: "1.0.0"
category: [backend]
priority: medium
phase: phase-2
tech_stack:
  frameworks: [graphql, apollo]
  languages: [typescript, javascript]
scale: [small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - tech_stack: [graphql, apollo]
      reason: "GraphQL detected"
  skill_tier: optional
capabilities: [implementation, review, generation]
quality:
  rules_count: 10
  examples_count: 20
  stability: stable
integrates_with: [api-design]
dependencies: [api-design]
source:
  origin: local
author: thevoidsyntax
---

# GraphQL - API Design

## Schema Design

### Schema First Approach
```graphql
# schema.graphql

type Query {
  user(id: ID!): User
  users(filter: UserFilter, limit: Int, offset: Int): UserConnection!
  me: User
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
  deleteUser(id: ID!): DeleteUserPayload!
}

type Subscription {
  userCreated: User!
  userUpdated(id: ID!): User!
}

type User {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  createdAt: DateTime!
  updatedAt: DateTime!
  posts: PostConnection!
  followers: UserConnection!
  following: UserConnection!
}

enum UserRole {
  ADMIN
  USER
  GUEST
}

input UserFilter {
  role: UserRole
  search: String
  createdAfter: DateTime
  createdBefore: DateTime
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

scalar DateTime
scalar JSON
```

### Input Types
```graphql
input CreateUserInput {
  email: String!
  name: String!
  password: String!
  role: UserRole = USER
}

input UpdateUserInput {
  email: String
  name: String
}

input OrderByInput {
  field: String!
  direction: SortDirection = ASC
}

enum SortDirection {
  ASC
  DESC
}
```

## TypeScript Schema

### Using graphql-tools
```typescript
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createSchema } from 'graphql-api-typed';

const typeDefs = `
  type Query {
    user(id: ID!): User
    users(filter: UserFilter, limit: Int = 10, offset: Int = 0): UserConnection!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    posts: [Post!]!
  }

  input UserFilter {
    role: UserRole
    search: String
  }

  enum UserRole {
    ADMIN
    USER
  }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      user: async (_, { id }, { loaders }) => {
        return loaders.user.load(id);
      },
      users: async (_, { filter, limit, offset }) => {
        return userService.findAll({ filter, limit, offset });
      },
    },
  },
});
```

## Resolvers

### Basic Resolver Pattern
```typescript
const resolvers = {
  Query: {
    user: async (_parent, { id }, context) => {
      return context.userService.findById(id);
    },
  },

  User: {
    id: (user) => user.id,
    email: (user) => user.email.toLowerCase(), // Transform data
    posts: async (user, { limit = 10 }, context) => {
      return context.postService.findByUserId(user.id, { limit });
    },
    followers: async (user, args, context) => {
      // DataLoader batches this automatically
      return context.loaders.userFollowers.load(user.id);
    },
  },

  Mutation: {
    createUser: async (_, { input }, context) => {
      const user = await context.userService.create(input);
      return { user };
    },
  },
};
```

### Context with Loaders
```typescript
import DataLoader from 'dataloader';

interface Context {
  loaders: {
    user: DataLoader<string, User>;
    post: DataLoader<string, Post>;
    userFollowers: DataLoader<string, User[]>;
    userFollowing: DataLoader<string, User[]>;
    postComments: DataLoader<string, Comment[]>;
  };
  userService: UserService;
  postService: PostService;
}

function createContext(request: Request): Context {
  return {
    loaders: {
      user: new DataLoader(async (ids) => {
        const users = await userService.findByIds(ids);
        return ids.map((id) => users.find((u) => u.id === id));
      }),

      userFollowers: new DataLoader(async (userIds) => {
        const followers = await followService.getFollowersForUsers(userIds);
        return userIds.map((id) => followers[id] || []);
      }),

      userFollowing: new DataLoader(async (userIds) => {
        const following = await followService.getFollowingForUsers(userIds);
        return userIds.map((id) => following[id] || []);
      }),

      postComments: new DataLoader(async (postIds) => {
        const comments = await commentService.getCommentsForPosts(postIds);
        return postIds.map((id) => comments[id] || []);
      }),
    },
    userService,
    postService,
  };
}
```

## DataLoader Pattern

### Why DataLoader?
```
Without DataLoader (N+1 problem):
┌─────────────────────────────────────┐
│ Query users                         │
│   └─ For each user:                 │
│       └─ Query posts               │
│           └─ For each post:        │
│               └─ Query author      │
└─────────────────────────────────────┘
= 1 + N + N*M queries

With DataLoader (batching):
┌─────────────────────────────────────┐
│ Query users                         │
│ Query all posts for user IDs        │
│ Query all authors for post IDs       │
└─────────────────────────────────────┘
= 3 queries
```

### Implementation
```typescript
import DataLoader from 'dataloader';

// Batch function
async function batchGetUsers(ids: readonly string[]): Promise<User[]> {
  const users = await db.users.findMany({
    where: { id: { in: ids } },
  });

  // Return in same order as input
  return ids.map((id) => users.find((u) => u.id === id) || null);
}

// Create loader
const userLoader = new DataLoader(batchGetUsers);

// Use in resolver (automatically batches)
const user = await userLoader.load('user-123');

// Using cache
const user = await userLoader.load('user-123'); // From cache!

// Clear cache when data changes
userLoader.clear('user-123');
userLoader.clearAll();
```

## Validation

### Input Validation
```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(100),
});

const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);

async function createUser(_, { input }) {
  const result = CreateUserSchema.safeParse(input);

  if (!result.success) {
    throw new UserInputError('Invalid input', {
      extensions: {
        code: 'INVALID_INPUT',
        errors: result.error.flatten(),
      },
    });
  }

  return userService.create(result.data);
}
```

## Error Handling

### Custom Errors
```typescript
class GraphQLError extends Error {
  constructor(
    message: string,
    extensions?: {
      code: string;
      http?: { statusCode: number };
      errors?: Record<string, unknown>;
    }
  ) {
    super(message);
    this.extensions = extensions;
  }

  extensions?: {
    code: string;
    http?: { statusCode: number };
    errors?: Record<string, unknown>;
  };
}

class NotFoundError extends GraphQLError {
  constructor(resource: string, id: string) {
    super(`${resource} not found`, {
      code: 'NOT_FOUND',
      http: { statusCode: 404 },
    });
  }
}

class ForbiddenError extends GraphQLError {
  constructor(message = 'Access denied') {
    super(message, {
      code: 'FORBIDDEN',
      http: { statusCode: 403 },
    });
  }
}

class UserInputError extends GraphQLError {
  constructor(message: string, extensions?: Record<string, unknown>) {
    super(message, {
      code: 'INVALID_INPUT',
      http: { statusCode: 400 },
      ...extensions,
    });
  }
}
```

### Error Resolver
```typescript
const errorHandler = (error: unknown) => {
  if (error instanceof GraphQLError) {
    return {
      message: error.message,
      ...error.extensions,
    };
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  return {
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
    http: { statusCode: 500 },
  };
};

const apolloServer = new ApolloServer({
  schema,
  formatError: errorHandler,
});
```

## Subscriptions

### PubSub
```typescript
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

// Define events
const USER_CREATED = 'USER_CREATED';
const USER_UPDATED = 'USER_UPDATED';

// Subscription resolver
const resolvers = {
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([USER_CREATED]),
    },
    userUpdated: {
      subscribe: (_, { id }) => {
        return pubsub.asyncIterator(`USER_UPDATED_${id}`);
      },
    },
  },
};

// Trigger in mutation
async function createUser(_, { input }, context) {
  const user = await userService.create(input);

  pubsub.publish(USER_CREATED, { userCreated: user });

  return { user };
}
```

### Redis PubSub (Production)
```typescript
import { RedisPubSub } from 'graphql-redis-subscriptions';

const pubsub = new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// For multi-instance deployments
const subscriptionManager = pubsub;
```

## Performance

### Query Cost Analysis
```typescript
const COST_MAP = {
  Query: {
    user: 1,
    users: 2, // Pagination
    post: 1,
    posts: 3,
  },
  User: {
    posts: 5, // Nested query
    followers: 3,
    following: 3,
  },
};

function calculateCost(ast: DocumentNode): number {
  let cost = 0;

  visit(ast, {
    Field(node) {
      const fieldCost = getFieldCost(node.name.value, node);
      cost += fieldCost;

      // Add depth multiplier
      cost += fieldCost * getDepth(node);
    },
  });

  return cost;
}

const MAX_COST = 1000;

async function costLimitMiddleware(req, res, next) {
  const cost = calculateCost(parse(req.body.query));

  if (cost > MAX_COST) {
    throw new GraphQLError('Query too expensive', {
      code: 'QUERY_TOO_COSTLY',
      extensions: { cost, maxCost: MAX_COST },
    });
  }

  next();
}
```

### Persisted Queries
```typescript
// Register query hash
app.post('/graphql/query/:id', async (req, res) => {
  const { id } = req.params;
  const query = await redis.get(`query:${id}`);

  if (!query) {
    return res.status(404).json({ error: 'Query not found' });
  }

  // Execute query
  const result = await graphql({
    schema,
    source: query,
    variableValues: req.body.variables,
  });

  res.json(result);
});

// Generate hash
import { createHash } from 'crypto';

function hashQuery(query: string): string {
  return createHash('sha256').update(query).digest('hex');
}
```

## Security

### Query Depth Limiting
```typescript
import { createHandler } from 'graphql-depth-limit';

const depthLimit = createDepthLimit({
  maxDepth: 10,
  depthCost: {
    // Custom cost per depth level
    0: 0,
    1: 1,
    2: 2,
    3: 4,
    4: 8,
  },
});

const server = new ApolloServer({
  schema,
  validationRules: [depthLimit],
});
```

### Field Authorization
```typescript
function authorizeField(parent, args, context) {
  const user = context.user;

  if (!user) {
    throw new ForbiddenError('Authentication required');
  }

  return true;
}

const resolvers = {
  User: {
    email: authorizeField,
    role: authorizeField,
    // Public fields don't need authorization
    id: (user) => user.id,
    name: (user) => user.name,
  },
};
```

## Federation (Microservices)

### Schema Stitching
```typescript
import { stitchSchemas } from '@graphql-tools/stitch';
import { makeExecutableSchema } from '@graphql-tools/schema';

const usersSchema = makeExecutableSchema({ typeDefs: usersTypeDefs, resolvers: usersResolvers });
const ordersSchema = makeExecutableSchema({ typeDefs: ordersTypeDefs, resolvers: ordersResolvers });

const federatedSchema = stitchSchemas({
  subschemas: [
    { schema: usersSchema, batch: true },
    { schema: ordersSchema, batch: true },
  ],
  typeDefs: `
    extend type User {
      orders: [Order!]!
    }
  `,
  resolvers: {
    User: {
      orders: {
        selectionSet: `{ id }`,
        resolve(user, _, context) {
          return context.orderService.findByUserId(user.id);
        },
      },
    },
  },
});
```

---

**Invoke:** `/graphql` | **Priority:** LOW
