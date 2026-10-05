# PROJECT DETECTOR ENGINE
# Analyzes project state and tech stack

## DETECTION PRIORITY

### Priority 1: Language/Framework
```
1. package.json → Node.js
2. requirements.txt / pyproject.toml → Python
3. go.mod → Go
4. Cargo.toml → Rust
5. *.csproj / *.sln → .NET
6. pom.xml / build.gradle → Java
7. composer.json → PHP
```

### Priority 2: Framework Specifics
```
Node.js:
  - fastify → Fastify
  - express → Express.js
  - nestjs → NestJS
  - next → Next.js
  - @adonisjs → AdonisJS

Python:
  - fastapi → FastAPI
  - django → Django
  - flask → Flask
  - sqlalchemy → SQLAlchemy ORM

Go:
  - gin-gonic/gin → Gin
  - fiber/fiber → Fiber
  - echo-framework → Echo
```

### Priority 3: Database
```
PostgreSQL:
  - pg, postgres in deps
  - postgresql:// URL
  - knexfile with pg
  - Prisma with postgres

MySQL:
  - mysql2 in deps
  - mysql:// URL
  - Prisma with mysql

MongoDB:
  - mongodb in deps
  - mongodb:// URL
  - mongoose in deps

Redis:
  - redis in deps
  - ioredis in deps
  - redis:// URL
```

### Priority 4: Architecture Pattern
```
DDD-Lite:
  - domain/ + application/ + infrastructure/

Clean Architecture:
  - entities/ + usecases/ + interfaces/

MVC:
  - models/ + views/ + controllers/

Feature-Based:
  - features/ or feature-name/ directories

Module-Based:
  - modules/ or apps/ directories
```

---

## DETECTION SCRIPT (Pseudocode)

```
function detectProject(cwd):
  files = listFiles(cwd)
  
  # State Detection
  state = detectState(files)
  
  # Tech Stack Detection
  stack = detectTechStack(files)
  
  # Architecture Detection
  arch = detectArchitecture(files)
  
  # Scale Assessment
  scale = assessScale(files)
  
  # Gap Analysis
  gaps = detectGaps(stack, arch)
  
  return {
    state,
    stack,
    arch,
    scale,
    gaps,
    recommendations
  }

function detectState(files):
  hasPackageJson = 'package.json' in files
  hasLockFile = hasPackageJson && ('package-lock.json' in files || 'yarn.lock' in files)
  hasGit = '.git' in files
  hasSource = 'src' in files || 'lib' in files || 'app' in files
  
  score = [hasPackageJson, hasLockFile, hasGit, hasSource].filter(Boolean).length
  
  if score == 0: return 'EMPTY'
  if score < 3: return 'PARTIAL'
  return 'EXISTING'
```

---

## CONFIDENCE SCORING

| Detection | High Confidence | Medium | Low |
|-----------|----------------|--------|-----|
| Language | Exact match | Related ecosystem | Ambiguous |
| Framework | Direct dependency | Meta-framework | Indirect |
| Database | Config file | URL pattern | Package dep |
| Architecture | Directory match | Naming pattern | File count |

---

## OUTPUT FORMAT

```json
{
  "state": "EXISTING",
  "techStack": {
    "language": "nodejs",
    "runtime": "node20",
    "frameworks": ["fastify", "knex"],
    "databases": ["postgresql"],
    "cache": ["redis"],
    "devops": ["docker", "github-actions"]
  },
  "architecture": {
    "pattern": "ddd-lite",
    "confidence": 0.85,
    "directories": ["src/domain", "src/application", "src/infrastructure"]
  },
  "scale": {
    "size": "medium",
    "depsCount": 45,
    "estLOC": 15000,
    "teamHint": "1-5"
  },
  "gaps": {
    "missing": ["monitoring", "rate-limiting"],
    "warnings": ["no health endpoints"]
  },
  "skills": {
    "required": ["fullstack-guardian", "api-designer"],
    "recommended": ["monitoring-expert"],
    "optional": ["architecture-designer"]
  }
}
```
