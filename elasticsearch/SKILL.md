---
name: elasticsearch
description: "Elasticsearch and OpenSearch patterns including indexing, querying, aggregations, and search optimization"
when_to_use: "Use when working with Elasticsearch or OpenSearch: indexing, queries, aggregations, or search tuning."
version: "1.0.0"
category: [database]
priority: high
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/elasticsearch", "/opensearch", "/search"]
      reason: "Search engine implementation"
    - phrase: ["elasticsearch", "opensearch", "elastic", "search engine", "full-text search"]
      reason: "Search context detected"
tech_stack:
  languages: [all]
scale: [medium, large, enterprise]
integrates_with: [database, data-engineering]
capabilities: [implementation]
quality:
  rules_count: 15
  examples_count: 8
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# Elasticsearch & OpenSearch

> Search engine patterns for full-text search, aggregations, and analytics.

## Index Management

### Index Mapping

```json
PUT /products
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "analysis": {
      "analyzer": {
        "product_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding", "product_synonyms"]
        }
      },
      "filter": {
        "product_synonyms": {
          "type": "synonym",
          "synonyms": [
            "phone, mobile, cellphone",
            "laptop, notebook, computer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "name": {
        "type": "text",
        "analyzer": "product_analyzer",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "description": {
        "type": "text",
        "analyzer": "standard"
      },
      "price": { "type": "float" },
      "category": { "type": "keyword" },
      "tags": { "type": "keyword" },
      "in_stock": { "type": "boolean" },
      "created_at": { "type": "date" },
      "rating": { "type": "float" },
      "location": { "type": "geo_point" }
    }
  }
}
```

### Dynamic Mapping

```json
PUT /logs
{
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "timestamp": { "type": "date" },
      "level": { "type": "keyword" },
      "message": { "type": "text" },
      "metadata": { "type": "object", "enabled": true }
    }
  }
}
```

## Query DSL

### Full-Text Search

```json
GET /products/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "wireless headphones",
            "fields": ["name^3", "description"],
            "type": "best_fields",
            "fuzziness": "AUTO"
          }
        }
      ],
      "filter": [
        { "term": { "in_stock": true } },
        { "range": { "price": { "lte": 100 } } }
      ],
      "should": [
        { "term": { "category": "electronics" } }
      ]
    }
  },
  "highlight": {
    "fields": {
      "name": {},
      "description": {}
    },
    "pre_tags": ["<em>"],
    "post_tags": ["</em>"]
  }
}
```

### Fuzzy Search

```json
{
  "query": {
    "fuzzy": {
      "name": {
        "value": "headphons",
        "fuzziness": "AUTO",
        "prefix_length": 2
      }
    }
  }
}
```

### Wildcard & Regex

```json
{
  "query": {
    "wildcard": {
      "product_code": "PRD-*2024"
    }
  }
}
```

## Aggregations

### Metrics Aggregations

```json
GET /products/_search
{
  "size": 0,
  "aggs": {
    "avg_price": { "avg": { "field": "price" } },
    "min_price": { "min": { "field": "price" } },
    "max_price": { "max": { "field": "price" } },
    "price_stats": { "stats": { "field": "price" } },
    "percentiles": {
      "percentiles": {
        "field": "price",
        "percents": [25, 50, 75, 95, 99]
      }
    },
    "cardinality_category": {
      "cardinality": { "field": "category" }
    }
  }
}
```

### Bucket Aggregations

```json
{
  "aggs": {
    "by_category": {
      "terms": {
        "field": "category",
        "size": 20
      },
      "aggs": {
        "avg_price": { "avg": { "field": "price" } },
        "by_brand": {
          "terms": { "field": "brand.keyword" }
        }
      }
    },
    "by_price_range": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 50 },
          { "from": 50, "to": 100 },
          { "from": 100, "to": 500 },
          { "from": 500 }
        ]
      }
    },
    "by_date": {
      "date_histogram": {
        "field": "created_at",
        "calendar_interval": "month"
      }
    }
  }
}
```

### Nested Aggregations

```json
{
  "aggs": {
    "by_category": {
      "terms": { "field": "category" },
      "aggs": {
        "top_rated": {
          "top_hits": {
            "size": 3,
            "sort": [{ "rating": "desc" }]
          }
        },
        "price_distribution": {
          "histogram": {
            "field": "price",
            "interval": 50
          }
        }
      }
    }
  }
}
```

## JavaScript/TypeScript Client

### Client Setup

```typescript
import { Client } from '@elastic/elasticsearch'

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTIC_USER!,
    password: process.env.ELASTIC_PASSWORD!
  },
  tls: {
    rejectUnauthorized: false
  }
})
```

### Indexing

