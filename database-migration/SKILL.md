---
name: database-migration
description: "Database migration patterns with zero-downtime strategies, rollback plans, and data integrity."
when_to_use: "Use when running a schema migration, especially zero-downtime, with a rollback plan."
version: "1.0.0"
category: [data, backend]
priority: high
phase: any
tech_stack:
  databases: [postgresql, mysql, mongodb, all]
  tools: [flyway, liquibase, prisma, alembic, knex]
scale: [medium, large]
auto_invoke:
  enabled: false
  conditions:
    - command: ["/migration", "/migrate"]
      reason: "Migration request"
    - has_file: "**/migrations/**"
      reason: "Migration folder detected"
  skill_tier: optional
triggers:
  phrases:
    - "migration"
    - "database schema"
    - "schema change"
    - "rollback"
    - "flyway"
    - "liquibase"
    - "alembic"
capabilities: [implementation, planning]
dependencies: [database]
integrates_with: [database, git, ci-cd]
---

# DATABASE-MIGRATION v1.0

Database migration specialist for zero-downtime deployments and safe schema changes.

## Migration Strategies

### 1. Expand-Contract Pattern

```
ZERO-DOWNTIME MIGRATION FLOW

PHASE 1: EXPAND (Add new)
├── 1. Add nullable column (no breaking change)
├── 2. Deploy code that writes to BOTH columns
└── 3. Backfill new column with data

PHASE 2: MIGRATE (Switch reads)
├── 4. Deploy code that reads from NEW column
└── 5. Verify data integrity

PHASE 3: CONTRACT (Remove old)
├── 6. Remove code writing to OLD column
└── 7. Drop old column (or rename if risky)
```

### 2. Safe Migration Examples

```sql
-- PHASE 1: ADD nullable column (safe)
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;

-- PHASE 2: BACKFILL data (off-peak)
UPDATE users SET phone = email_phone FROM user_contacts WHERE users.id = user_contacts.user_id;

-- PHASE 3: Make NOT NULL after backfill
ALTER TABLE users MODIFY COLUMN phone VARCHAR(20) NOT NULL;

-- ROLLBACK: Just remove column
ALTER TABLE users DROP COLUMN phone;
```

## Migration Tools

### 1. Flyway (Java/Multi-language)

```sql
-- migrations/V1__create_users.sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrations/V2__add_phone.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;

-- Rollback
-- migrations/V2__add_phone.sql
ALTER TABLE users DROP COLUMN phone;
```

```bash
# Run migrations
flyway migrate

# Check status
flyway info

# Rollback one version
flyway undo

# Clean (dangerous!)
flyway clean
```

### 2. Liquibase (XML/YAML/JSON)

```yaml
# changelog.xml
<databaseChangeLog>
  <changeSet id="1" author="dev">
    <createTable tableName="users">
      <column name="id" type="BIGINT" autoIncrement="true" primaryKey="true"/>
      <column name="email" type="VARCHAR(255)"/>
    </createTable>
  </changeSet>

  <changeSet id="2" author="dev">
    <addColumn tableName="users">
      <column name="phone" type="VARCHAR(20)"/>
    </addColumn>
    <rollback>
      <dropColumn tableName="users" columnName="phone"/>
    </rollback>
  </changeSet>
</databaseChangeLog>
```

### 3. Prisma (TypeScript/Node.js)

```typescript
// migration: 20240101_add_phone.ts
import { Migration } from '@prisma/migrate';

const migration = new Migration('20240101_add_phone');

// Up
await migration.create('users', (table) => {
  table.string('phone', 20).nullable();
});

// Down
await migration.dropColumn('users', 'phone');
```

```bash
# Create migration
prisma migrate dev --name add_phone_column

# Deploy migration
prisma migrate deploy

# Reset (dangerous!)
prisma migrate reset
```

### 4. Alembic (Python)

```python
# migrations/versions/2024_01_add_phone.py

from alembic import op
import sqlalchemy as sa

revision = 'abc123'
down_revision = 'prev_migration'

def upgrade():
    op.add_column('users', sa.Column('phone', sa.String(20), nullable=True))

def downgrade():
    op.drop_column('users', 'phone')
```

```bash
# Create migration
alembic revision --autogenerate -m "add phone column"

# Run migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

## Zero-Downtime Patterns

### 1. Online Table Rebuild

```sql
-- Step 1: Create new table
CREATE TABLE users_new LIKE users;
ALTER TABLE users_new ADD COLUMN phone VARCHAR(20);

