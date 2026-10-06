/**
 * AUTO-ROUTE v6.0 - Tech Stack Scanner
 *
 * Focused module for tech stack detection from project files
 * Extracted from detector.ts to reduce god class complexity
 */

import { existsSync } from 'fs';
import { join } from 'path';
import type { TechStack } from './types';

// ============================================================================
// TECH INDICATORS
// ============================================================================

interface TechIndicator {
  type: keyof TechStack;
  patterns: RegExp[];
}

const TECH_INDICATORS: Record<string, TechIndicator> = {
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
// TECH STACK DETECTION
// ============================================================================

/**
 * Detect tech stack from package.json data or file system
 */
export function detectTechStack(
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

/**
 * Detect tech stack from file system (when no package.json)
 */
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
