---
name: analyze-project
description: "Comprehensive project analysis with deep tech detection, dynamic skill discovery, phase-aware recommendations, and implementation suggestions"
version: "4.1"
category: [process]
priority: high
phase: any
tech_stack:
  languages: [all]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - command: "/analyze-project"
      reason: "Explicit invocation"
    - command: "/auto-route --analyze"
      reason: "Analysis mode"
    - command: "/auto-route"
      reason: "Auto-detect existing project"
  skill_tier: core
capabilities: [discovery, analysis]
quality:
  rules_count: 25
  examples_count: 15
  stability: stable
integrates_with: [auto-route, project-init, audit]
source:
  origin: local
author: Claude
---

# ANALYZE PROJECT SKILL v4.0
# Comprehensive Project Intelligence System

Kamu adalah **Project Intelligence Analyst** yang dapat:
1. Melakukan analisis mendalam terhadap project
2. Mendeteksi tech stack dan scale
3. Membaca CLAUDE.md untuk phase awareness
4. Menemukan skills secara dinamis
5. Memberikan rekomendasi implementasi yang actionable

---

## 🎯 TUJUAN UTAMA

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 ANALYZE PROJECT v4.0 - Comprehensive Project Intelligence  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. DETECT     → Tech stack, scale, project state              │
│  2. ANALYZE    → Read CLAUDE.md, dependencies, structure      │
│  3. DISCOVER   → Dynamic skill scanning from ~/.claude/skills/ │
│  4. SELECT     → Phase-aware skill selection algorithm         │
│  5. RECOMMEND  → Concrete next steps & implementation plan     │
│  6. TRACK      → Project state persistence                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 ANALYZER WORKFLOW

### PHASE 1: SMART DETECTION (5 seconds)

Scan files secara parallel untuk performa optimal:

```typescript
interface ProjectDetection {
  // Project State
  isNew: boolean;
  projectRoot: string;
  projectName: string;
  
  // Tech Stack
  language: string;           // Node.js, Python, Go, etc.
  frameworks: string[];       // Express, Fastify, Next.js, etc.
  databases: string[];         // PostgreSQL, MongoDB, Redis
  devops: string[];            // Docker, K8s, GitHub Actions
  
  // Project Info
  hasCLAUDEmd: boolean;
  hasREADME: boolean;
  scale: 'mvp' | 'small' | 'medium' | 'large' | 'enterprise';
  phase?: {
    current: number;
    name: string;
    status: 'done' | 'in-progress' | 'next' | 'todo';
  };
  
  // Quality Metrics
  hasTests: boolean;
  hasDocker: boolean;
  hasCI: boolean;
  hasTypeScript: boolean;
  testCoverage?: number;
}
```

**Detection Priority (parallel scan):**

```
Priority 1: Project Identity
├── .git/                      → Existing project
├── package.json               → Node.js/npm ecosystem
├── requirements.txt           → Python ecosystem  
├── go.mod                     → Go ecosystem
├── Cargo.toml                 → Rust ecosystem
├── pom.xml / build.gradle     → Java ecosystem
├── composer.json              → PHP ecosystem
└── *.csproj / *.sln          → C#/.NET ecosystem

Priority 2: Project Documentation
├── CLAUDE.md                  → Phase awareness, custom rules
├── README.md                  → Project description
├── docs/                      → Additional documentation
└── CHANGELOG.md               → Project history

Priority 3: Backend Framework
├── package.json deps          → Check: express, fastify, nest, next, etc.
├── requirements.txt           → Check: django, fastapi, flask, etc.
├── go.mod                     → Check: gin, echo, fiber, etc.
└── src/ structure             → Check: routes, controllers, etc.

Priority 4: Database & Cache
├── prisma/schema.prisma       → PostgreSQL via Prisma
├── knexfile.ts                → Knex.js (PostgreSQL/MySQL)
├── mongoose models/           → MongoDB
├── redis                      → Redis (ioredis, redis)
└── migrations/                → Database migrations

Priority 5: DevOps & Infra
├── Dockerfile                 → Docker
├── docker-compose.yml         → Docker Compose
├── kubernetes/               → Kubernetes
├── .github/workflows/         → GitHub Actions
├── .gitlab-ci.yml             → GitLab CI
├── terraform/                → Terraform IaC
└── .env.example               → Config patterns

Priority 6: Frontend
├── src/pages/                → Next.js
├── src/components/           → React/Vue
├── src/App.vue               → Vue.js
├── angular.json              → Angular
└── svelte.config.js          → Svelte

Priority 7: Testing & Quality
├── tests/                    → Test directory
├── coverage/                 → Coverage reports
├── vitest.config.ts          → Vitest
├── jest.config.js            → Jest
└── playwright.config.ts      → Playwright E2E
```

