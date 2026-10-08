---
name: scalability
description: Scalability best practices including auto-scaling, read replicas, and CDN strategies
version: "1.0.0"
category: [infrastructure]
priority: medium
phase: phase-6
tech_stack:
  services: [aws, gcp, azure, kubernetes]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - phase: phase-6
      reason: "Optimization phase"
  skill_tier: optional
capabilities: [implementation, analysis]
quality:
  rules_count: 12
  examples_count: 18
  stability: stable
integrates_with: [performance, reliability, observability]
source:
  origin: local
author: Claude
---

# SCALABILITY MODULE

Kamu adalah Scalability Specialist. Gunakan rules ini untuk setiap aspek scaling dan performance optimization.

---

## 1. HORIZONTAL SCALING
- **Stateless Services:**
  - No local state in application
  - Session data in external store (Redis, DB)
  - Sticky sessions disabled
- **Auto-Scaling Configuration:**
  - **Metrics-based:**
    - CPU utilization: Scale up at 70%, scale down at 30%
    - Memory utilization: Scale up at 75%, scale down at 40%
    - Request rate: Scale based on requests per second
  - **Custom metrics:** Business-specific scaling signals
- **Scaling Behavior:**
  - Cooldown period: 3-5 minutes between scale events
  - Scale-up speed: Fast untuk demand spikes
  - Scale-down speed: Slow dan conservative
  - Minimum instances: 2+ for production (avoid single point of failure)
- **Predictive Scaling:**
  - Schedule-based scaling untuk known patterns
  - ML-based prediction untuk trends
  - Buffer capacity untuk unexpected spikes

## 2. VERTICAL SCALING
- **Resource Upgrading:**
  - CPU: More cores atau faster processors
  - Memory: Increase RAM for caching
  - Storage: Faster disks (SSD/NVMe)
- **Vertical Scaling Limits:**
  - diminishing returns at high specs
  - Single point of failure
  - Machine-dependent ceiling
- **Best Practices:**
  - Use vertical scaling untuk initial growth
  - Plan transition ke horizontal scaling
  - Monitor resource utilization trends

## 3. READ REPLICAS & DATA SCALING
- **Read Replica Architecture:**
  - Primary: All writes
  - Replicas: Read-only queries
  - Asynchronous replication (eventual consistency)
- **Replica Configuration:**
  - 2-5 replicas for read-heavy workloads
  - Connection pooling dengan replica routing
  - Read-after-write consistency handling
- **Data Sharding:**
  - Horizontal partitioning (sharding)
  - Shard key selection: High cardinality, even distribution
  - Cross-shard queries: Application-level aggregation
- **Consistent Hashing:**
  - Minimize data movement saat adding/removing nodes
  - Virtual nodes untuk better distribution
  - Rebalancing strategy

## 4. CDN & EDGE CACHING
- **CDN Configuration:**
  - Cache static assets (images, CSS, JS, fonts)
  - Origin shield untuk reduce origin load
  - Geo-distribution untuk global latency
- **Cache-Control Headers:**
  - Static assets: `max-age=31536000, immutable`
  - Dynamic content: `max-age=0, must-revalidate`
  - API responses: `max-age=60` atau appropriate TTL
- **CDN Features:**
  - Image optimization (WebP, AVIF)
  - Brotli/Gzip compression
  - HTTP/2 or HTTP/3 support
- **Edge Computing:**
  - Serverless functions at edge (Cloudflare Workers, Lambda@Edge)
  - A/B testing at edge
  - Geographic routing

## 5. DATABASE SCALING
- **Connection Pooling:**
  - PgBouncer (PostgreSQL)
  - ProxySQL (MySQL)
  - Application-level pooling
- **Pool Configuration:**
  - Min connections: 5-10
  - Max connections: Based on DB capacity
  - Connection timeout: 5-10 seconds
  - Idle timeout: 5-10 minutes
- **Query Optimization:**
  - Index optimization
  - Query plan analysis
  - Slow query logging
  - Query timeout limits
- **Database Selection:**
  - OLTP: PostgreSQL, MySQL
  - OLAP: ClickHouse, Redshift, BigQuery
  - Document: MongoDB, DynamoDB
  - Graph: Neo4j, Amazon Neptune

