---
name: terraform
description: Terraform Infrastructure as Code best practices, module design, and state management
version: "1.0.0"
category: [infrastructure]
priority: high
phase: phase-5
tech_stack:
  services: [terraform, aws, gcp, azure]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: false
  conditions:
    - has_file: "**/terraform/**"
      reason: "Terraform project detected"
  skill_tier: optional
capabilities: [implementation, analysis]
quality:
  rules_count: 10
  examples_count: 20
  stability: stable
integrates_with: [deployment, kubernetes]
dependencies: [deployment]
source:
  origin: local
author: Claude
---

# Terraform - Infrastructure as Code

## Module Structure

### Standard Module Layout
```
modules/
├── main.tf
├── variables.tf
├── outputs.tf
├── versions.tf
└── README.md
```

### main.tf
```terraform
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-*-*-amd64-server-*"]
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id    = var.subnet_id

  user_data = templatefile("${path.module}/user_data.sh", {
    environment = var.environment
  })

  tags = {
    Name        = "${var.project}-${var.environment}-app"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_security_group" "app" {
  name        = "${var.project}-${var.environment}-app"
  description = "Security group for ${var.project} app"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### variables.tf
```terraform
variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID"
  type        = string
}
```

### outputs.tf
```terraform
output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.app.id
}

output "private_ip" {
  description = "Private IP address"
  value       = aws_instance.app.private_ip
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.app.id
}
```

## State Management

### Remote State with S3
```terraform
# backend.tf
terraform {
  backend "s3" {
    bucket         = "myapp-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "myapp-terraform-locks"
  }
}
```

### State Locking with DynamoDB
```terraform
# Enable in S3 backend (see above)
# dynamodb_table = "myapp-terraform-locks"

# DynamoDB table for locks
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "myapp-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

### Import Existing Resources
```bash
# Import existing EC2 instance
terraform import aws_instance.app i-1234567890abcdef0

# Import existing security group
terraform import aws_security_group.app sg-12345678

# Generate import block
terraform plan -generate-config-out=generated.tf
```

## Workspace Strategy

### Multi-Environment with Workspaces
```bash
# Create workspaces
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod

# Switch workspace
terraform workspace select prod

# Use workspace in code
resource "aws_instance" "app" {
  instance_type = terraform.workspace == "prod" ? "t3.large" : "t3.micro"
}
```

### Alternative: Directories
```
environments/
├── dev/
│   ├── main.tf
│   ├── variables.tf
│   └── terraform.tfvars
├── staging/
│   ├── main.tf
│   ├── variables.tf
│   └── terraform.tfvars
└── prod/
    ├── main.tf
    ├── variables.tf
    └── terraform.tfvars
```

## Terraform Best Practices

### Use terraform.tfvars
```hcl
# terraform.tfvars (don't commit!)
project     = "myapp"
environment = "prod"
instance_type = "t3.large"
vpc_id     = "vpc-12345678"
```

### Always Pin Versions
```terraform
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
```

### Use count or for_each Wisely
```terraform
# When items are identical
resource "aws_instance" "server" {
  count = 3

  ami           = var.ami
  instance_type = var.instance_type
  tags = {
    Name = "server-${count.index}"
  }
}

# When items have different configurations
resource "aws_instance" "server" {
  for_each = toset(["web", "api", "worker"])

  ami           = var.ami
  instance_type = var.instance_type
  tags = {
    Name = "server-${each.key}"
  }
}
```

## Data Sources

### Lookup Existing Resources
```terraform
data "aws_vpc" "main" {
  default = true
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.main.id]
  }
  tags = {
    Type = "private"
  }
}

data "aws_ami" "app" {
  most_recent = true
  owners      = [var.owner_id]

  filter {
    name   = "name"
    values = ["app-*"]
  }
}
```

## Loops and Expressions

### for_each with Maps
```terraform
variable "tags" {
  type = map(string)
  default = {
    Environment = "prod"
    Project     = "myapp"
  }
}

resource "aws_instance" "app" {
  for_each = var.instances

  ami           = each.value.ami
  instance_type = each.value.type
  tags = merge(
    var.tags,
    { Name = each.key }
  )
}

# instances = {
#   "web1" = { ami = "ami-123", type = "t3.micro" }
#   "web2" = { ami = "ami-123", type = "t3.micro" }
# }
```

### Dynamic Blocks
```terraform
resource "aws_security_group" "app" {
  name        = "app-sg"
  description = "Security group for app"
  vpc_id      = var.vpc_id

  dynamic "ingress" {
    for_each = var.allowed_ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["10.0.0.0/8"]
    }
  }
}

# allowed_ports = [80, 443, 3000, 8080]
```

## Remote Execution

### Provisioners
```terraform
resource "aws_instance" "app" {
  ami           = var.ami
  instance_type = var.instance_type

  # Local provisioner (on machine running Terraform)
  provisioner "local-exec" {
    command = "echo ${self.private_ip} >> inventory.txt"
  }

  # Remote provisioner (on created instance)
  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nginx",
    ]

    connection {
      type        = "ssh"
      host        = self.public_ip
      user        = "ubuntu"
      private_key = file(var.private_key_path)
    }
  }
}
```

### Null Resource for Ansible
```terraform
resource "null_resource" "ansible" {
  triggers = {
    instance_ids = join(",", aws_instance.app[*].id)
  }

  provisioner "local-exec" {
    command = "ansible-playbook -i '${aws_instance.app[0].public_ip},' playbook.yml"
  }
}
```

## Testing

### Terratest Example
```go
// tests/infrastructure_test.go
package test

import (
    "testing"
    "github.com/gruntwork-io/terratest/modules/terraform"
    "github.com/stretchr/testify/assert"
)

func TestTerraformApp(t *testing.T) {
    terraformOptions := &terraform.Options{
        TerraformDir: "../modules/app",
        Vars: map[string]interface{}{
            "project":     "test",
            "environment": "dev",
            "instance_type": "t3.micro",
        },
    }

    defer terraform.Destroy(t, terraformOptions)
    terraform.InitAndApply(t, terraformOptions)

    instanceID := terraform.Output(t, terraformOptions, "instance_id")
    assert.NotEmpty(t, instanceID)
}
```

---

**Invoke:** `/terraform` | **Priority:** LOW
