/**
 * AUTO-ROUTER v10.0 - Recommendation Engine
 *
 * Generates actionable recommendations based on:
 * - Quality issues
 * - Gap analysis
 * - Tech debt
 * - Security vulnerabilities
 * - Project phase
 */

import type {
  Recommendation,
  RecommendationsSummary,
  QuickWin,
  GapAnalysis,
  QualityIssue,
  TechDebtAnalysis,
  SecurityAnalysis,
  ProductionReadiness,
  ProjectContext,
  SeverityLevel,
  GapCategory
} from './types';

// ============================================================================
// COMMAND LIBRARY
// ============================================================================

const QUICK_COMMANDS: Record<string, string> = {
  'install-eslint': 'npx eslint --init',
  'install-prettier': 'npm install -D prettier eslint-config-prettier eslint-plugin-prettier',
  'install-husky': 'npm install -D husky lint-staged',
  'install-helmet': 'npm install helmet',
  'install-rate-limit': 'npm install express-rate-limit',
  'install-winston': 'npm install winston',
  'install-pino': 'npm install pino pino-pretty',
  'install-zod': 'npm install zod',
  'install-joi': 'npm install joi',
  'install-compression': 'npm install compression',
  'install-cors': 'npm install cors',
  'install-ioredis': 'npm install ioredis',
  'install-health-check': 'See health-scorer.ts for implementation',
};

// ============================================================================
// SKILL MAPPING
// ============================================================================

const SKILL_RECOMMENDATIONS: Record<string, string[]> = {
  security: ['/security', '/auth-flows', '/pentest'],
  observability: ['/observability', '/logging'],
  errorHandling: ['/error-tracking'],
  infrastructure: ['/docker', '/ci-cd', '/kubernetes'],
  testing: ['/testing', '/tdd', '/playwright'],
  performance: ['/performance', '/performance-ui'],
  configuration: ['/config'],
  documentation: ['/documentation'],
  patterns: ['/api-design', '/fullstack-patterns', '/design-patterns'],
  'type-safety': ['/typescript-pro'],
  linting: ['/code-quality'],
  complexity: ['/code-quality'],
};

// ============================================================================
// RECOMMENDATION TEMPLATES
// ============================================================================

interface RecommendationTemplate {
  id: string;
  title: string;
  description: string;
  category: GapCategory;
  priority: SeverityLevel;
  actionType: 'command' | 'skill' | 'file' | 'manual';
  actionValue: string;
  estimatedTime: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  prerequisite?: string[];
}

