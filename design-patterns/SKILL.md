---
name: design-patterns
description: "Design patterns including Observer, Repository, and Unit of Work patterns. Covers implementation best practices."
version: "1.0"
---

# DESIGN PATTERNS MODULE

Kamu adalah Design Patterns Specialist. Gunakan rules ini untuk setiap aspek design patterns implementation.

---

## 1. CREATIONAL PATTERNS
- **Singleton:**
  - Single instance
  - Global access
  - Thread-safe variants
- **Factory Method:**
  - Subclass instantiation
  - Object creation abstraction
  - Polymorphic creation
- **Abstract Factory:**
  - Related object families
  - Interface consistency
  - Theme-based creation
- **Builder:**
  - Complex object construction
  - Step-by-step building
  - Fluent interface
- **Prototype:**
  - Clone existing objects
  - Deep vs shallow copy
  - Registry-based prototype

## 2. STRUCTURAL PATTERNS
- **Adapter:**
  - Interface compatibility
  - Legacy integration
  - Third-party wrapping
- **Bridge:**
  - Abstraction/implementation separation
  - Independent changes
  - Platform abstraction
- **Composite:**
  - Tree structures
  - Uniform treatment
  - Recursive composition
- **Decorator:**
  - Dynamic behavior addition
  - Open/closed principle
  - Feature stacking
- **Facade:**
  - Simplified interface
  - Complex subsystem hiding
  - Entry point
- **Flyweight:**
  - Shared objects
  - Intrinsic/extrinsic state
  - Memory optimization
- **Proxy:**
  - Placeholder object
  - Lazy initialization
  - Access control

## 3. BEHAVIORAL PATTERNS
- **Chain of Responsibility:**
  - Request passing
  - Handler chain
  - Decoupling sender/receiver
- **Command:**
  - Encapsulated action
  - Undo/redo support
  - Queue operations
- **Iterator:**
  - Sequential access
  - Collection abstraction
  - Encapsulated traversal
- **Mediator:**
  - Centralized communication
  - Reduced coupling
  - Colleague coordination
- **Memento:**
  - State capture
  - Undo mechanism
  - External state storage
- **Observer:**
  - Event subscription
  - One-to-many dependency
  - Notification system
- **State:**
  - Object state changes
  - State machine
  - Behavior variation
- **Strategy:**
  - Interchangeable algorithms
  - Runtime selection
  - Policy pattern
- **Template Method:**
  - Algorithm skeleton
  - Subclass override
  - Hook methods
- **Visitor:**
  - Operation on object structure
  - Open/closed principle
  - Double dispatch

## 4. DOMAIN-DRIVEN DESIGN PATTERNS
- **Aggregate:**
  - Cluster of related objects
  - Transaction boundary
  - Root entity
- **Entity:**
  - Identity-based
  - Mutable
  - Long-lived
- **Value Object:**
  - Immutable
  - No identity
  - Concepts完整性
- **Repository:**
  - Collection-like interface
  - Persistence abstraction
  - Query methods
- **Domain Event:**
  - Business event
  - Immutable
  - Published
- **Service:**
  - Stateless operation
  - Domain logic
  - Not entity/value object

## 5. DATA ACCESS PATTERNS
- **Repository Pattern:**
  - Collection abstraction
  - Persistence ignorance
  - Testability
- **Unit of Work:**
  - Transaction management
  - Change tracking
  - Atomic operations
- **Query Object:**
  - Object-based query
  - Specification pattern
  - Type-safe queries
- **Data Mapper:**
  - Object/relational mapping
  - Bidirectional mapping
  - Metadata mapping
- **Active Record:**
  - Domain object with persistence
  - Simple CRUD
  - Convention over configuration

## 6. CONCURRENCY PATTERNS
- **Thread Pool:**
  - Reuse threads
  - Task queue
  - Resource management
- **Producer-Consumer:**
  - Work distribution
  - Buffer between stages
  - Decoupling
