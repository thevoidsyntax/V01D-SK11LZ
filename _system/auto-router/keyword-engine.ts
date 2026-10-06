/**
 * AUTO-ROUTE v6.0 - Keyword Detection Engine
 *
 * Focused module for keyword-to-skill mapping
 * Extracted from detector.ts to reduce god class complexity
 */

import type { KeywordMatch } from './types';

// ============================================================================
// KEYWORD CONFIGURATION
// ============================================================================

interface KeywordConfig {
  skill: string;
  keywords: string[];
  weight: number;
  confidence: 'high' | 'medium' | 'low';
  category?: string;
}

/**
 * Enhanced keyword-to-skill mapping with intent detection
 * Supports fuzzy matching and synonyms
 */
export const KEYWORD_MAP: Record<string, KeywordConfig> = {
  // Security & Auth
  'security': {
    skill: 'security',
    keywords: ['security', 'auth', 'authentication', 'authorization', 'oauth', 'jwt', 'password', 'encryption', 'vulnerability', 'pentest', 'xss', 'csrf', 'sql injection', 'cors'],
    weight: 10,
    confidence: 'high',
    category: 'security'
  },

  // Git & Version Control
  'git': {
    skill: 'git',
    keywords: ['git', 'commit', 'branch', 'merge', 'rebase', 'stash', 'push', 'pull', 'fetch', 'clone', 'diff', 'log'],
    weight: 8,
    confidence: 'high',
    category: 'vcs'
  },

  // Docker & Containers
  'docker': {
    skill: 'docker',
    keywords: ['docker', 'container', 'dockerfile', 'docker-compose', 'image', 'podman', 'containerize'],
    weight: 10,
    confidence: 'high',
    category: 'devops'
  },

  // Testing & QA
  'testing': {
    skill: 'testing',
    keywords: ['test', 'testing', 'unit test', 'integration test', 'e2e', 'end to end', 'jest', 'vitest', 'playwright', 'cypress', 'coverage', 'tdd', 'bdd', 'mutation'],
    weight: 10,
    confidence: 'high',
    category: 'quality'
  },

  // CI/CD & Deployment
  'ci-cd': {
    skill: 'ci-cd',
    keywords: ['ci-cd', 'github actions', 'gitlab ci', 'jenkins', 'pipeline', 'workflow', '自动化', 'deploy', 'deployment'],
    weight: 10,
    confidence: 'high',
    category: 'devops'
  },

  // Database & Data
  'database': {
    skill: 'database',
    keywords: ['database', 'db', 'postgres', 'mysql', 'mongodb', 'redis', 'sql', 'query', 'migration', 'orm', 'prisma', 'sequelize'],
    weight: 10,
    confidence: 'high',
    category: 'data'
  },

  // API Design
  'api-design': {
    skill: 'api-design',
    keywords: ['api', 'rest', 'graphql', 'grpc', 'endpoint', 'route', 'request', 'response', 'openapi', 'swagger'],
    weight: 8,
    confidence: 'medium',
    category: 'api'
  },

  // Frontend & UI
  'frontend': {
    skill: 'frontend',
    keywords: ['frontend', 'react', 'vue', 'angular', 'svelte', 'css', 'html', 'tailwind', 'component', 'ui', 'interface'],
    weight: 8,
    confidence: 'medium',
    category: 'frontend'
  },

  // Performance
  'performance': {
    skill: 'performance',
    keywords: ['performance', 'speed', 'optimize', 'cache', 'lazy', 'bundle', 'webpack', 'vite', 'profiling', 'benchmark'],
    weight: 8,
    confidence: 'medium',
    category: 'performance'
  },

  // Observability
  'observability': {
    skill: 'observability',
    keywords: ['logging', 'monitoring', 'metrics', 'tracing', 'grafana', 'prometheus', 'sentry', 'log', 'debug', 'observe'],
    weight: 8,
    confidence: 'medium',
    category: 'observability'
  },

  // Architecture
  'architecture-patterns': {
    skill: 'architecture-patterns',
    keywords: ['architecture', 'microservices', 'monolith', 'clean architecture', 'ddd', 'cqrs', 'event-driven', 'hexagonal'],
    weight: 8,
    confidence: 'medium',
    category: 'architecture'
  },

  // DevOps & Infrastructure
  'deployment': {
    skill: 'deployment',
    keywords: ['deploy', 'kubernetes', 'k8s', 'helm', 'terraform', 'aws', 'gcp', 'azure', 'cloud', 'infrastructure', 'serverless'],
    weight: 8,
    confidence: 'medium',
    category: 'devops'
  },

  // Security Tools
  'pentest': {
    skill: 'pentest',
    keywords: ['pentest', 'penetration', 'hacking', 'vulnerability scan', 'owasp', 'zap', 'sqlmap', 'nuclei', 'semgrep'],
    weight: 10,
    confidence: 'high',
    category: 'security'
  },

  // Code Quality
  'code-quality': {
    skill: 'code-quality',
    keywords: ['lint', 'eslint', 'prettier', 'format', 'clean code', 'refactor', 'code review', 'static analysis'],
    weight: 6,
    confidence: 'medium',
    category: 'quality'
  },

  // TypeScript
  'typescript-pro': {
    skill: 'typescript-pro',
    keywords: ['typescript', 'ts', 'types', 'interface', 'type', 'generics', 'decorators'],
    weight: 8,
    confidence: 'high',
    category: 'language'
  },

  // Python
  'python-pro': {
    skill: 'python-pro',
    keywords: ['python', 'django', 'fastapi', 'flask', 'pandas', 'numpy', 'pytorch'],
    weight: 8,
    confidence: 'high',
    category: 'language'
  },

  // Domain Modeling
  'domain-modeling': {
    skill: 'domain-modeling',
    keywords: ['domain', 'model', 'ddd', 'bounded context', 'aggregate', 'entity', 'value object', 'ubiquitous language'],
    weight: 10,
    confidence: 'high',
    category: 'architecture'
  },

  // TDD
  'tdd': {
    skill: 'tdd',
    keywords: ['tdd', 'test-driven', 'red-green', 'test first', 'unit testing'],
    weight: 10,
    confidence: 'high',
    category: 'quality'
  },

  // Debugging
  'diagnosing-bugs': {
    skill: 'diagnosing-bugs',
    keywords: ['debug', 'bug', 'error', 'issue', 'problem', 'crash', 'fix', 'troubleshoot'],
    weight: 10,
    confidence: 'high',
    category: 'debugging'
  },

  // Messaging
  'messaging': {
    skill: 'messaging',
    keywords: ['message queue', 'rabbitmq', 'kafka', 'mqtt', 'pubsub', 'event', 'queue'],
    weight: 8,
    confidence: 'medium',
    category: 'data'
  },

  // Logging
  'logging': {
    skill: 'logging',
    keywords: ['log', 'logging', 'pino', 'winston', 'loglevel', 'structured logging'],
    weight: 6,
    confidence: 'medium',
    category: 'observability'
  },

  // Config
  'config': {
    skill: 'config',
    keywords: ['config', 'configuration', 'env', 'environment', 'settings', 'dotenv'],
    weight: 5,
    confidence: 'low',
    category: 'devops'
  }
};

// ============================================================================
// KEYWORD DETECTION
// ============================================================================

/**
 * Optimized keyword detection with fuzzy matching
 */
export function detectSkillsFromInput(input: string): KeywordMatch[] {
  const normalizedInput = input.toLowerCase();
  const matches: KeywordMatch[] = [];
  const matchedSkills = new Set<string>();

  // Match against keyword map
  for (const [key, config] of Object.entries(KEYWORD_MAP)) {
    const matchedKeywords: string[] = [];

    for (const keyword of config.keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    }

    if (matchedKeywords.length > 0) {
      // Avoid duplicate skill matches
      if (!matchedSkills.has(config.skill)) {
        matchedSkills.add(config.skill);
        matches.push({
          skill: config.skill,
          matchedPhrases: matchedKeywords,
          score: config.weight * matchedKeywords.length,
          confidence: config.confidence
        });
      }
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
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