const RECOMMENDATION_TEMPLATES: RecommendationTemplate[] = [
  // Security Recommendations
  {
    id: 'SEC-001',
    title: 'Install Helmet for security headers',
    description: 'Add Helmet.js to set security-related HTTP headers',
    category: 'security',
    priority: 'high',
    actionType: 'command',
    actionValue: 'install-helmet',
    estimatedTime: '5min',
    impact: 'high',
  },
  {
    id: 'SEC-002',
    title: 'Configure rate limiting',
    description: 'Add rate limiting middleware to prevent DDoS and brute force',
    category: 'security',
    priority: 'high',
    actionType: 'command',
    actionValue: 'install-rate-limit',
    estimatedTime: '15min',
    impact: 'high',
  },
  {
    id: 'SEC-003',
    title: 'Add input validation',
    description: 'Use Zod or Joi to validate all user inputs',
    category: 'security',
    priority: 'high',
    actionType: 'command',
    actionValue: 'install-zod',
    estimatedTime: '1hour',
    impact: 'high',
  },
  {
    id: 'SEC-004',
    title: 'Fix security vulnerabilities',
    description: 'Run npm audit and fix identified vulnerabilities',
    category: 'security',
    priority: 'critical',
    actionType: 'command',
    actionValue: 'npm audit fix',
    estimatedTime: '30min',
    impact: 'critical',
  },

  // Observability Recommendations
  {
    id: 'OBS-001',
    title: 'Add health check endpoints',
    description: 'Implement /health, /ready, /live endpoints for Kubernetes',
    category: 'observability',
    priority: 'high',
    actionType: 'manual',
    actionValue: 'Create src/routes/health.ts with health check logic',
    estimatedTime: '30min',
    impact: 'high',
  },
  {
    id: 'OBS-002',
    title: 'Implement structured logging',
    description: 'Replace console.log with structured logger (pino/winston)',
    category: 'observability',
    priority: 'medium',
    actionType: 'command',
    actionValue: 'install-pino',
    estimatedTime: '1hour',
    impact: 'medium',
  },

  // Error Handling
  {
    id: 'ERR-001',
    title: 'Add error handling middleware',
    description: 'Create centralized error handling middleware',
    category: 'error-handling',
    priority: 'high',
    actionType: 'manual',
    actionValue: 'Create src/middleware/errorHandler.ts',
    estimatedTime: '30min',
    impact: 'high',
  },
  {
    id: 'ERR-002',
    title: 'Add graceful shutdown',
    description: 'Handle SIGTERM/SIGINT for graceful shutdown',
    category: 'infrastructure',
    priority: 'high',
    actionType: 'manual',
    actionValue: 'Update src/index.ts to handle process signals',
    estimatedTime: '30min',
    impact: 'high',
  },

  // Testing
  {
    id: 'TEST-001',
    title: 'Add unit tests',
    description: 'Write unit tests for core business logic',
    category: 'testing',
    priority: 'high',
    actionType: 'skill',
    actionValue: '/testing',
    estimatedTime: 'half-day',
    impact: 'high',
  },
  {
    id: 'TEST-002',
    title: 'Add E2E tests',
    description: 'Set up Playwright or Cypress for E2E testing',
    category: 'testing',
    priority: 'medium',
    actionType: 'command',
    actionValue: 'npm install -D @playwright/test && npx playwright install',
    estimatedTime: '1hour',
    impact: 'medium',
  },

  // Code Quality
  {
    id: 'QUAL-001',
    title: 'Add ESLint configuration',
    description: 'Set up ESLint with TypeScript support',
    category: 'patterns',
    priority: 'medium',
    actionType: 'command',
    actionValue: 'install-eslint',
    estimatedTime: '15min',
    impact: 'medium',
  },
  {
    id: 'QUAL-002',
    title: 'Add Prettier configuration',
    description: 'Configure Prettier for code formatting',
    category: 'patterns',
    priority: 'low',
    actionType: 'command',
    actionValue: 'install-prettier',
    estimatedTime: '5min',
    impact: 'low',
  },

  // Performance
  {
    id: 'PERF-001',
    title: 'Add response compression',
    description: 'Enable gzip/brotli compression for API responses',
    category: 'performance',
    priority: 'medium',
    actionType: 'command',
    actionValue: 'install-compression',
    estimatedTime: '15min',
    impact: 'medium',
  },
  {
    id: 'PERF-002',
    title: 'Add Redis caching',
    description: 'Implement Redis for caching frequently accessed data',
    category: 'performance',
    priority: 'medium',
    actionType: 'command',
    actionValue: 'install-ioredis',
    estimatedTime: '1hour',
    impact: 'medium',
  },

  // Configuration
  {
    id: 'CONF-001',
    title: 'Add .env.example',
    description: 'Create template for environment variables',
    category: 'configuration',
    priority: 'high',
    actionType: 'manual',
    actionValue: 'Create .env.example with all required variables',
    estimatedTime: '10min',
    impact: 'high',
  },
  {
    id: 'CONF-002',
    title: 'Add environment validation',
    description: 'Validate environment variables at startup using Zod',
    category: 'configuration',
    priority: 'medium',
    actionType: 'command',
    actionValue: 'install-zod',
    estimatedTime: '30min',
    impact: 'medium',
  },
];

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

/**
 * Generate comprehensive recommendations
 */
