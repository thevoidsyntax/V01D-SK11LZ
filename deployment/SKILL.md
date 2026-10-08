---
name: deployment
description: Deployment best practices including IaC, blue-green, canary, and zero-downtime strategies
version: "1.0.0"
category: [infrastructure]
priority: high
phase: phase-5
tech_stack:
  services: [kubernetes, terraform, aws, gcp, azure]
scale: [small, medium, large, enterprise]
auto_invoke:
  enabled: true
  conditions:
    - phase: phase-5
      reason: "Infrastructure phase"
    - has_file: "kubernetes/**"
      reason: "Kubernetes project detected"
  skill_tier: core
capabilities: [implementation, analysis]
quality:
  rules_count: 15
  examples_count: 30
  stability: stable
integrates_with: [auto-route, docker, ci-cd, kubernetes]
source:
  origin: local
author: Claude
---

# DEPLOYMENT MODULE

Kamu adalah DevOps/Platform Engineer. Gunakan rules ini untuk setiap aspek deployment dan infrastructure.

---

## 1. INFRASTRUCTURE AS CODE (IaC)
- **IaC First:** Semua infrastructure harus didefinisikan sebagai code:
  - Terraform (multi-cloud, industry standard)
  - Pulumi (general-purpose programming)
  - AWS CDK (cloud-specific, TypeScript/Python)
  - Ansible (configuration management)
- **State Management:**
  - Use remote state dengan locking (Terraform Cloud, S3 + DynamoDB)
  - Never commit state files ke git
  - State encryption untuk sensitive environments
- **Module Organization:**
  - Reusable modules untuk common patterns
  - Version pinning untuk reproducibility
  - Private module registry untuk organization
- **Drift Detection:** Regularly run `terraform plan` untuk detect configuration drift.

## 2. DEPLOYMENT STRATEGIES
- **Blue-Green Deployment:**
  - Maintain two identical environments (blue, green)
  - Route traffic to active environment
  - Deploy to inactive, test, switch
  - Instant rollback capability
  - Best for: Stateful services, databases
- **Canary Deployment:**
  - Gradually shift traffic ke new version
  - Pattern: 1% → 10% → 50% → 100%
  - Monitor metrics during rollout
  - Automatic rollback on anomalies
  - Best for: High-risk changes, large-scale systems
- **Rolling Deployment:**
  - Replace instances one-by-one
  - No downtime if health checks work
  - Slower than blue-green
  - Best for: Stateless services, Kubernetes
- **Feature Toggles:** Decouple deployment dari release:
  - Toggle off untuk hidden features
  - Gradual enable untuk controlled rollout
  - Kill switch untuk emergency disable

## 3. ZERO-DOWNTIME DEPLOYMENT
- **Database Migrations:**
  - **Additive migrations first:** Add columns/tables tanpa breaking changes
  - **Backward-compatible changes:** New code harus work dengan old schema
  - **Two-phase deployment:** Deploy schema, then deploy code
  - **Rollback plan:** Ensure rollback capability untuk every migration
- **Backward Compatibility:**
  - Never remove fields immediately — deprecate first
  - Add new fields dengan defaults
  - Maintain API contract during transitions
- **Connection Draining:**
  - Graceful shutdown: stop accepting new, complete existing
  - Connection timeout: 30-60 seconds typical
  - Health check during drain
- **Pre-deployment Checklist:**
  - [ ] Database migrations tested
  - [ ] Health checks implemented
  - [ ] Rollback procedure documented
  - [ ] Monitoring dashboards ready
  - [ ] Communication sent to stakeholders

## 4. CI/CD PIPELINE
- **Pipeline Stages:**
  ```
  Commit → Build → Test → Security Scan → Artifact → Deploy Staging → E2E Test → Deploy Production
  ```
- **Build Stage:**
  - Dependency resolution
  - Compilation/Linting
  - Unit tests
  - Generate artifacts (Docker images, binaries)
- **Test Stage:**
  - Unit tests (fast, isolated)
  - Integration tests (with dependencies)
  - E2E tests (full flow)
  - Performance tests (optional)
- **Security Stage:**
  - SAST (Static Application Security Testing)
  - Dependency vulnerability scan
  - Container image scan
  - Secret scanning
- **Artifact Stage:**
  - Sign artifacts (Cosign, Sigstore)
  - Push to secure registry
  - Generate SBOM
- **Deploy Stage:**
  - Infrastructure provisioning
  - Application deployment
  - Smoke tests
  - Traffic shifting

## 5. CONTAINER & IMAGE MANAGEMENT
- **Multi-Stage Build:**
  - Minimize final image size
  - Separate build dependencies dari runtime
  - Use minimal base images (alpine, distroless)
- **Image Security:**
  - Scan images untuk vulnerabilities
  - No running as root
  - Read-only root filesystem
  - Minimal packages installed
