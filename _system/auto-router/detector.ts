/**
 * AUTO-ROUTE v5.0 - Ultimate Project Intelligence
 *
 * Features:
 * - Keyword-based skill activation
 * - State persistence
 * - Phase auto-tracking
 * - Smart recommendations
 */

import { glob } from 'glob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface TechStack {
  languages: string[];
  frameworks: string[];
  databases: string[];
  devops: string[];
  cache: string[];
  frontend: string[];
}

export interface PhaseInfo {
  current: string;
  number: number;
  total: number;
  status: 'done' | 'in-progress' | 'next' | 'todo';
  requiredSkills: string[];
  completedSkills: string[];
}

export interface DetectionResult {
  isNew: boolean;
  cwd: string;
  projectName: string;
  techStack: TechStack;
  scale: 'mvp' | 'small' | 'medium' | 'large' | 'enterprise';
  phase?: PhaseInfo;
  hasGit: boolean;
  hasCLAUDEmd: boolean;
  hasPackageJson: boolean;
  missingFiles: string[];
  packageManager?: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'go' | 'cargo' | 'maven';
  recentCommits?: number;
}

export interface SkillMetadata {
  name: string;
  path: string;
  description: string;
  version: string;
  category: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  phase: string | string[];
  tech_stack?: {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    services?: string[];
  };
  auto_invoke?: {
    enabled: boolean;
    conditions?: {
      has_file?: string;
      tech_stack?: string[];
      command?: string;
      phrase?: string[];
      phase?: string;
      reason?: string;
    }[];
  };
  triggers?: {
    commands?: string[];
    phrases?: string[];
    files?: string[];
  };
  dependencies?: string[];
  conflicts?: string[];
  scale?: string[];
  capabilities?: string[];
  integrates_with?: string[];
}

export interface ProjectState {
  path: string;
  projectName: string;
  lastAnalyzed: string;
  techStack: TechStack;
  scale: string;
  currentPhase: number;
  activeSkills: string[];
  invokedSkills: string[];
  completedTasks: string[];
  recommendations: Recommendation[];
  history: HistoryEntry[];
}

export interface Recommendation {
  id: string;
  skill: string;
  title: string;
  description: string;
  priority: number;
  effort: 'low' | 'medium' | 'high';
  estimatedTime: string;
  autoImplemented: boolean;
}

export interface HistoryEntry {
  date: string;
  action: string;
  skills: string[];
  result: 'success' | 'partial' | 'failed';
}

// ============================================================================
// KEYWORD DETECTION ENGINE
// ============================================================================

export interface KeywordMatch {
  skill: string;
  matchedPhrases: string[];
  score: number;
}

/**
 * Core keyword-to-skill mapping
 * Maps natural language phrases to skill activations
 */
