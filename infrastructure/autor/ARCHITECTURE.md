# AUTO-ROUTE v4.0 - Intelligent Project Router

> **Version:** 4.0 | **Author:** thevoidsyntax | **Date:** 2026-01-18

---

## Executive Summary

Auto-Route v4.0 is a unified, intelligent command that automatically detects project state, selects appropriate skills, and provides power features for seamless project onboarding and development. Unlike the fragmented v2/v3 approach with separate `/project-init` and `/analyze-project` commands, Auto-Route v4.0 provides a **single entry point** that intelligently routes to the right workflow.

### Key Improvements Over Previous Versions

| Aspect | v2/v3 | v4.0 |
|--------|-------|------|
| Entry Point | Multiple commands | Single `/auto-route` |
| Project Detection | Manual | Automatic on first run |
| Skill Discovery | Static list | Dynamic runtime scan |
| Phase Awareness | None | CLAUDE.md integration |
| Dependencies | Manual | Auto-resolved |
| Power Features | Basic | Auto-fix, tracking, context |

---

## 1. Architecture Overview

### 1.1 Command Flow Diagram

```
                        /auto-route [OPTIONS]
                               │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
    ┌───────────────┐               ┌───────────────┐
    │  NEW PROJECT  │               │EXISTING PROJECT│
    │   (no git)    │               │  (has git)     │
    └───────┬───────┘               └───────┬───────┘
            │                               │
    ┌───────┴───────┐               ┌───────┴───────┐
    ▼               ▼               ▼               ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ INTERACT- │  │  QUICK   │  │ FULL     │  │ PHASE    │
│ IVE SETUP │  │ START    │  │ ANALYZE  │  │ CONTINUE │
│ (wizard)  │  │ (minimal)│  │          │  │          │
└─────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
      │              │              │              │
      └──────────────┴──────────────┴──────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
           ┌──────────────┐ ┌──────────────┐
           │ SKILL SELECTOR│ │CONTEXT BUILDER│
           │  (Dynamic)    │ │(CLAUDE.md)    │
           └───────┬───────┘ └───────┬───────┘
                   └─────────┬───────┘
                             ▼
                   ┌──────────────┐
                   │ POWER FEATURES│
                   │  ACTIVATION   │
                   └──────────────┘
```

### 1.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTO-ROUTE CORE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   DETECTOR  │  │   ROUTER    │  │   SKILL DISCOVERER  │  │
│  │             │  │             │  │                     │  │
│  │ • Git check │  │ • New → Init│  │ • ~/.claude/skills/ │  │
│  │ • package.* │  │ • Exist →   │  │ • Dynamic scan      │  │
│  │ • CLAUDE.md │  │   Analyze   │  │ • Metadata extract   │  │
│  │ • Config    │  │ • Phase →   │  │ • Dependency graph  │  │
│  │             │  │   Continue   │  │ • Category mapping   │  │
│  └─────────────┘  └──────┬──────┘  └─────────────────────┘  │
│                          │                                     │
│                    ┌─────┴─────┐                               │
│                    │  SELECTOR │                               │
│                    │           │                               │
│                    │ • Context │                               │
│                    │ • Phase   │                               │
│                    │ • Scale   │                               │
│                    │ • Profile │                               │
│                    └─────┬─────┘                               │
│                          │                                     │
└──────────────────────────┼─────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  CORE    │    │ CONTEXT  │    │ OPTIONAL │
    │  SKILLS  │    │  SKILLS  │    │  SKILLS  │
    │          │    │          │    │          │
    │ /git     │    │ /api-design│   │ /mobile  │
    │ /docker  │    │ /database │    │ /graphql │
    │ /ci-cd   │    │ /frontend │    │ /ml-*    │
    │ /config  │    │ /security │    │ ...      │
    │ /logging │    │ /scalability│  │          │
    │ /code-*  │    │ /observ-* │    │          │
    │ /deploy  │    │ ...       │    │          │
    └──────────┘    └──────────┘    └──────────┘
