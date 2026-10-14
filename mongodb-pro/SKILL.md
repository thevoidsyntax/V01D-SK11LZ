---
name: mongodb-pro
description: "MongoDB optimization with indexing, aggregation pipelines, replica sets, and document modeling patterns."
version: "1.0.0"
category: [data, backend]
priority: high
phase: any
tech_stack:
  databases: [mongodb]
  languages: [javascript, typescript, python, go]
scale: [medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/mongodb*"
      reason: "MongoDB connection detected"
    - has_file: "**/mongoose*"
      reason: "Mongoose ODM detected"
    - has_file: "**/mongooose*"
      reason: "MongoDB native driver detected"
    - tech_stack: [mongodb]
      reason: "MongoDB detected"
  skill_tier: context
triggers:
  phrases:
    - "mongodb"
    - "mongo"
    - "document database"
    - "nosql"
    - "mongoose"
capabilities: [implementation, analysis, optimization]
dependencies: [database, scalability]
integrates_with: [database, scalability, data-engineering]
---

# MONGODB-PRO v1.0

MongoDB specialist for document modeling, indexing, and aggregation optimization.

## Tech Stack

| Component | Technologies |
|-----------|-------------|
| Drivers | Node.js (mongodb), Python (pymongo), Go (mongo-go-driver) |
| ODM | Mongoose, Typegoose, Prisma |
| Tools | mongosh, MongoDB Compass, Atlas |
| Atlas Services | Search, Charts, Data Lake |

## Document Modeling

### 1. Schema Design Principles

```
┌─────────────────────────────────────────────────────────────────────┐
│  EMBEDDED vs REFERENCE                                      │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  EMBEDDED (denormalized)     │ REFERENCE (normalized)          │
│  ───────────────────────────── │ ────────────────────────          │
│  • 1:1 with small data       │ • 1:N or N:N relationships  │
│  • Data accessed together     │ • Data accessed separately      │
│  • Rarely updated            │ • Frequently updated           │
│  • < 16MB document limit    │ • Large arrays                │
│                                                                      │
│  Example: User + Address     │ Example: Author + Books       │
│  {                             │ Author: {                    │
│    name: "John",             │   _id, name, bio             │
│    address: {                │ }                            │
│      street: "...",           │ Book: {                      │
│      city: "..."             │   _id, title, authorId        │
│    }                         │ }                            │
│  }                            │                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Schema Design Patterns

```javascript
// Pattern 1: Polymorphic Schema
const EventSchema = new Schema({
  eventType: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  metadata: {
    userId: ObjectId,
    timestamp: Date
  }
});

// Pattern 2: Attribute Pattern (for optional fields)
const ProductSchema = new Schema({
  name: String,
  // Attribute pattern for dynamic attributes
  attributes: {
    type: Map,
    of: String
  }
});

// Pattern 3: Bucket Pattern (for time-series)
const DailyMetricsSchema = new Schema({
  date: Date,
  metrics: [{
    metricName: String,
    value: Number
  }]
});

// Pattern 4: Outlier Pattern (for rare large values)
const UserSchema = new Schema({
  name: String,
  email: String,
  // Store large data separately
  largeData: { type: ObjectId, ref: 'UserLargeData' }
});
```

## Indexing Strategies

### 1. Index Types

```javascript
// Single field index
db.users.createIndex({ email: 1 }, { unique: true });

// Compound index (field order matters!)
db.orders.createIndex({ status: 1, createdAt: -1 });
// Good for: { status: "pending", createdAt: { $gt: ... } }

// Partial index (smaller, faster)
db.orders.createIndex(
  { userId: 1 },
  { partialFilterExpression: { status: "active" } }
);

// Wildcard index (for dynamic fields)
db.products.createIndex({ "specs.$**": 1 });

// Text index (for search)
db.articles.createIndex(
  { title: "text", content: "text" },
  { weights: { title: 10, content: 1 } }
);
```

### 2. Index Selection

```
┌─────────────────────────────────────────────────────────────────────┐
│  INDEX DECISION TREE                                                │
├─────────────────────────────────────────────────────────────┤
│                                                                      │
│  Is field in WHERE clause?                                          │
│  ├── YES → Is equality? → Create index                          │
│  ├── YES → Is range? → Compound index with equality first         │
│  ├── YES → Is sort? → Include in compound index                 │
│  └── NO → Is in SORT? → Index may help                         │
│                                                                      │
│  Index Cardinality:                                                  │
│  ├── Low cardinality (status: 3 values) → Consider covered query │
│  └── High cardinality (userId: millions) → Index will help       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Aggregation Pipelines

### 1. Basic Pipeline

```javascript
// Match → Group → Sort → Limit
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$amount" },
      orderCount: { $sum: 1 }
  }},
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
]);
```

### 2. Advanced Patterns

```javascript
// Lookup (JOIN equivalent)
db.orders.aggregate([
  { $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
  }},
  { $unwind: "$customer" },
  { $project: {
      orderId: "$_id",
      customerName: "$customer.name",
      amount: 1
  }}
]);

// Facet (multiple pipelines in one)
db.orders.aggregate([
  { $facet: {
      totalRevenue: [
        { $group: { _id: null, total: { $sum: "$amount" } }
      ],
      byStatus: [
        { $group: { _id: "$status", count: { $sum: 1 } }
      ],
      topCustomers: [
        { $group: { _id: "$customerId", total: { $sum: "$amount" } },
        { $sort: { total: -1 },
        { $limit: 5 }
      ]
  }}
]);
```

### 3. Pipeline Optimization

```javascript
// Put $match early to reduce documents
// BAD: Matches after $lookup
{ $lookup: {...} }
{ $match: { status: "pending" } }

// GOOD: Matches first
{ $match: { status: "pending" } }
{ $lookup: {...} }

// Use $limit early when possible
{ $limit: 10 }
{ $lookup: {...}  // Only joins 10 docs
```

## Replication & High Availability

### 1. Replica Set Configuration

```javascript
// Connection string for replica set
const uri = "mongodb://host1:27017,host2:27018,host3:27019/db?replicaSet=mySet";

// Read preferences
const secondaryRead = db.collection.find(query, {
  readPreference: 'secondaryPreferred'
});

// Write concern for durability
db.collection.insertOne(doc, { writeConcern: { w: "majority", wtimeout: 5000 } });
```

### 2. Change Streams (Real-time)

```javascript
// Watch for changes
const changeStream = collection.watch([
  { $match: { operationType: { $in: ['insert', 'update', 'delete'] } }
]);

changeStream.on('change', (change) => {
  console.log('Change:', change);
});

// Pipeline for filtered changes
const pipeline = [
  { $match: { 'fullDocument.status': 'pending' } }
];
const stream = collection.watch(pipeline);
```

## Performance Optimization

### 1. Query Optimization

```javascript
// Use projection to limit fields
db.users.find({ active: true }, {
  projection: { name: 1, email: 1 }  // Only return these fields
});

// Explain query plan
db.orders.explain("executionStats").find({ status: "pending" });

// Hint for index selection
db.orders.find({ status: "pending" }).hint({ status: 1, createdAt: -1 });
```

### 2. Connection Pooling

```javascript
// Node.js driver
const client = new MongoClient(uri, {
  maxPoolSize: 10,           // Max connections
  minPoolSize: 5,            // Min connections
  maxIdleTimeMS: 30000,      // Idle timeout
  connectTimeoutMS: 10000,    // Connection timeout
  socketTimeoutMS: 45000      // Socket timeout
});
```

### 3. Data Migration

```javascript
// Atomic operations for migrations
db.collection.updateMany(
  { field: { $exists: false } },
  { $set: { field: "defaultValue" } }
);

// Split large updates
async function migrateInBatches(collection, query, update) {
  let processed = 0;
  do {
    const result = await collection.updateMany(
      { ...query, _id: { $gt: processed } },
      update
    );
    processed += result.modifiedCount;
  } while (processed > 0);
}
```

## Best Practices

1. **Use meaningful _id** - Don't auto-generate if natural key exists
2. **Avoid large documents** - 16MB limit; normalize if approaching
3. **Index wisely** - Each index costs write overhead
4. **Use $lookup sparingly** - Multiple lookups are expensive
5. **Prefer aggregation over mapReduce** - Aggregation is more optimized
6. **Use covered queries** - Index includes all needed fields
7. **Monitor with Atlas** - Use built-in performance advisor
8. **Set appropriate write concern** - Balance durability vs performance

---

*Author: TheVoidSyntax*
