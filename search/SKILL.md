---
name: search
description: Search engine implementation including Elasticsearch, full-text search, and indexing
when_to_use: "Use when implementing search: Elasticsearch, full-text search, or indexing."
version: "1.0.0"
category: [backend, data]
priority: low
phase: phase-3
tech_stack:
  services: [elasticsearch, opensearch, meilisearch]
scale: [medium, large]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/elasticsearch/**"
      reason: "Elasticsearch detected"
  skill_tier: optional
capabilities: [implementation, analysis]
quality:
  rules_count: 10
  examples_count: 15
  stability: stable
integrates_with: [database, scalability]
source:
  origin: local
author: thevoidsyntax
---

# SEARCH MODULE

Kamu adalah Search Specialist. Gunakan rules ini untuk setiap aspek search engine implementation.

---

## 1. ELASTICSEARCH CONFIGURATION
- **Cluster Setup:**
  - Master nodes (3 for HA)
  - Data nodes (sharded)
  - Coordinating nodes (for queries)
- **Index Design:**
  - Shard count based on data size
  - Replica count for redundancy
  - Index aliases for zero-downtime
- **Mapping:**
  - Explicit field mapping
  - Appropriate data types
  - Analyzer selection
- **Performance:**
  - Refresh interval
  - Translog settings
  - Bulk indexing

## 2. FULL-TEXT SEARCH PATTERNS
- **Analyzers:**
  - Standard analyzer
  - Language-specific (English, Indonesian, etc.)
  - Custom analyzers
- **Tokenizers:**
  - Standard
  - Edge n-gram
  - Whitespace
- **Filters:**
  - Lowercase
  - Stop words
  - Synonyms
  - Stemming
- **Best Practices:**
  - Analyze query and document same way
  - Test with real queries
  - Tune for recall vs precision

## 3. SEARCH RANKING OPTIMIZATION
- **Scoring:**
  - TF-IDF
  - BM25 (Elasticsearch default)
  - Custom scoring
- **Boosting:**
  - Field boosting
  - Document boosting
  - Recency boosting
- **Relevance Tuning:**
  - Query profiling
  - A/B testing
  - User feedback
- **Factors:**
  - Text match
  - Recency
  - Popularity
  - Location

## 4. SEARCH INDEXING STRATEGY
- **Real-time Indexing:**
  - Immediate availability
  - High indexing load
- **Batch Indexing:**
  - Scheduled bulk indexing
  - Lower resource usage
  - Data warehouse sync
- **Index Lifecycle:**
  - Hot indices (recent data)
  - Warm indices (historical)
  - Cold/delete indices
- **Data Sync:**
  - Database CDC
  - Message queue
  - Scheduled polling

## 5. SEARCH QUERY OPTIMIZATION
- **Query Types:**
  - Match query
  - Multi-match query
  - Term query
  - Range query
- **Performance:**
  - Filter vs query context
  - Limit returned fields
  - Pagination
- **Aggregations:**
  - Faceted search
  - Histograms
  - Terms aggregation
- **Caching:**
  - Query cache
  - Filter cache
  - Request cache

## 6. SEARCH AUTOCOMPLETE
- **Implementation:**
  - Edge n-gram
  - Completion suggester
  - Search-as-you-type
- **Performance:**
  - Pre-compute suggestions
  - Cache frequent queries
  - Limit suggestions
- **UX:**
  - Debounce input
  - Show popular first
  - Handle typos
- **Ranking:**
  - Popularity
  - Recency
  - Exact match

## 7. SEARCH FACETS & FILTERS
- **Faceted Search:**
  - Categories
  - Price ranges
  - Attributes
- **Filter Options:**
  - Checkbox filters
  - Range sliders
  - Color swatches
- **Implementation:**
  - Aggregations
  - Post-filter vs filter aggregation
- **Performance:**
  - Cached aggregations
  - Async facets

## 8. SYNONYMS & SPELLING
- **Synonym Management:**
  - Synonym dictionary
  - Synonym rules
  - Multi-language
- **Spelling Correction:**
  - Fuzzy matching
  - Phonetic matching
  - Did you mean suggestions
- **Implementation:**
  - Build synonym dictionary
  - Update analyzer
  - Test coverage
- **Maintenance:**
  - Regular updates
  - User feedback integration
  - A/B testing

## 9. SEARCH ANALYTICS
- **Query Analytics:**
  - Popular queries
  - Zero-result queries
  - Click-through rate
- **Performance:**
  - Query latency
  - Index size
  - Resource usage
- **User Behavior:**
  - Search to click
  - Refinement patterns
  - Session analysis
- **Optimization:**
  - Identify slow queries
  - Tune popular queries
  - Index optimization

## 10. SEARCH SECURITY
- **Document-level Security:**
  - Filter by user access
  - Field-level security
  - Tenant isolation
- **Query Validation:**
  - Limit query complexity
  - Resource limits
  - Timeout settings
- **Audit Logging:**
  - Search queries
  - Access patterns
  - Anomalies
- **Compliance:**
  - Data retention
  - PII handling
  - GDPR compliance

## 11. SEARCH MIGRATION
- **Reindexing:**
  - Create new index
  - Bulk reindex
  - Alias switch
- **Zero-downtime:**
  - Index aliases
  - Blue-green
  - Point-in-time
- **Validation:**
  - Result comparison
  - Performance testing
  - Smoke tests
- **Rollback:**
  - Keep old index
  - Quick switch back
  - Verification

## 12. ALTERNATIVE SEARCH ENGINES
- **Meilisearch:**
  - Simple, fast
  - Typo-tolerant
  - Great for small-medium
- **Typesense:**
  - Faceting
  - Grouping
  - Real-time
- **Algolia:**
  - Managed service
  - Excellent UX
  - Instant search
- **OpenSearch:**
  - Elasticsearch fork
  - AWS managed
  - Community-driven

---

**Invoke:** `/search` | **Priority:** LOW | **Version:** 1.0
