---
name: railway
version: "1.0.0"
description: "Railway deployment patterns, Nixpacks, persistent disks, and database management."
when_to_use: "When deploying to Railway, using persistent databases, or configuring Railway environment variables."
priority: critical
phase: production
category: [deployment, backend]
tech_stack:
  frameworks: [nodejs, python, go, rust, docker]
  services: [railway]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: ["railway.json", ".railway/**"]
      reason: "Railway project detected"
    - pattern: ["railway deploy", "railway up", "railway.app"]
      reason: "Railway deployment"
capabilities:
  - nixpacks
  - persistent-storage
  - database-management
  - environment-config
author: TheVoidSyntax
---

# RAILWAY DEPLOYMENT v1.0 🚂

**Railway deployment patterns, Nixpacks, persistent disks, and database management**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  COMMON TASKS                                              │
├─────────────────────────────────────────────────────────────┤
│  railway login              → Authenticate                 │
│  railway init              → Initialize project           │
│  railway up               → Deploy current directory     │
│  railway status           → Check deployment status      │
│  railway logs             → View deployment logs        │
│  railway connect         → Connect to database          │
└─────────────────────────────────────────────────────────────┘
```

---

## railway.toml Configuration

```toml
[build]
builder = "NIXPACKS"
# Or use Docker
# builder = "DOCKERFILE"

[build.env]
NODE_VERSION = "20"
PYTHON_VERSION = "3.12"

[deploy]
region = "us-east"
numReplicas = 2
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[restartPolicy]
type = "ON_FAILURE"
maxRetries = 3

[[domains]]
host = "myapp.railway.app"
https = true

# Custom domain
[[domains]]
host = "api.example.com"
共存 = true
```

---

## Database Configuration

### PostgreSQL

```typescript
// Direct connection (for serverless-like patterns)
const DATABASE_URL = process.env.PGDATABASE_URL ||
  `postgresql://user:pass@host:5432/dbname`;

// With connection pool (recommended)
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Example: Prisma with Railway Postgres
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url      = env("DATABASE_URL")
}

// .env
DATABASE_URL="${{Postgres.DATABASE_URL}}"
```

### MySQL

```typescript
// mysql2 connection
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

### Redis

```typescript
// ioredis with Railway Redis
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});
```

---

## Environment Variables

### Railway Variables

```bash
# Built-in Railway variables
RAILWAY_SERVICE_NAME=my-service
RAILWAY_GIT_COMMIT_SHA=abc123
RAILWAY_PROJECT_ID=xxx
RAILWAY_ENVIRONMENT=production

# Database variables (auto-populated)
DATABASE_URL="${{Postgres.DATABASE_URL}}"
REDIS_URL="${{Redis.REDIS_URL}}"
MYSQL_URL="${{MySQL.MYSQL_URL}}"

# Custom variables
NODE_ENV=production
API_KEY="${{ secrets.API_KEY }}"
```

### .env.local for Development

```bash
# .env.local
# Copy from Railway Dashboard → Variables
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
```

### Referencing Variables

```bash
# In railway.toml
[build.env]
NODE_ENV=production

# In Railway Dashboard
# Variable: API_KEY
# Value: ${{ secrets.API_KEY }}

# Or reference other services
DATABASE_URL="${{Postgres.DATABASE_URL}}"
CACHE_URL="${{Redis.REDIS_URL}}"
```

---

## Nixpacks Configuration

Railway auto-detects and builds with Nixpacks, but you can customize:

### Python (Flask/FastAPI)

```python
# runtime.txt
python-3.12.0

# requirements.txt
flask==3.0.0
gunicorn==21.2.0
psycopg2-binary==2.9.9

# Procfile
web: gunicorn app:app --bind 0.0.0.0:$PORT
```

### Go

```go
// go.mod
module github.com/user/project

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/lib/pq v1.10.9
)

// Procfile
web: ./bin/server
```

### Node.js with Custom Build