export function generateRecommendations(
  qualityIssues: QualityIssue[],
  gapAnalysis: GapAnalysis,
  techDebt: TechDebtAnalysis,
  security: SecurityAnalysis,
  production: ProductionReadiness,
  projectContext: ProjectContext
): RecommendationsSummary {
  const recommendations: Recommendation[] = [];
  const quickWins: QuickWin[] = [];

  // Add recommendations from quality issues
  for (const issue of qualityIssues) {
    recommendations.push({
      id: issue.id,
      priority: issue.severity,
      category: issue.category,
      title: issue.title,
      description: issue.description,
      action: {
        type: issue.autoFixable ? 'command' : 'manual',
        value: issue.suggestion,
        description: issue.autoFixable ? 'This can be auto-fixed' : 'Manual intervention required',
      },
      estimatedTime: issue.effort === '5min' ? '5 minutes' :
                    issue.effort === '15min' ? '15 minutes' :
                    issue.effort === '1hour' ? '1 hour' : 'Half day',
      impact: issue.severity === 'critical' ? 'critical' :
              issue.severity === 'high' ? 'high' :
              issue.severity === 'medium' ? 'medium' : 'low',
    });

    if (issue.autoFixable && issue.effort === '5min') {
      quickWins.push({
        title: issue.title,
        description: issue.suggestion,
        impact: 'high',
        effort: '5min',
      });
    }
  }

  // Add recommendations from gap analysis
  for (const gap of gapAnalysis.missing) {
    const template = RECOMMENDATION_TEMPLATES.find(
      t => t.title.toLowerCase().includes(gap.title.toLowerCase().split(' ')[0]) ||
           gap.title.toLowerCase().includes(t.title.toLowerCase().split(' ')[0])
    );

    if (template) {
      recommendations.push({
        id: gap.id,
        priority: mapImpactToPriority(gap.impact),
        category: gap.category,
        title: gap.title,
        description: gap.description,
        action: {
          type: template.actionType as 'command' | 'skill' | 'file' | 'manual',
          value: template.actionValue,
        },
        skills: SKILL_RECOMMENDATIONS[gap.category],
        estimatedTime: template.estimatedTime,
        impact: gap.impact,
      });

      if (template.estimatedTime === '5min' || template.estimatedTime === '15min') {
        quickWins.push({
          title: gap.title,
          description: gap.bestPractice,
          command: QUICK_COMMANDS[template.actionValue],
          skill: SKILL_RECOMMENDATIONS[gap.category]?.[0],
          impact: gap.impact as 'high' | 'medium' | 'low',
          effort: template.estimatedTime === '5min' ? '5min' : '15min',
        });
      }
    }
  }

  // Add recommendations from tech debt
  for (const vuln of techDebt.securityVulnerabilities) {
    recommendations.push({
      id: vuln.id,
      priority: vuln.severity,
      category: 'security',
      title: `Fix: ${vuln.title}`,
      description: vuln.description,
      action: {
        type: 'command',
        value: vuln.fixCommand,
      },
      estimatedTime: '15min',
      impact: vuln.severity === 'critical' ? 'critical' :
              vuln.severity === 'high' ? 'high' :
              vuln.severity === 'medium' ? 'medium' : 'low',
    });
  }

  // Add phase-specific recommendations
  addPhaseRecommendations(recommendations, projectContext);

  // Sort by priority
  const priorityOrder: Record<SeverityLevel, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    info: 4,
  };

  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Group by priority
  const grouped = {
    critical: recommendations.filter(r => r.priority === 'critical'),
    high: recommendations.filter(r => r.priority === 'high'),
    medium: recommendations.filter(r => r.priority === 'medium'),
    low: recommendations.filter(r => r.priority === 'low'),
  };

  // Calculate total time
  const totalMinutes = recommendations.reduce((sum, r) => {
    if (r.estimatedTime.includes('minute')) return sum + parseInt(r.estimatedTime);
    if (r.estimatedTime.includes('hour')) return sum + parseInt(r.estimatedTime) * 60;
    if (r.estimatedTime.includes('Half')) return sum + 240;
    return sum;
  }, 0);

  return {
    ...grouped,
    quickWins,
    totalIssues: recommendations.length,
    estimatedTotalTime: formatTime(totalMinutes),
  };
}

/**
 * Map impact level to priority
 */
function mapImpactToPriority(impact: 'critical' | 'high' | 'medium' | 'low'): SeverityLevel {
  return impact;
}

/**
 * Add phase-specific recommendations
 */
function addPhaseRecommendations(
  recommendations: Recommendation[],
  context: ProjectContext
): void {
  switch (context.phase) {
    case 'mvp':
      recommendations.push({
        id: 'PHASE-MVP-001',
        priority: 'high',
        category: 'patterns',
        title: 'MVP: Focus on core features only',
        description: 'For MVP phase, focus on shipping core functionality first',
        action: {
          type: 'manual',
          value: 'Prioritize features and defer non-essential improvements',
        },
        skills: ['/api-design'],
        estimatedTime: 'Ongoing',
        impact: 'high',
      });
      break;

    case 'growth':
      recommendations.push({
        id: 'PHASE-GROWTH-001',
        priority: 'medium',
        category: 'performance',
        title: 'Growth: Add caching layer',
        description: 'As user base grows, implement caching to handle more load',
        action: {
          type: 'command',
          value: 'install-ioredis',
        },
        skills: ['/redis-pro', '/performance'],
        estimatedTime: '1hour',
        impact: 'medium',
      });
      break;

    case 'scale':
      recommendations.push({
        id: 'PHASE-SCALE-001',
        priority: 'medium',
        category: 'infrastructure',
        title: 'Scale: Add monitoring and alerting',
        description: 'Implement comprehensive monitoring for production traffic',
        action: {
          type: 'skill',
          value: '/observability',
        },
        skills: ['/observability', '/docker'],
        estimatedTime: 'half-day',
        impact: 'medium',
      });
      break;

    case 'enterprise':
      recommendations.push({
        id: 'PHASE-ENTERPRISE-001',
        priority: 'low',
        category: 'documentation',
        title: 'Enterprise: Document architecture',
        description: 'Create architecture decision records (ADRs)',
        action: {
          type: 'skill',
          value: '/documentation',
        },
        skills: ['/documentation', '/writing-for-agents'],
        estimatedTime: '1hour',
        impact: 'low',
      });
      break;
  }
}

