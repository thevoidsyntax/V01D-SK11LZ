/**
 * AUTO-ROUTER v10.0 - Gap Analyzer Module
 *
 * Analyzes project gaps against production-ready checklist,
 * detects missing patterns, and identifies configuration gaps.
 */

import { glob } from 'glob';
import { existsSync, readFile } from 'fs/promises';
import { join } from 'path';
import type {
  GapAnalysis,
  GapItem,
  GapCategory,
  ProductionReadiness,
  TechStack,
} from './types';

// ============================================================================
// PRODUCTION READINESS CHECKLIST
// ============================================================================

interface ChecklistItem {
  id: string;
  category: GapCategory;
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  check: (cwd: string) => Promise<boolean>;
  howToFix: string;
  skill?: string;
}

const PRODUCTION_CHECKLIST: ChecklistItem[] = [
  // Security
  {
    id: 'health-endpoint',
    category: 'observability',
    title: 'Health check endpoint',
    description: 'Endpoints for /health, /ready, /live for container orchestration',
    impact: 'critical',
    check: async (cwd) => {
      const files = await glob('**/*.{ts,js}', { cwd, ignore: ['**/node_modules/**'] });
      for (const file of files) {
        const content = await readFile(join(cwd, file), 'utf-8').catch(() => '');
        if (/router.*get.*['\"]\/health['\"]|app.*get.*['\"]\/health['\"]/.test(content)) {
          return true;
        }
      }
      return false;
    },
    howToFix: 'Add health check endpoints: GET /health (liveness), GET /ready (readiness)',
    skill: 'observability',
  },
  {
    id: 'structured-logging',
    category: 'observability',
    title: 'Structured logging',
    description: 'JSON-formatted logs for easy parsing and analysis',
    impact: 'high',
    check: async (cwd) => {
      const files = await glob('**/*.{ts,js}', { cwd, ignore: ['**/node_modules/**'] });
      for (const file of files) {
        const content = await readFile(join(cwd, file), 'utf-8').catch(() => '');
        if (/json.*log|log.*json|logger.*format|pino|winston.*format/.test(content)) {
          return true;
        }
      }
      return false;
    },
    howToFix: 'Implement structured logging with pino, winston, or similar library',
    skill: 'logging',
  },
  {
    id: 'error-handling',
    category: 'error-handling',
    title: 'Global error handler',
    description: 'Centralized error handling with proper error responses',
    impact: 'critical',
    check: async (cwd) => {
      const files = await glob('**/*.{ts,js}', { cwd, ignore: ['**/node_modules/**'] });
      for (const file of files) {
        const content = await readFile(join(cwd, file), 'utf-8').catch(() => '');
        if (/error.*handler|middleware.*error|catch.*next|onError|errorMiddleware/.test(content)) {
          return true;
        }
      }
      return false;
    },
    howToFix: 'Create error handling middleware with consistent error response format',
    skill: 'error-tracking',
  },
  {
    id: 'rate-limiting',
    category: 'security',
    title: 'Rate limiting',
    description: 'Protection against abuse and DDoS',
    impact: 'high',
    check: async (cwd) => {
      const pkgJson = await readFile(join(cwd, 'package.json'), 'utf-8').catch(() => '');
      const files = await glob('**/*.{ts,js}', { cwd, ignore: ['**/node_modules/**'] });
      if (/rate-limit|express-rate-limit|@fastify\/rate-limit/.test(pkgJson)) {
        return true;
      }
      for (const file of files) {
        const content = await readFile(join(cwd, file), 'utf-8').catch(() => '');
        if (/rateLimit|RateLimit|rate.*limit/.test(content)) {
          return true;
        }
      }
      return false;
    },
    howToFix: 'Install express-rate-limit or framework-specific rate limiting middleware',
    skill: 'security',
  },
  {
    id: 'cors-config',
    category: 'security',
    title: 'CORS configuration',
    description: 'Properly configured Cross-Origin Resource Sharing',
    impact: 'high',
    check: async (cwd) => {
      const files = await glob('**/*.{ts,js}', { cwd, ignore: ['**/node_modules/**'] });
      for (const file of files) {
        const content = await readFile(join(cwd, file), 'utf-8').catch(() => '');
        if (/cors.*\(|app\.use.*cors|fastify\.register.*cors/.test(content)) {
          if (!/origin.*\*|cors.*\*\)/.test(content)) {
            return true;
          }
        }
      }
      return false;
    },
    howToFix: 'Configure CORS with specific allowed origins, not wildcard *',
    skill: 'security',
  },
  {
    id: 'env-validation',
    category: 'configuration',
    title: 'Environment validation',
    description: 'Validation of required environment variables at startup',
    impact: 'high',
    check: async (cwd) => {
      const files = await glob('**/*.{ts,js}', { cwd, ignore: ['**/node_modules/**'] });
      for (const file of files) {
        const content = await readFile(join(cwd, file), 'utf-8').catch(() => '');
        if (/zod.*env|env.*schema|validateEnv|checkEnv|process\.env.*throw/.test(content)) {
          return true;
        }
      }
      const envExample = existsSync(join(cwd, '.env.example'));
      return envExample;
    },
    howToFix: 'Use zod, joi, or similar for environment variable validation',
    skill: 'config',
  },
  {
    id: 'input-validation',
    category: 'security',
    title: 'Input validation',
    description: 'Validation of all user inputs at API boundaries',
    impact: 'critical',
    check: async (cwd) => {
      const pkgJson = await readFile(join(cwd, 'package.json'), 'utf-8').catch(() => '');
      if (/zod|joi|yup|class-validator|express-validator/.test(pkgJson)) {
        return true;
      }
      const files = await glob('**/*.{ts,js}', { cwd, ignore: ['**/node_modules/**'] });
      for (const file of files) {
        const content = await readFile(join(cwd, file), 'utf-8').catch(() => '');
        if (/validate|schema|parse.*body|@Is/.test(content)) {
          return true;
        }
      }
      return false;
    },
    howToFix: 'Add input validation using zod, joi, or framework-specific validators',
    skill: 'security',
  },
  {
    id: 'graceful-shutdown',
    category: 'infrastructure',
    title: 'Graceful shutdown',
    description: 'Proper cleanup of connections and resources on shutdown',
    impact: 'high',
    check: async (cwd) => {
      const files = await glob('**/*.{ts,js}', { cwd, ignore: ['**/node_modules/**'] });
      for (const file of files) {
        const content = await readFile(join(cwd, file), 'utf-8').catch(() => '');
        if (/process.*SIGTERM|process.*SIGINT|graceful|shutdown.*hook|beforeExit/.test(content)) {
          return true;
        }
      }
      return false;
    },
    howToFix: 'Implement signal handlers for SIGTERM/SIGINT with proper cleanup',
    skill: 'observability',
  },
  {
    id: 'dockerfile',
    category: 'infrastructure',
    title: 'Production Dockerfile',
    description: 'Multi-stage Dockerfile for optimized production builds',
    impact: 'high',
    check: async (cwd) => {
      const dockerfile = existsSync(join(cwd, 'Dockerfile'));
      const dockerfileProd = existsSync(join(cwd, 'Dockerfile.prod'));
      return dockerfile || dockerfileProd;
    },
    howToFix: 'Create multi-stage Dockerfile with proper dependency installation',
    skill: 'docker',
  },
  {
    id: 'ci-cd',
    category: 'infrastructure',
    title: 'CI/CD pipeline',
    description: 'Automated testing and deployment pipeline',
    impact: 'high',
    check: async (cwd) => {
      const githubActions = existsSync(join(cwd, '.github/workflows'));
      const gitlabCi = existsSync(join(cwd, '.gitlab-ci.yml'));
      const jenkinsfile = existsSync(join(cwd, 'Jenkinsfile'));
      return githubActions || gitlabCi || jenkinsfile;
    },
    howToFix: 'Set up GitHub Actions or similar CI/CD pipeline with test automation',
    skill: 'ci-cd',
  },
  {
    id: 'test-coverage',
    category: 'testing',
    title: 'Test coverage',
    description: 'Unit and integration tests with coverage reporting',
    impact: 'high',
    check: async (cwd) => {
      const hasTests = await glob('**/*.{test,spec}.{ts,tsx,js}', { cwd });
      const hasCoverage = await glob('**/coverage/**', { cwd });
      return hasTests.length > 0 && hasCoverage.length > 0;
    },
    howToFix: 'Add Jest/Vitest with coverage threshold configuration',
    skill: 'testing',
  },
  {
    id: 'security-headers',
    category: 'security',
    title: 'Security headers',
    description: 'Helmet or similar for security HTTP headers',
    impact: 'medium',
    check: async (cwd) => {
      const pkgJson = await readFile(join(cwd, 'package.json'), 'utf-8').catch(() => '');
      const files = await glob('**/*.{ts,js}', { cwd, ignore: ['**/node_modules/**'] });
      if (/helmet|fastify-helmet/.test(pkgJson)) {
        return true;
      }
      for (const file of files) {
        const content = await readFile(join(cwd, file), 'utf-8').catch(() => '');
        if (/helmet|securityHeaders|X-Frame-Options|X-Content-Type/.test(content)) {
          return true;
        }
      }
      return false;
    },
    howToFix: 'Install and configure helmet for security headers',
    skill: 'security',
  },
  {
    id: 'readme-docs',
    category: 'documentation',
    title: 'README documentation',
    description: 'Comprehensive project documentation',
    impact: 'medium',
    check: async (cwd) => {
      const readme = existsSync(join(cwd, 'README.md'));
      if (!readme) return false;
      const content = await readFile(join(cwd, 'README.md'), 'utf-8').catch(() => '');
      return content.length > 200;
    },
    howToFix: 'Create comprehensive README with setup, usage, and API documentation',
    skill: 'documentation',
  },
  {
    id: 'typescript-strict',
    category: 'patterns',
    title: 'TypeScript strict mode',
    description: 'Strict TypeScript configuration for better type safety',
    impact: 'medium',
    check: async (cwd) => {
      const tsconfig = await readFile(join(cwd, 'tsconfig.json'), 'utf-8').catch(() => '');
      if (!tsconfig) return false;
      try {
        const config = JSON.parse(tsconfig);
        return config.compilerOptions?.strict === true;
      } catch {
        return false;
      }
    },
    howToFix: 'Enable strict mode in tsconfig.json',
    skill: 'typescript-pro',
  },
];

// ============================================================================
// GAP ANALYSIS
// ============================================================================

/**
 * Analyze gaps against production readiness checklist
 */
export async function analyzeGaps(cwd: string, techStack: TechStack): Promise<GapAnalysis> {
  const missing: GapItem[] = [];
  const warnings: GapItem[] = [];

  for (const item of PRODUCTION_CHECKLIST) {
    const isPresent = await item.check(cwd);

    if (!isPresent) {
      const gapItem: GapItem = {
        id: item.id,
        category: item.category,
        title: item.title,
        description: item.description,
        impact: item.impact,
        bestPractice: `Production-ready applications should have ${item.title.toLowerCase()}`,
        howToFix: item.howToFix,
        skill: item.skill,
      };

      if (item.impact === 'critical') {
        missing.push(gapItem);
      } else {
        warnings.push(gapItem);
      }
    }
  }

  // Add tech-stack specific recommendations
  const recommendations = generateTechSpecificRecommendations(techStack);

  return {
    missing,
    warnings,
    recommendations,
  };
}

/**
 * Generate production readiness report
 */
export async function analyzeProductionReadiness(cwd: string): Promise<ProductionReadiness> {
  const results: Record<string, boolean> = {};

  for (const item of PRODUCTION_CHECKLIST) {
    results[item.id] = await item.check(cwd);
  }

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  const rate = Math.round((passed / total) * 100);

  return {
    healthEndpoint: results['health-endpoint'] || false,
    gracefulShutdown: results['graceful-shutdown'] || false,
    structuredLogging: results['structured-logging'] || false,
    errorBoundaries: results['error-handling'] || false,
    rateLimiting: results['rate-limiting'] || false,
    corsConfiguration: results['cors-config'] || false,
    environmentValidation: results['env-validation'] || false,
    inputValidation: results['input-validation'] || false,
    rate,
  };
}

// ============================================================================
// TECH-SPECIFIC RECOMMENDATIONS
// ============================================================================

function generateTechSpecificRecommendations(techStack: TechStack): string[] {
  const recommendations: string[] = [];

  if (techStack.frameworks.includes('express') || techStack.frameworks.includes('fastify')) {
    recommendations.push('Consider adding API versioning for future-proofing endpoints');
    recommendations.push('Implement request/response logging middleware');
  }

  if (techStack.databases.length > 0) {
    recommendations.push('Set up database connection pooling with health checks');
    recommendations.push('Implement database migration strategy (Flyway/Liquibase/Prisma)');
  }

  if (techStack.cache.length > 0) {
    recommendations.push('Implement cache invalidation strategy');
    recommendations.push('Set cache TTL based on data freshness requirements');
  }

  if (techStack.devops.includes('docker')) {
    recommendations.push('Add docker-compose for local development parity');
    recommendations.push('Implement health checks in containers');
  }

  if (techStack.languages.includes('typescript')) {
    recommendations.push('Enable strict TypeScript checks for better type safety');
    recommendations.push('Use path aliases in tsconfig for cleaner imports');
  }

  return recommendations;
}

// ============================================================================
// EXPORTS
// ============================================================================

export * from './types';
