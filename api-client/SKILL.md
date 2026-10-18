---
name: api-client
description: HTTP client patterns, retry logic, circuit breaker, and rate limiting for TypeScript/JS
when_to_use: "Use when building an HTTP client in TypeScript/JS: retries, circuit breaker, or rate limiting."
version: "1.0.0"
category: [backend]
priority: medium
phase: phase-2
tech_stack:
  frameworks: [express, fastify, nestjs]
  languages: [typescript, javascript]
scale: [mvp, small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/client/**"
      reason: "API client detected"
  skill_tier: optional
capabilities: [implementation]
quality:
  rules_count: 10
  examples_count: 15
  stability: stable
integrates_with: [api-design]
dependencies: [api-design]
source:
  origin: local
author: thevoidsyntax
---

# API Client - HTTP Best Practices

## Base Client Pattern

### TypeScript HTTP Client
```typescript
import { Agent } from 'node:http';
import { Agent as HTTPSAgent } from 'node:https';

interface RequestOptions<T = unknown> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: T;
  timeout?: number;
  retries?: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private agent: Agent;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
    };
    this.agent = new Agent({ keepAlive: true, maxSockets: 25 });
  }

  async request<T = unknown, B = unknown>(
    options: RequestOptions<B>
  ): Promise<ApiResponse<T>> {
    const { url, method = 'GET', headers = {}, body, timeout = 30000 } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers: { ...this.defaultHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        // @ts-expect-error - Node-specific option
        agent: this.agent,
      });

      clearTimeout(timeoutId);

      const data = await response.json() as T;

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.mapError(error);
    }
  }

  async get<T = unknown>(url: string, options?: Omit<RequestOptions, 'url' | 'method'>) {
    return this.request<T>({ url, method: 'GET', ...options });
  }

  async post<T = unknown, B = unknown>(
    url: string,
    body: B,
    options?: Omit<RequestOptions<B>, 'url' | 'method' | 'body'>
  ) {
    return this.request<T, B>({ url, method: 'POST', body, ...options });
  }

  async put<T = unknown, B = unknown>(
    url: string,
    body: B,
    options?: Omit<RequestOptions<B>, 'url' | 'method' | 'body'>
  ) {
    return this.request<T, B>({ url, method: 'PUT', body, ...options });
  }

  async delete<T = unknown>(
    url: string,
    options?: Omit<RequestOptions, 'url' | 'method'>
  ) {
    return this.request<T>({ url, method: 'DELETE', ...options });
  }

  private mapError(error: unknown): Error {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return new Error('Request timeout');
      }
      return error;
    }
    return new Error('Unknown error');
  }
}
```

## Retry Pattern

### Exponential Backoff with Jitter
```typescript
interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryableStatuses?: number[];
  retryableErrors?: string[];
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 100,
    maxDelay = 10000,
    retryableStatuses = [408, 429, 500, 502, 503, 504],
    retryableErrors = ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED'],
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if should retry
      const shouldRetry =
        attempt < maxRetries &&
        (retryableStatuses.includes((error as any).status) ||
          retryableErrors.includes((error as any).code) ||
          error instanceof TimeoutError ||
          error instanceof NetworkError);

      if (!shouldRetry) {
        throw lastError;
      }

      // Calculate delay with exponential backoff + jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      );

      logger.info('Retrying request', { attempt: attempt + 1, maxRetries, delayMs: delay });
      await sleep(delay);
    }
  }

  throw lastError!;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

## Circuit Breaker

### Implementation
```typescript
enum CircuitState {
  CLOSED = 'CLOSED',    // Normal operation
  OPEN = 'OPEN',         // Failing, reject immediately
  HALF_OPEN = 'HALF_OPEN', // Testing if service recovered
}

interface CircuitBreakerOptions {
  failureThreshold: number;
  successThreshold: number;
  timeout: number; // How long to stay OPEN
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures = 0;
  private successes = 0;
  private lastFailureTime = 0;

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.options.timeout) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error('Circuit breaker is OPEN - request rejected');
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

  private onSuccess(): void {
    this.failures = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++;
      if (this.successes >= this.options.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.successes = 0;
      }
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
    } else if (this.failures >= this.options.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}
```

### Usage
```typescript
const usersCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 60000,
});

async function getUser(id: string) {
  return usersCircuitBreaker.execute(() =>
    apiClient.get<User>(`/users/${id}`)
  );
}
```

## Rate Limiting

### Token Bucket
```typescript
interface RateLimiterOptions {
  maxTokens: number;
  refillRate: number; // tokens per second
  maxConcurrent?: number;
}

export class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefill: number;
  private queue: Array<() => void> = [];
  private running = 0;

  constructor(private options: RateLimiterOptions) {
    this.tokens = options.maxTokens;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    await this.refill();

    if (this.tokens >= 1) {
      this.tokens--;
      return;
    }

    if (this.options.maxConcurrent && this.running >= this.options.maxConcurrent) {
      return new Promise(resolve => {
        this.queue.push(resolve);
      });
    }

    const waitTime = (1 - this.tokens) / this.options.refillRate * 1000;

    return new Promise(resolve => {
      setTimeout(() => {
        this.tokens--;
        resolve();
      }, waitTime);
    });
  }

  private async refill(): Promise<void> {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.options.refillRate;

    this.tokens = Math.min(
      this.options.maxTokens,
      this.tokens + tokensToAdd
    );
    this.lastRefill = now;
  }
}

// Usage
const rateLimiter = new TokenBucketRateLimiter({
  maxTokens: 100,
  refillRate: 10, // 10 requests per second
  maxConcurrent: 5,
});

async function makeRequest() {
  await rateLimiter.acquire();
  return apiClient.get('/data');
}
```

## Request Deduplication

### Request Cache
```typescript
export class RequestCache {
  private cache = new Map<string, Promise<unknown>>();
  private ttl: number;

  constructor(ttlMs = 5000) {
    this.ttl = ttlMs;
  }

  async getOrFetch<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> {
    // Check cache
    const cached = this.cache.get(key);
    if (cached) {
      return cached as Promise<T>;
    }

    // Check if already in-flight
    const inFlight = this.cache.get(key);
    if (inFlight) {
      return inFlight as Promise<T>;
    }

    // Fetch and cache
    const promise = fn().finally(() => {
      setTimeout(() => this.cache.delete(key), this.ttl);
    });

    this.cache.set(key, promise as Promise<unknown>);
    return promise;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Usage
const requestCache = new RequestCache(5000);

async function getUser(id: string) {
  return requestCache.getOrFetch(`user:${id}`, () =>
    apiClient.get<User>(`/users/${id}`)
  );
}
```

## Error Handling

### API Error Class
```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Usage
try {
  const response = await apiClient.get<User>('/users/123');

  if (!response.data) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  }

  return response.data;
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Handle unauthorized
    } else if (error.status === 404) {
      // Handle not found
    }
  }
  throw error;
}
```

## Request/Response Interceptors

### Interceptor Pattern
```typescript
interface Interceptor {
  onRequest?(config: RequestOptions): RequestOptions | Promise<RequestOptions>;
  onResponse?<T>(response: ApiResponse<T>): ApiResponse<T> | Promise<ApiResponse<T>>;
  onError?<error>(error: Error): Error | Promise<Error>;
}

export class ApiClientWithInterceptors extends ApiClient {
  private interceptors: Interceptor[] = [];

  addInterceptor(interceptor: Interceptor): void {
    this.interceptors.push(interceptor);
  }

  async request<T = unknown, B = unknown>(
    options: RequestOptions<B>
  ): Promise<ApiResponse<T>> {
    // Apply request interceptors
    let modifiedOptions = options;
    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        modifiedOptions = await interceptor.onRequest(modifiedOptions);
      }
    }

    try {
      const response = await super.request<T, B>(modifiedOptions);

      // Apply response interceptors
      for (const interceptor of this.interceptors) {
        if (interceptor.onResponse) {
          return await interceptor.onResponse(response);
        }
      }

      return response;
    } catch (error) {
      // Apply error interceptors
      for (const interceptor of this.interceptors) {
        if (interceptor.onError) {
          throw await interceptor.onError(error as Error);
        }
      }
      throw error;
    }
  }
}

// Usage
const client = new ApiClientWithInterceptors('https://api.example.com');

// Add logging interceptor
client.addInterceptor({
  onRequest: (config) => {
    logger.debug('Outgoing request', { method: config.method, url: config.url });
    return config;
  },
  onResponse: (response) => {
    logger.debug('Response received', { status: response.status });
    return response;
  },
  onError: (error) => {
    console.error(`Error: ${error.message}`);
    return error;
  },
});

// Add auth interceptor
client.addInterceptor({
  onRequest: async (config) => {
    const token = await getAuthToken();
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  },
});
```

## Request Cancellation

### AbortController Pattern
```typescript
export class CancellableRequest {
  private controllers = new Map<string, AbortController>();

  async get<T>(id: string, url: string): Promise<T> {
    // Cancel previous request with same ID
    this.cancel(id);

    const controller = new AbortController();
    this.controllers.set(id, controller);

    try {
      return await apiClient.get<T>(url, {
        signal: controller.signal,
      });
    } finally {
      this.controllers.delete(id);
    }
  }

  cancel(id: string): void {
    const controller = this.controllers.get(id);
    if (controller) {
      controller.abort();
      this.controllers.delete(id);
    }
  }

  cancelAll(): void {
    for (const controller of this.controllers.values()) {
      controller.abort();
    }
    this.controllers.clear();
  }
}

// Usage in React component
const requests = new CancellableRequest();

useEffect(() => {
  requests.get<User>('user-list', '/users')
    .then(setUsers);

  return () => requests.cancelAll();
}, []);
```

---

**Invoke:** `/api-client` | **Priority:** MEDIUM
