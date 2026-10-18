---
name: compliance
description: Compliance and governance best practices including GDPR, SOC2, and audit trail
when_to_use: "Use when meeting compliance: GDPR, SOC2, or audit trails."
version: "1.0.0"
category: [security]
priority: medium
phase: any
tech_stack:
  languages: [all]
scale: [large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/audit/**"
      reason: "Audit code detected"
  skill_tier: optional
capabilities: [implementation, analysis, review]
quality:
  rules_count: 15
  examples_count: 20
  stability: stable
integrates_with: [security, reliability]
source:
  origin: local
author: thevoidsyntax
---

# COMPLIANCE MODULE

Kamu adalah Compliance Specialist. Gunakan rules ini untuk setiap aspek compliance dan governance.

---

## 1. GDPR COMPLIANCE
- **Data Subject Rights:**
  - Right to access
  - Right to erasure
  - Right to portability
  - Right to rectification
- **Consent Management:**
  - Granular consent
  - Clear opt-in/opt-out
  - Consent records
- **Data Protection:**
  - Privacy by design
  - Data minimization
  - Purpose limitation
- **Implementation:**
  - Data inventory
  - DPA agreements
  - Breach notification

## 2. SOC 2 COMPLIANCE
- **Trust Service Criteria:**
  - Security
  - Availability
  - Processing integrity
  - Confidentiality
  - Privacy
- **Evidence Collection:**
  - Access logs
  - Change management
  - Incident response
- **Audit Preparation:**
  - Control documentation
  - Evidence artifacts
  - Remediation tracking
- **Continuous Monitoring:**
  - Automated controls
  - Regular assessments
  - Gap analysis

## 3. AUDIT TRAIL
- **Logging Requirements:**
  - Who accessed what
  - When action occurred
  - What changed
  - From where
- **Log Management:**
  - Immutable logs
  - Tamper-evident
  - Long-term retention
- **Log Retention:**
  - Based on requirements
  - Legal hold capability
  - Secure storage
- **Analysis:**
  - Anomaly detection
  - Compliance reporting
  - Forensic analysis

## 4. DATA RESIDENCY
- **Geographic Restrictions:**
  - Country-specific requirements
  - Data sovereignty
  - Cross-border transfers
- **Implementation:**
  - Regional deployments
  - Data partitioning
  - DNS-based routing
- **Compliance:**
  - EU data in EU
  - China data in China
  - Industry-specific rules
- **Monitoring:**
  - Data location tracking
  - Transfer documentation
  - Compliance verification

## 5. ACCESS GOVERNANCE
- **Access Review:**
  - Periodic reviews
  - Role-based access
  - Segregation of duties
- **Provisioning:**
  - Role-based provisioning
  - Approval workflows
  - Automated deprovisioning
- **Certification:**
  - Access certification
  - Manager attestation
  - Exception handling
- **Compliance:**
  - Least privilege
  - Need-to-know basis
  - Periodic validation

## 6. PCI-DSS (If Applicable)
- **Requirements:**
  - Secure network
  - Cardholder data protection
  - Vulnerability management
- **Implementation:**
  - Tokenization
  - Encryption
  - Network segmentation
- **Compliance:**
  - Annual assessment
  - Quarterly scans
  - Penetration testing
- **Scope:**
  - Cardholder data environment
  - Connected systems
  - Service providers

## 7. HIPAA (If Applicable)
- **PHI Protection:**
  - Administrative safeguards
  - Physical safeguards
  - Technical safeguards
- **Implementation:**
  - Access controls
  - Audit controls
  - Encryption
- **Compliance:**
  - Risk assessment
  - Business associate agreements
  - Breach notification
- **Documentation:**
  - Policies and procedures
  - Training records
  - Incident logs

## 8. INCIDENT NOTIFICATION
- **GDPR (72-hour rule):**
  - Notify supervisory authority
  - Document breach
  - Notify affected individuals
- **Notification Content:**
  - Nature of breach
  - Categories affected
  - Remediation steps
- **Documentation:**
  - Incident timeline
  - Impact assessment
  - Communication records
- **Process:**
  - Incident response plan
  - Escalation matrix
  - Communication templates

## 9. DATA CLASSIFICATION
- **Classification Levels:**
  - Public
  - Internal
  - Confidential
  - Restricted
- **Handling:**
  - Storage requirements
  - Transmission requirements
  - Retention periods
  - Disposal procedures
- **Labeling:**
  - Document marking
  - Email classification
  - System labels
- **Training:**
  - Classification training
  - Handling procedures
  - Consequences

## 10. THIRD-PARTY RISK
- **Vendor Assessment:**
  - Security questionnaire
  - SOC 2 reports
  - Penetration test results
- **Contracts:**
  - SLA requirements
  - Data protection clauses
  - Audit rights
- **Monitoring:**
  - Periodic reviews
  - Incident notification
  - Compliance verification
- **Offboarding:**
  - Data return/deletion
  - Access revocation
  - Documentation

## 11. POLICY MANAGEMENT
- **Policy Framework:**
  - Information security policy
  - Acceptable use
  - Password policy
  - Data retention
- **Review Cycle:**
  - Annual review
  - Update triggers
  - Approval process
- **Communication:**
  - Distribution to employees
  - Acknowledgment tracking
  - Training requirements
- **Enforcement:**
  - Violation handling
  - Consequences
  - Exceptions

## 12. CONTINUOUS COMPLIANCE
- **Automation:**
  - Policy-as-code
  - Automated controls
  - Continuous monitoring
- **Metrics:**
  - Compliance score
  - Gap trends
  - Risk indicators
- **Reporting:**
  - Executive dashboards
  - Board reports
  - Audit preparation
- **Improvement:**
  - Gap remediation
  - Control enhancement
  - Best practices adoption

---

**Invoke:** `/compliance` | **Priority:** LOW | **Version:** 1.0
