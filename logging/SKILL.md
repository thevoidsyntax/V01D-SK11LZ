---
name: logging
description: Structured logging best practices, log management, and observability patterns
version: "1.0.0"
category: [infrastructure, data]
priority: medium
phase: any
tech_stack:
  languages: [typescript, nodejs, python, go]
scale: [mvp, small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - always: true
      reason: "Core observability skill"
  skill_tier: core
capabilities: [implementation, analysis]
quality:
  rules_count: 8
  examples_count: 20
  stability: stable
integrates_with: [auto-router, observability, reliability]
source:
  origin: local
author: thevoidsyntax
---

# Logging - Structured Log Best Practices

## Structured Logging Format

### JSON Structure
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "User logged in",
  "service": "auth-service",
  "version": "1.2.3",
  "trace_id": "abc123",
  "user_id": "user-456",
  "ip_address": "192.168.1.1",
  "duration_ms": 45,
  "metadata": {
    "browser": "Chrome 120",
    "os": "macOS 14"
  }
}
```

### Log Levels Usage

| Level | When to Use | Example |
|-------|-------------|---------|
| **DEBUG** | Detailed debugging info | "Entering function X with params Y" |
| **INFO** | Normal operations | "User logged in", "Order created" |
| **WARN** | Unexpected but handled | "Retry succeeded after 2 attempts" |
| **ERROR** | Operation failed | "Database connection failed" |
| **FATAL** | Critical, app crashing | "Out of memory", "Cannot recover" |

### Level Guidelines
```
DEBUG → Never in production
INFO  → Business events only
WARN  → Recoverable issues
ERROR → Failures that need attention
FATAL → Wake someone up
```

## Best Practices

### DO: Log This
```typescript
// ✅ Structured data
logger.info('Order created', {
  orderId: order.id,
  customerId: customer.id,
  total: order.total,
  itemCount: order.items.length
});

// ✅ User actions
logger.info('User performed action', {
  userId: user.id,
  action: 'export_data',
  resourceType: 'report',
  resourceId: report.id
});

// ✅ Performance metrics
logger.info('Request completed', {
  method: 'POST',
  path: '/api/orders',
  statusCode: 201,
  duration: performance.now(),
  userId: req.user.id
});

// ✅ Business milestones
logger.info('Subscription upgraded', {
  userId: user.id,
  oldPlan: 'basic',
  newPlan: 'premium',
  effectiveDate: new Date().toISOString()
});
```

### DON'T: Log This
```typescript
// ❌ Don't log secrets
logger.info('Authenticating', { password: credentials.password });

// ❌ Don't log PII unnecessarily
logger.info('User data', { ssn: '123-45-6789' });

// ❌ Don't log debug in hot paths
logger.debug('Entering loop', { iteration: i });

// ❌ Don't log every object property
logger.info('User', user); // What if user has password field?

// ❌ Don't log stack traces for expected errors
```

## Middleware Example

### Express.js Request Logging
```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const traceId = req.headers['x-trace-id'] as string || generateTraceId();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    logger.info('HTTP Request', {
      trace_id: traceId,
      method: req.method,
      path: req.path,
      status_code: res.statusCode,
      duration_ms: duration,
      user_agent: req.headers['user-agent'],
      ip: req.ip,
      user_id: (req as any).user?.id,
    });
  });

  next();
}
```

### Error Logging Middleware
```typescript
export function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('Unhandled error', {
    trace_id: req.headers['x-trace-id'],
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    request: {
      method: req.method,
      path: req.path,
      body: sanitizeBody(req.body),
      params: req.params,
    },
    user_id: (req as any).user?.id,
  });

  next(err);
}
```

## Log Correlation

### Trace ID Propagation
```typescript
// Middleware to extract/create trace ID
app.use((req, res, next) => {
  req.traceId = req.headers['x-trace-id'] as string || uuid();
  res.setHeader('x-trace-id', req.traceId);
  next();
});