```javascript
// package.json
{
  "scripts": {
    "build": "tsc && next build",
    "start": "node dist/server.js"
  }
}

// railway.toml
[build]
builder = "NIXPACKS"
nixpacksVersion = "latest"

[build.nixpacks]
plan = "nodejs-20"
```

---

## Docker Deployment

### Dockerfile

```dockerfile
# Use multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./

USER appuser
EXPOSE 8080

ENV PORT=8080
CMD ["node", "dist/server.js"]
```

### docker-compose.yml (for local dev)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:8080"
    environment:
      - DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
      - NODE_ENV=development
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## Persistent Storage

### Volume Configuration

```toml
# railway.toml
[deploy]
startCommand = "npm run migrate && npm start"

# Mount persistent volume
[[volumes]]
mountPath = "/data"
name = "uploads"

[[volumes]]
mountPath = "/logs"
name = "app-logs"
```

### Usage in Application

```typescript
import { mkdir, writeFile, readFile } from 'fs/promises';
import path from 'path';

// Railway provides persistent storage
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || '/data';

export async function saveFile(filename: string, content: Buffer) {
  await mkdir(DATA_DIR, { recursive: true });
  const filepath = path.join(DATA_DIR, filename);
  await writeFile(filepath, content);
  return filepath;
}

export async function readPersistentFile(filename: string) {
  const filepath = path.join(DATA_DIR, filename);
  return readFile(filepath);
}
```

---

## Health Checks

### HTTP Health Check

```typescript
import express from 'express';

const app = express();

// Railway health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Readiness check (includes dependencies)
app.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redis.ping();
    res.json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});

app.listen(process.env.PORT || 3000);
```

### Startup Script

```bash
#!/bin/bash
set -e

# Run migrations
echo "Running migrations..."
npm run migrate

# Start server
echo "Starting server..."
exec npm start
```

---

## Cron Jobs

### Railway Cron

```toml
# railway.toml
[deploy]
cronjob = true
cronSchedule = "0 * * * *"  # Every hour

# Or via dashboard:
# Project → Settings → Cron Jobs → Add Cron Job
```

### Implementation

```typescript
// routes/cron.ts
app.post('/cron', async (req, res) => {
  // Verify cron secret
  if (req.headers['x-cron-secret'] !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Run cleanup tasks
    await cleanupOldRecords();
    await generateReports();
    
    res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Deploy Commands

```bash
# Login
railway login

# Initialize project
railway init
railway link [project-id]

# Deploy
railway up                  # Deploy current directory
railway up --detach        # Deploy without watching
railway up --prod          # Deploy to production

# Logs
railway logs               # Stream logs
railway logs --deployment [id]  # Specific deployment

# Environment
railway variables         # List variables
railway variables set KEY=value
railway variables unset KEY
railway variables pull    # Pull to .env

# Database
railway connect            # Open DB shell
railway connect postgres   # PostgreSQL
railway connect redis     # Redis
```

---

## Common Issues & Solutions

### Build Failures

```bash
# Check build locally
railway build

# Debug
railway logs --deployment [id]
railway status
```

### Database Connection

```typescript
// ❌ Wrong - hardcoded values
const db = createPool({
  host: 'localhost',
  user: 'postgres',
  password: 'password'
});

// ✅ Correct - use Railway variables
const db = createPool({
  connectionString: process.env.DATABASE_URL
});
```

### Port Configuration

```typescript
// ❌ Wrong - hardcoded port
app.listen(3000);

// ✅ Correct - use Railway's port
app.listen(process.env.PORT || 3000);
```

---

## Best Practices

### 1. Use Connection Pools

```typescript
// For serverless-like patterns on Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});
```

### 2. Health Checks

```typescript
// Railway needs health checks for load balancing
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
```

### 3. Graceful Shutdown

```typescript
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});
```

---

## Metrics & Monitoring

```typescript
// Simple metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    requests: requestCount
  });
});
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/deployment` | General deployment |
| `/postgresql-pro` | PostgreSQL patterns |
| `/redis-pro` | Redis patterns |
| `/docker` | Docker deployment |

---

*Deploy databases, backends, and more!*
