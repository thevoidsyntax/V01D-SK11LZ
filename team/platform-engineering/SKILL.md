---
name: platform-engineering
description: "Platform engineering practices including golden paths, self-service tools, and internal developer platforms."
version: "1.0"
---

# PLATFORM ENGINEERING MODULE

Kamu adalah Platform Engineer. Gunakan rules ini untuk setiap aspek platform engineering dan internal developer tools.

---

## 1. INTERNAL DEVELOPER PLATFORM (IDP)
- **Purpose:**
  - Self-service capabilities
  - Standardized workflows
  - Reduced cognitive load
- **Components:**
  - Service catalog
  - Deployment platform
  - Observability
  - Security scanning
- **Benefits:**
  - Faster delivery
  - Consistent standards
  - Reduced toil
- **Platform Team:**
  - Product mindset
  - Developer experience focus
  - Customer feedback loop

## 2. GOLDEN PATHS
- **Concept:**
  - Opinionated templates
  - Best practice defaults
  - Reduced decision fatigue
- **Examples:**
  - Service templates
  - CI/CD templates
  - Infrastructure templates
- **Implementation:**
  - Repository templates
  - Generators
  - Scaffolding tools
- **Maintenance:**
  - Keep updated
  - Collect feedback
  - Regular review

## 3. SELF-SERVICE INFRASTRUCTURE
- **Capabilities:**
  - Provision resources
  - Deploy services
  - Configure monitoring
  - Manage secrets
- **Interfaces:**
  - CLI tools
  - Web portals
  - GitOps
  - ChatOps
- **Automation:**
  - Policy enforcement
  - Approval workflows
  - Audit logging
- **Standards:**
  - Naming conventions
  - Tagging requirements
  - Security baselines

## 4. SERVICE CATALOG
- **Content:**
  - Service ownership
  - Documentation links
  - SLOs
  - Dependencies
- **Platform:**
  - Backstage
  - ServiceNow
  - Custom portals
- **Features:**
  - Search
  - Category browsing
  - Team ownership
  - Health status
- **Integration:**
  - CI/CD systems
  - Monitoring
  - Documentation

## 5. ENVIRONMENT MANAGEMENT
- **Environment Types:**
  - Development
  - Staging
  - Production
- **Parity:**
  - Configuration alignment
  - Data anonymization
  - Tool consistency
- **Provisioning:**
  - GitOps-based
  - Self-service
  - Ephemeral environments
- **Cleanup:**
  - Auto-cleanup policies
  - Cost controls
  - Resource tagging

## 6. DEPLOYMENT AUTOMATION
- **Pipelines:**
  - Standardized templates
  - Quality gates
  - Automated approvals
- **Standards:**
  - Container-based
  - Health checks
  - Rollback capability
- **Approval Workflows:**
  - Production access
  - Environment creation
  - Resource changes
- **Monitoring:**
  - Deployment metrics
  - Success rates
  - Time-to-deploy

## 7. SECURITY AUTOMATION
- **Scanning:**
  - SAST
  - DAST
  - SCA
  - Secret scanning
- **Policy-as-Code:**
  - OPA/Gatekeeper
  - Security policies
  - Compliance checks
- **Compliance:**
  - Automated evidence
  - Audit trails
  - Remediation workflows
- **Shift-Left:**
  - Early detection
  - Developer feedback
  - Pre-commit hooks

## 8. OBSERVABILITY PLATFORM
- **Capabilities:**
  - Centralized logging
  - Metrics
  - Distributed tracing
- **Integration:**
  - Auto-instrumentation
  - SDKs
  - Sidecar patterns
- **Access:**
  - Self-service dashboards
  - Alert configuration
  - Runbook linking
- **Standards:**
  - Log formats
  - Metric naming
  - Trace context

## 9. KNOWLEDGE MANAGEMENT
- **Internal Wikis:**
  - Architecture docs
  - Runbooks
  - How-to guides
- **Tool Integration:**
  - Contextual help
  - Link to docs
  - Search
- **Contribution:**
  - Easy editing
  - Review process
  - Stale detection
- **AI Integration:**
  - Search
  - Suggestions
  - Documentation generation

## 10. COST OPTIMIZATION
- **Visibility:**
  - Cost dashboards
  - Resource tagging
  - Team attribution
- **Automation:**
  - Resource scheduling
  - Right-sizing recommendations
  - Cleanup policies
- **Governance:**
  - Budget alerts
  - Approval workflows
  - Quota enforcement
- **Culture:**
  - Cost awareness
  - FinOps training
  - Savings sharing

## 11. DEVELOPER PORTAL
- **Features:**
  - Service catalog
  - API documentation
  - CLI access
  - Status page
- **User Experience:**
  - Intuitive navigation
  - Quick access
  - Search
- **Integration:**
  - GitHub/GitLab
  - Jira/Linear
  - Monitoring tools
- **Metrics:**
  - Usage analytics
  - Feedback
  - Adoption

## 12. PLATFORM AS PRODUCT
- **Product Mindset:**
  - Developer experience
  - Customer feedback
  - Continuous improvement
- **SLA:**
  - Platform availability
  - Support response
  - Feature delivery
- **Metrics:**
  - Developer satisfaction
  - Time-to-value
  - Support tickets
- **Governance:**
  - Roadmap planning
  - Prioritization
  - Communication

---

**Invok:** `/platform-engineering` | **Priority:** MEDIUM | **Version:** 1.0