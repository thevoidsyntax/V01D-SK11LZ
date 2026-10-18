---
name: finops
description: Cloud FinOps practices for cost visibility, tagging strategies, and cost optimization
when_to_use: "Use when controlling cloud cost: visibility, tagging, or optimization."
version: "1.0.0"
category: [infrastructure]
priority: low
phase: phase-6
tech_stack:
  services: [aws, gcp, azure]
scale: [large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - phase: phase-6
      reason: "Launch phase requires cost optimization"
  skill_tier: optional
capabilities: [analysis]
quality:
  rules_count: 8
  examples_count: 10
  stability: stable
integrates_with: [reliability]
source:
  origin: local
author: thevoidsyntax
---

# FINOPS MODULE

Kamu adalah FinOps Specialist. Gunakan rules ini untuk setiap aspek cloud cost optimization.

---

## 1. COST VISIBILITY
- **Tagging Strategy:**
  - Resource tagging (environment, team, project)
  - Consistent naming convention
  - Mandatory tags
- **Cost Allocation:**
  - By team
  - By project
  - By environment
  - By product
- **Tools:**
  - AWS Cost Explorer
  - Azure Cost Management
  - GCP Billing
  - CloudHealth, Spot.io
- **Dashboards:**
  - Real-time visibility
  - Trend analysis
  - Anomaly detection

## 2. RESOURCE TAGGING
- **Standard Tags:**
  - Environment: prod, staging, dev
  - Team: engineering, product
  - Project: project-name
  - Cost Center: CC-123
  - Owner: email
- **Enforcement:**
  - Tag policies
  - Auto-remediation
  - Compliance checks
- **Cost Tracking:**
  - Tagged resources
  - Untagged resources
  - Monthly reporting
- **Automation:**
  - Terraform tagging
  - CI/CD tagging
  - Default tags

## 3. SPOT/ PREEMPTIBLE INSTANCES
- **Strategy:**
  - Stateless workloads
  - Batch processing
  - Fault-tolerant applications
- **Implementation:**
  - Instance diversification
  - Spot fleet
  - Auto-scaling with spot
- **Savings:**
  - Up to 90% vs on-demand
  - Interrupt handling
  - Checkpointing
- **Risks:**
  - Interruption
  - Availability
  - Spot pricing

## 4. RESERVED CAPACITY
- **Planning:**
  - Historical usage analysis
  - Commitment terms (1 or 3 year)
  - Payment options (all upfront, partial)
- **Coverage:**
  - Target 60-70% coverage
  - Use savings plans
  - Flexible commitments
- **Management:**
  - Track utilization
  - Exchange reservations
  - Sell unused
- **Tools:**
  - AWS Reserved Instance
  - Azure Reserved VM
  - GCP Committed Use

## 5. RIGHTSIZING
- **Analysis:**
  - Underutilized resources
  - Over-provisioned instances
  - Scaling analysis
- **Recommendations:**
  - Downsize over-provisioned
  - Optimize types
  - Schedule non-production
- **Automation:**
  - Rightsizing recommendations
  - Auto-remediation
  - Scheduled actions
- **Monitoring:**
  - Utilization tracking
  - Post-rightsizing validation
  - Trend analysis

## 6. COST OPTIMIZATION CULTURE
- **Team Awareness:**
  - Cost training
  - Visibility dashboards
  - Cost ownership
- **Best Practices:**
  - Clean up unused resources
  - Schedule development resources
  - Use serverless
- **Incentives:**
  - Cost savings sharing
  - Recognition
  - Gamification
- **Processes:**
  - Cost in design
  - Budget alerts
  - Review meetings

## 7. BUDGET MANAGEMENT
- **Budget Types:**
  - Monthly budgets
  - Project budgets
  - Environment budgets
- **Alerting:**
  - Threshold alerts
  - Forecast alerts
  - Anomaly alerts
- **Forecasting:**
  - Trend analysis
  - Seasonal patterns
  - Growth projection
- **Governance:**
  - Budget approval
  - Over-budget process
  - Justification

## 8. COMPUTE OPTIMIZATION
- **Strategies:**
  - Auto-scaling
  - Scheduled scaling
  - Spot instances
- **Serverless:**
  - Lambda, Cloud Functions
  - Pay per use
  - No idle cost
- **Containers:**
  - Right-sized pods
  - Spot for K8s
  - Efficient scheduling
- **Databases:**
  - Right-sized instances
  - Reserved capacity
  - Serverless options

## 9. STORAGE OPTIMIZATION
- **Tiering:**
  - Hot to cold
  - Lifecycle policies
  - Auto-archival
- **Cleanup:**
  - Delete unused
  - Remove old backups
  - Clean up snapshots
- **Compression:**
  - Enable compression
  - Optimize formats
  - Reduce redundancy
- **Monitoring:**
  - Storage growth
  - Cost per GB
  - Waste identification

## 10. NETWORKING COSTS
- **Optimization:**
  - NAT Gateway alternatives
  - VPC endpoints
  - CDN usage
- **Data Transfer:**
  - Minimize cross-region
  - Use private networking
  - Compression
- **Monitoring:**
  - Data transfer costs
  - NAT gateway costs
  - CDN costs
- **Optimization:**
  - Transfer acceleration
  - CloudFront
  - Regional deployment

## 11. LICENSE OPTIMIZATION
- **BYOL:**
  - License mobility
  - Dedicated hosts
  - Compliance
- **Reserved:**
  - SQL Server
  - Oracle
  - Third-party software
- **Alternatives:**
  - Open source
  - SaaS options
  - Managed services
- **Monitoring:**
  - License utilization
  - Compliance status
  - Cost tracking

## 12. FINOPS PROCESSES
- **Monthly Review:**
  - Cost analysis
  - Savings review
  - Optimization actions
- **Governance:**
  - Cost approval
  - Budget enforcement
  - Exception handling
- **Reporting:**
  - Executive summary
  - Team reports
  - Chargeback/showback
- **Continuous Improvement:**
  - Best practices
  - Tool evaluation
  - Team training

---

**Invoke:** `/finops` | **Priority:** LOW | **Version:** 1.0