---

### PHASE 2: COMPREHENSIVE ANALYSIS

#### Step 2.1: Read CLAUDE.md (if exists)

```typescript
interface CLAUDEAnalysis {
  projectName: string;
  version: string;
  currentPhase: {
    number: number;
    name: string;
    status: string;
  };
  lastWork: string;
  customRules: string[];
  techStack: {
    backend: string;
    database: string;
    auth: string;
    etc: string;
  };
  completedPhases: number[];
  nextPhase: number;
  projectStructure: string;
  developmentRules: string[];
}
```

#### Step 2.2: Parse package.json (if Node.js)

```typescript
interface PackageAnalysis {
  name: string;
  version: string;
  type: 'commonjs' | 'module';
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  engines: { node?: string };
  
  // Detected Features
  hasTypeScript: boolean;
  hasESLint: boolean;
  hasPrettier: boolean;
  hasVitest: boolean;
  hasJest: boolean;
  hasDocker: boolean;
  hasPostgres: boolean;
  hasRedis: boolean;
  hasAuth: boolean;
}
```

#### Step 2.3: Analyze Folder Structure

```typescript
interface StructureAnalysis {
  patterns: string[];          // 'ddd', 'mvc', 'clean-architecture', etc.
  hasSrc: boolean;
  hasTests: boolean;
  hasScripts: boolean;
  hasDocs: boolean;
  directoryDepth: number;
  totalFiles: number;
  keyDirectories: string[];
}
```

---

### PHASE 3: DYNAMIC SKILL DISCOVERY

Scan all skills in `~/.claude/skills/` at runtime:

```typescript
interface SkillMetadata {
  name: string;                // 'api-design'
  displayName: string;         // 'API Design'
  description: string;
  version: string;
  priority: 'high' | 'medium' | 'low';
  
  // Match Criteria
  triggers: string[];          // Keywords that trigger this skill
  techStack: string[];        // Tech stack requirements
  phases: number[];           // Relevant phases (e.g., [1,2,3])
  scales: string[];           // 'mvp', 'small', etc.
  
  // Relationships
  dependencies: string[];      // Skills this depends on
  conflicts: string[];        // Skills that conflict with this
  
  // Quality
  rules: number;               // Number of rules in skill
  isCore: boolean;            // Is this a core skill?
  autoInvoke: boolean;         // Should auto-invoke?
}

interface SkillDiscoveryResult {
  allSkills: SkillMetadata[];
  coreSkills: SkillMetadata[];      // Always invoked
  contextSkills: SkillMetadata[];   // Based on detection
  optionalSkills: SkillMetadata[];   // User choice
  skippedSkills: SkillMetadata[];    // Not relevant
}
```

**Skill Scan Algorithm:**

```
1. List all directories in ~/.claude/skills/
2. For each directory, read SKILL.md (if exists)
3. Parse YAML frontmatter for metadata
4. Extract tech stack, phases, triggers
5. Calculate relevance score
6. Sort by score descending
7. Return categorized list
```

---

### PHASE 4: PHASE-AWARE SKILL SELECTION

Based on detected phase, select appropriate skills:

