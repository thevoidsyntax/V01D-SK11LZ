/**
 * AUTO-ROUTER v10.0 - Report Formatter
 *
 * Generates formatted reports in various styles:
 * - Terminal (box-drawing + emojis)
 * - Markdown (GitHub-flavored)
 * - JSON (for programmatic use)
 */

import type {
  EnhancedDetectionResult,
  AnalysisReport,
  HealthScore,
  QualityMetrics,
  GapAnalysis,
  TechDebtAnalysis,
  SecurityAnalysis,
  ProductionReadiness,
  RecommendationsSummary,
  TechStack,
  SeverityLevel
} from './types';

// ============================================================================
// GRADE EMOJIS & COLORS
// ============================================================================

const GRADE_COLORS: Record<string, string> = {
  A: '🟢',
  B: '🟡',
  C: '🟠',
  D: '🔴',
  F: '⚫',
};

const SEVERITY_EMOJIS: Record<SeverityLevel, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢',
  info: 'ℹ️',
};

// ============================================================================
// MAIN REPORT GENERATOR
// ============================================================================

/**
 * Generate comprehensive analysis report
 */
export function generateReport(
  result: EnhancedDetectionResult,
  format: 'terminal' | 'markdown' | 'json' = 'terminal'
): string {
  switch (format) {
    case 'terminal':
      return generateTerminalReport(result);
    case 'markdown':
      return generateMarkdownReport(result);
    case 'json':
      return generateJsonReport(result);
    default:
      return generateTerminalReport(result);
  }
}

/**
 * Generate terminal-friendly report
 */
