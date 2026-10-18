---
name: postgresql-pro
description: "PostgreSQL optimization with query tuning, indexing strategies, JSONB operations, and replication"
when_to_use: "Use when optimizing PostgreSQL: query tuning, indexing, JSONB, or replication."
version: "1.0.0"
category: [data]
priority: high
phase: any
tech_stack:
  databases: [postgresql]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/*.sql"
      reason: "SQL files detected"
  skill_tier: context
triggers:
  phrases:
    - "postgresql"
    - "postgres"
    - "sql"
    - "query optimization"
    - "indexing"
    - "database"
capabilities: [implementation, analysis, review]
quality:
  rules_count: 15
  examples_count: 20
  stability: stable
integrates_with: [database, data-engineering]
dependencies: []
source:
  origin: external
  sources: ["Jeffallan/claude-skills:postgres-pro"]
author: Jeffallan
---

# PostgreSQL Pro

A specialized skill for PostgreSQL database administration and optimization covering query performance tuning, indexing strategies, JSONB operations, replication setup, and VACUUM tuning.

## Core Workflow

1. **Analyze** — Identify slow queries with `pg_stat_statements`
2. **Optimize** — Create targeted indexes with `CREATE INDEX CONCURRENTLY`
3. **Monitor** — Track with `pg_stat` views and EXPLAIN ANALYZE
4. **Maintain** — Configure VACUUM and autovacuum

## Query Optimization

### EXPLAIN ANALYZE
```sql
-- Analyze query execution plan
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.*, o.*
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.created_at > '2024-01-01';

-- Key indicators:
-- - Seq Scan = bad for large tables
-- - Hash Join = good for large joins
-- - Index Scan = good for selective queries
-- - Nested Loop = good for small tables
```

### Identify Slow Queries
```sql
-- Top 10 slowest queries
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Most time consuming
SELECT query, total_time, calls, mean_time, rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

## Indexing Strategies

### B-Tree (Default)
```sql
-- Equality and range queries
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_orders_created ON orders(created_at DESC);

-- Partial index for active users
CREATE INDEX CONCURRENTLY idx_users_active 
ON users(last_login) 
WHERE status = 'active';
```

### GIN (Generalized Inverted Index)
```sql
-- Full-text search
CREATE INDEX CONCURRENTLY idx_articles_fts 
ON articles USING GIN(to_tsvector('english', title || ' ' || body));

-- JSONB containment
CREATE INDEX CONCURRENTLY idx_products_attrs 
ON products USING GIN(attributes);
```

### GiST (Generalized Search Tree)
```sql
-- Geometric types and range types
CREATE INDEX CONCURRENTLY idx_reservations_during 
ON reservations USING GIST(during);

-- Full-text search with GiST
CREATE INDEX CONCURRENTLY idx_articles_fts_gist 
ON articles USING GIST(to_tsvector('english', title));
```

### BRIN (Block Range Index)
```sql
-- Large tables with natural ordering (timestamps, sequences)
-- Much smaller than B-Tree but less selective
CREATE INDEX CONCURRENTLY idx_logs_created 
ON logs USING BRIN(created_at) 
WITH (pages_per_range = 128);
```

## JSONB Operations

```sql
-- Query JSONB data
SELECT * FROM products 
WHERE attributes->>'color' = 'blue'
AND attributes @> '{"brand": "Nike"}';

-- Index for JSONB queries
CREATE INDEX CONCURRENTLY idx_products_attrs_gin 
ON products USING GIN(attributes);

-- Extract and query nested JSON
SELECT 
    id,
    attributes->>'name' as name,
    (attributes->'specs'->>'weight')::numeric as weight
FROM products
WHERE attributes @> '{"brand": "Apple"}';
```

## Performance Tuning

### Connection Pooling
```sql
-- Check connection usage
SELECT 
    count(*) as current_connections,
    state,
    datname
FROM pg_stat_activity
GROUP BY state, datname;
```

### VACUUM and Autovacuum
```sql
-- Manual VACUUM for maintenance
VACUUM ANALYZE users;

-- Check table bloat
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    n_dead_tup,
    n_live_tup,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
```

## Replication Setup

### Streaming Replication
```conf
# postgresql.conf (primary)
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
wal_keep_size = 1GB

# pg_hba.conf (primary)
host  replication all 192.168.1.0/24 md5
```

```sql
-- Create replication slot (primary)
SELECT * FROM pg_create_physical_replication_slot('replica1');

-- Check replication status
SELECT * FROM pg_stat_replication;
```

## Essential Practices

### MUST DO
- Use `EXPLAIN ANALYZE` before and after optimization
- Create indexes `CONCURRENTLY` in production
- Monitor with `pg_stat_statements`
- Use partial indexes for selective queries
- Analyze with `ANALYZE` after bulk loads
- Configure autovacuum appropriately

### MUST NOT DO
- Create indexes without understanding the query plan
- Index every column
- Use sequential scans on large tables
- Skip `CONCURRENTLY` in production (locks table)
- Ignore table bloat
- Forget to ANALYZE after schema changes

---

**Invoke:** `/postgresql-pro` | **Version:** 1.0.0
