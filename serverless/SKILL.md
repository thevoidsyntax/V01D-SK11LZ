---
name: serverless
description: Serverless computing best practices including Lambda, cloud functions, and edge computing
version: "1.0.0"
category: [infrastructure]
priority: low
phase: phase-5
tech_stack:
  services: [aws-lambda, azure-functions, google-cloud-functions, vercel, netlify]
scale: [small, medium, large]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/serverless.yml"
      reason: "Serverless config detected"
  skill_tier: optional
capabilities: [implementation]
quality:
  rules_count: 10
  examples_count: 15
  stability: stable
integrates_with: [scalability, deployment]
source:
  origin: local
author: Claude
---

# SERVERLESS MODULE

Kamu adalah Serverless Specialist. Gunakan rules ini untuk setiap aspek serverless computing.

---

## 1. LAMBDA/CLOUD FUNCTIONS
- **Best Practices:**
  - Stateless functions
  - Single responsibility
  - Minimal dependencies
- **Cold Start:**
  - Optimize bundle size
  - Provisioned concurrency
  - Keep warm
- **Execution:**
  - Timeout configuration
  - Memory sizing
  - Concurrent execution
- **Cost:**
  - Pay per invocation
  - Duration-based
  - Free tier

## 2. SERVERLESS ARCHITECTURE
- **Patterns:**
  - Event-driven
  - Microservices
  - API backends
- **Design:**
  - Small functions
  - Composition
  - Async-first
- **Benefits:**
  - No server management
  - Auto-scaling
  - Pay per use
- **Challenges:**
  - Cold starts
  - Vendor lock-in
  - Debugging

## 3. EDGE COMPUTING
- **Use Cases:**
  - CDN edge functions
  - A/B testing
  - Personalization
- **Platforms:**
  - Cloudflare Workers
  - Lambda@Edge
  - Fastly Compute
- **Benefits:**
  - Low latency
  - Global distribution
  - Reduced origin load
- **Constraints:**
  - Limited runtime
  - No filesystem
  - Memory limits

## 4. SERVERLESS DATABASES
- **Options:**
  - DynamoDB
  - Aurora Serverless
  - Firestore
  - PlanetScale
- **Scaling:**
  - Automatic
  - Pay per usage
  - Zero cold starts
- **Patterns:**
  - On-demand capacity
  - ProVISIONED
  - Autoscaling
- **Considerations:**
  - Connection limits
  - Query patterns
  - Cost model

## 5. SERVERLESS OBSERVABILITY
- **Logging:**
  - Structured logs
  - Correlation IDs
  - CloudWatch/Stackdriver
- **Metrics:**
  - Invocation count
  - Duration
  - Errors
  - Throttles
- **Tracing:**
  - X-Ray
  - OpenTelemetry
  - Distributed tracing
- **Alerting:**
  - Error rate
  - Duration
  - Cost anomalies

## 6. SERVERLESS SECURITY
- **Authentication:**
  - JWT validation
  - API keys
  - IAM roles
- **Authorization:**
  - Resource policies
  - Least privilege
  - No hardcoded secrets
- **Network:**
  - VPC for sensitive
  - Private endpoints
  - Encryption
- **Dependencies:**
  - Minimal packages
  - Vulnerability scanning
  - Regular updates

## 7. FUNCTION COMPOSITION
- **Patterns:**
  - Step Functions
  - Durable Functions
  - Event-driven chains
- **Orchestration:**
  - Workflow definition
  - Error handling
  - Retry logic
- **Choreography:**
  - Event-driven
  - Point-to-point
  - Loosely coupled
- **Tools:**
  - AWS Step Functions
  - Azure Durable Functions
  - Temporal

## 8. SERVERLESS CI/CD
- **Pipeline:**
  - Build artifacts
  - Deploy functions
  - Test automation
- **Strategies:**
  - Canary
  - Blue-green
  - Feature flags
- **Optimization:**
  - Layer reuse
  - Parallel jobs
  - Caching
- **Monitoring:**
  - Deployment metrics
  - Rollback triggers
  - Cost tracking

## 9. COST OPTIMIZATION
- **Monitoring:**
  - Cost per invocation
  - Duration optimization
  - Idle resources
- **Optimization:**
  - Right-sized memory
  - Efficient code
  - Provisioned concurrency
- **Architecture:**
  - Batching
  - Caching
  - Async processing
- **Reservations:**
  - Savings plans
  - Committed use
  - Reserved concurrency

## 10. SERVERLESS PATTERNS
- **Queue-Based:**
  - SQS trigger
  - Batch processing
  - Decoupling
- **Webhook:**
  - Event-driven
  - Async processing
  - Scalable
- **REST API:**
  - API Gateway
  - Lambda backend
  - Serverless CRUD
- **Data Processing:**
  - Stream processing
  - Batch ETL
  - Real-time analytics

## 11. VENDOR LOCK-IN
- **Strategies:**
  - Abstraction layers
  - Portable code
  - Multi-cloud
- **Patterns:**
  - Serverless Framework
  - Pulumi
  - Terraform
- **Trade-offs:**
  - Portability vs features
  - Cost
  - Complexity
- **Mitigation:**
  - Clear interfaces
  - Abstraction
  - Migration path

## 12. SERVERLESS MONITORING
- **Metrics:**
  - Invocations
  - Duration
  - Errors
  - Throttles
- **Cost:**
  - Spend tracking
  - Anomaly detection
  - Budget alerts
- **Performance:**
  - Cold start times
  - Memory usage
  - Concurrent executions
- **Optimization:**
  - Duration optimization
  - Memory right-sizing
  - Package size

---

**Invoke:** `/serverless` | **Priority:** LOW | **Version:** 1.0