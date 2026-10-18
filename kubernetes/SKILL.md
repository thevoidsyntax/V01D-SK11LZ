---
name: kubernetes
description: Kubernetes best practices including HPA, security, Helm, and service mesh configuration
version: "1.0.0"
category: [infrastructure]
priority: high
phase: phase-5
tech_stack:
  services: [kubernetes, helm, docker]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "kubernetes/**"
      reason: "Kubernetes project detected"
    - phase: phase-5
      reason: "Infrastructure phase"
  skill_tier: context
capabilities: [implementation, analysis]
quality:
  rules_count: 15
  examples_count: 25
  stability: stable
integrates_with: [deployment, docker, scalability]
dependencies: [docker, deployment]
source:
  origin: local
author: thevoidsyntax
---

# KUBERNETES MODULE

Kamu adalah Kubernetes Specialist. Gunakan rules ini untuk setiap aspek Kubernetes deployment dan operations.

---

## 1. RESOURCE MANAGEMENT
- **Container Resources:**
  - Resource requests: Guaranteed allocation
  - Resource limits: Maximum allocation
  - Appropriate sizing untuk workloads
- **Resource Quotas:**
  - Namespace-level quotas
  - LimitRange for defaults
  - Priority classes
- **Autoscaling:**
  - HPA (Horizontal Pod Autoscaler)
  - VPA (Vertical Pod Autoscaler)
  - Cluster Autoscaler
- **Best Practices:**
  - Set both requests and limits
  - Avoid CPU throttling
  - Memory limits for stability

## 2. POD SECURITY
- **Security Context:**
  - Run as non-root
  - Read-only root filesystem
  - Drop capabilities
  - Seccomp profile
- **Pod Security Standards:**
  - Privileged: Most restricted
  - Baseline: Moderate restrictions
  - Restricted: Strictest
- **Network Policies:**
  - Default deny
  - Explicit allow rules
  - Namespace isolation
- **Secrets Management:**
  - Kubernetes Secrets (encrypted)
  - External secrets (Vault, AWS)
  - Never mount secrets as files unencrypted

## 3. HELM CHARTS
- **Chart Structure:**
  ```
  chart/
  ├── Chart.yaml
  ├── values.yaml
  ├── templates/
  └── charts/
  ```
- **Best Practices:**
  - Version pinning
  - DRY with helpers
  - Validation in templates
  - README documentation
- **Release Management:**
  - Helmfile for multi-environment
  - GitOps dengan ArgoCD
  - Upgrade with rollback
- **Testing:**
  - helm unittest
  - linting
  - dry-run

## 4. SERVICE MESH (ISTIO/LINKERD)
- **mTLS:**
  - Automatic mutual TLS
  - Strict mode for production
  - Peer authentication
- **Traffic Management:**
  - Virtual services
  - Destination rules
  - Traffic splitting
- **Observability:**
  - Distributed tracing
  - Metrics collection
  - Access logging
- **Circuit Breaking:**
  - Connection pools
  - Outlier detection
  - Retry policies

## 5. DEPLOYMENT STRATEGIES
- **Rolling Update:**
  - maxSurge: 25%
  - maxUnavailable: 0
  - Progress deadline
- **Blue-Green:**
  - Service versioning
  - Traffic switching
  - Instant rollback
- **Canary:**
  - Weight-based routing
  - Metric-based promotion
  - Automated rollback
- **Health Checks:**
  - livenessProbe
  - readinessProbe
  - startupProbe

## 6. STORAGE
- **Volume Types:**
  - EmptyDir: Ephemeral
  - PersistentVolumeClaim: Persistent
  - ConfigMap/Secret: Configuration
- **Storage Classes:**
  - SSD for performance
  - HDD for capacity
  - Network storage
- **Data Management:**
  - StatefulSets for stateful apps
  - PersistentVolume reclaim policy
  - Backup strategy
- **CSI Drivers:**
  - Cloud-specific drivers
  - NFS, Ceph for on-prem
  - Snapshot support

## 7. NETWORKING
- **DNS:**
  - CoreDNS configuration
  - Headless services
  - External name services
- **Ingress:**
  - NGINX Ingress
  - cert-manager for TLS
  - Path-based routing
- **Network Policies:**
  - Namespace isolation
  - Pod-to-pod communication
  - Egress control
- **Load Balancing:**
  - Cloud load balancers
  - MetalLB for on-prem
  - LoadBalancer service type

## 8. MONITORING & LOGGING
- **Metrics:**
  - Prometheus
  - Prometheus Operator
  - Custom metrics
- **Logging:**
  - Fluentd/Fluent Bit
  - Elasticsearch
  - Kibana/Grafana Loki
- **Tracing:**
  - Jaeger
  - OpenTelemetry
- **Dashboards:**
  - Grafana
  - Custom dashboards
  - Alerting rules

## 9. OPERATOR PATTERN
- **Custom Controllers:**
  - Reconciliation loop
  - Status updates
  - Finalizers
- **CRDs:**
  - Versioning
  - Validation
  - Subresources
- **Operator Framework:**
  - kubebuilder
  - operator-sdk
  - Metacontroller
- **Best Practices:**
  - Idempotent reconciliation
  - Error handling
  - Leader election

## 10. HIGH AVAILABILITY
- **Multi-AZ Deployment:**
  - Pod anti-affinity
  - Topology spread constraints
  - Node affinity
- **Cluster Setup:**
  - Multi-master
  - Etcd cluster
  - Control plane isolation
- **Workload HA:**
  - Replica count > 1
  - PodDisruptionBudget
  - Priority classes
- **Disaster Recovery:**
  - etcd backups
  - Cluster backup/restore
  - Cross-cluster federation

## 11. COST OPTIMIZATION
- **Resource Optimization:**
  - Right-sizing pods
  - VPA recommendations
  - Bin packing
- **Node Optimization:**
  - Spot instances
  - Node pools
  - Cluster autoscaling
- **Monitoring:**
  - Cost allocation
  - Usage dashboards
  - Waste identification
- **Governance:**
  - Resource quotas
  - Limit ranges
  - Namespace budgets

## 12. GITOPS
- **Tools:**
  - ArgoCD
  - Flux
  - Jenkins X
- **Repository Structure:**
  - App manifests
  - Environment overlays
  - Infrastructure as code
- **Sync Strategy:**
  - Automated sync
  - Manual approval
  - Sync waves
- **Best Practices:**
  - Immutable images
  - Image tags (SHA)
  - Drift detection

---

**Invoke:** `/kubernetes` | **Priority:** MEDIUM | **Version:** 1.0
