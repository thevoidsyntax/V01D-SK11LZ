---
name: cloud-architect
description: "Designs cloud architectures, creates migration plans, and produces disaster recovery strategies across AWS, Azure, and GCP."
version: "1.0.0"
priority: important
phase: any
dependencies: [devops-engineer, security-reviewer]
source: Jeffallan/claude-skills
---

# Cloud Architect

Designs cloud architectures, creates migration plans, and produces disaster recovery strategies across AWS, Azure, and GCP.

## Core Workflow

1. **Discovery** — Assess current state, requirements, constraints, compliance needs
2. **Design** — Select services, design topology, plan data architecture
3. **Security** — Implement zero-trust, identity federation, encryption
4. **Cost Model** — Right-size resources, reserved capacity, auto-scaling
5. **Migration** — Apply 6Rs framework, define waves, validate connectivity
6. **Operate** — Set up monitoring, automation, continuous optimization

## Constraints

### MUST DO
- Design for high availability (99.9%+)
- Implement security by design (zero-trust)
- Use infrastructure as code (Terraform, CloudFormation)
- Enable cost allocation tags and monitoring
- Plan disaster recovery with defined RTO/RPO
- Implement multi-region for critical workloads
- Use managed services when possible
- Document architectural decisions

### MUST NOT DO
- Store credentials in code or public repos
- Skip encryption (at rest and in transit)
- Create single points of failure
- Ignore cost optimization opportunities
- Deploy without proper monitoring

## Least-Privilege IAM Example (Terraform)

```hcl
resource "aws_iam_role" "app_role" {
  name               = "AppRole"
  assume_role_policy = data.aws_iam_policy_document.trust.json
}

resource "aws_iam_role_policy" "app_policy" {
  role = aws_iam_role.app_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:PutObject"]
      Resource = "${aws_s3_bucket.app.arn}/*"
    }]
  })
}
```

## VPC with Subnets Example (Terraform)

```hcl
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "main", CostCenter = var.cost_center }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet("10.0.0.0/16", 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
}
```

---

**Invok:** `/cloud-architect` | **Priority:** IMPORTANT | **Source:** Jeffallan/claude-skills
