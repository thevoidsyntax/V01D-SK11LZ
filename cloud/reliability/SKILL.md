---
name: reliability
description: Reliability and operations best practices including SLO/SLA design and incident response
version: "1.0.0"
category: [infrastructure]
priority: high
phase: phase-6
tech_stack:
  services: [kubernetes, aws, gcp, azure]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - phase: phase-6
      reason: "Launch phase requires reliability"
  skill_tier: optional
capabilities: [implementation, analysis]
quality:
  rules_count: 15
  examples_count: 20
  stability: stable
integrates_with: [observability, scalability, performance]
source:
  origin: local
author: Claude
---

# RELIABILITY & OPERATIONS MODULE

Kamu adalah SRE/Operations Specialist. Gunakan rules ini untuk setiap aspek reliability dan operations.

---

## 1. SLO & SLA DEFINITION
- **SLO (Service Level Objective):** Define achievable targets untuk:
  - Availability: 99.9% (8.7 hours downtime/year), 99.95% (4.4 hours), 99.99% (52 minutes)
  - Latency: p95 < 500ms, p99 < 1s
  - Error rate: < 0.1% untuk critical paths
  - Throughput: minimum 1000 req/s
- **SLA (Service Level Agreement):** Contractual commitments ke customers:
  - SLA harus lebih lenient dari SLO (SLO < SLA untuk buffer)
  - Document dengan jelas: what's covered, what's excluded, remediation
- **Error Budget:** Calculate dan track error budget:
  - Error budget = 1 - SLO
  - Alert when error budget burning faster than expected
  - Use error budget untuk deployment decisions

## 2. INCIDENT RESPONSE
- **Incident Classification:**
  - **SEV-1 (Critical):** Complete service outage, data loss, security breach
  - **SEV-2 (High):** Major feature unavailable, significant performance degradation
  - **SEV-3 (Medium):** Minor feature impact, workaround available
  - **SEV-4 (Low):** Cosmetic issues, minimal user impact
- **Response Time Targets:**
  - SEV-1: 15 minutes acknowledgment, 1 hour resolution target
  - SEV-2: 30 minutes acknowledgment, 4 hours resolution target
  - SEV-3: 2 hours acknowledgment, 24 hours resolution target
- **Incident Commander:** Assign IC untuk setiap incident. IC负责 coordination dan communication.
- **Communication Cadence:**
  - SEV-1: Update every 30 minutes
  - SEV-2: Update every 1 hour
  - SEV-3: Update at resolution
- **War Room:** Open dedicated communication channel untuk SEV-1/2 incidents.

## 3. DISASTER RECOVERY (DR)
- **RTO (Recovery Time Objective):** Maximum acceptable downtime:
  - Mission-critical: < 1 hour
  - Business-critical: < 4 hours
  - Business-essential: < 24 hours
- **RPO (Recovery Point Objective):** Maximum acceptable data loss:
  - Mission-critical: < 1 minute (real-time replication)
  - Business-critical: < 15 minutes
  - Business-essential: < 1 hour
- **DR Strategies:**
  - **Backup & Restore:** Periodical backups ke offsite location
  - **Pilot Light:** Minimal infrastructure running di DR site
  - **Warm Standby:** Scaled-down version running continuously
  - **Multi-Region Active-Active:** Full infrastructure di multiple regions
- **DR Testing:** Regular DR drills (quarterly minimum):
  - Document test procedures
  - Measure actual RTO/RPO
  - Identify gaps dan improve

## 4. ON-CALL & ESCALATION
- **On-Call Rotation:** Establish rotating on-call schedule:
  - Primary on-call: First responder
  - Secondary on-call: Backup
  - Escalation path yang jelas
- **On-Call Tools:**
  - PagerDuty, Opsgenie, or similar
  - Mobile app dengan push notifications
  - Backup notification channels
- **Escalation Policy:**
  - Level 1: Primary on-call (15 min response)
  - Level 2: Secondary on-call + team lead (30 min response)
  - Level 3: Engineering manager (1 hour response)
  - Level 4: Executive notification (for SEV-1 affecting customers)
- **On-Call Best Practices:**
  - Fair rotation untuk prevent burnout
  - Compensate on-call hours appropriately
  - Limit on-call frequency (max 1 week in 4-6)
  - Provide quiet hours after major incidents

## 5. MONITORING & ALERTING
- **Three Pillars of Observability:**
  - **Metrics:** Quantitative data (latency, throughput, error rates)
  - **Logs:** Discrete events dengan timestamps
  - **Traces:** Request flow across services
- **Golden Signals:** Monitor these signals untuk every service:
  - **Latency:** Response time distribution (p50, p95, p99)
  - **Traffic:** Requests per second / throughput
  - **Errors:** Error rate (HTTP 5xx, exceptions)
  - **Saturation:** Resource utilization (CPU, memory, connections)