const KEYWORD_MAP: Record<string, { skill: string; phrases: string[]; score: number }> = {
  // Security & Auth
  'authentication': { skill: 'security', phrases: ['auth', 'login', 'jwt', 'oauth', 'password', 'session', 'mfa', '2fa'], score: 25 },
  'authorization': { skill: 'security', phrases: ['permission', 'role', 'access control', 'rbac', 'abac'], score: 25 },
  'encryption': { skill: 'security', phrases: ['encrypt', 'decrypt', 'hash', 'crypto', 'tls', 'ssl', 'certificate'], score: 20 },

  // Database
  'database': { skill: 'database', phrases: ['postgres', 'mysql', 'mongodb', 'sqlite', 'database', 'db', 'sql', 'query', 'migration', 'schema', 'prisma', 'knex'], score: 30 },
  'cache': { skill: 'scalability', phrases: ['redis', 'cache', 'caching', 'memcached'], score: 20 },

  // API & Backend
  'api': { skill: 'api-design', phrases: ['rest', 'api', 'endpoint', 'route', 'http', 'request', 'response', 'graphql', 'grpc'], score: 30 },
  'validation': { skill: 'api-design', phrases: ['validate', 'schema', 'zod', 'joi', 'yup'], score: 15 },

  // DevOps
  'docker': { skill: 'docker', phrases: ['docker', 'container', 'containerize', 'dockerfile', 'docker-compose'], score: 30 },
  'kubernetes': { skill: 'kubernetes', phrases: ['kubernetes', 'k8s', 'pod', 'deployment', 'service', 'helm', 'ingress'], score: 30 },
  'ci-cd': { skill: 'ci-cd', phrases: ['ci', 'cd', 'pipeline', 'github actions', 'gitlab ci', 'jenkins', 'deploy', 'deployment'], score: 25 },
  'terraform': { skill: 'terraform', phrases: ['terraform', 'iac', 'infrastructure as code', 'aws', 'gcp', 'azure'], score: 25 },
  'deployment': { skill: 'deployment', phrases: ['deploy', 'production', 'release', 'rollback', 'blue-green', 'canary'], score: 20 },

  // Frontend
  'frontend': { skill: 'frontend', phrases: ['react', 'vue', 'angular', 'svelte', 'ui', 'component', 'frontend', 'css', 'tailwind', 'css'], score: 25 },
  'performance': { skill: 'performance', phrases: ['slow', 'optimize', 'performance', 'bundle', 'lazy', 'memo', 'cache'], score: 20 },
  'responsive': { skill: 'frontend', phrases: ['responsive', 'mobile', 'viewport', 'breakpoint'], score: 15 },

  // Testing
  'testing': { skill: 'testing', phrases: ['test', 'unit test', 'integration test', 'e2e', 'vitest', 'jest', 'playwright', 'coverage'], score: 25 },
  'tdd': { skill: 'tdd', phrases: ['tdd', 'test driven', 'red green refactor'], score: 30 },

  // Architecture
  'architecture': { skill: 'architecture-patterns', phrases: ['architecture', 'clean architecture', 'ddd', 'hexagonal', 'microservices', 'monolith'], score: 25 },
  'ddd': { skill: 'domain-modeling', phrases: ['domain', 'entity', 'aggregate', 'value object', 'domain event', 'bounded context'], score: 30 },
  'microservices': { skill: 'architecture-patterns', phrases: ['microservice', 'service mesh', 'api gateway', 'event driven'], score: 25 },

  // Observability
  'logging': { skill: 'logging', phrases: ['log', 'logger', 'pino', 'winston', 'structured log'], score: 25 },
  'monitoring': { skill: 'observability', phrases: ['monitor', 'metrics', 'prometheus', 'grafana', 'dashboard', 'alert'], score: 25 },
  'tracing': { skill: 'observability', phrases: ['trace', 'tracing', 'opentelemetry', 'jaeger', 'zipkin'], score: 25 },

  // Reliability
  'reliability': { skill: 'reliability', phrases: ['slo', 'sla', 'uptime', 'reliability', 'incident', 'on-call', 'runbook'], score: 25 },
  'error-handling': { skill: 'reliability', phrases: ['error', 'exception', 'crash', 'fallback', 'retry', 'circuit breaker'], score: 20 },

  // Code Quality
  'code-review': { skill: 'code-quality', phrases: ['review', 'pr', 'pull request', 'linter', 'eslint', 'prettier'], score: 25 },
  'typescript': { skill: 'typescript-pro', phrases: ['typescript', 'type', 'interface', 'generic', 'type safety'], score: 25 },

  // Data & Messaging
  'messaging': { skill: 'messaging', phrases: ['queue', 'message', 'rabbitmq', 'kafka', 'event', 'publish', 'subscribe'], score: 25 },
  'search': { skill: 'search', phrases: ['search', 'elasticsearch', 'full text', 'index'], score: 25 },

  // Security Audit
  'audit': { skill: 'audit', phrases: ['audit', 'security audit', 'vulnerability', 'scan', 'owasp'], score: 30 },
  'fix-bug': { skill: 'diagnosing-bugs', phrases: ['bug', 'fix', 'debug', 'error', 'issue', 'crash', 'not working'], score: 30 },

  // Documentation
  'documentation': { skill: 'documentation', phrases: ['docs', 'readme', 'changelog', 'api docs', 'comment', 'javadoc'], score: 20 },
};

