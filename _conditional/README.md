# Conditional Layer

**Specialized Skills - Auto-loaded Based on Project Type**

## Contents

| Category | Skill | When Loaded |
|----------|-------|-------------|
| Container | `docker/` | Docker files detected |
| Orchestration | `kubernetes/` | K8s files detected |
| IaC | `terraform/` | Terraform files detected |
| Deployment | `deployment/` | CI/CD or deploy config |
| Serverless | `serverless/` | Lambda/functions detected |
| Mobile | `mobile/` | React Native, Flutter detected |
| Browser | `browser-use/` | Browser automation detected |
| Vision | `reticle/` | Computer vision detected |
| UI/Design | `ui-ux-pro-max/` | Design patterns detected |

## Auto-Detection

These skills are loaded **automatically** when patterns are detected:

```yaml
# docker detected → /docker loaded
- dockerfile
- docker-compose.yml
- FROM alpine

# kubernetes detected → /kubernetes loaded  
- deployment.yaml
- service.yaml
- kubectl commands

# terraform detected → /terraform loaded
- *.tf files
- terraform init
- provider "aws"

# github actions detected → /deployment loaded
- .github/workflows/*.yml
- ci.yml, cd.yml
```

## Manual Invocation

You can also invoke these skills manually:

```bash
/docker              # Container best practices
/kubernetes          # K8s orchestration
/terraform           # Infrastructure as Code
/deployment           # CI/CD + Deployment
/serverless          # Serverless patterns
/mobile              # Mobile development
/browser-use         # Browser automation
/reticle             # Computer vision
/ui-ux-pro-max      # Design system
```

## Deployment Skill

The `deployment/` skill includes content from:
- CI/CD pipelines (merged from ci-cd/)
- Deployment strategies
- Infrastructure as Code
- GitOps workflows

## Version

v2.0.0 - Reorganized structure