```typescript
interface PhaseConfig {
  number: number;
  name: string;
  coreSkills: string[];
  recommendedSkills: string[];
  optionalSkills: string[];
}

const PHASE_CONFIGS: Record<number, PhaseConfig> = {
  1: {
    name: 'Foundation',
    coreSkills: ['/git', '/config', '/logging'],
    recommendedSkills: ['/docker', '/security'],
    optionalSkills: ['/database', '/api-design']
  },
  2: {
    name: 'Core Features',
    coreSkills: ['/api-design', '/api-client'],
    recommendedSkills: ['/security', '/database'],
    optionalSkills: ['/messaging', '/performance']
  },
  3: {
    name: 'Advanced Features',
    coreSkills: ['/database', '/security'],
    recommendedSkills: ['/performance', '/scalability'],
    optionalSkills: ['/data-engineering', '/observability']
  },
  4: {
    name: 'Reporting/Analytics',
    coreSkills: ['/data-engineering', '/logging'],
    recommendedSkills: ['/observability', '/sre-operations'],
    optionalSkills: ['/database', '/search']
  },
  5: {
    name: 'Hardware/DevOps',
    coreSkills: ['/docker', '/ci-cd', '/deployment'],
    recommendedSkills: ['/kubernetes', '/reliability'],
    optionalSkills: ['/iot-edge', '/serverless']
  },
  6: {
    name: 'Launch/Polish',
    coreSkills: ['/security', '/reliability'],
    recommendedSkills: ['/audit', '/performance'],
    optionalSkills: ['/compliance', '/finops']
  }
};
```

**Skill Scoring Algorithm:**

```typescript
function calculateSkillScore(
  skill: SkillMetadata,
  detection: ProjectDetection,
  phase: number
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  
  // Core skill bonus: +10
  if (skill.isCore) {
    score += 10;
    reasons.push('Core skill (always recommended)');
  }
  
  // Tech stack match: +25
  const techMatches = skill.techStack.filter(t => 
    detection.frameworks.includes(t) ||
    detection.databases.includes(t) ||
    detection.devops.includes(t)
  );
  if (techMatches.length > 0) {
    score += 25;
    reasons.push(`Tech match: ${techMatches.join(', ')}`);
  }
  
  // Phase requirement: +30
  if (skill.phases.includes(phase)) {
    score += 30;
    reasons.push(`Required for Phase ${phase}`);
  }
  
  // Scale match: +15
  if (skill.scales.includes(detection.scale)) {
    score += 15;
    reasons.push(`Scales for ${detection.scale} projects`);
  }
  
  // Trigger keyword match: +20
  const triggerMatches = skill.triggers.filter(t =>
    detection.projectName.toLowerCase().includes(t) ||
    detection.frameworks.some(f => f.toLowerCase().includes(t))
  );
  if (triggerMatches.length > 0) {
    score += 20;
    reasons.push(`Keyword match: ${triggerMatches.join(', ')}`);
  }
  
  // Already implemented (skip): -100
  if (skillAlreadyImplemented(skill, detection)) {
    score = -100;
    reasons.push('Already implemented');
  }
  
  return { score, reasons };
}
```

---

### PHASE 5: IMPLEMENTATION SUGGESTIONS

After skill analysis, generate concrete next steps:

```typescript
interface ImplementationSuggestion {
  priority: number;
  title: string;
  description: string;
  estimatedEffort: 'low' | 'medium' | 'high';
  skills: string[];
  files: string[];
  action: string;
}

function generateSuggestions(
  detection: ProjectDetection,
  selectedSkills: SkillMetadata[]
): ImplementationSuggestion[] {
  const suggestions: ImplementationSuggestion[] = [];
  
  // 1. Critical fixes (if any)
  if (detection.hasTypeScript && !hasStrictConfig) {
    suggestions.push({
      priority: 1,
      title: 'Enable TypeScript strict mode',
      description: 'Project uses TypeScript but strict mode is not enabled',
      estimatedEffort: 'low',
      skills: ['/code-quality'],
      files: ['tsconfig.json'],
      action: 'Add "strict": true to compilerOptions'
    });
  }
  
  // 2. Security improvements
  if (!detection.hasAuth) {
    suggestions.push({
      priority: 2,
      title: 'Implement authentication',
      description: 'No auth detected - add JWT or session-based auth',
      estimatedEffort: 'high',
      skills: ['/security', '/identity'],
      files: ['src/infrastructure/auth/', 'src/api/middleware/auth.ts'],
      action: 'Add authentication middleware and user management'
    });
  }
  
  // 3. Testing coverage
  if (!detection.hasTests) {
    suggestions.push({
      priority: 3,
      title: 'Add test coverage',
      description: 'No tests detected - add unit and integration tests',
      estimatedEffort: 'medium',
      skills: ['/testing', '/tdd'],
      files: ['tests/', 'vitest.config.ts'],
      action: 'Set up Vitest with initial test suite'
    });
  }
  
  // 4. Docker optimization
  if (detection.hasDocker && !hasMultiStageBuild) {
    suggestions.push({
      priority: 4,
      title: 'Optimize Docker build',
      description: 'Dockerfile detected but not using multi-stage builds',
      estimatedEffort: 'medium',
      skills: ['/docker'],
      files: ['Dockerfile'],
      action: 'Implement multi-stage build for smaller image'
    });
  }
  
  // 5. Selected skill implementations
  for (const skill of selectedSkills) {
    const skillImplementation = getSkillImplementation(skill);
    if (skillImplementation) {
      suggestions.push({
        priority: 5,
        title: skill.displayName,
        description: skill.description,
        estimatedEffort: skillImplementation.effort,
        skills: [skill.name],
        files: skillImplementation.files,
        action: skillImplementation.action
      });
    }
  }
  
  return suggestions.sort((a, b) => a.priority - b.priority);
}
```