export function generateTerminalReport(result: EnhancedDetectionResult): string {
  const lines: string[] = [];

  // Header
  const healthScore = result.healthScore;
  const grade = healthScore?.grade || '?';
  const gradeEmoji = GRADE_COLORS[grade] || '⚪';

  lines.push('╔══════════════════════════════════════════════════════════════════════╗');
  lines.push(`║                    PROJECT ANALYSIS REPORT v10.0                        ║`);
  lines.push(`║              Health Score: ${healthScore?.overall || '?'}/100 (Grade: ${grade}) ${gradeEmoji.padStart(2)}              ║`);
  lines.push('╚══════════════════════════════════════════════════════════════════════╝');
  lines.push('');

  // Summary
  lines.push('📊 SUMMARY');
  lines.push(`   ├── Project: ${result.projectName}`);
  lines.push(`   ├── Phase: ${result.projectContext?.phase || 'Unknown'}`);
  lines.push(`   ├── Health Grade: ${grade} (${healthScore?.overall || '?'}/100)`);
  lines.push(`   ├── Critical Issues: ${countCriticalIssues(result)}`);
  lines.push(`   └── Production Ready: ${result.productionReadiness?.rate ? `${result.productionReadiness.rate}%` : 'Unknown'}`);
  lines.push('');

  // Tech Stack
  lines.push('🔍 TECH STACK');
  if (result.techStack.languages.length > 0) {
    lines.push(`   └── Languages: ${result.techStack.languages.join(', ')}`);
  }
  if (result.techStack.frameworks.length > 0) {
    lines.push(`   └── Frameworks: ${result.techStack.frameworks.join(', ')}`);
  }
  if (result.techStack.databases.length > 0) {
    lines.push(`   └── Databases: ${result.techStack.databases.join(', ')}`);
  }
  if (result.techStack.devops.length > 0) {
    lines.push(`   └── DevOps: ${result.techStack.devops.join(', ')}`);
  }
  lines.push('');

  // Quality Metrics
  if (result.qualityMetrics) {
    lines.push('📊 QUALITY METRICS');
    lines.push(`   ├── Type Safety: ${result.qualityMetrics.typeSafety}/100 ${getScoreIcon(result.qualityMetrics.typeSafety)}`);
    lines.push(`   ├── Test Coverage: ${result.qualityMetrics.testCoverage}/100 ${getScoreIcon(result.qualityMetrics.testCoverage)}`);
    lines.push(`   ├── Linting: ${result.qualityMetrics.lintingScore}/100 ${getScoreIcon(result.qualityMetrics.lintingScore)}`);
    lines.push(`   └── Complexity: ${result.qualityMetrics.complexityScore}/100 ${getScoreIcon(result.qualityMetrics.complexityScore)}`);
    lines.push('');
  }

  // Production Readiness
  if (result.productionReadiness) {
    lines.push(`🏥 PRODUCTION READINESS: ${result.productionReadiness.rate}%`);
    lines.push(`   ├── ${result.productionReadiness.healthEndpoint ? '✅' : '❌'} Health endpoint`);
    lines.push(`   ├── ${result.productionReadiness.gracefulShutdown ? '✅' : '❌'} Graceful shutdown`);
    lines.push(`   ├── ${result.productionReadiness.structuredLogging ? '✅' : '❌'} Structured logging`);
    lines.push(`   ├── ${result.productionReadiness.errorBoundaries ? '✅' : '❌'} Error boundaries`);
    lines.push(`   ├── ${result.productionReadiness.rateLimiting ? '✅' : '❌'} Rate limiting`);
    lines.push(`   ├── ${result.productionReadiness.corsConfiguration ? '✅' : '❌'} CORS configuration`);
    lines.push(`   ├── ${result.productionReadiness.inputValidation ? '✅' : '❌'} Input validation`);
    lines.push(`   └── ${result.productionReadiness.environmentValidation ? '✅' : '❌'} Env validation`);
    lines.push('');
  }

  // Tech Debt
  if (result.techDebtAnalysis) {
    const debt = result.techDebtAnalysis;
    lines.push(`⚠️  TECH DEBT: ${100 - debt.totalDebtScore}/100`);
    lines.push(`   ├── 🔴 Critical: ${debt.securityVulnerabilities.length}`);
    lines.push(`   ├── 🟠 High: ${debt.outdatedPackages.filter(p => p.severity === 'high').length}`);
    lines.push(`   ├── 🟡 Medium: ${debt.deprecatedAPIs.filter(a => a.urgency === 'medium').length}`);
    lines.push(`   └── 🟢 Low: ${debt.outdatedPackages.filter(p => p.severity === 'low').length}`);
    lines.push(`   └── ⏱️  Fix time: ${debt.estimatedFixTime}`);
    lines.push('');
  }

  // Critical Recommendations
  if (result.recommendations) {
    const recs = result.recommendations;

    if (recs.critical.length > 0) {
      lines.push('🔴 CRITICAL RECOMMENDATIONS');
      for (const rec of recs.critical) {
        lines.push(`   ├── ${rec.title}`);
        if (rec.action.value) {
          lines.push(`   │   → ${rec.action.value}`);
        }
      }
      lines.push('');
    }

    if (recs.high.length > 0) {
      lines.push('🟠 HIGH PRIORITY');
      for (const rec of recs.high.slice(0, 3)) {
        lines.push(`   ├── ${rec.title}`);
        if (rec.action.value) {
          lines.push(`   │   → ${rec.action.value}`);
        }
      }
      if (recs.high.length > 3) {
        lines.push(`   └── ... and ${recs.high.length - 3} more`);
      }
      lines.push('');
    }

    if (recs.quickWins.length > 0) {
      lines.push('⚡ QUICK WINS (5-15 min)');
      for (const win of recs.quickWins.slice(0, 3)) {
        lines.push(`   ├── ${win.title}`);
        if (win.command) {
          lines.push(`   │   Run: ${win.command}`);
        }
      }
      lines.push('');
    }

    lines.push(`📋 Total issues: ${recs.totalIssues}`);
    lines.push(`⏱️  Estimated fix time: ${recs.estimatedTotalTime}`);
    lines.push('');
  }

  // Skills
  lines.push('📚 SKILLS RECOMMENDED');
  if (result.skills.length > 0) {
    lines.push(`   ├── Required: ${result.skills.slice(0, 5).join(', ')}`);
  }
  if (result.enhancedSkills && result.enhancedSkills.length > 0) {
    lines.push(`   └── All: ${result.enhancedSkills.slice(0, 10).join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Generate Markdown report
 */
export function generateMarkdownReport(result: EnhancedDetectionResult): string {
  const lines: string[] = [];
  const healthScore = result.healthScore;
  const grade = healthScore?.grade || '?';

  // Header
  lines.push('# 📊 Project Analysis Report\n');
  lines.push(`**Version:** ${new Date().toISOString().split('T')[0]}`);
  lines.push(`**Health Score:** ${healthScore?.overall || '?'}/100 (Grade: ${grade})\n`);
  lines.push('---\n');

  // Summary
  lines.push('## 📋 Summary\n');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Project | ${result.projectName} |`);
  lines.push(`| Phase | ${result.projectContext?.phase || 'Unknown'} |`);
  lines.push(`| Health Grade | ${grade} |`);
  lines.push(`| Production Ready | ${result.productionReadiness?.rate || '?'}% |`);
  lines.push(`| Critical Issues | ${countCriticalIssues(result)} |`);
  lines.push('');

  // Tech Stack
  lines.push('## 🔍 Tech Stack\n');
  lines.push(`- **Languages:** ${result.techStack.languages.join(', ') || 'None detected'}`);
  lines.push(`- **Frameworks:** ${result.techStack.frameworks.join(', ') || 'None detected'}`);
  lines.push(`- **Databases:** ${result.techStack.databases.join(', ') || 'None detected'}`);
  lines.push(`- **DevOps:** ${result.techStack.devops.join(', ') || 'None detected'}\n`);

  // Quality Metrics
  if (result.qualityMetrics) {
    lines.push('## 📊 Quality Metrics\n');
    lines.push(`| Metric | Score | Status |`);
    lines.push(`|--------|-------|--------|`);
    lines.push(`| Type Safety | ${result.qualityMetrics.typeSafety}/100 | ${getStatus(result.qualityMetrics.typeSafety)} |`);
    lines.push(`| Test Coverage | ${result.qualityMetrics.testCoverage}/100 | ${getStatus(result.qualityMetrics.testCoverage)} |`);
    lines.push(`| Linting | ${result.qualityMetrics.lintingScore}/100 | ${getStatus(result.qualityMetrics.lintingScore)} |`);
    lines.push(`| Complexity | ${result.qualityMetrics.complexityScore}/100 | ${getStatus(result.qualityMetrics.complexityScore)} |\n`);
  }

  // Production Readiness
  if (result.productionReadiness) {
    lines.push('## 🏥 Production Readiness\n');
    const pr = result.productionReadiness;
    lines.push(`| Check | Status |`);
    lines.push(`|-------|--------|`);
    lines.push(`| Health Endpoint | ${pr.healthEndpoint ? '✅' : '❌'} |`);
    lines.push(`| Graceful Shutdown | ${pr.gracefulShutdown ? '✅' : '❌'} |`);
    lines.push(`| Structured Logging | ${pr.structuredLogging ? '✅' : '❌'} |`);
    lines.push(`| Error Boundaries | ${pr.errorBoundaries ? '✅' : '❌'} |`);
    lines.push(`| Rate Limiting | ${pr.rateLimiting ? '✅' : '❌'} |`);
    lines.push(`| CORS Config | ${pr.corsConfiguration ? '✅' : '❌'} |`);
    lines.push(`| Input Validation | ${pr.inputValidation ? '✅' : '❌'} |`);
    lines.push(`| Env Validation | ${pr.environmentValidation ? '✅' : '❌'} |\n`);
  }

  // Recommendations
  if (result.recommendations) {
    lines.push('## 📋 Recommendations\n');

    if (result.recommendations.critical.length > 0) {
      lines.push('### 🔴 Critical\n');
      for (const rec of result.recommendations.critical) {
        lines.push(`- **${rec.title}**`);
        lines.push(`  - ${rec.description}`);
        if (rec.action.value) {
          lines.push(`  - Action: \`${rec.action.value}\``);
        }
        lines.push('');
      }
    }

    if (result.recommendations.high.length > 0) {
      lines.push('### 🟠 High Priority\n');
      for (const rec of result.recommendations.high) {
        lines.push(`- ${rec.title}`);
      }
      lines.push('');
    }

    if (result.recommendations.quickWins.length > 0) {
      lines.push('### ⚡ Quick Wins\n');
      lines.push('| Title | Command | Time |');
      lines.push('|-------|---------|------|');
      for (const win of result.recommendations.quickWins) {
        lines.push(`| ${win.title} | ${win.command || 'Manual'} | ${win.effort} |`);
      }
      lines.push('');
    }
  }

  // Skills
  lines.push('## 📚 Recommended Skills\n');
  lines.push('```');
  lines.push(result.skills.join(' '));
  lines.push('```\n');

  return lines.join('\n');
}

/**
 * Generate JSON report
 */
export function generateJsonReport(result: EnhancedDetectionResult): string {
  const report: Partial<AnalysisReport> = {
    timestamp: new Date().toISOString(),
    project: {
      name: result.projectName,
      path: result.cwd,
      phase: result.projectContext?.phase || 'mvp',
    },
    summary: {
      healthScore: result.healthScore?.overall || 0,
      healthGrade: result.healthScore?.grade || 'F',
      totalIssues: result.recommendations?.totalIssues || 0,
      criticalIssues: countCriticalIssues(result),
      techDebtScore: result.techDebtAnalysis?.totalDebtScore || 0,
      productionReady: (result.productionReadiness?.rate || 0) >= 70,
    },
    sections: {
      techStack: result.techStack,
      quality: result.qualityMetrics || { overall: 0, typeSafety: 0, testCoverage: 0, lintingScore: 0, complexityScore: 0 },
      gaps: result.gapAnalysis || { missing: [], warnings: [], recommendations: [] },
      techDebt: result.techDebtAnalysis || { outdatedPackages: [], deprecatedAPIs: [], securityVulnerabilities: [], totalDebtScore: 0, estimatedFixTime: '' },
      security: result.securityAnalysis || { score: 0, criticalVulnerabilities: [], securityHeaders: [], authentication: { implemented: false, issues: [] }, authorization: { implemented: false, rbac: false, resourceLevel: false, issues: [] }, inputValidation: { inputValidation: false, outputEncoding: false, sqlInjection: false, xss: false, csrf: false, issues: [] }, dependencies: { totalPackages: 0, vulnerablePackages: 0, outdatedPackages: 0, licenseIssues: 0 } },
      production: result.productionReadiness || { healthEndpoint: false, gracefulShutdown: false, structuredLogging: false, errorBoundaries: false, rateLimiting: false, corsConfiguration: false, environmentValidation: false, inputValidation: false, rate: 0 },
      recommendations: result.recommendations || { critical: [], high: [], medium: [], low: [], quickWins: [], totalIssues: 0, estimatedTotalTime: '' },
    },
    skills: {
      required: result.skills.filter(s => !result.enhancedSkills?.includes(s)),
      recommended: result.skills,
      optional: result.enhancedSkills?.filter(s => !result.skills.includes(s)) || [],
    },
  };

  return JSON.stringify(report, null, 2);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getScoreIcon(score: number): string {
  if (score >= 80) return '✅';
  if (score >= 60) return '⚠️';
  return '❌';
}

function getStatus(score: number): string {
  if (score >= 80) return '🟢 Excellent';
  if (score >= 60) return '🟡 Fair';
  return '🔴 Poor';
}

function countCriticalIssues(result: EnhancedDetectionResult): number {
  let count = 0;

  if (result.recommendations) {
    count += result.recommendations.critical.length;
  }

  if (result.techDebtAnalysis) {
    count += result.techDebtAnalysis.securityVulnerabilities.filter(
      v => v.severity === 'critical'
    ).length;
  }

  return count;
}