```

---

## 2. Smart Detection Logic

### 2.1 Detection Algorithm

```typescript
interface DetectionResult {
  projectState: 'new' | 'existing' | 'hybrid';
  techStack: TechStack;
  scale: 'mvp' | 'small' | 'medium' | 'large' | 'enterprise';
  phase?: PhaseInfo;
  missingFiles: string[];
  recommendations: string[];
}

async function detectProject(cwd: string): Promise<DetectionResult> {
  const checks = await Promise.all([
    // Priority 1: Git & Repository
    checkGitRepo(cwd),
    
    // Priority 2: Package Manager & Language
    detectPackageManager(cwd),
    
    // Priority 3: Project Configuration
    detectConfigFiles(cwd),
    
    // Priority 4: CLAUDE.md for phase awareness
    readClaudeMd(cwd),
    
    // Priority 5: Documentation
    detectDocs(cwd),
  ]);

  return analyzeDetectionResults(checks);
}
```

### 2.2 Detection Priority Matrix

| Priority | Files | Detection |
|----------|-------|----------|
| 1 | `.git/` | Existing project |
| 1 | `package.json`, `go.mod`, `Cargo.toml`, `pom.xml`, `*.csproj` | Language/Framework |
| 2 | `CLAUDE.md` | Phase awareness, custom rules |
| 2 | `README.md` | Project documentation |
| 3 | `docker-compose.yml`, `Dockerfile` | DevOps |
| 3 | `.github/workflows/` | CI/CD |
| 3 | `prisma/schema.prisma`, `knexfile.ts`, `migrations/` | Database |
| 4 | `tsconfig.json`, `vite.config.ts`, `webpack.config.js` | Frontend |
| 5 | `kubernetes/`, `k8s/`, `terraform/` | Infrastructure |

### 2.3 State Machine

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌───────────┐ ┌──────────┐ ┌──────────┐
       │   NEW     │ │ EXISTING │ │  HYBRID  │
       │  (no git) │ │ (has git)│ │ (partial)│
       └─────┬─────┘ └────┬─────┘ └────┬─────┘
             │             │            │
             ▼             │            ▼
    ┌────────────────┐     │    ┌──────────────┐
    │ Has CLAUDE.md? │     │    │ REANALYZE    │
    └───────┬────────┘     │    │ MISSING PARTS│
            │              │    └──────┬───────┘
      ┌─────┴─────┐        │           │
      ▼           ▼        ▼           ▼
   ┌──────┐  ┌────────┐ ┌─────────┐ ┌─────────┐
   │PHASE │  │  INIT  │ │ ANALYZE │ │ CONTINUE │
   │CONT. │  │  WIZARD│ │         │ │          │
   └──────┘  └────────┘ └─────────┘ └─────────┘
```

---

## 3. Skill Selection Algorithm

### 3.1 Scoring System

Each skill has a relevance score based on:

```typescript
interface SkillRelevance {
  skill: string;
  score: number;
  reasons: string[];
  dependencies: string[];
  category: SkillCategory;
}

function calculateRelevance(
  detection: DetectionResult,
  skill: Skill
): SkillRelevance {
  let score = 0;
  const reasons: string[] = [];
  const dependencies: string[] = [];

  // Core score (always +10)
  if (skill.isCore) {
    score += 10;
    reasons.push('Core skill');
  }

  // Tech stack match
  for (const [tech, relatedSkills] of TECH_STACK_SKILLS) {
    if (detection.techStack.includes(tech)) {
      if (relatedSkills.includes(skill.name)) {
        score += 25;
        reasons.push(`Tech stack: ${tech}`);
      }
    }
  }

  // Phase match
  if (detection.phase?.requiredSkills?.includes(skill.name)) {
    score += 30;
    reasons.push(`Required by phase: ${detection.phase.current}`);
  }

  // Scale match
  if (skill.scaleMatch?.includes(detection.scale)) {
    score += 15;
    reasons.push(`Scale: ${detection.scale}`);
  }

  // Dependencies resolved
  for (const dep of skill.dependencies || []) {
    if (isSkillActive(dep)) {
      score += 5;
    } else {
      dependencies.push(dep);
    }
  }

  return { skill: skill.name, score, reasons, dependencies, category: skill.category };
}
```