---

### PHASE 6: PROJECT STATE PERSISTENCE

Track project state for future sessions:

```typescript
interface ProjectState {
  path: string;
  lastAnalyzed: string;
  techStack: string[];
  scale: string;
  currentPhase: number;
  activeSkills: string[];
  suggestions: ImplementationSuggestion[];
  history: {
    date: string;
    action: string;
    skills: string[];
  }[];
}

// Store in: ~/.claude/state/projects.json
```

---

## 📊 OUTPUT TEMPLATES

### Detection Report

```
╔══════════════════════════════════════════════════════════════════╗
║  📊 PROJECT ANALYSIS REPORT v4.0                               ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  🏷️  PROJECT: [Project Name]                                   ║
║  📍  PATH: [Project Path]                                       ║
║  🏗️  SCALE: [Scale]                                             ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────  ║
║                                                                  ║
║  🛠️  TECH STACK DETECTED:                                       ║
║                                                                  ║
║  Backend:    [Framework] + [Language]                         ║
║  Database:    [Database]                                         ║
║  Cache:      [Redis/Memcached] (if detected)                  ║
║  Frontend:   [Framework] (if detected)                        ║
║  DevOps:     [Docker] [K8s] [CI/CD]                           ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────  ║
║                                                                  ║
║  📦 DEPENDENCIES:                                               ║
║  • [package-1]: [version]                                       ║
║  • [package-2]: [version]                                       ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────  ║
║                                                                  ║
║  🔧 QUALITY METRICS:                                            ║
║  ✅ TypeScript: [Yes/No]                                        ║
║  ✅ Tests: [Yes/No] (coverage: X%)                             ║
║  ✅ Docker: [Yes/No]                                           ║
║  ✅ CI/CD: [Yes/No]                                            ║
║  ✅ Auth: [Yes/No]                                              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Skill Selection UI

```
╔══════════════════════════════════════════════════════════════════╗
║  🚀 SKILL SELECTION - Based on Phase [N] ([Phase Name])        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  🔴 CORE SKILLS (Auto-Activated):                             ║
║  ─────────────────────────────────────────────────────────────  ║
║  ✅ /git                                                       ║
║  ✅ /docker                                                    ║
║  ✅ /ci-cd                                                     ║
║  ✅ /code-quality                                              ║
║  ✅ /deployment                                                ║
║  ✅ /logging                                                   ║
║  ✅ /config                                                    ║
║                                                                  ║
║  🟠 CONTEXT SKILLS (Auto-Detected):                            ║
║  ─────────────────────────────────────────────────────────────  ║
║  ✅ /[detected-skill-1]  → Reason: Tech match                ║
║  ✅ /[detected-skill-2]  → Reason: Phase requirement         ║
║                                                                  ║
║  🟡 OPTIONAL SKILLS (Select what you need):                   ║
║  ─────────────────────────────────────────────────────────────  ║
║  [1] /[skill-1]   (+25) → Reason: Security enhancement       ║
║  [2] /[skill-2]   (+20) → Reason: Performance optimization   ║
║  [3] /[skill-3]   (+15) → Reason: Observability             ║
║  [4] /[skill-4]   (+10) → Reason: API client patterns       ║
║  [5] /[skill-5]   (+5)  → Reason: Database optimization      ║
║                                                                  ║
║  🟢 SKIPPED (Already Implemented):                           ║
║  ─────────────────────────────────────────────────────────────  ║
║  ⏭️  /[existing-skill] → Already present in codebase        ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  SELECT: [1, 3] or "all" or "minimal" or "recommend"          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Implementation Plan

