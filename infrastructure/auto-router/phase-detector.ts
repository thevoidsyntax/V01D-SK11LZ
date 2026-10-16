/**
 * AUTO-ROUTER v10.0 - Project Phase Detector
 *
 * Detects project phase based on:
 * - Git history
 * - File structure
 * - Package.json dependencies
 * - CI/CD maturity
 * - Monitoring setup
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import type { ProjectContext, ProjectPhase, TechStack } from './types';

// ============================================================================
// PHASE INDICATORS
// ============================================================================

interface PhaseIndicator {
  phase: ProjectPhase;
  weight: number;
  check: (cwd: string, techStack: TechStack, packageData: Record<string, unknown> | null) => Promise<boolean>;
  description: string;
}

const PHASE_INDICATORS: PhaseIndicator[] = [
  // MVP Indicators
  {
    phase: 'mvp',
    weight: 1,
    check: async (cwd) => {
      const hasSource = existsSync(join(cwd, 'src')) || existsSync(join(cwd, 'app'));
      const fileCount = await glob('**/*.{ts,js,py}', { cwd, ignore: ['**/node_modules/**'] });
      return hasSource && fileCount.length < 50;
    },
    description: 'Small codebase, minimal structure',
  },
  {
    phase: 'mvp',
    weight: 1,
    check: async (_cwd, _stack, packageData) => {
      if (!packageData) return false;
      const deps = { ...(packageData.dependencies || {}), ...(packageData.devDependencies || {}) };
      return Object.keys(deps).length < 20;
    },
    description: 'Few dependencies',
  },

  // Growth Indicators
  {
    phase: 'growth',
    weight: 2,
    check: async (cwd) => {
      const hasCI = existsSync(join(cwd, '.github/workflows')) ||
                   existsSync(join(cwd, '.gitlab-ci.yml')) ||
                   existsSync(join(cwd, 'Jenkinsfile'));
      const fileCount = await glob('**/*.{ts,js,py}', { cwd, ignore: ['**/node_modules/**'] });
      return hasCI && fileCount.length >= 50 && fileCount.length < 200;
    },
    description: 'Has CI/CD, medium codebase',
  },
  {
    phase: 'growth',
    weight: 2,
    check: async (cwd) => {
      const hasTests = existsSync(join(cwd, 'tests')) ||
                      existsSync(join(cwd, '__tests__')) ||
                      existsSync(join(cwd, 'src/__tests__'));
      const hasDocker = existsSync(join(cwd, 'Dockerfile'));
      return hasTests && hasDocker;
    },
    description: 'Has tests and Docker',
  },

  // Scale Indicators
  {
    phase: 'scale',
    weight: 3,
    check: async (cwd) => {
      const hasK8s = existsSync(join(cwd, 'k8s')) ||
                     existsSync(join(cwd, 'kubernetes')) ||
                     existsSync(join(cwd, 'kustomization.yaml'));
      const hasMonitoring = existsSync(join(cwd, 'grafana')) ||
                           existsSync(join(cwd, 'prometheus')) ||
                           existsSync(join(cwd, 'src/monitoring'));
      return hasK8s || hasMonitoring;
    },
    description: 'Has Kubernetes or monitoring',
  },
  {
    phase: 'scale',
    weight: 2,
    check: async (cwd) => {
      const hasLoadBalancing = existsSync(join(cwd, 'nginx.conf')) ||
                               existsSync(join(cwd, 'traefik.toml'));
      const fileCount = await glob('**/*.{ts,js,py}', { cwd, ignore: ['**/node_modules/**'] });
      return hasLoadBalancing && fileCount.length >= 200;
    },
    description: 'Has load balancer, large codebase',
  },

  // Enterprise Indicators
  {
    phase: 'enterprise',
    weight: 3,
    check: async (cwd) => {
      const hasTerraform = existsSync(join(cwd, 'terraform')) ||
                          existsSync(join(cwd, '.tf'));
      const hasArchitecture = existsSync(join(cwd, 'architecture')) ||
                             existsSync(join(cwd, 'docs/architecture'));
      return hasTerraform && hasArchitecture;
    },
    description: 'Has IaC and architecture docs',
  },
  {
    phase: 'enterprise',
    weight: 2,
    check: async (cwd) => {
      const hasSecurity = existsSync(join(cwd, 'security')) ||
                         existsSync(join(cwd, 'docs/security'));
      const hasCompliance = existsSync(join(cwd, 'compliance')) ||
                           existsSync(join(cwd, '.snyk')) ||
                           existsSync(join(cwd, 'security.txt'));
      return hasSecurity && hasCompliance;
    },
    description: 'Has security and compliance',
  },
];

// ============================================================================
// PHASE DETECTION
// ============================================================================

/**
 * Detect project phase
 */
