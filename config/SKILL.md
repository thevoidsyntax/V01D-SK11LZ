---
name: config
description: Configuration management, environment variables, and secrets handling best practices
version: "1.0.0"
category: [process]
priority: high
phase: any
tech_stack:
  languages: [typescript, nodejs, python, go, all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - always: true
      reason: "Core configuration skill"
  skill_tier: core
capabilities: [implementation, review]
quality:
  rules_count: 10
  examples_count: 15
  stability: stable
integrates_with: [auto-route, security]
source:
  origin: local
author: Claude
---

# Configuration Management

## Environment Variables

### Load Order
```
1. .env file (development only)
2. Environment variables (CI/CD, production)
3. Secrets manager (AWS Secrets Manager, Vault)
4. Config server (Spring Config, Consul)
```

### .env File Structure
```bash
# .env.example (committed to repo)
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=myapp
DATABASE_USER=
DATABASE_PASSWORD=

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# App
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

### Never Commit These
```bash
# .gitignore
.env
.env.local
.env.*.local
secrets/
*.pem
*.key
credentials.json
```

## TypeScript Config Pattern

### config/index.ts
```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

// Load .env file in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Validate environment schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = {
  env: parsed.data.NODE_ENV,
  isProduction: parsed.data.NODE_ENV === 'production',
  isDevelopment: parsed.data.NODE_ENV === 'development',
  port: parseInt(parsed.data.PORT, 10),
  database: {
    url: parsed.data.DATABASE_URL,
  },
  redis: {
    url: parsed.data.REDIS_URL,
  },
  jwt: {
    secret: parsed.data.JWT_SECRET,
    expiresIn: parsed.data.JWT_EXPIRES_IN,
  },
  apiKey: parsed.data.API_KEY,
} as const;
```

## Secrets Management

### Development
```typescript
// Load from .env
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Or use direnv
// .envrc
export DATABASE_URL="postgresql://..."
export API_KEY="..."
```

### Production - AWS Secrets Manager
```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManagerClient({ region: 'us-east-1' });
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(command);
  return response.SecretString!;
}

// Load secrets at startup
const secrets = await getSecret('myapp/production');
const config = JSON.parse(secrets);
```

### Docker Secrets
```yaml
# docker-compose.yml
services:
  app:
    image: myapp
    secrets:
      - db_password
      - api_key

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    external: true
```

```typescript
// Access in Node.js
import fs from 'fs';

const dbPassword = fs.readFileSync('/run/secrets/db_password', 'utf8').trim();
```

## Feature Flags

### Simple Config-Based Flags
```typescript
// config/features.ts
export const features = {
  newDashboard: process.env.FEATURE_NEW_DASHBOARD === 'true',
  betaApi: process.env.FEATURE_BETA_API === 'true',
  maxUsers: parseInt(process.env.MAX_USERS || '1000', 10),
} as const;

// Usage
if (features.newDashboard) {
  router.use('/dashboard/v2', dashboardV2Router);
}
```

### LaunchDarkly Integration
```typescript
import { LaunchDarklyClient } from '@launchdarkly/node-server-sdk';

const ldClient = LaunchDarklyClient.init(process.env.LD_SDK_KEY!);

// Evaluate flag
const showNewFeature = await ldClient.variation(
  'new-feature',
  { key: user.id, email: user.email },
  false // default
);
```

## Configuration Validation

### Zod Schemas
```typescript
import { z } from 'zod';

// Database config schema
const databaseSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(5432),
  name: z.string(),
  user: z.string(),
  password: z.string(),
  pool: z.object({
    min: z.coerce.number().default(2),
    max: z.coerce.number().default(10),
  }).optional(),
});

const dbConfig = databaseSchema.parse({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Cache config schema
const cacheSchema = z.object({
  redis: z.object({
    url: z.string().url(),
    ttl: z.coerce.number().default(3600),
  }).optional(),
  memory: z.object({
    maxSize: z.coerce.number().default(100),
  }).optional(),
});
```

## Environment-Specific Config

### File Structure
```
config/
├── default.ts
├── development.ts
├── test.ts
├── production.ts
└── index.ts
```

### config/index.ts
```typescript
import { merge } from 'lodash';

const defaultConfig = {
  port: 3000,
  database: { pool: { min: 2, max: 10 } },
  cache: { enabled: true },
};

const configs = {
  development: {
    database: { host: 'localhost', pool: { min: 1, max: 5 } },
    cache: { enabled: false },
  },
  test: {
    port: 3001,
    database: { name: 'test_db' },
    cache: { enabled: false },
  },
  production: {
    database: { host: process.env.DB_HOST },
    cache: { enabled: true, ttl: 3600 },
  },
};

const env = process.env.NODE_ENV || 'development';
export const config = merge({}, defaultConfig, configs[env]);
```

## Dynamic Configuration

### Config Server (Consul)
```typescript
import { ConsulClient } from 'consul';

const consul = new ConsulClient({ host: 'consul.service.consul' });

// Get config
const { Value } = await consul.kv.get(`config/myapp/${env}/database`);
const dbConfig = JSON.parse(Value!);

// Watch for changes
consul.kv.get({
  key: `config/myapp/${env}/database`,
  watch: true,
}, (err, result) => {
  if (result) {
    updateDatabaseConnection(JSON.parse(result.Value!));
  }
});
```

### Apollo Config Server
```typescript
// client.ts
import { ApolloConfig } from '@apollo/client';

const apolloConfig: ApolloConfig = {
  configServiceUrl: 'http://config-server:8888',
};

export const config = await apolloConfig.getConfig('myapp');
```

## CLI Arguments

### yargs Pattern
```typescript
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('env', {
    alias: 'e',
    type: 'string',
    default: 'development',
    description: 'Environment to run in',
  })
  .option('port', {
    alias: 'p',
    type: 'number',
    default: 3000,
    description: 'Port to listen on',
  })
  .option('verbose', {
    alias: 'v',
    type: 'count',
    description: 'Increase verbosity',
  })
  .coerce('file', (arg) => fs.readFileSync(arg))
  .parse();

logger.debug('Config loaded', { env: argv.env, port: argv.port, verbose: argv.verbose });
```

## Config in Tests

### Test Setup
```typescript
// jest.setup.ts
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  process.env.JWT_SECRET = 'test-secret-for-testing-only';
});

afterAll(() => {
  delete process.env.DATABASE_URL;
  delete process.env.JWT_SECRET;
});
```

### Override Config in Tests
```typescript
describe('Service', () => {
  it('should use config values', () => {
    const originalEnv = { ...process.env };
    
    process.env.MOCK_VALUE = 'test-mock';
    
    // Test with mock value
    const result = myService.getValue();
    expect(result).toBe('test-mock');
    
    // Restore
    process.env = originalEnv;
  });
});
```

## Security Checklist

### ✅ DO
```typescript
// Load secrets at startup
const config = loadConfig();

// Validate all config values
const schema = z.object({ key: z.string() });
const valid = schema.safeParse(config);

// Use environment variables
const apiKey = process.env.API_KEY;

// Rotate secrets
// Restart app when secrets change
```

### ❌ DON'T
```typescript
// ❌ Don't hardcode secrets
// Example (WRONG - don't copy this):
// const API_KEY = 'sk-123456789';

// ❌ Don't commit .env
// Already in .gitignore!

// ❌ Don't use default passwords
// .env.example should have empty values

// ❌ Don't expose secrets in logs
logger.info('Config', { apiKey: process.env.API_KEY });
```

---

**Invoke:** `/config` | **Priority:** MEDIUM
