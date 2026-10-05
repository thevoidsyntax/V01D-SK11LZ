---
name: ci-cd
description: CI/CD pipeline automation using GitHub Actions, GitLab CI, and deployment patterns
version: "1.0.0"
category: [infrastructure]
priority: high
phase: any
tech_stack:
  services: [github-actions, gitlab-ci, jenkins]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: ".github/workflows/**"
      reason: "GitHub Actions detected"
    - has_file: ".gitlab-ci.yml"
      reason: "GitLab CI detected"
  skill_tier: core
triggers:
  phrases:
    - "ci"
    - "cd"
    - "pipeline"
    - "github actions"
    - "gitlab ci"
    - "jenkins"
    - "deploy"
    - "deployment"
    - "automation"
    - "workflow"
capabilities: [implementation, review]
quality:
  rules_count: 10
  examples_count: 20
  stability: stable
integrates_with: [auto-route, docker, deployment]
source:
  origin: local
author: Claude
---

# CI/CD - Pipeline Automation

## GitHub Actions

### Basic Workflow
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run lint
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: |
          docker build -t myapp:${{ github.sha }} .
          docker tag myapp:${{ github.sha }} myapp:latest
      
      - name: Push to Registry
        run: |
          echo ${{ secrets.DOCKER_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push myapp:latest
```

### Production Deploy
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ubuntu
          key: ${{ secrets.SSH_KEY }}
          script: |
            docker pull myapp:latest
            docker-compose -f /app/docker-compose.yml up -d
            docker image prune -f

  notify:
    needs: deploy
    runs-on: ubuntu-latest
    
    steps:
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          channel-id: 'deployments'
          payload: |
            {
              "text": "Deployed ${{ github.ref_name }} to production",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Deployment Successful*\nVersion: ${{ github.ref_name }}"
                  }
                }
              ]
            }
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

### Matrix Build
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
        os: [ubuntu-latest, windows-latest]
        exclude:
          - os: windows-latest
            node-version: 22.x
    
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

### Reusable Workflows
```yaml
# .github/workflows/reusable-test.yml
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
    secrets:
      NPM_TOKEN:
        required: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          registry-url: 'https://npm.pkg.github.com'
          scope: '@myorg'
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      - run: npm test
```

## GitLab CI

### Basic Pipeline
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_IMAGE: registry.gitlab.com/mygroup/myapp

test:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    - npm run lint
    - npm test
  coverage: '/Statements\s*:\s*(\d+\.\d+)%/'

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA .
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA
  only:
    - main
    - develop

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST https://api.deploy.service/deploy
  environment:
    name: production
  only:
    - main
  when: manual
```

### Docker Build with Cache
```yaml
docker build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build --cache-from $DOCKER_IMAGE:latest -t $DOCKER_IMAGE:$CI_COMMIT_SHA -t $DOCKER_IMAGE:latest .
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA
    - docker push $DOCKER_IMAGE:latest
  only:
    - main
```

## Testing Patterns

### Multi-Stage Testing
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
  
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test -- --coverage
  
  integration-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test
          POSTGRES_USER: user
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - run: npm run test:integration
  
  e2e-test:
    runs-on: ubuntu-latest
    needs: [unit-test, integration-test]
    steps:
      - run: npm run test:e2e
```

### Parallel Jobs
```yaml
jobs:
  parallel-test-1:
    parallel: 3
    script:
      - npm test -- --split=$CI_NODE_TOTAL --group=$CI_NODE_INDEX
  
  browser-test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0
    steps:
      - run: npx playwright test
```

## Security Scanning

### SAST (Static Analysis)
```yaml
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
      
      - name: Fail on critical vulnerabilities
        run: |
          if grep -q '"severity":"CRITICAL"' trivy-results.sarif; then
            echo "Critical vulnerabilities found!"
            exit 1
          fi
```

### Dependency Scanning
```yaml
jobs:
  dependency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Audit dependencies
        run: npm audit --audit-level=high
      
      - name: Check for outdated
        run: npm outdated --depth=0 || true
```

### Container Scanning
```yaml
jobs:
  container-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build image
        run: docker build -t myapp:${{ github.sha }} .
      
      - name: Scan with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:${{ github.sha }}'
          format: 'table'
          exit-code: '1'
          severity: 'CRITICAL,HIGH'
```

## Deployment Patterns

### Blue-Green Deployment
```yaml
jobs:
  deploy-blue:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to blue environment
        run: |
          kubectl set image deployment/myapp container=myapp:${{ github.sha }} --namespace=blue
          kubectl rollout status deployment/myapp --namespace=blue
      
      - name: Smoke test blue
        run: |
          sleep 10
          curl -f https://blue.myapp.com/health || exit 1
      
      - name: Switch traffic
        run: |
          kubectl patch service/myapp -n production -p '{"spec":{"selector":{"active":"blue"}}}'
```

### Canary Deployment
```yaml
jobs:
  canary-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy canary
        run: |
          kubectl scale deployment/myapp-canary --replicas=1
          kubectl set image deployment/myapp-canary container=myapp:${{ github.sha }}
      
      - name: Monitor canary
        run: |
          sleep 60
          # Check error rate
          ERROR_RATE=$(curl -s https://metrics.myapp.com/canary/errors | jq .rate)
          if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then
            echo "Canary error rate too high!"
            kubectl delete deployment/myapp-canary
            exit 1
          fi
      
      - name: Promote canary
        run: |
          kubectl set image deployment/myapp container=myapp:${{ github.sha }}
          kubectl scale deployment/myapp-canary --replicas=0
```

### Rollback
```yaml
jobs:
  rollback:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    when: manual
    steps:
      - name: Rollback deployment
        run: |
          kubectl rollout undo deployment/myapp
          kubectl rollout status deployment/myapp
```

## Caching

### Docker Layer Cache
```yaml
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### npm Cache
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

### Build Cache
```yaml
- name: Cache build outputs
  uses: actions/cache@v4
  with:
    path: |
      .next/cache
      dist
    key: ${{ runner.os }}-build-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-build-
```

## Notifications

### Slack Notification
```yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    channel-id: 'ci-cd'
    payload: |
      {
        "text": "Build ${{ github.workflow }} failed",
        "blocks": [{
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Build Failed*\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Details>"
          }
        }]
      }
```

### Discord Notification
```yaml
- name: Discord notification
  if: always()
  run: |
    curl -H "Content-Type: application/json" \
         -d "{\"content\": \"Build ${{ github.workflow }}: ${{ job.status }}\"}" \
         ${{ secrets.DISCORD_WEBHOOK }}
```

## Environment Variables

### Secrets Management
```yaml
env:
  # From repository secrets
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}

# Or inline (masked)
- name: Set env
  run: echo "APP_VERSION=${{ github.sha }}" >> $GITHUB_ENV

- name: Use env
  run: echo "Building $APP_VERSION"
```

---

**Invoke:** `/ci-cd` | **Priority:** HIGH
