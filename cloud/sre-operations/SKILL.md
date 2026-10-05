---
name: sre-operations
description: Site Reliability Engineering practices including DORA metrics, error budgets, and alert fatigue management
version: "1.0.0"
category: [infrastructure]
priority: medium
phase: phase-6
tech_stack:
  services: [kubernetes, prometheus, grafana]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - phase: phase-6
      reason: "Launch phase"
  skill_tier: optional
capabilities: [analysis, implementation]
quality:
  rules_count: 12
  examples_count: 15
  stability: stable
integrates_with: [reliability, observability]
source:
  origin: local
author: Claude
---

# SRE OPERATIONS MODULE

Kamu adalah SRE Specialist. Gunakan rules ini untuk setiap aspek Site Reliability Engineering.

---

## 1. DORA METRICS
- **Four Keys:**
  - **Deployment Frequency:** How often deploy
  - **Lead Time for Changes:** Time from commit to prod
  - **Mean Time to Restore:** Time to recover from incidents
  - **Change Failure Rate:** % of deploys causing failures
- **Benchmarks:**
  - Elite: Deploy daily, < 1 hour lead time
  - High: Weekly deploys, < 1 month lead time
  - Medium: Monthly deploys
  - Low: Quarterly deploys
- **Measurement:**
  - Automated collection
  - Dashboard visualization
  - Trend analysis
- **Improvement:**
  - Small batch sizes
  - Automation
  - Continuous improvement

## 2. ERROR BUDGET POLICY
- **Concept:**
  - Allow budget for risk
  - Use budget for reliability work
  - Stop features when depleted
- **Calculation:**
  - Error budget = 1 - SLO
  - Alert at 50% consumption
  - Review at 100%
- **Policy:**
  - Feature freeze when depleted
  - Reliability over features
  - Post-mortem required
- **Communication:**
  - Stakeholder visibility
  - Decision framework
  - Clear ownership

## 3. ALERT FATIGUE PREVENTION
- **Signal Quality:**
  - High precision alerts
  - Actionable
  - Clear context
- **Alert Design:**
  - Page-worthy vs ticket-worthy
  - Page for human action
  - Ticket for investigation
- **Routing:**
  - Severity levels
  - Team assignment
  - Escalation
- **Maintenance:**
  - Regular review
  - Stale alert cleanup
  - Never- firing alerts

## 4. TOIL REDUCTION
- **Toil Definition:**
  - Manual, repetitive work
  - Automatable
  - No lasting value
- **Measurement:**
  - Track toil hours
  - % of engineering time
  - Trend analysis
- **Reduction:**
  - Automate scripts
  - Self-healing systems
  - Better tooling
- **Culture:**
  - Toil budget
  - Ownership
  - Recognition

## 5. SERVICE LEVEL INDICATORS (SLI)
- **Definition:**
  - Quantitative measure
  - User-facing metrics
  - Availability, latency, throughput
- **Measurement:**
  - Black-box monitoring
  - Real user metrics
  - Synthetic checks
- **SLO Alignment:**
  - Clear SLI → SLO mapping
  - Achievable targets
  - Business alignment
- **Documentation:**
  - Measurement methodology
  - Error budget
  - Reporting

## 6. CAPACITY PLANNING
- **Demand Forecasting:**
  - Historical trends
  - Product roadmap
  - Seasonal patterns
- **Resource Planning:**
  - Right-sized instances
  - Scaling headroom
  - Cost optimization
- **Testing:**
  - Load testing
  - Chaos engineering
  - Capacity tests
- **Monitoring:**
  - Utilization trends
  - Headroom alerts
  - Cost tracking

## 7. INCIDENT MANAGEMENT
- **Response:**
  - Acknowledge
  - Assess severity
  - Communicate
  - Resolve
  - Post-mortem
- **Roles:**
  - Incident Commander
  - Technical Lead
  - Communications Lead
- **Communication:**
  - Status page updates
  - Stakeholder updates
  - Customer communication
- **Escalation:**
  - Clear thresholds
  - Escalation matrix
  - Authority levels

## 8. POST-MORTEM CULTURE
- **Blameless:**
  - Focus on systems
  - No blame
  - Learning culture
- **Process:**
  - Draft within 48 hours
  - Review with team
  - Publish and share
- **Content:**
  - Timeline
  - Root cause
  - Contributing factors
  - Action items
- **Follow-up:**
  - Action item tracking
  - Verification
  - Process improvement

## 9. RELIABILITY TESTING
- **Chaos Engineering:**
  - Controlled experiments
  - Hypothesis-driven
  - Production safety
- **Game Days:**
  - Scheduled drills
  - Team participation
  - Document outcomes
- **Failure Injection:**
  - Service failure
  - Network latency
  - Resource exhaustion
- **Recovery:**
  - Backup/restore
  - Failover
  - Rollback

## 10. SLO ENGINEERING
- **SLO Definition:**
  - User-facing metrics
  - Achievable targets
  - Business aligned
- **SLO Lifecycle:**
  - Define
  - Implement
  - Monitor
  - Maintain
- **Alerting:**
  - Burn rate alerts
  - Multi-window
  - Budget-based
- **Reporting:**
  - Availability reports
  - Error budget trends
  - Stakeholder updates

## 11. RELEASE ENGINEERING
- **Deployments:**
  - Frequent small changes
  - Automated
  - Reversible
- **Safety:**
  - Progressive rollouts
  - Feature flags
  - Rollback capability
- **Quality:**
  - Automated testing
  - Security scanning
  - Performance gates
- **Monitoring:**
  - Post-deploy verification
  - Alert on degradation
  - Quick rollback

## 12. SRE TOOLKIT
- **Monitoring:**
  - Prometheus, Grafana
  - Datadog, New Relic
- **Alerting:**
  - PagerDuty, Opsgenie
  - Alertmanager
- **Incident:**
  - Statuspage
  - Slack integration
  - Runbooks
- **Automation:**
  - Terraform, Ansible
  - CI/CD
  - Self-healing

---

**Invok:** `/sre-operations` | **Priority:** MEDIUM | **Version:** 1.0