---
name: observability
description: Full-stack observability standards including logging, tracing, metrics, and monitoring patterns
version: "1.1.0"
category: [infrastructure, data]
priority: high
phase: any
tech_stack:
  languages: [typescript, javascript, python, go, java]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/tracing/**"
      reason: "Tracing detected"
    - phase: phase-4
      reason: "Monitoring phase"
  skill_tier: context
triggers:
  phrases:
    - "monitor"
    - "monitoring"
    - "metrics"
    - "prometheus"
    - "grafana"
    - "dashboard"
    - "alert"
    - "trace"
    - "tracing"
    - "opentelemetry"
    - "jaeger"
    - "zipkin"
    - "log"
    - "logging"
    - "pino"
    - "winston"
    - "structured log"
    - "observability"
    - "slo"
    - "sla"
capabilities: [implementation, analysis]
quality:
  rules_count: 18
  examples_count: 25
  stability: stable
integrates_with: [logging, reliability, scalability]
dependencies: [devops-engineer, diagnosing-bugs]
source:
  origin: merged
  sources: ["Jeffallan/claude-skills:monitoring-expert"]
author: Claude
---

# OBSERVABILITY MODULE

Kamu adalah Observability Specialist. Gunakan rules ini untuk setiap aspek observability dalam proyek.

---

## 1. THE THREE PILLARS

### Logging
- **Structured Logging:** Selalu gunakan JSON format untuk log yang machine-readable
- **Log Levels:** ERROR, WARN, INFO, DEBUG, TRACE - gunakan dengan tepat
- **Correlation:** Setiap request harus punya correlation ID yang propagates ke semua service
- **Context:** Include request ID, user ID, trace ID di setiap log entry

### Metrics
- **RED Metrics:**
  - **Rate:** Request per second
  - **Errors:** Error rate percentage
  - **Duration:** Latency (p50, p95, p99)
- **USE Metrics:**
  - **Utilization:** Resource usage percentage
  - **Saturation:** How full the queue is
  - **Errors:** Error count
- **Business Metrics:**
  - Conversion rates
  - User actions
  - Revenue metrics

### Tracing
- **Distributed Tracing:** Trace request dari awal hingga akhir
- **Span:** Setiap operation harus punya span dengan timing
- **Propagation:** Trace ID harus propagate via headers
- **Sampling:** Sample high-traffic endpoints (1-10%)

---

## 2. LOGGING STANDARDS

### Log Format (JSON)
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "User login successful",
  "correlationId": "abc123",
  "userId": "user_123",
  "service": "auth-service",
  "environment": "production",
  "metadata": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### Structured Logging (Pino)

```js
import pino from 'pino';

const logger = pino({ level: 'info' });

logger.info({ requestId: req.id, userId: req.user.id, durationMs: elapsed }, 'order.created');
```

### Log Levels Usage
| Level | When to Use |
|-------|-------------|
| ERROR | Something failed, needs attention |
| WARN | Something unexpected, but handled |
| INFO | Important business events |
| DEBUG | Detailed troubleshooting info |
| TRACE | Very verbose, development only |

### Log Best Practices
- Never log sensitive data (passwords, tokens, PII)
- Use meaningful log messages
- Include context for debugging
- Log errors with stack traces
- Use appropriate log rotation

---

## 3. METRICS IMPLEMENTATION

### Prometheus Metrics (Node.js)

```js
import { Counter, Histogram, register } from 'prom-client';

const httpRequests = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'route'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
```

### k6 Load Test Example

```js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed:   ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://api.example.com/orders');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

### Required Metrics per Service

#### HTTP/REST APIs
```
http_requests_total{method, route, status_code}
http_request_duration_seconds{method, route}
http_request_size_bytes
http_response_size_bytes
```

---

## 4. HEALTH CHECKS

### Three-Level Health Checks

#### Liveness Probe (Is the process alive?)
```javascript
app.get('/health/live', (req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});
```
- Should always return 200 if process is running
- Don't check dependencies here

#### Readiness Probe (Can it serve traffic?)
```javascript
app.get('/health/ready', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    whatsapp: await checkWhatsApp(),
    redis: await checkRedis()
  };

  const allHealthy = Object.values(checks).every(Boolean);

  if (allHealthy) {
    res.json({ status: 'ready', checks });
  } else {
    res.status(503).json({ status: 'not_ready', checks });
  }
});
```
- Check all dependencies
- Return 503 if can't serve traffic

#### Startup Probe (Is initialization complete?)
```javascript
app.get('/health/started', (req, res) => {
  if (initializationComplete) {
    res.json({ status: 'started' });
  } else {
    res.status(503).json({ status: 'starting' });
  }
});
```
- For slow-starting applications

---

## 5. DISTRIBUTED TRACING

### Correlation ID
```javascript
// Middleware to add correlation ID
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] ||
                      crypto.randomUUID();
  res.setHeader('X-Correlation-ID', req.correlationId);
  next();
});
```

### Request Logging
```javascript
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    logger.info('Request completed', {
      correlationId: req.correlationId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: Date.now() - start,
      userAgent: req.headers['user-agent']
    });
  });

  next();
});
```

### Trace Propagation Headers
```
X-Correlation-ID: abc123
X-Request-ID: def456
X-B3-TraceId: 4bf92f3577b34da6a3ce929d0e0e4736
X-B3-SpanId: 00f067aa0ba902b7
X-B3-ParentSpanId: 4bf92f3577b34da6
```

---

## 6. ALERTING RULES

### SLO Definitions

| Service | Availability | Latency (p99) |
|---------|--------------|---------------|
| API Gateway | 99.9% | < 500ms |
| WhatsApp Service | 99.5% | < 2s |
| Database | 99.9% | < 100ms |

### Alert Severity

#### P1 - Critical (Immediate action)
```
- Service completely down
- Data loss detected
- Security breach
```

#### P2 - High (Action within 1 hour)
```
- Error rate > 5%
- Latency increase > 50%
- Resource usage > 90%
```

#### P3 - Medium (Action within 4 hours)
```
- Error rate > 1%
- Non-critical service degraded
- Disk space > 80%
```

#### P4 - Low (Schedule fix)
```
- Minor performance degradation
- Non-critical logs showing errors
- Certificate expiring in 7 days
```

---

## 7. OPENTELEMETRY INTEGRATION

### Basic Setup
```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

const sdk = new NodeSDK({
  serviceName: 'whatsapp-blast',
  traceExporter: new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces'
  }),
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation()
  ]
});

sdk.start();
```

---

## 8. ERROR TRACKING

### Sentry Integration
```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.Integrations.Express({ app }),
    new Sentry.Integrations.Http({ breadcrumbs: true })
  ]
});

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## Monitoring Expert Workflow

### Core Workflow
1. **Assess** — Identify what needs monitoring (SLIs, critical paths)
2. **Instrument** — Add logging, metrics, and traces
3. **Collect** — Configure aggregation and storage
4. **Visualize** — Build dashboards using RED or USE methods
5. **Alert** — Define threshold and anomaly alerts

---

## Constraints

### MUST DO
- Use structured logging (JSON)
- Include request IDs for correlation
- Set up alerts for critical paths
- Monitor business metrics, not just technical
- Log security-relevant events

### MUST NOT DO
- Log sensitive data (passwords, tokens, PII)
- Alert on every error (alert fatigue)
- Use string interpolation in logs

---

**Invoke:** `/observability` | **Priority:** HIGH | **Version:** 1.1.0
