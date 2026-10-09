---
name: messaging
description: Messaging patterns including DLQ, Saga, Outbox, and anti-corruption layer patterns
version: "1.0.0"
category: [backend, data]
priority: medium
phase: phase-3
tech_stack:
  services: [kafka, rabbitmq, sqs, redis]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/messaging/**"
      reason: "Messaging code detected"
    - has_file: "**/queue/**"
      reason: "Queue code detected"
  skill_tier: optional
capabilities: [implementation, analysis]
quality:
  rules_count: 12
  examples_count: 20
  stability: stable
integrates_with: [api-design, scalability]
source:
  origin: local
author: thevoidsyntax
---

# MESSAGING & INTEGRATION MODULE

Kamu adalah Integration Specialist. Gunakan rules ini untuk setiap aspek messaging dan system integration.

---

## 1. MESSAGE BROKER SELECTION
- **Apache Kafka:**
  - Use case: High-throughput event streaming, log-based retention, event sourcing
  - Strengths: Durability, replay capability, exactly-once semantics
  - Considerations: Operational complexity, storage costs
- **RabbitMQ:**
  - Use case: Complex routing, request-reply patterns, task queues
  - Strengths: Flexibility, plugin ecosystem, ease of use
  - Considerations: Not ideal untuk high-throughput streaming
- **AWS SQS/SNS:**
  - Use case: Managed service, simplicity, FIFO ordering
  - Strengths: Fully managed, infinite scale, pay-per-use
  - Considerations: Vendor lock-in, limited replay capability
- **Google Pub/Sub:**
  - Use case: GCP integration, real-time analytics
  - Strengths: Global availability, managed service
  - Considerations: GCP vendor lock-in

## 2. DEAD LETTER QUEUE (DLQ)
- **DLQ Design:**
  - Separate DLQ per source queue/topic
  - Include original message, error details, metadata
  - Retention policy untuk retry analysis
- **DLQ Processing:**
  - Manual review workflow untuk failed messages
  - Retry with backoff untuk transient failures
  - Dead-letter for poison messages (non-retryable)
  - Alert on DLQ accumulation
- **Retry Configuration:**
  - Exponential backoff dengan jitter
  - Max retry count (3-5 typical)
  - Separate retry queue untuk delayed reprocessing
- **Monitoring:**
  - Queue depth monitoring
  - Processing latency monitoring
  - Error rate alerting

## 3. SAGA PATTERN (Distributed Transactions)
- **Choreography-based Saga:**
  - Each service publishes events untuk next step
  - Simple to implement, distributed control
  - Best for: Simple workflows, few participants
- **Orchestration-based Saga:**
  - Central orchestrator coordinates all steps
  - Clear visibility into workflow state
  - Best for: Complex workflows, many participants
- **Compensating Transactions:**
  - Define undo action untuk setiap forward action
  - Compensations must be idempotent
  - Execute in reverse order
- **Saga State Management:**
  - Persist saga state untuk recovery
  - Timeout handling untuk incomplete sagas
  - Retry mechanism untuk failed steps

## 4. OUTBOX PATTERN
- **Transactional Outbox:**
  - Write business data AND outbox event dalam same transaction
  - Relay process reads outbox dan publishes to message broker
  - Guarantees at-least-once delivery
- **Outbox Implementation:**
  - Outbox table with event records
  - Polling relay for simple cases
  - CDC-based relay for high throughput (Debezium)
- **Idempotent Consumer:**
  - Consumer must handle duplicate messages
  - Use deduplication key (event ID)
  - Idempotent operations in consumer logic
- **At-Least-Once Delivery:**
  - Acknowledge only after successful processing
  - Implement idempotent consumers
  - Use transactional processing

## 5. ANTI-CORRUPTION LAYER (ACL)
- **Purpose:** Translate between legacy dan modern APIs tanpa modifying legacy system.
- **Implementation:**
  - Facade/adapter untuk legacy service
  - Protocol translation (SOAP to REST, etc.)
  - Data format translation
  - Semantic mapping
- **Design Principles:**
  - Keep ACL simple — don't add business logic
  - Isolate legacy dependencies
  - Document translation rules
  - Add logging untuk debugging
- **Strangler Fig Pattern:**
  - Incrementally replace functionality
  - Route traffic based on capability
  - Remove legacy once new system fully capable

## 6. SERVICE MESH PATTERNS
- **mTLS (Mutual TLS):**
  - Encrypt service-to-service communication
  - Automatic certificate rotation
  - Identity verification untuk each service
- **Traffic Management:**
  - Canary routing untuk gradual rollouts
  - Circuit breaking untuk fault isolation
  - Retry policies dengan timeout
- **Observability:**
  - Distributed tracing (automatic)
  - Metrics collection per service
  - Traffic flow visualization
- **Service Mesh Solutions:**
  - Istio (full-featured, complex)
  - Linkerd (simpler, lightweight)
  - Consul Connect (HashiCorp ecosystem)
  - AWS App Mesh (AWS-native)

## 7. EVENT-DRIVEN ARCHITECTURE
- **Event Sourcing:**
  - Store all state changes as events
  - Append-only event log
  - Rebuild state dari event history
  - Enable full audit trail
- **CQRS (Command Query Responsibility Segregation):**
  - Separate read dan write models
  - Denormalized read models untuk query performance
  - Eventual consistency untuk read updates
- **Event Schema Registry:**
  - Schema definition untuk all events
  - Schema evolution dengan backward compatibility
  - Validation sebelum publishing
- **Event Versioning:**
  - Version events untuk breaking changes
  - Consumer-driven contract testing
  - Migration strategy untuk consumers

## 8. MESSAGE SCHEMA MANAGEMENT
- **Schema Registry:**
  - Apache Avro, Protobuf, JSON Schema
  - Schema validation
  - Schema evolution rules
- **Backward Compatibility:**
  - Add optional fields
  - Don't remove required fields
  - Don't change field types
- **Forward Compatibility:**
  - Consumers ignore unknown fields
  - New producers dapat send to old consumers
- **Schema Evolution Policy:**
  - Define compatibility mode (FULL, BACKWARD, FORWARD, NONE)
  - Automated compatibility testing
  - Documentation of changes

## 9. IDEMPOTENT CONSUMER PATTERN
- **Deduplication Strategies:**
  - Store processed event IDs dengan TTL
  - Use database unique constraint
  - In-memory deduplication untuk short windows
- **Implementation Approaches:**
  - **Event ID tracking:** Check before processing
  - **Idempotent operations:** Design operations to be safely repeatable
  - **Optimistic locking:** Use version numbers for updates
- **Processing Guarantees:**
  - At-least-once: Most common, handle duplicates
  - At-most-once: Rarely needed, may lose messages
  - Exactly-once: Most difficult, requires coordination

## 10. REQUEST-REPLY PATTERNS
- **Synchronous Request-Reply:**
  - Timeout handling
  - Correlation ID for matching
  - Circuit breaker untuk unresponsive services
- **Asynchronous Request-Reply:**
  - Temporary queue per request
  - Correlation ID routing
  - TTL untuk reply queue
- **Correlation ID Management:**
  - Generate unique ID at request origin
  - Propagate through all services
  - Include in all logs and traces
- **Error Handling:**
  - Timeout: Retry dengan backoff
  - Error response: Handle gracefully
  - Partial failure: Compensating actions

## 11. PUBLISH-SUBSCRIBE PATTERNS
- **Topic Design:**
  - Hierarchical naming (domain.entity.event)
  - Clear ownership per topic
  - Retention policy based on consumer needs
- **Subscription Management:**
  - Consumer groups untuk load balancing
  - Dead letter subscription for errors
  - Ephemeral subscriptions for temporary consumers
- **Message Filtering:**
  - Content-based filtering
  - Header-based routing
  - Topic partitioning untuk parallelism
- **Fan-out Patterns:**
  - Broadcast ke multiple consumers
  - Topic duplication for different consumers
  - Consider message brokers dengan fan-out support

## 12. ERROR HANDLING & RETRY
- **Retryable Errors:**
  - Network timeouts
  - Temporary service unavailable (5xx)
  - Rate limiting (429)
- **Non-Retryable Errors:**
  - Client errors (4xx except 429)
  - Validation errors
  - Business logic errors
- **Retry Strategy:**
  - Exponential backoff: 1s, 2s, 4s, 8s...
  - Jitter: ±50% randomization
  - Max retries: 3-5
  - Circuit breaker after repeated failures
- **Circuit Breaker Configuration:**
  - Failure threshold: Open after 50% failures in 10s
  - Recovery timeout: Try half-open after 30s
  - Success threshold: Close after 3 successes

---

**Invoke:** `/messaging` | **Priority:** MEDIUM | **Version:** 1.0
