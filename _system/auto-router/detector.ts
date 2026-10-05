/**
 * AUTO-ROUTE v4.0 - Project Detector
 *
 * Smart detection of project state, tech stack, and phase awareness.
 */

import { glob } from 'glob';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';

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
  total: number;
  status: 'done' | 'in-progress' | 'next' | 'todo';
  requiredSkills: string[];
}

export interface DetectionResult {
  isNew: boolean;
  cwd: string;
  techStack: TechStack;
  scale: 'mvp' | 'small' | 'medium' | 'large' | 'enterprise';
  phase?: PhaseInfo;
  hasGit: boolean;
  hasCLAUDEMd: boolean;
  hasPackageJson: boolean;
  missingFiles: string[];
  packageManager?: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'go' | 'cargo' | 'maven';
  recentCommits?: number;
}

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
  '@rails': { type: 'frameworks', patterns: [/"@rails/] },

  // Databases
  'postgresql': { type: 'databases', patterns: [/postgres|pg/, /@prisma\/client/, /pg$/] },
  'mysql': { type: 'databases', patterns: [/mysql/, /mysql2/] },
  'mongodb': { type: 'databases', patterns: [/mongoose/, /mongodb/] },
  'redis': { type: 'databases', patterns: [/ioredis/, /redis/, /@redis/] },
  'sqlite': { type: 'databases', patterns: [/sqlite|better-sqlite3/] },

  // Cache
  'redis-cache': { type: 'cache', patterns: [/ioredis/, /redis/] },

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
  'java': { type: 'languages', patterns: [/pom\.xml/, /build\.gradle/, /gradlew/] },
};

export async function detectProject(cwd: string): Promise<DetectionResult> {
  const [
    hasGit,
    packageJsonFiles,
    claudeMdPath,
    dockerFiles,
    ciFiles,
    dbFiles,
  ] = await Promise.all([
    checkGit(cwd),
    glob('**/package.json', { cwd, ignore: ['**/node_modules/**'] }),
    checkFile(join(cwd, 'CLAUDE.md')),
    glob('**/{Dockerfile,docker-compose.yml}', { cwd }),
    glob('**/.github/workflows/*.yml', { cwd }),
    detectDatabaseFiles(cwd),
  ]);

  // Determine if new project
  const isNew = !hasGit && packageJsonFiles.length === 0;

  // Parse package.json if exists
  let packageData: Record<string, unknown> | null = null;
  let packageManager: DetectionResult['packageManager'] = undefined;

  if (packageJsonFiles.length > 0) {
    try {
      const content = await readFile(packageJsonFiles[0], 'utf-8');
      packageData = JSON.parse(content);
      packageManager = detectPackageManager(packageJsonFiles[0]);
    } catch {
      // Invalid JSON, continue without package data
    }
  }

  // Detect tech stack
  const techStack = detectTechStack(packageData, cwd);

  // Estimate scale
  const scale = estimateScale(packageData, dockerFiles.length, ciFiles.length);

  // Parse phase from CLAUDE.md
  const phase = claudeMdPath ? parsePhaseFromClaudeMd(claudeMdPath) : undefined;

  // Detect missing files
  const missingFiles = detectMissingFiles(isNew, techStack);

  // Count recent commits
  const recentCommits = hasGit ? await getRecentCommitCount(cwd) : undefined;

  return {
    isNew,
    cwd,
    techStack,
    scale,
    phase,
    hasGit,
    hasCLAUDEMd: !!claudeMdPath,
    hasPackageJson: packageJsonFiles.length > 0,
    missingFiles,
    packageManager,
    recentCommits,
  };
}

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
  return 'npm'; // Default
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
    // Try to detect from files
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

  // Detect language from package.json fields
  if (packageData.engines && typeof packageData.engines === 'object') {
    const engines = packageData.engines as Record<string, string>;
    if (engines.node) stack.languages.push('node');
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

  // Check for Python files
  if (existsSync(join(cwd, 'requirements.txt')) ||
      existsSync(join(cwd, 'pyproject.toml')) ||
      existsSync(join(cwd, 'setup.py'))) {
    stack.languages.push('python');
  }

  // Check for Go files
  if (existsSync(join(cwd, 'go.mod'))) {
    stack.languages.push('go');
  }

  // Check for Rust files
  if (existsSync(join(cwd, 'Cargo.toml'))) {
    stack.languages.push('rust');
  }

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

    // Match Phase pattern: Phase X: Name (Status)
    const phaseMatch = content.match(/Phase\s+(\d+):\s+([^\n]+?)(?:\s*\[([^\]]+)\])?/i);
    if (!phaseMatch) return undefined;

    const [, num, name, statusRaw] = phaseMatch;
    const totalPhases = (content.match(/Phase\s+\d+:/g) || []).length;

    // Parse status from brackets or markers
    let status: PhaseInfo['status'] = 'todo';
    const statusLower = (statusRaw || content.match(/\b(done|in-progress|next|todo)\b/i)?.[1] || 'todo').toLowerCase();

    if (statusLower.includes('done') || statusLower.includes('✅')) {
      status = 'done';
    } else if (statusLower.includes('progress') || statusLower.includes('➡️')) {
      status = 'in-progress';
    } else if (statusLower.includes('next') || statusLower.includes('⬜')) {
      status = 'next';
    }

    // Extract required skills from phase content
    const phaseContent = content.substring(
      content.indexOf(`Phase ${num}:`),
      content.indexOf(`Phase ${parseInt(num) + 1}:`) || content.length
    );

    const skillMentions = phaseContent.match(/\/([a-z-]+)/gi) || [];
    const requiredSkills = [...new Set(skillMentions.map(s => s.substring(1).toLowerCase()))];

    return {
      current: `Phase ${num}: ${name.trim()}`,
      total: totalPhases,
      status,
      requiredSkills,
    };
  } catch {
    return undefined;
  }
}