-- Step 2: Copy data in batches
INSERT INTO users_new (id, email, name, phone)
SELECT id, email, name, COALESCE(phone, email_phone)
FROM users WHERE id > :last_id ORDER BY id LIMIT 1000;

-- Step 3: Atomic rename
RENAME TABLE users TO users_old, users_new TO users;

-- Step 4: Drop old table (after verification)
DROP TABLE users_old;
```

### 2. Concurrent Index Creation

```sql
-- PostgreSQL: Create index without locking writes
CREATE INDEX CONCURRENTLY idx_users_phone ON users(phone);

-- MySQL: Use pt-online-schema-change
pt-online-schema-change \
  --alter "ADD COLUMN phone VARCHAR(20)" \
  D=tbl,t=users_new \
  --execute

-- Cancel if needed
SELECT pg_cancel_backend(pid);
```

### 3. Safe Column Rename

```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN user_phone VARCHAR(20);

-- Step 2: Create triggers
CREATE TRIGGER users_sync_insert
AFTER INSERT ON users
FOR EACH ROW
SET NEW.user_phone = NEW.phone;

CREATE TRIGGER users_sync_update
AFTER UPDATE ON users
FOR EACH ROW
SET NEW.user_phone = NEW.phone;

-- Step 3: Backfill
UPDATE users SET user_phone = phone WHERE user_phone IS NULL;

-- Step 4: Swap
ALTER TABLE users DROP COLUMN phone;
ALTER TABLE users CHANGE COLUMN user_phone phone VARCHAR(20);
```

## Rollback Strategies

### 1. Feature Toggle Pattern

```typescript
// Feature flag controlled migration
async function migrate() {
  const isMigrationEnabled = await featureFlags.isEnabled('migration_v2');

  if (isMigrationEnabled) {
    // Use new schema
    return await queryNewSchema();
  }

  // Fallback to old schema
  return await queryOldSchema();
}
```

### 2. Expand with Dual-Write

```typescript
// Write to both old and new columns
async function createUser(data: UserData) {
  const user = await db.users.create({
    email: data.email,
    name: data.name,
    phone: data.phone  // new column
  });

  // Also write to legacy column for rollback
  await db.execute(`
    INSERT INTO legacy_users (id, email, full_name)
    VALUES (?, ?, ?)
  `, [user.id, data.email, data.name]);

  return user;
}
```

### 3. Shadow Table Pattern

```sql
-- Create shadow table
CREATE TABLE users_shadow LIKE users;

-- Sync from production
INSERT INTO users_shadow SELECT * FROM users;

-- Application reads from shadow
SELECT * FROM users_shadow WHERE ...;

-- Verification before promotion
SELECT COUNT(*) FROM users
MINUS
SELECT COUNT(*) FROM users_shadow;  -- Should be 0
```

## CI/CD Integration

### 1. Pre-deployment Check

```yaml
# .github/workflows/migration.yml
name: Migration Check

on:
  pull_request:
    paths:
      - 'migrations/**'

jobs:
  validate:
    steps:
      - uses: actions/checkout@v3

      - name: Dry run migrations
        run: |
          flyway migrate -dryRun

      - name: Check for destructive changes
        run: |
          if grep -r "DROP TABLE\|TRUNCATE" migrations/; then
            echo "Destructive migration detected!"
            exit 1
          fi
```

### 2. Migration Pipeline

```yaml
stages:
  - validate      # Lint migration files
  - test         # Run on test DB
  - staging      # Apply to staging
  - production   # Apply to production

migration:production:
  script:
    - flyway migrate -baselineOnMigrate
    - flyway info
  environment:
    STOP_ON_MIGRATION_ERROR: true
  rollback:
    flyway undo
```

## Best Practices Checklist

```
PRE-MIGRATION:
  [ ] Test on identical data volume
  [ ] Check execution time on large table
  [ ] Verify rollback plan
  [ ] Schedule during low-traffic window
  [ ] Notify stakeholders
  [ ] Have DBA review complex changes

DURING MIGRATION:
  [ ] Monitor slow queries
  [ ] Watch connection pool
  [ ] Monitor replication lag
  [ ] Check disk space

POST-MIGRATION:
  [ ] Verify row counts match
  [ ] Check application logs
  [ ] Monitor error rates
  [ ] Test critical paths
  [ ] Update documentation
```

---

*Author: TheVoidSyntax*