export async function detectProjectPhase(
  cwd: string,
  techStack: TechStack,
  packageData: Record<string, unknown> | null
): Promise<ProjectContext> {
  const phaseScores: Record<ProjectPhase, number> = {
    mvp: 0,
    growth: 0,
    scale: 0,
    enterprise: 0,
  };

  const indicators: string[] = [];

  // Run all checks
  for (const indicator of PHASE_INDICATORS) {
    try {
      const passed = await indicator.check(cwd, techStack, packageData);
      if (passed) {
        phaseScores[indicator.phase] += indicator.weight;
        indicators.push(indicator.description);
      }
    } catch {
      // Skip failing checks
    }
  }

  // Determine phase based on scores
  let maxPhase: ProjectPhase = 'mvp';
  let maxScore = 0;

  for (const [phase, score] of Object.entries(phaseScores)) {
    if (score > maxScore) {
      maxScore = score;
      maxPhase = phase as ProjectPhase;
    }
  }

  // Calculate confidence
  const totalScore = Object.values(phaseScores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? maxScore / totalScore : 0.5;

  // Get additional context
  const teamSize = detectTeamSize(cwd, packageData);
  const estimatedUsers = detectUserScale(cwd, packageData);
  const features = await countFeatures(cwd);
  const age = detectProjectAge(cwd);

  return {
    phase: maxPhase,
    confidence,
    indicators,
    teamSize,
    estimatedUsers,
    features,
    age,
  };
}

/**
 * Detect team size
 */
function detectTeamSize(
  cwd: string,
  packageData: Record<string, unknown> | null
): 'solo' | 'small' | 'medium' | 'large' {
  // Check for multiple package maintainers
  if (packageData?.contributors) {
    const contributors = packageData.contributors as Array<{ name?: string }>;
    if (contributors.length > 5) return 'large';
    if (contributors.length > 2) return 'medium';
  }

  // Check for monorepo structure
  const packageDirs = glob('packages/*/package.json', { cwd });
  const appsDirs = glob('apps/*/package.json', { cwd });

  if (packageDirs.length > 5 || appsDirs.length > 5) return 'large';
  if (packageDirs.length > 2 || appsDirs.length > 2) return 'medium';

  return 'solo';
}

/**
 * Detect user scale
 */
function detectUserScale(
  cwd: string,
  packageData: Record<string, unknown> | null
): 'few' | 'hundreds' | 'thousands' | 'millions' {
  // Check downloads from package.json (for libraries)
  if (packageData?.downloads) {
    const downloads = packageData.downloads as number;
    if (downloads > 1000000) return 'millions';
    if (downloads > 100000) return 'thousands';
    if (downloads > 1000) return 'hundreds';
  }

  // Check for scaling infrastructure
  const hasRedis = existsSync(join(cwd, 'redis')) || existsSync(join(cwd, 'cache'));
  const hasCDN = existsSync(join(cwd, 'cdn')) || existsSync(join(cwd, 'public'));

  if (hasRedis && hasCDN) return 'thousands';
  if (hasRedis) return 'hundreds';

  return 'few';
}

/**
 * Count approximate features
 */
async function countFeatures(cwd: string): Promise<number> {
  // Count route files for APIs
  const routes = await glob('**/routes/**/*.ts', { cwd, ignore: ['**/node_modules/**'] });

  // Count page files for frontends
  const pages = await glob('**/pages/**/*.tsx', { cwd, ignore: ['**/node_modules/**'] });

  // Count models/entities
  const models = await glob('**/models/**/*.ts', { cwd, ignore: ['**/node_modules/**'] });
  const entities = await glob('**/entities/**/*.ts', { cwd, ignore: ['**/node_modules/**'] });

  const total = routes.length + pages.length + models.length + entities.length;

  return Math.max(total, routes.length > 0 ? routes.length : pages.length);
}

/**
 * Detect project age
 */
function detectProjectAge(cwd: string): 'new' | 'weeks' | 'months' | 'years' {
  // Check for CHANGELOG
  if (existsSync(join(cwd, 'CHANGELOG.md'))) {
    try {
      const changelog = readFileSync(join(cwd, 'CHANGELOG.md'), 'utf-8');
      const months = (changelog.match(/## \d+\.\d+\.\d+/g) || []).length;
      if (months > 12) return 'years';
      if (months > 3) return 'months';
      if (months > 0) return 'weeks';
    } catch {
      // Ignore
    }
  }

  // Check for package.json created date (rough approximation)
  // In a real implementation, you'd check git history

  return 'new';
}

// ============================================================================
// PHASE-SPECIFIC RECOMMENDATIONS
// ============================================================================

/**
 * Get recommendations for a specific phase
 */
export function getPhaseRecommendations(phase: ProjectPhase): string[] {
  const recommendations: Record<ProjectPhase, string[]> = {
    mvp: [
      'Focus on core functionality',
      'Use proven libraries over custom solutions',
      'Set up basic testing',
      'Document key decisions',
    ],
    growth: [
      'Add caching layer',
      'Implement monitoring',
      'Set up CI/CD pipeline',
      'Add integration tests',
      'Consider API versioning',
    ],
    scale: [
      'Implement horizontal scaling',
      'Add distributed tracing',
      'Set up alerting',
      'Consider event-driven architecture',
      'Add circuit breakers',
    ],
    enterprise: [
      'Implement security audits',
      'Set up compliance monitoring',
      'Document architecture decisions (ADR)',
      'Implement feature flags',
      'Add chaos engineering',
    ],
  };

  return recommendations[phase] || recommendations.mvp;
}

/**
 * Get skills for specific phase
 */
export function getPhaseSkills(phase: ProjectPhase): string[] {
  const skills: Record<ProjectPhase, string[]> = {
    mvp: ['/api-design', '/code-quality'],
    growth: ['/performance', '/observability', '/testing'],
    scale: ['/observability', '/docker', '/ci-cd'],
    enterprise: ['/security', '/documentation', '/devops'],
  };

  return skills[phase] || skills.mvp;
}

/**
 * Get next phase recommendations
 */
export function getNextPhaseChecklist(currentPhase: ProjectPhase): string[] {
  const checklists: Record<ProjectPhase, string[]> = {
    mvp: [
      'Add comprehensive tests',
      'Set up CI/CD pipeline',
      'Add Docker configuration',
      'Implement monitoring basics',
      'Add error tracking',
    ],
    growth: [
      'Add Kubernetes manifests',
      'Implement distributed tracing',
      'Set up alerting and dashboards',
      'Add load testing',
      'Implement caching strategy',
    ],
    scale: [
      'Implement service mesh',
      'Add chaos engineering',
      'Set up security audits',
      'Implement feature flags',
      'Add compliance documentation',
    ],
    enterprise: [
      'Continue monitoring and improving',
      'Regular security audits',
      'Performance optimization',
      'Technical debt reduction',
      'Documentation maintenance',
    ],
  };

  return checklists[currentPhase] || checklists.mvp;
}
