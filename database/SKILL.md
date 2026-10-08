---
name: database
description: SQL database optimization, migrations, indexing strategies, and best practices
version: "1.0.0"
category: [backend, data]
priority: medium
phase: phase-1
tech_stack:
  databases: [postgresql, mysql, mongodb, sqlite]
scale: [mvp, small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/migrations/**"
      reason: "Database migrations detected"
    - has_file: "**/schema.prisma"
      reason: "Prisma schema detected"
    - has_file: "**/knexfile*"
      reason: "Knex config detected"
    - tech_stack: [postgresql, mysql, mongodb, sqlite]
      reason: "Database tech stack detected"
  skill_tier: context
triggers:
  phrases:
    - "database"
    - "postgres"
    - "postgresql"
    - "mysql"
    - "mongodb"
    - "sqlite"
    - "sql"
    - "query"
    - "migration"
    - "schema"
    - "prisma"
    - "knex"
    - "orm"
    - "table"
    - "index"
capabilities: [implementation, analysis]
quality:
  rules_count: 15
  examples_count: 40
  stability: stable
integrates_with: [auto-route, analyze-project]
dependencies: [data-engineering]
source:
  origin: local
author: Claude
---

# Database - SQL & Migration Best Practices

## Indexing Strategies

### When to Create Indexes
```sql
-- Index columns used in WHERE
CREATE INDEX idx_users_email ON users(email);

-- Index columns in JOIN conditions
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Index foreign keys (almost always)
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Index for ORDER BY with LIMIT
CREATE INDEX idx_products_price ON products(price);
```

### Composite Indexes
```sql
-- Order matters! Most selective first
CREATE INDEX idx_orders_status_date ON orders(status, created_at);

-- Good for: WHERE status = 'pending' AND created_at > '2024-01-01'
-- Bad for: WHERE created_at > '2024-01-01' (can't use status part)

-- Covering index (includes all needed columns)
CREATE INDEX idx_orders_covering ON orders(status, created_at)
INCLUDE (user_id, total_amount, status);
```

### Index Types
```sql
-- B-tree (default, most common)
CREATE INDEX idx_users_email ON users(email);

-- Partial index (smaller, faster)
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- GIN for JSON/Array
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- GIST for full-text or geometric
CREATE INDEX idx_articles_search ON articles USING GIST(to_tsvector('english', content));
```

## Query Optimization

### Avoid N+1 Queries
```sql
-- BAD: N+1 query
SELECT * FROM orders;
-- Then for each order:
SELECT * FROM customers WHERE id = order.customer_id;

-- GOOD: Single JOIN query
SELECT o.*, c.name, c.email
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;

-- Or use IN with subquery
SELECT * FROM customers WHERE id IN (SELECT customer_id FROM orders);
```

### Use EXPLAIN ANALYZE
```sql
-- Analyze query plan
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders
WHERE status = 'pending'
AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Check for:
-- - Seq Scan (usually bad for large tables)
-- - High cost numbers
-- - Missing indexes
-- - Hash joins vs nested loops
```

### Pagination Best Practices
```sql
-- Offset pagination (slow for large offsets)
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 10000;

-- Cursor-based pagination (fast, consistent)
-- First page:
SELECT * FROM products ORDER BY id LIMIT 20;

-- Next page:
SELECT * FROM products
WHERE id > :last_seen_id
ORDER BY id
LIMIT 20;

-- With filter:
SELECT * FROM products
WHERE id > :last_seen_id
AND category = 'electronics'
ORDER BY id
LIMIT 20;
```

## Migrations

### Migration File Structure
```sql
-- migrations/001_create_users.sql

-- UP migration
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- DOWN migration
DROP TABLE users;
```

### Safe Migration Patterns
```sql
-- ADD column (safe - never breaks existing code)
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT 'unknown';
ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL; -- PostgreSQL only

-- REMOVE column (unsafe - requires two-phase)
-- Phase 1: Stop writing to column
-- Phase 2: Remove column

-- RENAME column (unsafe - requires two-phase)
ALTER TABLE users RENAME COLUMN name TO full_name;
```

### Two-Phase Migration
```sql
-- Phase 1: Add new column, keep old
ALTER TABLE users ADD COLUMN new_email VARCHAR(255);
UPDATE users SET new_email = email;
CREATE TRIGGER sync_email BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION sync_email_trigger();

-- Deploy code that writes to BOTH columns

-- Phase 2: Migrate data, drop old
UPDATE users SET email = new_email WHERE email IS NULL;
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN new_email TO email;
DROP TRIGGER sync_email ON users;
```

## PostgreSQL Specific

### JSON Operations
```sql
-- Query JSONB
SELECT * FROM events
WHERE data->>'type' = 'purchase'
AND (data->'items') @> '[{"sku": "ABC123"}]';

-- Index JSONB
CREATE INDEX idx_events_data ON events USING GIN (data);

-- Extract with cast
SELECT * FROM events
WHERE (data->>'amount')::numeric > 100;
```

### Window Functions
```sql
-- Running total
SELECT
    date,
    amount,
    SUM(amount) OVER (ORDER BY date) as running_total
FROM sales;

-- Row number per group
SELECT
    name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rank
FROM employees;

-- Lag/Lead for comparisons
SELECT
    date,
    revenue,
    LAG(revenue, 7) OVER (ORDER BY date) as last_week_revenue,
    revenue - LAG(revenue, 7) OVER (ORDER BY date) as growth
FROM daily_metrics;
```

### Common Table Expressions
```sql
-- Simple CTE
WITH active_users AS (
    SELECT * FROM users WHERE is_active = true
)
SELECT * FROM active_users WHERE email LIKE '%@company.com';

-- Recursive CTE
WITH RECURSIVE category_tree AS (
    SELECT id, name, parent_id, 0 as depth
    FROM categories WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.name, c.parent_id, ct.depth + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY depth;
```

## MySQL Specific

### JSON Operations
```sql
-- Query JSON
SELECT * FROM events
WHERE JSON_EXTRACT(data, '$.type') = 'purchase';

-- Or using shortcut
SELECT * FROM events
WHERE data->>'$.type' = 'purchase';

-- Update JSON
UPDATE events
SET data = JSON_SET(data, '$.processed', true)
WHERE id = 123;
```

### UPSERT Pattern
```sql
-- MySQL 8.0+
INSERT INTO users (id, email, name)
VALUES (1, 'new@email.com', 'John')
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    name = VALUES(name);

-- Or with CTE
WITH new_data AS (
    SELECT 1 as id, 'new@email.com' as email, 'John' as name
)
INSERT INTO users
SELECT * FROM new_data
ON DUPLICATE KEY UPDATE
    email = new_data.email,
    name = new_data.name;
```

## Performance Patterns

### Batch Operations
```sql
-- Batch insert
INSERT INTO orders (user_id, total)
VALUES (1, 100), (2, 200), (3, 300);

-- Bulk update with CTE
WITH updates AS (
    SELECT unnest(ARRAY[1,2,3]) as id,
           unnest(ARRAY[100,200,300]) as new_total
)
UPDATE orders o
SET total = u.new_total
FROM updates u
WHERE o.id = u.id;

-- Delete batch
DELETE FROM logs
WHERE created_at < NOW() - INTERVAL '90 days'
LIMIT 1000;
-- Run in loop to avoid lock escalation
```

### Connection Pooling
```sql
-- PostgreSQL check connections
SELECT
    state,
    COUNT(*)
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY state;

-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND query_start < NOW() - INTERVAL '10 minutes';
```

## Table Partitioning

### PostgreSQL Range Partitioning
```sql
-- Create partitioned table
CREATE TABLE orders (
    id BIGSERIAL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- Partition maintenance
CREATE TABLE orders_2024_q3 PARTITION OF orders
    FOR VALUES FROM ('2024-07-01') TO ('2024-10-01');
```

## Common Patterns

### Soft Delete
```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Query active records
CREATE INDEX idx_users_active ON users(deleted_at) WHERE deleted_at IS NULL;

-- Always filter in queries
SELECT * FROM users WHERE deleted_at IS NULL;

-- Soft delete
UPDATE users SET deleted_at = NOW() WHERE id = 123;

-- Hard delete (when needed)
DELETE FROM users WHERE id = 123 AND deleted_at < NOW() - INTERVAL '30 days';
```

### Audit Trail
```sql
CREATE TABLE orders_audit (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_data JSONB,
    new_data JSONB,
    changed_by UUID,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger function
CREATE OR REPLACE FUNCTION orders_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO orders_audit (order_id, action, new_data)
        VALUES (NEW.id, 'INSERT', to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO orders_audit (order_id, action, old_data, new_data)
        VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO orders_audit (order_id, action, old_data)
        VALUES (OLD.id, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_audit
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION orders_audit_trigger();
```

---

**Invoke:** `/database` | **Priority:** MEDIUM