```
╔══════════════════════════════════════════════════════════════════╗
║  📋 IMPLEMENTATION PLAN                                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  🎯 PRIORITY 1: [Critical Fix]                                 ║
║  ─────────────────────────────────────────────────────────────  ║
║  [Description of what needs to be done]                       ║
║  Effort: [Low/Medium/High]                                     ║
║  Skills: /[skill-1], /[skill-2]                                ║
║  Files: [file-1], [file-2]                                    ║
║  Command: /implement [task-name]                              ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────  ║
║                                                                  ║
║  🎯 PRIORITY 2: [Feature Enhancement]                          ║
║  ─────────────────────────────────────────────────────────────  ║
║  [Description]                                                 ║
║  Effort: [Low/Medium/High]                                     ║
║  Skills: /[skill-3]                                           ║
║  Files: [file-3]                                               ║
║  Command: /implement [task-name]                              ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────  ║
║                                                                  ║
║  💡 QUICK ACTIONS:                                             ║
║  • Run audit: /audit                                           ║
║  • Run diagnostics: /diagnosing-bugs                           ║
║  • Create issue: /new-issue                                    ║
║  • Continue phase: /auto-route --phase [N]                     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🔧 INTEGRATION WITH AUTO-ROUTE

This skill is designed to work seamlessly with `/auto-route`:

```
┌─────────────────────────────────────────────────────────────────┐
│  AUTO-ROUTE INTEGRATION                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  When /auto-route detects EXISTING project:                     │
│                                                                 │
│  1. → Invoke /analyze-project                                   │
│  2. → Get detection result                                      │
│  3. → Auto-invoke core skills                                  │
│  4. → Show skill selection UI                                  │
│  5. → Generate implementation plan                            │
│  6. → Track project state                                      │
│                                                                 │
│  When /auto-route --phase [N]:                                 │
│                                                                 │
│  1. → Read CLAUDE.md for phase context                        │
│  2. → Skip redundant skills                                    │
│  3. → Focus on phase-specific recommendations                  │
│  4. → Show "Continue Phase N" options                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 FILE DETECTION REFERENCE

### Language Detection

| File | Language | Detection |
|------|----------|-----------|
| `package.json` | Node.js | Check `engines.node` |
| `requirements.txt` | Python | Check version specifiers |
| `go.mod` | Go | Check `go` version |
| `Cargo.toml` | Rust | Check `package.edition` |
| `pom.xml` | Java | Check `<java.version>` |
| `composer.json` | PHP | Check `require.php` |

### Framework Detection

| Dependency | Framework | Indicators |
|------------|-----------|------------|
| `express` | Express.js | `app.use`, `router` |
| `fastify` | Fastify | `fastify.listen`, `@fastify/*` |
| `@nestjs/core` | NestJS | `@Module`, `@Injectable` |
| `next` | Next.js | `pages/`, `app/` directories |
| `react` | React | `<Component>`, `useState` |
| `vue` | Vue.js | `createApp`, `<script setup>` |
| `django` | Django | `settings.py`, `urls.py` |
| `fastapi` | FastAPI | `@app.get`, `FastAPI()` |
| `gin-gonic/gin` | Gin | `gin.Default()`, `router.Group` |

### Database Detection

| Dependency | Database | Config |
|------------|----------|--------|
| `pg`, `postgres` | PostgreSQL | `DATABASE_URL` |
| `mysql` | MySQL | `DATABASE_URL` |
| `mongodb` | MongoDB | `MONGO_URL` |
| `mongoose` | MongoDB (Mongoose) | `mongoose.connect` |
| `redis`, `ioredis` | Redis | `REDIS_URL` |
| `sqlite3` | SQLite | `.db`, `.sqlite` |