## 6. CACHING STRATEGY
- **Cache Tiers:**
  - L1: In-memory (per instance) — fastest
  - L2: Redis/Memcached (distributed) — shared
  - L3: CDN (edge) — for static content
- **Cache Patterns:**
  - **Cache-Aside:** Application manages cache
  - **Read-Through:** Cache auto-loads on miss
  - **Write-Through:** Update cache with DB write
  - **Write-Behind:** Async cache update
- **Cache Invalidation:**
  - TTL-based: Simple, eventual consistency
  - Event-based: Invalidate on data change
  - Version-based: Cache key dengan version
- **Cache Stampede Prevention:**
  - Mutex/lock during cache miss
  - Stale-while-revalidate
  - probabilistic early expiration

## 7. LOAD BALANCING
- **Load Balancing Algorithms:**
  - **Round Robin:** Simple, even distribution
  - **Least Connections:** Route to least busy
  - **IP Hash:** Session affinity
  - **Weighted:** Performance-based routing
- **Health Checks:**
  - TCP connect check
  - HTTP health endpoint
  - Passive health detection
- **SSL Termination:**
  - Terminate SSL at load balancer
  - Certificate management
  - Modern TLS versions only (1.2, 1.3)
- **Load Balancer Options:**
  - L4 (TCP): High throughput, low latency
  - L7 (HTTP): Advanced routing, SSL termination

## 8. MICROSERVICES SCALING
- **Service Decomposition:**
  - Independent deployability
  - Database per service (or schema per service)
  - API contracts between services
- **Service Discovery:**
  - Client-side discovery (Eureka, Consul)
  - Server-side discovery (AWS ALB)
  - DNS-based discovery
- **API Gateway:**
  - Single entry point
  - Authentication/Authorization
  - Rate limiting
  - Request routing
- **Service Mesh:**
  - Traffic management
  - Observability
  - Security (mTLS)

## 9. MESSAGE QUEUE SCALING
- **Partitioning:**
  - Kafka topics: Multiple partitions
  - Parallel consumer processing
  - Partition-aware producers
- **Consumer Scaling:**
  - Consumer group untuk parallel processing
  - Rebalance on consumer addition/removal
  - Sticky sessions untuk ordering
- **Throughput Optimization:**
  - Batching untuk efficiency
  - Compression (lz4, zstd)
  - Acknowledgment batching
- **Queue Management:**
  - Monitor queue depth
  - TTL untuk messages
  - DLQ for failed messages

## 10. GEOGRAPHIC SCALING
- **Multi-Region Architecture:**
  - Active-Active: All regions serve traffic
  - Active-Passive: Standby for failover
  - Read replicas untuk local reads
- **Data Replication:**
  - Synchronous: Strong consistency, higher latency
  - Asynchronous: Eventual consistency, lower latency
  - Conflict resolution strategies
- **Latency Optimization:**
  - Geographic routing (DNS-based)
  - Edge caching
  - Local data stores
- **Failover Strategy:**
  - Automated failover detection
  - DNS TTL management
  - Health check configuration

## 11. PERFORMANCE OPTIMIZATION
- **Application Performance:**
  - Async I/O untuk I/O-bound operations
  - Connection pooling
  - Batch operations where possible
- **Database Performance:**
  - Query optimization
  - Index strategy
  - Connection management
- **Network Performance:**
  - HTTP/2 or HTTP/3
  - Keep-alive connections
  - Response compression
- **Caching Strategy:**
  - Multi-level caching
  - Cache warming
  - Cache monitoring

## 12. CAPACITY PLANNING
- **Demand Forecasting:**
  - Historical growth analysis
  - Seasonal patterns
  - Product roadmap impact
- **Capacity Modeling:**
  - Current utilization analysis
  - Growth projections
  - Headroom calculation
- **Cost Optimization:**
  - Reserved instances untuk baseline
  - Spot/preemptible untuk flexible workloads
  - Right-sizing untuk efficiency
- **Scaling Triggers:**
  - Define clear thresholds
  - Automated scaling policies
  - Manual override capability

---

**Invoke:** `/scalability` | **Priority:** MEDIUM | **Version:** 1.0
