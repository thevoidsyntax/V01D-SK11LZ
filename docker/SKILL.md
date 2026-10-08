---
name: docker
description: Docker containerization best practices, Dockerfile optimization, multi-stage builds
version: "1.0.0"
category: [infrastructure]
priority: high
phase: any
tech_stack:
  services: [docker, containerization]
scale: [mvp, small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/Dockerfile*"
      reason: "Docker project detected"
    - has_file: "**/docker-compose*.yml"
      reason: "Docker Compose project detected"
  skill_tier: core
triggers:
  phrases:
    - "docker"
    - "container"
    - "containerize"
    - "dockerfile"
    - "docker-compose"
    - "kubernetes"
    - "k8s"
    - "pod"
    - "deployment"
    - "helm"
    - "ingress"
    - "service mesh"
capabilities: [implementation, review]
quality:
  rules_count: 12
  examples_count: 25
  stability: stable
integrates_with: [auto-router, deployment, ci-cd]
source:
  origin: local
author: Claude
---

# Docker - Container Best Practices

## Dockerfile Best Practices

### Multi-Stage Build Pattern
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy only needed files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```

### Go Multi-Stage
```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main .

# Production stage
FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/main /main
ENTRYPOINT ["/main"]
```

### .NET Multi-Stage
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["*.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS production
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENTRYPOINT ["dotnet", "app.dll"]
```

## Security Best Practices

### Security-First Dockerfile
```dockerfile
# Use specific version, not 'latest'
FROM node:20.11.1-alpine3.19

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy as root, then change ownership
COPY --chown=appuser:appgroup . .

USER appuser

# No secrets in image
ENV API_KEY=""
```

### Scan & Harden
```bash
# Scan image
docker scout cves myapp:latest
trivy image myapp:latest

# Scan during build
docker buildx build --build-arg TRIVY_SCAN=true .

# Security options
docker run --security-opt=no-new-privileges:true \
           --read-only \
           --tmpfs /tmp \
           myapp
```

### Secret Management
```dockerfile
# DON'T DO THIS
ENV API_KEY=secret123

# DO THIS - runtime only
docker run -e API_KEY=$API_KEY myapp

# Or use Docker secrets (Swarm)
echo "secret123" | docker secret create api_key -
```

## Layer Caching Optimization

### Order for Cache Efficiency
```dockerfile
# GOOD - Copy deps first, then source
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# BAD - Invalidates cache on any source change
COPY . .
RUN npm ci
RUN npm run build
```

### Combine Layers
```dockerfile
# Combine RUN commands
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        git \
        ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Multiple COPY in one layer
COPY ./*.json ./
COPY ./*.js ./
```

## Docker Compose

### Production Compose
```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: myapp:${TAG:-latest}
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    secrets:
      - api_key
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

secrets:
  api_key:
    file: ./secrets/api_key.txt
```

### Development Compose
```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      target: development
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DEBUG=*
    ports:
      - "3000:3000"
      - "9229:9229"
    command: npm run dev:debug

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password

volumes:
  postgres_data:

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

## Network & Health

### Network Isolation
```yaml
services:
  frontend:
    networks:
      - web

  backend:
    networks:
      - web
      - internal

  db:
    networks:
      - internal
    # No exposed ports externally

networks:
  web:
    external: true
  internal:
    internal: true
```

### Health Check Examples
```dockerfile
# HTTP health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# PostgreSQL
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD pg_isready -U postgres -d myapp || exit 1

# Redis
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD redis-cli ping || exit 1
```

## Resource Limits

### Memory & CPU
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Logging
```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Buildx for Multi-Platform

### Multi-Platform Build
```bash
# Setup buildx
docker buildx create --name mybuilder
docker buildx use mybuilder
docker buildx inspect --bootstrap

# Build for multiple platforms
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag myapp:latest \
    --push \
    .
```

### Cache Optimization
```bash
# Use GitHub Actions cache
docker buildx build \
    --platform linux/amd64 \
    --tag myapp:latest \
    --push \
    --cache-from type=gha,scope=build \
    --cache-to type=gha,scope=build,mode=max \
    .
```

## Cleanup Commands

### Prune Unused Resources
```bash
# Remove unused images
docker image prune -a

# Remove unused containers
docker container prune

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything unused
docker system prune -a

# Remove build cache
docker builder prune -a
```

### Size Analysis
```bash
# NOTE: Docker Go template syntax {{.Field}} for --format flag
# These are Docker CLI formatting placeholders, not variables to replace

# Show image sizes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Largest images
docker images --format '{{.Size}}\t{{.Repository}}:{{.Tag}}' | sort -hr | head -10

# Analyze layer sizes
docker history myapp:latest --no-trunc
```

## Common Patterns

### Node.js Production
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
EXPOSE 3000

FROM base AS production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
ENV NODE_ENV=production
USER node
CMD ["node", "server.js"]

FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
```

### Python with Virtualenv
```dockerfile
FROM python:3.11-slim AS base

FROM base AS builder
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS production
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY app/ ./app/
USER python
CMD ["python", "app/main.py"]
```

### Java with Multi-Stage
```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine AS production
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

**Invoke:** `/docker` | **Priority:** HIGH
