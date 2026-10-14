---
name: redis-pro
description: "Redis caching strategies, pub/sub patterns, session management, and distributed locking."
version: "1.0.0"
category: [data, backend]
priority: high
phase: any
tech_stack:
  databases: [redis]
  languages: [typescript, javascript, python, go]
scale: [medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/redis*"
      reason: "Redis connection detected"
    - has_file: "**/ioredis*"
      reason: "ioredis detected"
    - has_file: "**/node-redis*"
      reason: "node-redis detected"
    - tech_stack: [redis]
      reason: "Redis detected"
  skill_tier: context
triggers:
  phrases:
    - "redis"
    - "cache"
    - "caching"
    - "session"
    - "pub/sub"
    - "rate limit"
capabilities: [implementation, optimization]
dependencies: [database, scalability]
integrates_with: [database, scalability, observability]
---

# REDIS-PRO v1.0

Redis specialist for caching, session management, pub/sub, and distributed systems patterns.

## Tech Stack

| Component | Technologies |
|-----------|-------------|
| Clients | ioredis, node-redis (Node.js), redis-py (Python), go-redis (Go) |
| Patterns | Cache-aside, Write-through, Write-behind |
| Data Types | Strings, Hashes, Lists, Sets, Sorted Sets, Streams |

## Caching Patterns

### 1. Cache-Aside (Lazy Loading)

```typescript
// Most common pattern
async function getUser(id: string): Promise<User> {
  // 1. Check cache first
  const cached = await redis.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Cache miss - get from DB
  const user = await db.users.findById(id);
  if (!user) return null;

  // 3. Store in cache with TTL
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));

  return user;
}

// Cache invalidation
async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const user = await db.users.update(id, data);
  // Invalidate cache
  await redis.del(`user:${id}`);
  return user;
}
```

### 2. Write-Through Cache

```typescript
// Write to both cache and DB atomically
async function createUser(data: CreateUserInput): Promise<User> {
  const user = await db.users.create(data);

  // Write-through to cache
  await redis.setex(
    `user:${user.id}`,
    3600,
    JSON.stringify(user)
  );

  return user;
}
```

### 3. Write-Behind (Async)

```typescript
// Queue writes for async processing
async function recordEvent(event: Event): Promise<void> {
  // Immediate acknowledgment
  await queue.push(event);

  // Async worker processes
  // - Batches writes to DB
  // - Updates cache periodically
}
```

## Data Structures

### 1. Strings

```typescript
// Basic operations
await redis.set("key", "value");
await redis.get("key");
await redis.setex("key", 3600, "value"); // With TTL

// Atomic counters
await redis.incr("pageviews");
await redis.incrby("pageviews", 10);

// Bit operations
await redis.setbit("online_users", userId, 1);
const online = await redis.getbit("online_users", userId);
```

### 2. Hashes

```typescript
// User profile
await redis.hset("user:123", {
  name: "John",
  email: "john@example.com",
  createdAt: Date.now().toString()
});

const user = await redis.hgetall("user:123");
await redis.hincrby("user:123", "loginCount", 1);

// Check field exists
const exists = await redis.hexists("user:123", "email");
```

### 3. Lists

```typescript
// Recent activity feed (LPUSH + LRANGE)
await redis.lpush("feed:user:123", JSON.stringify(activity));
await redis.lrange("feed:user:123", 0, 9); // Get 10 items

// Job queue
await redis.rpush("job:queue", JSON.stringify(job));
const job = await redis.lpop("job:queue");

// BLPOP for blocking (waits for item)
const [_, item] = await redis.blpop("job:queue", 0);
```

### 4. Sets

```typescript
// Tag tracking
await redis.sadd("tags:javascript", "post:1", "post:2", "post:3");
const posts = await redis.smembers("tags:javascript");

// Set operations
await redis.sinter("tags:javascript", "tags:typescript"); // Intersection
await redis.sunion("tags:js", "tags:ts"); // Union
await redis.sdiff("tags:all", "tags:spam"); // Difference

// Count unique visitors
await redis.sadd("visitors:daily:2024-01-15", visitorId);
const uniqueVisitors = await redis.scard("visitors:daily:2024-01-15");
```

### 5. Sorted Sets

```typescript
// Leaderboard
await redis.zadd("leaderboard", { score: 1000, value: "user:1" });
await redis.zadd("leaderboard", { score: 950, value: "user:2" });

// Get top 10
const topPlayers = await redis.zrevrange("leaderboard", 0, 9, { WITHSCORES: true });

// User rank
const rank = await redis.zrevrank("leaderboard", "user:1"); // 0-indexed

// Score increment
await redis.zincrby("leaderboard", 50, "user:1");
```

### 6. Streams (Event Sourcing)

```typescript
// Add event to stream
await redis.xadd("events", "*", {
  type: "user.created",
  userId: "123",
  email: "john@example.com"
});

// Consumer group for distributed processing
await redis.xgroup("CREATE", "events", "processors", "0");

// Read new events
const events = await redis.xreadgroup(
  "GROUP", "processors", "consumer-1",
  "COUNT", "10",
  "STREAMS", "events", ">"
);
```

## Rate Limiting

### Token Bucket

```typescript
interface RateLimiter {
  check(key: string, tokens: number): Promise<boolean>;
}

async function tokenBucket(
  redis: Redis,
  key: string,
  maxTokens: number,
  refillRate: number // tokens per second
): Promise<boolean> {
  const bucketKey = `ratelimit:${key}`;
  const now = Date.now();

  const [, tokens, lastRefill] = await redis.pipeline()
    .get(bucketKey + ":tokens")
    .get(bucketKey + ":lastRefill")
    .exec();

  const currentTokens = tokens ? parseInt(tokens) : maxTokens;
  const lastTime = lastRefill ? parseInt(lastRefill) : now;

  const elapsed = (now - lastTime) / 1000;
  const refilledTokens = Math.floor(elapsed * refillRate);
  const newTokens = Math.min(maxTokens, currentTokens + refilledTokens);

  if (newTokens >= 1) {
    await redis.pipeline()
      .set(bucketKey + ":tokens", newTokens - 1)
      .set(bucketKey + ":lastRefill", now)
      .exec();
    return true;
  }

  return false;
}
```

### Sliding Window

```typescript
async function slidingWindow(
  redis: Redis,
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - windowMs;
  const windowKey = `ratelimit:window:${key}`;

  // Remove old entries
  await redis.zremrangebyscore(windowKey, 0, windowStart);

  // Count current requests
  const count = await redis.zcard(windowKey);

  if (count >= limit) {
    return false; // Rate limited
  }

  // Add current request
  await redis.zadd(windowKey, now, `${now}:${Math.random()}`);
  await redis.pexpire(windowKey, windowMs);

  return true;
}
```

## Pub/Sub

### 1. Basic Pub/Sub

```typescript
// Publisher
await redis.publish("notifications", JSON.stringify({
  type: "user.created",
  userId: "123"
}));

// Subscriber
const subscriber = redis.duplicate();
await subscriber.subscribe("notifications");
subscriber.on("message", (channel, message) => {
  const notification = JSON.parse(message);
  console.log("Received:", notification);
});
```

### 2. Pattern Subscribe

```typescript
// Subscribe to multiple channels
await subscriber.psubscribe("notifications:*");

subscriber.on("pmessage", (pattern, channel, message) => {
  // pattern = "notifications:*"
  // channel = "notifications:user.created"
});
```

## Distributed Locks

### Redlock Pattern

```typescript
async function acquireLock(
  redis: Redis,
  resource: string,
  ttlMs: number = 10000
): Promise<string | null> {
  const lockKey = `lock:${resource}`;
  const lockValue = `${process.pid}:${Date.now()}:${Math.random()}`;

  // SET NX with expiration (atomic)
  const acquired = await redis.set(lockKey, lockValue, {
    NX: true,
    PX: ttlMs
  });

  return acquired ? lockValue : null;
}

async function releaseLock(
  redis: Redis,
  resource: string,
  lockValue: string
): Promise<void> {
  const lockKey = `lock:${resource}`;

  // Lua script for atomic check-and-delete
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  await redis.eval(script, {
    keys: [lockKey],
    arguments: [lockValue]
  });
}
```

### Using Locks

```typescript
async function processWithLock(
  resourceId: string,
  fn: () => Promise<void>
): Promise<void> {
  const lock = await acquireLock(resourceId, 30000);
  if (!lock) {
    throw new Error("Could not acquire lock");
  }

  try {
    await fn();
  } finally {
    await releaseLock(resourceId, lock);
  }
}
```

## Session Management

```typescript
interface Session {
  userId: string;
  email: string;
  roles: string[];
  createdAt: number;
}

async function createSession(
  redis: Redis,
  userId: string,
  data: Session,
  ttlSeconds: number = 86400
): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const sessionKey = `session:${sessionId}`;

  await redis.hset(sessionKey, {
    ...data,
    userId,
    createdAt: Date.now().toString()
  });
  await redis.expire(sessionKey, ttlSeconds);

  return sessionId;
}

async function getSession(
  redis: Redis,
  sessionId: string
): Promise<Session | null> {
  const sessionKey = `session:${sessionId}`;
  const data = await redis.hgetall(sessionKey);

  if (!data || !data.userId) {
    return null;
  }

  // Refresh TTL on access
  await redis.expire(sessionKey, 86400);

  return data as Session;
}

async function destroySession(
  redis: Redis,
  sessionId: string
): Promise<void> {
  await redis.del(`session:${sessionId}`);
}
```

## Best Practices

1. **Use connection pooling** - Single connection blocks on blocking commands
2. **Set appropriate TTLs** - Don't cache forever without reason
3. **Use connection events** - Handle reconnections gracefully
4. **Pipeline commands** - Batch operations for performance
5. **Monitor memory** - Use `INFO` to track used_memory
6. **Use Redis Streams** - Better than lists for event sourcing
7. **Avoid KEYS command** - Use SCAN in production
8. **Set volatile TTLs** - Let Redis auto-expire when memory pressure

---

*Author: TheVoidSyntax*
