---
name: error-tracking
description: "Error handling patterns, exception management, logging strategies, and observability integration."
when_to_use: "Use when designing error handling: exceptions, logging strategy, or error observability."
version: "1.0.0"
category: [infrastructure, backend]
priority: high
phase: any
tech_stack:
  languages: [all]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - phrase: ["error handling", "exception", "observability", "logging", "monitoring"]
      reason: "Error/observability related request"
    - has_file: "**/error-tracking*"
      reason: "Error tracking config detected"
  skill_tier: context
triggers:
  phrases:
    - "error"
    - "exception"
    - "logging"
    - "monitor"
    - "alert"
    - "sentry"
    - "datadog"
    - "newrelic"
    - "observability"
    - "tracing"
capabilities: [implementation, review, analysis]
dependencies: [observability, logging]
integrates_with: [observability, logging, security]
---

# ERROR-TRACKING v1.0

Error handling and observability specialist. Use these patterns for robust error management.

## Error Handling Principles

### 1. Fail Fast vs Fail Safe

```
┌─────────────────────────────────────────────────────────────────────┐
│  FAIL FAST (Prefer for input validation)                          │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  Validate input at system boundaries.                              │
│  Throw early, fail clearly.                                        │
│                                                                      │
│  Example:                                                          │
│  if (userId < 0) {                                              │
│    throw new ValidationError("userId must be positive");          │
│  }                                                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  FAIL SAFE (Prefer for external services)                         │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  Handle gracefully, provide defaults.                               │
│  Never let external failures crash the app.                         │
│                                                                      │
│  Example:                                                          │
│  try {                                                             │
│    await paymentService.charge(user, amount);                     │
│  } catch (PaymentError e) {                                      │
│    logger.error("Payment failed", e);                             │
│    return { success: false, error: "Payment failed" };           │
│  }                                                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Error Classification

| Type | Description | Response | Example |
|------|-------------|----------|---------|
| **Validation** | Invalid input | 400 Bad Request | Missing required field |
| **Authentication** | Not logged in | 401 Unauthorized | Invalid token |
| **Authorization** | No permission | 403 Forbidden | Insufficient role |
| **Not Found** | Resource missing | 404 Not Found | User ID not found |
| **Conflict** | Duplicate resource | 409 Conflict | Email already exists |
| **Rate Limit** | Too many requests | 429 Too Many Requests | API limit exceeded |
| **Server Error** | Internal failure | 500 Internal Error | Database timeout |

### 3. Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      },
      {
        "field": "password",
        "message": "Must be at least 8 characters"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Logging Patterns

### 1. Log Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| **ERROR** | Operation failed, needs attention | "Payment processing failed", "Database connection lost" |
| **WARN** | Unexpected but handled | "Retry successful", "Rate limit approaching" |
| **INFO** | Important business events | "User registered", "Order placed" |
| **DEBUG** | Development/troubleshooting | "Entering function X", "Variable Y = 5" |
| **TRACE** | Very detailed flow | "Step 1 of 5 completed" |

### 2. Structured Logging

```typescript
// BAD: String interpolation
logger.info(`User ${userId} logged in`);

// GOOD: Structured fields
logger.info("User logged in", {
  userId: userId,
  email: email,
  timestamp: new Date().toISOString(),
  ipAddress: ipAddress,
});
```

### 3. Correlation IDs

```typescript
// Add correlation ID to every request
const correlationId = req.headers['x-correlation-id'] || generateUUID();

// Attach to logger context
logger.defaultMeta = { correlationId };

// Log with correlation ID
logger.info("Processing request", {
  correlationId,
  path: req.path,
  method: req.method,
});
```

### 4. Sensitive Data Masking

```typescript
const maskSensitive = (data: Record<string, unknown>): Record<string, unknown> => {
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      sensitiveFields.some(field => key.toLowerCase().includes(field))
        ? '***MASKED***'
        : typeof value === 'object' ? maskSensitive(value as Record<string, unknown>) : value
    ])
  );
};

logger.info("Request body", maskSensitive(req.body));
```

## Exception Handling Patterns

### 1. Custom Exception Hierarchy

```typescript
// Base application error
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Domain-specific errors
class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: unknown) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}
```

### 2. Global Error Handler

```typescript
// Express
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'];

  // Log error
  logger.error("Request failed", {
    correlationId,
    path: req.path,
    method: req.method,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });

  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        correlationId
      }
    });
  }

  // Handle unknown errors
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      correlationId
    }
  });
});
```

### 3. Async Error Wrapper

```typescript
// Wrap async handlers to catch promise rejections
const asyncHandler = (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) throw new NotFoundError('User', req.params.id);
  res.json(user);
}));
```

## Error Monitoring Integration

### 1. Sentry Setup

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
  tracesSampleRate: 0.1,
  beforeSend: (event) => {
    // Filter sensitive data
    event.user = { email: event.user?.email }; // Remove IP, etc.
    return event;
  }
});

// Wrap Express app
const app = express();
Sentry.setupExpressHandler(app);

// Add correlation ID to errors
Sentry.configureScope(scope => {
  scope.setTag('correlationId', correlationId);
});
```

### 2. Health Check Pattern

```typescript
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    externalApi: await checkExternalAPI(),
  };

  const healthy = Object.values(checks).every(c => c.healthy);
  const status = healthy ? 200 : 503;

  res.status(status).json({
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks,
    version: process.env.APP_VERSION
  });
});
```

## Retry Patterns

### 1. Exponential Backoff

```typescript
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options = { maxRetries: 3, baseDelay: 1000 }
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < options.maxRetries) {
        const delay = options.baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError!;
};
```

### 2. Circuit Breaker

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold = 5,
    private timeout = 60000
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailure >= this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailure = Date.now();
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

## Best Practices Checklist

```
┌─────────────────────────────────────────────────────────────────────┐
│  ERROR HANDLING CHECKLIST                                        │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  STRUCTURE:                                                      │
│  ☐ Custom exception hierarchy                                   │
│  ☐ Consistent error response format                             │
│  ☐ Correlation IDs for tracing                                  │
│                                                                      │
│  LOGGING:                                                         │
│  ☐ Structured logging (not string interpolation)               │
│  ☐ Appropriate log levels                                     │
│  ☐ Sensitive data masking                                      │
│  ☐ Include context (user ID, request ID, etc.)                │
│                                                                      │
│  MONITORING:                                                      │
│  ☐ Error tracking tool (Sentry, Datadog, etc.)                │
│  ☐ Health check endpoint                                        │
│  ☐ Alert on error thresholds                                   │
│                                                                      │
│  RESILIENCE:                                                     │
│  ☐ Retry logic with backoff                                    │
│  ☐ Circuit breaker for external services                        │
│  ☐ Graceful degradation                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Author: TheVoidSyntax*