### 3.2 Dynamic Skill Discovery

```typescript
async function discoverSkills(skillsDir: string): Promise<Skill[]> {
  const skills: Skill[] = [];
  
  // Scan ~/.claude/skills/ directory
  const skillDirs = await fs.readdir(skillsDir, { withFileTypes: true });
  
  for (const dir of skillDirs) {
    if (!dir.isDirectory()) continue;
    
    const skillPath = path.join(skillsDir, dir.name);
    const skillFile = path.join(skillPath, 'SKILL.md');
    
    if (await fs.pathExists(skillFile)) {
      const metadata = parseSkillMetadata(await fs.readFile(skillFile, 'utf-8'));
      skills.push({
        name: dir.name,
        path: skillPath,
        metadata,
        // Dynamic category detection
        category: detectCategory(metadata),
        // Load dependencies from metadata
        dependencies: metadata.dependencies || [],
        isCore: metadata.core || false,
      });
    }
  }

  return skills;
}

function parseSkillMetadata(content: string): SkillMetadata {
  // Parse YAML frontmatter or structured comments
  const frontmatter = content.match(/^---\\n([\\s\\S]*?)\\n---/);
  if (frontmatter) {
    return yaml.parse(frontmatter[1]);
  }
  
  // Fallback: parse @tags in content
  return {
    category: extractTag(content, '@category'),
    dependencies: extractTags(content, '@requires'),
    core: hasTag(content, '@core'),
  };
}
```

### 3.3 Skill Categories & Mappings

#### Core Skills (Always Auto-Invoke)

| Skill | Trigger | Reason |
|-------|---------|--------|
| `/git` | Always | Version control is fundamental |
| `/docker` | Dockerfile/docker-compose detected | Containerization detected |
| `/ci-cd` | .github/workflows detected | CI/CD detected |
| `/code-quality` | Always | Code standards essential |
| `/deployment` | Always | Deployment strategy needed |
| `/logging` | Always | Structured logging best practice |
| `/config` | Always | Configuration management |

#### Context Skills (Auto-invoke based on detection)

**Backend Frameworks**

| Detected | Auto-Invoke | Score |
|----------|-------------|-------|
| Express.js | `/api-design`, `/security` | 25 |
| NestJS | `/api-design`, `/security`, `/messaging` | 30 |
| Fastify | `/api-design`, `/security` | 25 |
| Django | `/api-design`, `/security` | 25 |
| FastAPI | `/api-design`, `/security` | 25 |
| Spring Boot | `/api-design`, `/security` | 25 |
| Rails | `/api-design`, `/security` | 25 |
| Go | `/api-design`, `/performance` | 25 |

**Databases**

| Detected | Auto-Invoke | Score |
|----------|-------------|-------|
| PostgreSQL | `/database`, `/data-engineering` | 20 |
| MySQL | `/database` | 20 |
| MongoDB | `/data-engineering` | 20 |
| Redis | `/scalability` | 15 |
| Elasticsearch | `/search`, `/data-engineering` | 25 |

**Frontend**

| Detected | Auto-Invoke | Score |
|----------|-------------|-------|
| React | `/frontend`, `/performance` | 25 |
| Vue.js | `/frontend` | 20 |
| Next.js | `/frontend`, `/performance`, `/api-design` | 30 |
| Angular | `/frontend` | 20 |
| Svelte | `/frontend` | 20 |

**Infrastructure**

| Detected | Auto-Invoke | Score |
|----------|-------------|-------|
| Docker | `/docker` (already core) | +5 |
| Kubernetes | `/kubernetes`, `/reliability` | 30 |
| Terraform | `/terraform` | 20 |
| Serverless | `/serverless`, `/scalability` | 25 |

---

## 4. Phase-Aware Skill Selection

### 4.1 Phase Detection from CLAUDE.md