### DevOps Detection

| File/Directory | Tool | Detection |
|----------------|------|-----------|
| `Dockerfile` | Docker | Multi-stage, alpine, node version |
| `docker-compose.yml` | Docker Compose | Services, ports, volumes |
| `.github/workflows/` | GitHub Actions | `.yml` workflow files |
| `.gitlab-ci.yml` | GitLab CI | stages, jobs |
| `kubernetes/` | Kubernetes | Deployments, Services |
| `terraform/` | Terraform | `.tf` files |

---

## 🎯 BEST PRACTICES

1. **Parallel Scanning**: Scan files in parallel for speed
2. **Cache Results**: Store detection results for future sessions
3. **Respect CLAUDE.md**: Always read project-specific rules first
4. **Skip Already Implemented**: Don't recommend skills that are already in use
5. **Show Reasoning**: Always explain WHY a skill is recommended
6. **Actionable Output**: Provide concrete next steps, not just recommendations
7. **Phase Awareness**: Different phases need different skills
8. **Scale Awareness**: Enterprise projects need different approach than MVP

---

## 📊 COMPLETE EXAMPLE FLOW

```
User: /analyze-project

System: "🔍 Scanning project files..."
  ✓ Found: package.json (Node.js + Fastify)
  ✓ Found: CLAUDE.md (Phase 5, Hardware)
  ✓ Found: docker-compose.yml (PostgreSQL + Redis)
  ✓ Found: .github/workflows/ (CI/CD)

System: "📊 DETECTION RESULT"
  Project: VentroPos
  Scale: Small-Medium
  Phase: Phase 5 (Hardware Integration)
  Tech Stack:
    • Backend: Fastify + TypeScript
    • Database: PostgreSQL
    • Cache: Redis
    • DevOps: Docker, GitHub Actions

System: "🚀 AUTO-INVOKING CORE SKILLS"
  ✅ /git
  ✅ /docker
  ✅ /ci-cd
  ✅ /code-quality
  ✅ /deployment
  ✅ /logging
  ✅ /config

System: "🎯 CONTEXT SKILLS (Phase 5: Hardware)"
  ✅ /iot-edge (Phase 5 match)
  ✅ /security (hardware security)
  ✅ /database (PostgreSQL)

System: "🟡 SELECT OPTIONAL SKILLS"
  [1] /performance (+15) → Speed optimization
  [2] /reliability (+12) → SLO/SLA setup
  [3] /scalability (+10) → Growth preparation
  [4] /observability (+8) → Monitoring setup
  [5] /compliance (+5) → POS compliance

  SELECT: [1, 2] or "recommend"

User: recommend

System: "✅ INVOKING RECOMMENDED SKILLS"
  Invoke: /performance
  Invoke: /reliability

System: "📋 IMPLEMENTATION PLAN"
  
  PRIORITY 1: Hardware Integration Completion
    → Continue Phase 5 hardware work
    → Skills: /iot-edge
    → Use /auto-route --phase 5

  PRIORITY 2: Performance Optimization
    → Add response caching
    → Skills: /performance
    → Files: src/shared/cache/

  PRIORITY 3: Reliability Setup
    → Add health checks
    → Skills: /reliability
    → Files: src/api/routes/health.ts

System: "💡 QUICK ACTIONS"
  • Continue Phase 5: /auto-route --phase 5
  • Full audit: /audit
  • Run diagnostics: /diagnosing-bugs
```

---

## 🔄 VERSION HISTORY

| Version | Changes |
|---------|---------|
| 4.0 | Complete rewrite with dynamic skill discovery, phase awareness, implementation suggestions |
| 3.0 | Added tech stack detection, skill auto-invocation |
| 2.0 | Added CLI output formatting |
| 1.0 | Initial version |

---

**Invoke:** `/analyze-project` | **Priority:** HIGH | **Version:** 4.0 | **Replaces:** `/project-init` (for existing projects), `/analyze-project` (v1-v3)

**Related Skills:**
- `/auto-route` - Unified entry point
- `/project-init` - New project setup
- `/audit` - Full codebase audit
- `/diagnosing-bugs` - Systematic debugging
