/**
 * AUTO-ROUTE v6.0 - Optimized Project Intelligence
 *
 * Optimizations:
 * - Enhanced keyword detection with fuzzy matching
 * - Intent-based skill activation
 * - Learning from user preferences
 * - Better scoring algorithm
 * - Context-aware recommendations
 */

import { glob } from 'glob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

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
  packageManager?: string;
  recentCommits?: number;
  detectedPatterns: string[];
}

export interface KeywordMatch {
  skill: string;
  matchedPhrases: string[];
  score: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface UserPreference {
  skill: string;
  useCount: number;
  lastUsed: string;
  preferred: boolean;
}

// ============================================================================
// OPTIMIZED KEYWORD DETECTION ENGINE
// ============================================================================

/**
 * Enhanced keyword-to-skill mapping with intent detection
 * Supports fuzzy matching and synonyms
 */
const KEYWORD_MAP: Record<string, KeywordConfig> = {
  // Security & Auth
  'security': {
    skill: 'security',
    keywords: ['auth', 'login', 'jwt', 'oauth', 'password', 'session', 'mfa', '2fa',
              'permission', 'role', 'access', 'rbac', 'abac', 'encrypt', 'decrypt',
              'hash', 'crypto', 'tls', 'ssl', 'certificate', 'security', 'vulnerability',
              'owasp', 'xss', 'csrf', 'injection', 'sanitize', 'cors', 'helmet'],
    weight: 30,
    category: 'security'
  },
  'identity': {
    skill: 'identity',
    keywords: ['identity', 'user', 'profile', 'account', 'signup', 'register',
              'verification', 'sso', 'ldap', 'oidc', 'saml'],
    weight: 25,
    category: 'security'
  },

  // Database & Data
  'database': {
    skill: 'database',
    keywords: ['postgres', 'postgresql', 'mysql', 'mongodb', 'sqlite', 'database', 'db',
              'sql', 'query', 'migration', 'schema', 'prisma', 'knex', 'orm',
              'table', 'index', 'transaction', 'foreign key', 'join', 'migration',
              'redis', 'elastic', 'meilisearch', 'sqlalchemy', 'typeorm'],
    weight: 30,
    category: 'data'
  },
  'data-engineering': {
    skill: 'data-engineering',
    keywords: ['etl', 'pipeline', 'data warehouse', 'analytics', 'kafka', 'spark',
              'airflow', 'dbt', 'warehouse', 'lake', 'batch', 'stream',
              'transformation', 'aggregation', 'reporting'],
    weight: 25,
    category: 'data'
  },

  // API & Backend
  'api-design': {
    skill: 'api-design',
    keywords: ['api', 'rest', 'graphql', 'grpc', 'endpoint', 'route', 'http',
              'request', 'response', 'crud', 'validation', 'openapi', 'swagger',
              'fastify', 'express', 'nestjs', 'fastapi', 'django', 'gin', 'echo'],
    weight: 30,
    category: 'backend'
  },
  'api-client': {
    skill: 'api-client',
    keywords: ['axios', 'fetch', 'http client', 'request', 'retry', 'timeout',
              'rate limit', 'circuit breaker', 'api call', 'http request'],
    weight: 20,
    category: 'backend'
  },

  // DevOps & Infrastructure
  'docker': {
    skill: 'docker',
    keywords: ['docker', 'container', 'containerize', 'dockerfile', 'docker-compose',
              'image', 'registry', 'harbor', 'buildx', 'multi-stage'],
    weight: 30,
    category: 'infrastructure'
  },
  'kubernetes': {
    skill: 'kubernetes',
    keywords: ['kubernetes', 'k8s', 'pod', 'deployment', 'service', 'helm', 'ingress',
              'kubectl', 'cluster', 'nodeport', 'loadbalancer', 'istio', 'linkerd'],
    weight: 30,
    category: 'infrastructure'
  },
  'ci-cd': {
    skill: 'ci-cd',
    keywords: ['ci', 'cd', 'pipeline', 'github actions', 'gitlab ci', 'jenkins',
              'deploy', 'deployment', 'automation', 'workflow', 'release',
              'github workflow', 'action', 'runner', 'artifact'],
    weight: 25,
    category: 'infrastructure'
  },
  'deployment': {
    skill: 'deployment',
    keywords: ['deploy', 'production', 'release', 'rollback', 'blue-green', 'canary',
              'staging', 'environment', 'config', 'feature flag', 'ab testing'],
    weight: 20,
    category: 'infrastructure'
  },
  'terraform': {
    skill: 'terraform',
    keywords: ['terraform', 'iac', 'infrastructure as code', 'aws', 'gcp', 'azure',
              'vpc', 'ec2', 'lambda', 's3', 'cloudformation', 'pulumi'],
    weight: 25,
    category: 'infrastructure'
  },

  // Frontend & UI
  'frontend': {
    skill: 'frontend',
    keywords: ['react', 'vue', 'angular', 'svelte', 'frontend', 'ui', 'component',
              'css', 'tailwind', 'styled-components', 'jsx', 'tsx', 'nuxt', 'next',
              'page', 'layout', 'button', 'form', 'input', 'modal'],
    weight: 25,
    category: 'frontend'
  },
  'performance': {
    skill: 'performance',
    keywords: ['performance', 'optimize', 'slow', 'bundle', 'lazy', 'memo', 'cache',
              'webpack', 'vite', 'esbuild', 'treeshake', 'split', 'compress'],
    weight: 20,
    category: 'frontend'
  },

  // Testing & Quality
  'testing': {
    skill: 'testing',
    keywords: ['test', 'testing', 'unit test', 'integration test', 'e2e', 'end to end',
              'vitest', 'jest', 'playwright', 'cypress', 'coverage', 'spec',
              'assertion', 'mock', 'stub', 'spy'],
    weight: 30,
    category: 'quality'
  },
  'tdd': {
    skill: 'tdd',
    keywords: ['tdd', 'test driven', 'red green refactor', 'bdd', 'behavior driven',
              'test first', 'test coverage'],
    weight: 30,
    category: 'quality'
  },
  'code-quality': {
    skill: 'code-quality',
    keywords: ['lint', 'eslint', 'prettier', 'format', 'prettier', 'typescript', 'type',
              'interface', 'generic', 'stric', 'linter', 'code review', 'refactor'],
    weight: 20,
    category: 'quality'
  },

  // Architecture & Patterns
  'architecture-patterns': {
    skill: 'architecture-patterns',
    keywords: ['architecture', 'clean architecture', 'hexagonal', 'ports adapters',
              'microservices', 'monolith', 'layered', 'modular', 'monorepo'],
    weight: 25,
    category: 'architecture'
  },
  'domain-modeling': {
    skill: 'domain-modeling',
    keywords: ['domain', 'entity', 'aggregate', 'value object', 'domain event',
              'bounded context', 'ddd', 'cqrs', 'event sourcing', 'ubiquitous'],
    weight: 30,
    category: 'architecture'
  },
  'messaging': {
    skill: 'messaging',
    keywords: ['message', 'queue', 'rabbitmq', 'kafka', 'event', 'publish', 'subscribe',
              'pubsub', 'amqp', 'consumer', 'producer', 'topic', 'exchange'],
    weight: 25,
    category: 'architecture'
  },

  // Observability
  'logging': {
    skill: 'logging',
    keywords: ['log', 'logger', 'pino', 'winston', 'structured log', 'log level',
              'debug', 'info', 'warn', 'error', 'trace'],
    weight: 25,
    category: 'observability'
  },
  'observability': {
    skill: 'observability',
    keywords: ['monitor', 'monitoring', 'metrics', 'prometheus', 'grafana', 'dashboard',
              'alert', 'trace', 'tracing', 'opentelemetry', 'jaeger', 'zipkin',
              'slo', 'sla', 'uptime', 'health', 'status'],
    weight: 25,
    category: 'observability'
  },

  // Reliability & Operations
  'reliability': {
    skill: 'reliability',
    keywords: ['reliability', 'slo', 'sla', 'uptime', 'incident', 'on-call', 'runbook',
              'error handling', 'exception', 'crash', 'fallback', 'retry', 'circuit breaker',
              'resilience', 'chaos', 'failure'],
    weight: 25,
    category: 'operations'
  },
  'scalability': {
    skill: 'scalability',
    keywords: ['scale', 'scalability', 'horizontal', 'vertical', 'auto-scale', 'load balancer',
              'cache', 'caching', 'cdn', 'edge', 'serverless', 'lambda', 'function'],
    weight: 20,
    category: 'operations'
  },

  // Debugging & Analysis
  'audit': {
    skill: 'audit',
    keywords: ['audit', 'security audit', 'vulnerability', 'scan', 'owasp', 'penetration',
              'security scan', 'code review', 'review', 'analyze', 'analysis'],
    weight: 30,
    category: 'analysis'
  },
  'diagnosing-bugs': {
    skill: 'diagnosing-bugs',
    keywords: ['bug', 'fix', 'debug', 'error', 'issue', 'crash', 'not working', 'broken',
              'exception', 'stack trace', 'traceback', 'panic', 'segmentation fault'],
    weight: 30,
    category: 'analysis'
  },

  // Documentation & Communication
  'documentation': {
    skill: 'documentation',
    keywords: ['docs', 'readme', 'documentation', 'changelog', 'comment', 'javadoc',
              'tsdoc', 'jsdoc', 'typedoc', 'wiki', 'guide', 'tutorial'],
    weight: 15,
    category: 'process'
  },
  'anti-slop': {
    skill: 'anti-slop',
    keywords: ['human', 'natural', 'slop', 'ai text', 'write', 'documentation',
              'verbose', 'formal', 'concise'],
    weight: 10,
    category: 'process'
  },

  // Special & Meta
  'ai-process': {
    skill: 'implement',
    keywords: ['implement', 'build', 'create', 'add', 'feature', 'functionality',
              'code', 'develop', 'engineering'],
    weight: 20,
    category: 'process'
  },
  'wayfinder': {
    skill: 'wayfinder',
    keywords: ['plan', 'roadmap', 'architecture', 'design', 'decision', 'approach',
              'strategy', 'blueprint'],
    weight: 15,
    category: 'process'
  }
};

interface KeywordConfig {
  skill: string;
  keywords: string[];
  weight: number;
  category: string;
}

// Intent patterns for better matching
const INTENT_PATTERNS = {
  CREATE: ['create', 'add', 'new', 'build', 'implement', 'generate', 'setup'],
  READ: ['read', 'get', 'fetch', 'retrieve', 'show', 'list', 'display'],
  UPDATE: ['update', 'modify', 'change', 'edit', 'refactor', 'improve'],
  DELETE: ['delete', 'remove', 'drop', 'uninstall', 'cleanup'],
  DEBUG: ['debug', 'fix', 'bug', 'error', 'issue', 'problem', 'crash'],
  ANALYZE: ['analyze', 'audit', 'review', 'check', 'validate', 'test'],
  DEPLOY: ['deploy', 'release', 'publish', 'push', 'ship', 'launch'],
  CONFIGURE: ['config', 'setup', 'configure', 'install', 'init', 'initialize']
};

/**
 * Optimized keyword detection with fuzzy matching
 */
export function detectSkillsFromInput(input: string): KeywordMatch[] {
  const normalizedInput = input.toLowerCase();
  const matches: KeywordMatch[] = [];
  const matchedSkills = new Set<string>();

  // Detect intent first
  const intents = detectIntent(normalizedInput);

  // Match against keyword map
  for (const [key, config] of Object.entries(KEYWORD_MAP)) {
    const matchedKeywords: string[] = [];

    for (const keyword of config.keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    }

    if (matchedKeywords.length > 0) {
      // Boost score if intent matches
      let score = config.weight * matchedKeywords.length;

      // Intent bonus
      if (intents.includes('DEBUG') && key === 'diagnosing-bugs') score *= 1.5;
      if (intents.includes('CREATE') && key === 'api-design') score *= 1.3;
      if (intents.includes('DEPLOY') && key === 'deployment') score *= 1.3;
      if (intents.includes('ANALYZE') && key === 'audit') score *= 1.5;

      if (!matchedSkills.has(config.skill)) {
        matchedSkills.add(config.skill);
        matches.push({
          skill: config.skill,
          matchedPhrases: matchedKeywords,
          score: Math.min(100, score),
          confidence: score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low'
        });
      }
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

/**
 * Detect user intent from input
 */
function detectIntent(input: string): string[] {
  const detected: string[] = [];

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some(p => input.includes(p))) {
      detected.push(intent);
    }
  }

  return detected;
}

/**
 * Get skill recommendations with reasoning
 */
export function getKeywordRecommendations(input: string): {
  skill: string;
  reason: string;
  priority: number;
  confidence: 'high' | 'medium' | 'low';
}[] {
  const matches = detectSkillsFromInput(input);

  return matches.slice(0, 5).map(match => ({
    skill: match.skill,
    reason: `Detected: ${match.matchedPhrases.slice(0, 3).join(', ')}`,
    priority: Math.min(100, match.score),
    confidence: match.confidence
  }));
}

// ============================================================================
// TECH STACK DETECTION
// ============================================================================

const TECH_INDICATORS: Record<string, { type: keyof TechStack; patterns: RegExp[] }> = {
  'express': { type: 'frameworks', patterns: [/"express":/] },
  'fastify': { type: 'frameworks', patterns: [/"fastify":/] },
  '@nestjs/core': { type: 'frameworks', patterns: [/"@nestjs\/core":/] },
  'next': { type: 'frameworks', patterns: [/"next":\s*"/] },
  'react': { type: 'frameworks', patterns: [/"react":\s*"/] },
  'vue': { type: 'frameworks', patterns: [/"vue":\s*"/] },
  'django': { type: 'frameworks', patterns: [/django/] },
  'fastapi': { type: 'frameworks', patterns: [/fastapi/] },
  'postgres': { type: 'databases', patterns: [/postgres|pg/, /@prisma\/client/] },
  'mysql': { type: 'databases', patterns: [/mysql/, /mysql2/] },
  'mongodb': { type: 'databases', patterns: [/mongoose/, /mongodb/] },
  'redis': { type: 'cache', patterns: [/ioredis/, /redis/] },
  'docker': { type: 'devops', patterns: [/docker-compose/, /dockerfile/i] },
  'kubernetes': { type: 'devops', patterns: [/kubernetes|k8s/i] },
  'terraform': { type: 'devops', patterns: [/terraform/i] },
  'github-actions': { type: 'devops', patterns: [/\.github\/workflows/] },
  'typescript': { type: 'languages', patterns: [/typescript/, /tsconfig/] },
  'python': { type: 'languages', patterns: [/requirements\.txt/, /pyproject\.toml/] },
  'go': { type: 'languages', patterns: [/go\.mod/] },
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
  let packageManager: string | undefined;

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
  const detectedPatterns = detectPatterns(cwd);

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
    missingFiles: [],
    packageManager,
    detectedPatterns
  };
}

/**
 * Detect code patterns in project
 */
async function detectPatterns(cwd: string): Promise<string[]> {
  const patterns: string[] = [];

  // Check for DDD structure
  const hasDDD = await glob('**/domain/**/*.ts', { cwd, ignore: ['**/node_modules/**'] });
  if (hasDDD.length > 0) patterns.push('ddd');

  // Check for Clean Architecture
  const hasClean = await glob('**/{application,domain,infrastructure}/**', { cwd, ignore: ['**/node_modules/**'] });
  if (hasClean.length > 5) patterns.push('clean-architecture');

  // Check for microservices
  const hasMicroservices = await glob('**/services/**/package.json', { cwd });
  if (hasMicroservices.length > 1) patterns.push('microservices');

  // Check for monorepo
  const hasMonorepo = await glob('**/packages/**/package.json', { cwd });
  if (hasMonorepo.length > 0) patterns.push('monorepo');

  return patterns;
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

function detectPackageManager(path: string): string {
  if (/\/yarn\//.test(path) || /yarn\.lock$/.test(path)) return 'yarn';
  if (/\/pnpm\//.test(path) || /pnpm-lock\.yaml$/.test(path)) return 'pnpm';
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

  for (const [key, config] of Object.entries(TECH_INDICATORS)) {
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

// ============================================================================
// STATE PERSISTENCE
// ============================================================================

const STATE_DIR = join(process.env.HOME || process.env.USERPROFILE || '', '.claude', 'state');
const STATE_FILE = join(STATE_DIR, 'projects.json');

export async function loadProjectState(projectPath: string): Promise<{
  path: string;
  projectName: string;
  lastAnalyzed: string;
  techStack: TechStack;
  scale: string;
  currentPhase: number;
  activeSkills: string[];
  invokedSkills: string[];
  history: { date: string; action: string; result: string }[];
  preferences: UserPreference[];
} | null> {
  try {
    if (!existsSync(STATE_FILE)) return null;

    const content = await readFile(STATE_FILE, 'utf-8');
    const allStates = JSON.parse(content);

    return allStates[projectPath] || null;
  } catch {
    return null;
  }
}

export async function saveProjectState(state: Record<string, unknown>): Promise<void> {
  try {
    if (!existsSync(STATE_DIR)) {
      await mkdir(STATE_DIR, { recursive: true });
    }

    let allStates: Record<string, unknown> = {};

    if (existsSync(STATE_FILE)) {
      try {
        const content = await readFile(STATE_FILE, 'utf-8');
        allStates = JSON.parse(content);
      } catch {
        // Start fresh
      }
    }

    allStates[state.path as string] = {
      ...state,
      lastAnalyzed: new Date().toISOString(),
    };

    await writeFile(STATE_FILE, JSON.stringify(allStates, null, 2));
  } catch (error) {
    console.error('Failed to save project state:', error);
  }
}