```typescript
interface PhaseInfo {
  current: string;
  total: number;
  status: 'done' | 'in-progress' | 'next' | 'todo';
  requiredSkills: string[];
  completedSkills: string[];
}

function detectPhase(claudeMd: string): PhaseInfo | null {
  // Parse phase markers from CLAUDE.md
  const phaseMatch = claudeMd.match(/Phase \\d+: (.+?) \\((.+?)\\)/);
  
  if (!phaseMatch) return null;

  const [, name, status] = phaseMatch;
  
  // Extract skills mentioned in phase requirements
  const skills = extractSkillsFromPhase(name, claudeMd);
  
  return {
    current: name,
    total: countPhases(claudeMd),
    status: parseStatus(status),
    requiredSkills: skills.required,
    completedSkills: skills.completed,
  };
}
```

### 4.2 Phase → Skills Mapping

```typescript
const PHASE_SKILLS: Record<string, string[]> = {
  'foundation': ['/git', '/config', '/logging', '/security', '/database'],
  'core': ['/api-design', '/code-quality', '/testing', '/deployment'],
  'features': ['/frontend', '/performance', '/observability'],
  'infrastructure': ['/docker', '/ci-cd', '/kubernetes', '/terraform'],
  'security': ['/security', '/compliance', '/identity'],
  'optimization': ['/performance', '/scalability', '/sre-operations'],
  'launch': ['/deployment', '/monitoring', '/documentation'],
};
```

---

## 5. Dependency Resolution

### 5.1 Dependency Graph

```typescript
interface DependencyNode {
  skill: string;
  dependencies: string[];
  dependents: string[];
  loadOrder: number;
}

function resolveDependencies(skills: string[]): DependencyNode[] {
  const graph = buildGraph(skills);
  const resolved: DependencyNode[] = [];
  const visiting = new Set<string>();

  function visit(skill: string) {
    if (resolved.find(n => n.skill === skill)) return;
    if (visiting.has(skill)) {
      throw new CyclicDependencyError(skill);
    }

    visiting.add(skill);
    
    const deps = getDependencies(skill);
    for (const dep of deps) {
      visit(dep);
    }

    visiting.delete(skill);
    resolved.push({
      skill,
      dependencies: deps,
      dependents: getDependents(skill),
      loadOrder: resolved.length,
    });
  }

  for (const skill of skills) {
    visit(skill);
  }

  return resolved;
}
```

### 5.2 Sample Dependency Tree

```
/api-design
├── /security (optional but recommended)
├── /api-client (optional)
└── /messaging (if async patterns)

/database
├── /data-engineering (if ETL needed)
├── /scalability (if caching needed)
└── /migration (internal)

/kubernetes
├── /docker (prerequisite)
├── /deployment (related)
└── /reliability (recommended)
```

---

## 6. Power Features

### 6.1 Auto-Fix Integration

```typescript
interface AutoFixConfig {
  enabled: boolean;
  autoFix: boolean;
  autoAudit: boolean;
  autoTest: boolean;
}

async function runAutoFix(
  config: AutoFixConfig,
  detection: DetectionResult
): Promise<FixReport> {
  const fixes: Fix[] = [];

  if (config.autoAudit && detection.projectState === 'existing') {
    // Run npm audit / security scans
    const auditResult = await runAudit();
    if (auditResult.vulnerabilities.length > 0) {
      if (config.autoFix) {
        fixes.push(...await autoFixVulnerabilities(auditResult));
      } else {
        fixes.push(...auditResult.vulnerabilities);
      }
    }
  }

  if (config.autoTest) {
    // Run test suite
    const testResult = await runTests();
    if (!testResult.passed) {
      if (config.autoFix) {
        fixes.push(...await diagnoseTestFailures(testResult));
      }
    }
  }

  return { fixes, summary: summarizeFixes(fixes) };
}
```

### 6.2 Project Tracking

```typescript
interface ProjectState {
  lastAnalyzed: Date;
  currentPhase: string;
  activeSkills: string[];
  issues: Issue[];
  recommendations: Recommendation[];
  history: StateChange[];
}

function updateProjectState(
  current: ProjectState,
  change: Partial<ProjectState>
): ProjectState {
  return {
    ...current,
    ...change,
    history: [
      ...current.history,
      {
        timestamp: new Date(),
        change,
        trigger: 'auto-route',
      },
    ],
  };
}
```

### 6.3 Context Builder