- **Read-Write Lock:**
  - Concurrent reads
  - Exclusive writes
  - Performance optimization
- **Future/Promise:**
  - Async result
  - Composable
  - Non-blocking
- **Actor:**
  - Message passing
  - Isolation
  - Mailbox
- **Pipeline:**
  - Filter/transform
  - Parallel stages
  - Data flow

## 7. RESILIENCE PATTERNS
- **Circuit Breaker:**
  - Failure threshold
  - State transitions
  - Fallback
- **Retry:**
  - Exponential backoff
  - Jitter
  - Retryable errors
- **Bulkhead:**
  - Resource isolation
  - Failure containment
  - Thread pools
- **Timeout:**
  - Time-bounded operations
  - Resource release
  - Defensive programming
- **Rate Limiter:**
  - Token bucket
  - Leaky bucket
  - Traffic control
- **Fallback:**
  - Graceful degradation
  - Default values
  - Cached responses

## 8. CACHING PATTERNS
- **Cache-Aside:**
  - Application manages cache
  - Lazy loading
  - Cache invalidation
- **Read-Through:**
  - Cache auto-loads
  - Transparent
  - Single source
- **Write-Through:**
  - Sync cache and store
  - Consistent
  - Slower writes
- **Write-Behind:**
  - Async cache update
  - Fast writes
  - Risk of data loss
- **Refresh-Ahead:**
  - Proactive refresh
  - TTL extension
  - Prediction-based
- **Cache Stampede:**
  - Mutex lock
  - Probabilistic expiration
  - Background refresh

## 9. API PATTERNS
- **Resource:**
  - Nouns for resources
  - HTTP methods
  - Stateless
- **Gateway:**
  - Single entry point
  - Cross-cutting concerns
  - Routing
- **BFF (Backend for Frontend):**
  - Client-specific API
  - Data aggregation
  - Protocol translation
- **Anti-Corruption Layer:**
  - Translation layer
  - Legacy integration
  - Isolation
- **Strangler:**
  - Incremental migration
  - Traffic routing
  - Feature-by-feature

## 10. MESSAGING PATTERNS
- **Point-to-Point:**
  - Queue-based
  - One consumer
  - Load balancing
- **Publish-Subscribe:**
  - Topic-based
  - Multiple consumers
  - Fan-out
- **Saga:**
  - Distributed transactions
  - Choreography
  - Orchestration
- **Outbox:**
  - Reliable messaging
  - Transactional outbox
  - At-least-once
- **Claim Check:**
  - Large message handling
  - Reference passing
  - Payload storage
- **Aggregator:**
  - Combine messages
  - Correlation
  - Time windows

## 11. ORCHESTRATION PATTERNS
- **Workflow:**
  - Sequential steps
  - Conditional branching
  - State machine
- **Choreography:**
  - Distributed logic
  - Event-driven
  - Loose coupling
- **Saga:**
  - Distributed transactions
  - Compensating actions
  - Forward recovery
- **Pipes and Filters:**
  - Linear processing
  - Composable stages
  - Data transformation
- **Scatter-Gather:**
  - Parallel requests
  - Result aggregation
  - Fan-out/fan-in

## 12. TESTING PATTERNS
- **Test Double:**
  - Dummy
  - Fake
  - Stub
  - Mock
- **Arrange-Act-Assert:**
  - Test structure
  - Clear phases
  - Single assertion
- **Object Mother:**
  - Test data factory
  - Reusable fixtures
  - Builder pattern
- **Test Data Builder:**
  - Fluent interface
  - Default values
  - Customization
- **Snapshot Testing:**
  - Expected output
  - Visual comparison
  - Update mechanism
- **Parametrized Tests:**
  - Multiple inputs
  - Single test logic
  - Coverage

---

**Invok:** `/design-patterns` | **Priority:** MEDIUM | **Version:** 1.0
