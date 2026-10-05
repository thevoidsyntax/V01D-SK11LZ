---
name: integration-patterns
description: "Integration patterns including ETL/ELT and API composition patterns."
version: "1.0"
---

# INTEGRATION PATTERNS MODULE

Kamu adalah Integration Specialist. Gunakan rules ini untuk setiap aspek system integration.

---

## 1. ETL/ELT PATTERNS
- **ETL (Extract-Transform-Load):**
  - Transform before load
  - Data cleaning
  - Schema transformation
- **ELT (Extract-Load-Transform):**
  - Load raw data first
  - Transform in destination
  - Cloud data warehouses
- **CDC (Change Data Capture):**
  - Incremental changes
  - Log-based
  - Near real-time
- **Tools:**
  - Apache Airflow
  - dbt
  - Fivetran
  - Debezium

## 2. API COMPOSITION
- **API Gateway:**
  - Single entry point
  - Request routing
  - Protocol translation
- **BFF Pattern:**
  - Backend for Frontend
  - Client-specific aggregation
  - Data shape optimization
- **GraphQL Federation:**
  - Schema stitching
  - Subgraph composition
  - Entity resolution
- **REST Composition:**
  - Aggregator service
  - Parallel calls
  - Response merging

## 3. DATA VIRTUALIZATION
- **Concept:**
  - Unified data view
  - No physical replication
  - Query federation
- **Tools:**
  - Dremio
  - Presto/Trino
  - Apache Drill
- **Benefits:**
  - Single source of truth
  - Real-time data
  - Reduced duplication
- **Challenges:**
  - Performance
  - Security
  - Query complexity

## 4. WEBHOOK INTEGRATION
- **Pattern:**
  - Push-based integration
  - Event notification
  - HTTP callback
- **Security:**
  - Signature verification
  - Token-based auth
  - IP whitelisting
- **Reliability:**
  - Retry with backoff
  - Idempotent handlers
  - Dead letter queue
- **Best Practices:**
  - Async processing
  - Event deduplication
  - Payload validation

## 5. FILE-BASED INTEGRATION
- **Patterns:**
  - Shared file system
  - SFTP
  - Object storage
- **Processing:**
  - Polling mechanism
  - File watcher
  - Batch processing
- **Reliability:**
  - Atomic moves
  - Processing flags
  - Idempotent processing
- **Best Practices:**
  - Naming conventions
  - File locking
  - Processing acknowledgment

## 6. DATABASE SHARING
- **Shared Database:**
  - Common schema
  - Cross-team access
  - Coupling risk
- **Schema Sharing:**
  - Shared database, separate schemas
  - Namespace isolation
  - Cross-schema queries
- **CDC for Sharing:**
  - Change streams
  - Independent databases
  - Near real-time sync
- **Considerations:**
  - Coupling
  - Performance
  - Data ownership

## 7. EVENT-BASED INTEGRATION
- **Event Streaming:**
  - Apache Kafka
  - Cloud streams
  - Message queues
- **Schema Registry:**
  - Schema definition
  - Versioning
  - Compatibility
- **Event Schema:**
  - CloudEvents spec
  - Standard attributes
  - Extensibility
- **Consumer Groups:**
  - Load balancing
  - Independent processing
  - Offset management

## 8. ORCHESTRATION VS CHOREOGRAPHY
- **Orchestration:**
  - Central coordinator
  - Explicit flow
  - Visible workflow
- **Choreography:**
  - Distributed logic
  - Event-driven
  - Loose coupling
- **Hybrid:**
  - Domain orchestration
  - Cross-domain events
  - Best of both
- **Selection:**
  - Complexity
  - Visibility needs
  - Team structure

## 9. LEGACY INTEGRATION
- **Patterns:**
  - Anti-Corruption Layer
  - Strangler Fig
  - Decorating Proxies
- **Techniques:**
  - Protocol translation
  - Data transformation
  - Process adaptation
- **Migration:**
  - Incremental replacement
  - Parallel running
  - Gradual cutover
- **Risks:**
  - Hidden dependencies
  - Performance impact
  - Data consistency

## 10. B2B INTEGRATION
- **Protocols:**
  - AS2, AS4
  - EDI (X12, EDIFACT)
  - OFTP (Odette FTP)
- **Standards:**
  - Industry-specific
  - Document formats
  - Trading partner agreements
- **Platforms:**
  - B2B gateway
  - Managed file transfer
  - Integration platform
- **Security:**
  - Certificate management
  - Encryption
  - Non-repudiation

## 11. MOBILE INTEGRATION
- **Backend APIs:**
  - REST/GraphQL
  - Push notifications
  - Offline sync
- **Real-time:**
  - WebSocket
  - SSE
  - Push services
- **Security:**
  - OAuth2 with PKCE
  - Token refresh
  - Biometric auth
- **Optimization:**
  - Request batching
  - Payload compression
  - Response caching

## 12. THIRD-PARTY INTEGRATION
- **Patterns:**
  - Adapter pattern
  - Anti-corruption layer
  - Retry wrapper
- **Reliability:**
  - Circuit breaker
  - Timeout handling
  - Fallback data
- **Testing:**
  - Contract testing
  - Mock services
  - Recording proxies
- **Management:**
  - Rate limiting
  - Cost tracking
  - Dependency monitoring

---

**Invok:** `/integration-patterns` | **Priority:** MEDIUM | **Version:** 1.0