function detectMissingFiles(isNew: boolean, techStack: TechStack): string[] {
  const missing: string[] = [];

  if (!isNew) {
    // Common files for existing projects
    if (!techStack.devops.includes('docker') && !existsSync(join(process.cwd(), 'Dockerfile'))) {
      missing.push('Dockerfile');
    }
  }

  return missing;
}

async function detectDatabaseFiles(cwd: string): Promise<string[]> {
  const patterns = [
    '**/prisma/schema.prisma',
    '**/knexfile.ts',
    '**/migrations/*.sql',
    '**/migrations/*.ts',
    '**/*.sql',
  ];

  const files: string[] = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, { cwd });
    files.push(...matches);
  }

  return files;
}

async function getRecentCommitCount(cwd: string): Promise<number> {
  // This would use git command in real implementation
  // For now, return placeholder
  return 0;
}

// Utility functions for external use
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

export function shouldAutoInvokeSkill(skill: string, result: DetectionResult): boolean {
  const skillLower = skill.toLowerCase();

  // Core skills always
  const coreSkills = ['git', 'docker', 'ci-cd', 'code-quality', 'deployment', 'logging', 'config'];
  if (coreSkills.includes(skillLower)) return true;

  // Tech stack specific
  const stackMap: Record<string, string[]> = {
    'express': ['api-design', 'security'],
    'fastify': ['api-design', 'security'],
    'nestjs': ['api-design', 'security', 'messaging'],
    'next': ['frontend', 'performance', 'api-design'],
    'react': ['frontend', 'performance'],
    'postgresql': ['database', 'data-engineering'],
    'redis': ['scalability'],
    'kubernetes': ['kubernetes', 'reliability'],
  };

  for (const [tech, skills] of Object.entries(stackMap)) {
    if (result.techStack.frameworks.includes(tech) || result.techStack.databases.includes(tech)) {
      if (skills.includes(skillLower)) return true;
    }
  }

  return false;
}