```typescript
interface SessionContext {
  projectPath: string;
  projectState: ProjectState;
  activeSkills: Skill[];
  recentChanges: FileChange[];
  recommendations: Recommendation[];
}

function buildContext(detection: DetectionResult): SessionContext {
  return {
    projectPath: detection.cwd,
    projectState: loadProjectState(detection.cwd),
    activeSkills: loadActiveSkills(detection),
    recentChanges: getRecentChanges(detection.cwd),
    recommendations: generateRecommendations(detection),
  };
}
```

---

## 7. Command Interface

### 7.1 Command Syntax

```
/auto-route [OPTIONS]

OPTIONS:
  --new              Force new project mode
  --analyze          Force analyze existing project
  --phase            Continue from current phase
  --skills=LIST      Comma-separated skill names to activate
  --skip-core        Skip core skills
  --no-interactive   Non-interactive mode
  --verbose          Detailed output
  --help             Show help
```

### 7.2 Interactive Menu

```
╔════════════════════════════════════════════════════════════════════╗
║                     🚀 AUTO-ROUTE v4.0                          ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Project Detected: VentroPOS                                     ║
║  Tech Stack: Node.js + Fastify + PostgreSQL                      ║
║  Phase: Phase 5 - Hardware Integration [IN PROGRESS]            ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  What would you like to do?                                       ║
║                                                                    ║
║  [1] 📊 Full Project Analysis                                     ║
║      Deep analysis with all detected skills                      ║
║                                                                    ║
║  [2] ▶️ Continue Phase 5                                          ║
║      Resume hardware integration work                             ║
║                                                                    ║
║  [3] 🎯 Quick Skill Activation                                   ║
║      Select specific skills to activate                          ║
║                                                                    ║
║  [4] 🔍 Run Diagnostics                                          ║
║      Check project health and issues                              ║
║                                                                    ║
║  [5] ⚡ Auto-Fix                                                 ║
║      Run automated fixes and improvements                          ║
║                                                                    ║
║  [Q] Quit                                                        ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝

Select option:
```

---

## 8. Technical Implementation

### 8.1 File Structure

```
~/.claude/
├── skills/
│   ├── auto-route/
│   │   ├── SKILL.md              # Main skill definition
│   │   ├── detector.ts           # Project detection logic
│   │   ├── router.ts             # Routing logic
│   │   ├── discoverer.ts         # Dynamic skill discovery
│   │   ├── selector.ts           # Skill selection algorithm
│   │   ├── dependencies.ts       # Dependency resolution
│   │   ├── phase-detector.ts     # Phase awareness
│   │   ├── auto-fix.ts           # Auto-fix integration
│   │   └── templates/
│   │       ├── new-project.md
│   │       ├── existing-project.md
│   │       └── phase-continue.md
│   └── [other skills]/
└── state/
    └── projects.json             # Project state tracking
```

### 8.2 Core Module: detector.ts

```typescript
import { glob } from 'glob';
import { readFile } from 'fs/promises';
import { parse as parseYaml } from 'yaml';

export interface DetectionResult {
  isNew: boolean;
  techStack: TechStack;
  scale: Scale;
  phase?: PhaseInfo;
  missingFiles: string[];
  hasGit: boolean;
  packageManager?: PackageManager;
  frameworks: string[];
  databases: string[];
  devops: DevOpsTool[];
  hasCLAUDEMd: boolean;
}

export async function detectProject(cwd: string): Promise<DetectionResult> {
  const [
    hasGit,
    packageFiles,
    claudeMd,
    dockerFiles,
    ciFiles,
    configFiles,
  ] = await Promise.all([
    checkGit(cwd),
    glob('**/package.json', { cwd, ignore: '**/node_modules/**' }),
    readFileSafe(path.join(cwd, 'CLAUDE.md')),
    glob('**/{Dockerfile,docker-compose.yml}', { cwd }),
    glob('**/.github/workflows/*.yml', { cwd }),
    detectConfigFiles(cwd),
  ]);

  const isNew = !hasGit && packageFiles.length === 0;
  const packageData = packageFiles[0] 
    ? JSON.parse(await readFile(packageFiles[0], 'utf-8'))
    : null;

  return {
    isNew,
    techStack: detectTechStack(packageData, configFiles),
    scale: estimateScale(packageData, configFiles),
    phase: claudeMd ? parsePhase(claudeMd) : undefined,
    missingFiles: detectMissingFiles(cwd, isNew),
    hasGit,
    packageManager: detectPackageManager(packageFiles),
    frameworks: extractFrameworks(packageData),
    databases: extractDatabases(packageData),
    devops: detectDevOps(dockerFiles, ciFiles),
    hasCLAUDEMd: !!claudeMd,
  };
}
```

