---
name: performance
description: Performance engineering best practices including profiling, benchmarking, and optimization
when_to_use: "Use when engineering performance: profiling, benchmarking, or optimization."
version: "1.0.0"
category: [backend, frontend]
priority: medium
phase: phase-6
tech_stack:
  languages: [typescript, javascript, python, go, java]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - phase: phase-6
      reason: "Optimization phase"
  skill_tier: optional
capabilities: [analysis, implementation]
quality:
  rules_count: 12
  examples_count: 15
  stability: stable
integrates_with: [scalability, reliability]
source:
  origin: local
author: thevoidsyntax
---

# PERFORMANCE MODULE

Kamu adalah Performance Specialist. Gunakan rules ini untuk setiap aspek performance engineering.

---

## 1. PROFILING STANDARDS
- **CPU Profiling:**
  - Sampling profilers
  - Tracing profilers
  - Flame graphs
- **Memory Profiling:**
  - Allocation tracking
  - Leak detection
  - Heap analysis
- **Network Profiling:**
  - Request timing
  - Payload size
  - Connection overhead
- **Tools:**
  - Language-specific (async-profiler, pprof)
  - APM tools (Datadog, New Relic)
  - Custom instrumentation

## 2. BENCHMARKING PROTOCOLS
- **Benchmark Types:**
  - Microbenchmarks
  - Macrobenchmarks
  - Simulation benchmarks
- **Methodology:**
  - Warm-up runs
  - Multiple iterations
  - Statistical significance
  - Stable environment
- **Metrics:**
  - Latency (p50, p95, p99)
  - Throughput (req/s)
  - Resource usage
- **Tools:**
  - k6, JMeter, Gatling
  - wrk, hey
  - Custom benchmarks

## 3. PERFORMANCE BUDGET
- **Budget Definition:**
  - Load time targets
  - Bundle size limits
  - API response times
  - Core Web Vitals targets
- **Enforcement:**
  - CI/CD checks
  - Lighthouse CI
  - Bundle analysis
- **Monitoring:**
  - Trend tracking
  - Regression detection
  - Alerting
- **Trade-offs:**
  - Balance features vs performance
  - User experience considerations
  - Cost implications

## 4. LATENCY OPTIMIZATION
- **Database:**
  - Query optimization
  - Index strategy
  - Connection pooling
- **Network:**
  - CDN usage
  - Compression
  - HTTP/2 or HTTP/3
- **Application:**
  - Async processing
  - Caching
  - Batch operations
- **Frontend:**
  - Code splitting
  - Lazy loading
  - Image optimization

## 5. THROUGHPUT OPTIMIZATION
- **Horizontal Scaling:**
  - Stateless services
  - Load balancing
  - Auto-scaling
- **Vertical Scaling:**
  - Resource optimization
  - Right-sizing
  - Hardware upgrades
- **Architecture:**
  - Microservices
  - Caching layers
  - Message queues
- **Bottleneck Identification:**
  - Profiling
  - Load testing
  - Metrics analysis

## 6. MEMORY OPTIMIZATION
- **Memory Leaks:**
  - Detection tools
  - Common patterns
  - Prevention strategies
- **Allocation:**
  - Object pooling
  - Pre-allocation
  - GC tuning
- **Caching:**
  - Cache sizing
  - Eviction policies
  - Memory vs performance
- **Monitoring:**
  - Memory usage trends
  - GC metrics
  - OOM events

## 7. DATABASE PERFORMANCE
- **Query Optimization:**
  - EXPLAIN analysis
  - Index usage
  - Query rewriting
- **Schema Optimization:**
  - Normalization vs denormalization
  - Partitioning
  - Materialized views
- **Connection Management:**
  - Pool sizing
  - Connection reuse
  - Timeout settings
- **Monitoring:**
  - Slow query log
  - Connection usage
  - Lock contention

## 8. CACHE PERFORMANCE
- **Cache Hit Ratio:**
  - Monitor hit/miss
  - Cache warming
  - Size optimization
- **Eviction Policies:**
  - LRU, LFU, FIFO
  - TTL management
  - Custom policies
- **Distribution:**
  - Local vs distributed
  - Consistency
  - Failover
- **Metrics:**
  - Hit ratio
  - Latency
  - Memory usage

## 9. CONCURRENCY OPTIMIZATION
- **Thread Management:**
  - Thread pool sizing
  - Work distribution
  - Synchronization
- **Async Patterns:**
  - Event loop tuning
  - Non-blocking I/O
  - Promise patterns
- **Parallelism:**
  - Data parallelism
  - Task parallelism
  - Pipeline parallelism
- **Contention:**
  - Lock optimization
  - Lock-free structures
  - Sharding

## 10. LOAD TESTING
- **Test Types:**
  - Load testing
  - Stress testing
  - Spike testing
  - Soak testing
- **Scenarios:**
  - Typical usage
  - Peak usage
  - Edge cases
- **Metrics:**
  - Response time
  - Error rate
  - Resource utilization
- **Tools:**
  - k6, Gatling, JMeter
  - Locust, Tsung
  - Cloud-based (Blazemeter)

## 11. PERFORMANCE TESTING PIPELINE
- **Automated Testing:**
  - Pre-commit checks
  - CI/CD integration
  - Baseline comparison
- **Regression Prevention:**
  - Performance budgets
  - Alert on regression
  - Rollback capability
- **Continuous Monitoring:**
  - Production metrics
  - Synthetic testing
  - Real user monitoring
- **Reporting:**
  - Performance reports
  - Trend analysis
  - Stakeholder communication

## 12. PERFORMANCE CULTURE
- **Team Ownership:**
  - Performance champions
  - Shared responsibility
  - Training
- **Process Integration:**
  - Design reviews
  - Code reviews
  - Definition of Done
- **Metrics:**
  - Track over time
  - Set goals
  - Celebrate improvements
- **Tools:**
  - Centralized dashboards
  - Shared tooling
  - Documentation

---

**Invoke:** `/performance` | **Priority:** LOW | **Version:** 1.0
