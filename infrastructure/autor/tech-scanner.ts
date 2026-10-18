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
  // Frameworks
  'express': { type: 'frameworks', patterns: [/"express":/] },
  'fastify': { type: 'frameworks', patterns: [/"fastify":/] },
  '@nestjs/core': { type: 'frameworks', patterns: [/"@nestjs\/core":/] },
  'next': { type: 'frameworks', patterns: [/"next":\s*"/] },
  'react': { type: 'frameworks', patterns: [/"react":\s*"/] },
  'vue': { type: 'frameworks', patterns: [/"vue":\s*"/] },
  'django': { type: 'frameworks', patterns: [/django/] },
  'fastapi': { type: 'frameworks', patterns: [/fastapi/] },
  'flask': { type: 'frameworks', patterns: [/flask/] },

  // Databases
  'postgres': { type: 'databases', patterns: [/postgres|pg/, /@prisma\/client/] },
  'mysql': { type: 'databases', patterns: [/mysql/, /mysql2/] },
  'mongodb': { type: 'databases', patterns: [/mongoose/, /mongodb/] },
  'redis': { type: 'cache', patterns: [/ioredis/, /redis/] },
  'graphql': { type: 'frameworks', patterns: [/@apollo|apollo/, /graphql/] },

  // DevOps & Cloud
  'docker': { type: 'devops', patterns: [/docker-compose/, /dockerfile/i] },
  'kubernetes': { type: 'devops', patterns: [/kubernetes|k8s/i] },
  'terraform': { type: 'devops', patterns: [/terraform/i] },
  'github-actions': { type: 'devops', patterns: [/\.github\/workflows/] },
  'aws': { type: 'devops', patterns: [/@aws-sdk/, /aws-sdk/] },

  // Languages
  'typescript': { type: 'languages', patterns: [/typescript/, /tsconfig/] },
  'python': { type: 'languages', patterns: [/requirements\.txt/, /pyproject\.toml/] },
  'go': { type: 'languages', patterns: [/go\.mod/] },
  'rust': { type: 'languages', patterns: [/cargo\.toml/] },
  'java': { type: 'languages', patterns: [/pom\.xml/, /build\.gradle/] },

  // AI/ML
  'langchain': { type: 'frameworks', patterns: [/langchain/] },
  'openai': { type: 'services', patterns: [/openai/] },
  'anthropic': { type: 'services', patterns: [/anthropic/] },
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

  // Python detection
  if (existsSync(join(cwd, 'requirements.txt')) ||
      existsSync(join(cwd, 'pyproject.toml'))) {
    stack.languages.push('python');
  }

  // Go detection
  if (existsSync(join(cwd, 'go.mod'))) {
    stack.languages.push('go');
  }

  // Rust detection
  if (existsSync(join(cwd, 'Cargo.toml'))) {
    stack.languages.push('rust');
  }

  // Java detection
  if (existsSync(join(cwd, 'pom.xml')) ||
      existsSync(join(cwd, 'build.gradle'))) {
    stack.languages.push('java');
  }

  // NestJS detection
  if (existsSync(join(cwd, 'nest-cli.json')) ||
      existsSync(join(cwd, 'src/main.ts'))) {
    stack.frameworks.push('nestjs');
  }

  // Dockerfile detection
  if (existsSync(join(cwd, 'Dockerfile')) ||
      existsSync(join(cwd, 'docker-compose.yml')) ||
      existsSync(join(cwd, 'docker-compose.yaml'))) {
    stack.devops.push('docker');
  }

  // Kubernetes detection
  if (existsSync(join(cwd, 'k8s')) ||
      existsSync(join(cwd, 'kubernetes')) ||
      existsSync(join(cwd, 'kustomization.yaml'))) {
    stack.devops.push('kubernetes');
  }

  // Terraform detection
  if (existsSync(join(cwd, 'main.tf'))) {
    stack.devops.push('terraform');
  }

  // GitHub Actions detection
  if (existsSync(join(cwd, '.github/workflows'))) {
    stack.devops.push('github-actions');
  }

  return stack;
}