### 8.3 Core Module: selector.ts

```typescript
import { discoverSkills } from './discoverer';
import { resolveDependencies } from './dependencies';

export interface SelectionResult {
  core: Skill[];
  context: Skill[];
  optional: Skill[];
  skipped: Skill[];
  dependencies: Map<string, string[]>;
}

export async function selectSkills(
  detection: DetectionResult,
  options: SelectionOptions
): Promise<SelectionResult> {
  // Load all available skills
  const allSkills = await discoverSkills(getSkillsDir());
  
  // Calculate relevance scores
  const scored = allSkills.map(skill => ({
    skill,
    score: calculateScore(skill, detection),
    reasons: getReasons(skill, detection),
  }));

  // Sort by score
  scored.sort((a, b) => b.score - a.score);

  // Separate by category
  const core = scored.filter(s => s.skill.core).map(s => s.skill);
  const context = scored
    .filter(s => !s.skill.core && s.score >= 20)
    .map(s => s.skill);
  const optional = scored
    .filter(s => !s.skill.core && s.score < 20)
    .map(s => s.skill);

  // Resolve dependencies
  const allSelected = [...core, ...context, ...optional];
  const dependencyMap = resolveDependencies(allSelected.map(s => s.name));

  return {
    core,
    context,
    optional,
    skipped: allSkills.filter(s => !allSelected.includes(s)),
    dependencies: dependencyMap,
  };
}
```

---

## 9. Advanced Features

### 9.1 Learning & Adaptation

```typescript
interface UsagePattern {
  userId: string;
  projectType: string;
  selectedSkills: string[];
  skippedSkills: string[];
  effectiveness: number; // User feedback
}

function updatePatterns(usage: UsagePattern): void {
  // Update ~/.claude/skills/auto-route/patterns.json
  const patterns = loadPatterns();
  
  const existing = patterns.find(
    p => p.projectType === usage.projectType
  );
  
  if (existing) {
    // Merge patterns
    existing.selectedSkills = mergeSkillLists(
      existing.selectedSkills,
      usage.selectedSkills
    );
    existing.effectiveness = calculateMovingAverage(
      existing.effectiveness,
      usage.effectiveness
    );
  } else {
    patterns.push(usage);
  }
  
  savePatterns(patterns);
}
```

### 9.2 Multi-Project Support

```typescript
interface ProjectRegistry {
  [projectPath: string]: {
    lastAccessed: Date;
    state: ProjectState;
    currentPhase?: string;
    defaultSkills?: string[];
  };
}

function registerProject(path: string, state: ProjectState): void {
  const registry = loadRegistry();
  registry[path] = {
    lastAccessed: new Date(),
    state,
  };
  saveRegistry(registry);
}

async function switchProject(targetPath: string): Promise<void> {
  const registry = loadRegistry();
  const project = registry[targetPath];
  
  if (!project) {
    // Detect and register new project
    const detection = await detectProject(targetPath);
    const state = createInitialState(detection);
    registerProject(targetPath, state);
    return switchProject(targetPath); // Retry
  }
  
  // Update last accessed
  project.lastAccessed = new Date();
  saveRegistry(registry);
  
  // Load project context
  loadProjectContext(project);
}
```

---

## 10. Migration Guide (v2/v3 → v4)

### 10.1 Command Changes

| Old Command | New Command | Notes |
|-------------|-------------|-------|
| `/project-init` | `/auto-route --new` | Unified entry |
| `/analyze-project` | `/auto-route --analyze` | Unified entry |
| `/auto-route` | (same) | Enhanced features |