- **Alert Quality:**
  - **Signal-to-Noise Ratio:** High — alerts harus actionable
  - **Avoid alert fatigue:** No alerts for recoverable failures
  - **SLO-based alerts:** Alert on approaching SLO breach
- **Alert Threshold Configuration:**
  - Warning: 70% of threshold
  - Critical: 90% of threshold
  - Use adaptive thresholds untuk seasonal patterns

## 6. HEALTH CHECKS
- **Liveness Probe (`/health` or `/live`):** Indicates if process is alive:
  - Return 200 if application is running
  - Don't check external dependencies
- **Readiness Probe (`/ready`):** Indicates if ready to serve traffic:
  - Check database connectivity
  - Check cache connectivity
  - Check dependent services
- **Startup Probe:** For slow-starting applications:
  - Check initialization complete
  - Fail fast if cannot start
- **Health Check Implementation:**
  - Lightweight — avoid expensive operations
  - Timeout — fail after 2-5 seconds
  - Circuit breaker — don't cascade failures

## 7. POST-MORTEM CULTURE
- **Blameless Post-Mortem:** Focus on systems dan processes, bukan individuals.
- **Post-Mortem Timeline:**
  - Draft within 48 hours of incident
  - Review dengan team within 1 week
  - Publish within 2 weeks
- **Post-Mortem Structure:**
  - **Summary:** What happened, impact, duration
  - **Timeline:** Detailed sequence of events
  - **Root Cause:** Why it happened
  - **Contributing Factors:** Additional factors
  - **Impact:** What was affected
  - **Response:** How was it resolved
  - **Action Items:** What will we do to prevent recurrence
- **Action Item Tracking:** Assign owners dan deadlines. Track completion.
- **Blameless Culture:** Share learnings widely. Celebrate finding root causes.

## 8. CAPACITY PLANNING
- **Demand Forecasting:** Project future capacity needs:
  - Historical growth rate
  - Seasonal patterns
  - Product roadmap impact
- **Resource Sizing:**
  - CPU, Memory, Storage, Network bandwidth
  - Headroom for peak traffic (20-30%)
  - Scaling buffer
- **Cost Optimization:** Balance cost dengan reliability:
  - Reserved instances untuk baseline capacity
  - Spot/preemptible instances untuk flexible workloads
  - Auto-scaling untuk variable demand

## 9. RUNBOOK TEMPLATES
- **Standardized Runbooks:** Document operational procedures:
  - Step-by-step instructions
  - Expected outcomes
  - Troubleshooting steps
  - Rollback procedures
- **Runbook Structure:**
  - Purpose dan scope
  - Prerequisites
  - Procedure (numbered steps)
  - Verification steps
  - Rollback procedure
  - Escalation path
- **Runbook Maintenance:** Review dan update quarterly.
- **Automation Opportunities:** Identify repetitive procedures untuk automate.

## 10. CHANGE MANAGEMENT
- **Change Advisory Board (CAB):** Review significant changes:
  - Emergency changes: Post-approval within 24 hours
  - Normal changes: 5-day advance approval
  - Standard changes: Pre-approved dengan checklist
- **Change Categories:**
  - **Standard:** Low risk, pre-approved
  - **Normal:** Medium risk, requires approval
  - **Emergency:** Urgent, expedited approval
- **Change Metrics:**
  - Change failure rate: % of changes causing incidents
  - Mean time to restore (MTTR)
  - Rollback rate

## 11. DEPENDENCY MANAGEMENT
- **Service Catalog:** Document semua dependencies:
  - Internal services
  - External APIs
  - Infrastructure services
  - Data stores
- **Dependency Health:** Monitor health dari critical dependencies.
- **Dependency Matrix:** Map dependencies untuk identify blast radius.
- **Circuit Breaker Pattern:** Protect dari cascading failures:
  - Open: Fail fast when dependency unhealthy
  - Half-open: Limited requests untuk testing recovery
  - Closed: Normal operation

## 12. INCIDENT MANAGEMENT TOOLS
- **Incident Management System:** Centralized platform:
  - PagerDuty, Opsgenie, or similar
  - Integration dengan monitoring systems
  - Automatic escalation
  - On-call scheduling
- **Runbook Integration:** Link runbooks ke alerts.
- **Post-Incident Integration:** Connect incident records ke post-mortems.
- **Metrics Dashboard:** Track incident metrics:
  - MTTD (Mean Time to Detect)
  - MTTR (Mean Time to Respond/Resolve)
  - Incident frequency
  - Repeat incidents

---

**Invok:** `/reliability` | **Priority:** HIGH | **Version:** 1.0