// Use in logger throughout request
app.get('/api/users/:id', async (req, res) => {
  const user = await getUser(req.params.id);

  logger.info('User retrieved', {
    trace_id: req.traceId,
    user_id: user.id,
  });

  res.json(user);
});
```

### Correlation in Async Code
```typescript
// Store trace ID in context
const AsyncLocalStorage = require('async_hooks').AsyncLocalStorage;
const traceStorage = new AsyncLocalStorage<string>();

// Set trace ID for request
app.use((req, res, next) => {
  traceStorage.enterWith(req.traceId);
  next();
});

// Use anywhere in async call chain
async function getUserOrders(userId: string) {
  const traceId = traceStorage.getStore();
  
  logger.info('Fetching orders', {
    trace_id: traceId,
    user_id: userId,
  });
}
```

## Sanitization

### Body Sanitization
```typescript
const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'apiKey', 'creditCard'];

function sanitizeBody(body: any): any {
  if (!body) return body;

  const sanitized = { ...body };

  for (const field of SENSITIVE_FIELDS) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

// Or use more sophisticated approach
function sanitizeObject(obj: any, depth = 0): any {
  if (depth > 10) return '[TRUNCATED]';
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized: any = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.some(f => key.toLowerCase().includes(f))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
```

## Log Shipping

### File Beat / Fluentd Config
```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/myapp/*.log
    json.keys_under_root: true
    json.add_error_key: true

output.elasticsearch:
  hosts: ['elasticsearch:9200']
  index: 'myapp-%{+yyyy.MM.dd}'

# Or to Logstash
output.logstash:
  hosts: ['logstash:5044']
```

### CloudWatch / Cloud Logging
```typescript
// For AWS CloudWatch
import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.CloudWatchTransport({
      logGroupName: '/myapp/production',
      logStreamName: `${process.env.INSTANCE_ID}-${Date.now()}`,
      awsRegion: 'us-east-1',
    })
  ]
});
```

## Log Retention

### Retention Policies
```
┌─────────────────────────────────────────────────────────┐
│  RETENTION POLICY                                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Hot (SSD)    │  7 days    │  Debug, Info             │
│  Warm (HDD)   │  30 days   │  Info, Warn              │
│  Cold (S3)    │  90 days   │  Error, Fatal            │
│  Archive       │  1 year    │  Compliance, Audit        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Performance Tips

### Async Logging
```typescript
// Use async transport
logger.add(new transports.File({
  filename: 'app.log',
  maxsize: 10000000, // 10MB
  maxFiles: 5,
  silent: process.env.NODE_ENV === 'test'
}));

// Or buffer logs
logger.add(new transports.File({
  filename: 'app.log',
  bufferLogSize: 1000, // Flush every 1000 logs
  maxBufferAge: 5000   // Or every 5 seconds
}));
```

### Sampling for High Volume
```typescript
// Sample 1% of debug logs
const shouldLogDebug = Math.random() < 0.01;

if (shouldLogDebug) {
  logger.debug('Processing item', { itemId });
}

// Or sample per request type
function shouldSample(requestType: string): boolean {
  const rates = {
    'health_check': 0.01,
    'api_call': 0.1,
    'export': 1.0,
  };
  return Math.random() < (rates[requestType] || 0.1);
}
```

## Log Analysis Queries

### Elasticsearch / Kibana
```
# Error rate over time
POST /logs-*/_search
{
  "size": 0,
  "aggs": {
    "errors_over_time": {
      "date_histogram": {
        "field": "timestamp",
        "interval": "5m"
      },
      "aggs": {
        "errors": {
          "filter": { "term": { "level": "error" } }
        }
      }
    }
  }
}

# Slow requests
POST /logs-*/_search
{
  "query": {
    "range": {
      "duration_ms": { "gt": 1000 }
    }
  },
  "sort": [{ "duration_ms": "desc" }],
  "size": 10
}
```

---

**Invoke:** `/logging` | **Priority:** MEDIUM
