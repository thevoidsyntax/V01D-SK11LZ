---
name: mysql-pro
description: "MySQL optimization with query tuning, partitioning, replication, and InnoDB best practices."
version: "1.0.0"
category: [data, backend]
priority: medium
phase: any
tech_stack:
  databases: [mysql, mariadb]
  languages: [php, typescript, python, go]
scale: [medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/*.sql"
      reason: "SQL files detected"
    - has_file: "**/mysql*"
      reason: "MySQL connection detected"
    - tech_stack: [mysql, mariadb]
      reason: "MySQL detected"
  skill_tier: context
triggers:
  phrases:
    - "mysql"
    - "mariadb"
    - "innodb"
    - "myisam"
capabilities: [implementation, optimization]
dependencies: [database]
integrates_with: [database, scalability]
---

# MYSQL-PRO v1.0

MySQL/MariaDB specialist for query optimization, replication, and high availability.

## Tech Stack

| Component | Technologies |
|-----------|-------------|
| Storage Engine | InnoDB (default), MyISAM |
| Tools | mysql CLI, MySQL Workbench, Percona Toolkit |
| Cloud | Amazon RDS, Google Cloud SQL, Azure DB |
| ORM | Prisma, Sequelize, TypeORM |

## Index Optimization

### 1. Index Types

```sql
-- B-tree (default, most common)
CREATE INDEX idx_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_status_created ON orders(status, created_at);
-- Good for: WHERE status = 'pending' AND created_at > '2024-01-01'

-- Prefix index (for VARCHAR with long values)
CREATE INDEX idx_name ON products(name(10));

-- Full-text index (for search)
ALTER TABLE articles ADD FULLTEXT(title, content);

-- Spatial index (for GEO queries)
CREATE INDEX idx_location ON stores(location);
```

### 2. Index Selection

```
┌─────────────────────────────────────────────────────────────────────┐
│  INDEX DECISION GUIDE                                              │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  Query Pattern                     │ Index Strategy                 │
│  ────────────────────────────    │ ───────────────────            │
│  WHERE col = 'value'              │ Single column index          │
│  WHERE col IN (a, b, c)          │ Single column index          │
│  WHERE col LIKE 'prefix%'        │ Single column index         │
│  WHERE col > 'value'            │ Index + range scan           │
│  WHERE col = 'x' AND y > 'y'    │ Composite index (eq first)   │
│  WHERE ORDER BY col1, col2        │ Composite index (same order) │
│  WHERE col = 'x' ORDER BY y      │ Composite index             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3. EXPLAIN Analysis

```sql
EXPLAIN FORMAT=JSON
SELECT o.id, o.created_at, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'pending'
ORDER BY o.created_at DESC
LIMIT 20;

-- Check for:
-- - type: ALL (full table scan - BAD)
-- - type: const/ref/range (using index - GOOD)
-- - Using index condition: false (not using index - BAD)
-- - rows: High number (expensive scan - BAD)
```

## Query Optimization

### 1. Avoid Common Pitfalls

```sql
-- BAD: Function on indexed column
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- GOOD: Range on column itself
SELECT * FROM users
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- BAD: Implicit type conversion
SELECT * FROM users WHERE id = '123';  -- id is INT

-- GOOD: Match types
SELECT * FROM users WHERE id = 123;

-- BAD: OR on different columns
SELECT * FROM users WHERE email = 'x' OR phone = 'x';

-- GOOD: UNION for separate indexes
SELECT * FROM users WHERE email = 'x'
UNION
SELECT * FROM users WHERE phone = 'x' AND email <> 'x';
```

### 2. Pagination

```sql
-- Offset pagination (slow for large offsets)
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 10000;

-- Cursor pagination (fast, consistent)
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
  AND category_id = 5
ORDER BY id
LIMIT 20;
```

### 3. JOIN Optimization

```sql
-- Ensure join columns are indexed
ALTER TABLE orders ADD INDEX idx_customer (customer_id);

-- Use STRAIGHT_JOIN when optimizer chooses wrong join order
SELECT STRAIGHT_JOIN o.id, c.name
FROM orders o
STRAIGHT_JOIN customers c ON o.customer_id = c.id;

-- Avoid SELECT * in joins
SELECT o.id, o.total, c.name, c.email
FROM orders o
JOIN customers c ON o.customer_id = c.id;
```

## Partitioning

### 1. Range Partitioning

```sql
CREATE TABLE sales (
  id BIGINT AUTO_INCREMENT,
  sale_date DATE NOT NULL,
  amount DECIMAL(10,2),
  PRIMARY KEY (id, sale_date)
) PARTITION BY RANGE (YEAR(sale_date)) (
  PARTITION p2022 VALUES LESS THAN (2023),
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- Query only relevant partitions
SELECT * FROM sales
WHERE sale_date >= '2024-01-01' AND sale_date < '2025-01-01';
```

### 2. List Partitioning

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT,
  region VARCHAR(10),
  email VARCHAR(255),
  PRIMARY KEY (id, region)
) PARTITION BY LIST COLUMNS(region) (
  PARTITION north VALUES IN ('NY', 'MA', 'CT'),
  PARTITION south VALUES IN ('FL', 'TX', 'GA'),
  PARTITION west VALUES IN ('CA', 'WA', 'OR')
);
```

## Replication

### 1. Async Replication

```sql
-- On master
CREATE USER 'replica'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'replica';
FLUSH PRIVILEGES;

SHOW MASTER STATUS;
-- Note: binlog.000001, position 123

-- On replica
CHANGE MASTER TO
  MASTER_HOST = 'master-host',
  MASTER_USER = 'replica',
  MASTER_PASSWORD = 'password',
  MASTER_LOG_FILE = 'binlog.000001',
  MASTER_LOG_POS = 123;

START SLAVE;
SHOW SLAVE STATUS\G
```

### 2. GTID Replication

```sql
-- Enable GTID on both master and replica
SET @@GLOBAL.GTID_MODE = ON;
SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = ON;

-- Replica auto-positioning
CHANGE MASTER TO
  MASTER_AUTO_POSITION = 1;

-- Failover with GTID
STOP SLAVE;
CHANGE MASTER TO MASTER_HOST = 'new-master';
START SLAVE;
```

### 3. Read Replica Routing

```typescript
// Node.js example
function getConnection(isWrite: boolean) {
  if (isWrite) {
    return masterPool;  // Write to master
  }
  // Read from replica
  const replicas = [replica1Pool, replica2Pool];
  return replicas[Math.floor(Math.random() * replicas.length)];
}

// Write operation
const conn = getConnection(true);
await conn.query('INSERT INTO orders ...');

// Read operation
const conn = getConnection(false);
const results = await conn.query('SELECT * FROM orders ...');
```

## InnoDB Optimization

### 1. Buffer Pool

```sql
-- Check buffer pool size
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';

-- Set buffer pool size (in bytes)
SET GLOBAL innodb_buffer_pool_size = 16 * 1024 * 1024 * 1024; -- 16GB

-- Warm buffer pool
SELECT COUNT(*) FROM users;  -- Full table scan loads data

-- Monitor buffer pool
SHOW ENGINE INNODB STATUS;
```

### 2. Transaction Isolation

```sql
-- Check current isolation
SELECT @@transaction_isolation;

-- Isolation levels
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

### 3. Lock Monitoring

```sql
-- Check locks
SHOW ENGINE INNODB STATUS;

-- Find blocking queries
SELECT * FROM information_schema.INNODB_LOCK_WAITS;

-- Kill blocking query
KILL <thread_id>;
```

## Best Practices

1. **Use InnoDB** - Default engine with row-level locking
2. **Primary keys** - Always define a primary key
3. **Avoid SELECT *** - Specify needed columns
4. **Use prepared statements** - For repeated queries
5. **Batch inserts** - Use INSERT VALUES (...), multiple rows
6. **Monitor slow queries** - Enable slow_query_log
7. **Use connection pooling** - Don't connect per query
8. **Partition large tables** - By date or range

---

*Author: TheVoidSyntax*
