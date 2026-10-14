---
name: flyio
version: "1.0.0"
description: "Fly.io deployment patterns, edge networking, and distributed application deployment."
when_to_use: "When deploying to Fly.io, configuring edge regions, or setting up distributed applications."
priority: medium
phase: production
category: [deployment, backend]
tech_stack:
  frameworks: [nodejs, python, go, rust, docker]
  services: [flyio]
scale: [medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: ["fly.toml", ".fly/**"]
      reason: "Fly.io project detected"
    - pattern: ["fly launch", "fly deploy", "fly.io"]
      reason: "Fly.io deployment"
capabilities:
  - edge-networking
  - distributed-deploy
  - volume-storage
author: TheVoidSyntax
---

# FLY.IO DEPLOYMENT v1.0 🚁

**Fly.io deployment patterns, edge networking, and distributed application deployment**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  COMMON TASKS                                              │
├─────────────────────────────────────────────────────────────┤
│  fly launch             → Create app                     │
│  fly deploy            → Deploy application              │
│  fly status           → Check deployment status        │
│  fly logs             → View application logs          │
│  fly ssh console       → SSH into instance             │
│  fly scale count       → Scale instances              │
└─────────────────────────────────────────────────────────────┘
```

---

## fly.toml Configuration

```toml
app = "my-app"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1

[metrics]
  port = 9090
  path = "/metrics"

[[services]]
  internal_port = 8080

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.checks]]
    path = "/health"
    interval = "10s"
    timeout = "2s"
```

---

## Multi-Region Setup

```toml
# fly.toml with multiple regions
app = "my-app-global"

[build]
  dockerfile = "Dockerfile"

# Primary region (US East)
[regions]
  primary = "iad"

# Additional regions
[[regions]]
  name = "lax"  # Los Angeles
  weight = 50

[[regions]]
  name = "gru"  # São Paulo
  weight = 30

[[regions]]
  name = "sin"  # Singapore
  weight = 20

[http_service]
  # Enable anycast for global distribution
  force_https = true
  min_machines_running = 1
```

---

## Volume Management

```toml
# fly.toml with persistent volume
app = "my-app"

[build]
  dockerfile = "Dockerfile"

# Persistent volume
[[mounts]]
  source = "uploads"
  destination = "/app/uploads"

[[vm]]
  memory = "512mb"
```

### Flyctl Commands

```bash
# Create volume
fly volumes create uploads --size 10 --region iad

# List volumes
fly volumes list

# Scale with volumes
fly scale count 2 -r iad
fly volumes create data --size 50 --region iad
```

---

## Health Checks

```toml
[http_service]
  internal_port = 8080
  force_https = true

  [[services.checks]]
    path = "/health"
    interval = "10s"
    timeout = "2s"
    grace_period = "5s"
    method = "GET"
    protocol = "http"
    restart_limit = 3

  [[services.checks]]
    path = "/readiness"
    interval = "30s"
    timeout = "5s"
    protocol = "http"
```

---

## Environment Variables

### Secrets Management

```bash
# Set secrets
fly secrets set DATABASE_URL="postgres://..."
fly secrets set API_KEY="xxx"
fly secrets set NODE_ENV="production"

# List secrets (names only)
fly secrets list

# Remove secret
fly secrets unset OLD_KEY

# Import from .env file
fly secrets import < .env.production
```

### In Application

```typescript
// All secrets are available as environment variables
const db = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

// Or use dotenv in development
import dotenv from 'dotenv';
dotenv.config();
```

---

## Distributed Postgres

```toml
# fly.toml for Postgres app
app = "my-db"

[build]
  dockerfile = "Dockerfile"

[env]
  POSTGRES_USER = "postgres"
  POSTGRES_PASSWORD = "$PASSWORD"
  POSTGRES_DB = "myapp"

[mounts]
  source = "pg_data"
  destination = "/var/lib/postgresql/data"

[[vm]]
  memory = "1gb"
  cpu_kind = "shared"
  cpus = 1

# Enable high availability
[ha]
  enabled = true
  replicas = 2
```

### Connect from App

```bash
# Get connection string
fly postgres connect -a my-db

# Create database
psql $DATABASE_URL -c "CREATE DATABASE myapp;"

# App connection
fly secrets set DATABASE_URL="postgres://postgres:password@my-db.internal:5432/myapp"
```

---

## SSL/TLS

```toml
# Automatic HTTPS with Let's Encrypt
[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  min_machines_running = 1

# Custom certificate
[tls]
  enabled = true
  cert_domain = "api.example.com"
  cert_hostnames = ["api.example.com", "*.api.example.com"]
```

---

## Scaling

```bash
# Scale to specific count
fly scale count 3

# Scale in specific region
fly scale count 2 -r iad

# Scale with memory
fly scale vm memory=512mb

# Show current scale
fly scale show

# Autoscaling (with autoscale command)
fly autoscale balanced
fly autoscale load
```

---

## Deploy Commands

```bash
# Launch new app
fly launch --no-deploy

# Deploy
fly deploy
fly deploy --image your-image:tag

# Watch deployment
fly deploy --watch

# Specific region
fly deploy --region iad

# With secrets
fly deploy --build-secret API_KEY=value
```

---

## Logs & Debugging

```bash
# Stream logs
fly logs

# Get logs with tail
fly logs --app my-app

# Specific instance
fly logs --instance iad-xxxxx

# SSH into machine
fly ssh console
fly ssh console --select

# Open shell in container
fly ssh issue --agent
ssh root@vmename
```

---

## Best Practices

### 1. Use Health Checks

```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/readiness', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    await redis.ping();
    res.json({ ready: true });
  } catch {
    res.status(503).json({ ready: false });
  }
});
```

### 2. Graceful Shutdown

```typescript
const server = app.listen(PORT);

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

### 3. Region-Aware

```typescript
// Get current region
const region = process.env.FLY_REGION || 'unknown';

// Use region for routing
const nearbyDb = region === 'iad' 
  ? 'postgres://primary.internal' 
  : 'postgres://replica.internal';
```

---

## Common Issues

### Build Failures

```bash
# Debug build
fly deploy --remote-only --verbose

# Check logs
fly logs --app my-app
```

### Database Connection

```typescript
// Use internal hostname for Fly-to-Fly
const dbUrl = process.env.DATABASE_URL || 
  `postgres://user:pass@my-db.internal:5432/dbname`;
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/deployment` | General deployment |
| `/docker` | Docker deployment |
| `/railway` | Alternative deployment |
| `/postgresql-pro` | PostgreSQL patterns |

---

*Deploy apps close to your users!*