/**
 * Detect skills based on user input keywords
 */
export function detectSkillsFromInput(input: string): KeywordMatch[] {
  const normalizedInput = input.toLowerCase();
  const matches: KeywordMatch[] = [];
  const matchedSkills = new Set<string>();

  for (const [keyword, config] of Object.entries(KEYWORD_MAP)) {
    const matchedPhrases: string[] = [];

    for (const phrase of config.phrases) {
      if (normalizedInput.includes(phrase.toLowerCase())) {
        matchedPhrases.push(phrase);
      }
    }

    // Also check for keyword match
    if (normalizedInput.includes(keyword.toLowerCase())) {
      matchedPhrases.push(keyword);
    }

    if (matchedPhrases.length > 0) {
      // Avoid duplicate skills
      if (!matchedSkills.has(config.skill)) {
        matchedSkills.add(config.skill);
        matches.push({
          skill: config.skill,
          matchedPhrases,
          score: config.score * matchedPhrases.length,
        });
      }
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

/**
 * Get skill activation recommendation from keywords
 */
export function getKeywordRecommendations(input: string): { skill: string; reason: string; priority: number }[] {
  const matches = detectSkillsFromInput(input);

  return matches.map(match => ({
    skill: match.skill,
    reason: `Keywords detected: ${match.matchedPhrases.join(', ')}`,
    priority: Math.min(100, match.score),
  }));
}

// ============================================================================
// TECH STACK DETECTION
// ============================================================================

const TECH_STACK_INDICATORS: Record<string, { type: keyof TechStack; patterns: RegExp[] }> = {
  // Frameworks
  'express': { type: 'frameworks', patterns: [/"express":/] },
  'fastify': { type: 'frameworks', patterns: [/"fastify":/] },
  '@nestjs/core': { type: 'frameworks', patterns: [/"@nestjs\/core":/] },
  'next': { type: 'frameworks', patterns: [/"next":\s*"/] },
  'react': { type: 'frameworks', patterns: [/"react":\s*"/] },
  'vue': { type: 'frameworks', patterns: [/"vue":\s*"/] },
  'angular': { type: 'frameworks', patterns: [/"@angular\/core":/] },
  'django': { type: 'frameworks', patterns: [/django/] },
  'fastapi': { type: 'frameworks', patterns: [/fastapi/] },
  'flask': { type: 'frameworks', patterns: [/flask/] },

  // Databases
  'postgresql': { type: 'databases', patterns: [/postgres|pg/, /@prisma\/client/, /pg$/] },
  'mysql': { type: 'databases', patterns: [/mysql/, /mysql2/] },
  'mongodb': { type: 'databases', patterns: [/mongoose/, /mongodb/] },
  'redis': { type: 'databases', patterns: [/ioredis/, /redis/, /@redis/] },
  'sqlite': { type: 'databases', patterns: [/sqlite|better-sqlite3/] },

  // DevOps
  'docker': { type: 'devops', patterns: [/docker-compose/, /dockerfile/i] },
  'kubernetes': { type: 'devops', patterns: [/kubernetes|k8s/i] },
  'terraform': { type: 'devops', patterns: [/terraform/i] },
  'github-actions': { type: 'devops', patterns: [/\.github\/workflows/] },

  // Languages
  'typescript': { type: 'languages', patterns: [/typescript/, /tsconfig/] },
  'python': { type: 'languages', patterns: [/requirements\.txt/, /pyproject\.toml/, /setup\.py/] },
  'go': { type: 'languages', patterns: [/go\.mod/, /go\.sum/] },
  'rust': { type: 'languages', patterns: [/cargo\.toml/] },
};

// ============================================================================
// MAIN DETECTION FUNCTION
// ============================================================================

export async function detectProject(cwd: string): Promise<DetectionResult> {
  const [
    hasGit,
    packageJsonFiles,
    claudeMdPath,
    dockerFiles,
    ciFiles,
  ] = await Promise.all([
    checkGit(cwd),
    glob('**/package.json', { cwd, ignore: ['**/node_modules/**'] }),
    checkFile(join(cwd, 'CLAUDE.md')),
    glob('**/{Dockerfile,docker-compose.yml}', { cwd }),
    glob('**/.github/workflows/*.yml', { cwd }),
  ]);

  const isNew = !hasGit && packageJsonFiles.length === 0;

  // Parse package.json
  let packageData: Record<string, unknown> | null = null;
  let packageManager: DetectionResult['packageManager'] = undefined;

  if (packageJsonFiles.length > 0) {
    try {
      const content = await readFile(packageJsonFiles[0], 'utf-8');
      packageData = JSON.parse(content);
      packageManager = detectPackageManager(packageJsonFiles[0]);
    } catch {
      // Invalid JSON
    }
  }

  const techStack = detectTechStack(packageData, cwd);
  const scale = estimateScale(packageData, dockerFiles.length, ciFiles.length);
  const phase = claudeMdPath ? parsePhaseFromClaudeMd(claudeMdPath) : undefined;
  const missingFiles = detectMissingFiles(isNew, techStack);

  // Extract project name
  const projectName = packageData?.name as string ||
    cwd.split(/[/\\]/).pop() ||
    'unknown';

  return {
    isNew,
    cwd,
    projectName,
    techStack,
    scale,
    phase,
    hasGit,
    hasCLAUDEmd: !!claudeMdPath,
    hasPackageJson: packageJsonFiles.length > 0,
    missingFiles,
    packageManager,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function checkGit(cwd: string): Promise<boolean> {
  return existsSync(join(cwd, '.git'));
}

async function checkFile(path: string): Promise<string | null> {
  try {
    await readFile(path, 'utf-8');
    return path;
  } catch {
    return null;
  }
}

function detectPackageManager(path: string): DetectionResult['packageManager'] {
  const dir = dirname(path);
  if (/\/yarn\//.test(dir) || /yarn\.lock$/.test(dir)) return 'yarn';
  if (/\/pnpm\//.test(dir) || /pnpm-lock\.yaml$/.test(dir)) return 'pnpm';
  if (/\bnode_modules\b/.test(dir)) return 'npm';
  return 'npm';
}

function detectTechStack(
  packageData: Record<string, unknown> | null,
  cwd: string
): TechStack {
  const stack: TechStack = {
    languages: [],
    frameworks: [],
    databases: [],
    devops: [],
    cache: [],
    frontend: [],
  };

  if (!packageData) {
    return detectFromFiles(cwd);
  }

  const deps = {
    ...(packageData.dependencies as Record<string, string> || {}),
    ...(packageData.devDependencies as Record<string, string> || {}),
  };

  const content = JSON.stringify(deps);

  for (const [key, config] of Object.entries(TECH_STACK_INDICATORS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(content) || pattern.test(key)) {
        if (!stack[config.type].includes(key)) {
          stack[config.type].push(key);
        }
        break;
      }
    }
  }

  return stack;
}

function detectFromFiles(cwd: string): TechStack {
  const stack: TechStack = {
    languages: [],
    frameworks: [],
    databases: [],
    devops: [],
    cache: [],
    frontend: [],
  };

  if (existsSync(join(cwd, 'requirements.txt')) ||
      existsSync(join(cwd, 'pyproject.toml'))) {
    stack.languages.push('python');
  }
  if (existsSync(join(cwd, 'go.mod'))) stack.languages.push('go');
  if (existsSync(join(cwd, 'Cargo.toml'))) stack.languages.push('rust');

  return stack;
}

function estimateScale(
  packageData: Record<string, unknown> | null,
  dockerCount: number,
  ciCount: number
): DetectionResult['scale'] {
  if (!packageData) return 'mvp';

  const deps = {
    ...(packageData.dependencies as Record<string, string> || {}),
    ...(packageData.devDependencies as Record<string, string> || {}),
  };
  const depCount = Object.keys(deps).length;

  if (dockerCount > 2 || ciCount > 3 || depCount > 100) return 'large';
  if (dockerCount > 0 || ciCount > 0 || depCount > 50) return 'medium';
  if (depCount > 20) return 'small';
  return 'mvp';
}

async function parsePhaseFromClaudeMd(path: string): Promise<PhaseInfo | undefined> {
  try {
    const content = await readFile(path, 'utf-8');

    const phaseMatch = content.match(/Phase\s+(\d+):\s+([^\n]+?)(?:\s*\[([^\]]+)\])?/i);
    if (!phaseMatch) return undefined;

    const [, num, name, statusRaw] = phaseMatch;
    const totalPhases = (content.match(/Phase\s+\d+:/g) || []).length;

    let status: PhaseInfo['status'] = 'todo';
    const statusLower = (statusRaw || content.match(/\b(done|in-progress|next|todo)\b/i)?.[1] || 'todo').toLowerCase();

    if (statusLower.includes('done')) status = 'done';
    else if (statusLower.includes('progress')) status = 'in-progress';
    else if (statusLower.includes('next')) status = 'next';

    const skillMentions = (content.match(/\/([a-z-]+)/gi) || [])
      .map(s => s.substring(1).toLowerCase());
    const requiredSkills = [...new Set(skillMentions)];

    return {
      current: `Phase ${num}: ${name.trim()}`,
      number: parseInt(num),
      total: totalPhases,
      status,
      requiredSkills,
      completedSkills: [],
    };
  } catch {
    return undefined;
  }
}

function detectMissingFiles(isNew: boolean, techStack: TechStack): string[] {
  if (isNew) return [];

  const missing: string[] = [];
  if (!techStack.devops.includes('docker')) {
    missing.push('Dockerfile');
  }

  return missing;
}

// ============================================================================
// STATE PERSISTENCE
// ============================================================================

const STATE_DIR = join(process.env.HOME || process.env.USERPROFILE || '', '.claude', 'state');
const STATE_FILE = join(STATE_DIR, 'projects.json');

export async function loadProjectState(projectPath: string): Promise<ProjectState | null> {
  try {
    if (!existsSync(STATE_FILE)) return null;

    const content = await readFile(STATE_FILE, 'utf-8');
    const allStates: Record<string, ProjectState> = JSON.parse(content);

    return allStates[projectPath] || null;
  } catch {
    return null;
  }
}

export async function saveProjectState(state: ProjectState): Promise<void> {
  try {
    if (!existsSync(STATE_DIR)) {
      await mkdir(STATE_DIR, { recursive: true });
    }

    let allStates: Record<string, ProjectState> = {};

    if (existsSync(STATE_FILE)) {
      try {
        const content = await readFile(STATE_FILE, 'utf-8');
        allStates = JSON.parse(content);
      } catch {
        // Start fresh
      }
    }

    allStates[state.path] = {
      ...state,
      lastAnalyzed: new Date().toISOString(),
    };

    await writeFile(STATE_FILE, JSON.stringify(allStates, null, 2));
  } catch (error) {
    console.error('Failed to save project state:', error);
  }
}

export async function updatePhaseInClaudeMd(
  projectPath: string,
  phaseNumber: number,
  status: 'done' | 'in-progress'
): Promise<void> {
  const claudeMdPath = join(projectPath, 'CLAUDE.md');

  if (!existsSync(claudeMdPath)) return;

  try {
    const content = await readFile(claudeMdPath, 'utf-8');

    // Update phase status
    const updatedContent = content.replace(
      new RegExp(`(Phase\\s+${phaseNumber}:\\s+[^\\[]+)\\[([^\\]]*)\\]`, 'i'),
      (_, phaseLine, _oldStatus) => {
        const newStatus = status === 'done' ? '✅ DONE' : '➡️ IN PROGRESS';
        return `${phaseLine}[${newStatus}]`;
      }
    );

    await writeFile(claudeMdPath, updatedContent);

    // Update state
    const state = await loadProjectState(projectPath);
    if (state) {
      state.currentPhase = phaseNumber;
      if (status === 'done') {
        state.completedTasks.push(`Phase ${phaseNumber}`);
      }
      await saveProjectState(state);
    }
  } catch (error) {
    console.error('Failed to update CLAUDE.md:', error);
  }
}

// ============================================================================
// SKILL DISCOVERY
// ============================================================================

export async function discoverSkills(): Promise<SkillMetadata[]> {
  const skillsDir = join(process.env.HOME || process.env.USERPROFILE || '', '.claude', 'skills');
  const skills: SkillMetadata[] = [];

  if (!existsSync(skillsDir)) return skills;

  const categories = readdirSync(skillsDir, { withFileTypes: true });

  for (const category of categories) {
    if (!category.isDirectory()) continue;
    if (category.name.startsWith('.')) continue;
    if (category.name === 'node_modules') continue;

    const categoryPath = join(skillsDir, category.name);
    const entries = readdirSync(categoryPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillPath = join(categoryPath, entry.name);
      const skillFiles = ['SKILL.md', 'skill.md'];

      for (const skillFile of skillFiles) {
        const fullPath = join(skillPath, skillFile);
        if (existsSync(fullPath)) {
          try {
            const metadata = await parseSkillMetadata(fullPath);
            skills.push({
              ...metadata,
              path: skillPath,
            });
          } catch {
            // Skip invalid skills
          }
          break;
        }
      }
    }
  }

  return skills;
}

async function parseSkillMetadata(skillFile: string): Promise<SkillMetadata> {
  const content = await readFile(skillFile, 'utf-8');

  // Parse YAML frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1];
    const result: Partial<SkillMetadata> = {};

    // Extract fields
    const nameMatch = yaml.match(/^name:\s*(.+)$/m);
    const descMatch = yaml.match(/^description:\s*"?([^"\n]+)"?/m);
    const versionMatch = yaml.match(/^version:\s*"?([^"\n]+)"?/m);
    const priorityMatch = yaml.match(/^priority:\s*(\w+)/m);
    const categoryMatch = yaml.match(/^category:\s*\[?([^\]\n]+)\]?/m);
    const phaseMatch = yaml.match(/^phase:\s*(\w+|\[[^\]]+\])/m);

    if (nameMatch) result.name = nameMatch[1].trim();
    if (descMatch) result.description = descMatch[1].trim();
    if (versionMatch) result.version = versionMatch[1].trim();
    if (priorityMatch) result.priority = priorityMatch[1] as SkillMetadata['priority'];
    if (categoryMatch) {
      result.category = categoryMatch[1].split(',').map(s => s.trim());
    }
    if (phaseMatch) {
      result.phase = phaseMatch[1].replace(/[\[\]]/g, '');
    }

    // Parse auto_invoke section
    if (yaml.includes('auto_invoke:')) {
      const autoInvokeMatch = yaml.match(/auto_invoke:\s*\n([\s\S]*?)(?=\n\w|\n---|$)/);
      if (autoInvokeMatch) {
        const autoInvokeContent = autoInvokeMatch[1];
        result.auto_invoke = {
          enabled: !autoInvokeContent.includes('enabled: false'),
          conditions: [],
        };

        // Extract conditions
        const conditionMatches = autoInvokeContent.matchAll(/-\s*(\w+):\s*\[?([^\]\n]+)\]?/g);
        for (const match of conditionMatches) {
          result.auto_invoke!.conditions!.push({
            [match[1]]: match[2],
          } as any);
        }
      }
    }

    // Parse triggers
    if (yaml.includes('triggers:')) {
      const triggersMatch = yaml.match(/triggers:\s*\n([\s\S]*?)(?=\n\w|\n---|$)/);
      if (triggersMatch) {
        const triggersContent = triggersMatch[1];
        result.triggers = {
          commands: [],
          phrases: [],
          files: [],
        };

        const phraseMatches = triggersContent.matchAll(/phrases?:\s*-\s*(.+)/gi);
        for (const match of phraseMatches) {
          result.triggers!.phrases!.push(match[1].trim());
        }

        const fileMatches = triggersContent.matchAll(/files?:\s*-\s*(.+)/gi);
        for (const match of fileMatches) {
          result.triggers!.files!.push(match[1].trim());
        }
      }
    }

    return {
      name: result.name || skillFile.split(/[/\\]/).slice(-2, -1)[0],
      path: skillFile,
      description: result.description || '',
      version: result.version || '1.0.0',
      category: result.category || [],
      priority: result.priority || 'medium',
      phase: result.phase || 'any',
      ...result,
    };
  }

  // Fallback: extract from content
  return {
    name: skillFile.split(/[/\\]/).slice(-2, -1)[0],
    path: skillFile,
    description: extractFirstLine(content),
    version: '1.0.0',
    category: [],
    priority: 'medium',
    phase: 'any',
  };
}

function extractFirstLine(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
      return trimmed.substring(0, 100);
    }
  }
  return '';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getDetectionSummary(result: DetectionResult): string {
  const parts: string[] = [];

  if (result.isNew) {
    parts.push('New Project');
  } else {
    parts.push('Existing Project');
  }

  if (result.techStack.frameworks.length > 0) {
    parts.push(result.techStack.frameworks.join(', '));
  }

  if (result.techStack.databases.length > 0) {
    parts.push(`DB: ${result.techStack.databases.join(', ')}`);
  }

  if (result.phase) {
    parts.push(result.phase.current);
  }

  return parts.join(' | ');
}

/**
 * Check if a skill should be auto-invoked based on detection result
 */
export function shouldAutoInvokeSkill(
  skill: SkillMetadata,
  detection: DetectionResult,
  keywordMatches?: KeywordMatch[]
): { shouldInvoke: boolean; reason: string; score: number } {
  let score = 0;
  const reasons: string[] = [];

  // Check keyword matches
  if (keywordMatches) {
    const match = keywordMatches.find(m => m.skill === skill.name);
    if (match) {
      score += match.score;
      reasons.push(`Keyword match: ${match.matchedPhrases.join(', ')}`);
    }
  }

  // Check tech stack match
  if (skill.tech_stack) {
    const { frameworks, databases, languages, services } = skill.tech_stack;

    if (frameworks?.some(f => detection.techStack.frameworks.includes(f))) {
      score += 25;
      reasons.push('Framework match');
    }

    if (databases?.some(d => detection.techStack.databases.includes(d))) {
      score += 25;
      reasons.push('Database match');
    }

    if (languages?.some(l => detection.techStack.languages.includes(l))) {
      score += 20;
      reasons.push('Language match');
    }

    if (services?.some(s => detection.techStack.devops.includes(s))) {
      score += 20;
      reasons.push('Service match');
    }
  }

  // Check phase match
  if (skill.phase !== 'any' && detection.phase) {
    if (String(skill.phase) === String(detection.phase.number)) {
      score += 30;
      reasons.push(`Phase ${detection.phase.number} required`);
    }
  }

  // Core skills always invoke
  const coreSkills = ['git', 'docker', 'ci-cd', 'code-quality', 'deployment', 'logging', 'config', 'security'];
  if (coreSkills.includes(skill.name.toLowerCase())) {
    score += 50;
    reasons.push('Core skill');
  }

  return {
    shouldInvoke: score >= 30,
    reason: reasons.join(' | ') || 'No specific match',
    score,
  };
}