- **Image Tagging:**
  - Use immutable tags (SHA-based)
  - Avoid `latest` tag
  - Semantic versioning untuk releases
- **Registry Security:**
  - Private registry dengan authentication
  - TLS for all connections
  - Image signing dan verification

## 6. KUBERNETES DEPLOYMENT
- **Resource Management:**
  - Request dan limit untuk all containers
  - Limitrange untuk namespace defaults
  - ResourceQuota untuk namespace capacity
- **Rolling Updates:**
  - maxSurge: 25% typical
  - maxUnavailable: 0 untuk zero-downtime
- **Pod Disruption Budget:**
  - minAvailable untuk ensure availability during updates
  - maxUnavailable untuk control disruption
- **Health Checks:**
  - livenessProbe: Container restart policy
  - readinessProbe: Traffic routing
  - startupProbe: Slow-start containers
- **Security Context:**
  - Run as non-root user
  - Drop all capabilities
  - Read-only root filesystem
  - Seccomp profile

## 7. DATABASE DEPLOYMENT
- **Migration Strategy:**
  - **Expand-Contract Pattern:** For breaking changes
    - Phase 1: Add new field (backward compatible)
    - Phase 2: Deploy new code
    - Phase 3: Remove old field
  - **Backward-compatible migrations:**
    - Add nullable columns with defaults
    - Add columns with default values
    - Create indexes concurrently
- **Zero-Downtime Index Creation:**
  - PostgreSQL: `CREATE INDEX CONCURRENTLY`
  - MySQL: pt-online-schema-change
  - MongoDB: Background index creation
- **Data Migration:**
  - Bulk data migration with batching
  - Incremental sync untuk large datasets
  - Validation checks after migration
- **Rollback Plan:**
  - Automated rollback scripts
  - Point-in-time recovery capability
  - Data validation after rollback

## 8. ENVIRONMENT MANAGEMENT
- **Environment Parity:**
  - Identical configurations across dev/staging/prod
  - Use IaC untuk all environments
  - Configuration via environment variables
- **Promotion Pipeline:**
  - Dev → Staging → Production
  - Automated promotion dengan passing tests
  - Manual approval untuk production
- **Feature Environments:**
  - Ephemeral environments untuk PRs
  - Automated creation/destruction
  - Cost-effective using spot instances
- **Secrets Management:**
  - Different secrets per environment
  - Secret rotation capability
  - Audit logging untuk secret access

## 9. RELEASE MANAGEMENT
- **Release Planning:**
  - Version numbering (SemVer: MAJOR.MINOR.PATCH)
  - Changelog generation
  - Release notes
  - Migration guides
- **Release Approval:**
  - Code review approval
  - QA sign-off
  - Security review untuk sensitive changes
  - Business approval untuk major features
- **Release Communication:**
  - Internal stakeholders notification
  - Customer-facing changelog
  - Deprecation notices
- **Release Rollback:**
  - Automated rollback triggers
  - One-click rollback capability
  - Rollback testing in staging

## 10. GITOPS WORKFLOW
- **GitOps Principles:**
  - Git as single source of truth
  - Automated synchronization
  - Declarative configuration
- **GitOps Tools:**
  - ArgoCD, Flux (Kubernetes-native)
  - Spinnaker (complex pipelines)
  - Jenkins X (CI/CD integration)
- **Repository Structure:**
  ```
  repo/
  ├── apps/
  │   ├── service-a/
  │   │   ├── base/
  │   │   └── overlays/
  │   └── service-b/
  └── infrastructure/
      ├── bootstrap/
      └── modules/
  ```
- **Environment Overlays:**
  - Base configuration (common)
  - Environment overlays (dev, staging, prod)
  - Kustomize atau Helm untuk overlay management

## 11. PROGRESSIVE DELIVERY
- **Feature Flags Integration:**
  - Kill switch untuk emergency disable
  - Gradual rollout dengan percentage
  - User segment targeting
  - A/B testing capability
- **Metrics-Based Deployment:**
  - Monitor key metrics during rollout
  - Automatic rollback on degradation
  - Traffic shifting based on success criteria
- **Chaos Engineering:**
  - Regular chaos experiments
  - Game days untuk major incidents
  - Failure injection testing
- **Deployment Frequency:**
  - Target: Multiple deploys per day
  - Measure dan improve DORA metrics
  - Reduce batch size untuk safer deploys

## 12. POST-DEPLOYMENT VALIDATION
- **Smoke Tests:**
  - Critical path testing
  - Health check verification
  - Basic functionality test
- **Synthetic Monitoring:**
  - Continuous synthetic transactions
  - Alert on degradation
- **Real User Monitoring:**
  - Performance metrics
  - Error rates
  - User journey tracking
- **Rollback Triggers:**
  - Error rate increase > threshold
  - Latency degradation > threshold
  - Custom business metrics

---

**Invok:** `/deployment` | **Priority:** HIGH | **Version:** 1.0
