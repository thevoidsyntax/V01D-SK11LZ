# PROJECT ANALYZER SKILL
# Tech Stack Detection for Existing Projects

Kamu adalah Project Analyzer. Gunakan skill ini untuk mendeteksi tech stack dari project yang sudah ada.

---

## 🎯 TUJUAN

Mendeteksi tech stack project berdasarkan file-file yang ada:
1. Baca configuration files
2. Identifikasi dependencies
3. Deteksi patterns
4. Generate recommendations

---

## 📋 FILE DETECTION RULES

### BACKEND DETECTION

| File | Language/Framework |
|------|-------------------|
| `package.json` | Node.js |
| `requirements.txt`, `pyproject.toml`, `setup.py` | Python |
| `go.mod` | Go |
| `pom.xml`, `build.gradle` | Java |
| `*.csproj`, `*.sln` | C# / .NET |
| `Cargo.toml` | Rust |
| `composer.json` | PHP |

### FRAMEWORK DETECTION

| Indicator | Framework |
|----------|-----------|
| `express` in package.json | Express.js |
| `fastify` in package.json | Fastify |
| `nestjs`, `@nestjs` | NestJS |
| `next` in package.json | Next.js |
| `django`, `drf` in requirements.txt | Django |
| `fastapi`, `uvicorn` in requirements.txt | FastAPI |
| `flask` in requirements.txt | Flask |
| `spring-boot` in pom.xml | Spring Boot |
| `rails` in Gemfile | Ruby on Rails |
| `laravel` in composer.json | Laravel |

### DATABASE DETECTION

| Indicator | Database |
|----------|----------|
| `pg`, `postgres` in config | PostgreSQL |
| `mysql` in config | MySQL |
| `mongodb` in config | MongoDB |
| `redis` in config | Redis |
| `sqlite` in config | SQLite |
| `dynamodb` in config | DynamoDB |

### FRONTEND DETECTION

| Indicator | Framework |
|----------|-----------|
| `react` in package.json | React |
| `vue` in package.json | Vue.js |
| `angular` in package.json | Angular |
| `svelte` in package.json | Svelte |
| `next` in package.json | Next.js |
| `nuxt` in package.json | Nuxt.js |

### DEVOPS DETECTION

| File | Tool |
|------|------|
| `Dockerfile` | Docker |
| `docker-compose.yml` | Docker Compose |
| `kubernetes/`, `k8s/` | Kubernetes |
| `.github/workflows/` | GitHub Actions |
| `.gitlab-ci.yml` | GitLab CI |
| `Jenkinsfile` | Jenkins |
| `terraform/` | Terraform |
| `ansible/` | Ansible |

### ML/AI DETECTION

| Indicator | Tool |
|----------|------|
| `tensorflow` in requirements.txt | TensorFlow |
| `pytorch` in requirements.txt | PyTorch |
| `scikit-learn` in requirements.txt | Scikit-learn |
| `mlflow` in requirements.txt | MLflow |
| `airflow` in requirements.txt | Airflow |
| `dbt` in requirements.txt | dbt |

---

## 📊 SKILL MAPPING BY DETECTION

### Detected: Node.js + Express
```
→ /api-design
→ /security
→ /deployment
→ /code-quality
```

### Detected: Node.js + NestJS
```
→ /api-design
→ /security
→ /deployment
→ /code-quality
→ /messaging (built-in)
```

### Detected: Python + FastAPI
```
→ /api-design
→ /security
→ /deployment
→ /code-quality
→ /data-engineering
```

### Detected: Python + Django
```
→ /api-design
→ /security
→ /deployment
→ /code-quality
→ /data-engineering
→ /compliance
```

### Detected: React + Next.js
```
→ /frontend
→ /api-design
→ /security
→ /deployment
→ /code-quality
→ /performance
```

### Detected: ML Stack (TensorFlow/PyTorch)
```
→ /ml-engineering
→ /data-engineering
→ /deployment
→ /code-quality
```

### Detected: Kubernetes
```
→ /kubernetes
→ /deployment
→ /scalability
→ /reliability
```

### Detected: PostgreSQL
```
→ /data-engineering
→ /scalability
→ /reliability
```

---

## 🔍 ANALYZER WORKFLOW

```
1️⃣ SCAN PROJECT FILES
   - package.json / requirements.txt
   - docker-compose.yml
   - Configuration files
   - Directory structure

2️⃣ EXTRACT DEPENDENCIES
   - Parse package.json
   - Parse requirements.txt
   - Extract service configs

3️⃣ MAP TO SKILLS
   - Match dependencies to skills
   - Consider scale
   - Consider compliance

4️⃣ GENERATE REPORT
   ┌─────────────────────────────────────────────────────┐
   │  📊 PROJECT ANALYSIS REPORT                         │
   │                                                     │
   │  Detected Tech Stack:                               │
   │  • Backend: NestJS (Node.js)                       │
   │  • Database: PostgreSQL                            │
   │  • Cache: Redis                                    │
   │  • Frontend: React                                 │
   │  • DevOps: Docker, GitHub Actions                  │
   │                                                     │
   │  Recommended Skills:                              │
   │  ✅ /security                                      │
   │  ✅ /api-design                                    │
   │  ✅ /deployment                                    │
   │  ✅ /code-quality                                  │
   │  ✅ /reliability                                   │
   │  ✅ /frontend                                      │
   │                                                     │
   │  Missing (consider adding):                      │
   │  ⚠️ /compliance (no compliance detected)           │
   │  ⚠️ /messaging (Redis available but not used)      │
   └─────────────────────────────────────────────────────┘

5️⃣ SUGGEST ACTIONS
   - Add missing skills
   - Apply relevant rules
   - Generate CLAUDE.md
```

---

## 📋 EXAMPLE ANALYSIS

### Input: package.json
```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "@prisma/client": "5.0.0",
    "express": "4.18.0"
  }
}
```

### Output: Detection
```
Backend: Express.js (Node.js)
Frontend: Next.js (React)
Database: PostgreSQL (via Prisma)
```

### Recommended Skills:
```
/frontend, /api-design, /security, /deployment, /code-quality
```

---

## 🎯 BEST PRACTICES

1. **Read multiple files** - Don't rely on single file
2. **Check versions** - Some features depend on version
3. **Look for patterns** - Directory structure can indicate architecture
4. **Consider scale** - Large projects may need more skills
5. **Document detection** - Show user what was detected

---

**Invok:** `/analyze-project` | **Priority:** HIGH | **Version:** 1.0