```typescript
// Index single document
await client.index({
  index: 'products',
  id: 'prod_123',
  document: {
    name: 'Wireless Headphones',
    price: 79.99,
    category: 'electronics',
    in_stock: true,
    created_at: new Date().toISOString()
  },
  refresh: true // Wait for refresh
})

// Bulk indexing
const operations = products.flatMap(doc => [
  { index: { _index: 'products', _id: doc.id } },
  doc
])

const bulkResponse = await client.bulk({ 
  operations,
  refresh: true 
})

if (bulkResponse.errors) {
  const erroredDocs = bulkResponse.items.filter(i => i.index?.error)
  console.error('Failed to index:', erroredDocs)
}
```

### Searching

```typescript
async function searchProducts(query: string, filters: SearchFilters) {
  const result = await client.search({
    index: 'products',
    query: {
      bool: {
        must: [
          {
            multi_match: {
              query,
              fields: ['name^3', 'description'],
              fuzziness: 'AUTO'
            }
          }
        ],
        filter: [
          filters.category && { term: { category: filters.category } },
          filters.minPrice && { range: { price: { gte: filters.minPrice } } },
          filters.maxPrice && { range: { price: { lte: filters.maxPrice } } },
          filters.inStock && { term: { in_stock: true } }
        ].filter(Boolean)
      }
    },
    highlight: {
      fields: {
        name: {},
        description: { fragment_size: 150 }
      }
    },
    aggs: {
      categories: {
        terms: { field: 'category', size: 10 }
      },
      price_ranges: {
        range: {
          field: 'price',
          ranges: [
            { key: 'budget', to: 50 },
            { key: 'mid', from: 50, to: 200 },
            { key: 'premium', from: 200 }
          ]
        }
      }
    },
    from: (filters.page - 1) * filters.size,
    size: filters.size,
    sort: filters.sort ? [{ [filters.sort]: 'desc' }] : ['_score']
  })
  
  return {
    total: result.hits.total?.value ?? 0,
    products: result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source,
      score: hit._score,
      highlights: hit.highlight
    })),
    aggregations: result.aggregations
  }
}
```

## Performance Optimization

### 1. Use Filter Context for Exact Matches

```json
{
  "query": {
    "bool": {
      "filter": [
        { "term": { status: "active" } },
        { "term": { category: "electronics" } }
      ]
    }
  }
}
```

### 2. Avoid Wildcard on Prefix

```json
// ❌ Bad: Leading wildcard
{ "wildcard": { "field": "*search" } }

// ✅ Good: Use prefix instead
{ "prefix": { "field": "search" } }
```

### 3. Use Index Aliases

```typescript
// Create alias
await client.indices.putAlias({
  index: 'products-v2',
  name: 'products'
})

// Switch alias atomically
await client.indices.updateAliases({
  body: {
    actions: [
      { remove: { index: 'products-v1', alias: 'products' } },
      { add: { index: 'products-v2', alias: 'products' } }
    ]
  }
})
```

### 4. Scroll API for Large Exports

```typescript
async function* scrollSearch(index: string, query: object) {
  let response = await client.search({
    index,
    scroll: '5m',
    size: 1000,
    query
  })
  
  for (const hit of response.hits.hits) {
    yield hit._source
  }
  
  while (response.hits.hits.length > 0) {
    response = await client.scroll({
      scroll_id: response._scroll_id!,
      scroll: '5m'
    })
    
    for (const hit of response.hits.hits) {
      yield hit._source
    }
  }
  
  await client.clearScroll({ scroll_id: response._scroll_id! })
}
```

## Data Sync

### Logstash Pipeline

```conf
input {
  jdbc {
    jdbc_driver_library => "/path/to/mysql.jar"
    jdbc_driver_class => "com.mysql.jdbc.Driver"
    jdbc_connection_string => "jdbc:mysql://localhost:3306/mydb"
    jdbc_user => "user"
    jdbc_password => "password"
    statement => "SELECT * FROM products WHERE updated_at > :sql_last_value"
    use_column_value => true
    tracking_column => "updated_at"
    tracking_column_type => "timestamp"
  }
}

filter {
  date {
    match => ["created_at", "ISO8601"]
    target => "@timestamp"
  }
}

output {
  elasticsearch {
    hosts => ["http://localhost:9200"]
    index => "products"
    document_id => "%{id}"
  }
}
```

## Observability

### Index Monitoring

```typescript
const stats = await client.indices.stats({ index: 'products' })

console.log({
  docsCount: stats._all.primaries.docs.count,
  docsDeleted: stats._all.primaries.docs.deleted,
  storeSize: stats._all.primaries.store.size_in_bytes,
  segments: stats._all.primaries.segments.count
})
```

---

**Invoke:** /elasticsearch | **Priority:** HIGH | **Version:** 1.0.0