/**
 * Format time in minutes to human readable
 */
function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes < 480) return `${Math.round(minutes / 60)} hours`;
  return `${Math.round(minutes / 480)} days`;
}

// ============================================================================
// FORMAT RECOMMENDATIONS FOR DISPLAY
// ============================================================================

/**
 * Format recommendations as terminal-friendly output
 */
export function formatRecommendationsTerminal(summary: RecommendationsSummary): string {
  const lines: string[] = [];

  lines.push('\n╔══════════════════════════════════════════════════════════════╗');
  lines.push('║                    📋 RECOMMENDATIONS                         ║');
  lines.push('╚══════════════════════════════════════════════════════════════╝\n');

  // Critical
  if (summary.critical.length > 0) {
    lines.push('🔴 CRITICAL (Fix immediately)');
    for (const rec of summary.critical) {
      lines.push(`   • ${rec.title}`);
      lines.push(`     → ${rec.action.value}`);
    }
    lines.push('');
  }

  // High
  if (summary.high.length > 0) {
    lines.push('🟠 HIGH PRIORITY');
    for (const rec of summary.high.slice(0, 5)) {
      lines.push(`   • ${rec.title}`);
      lines.push(`     → ${rec.action.value}`);
    }
    if (summary.high.length > 5) {
      lines.push(`   ... and ${summary.high.length - 5} more`);
    }
    lines.push('');
  }

  // Quick wins
  if (summary.quickWins.length > 0) {
    lines.push('⚡ QUICK WINS (5-15 minutes)');
    for (const win of summary.quickWins.slice(0, 3)) {
      lines.push(`   • ${win.title}`);
      if (win.command) lines.push(`     Run: ${win.command}`);
    }
    lines.push('');
  }

  // Summary
  lines.push(`📊 Total issues: ${summary.totalIssues}`);
  lines.push(`⏱️  Estimated fix time: ${summary.estimatedTotalTime}`);

  return lines.join('\n');
}

/**
 * Format recommendations as markdown
 */
export function formatRecommendationsMarkdown(summary: RecommendationsSummary): string {
  const lines: string[] = [];

  lines.push('## 📋 Recommendations\n');

  // Critical
  if (summary.critical.length > 0) {
    lines.push('### 🔴 Critical Issues\n');
    for (const rec of summary.critical) {
      lines.push(`#### ${rec.title}`);
      lines.push(`**Priority:** ${rec.priority.toUpperCase()}`);
      lines.push(`**Description:** ${rec.description}`);
      lines.push(`**Action:** \`${rec.action.value}\``);
      if (rec.skills) lines.push(`**Skills:** ${rec.skills.join(', ')}`);
      lines.push(`**Estimated Time:** ${rec.estimatedTime}\n`);
    }
  }

  // High
  if (summary.high.length > 0) {
    lines.push('### 🟠 High Priority\n');
    for (const rec of summary.high) {
      lines.push(`- **${rec.title}** - ${rec.action.value}`);
    }
    lines.push('');
  }

  // Quick wins
  if (summary.quickWins.length > 0) {
    lines.push('### ⚡ Quick Wins\n');
    lines.push('| Title | Action | Time |');
    lines.push('|-------|--------|------|');
    for (const win of summary.quickWins) {
      lines.push(`| ${win.title} | ${win.command || 'Manual'} | ${win.effort} |`);
    }
    lines.push('');
  }

  lines.push('## 📊 Summary\n');
  lines.push(`- **Total Issues:** ${summary.totalIssues}`);
  lines.push(`- **Estimated Fix Time:** ${summary.estimatedTotalTime}`);
  lines.push(`- **Critical:** ${summary.critical.length}`);
  lines.push(`- **High:** ${summary.high.length}`);
  lines.push(`- **Medium:** ${summary.medium.length}`);
  lines.push(`- **Low:** ${summary.low.length}`);

  return lines.join('\n');
}