### 10.2 New Options

```bash
# New project with wizard
/auto-route --new

# Quick start (minimal)
/auto-route --new --quick

# Analyze existing project
/auto-route --analyze

# Continue from phase
/auto-route --phase 5

# Select specific skills
/auto-route --skills=api-design,database,security

# Non-interactive mode
/auto-route --no-interactive --skills=all
```

---

## 11. Testing Strategy

### 11.1 Test Scenarios

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| New project | Empty directory | New project wizard |
| Existing Node.js | package.json exists | Full analysis |
| Existing Python | requirements.txt exists | Python stack detection |
| With CLAUDE.md | Phase info present | Phase continuation option |
| Hybrid project | Partial files | Reanalysis prompt |
| Docker project | Dockerfile exists | Docker skills auto-selected |
| Kubernetes project | k8s/ directory | K8s skills auto-selected |

### 11.2 Test Cases

```typescript
describe('Auto-Route v4.0', () => {
  describe('Detection', () => {
    it('detects new project (no git)', async () => {
      const result = await detectProject('/tmp/empty-dir');
      expect(result.isNew).toBe(true);
    });

    it('detects existing Node.js project', async () => {
      const result = await detectProject('./test-fixtures/node-express');
      expect(result.isNew).toBe(false);
      expect(result.frameworks).toContain('express');
    });

    it('extracts phase from CLAUDE.md', async () => {
      const result = await detectProject('./test-fixtures/ventropos');
      expect(result.phase?.current).toBe('Phase 5');
      expect(result.phase?.status).toBe('in-progress');
    });
  });

  describe('Skill Selection', () => {
    it('selects core skills for all projects', async () => {
      const selection = await selectSkills(detection, {});
      expect(selection.core).toContainEqual(
        expect.objectContaining({ name: 'git' })
      );
    });

    it('selects context skills based on tech stack', async () => {
      const detection = createDetection({ frameworks: ['express'] });
      const selection = await selectSkills(detection, {});
      expect(selection.context).toContainEqual(
        expect.objectContaining({ name: 'api-design' })
      );
    });
  });
});
```

---

## 12. Future Enhancements

### 12.1 Planned Features

| Feature | Priority | Status |
|---------|----------|--------|
| Learning patterns | High | Planned |
| Multi-project workspace | High | Planned |
| Custom skill loading | Medium | Planned |
| IDE integration | Medium | Planned |
| Team profiles | Low | Backlog |

### 12.2 Integration Points

- **VS Code Extension**: Quick access from IDE
- **CLI Wrapper**: Standalone binary
- **GitHub App**: Auto-comment on PRs
- **Slack Bot**: Team-wide routing

---

## Appendix A: Skill Metadata Schema

```yaml
---
name: api-design
version: 1.0.0
category: backend
core: false
scale:
  - mvp
  - small
  - medium
  - large
  - enterprise
dependencies:
  - config
triggers:
  - express
  - fastify
  - nestjs
  - django
  - fastapi
  - rails
  - spring-boot
recommendation:
  priority: high
  reason: REST/GraphQL API design patterns
---
```

## Appendix B: CLI Reference

```
USAGE:
  /auto-route [OPTIONS]

OPTIONS:
  --new                    Initialize new project
  --analyze                Analyze existing project
  --phase [number]         Continue from specific phase
  --skills=LIST            Skills to activate (comma-separated)
  --skip-core              Skip core skills
  --include=LIST           Additional skills to include
  --exclude=LIST           Skills to exclude
  --interactive, -i        Interactive mode (default)
  --quiet, -q              Minimal output
  --verbose, -v            Detailed output
  --json                   JSON output
  --save                   Save configuration for project
  --load                   Load saved configuration
  --help, -h               Show this help

EXAMPLES:
  /auto-route                      # Auto-detect and route
  /auto-route --new                # Start new project wizard
  /auto-route --analyze            # Full project analysis
  /auto-route --phase 3           # Continue Phase 3
  /auto-route --skills=api-design,database  # Custom skills
  /auto-route --verbose --json     # Detailed JSON output
```

---

**End of Document**
