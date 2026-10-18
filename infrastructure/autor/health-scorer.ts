/**
 * AUTO-ROUTER v10.0 - Health Scorer Module
 *
 * Calculates comprehensive health scores (0-100) based on multiple
 * metrics with severity-weighted scoring system.
 */

import type {
  HealthScore,
  HealthCategory,
  QualityMetrics,
  GapAnalysis,
  TechDebtAnalysis,
  ProductionReadiness,
  SecurityAnalysis,
  QualityIssue,
} from './types';

// ============================================================================
// HEALTH SCORE CALCULATION
// ============================================================================

export interface HealthScoreInput {
  qualityMetrics?: QualityMetrics;
  gapAnalysis?: GapAnalysis;
  techDebtAnalysis?: TechDebtAnalysis;
  productionReadiness?: ProductionReadiness;
  securityAnalysis?: SecurityAnalysis;
  qualityIssues?: QualityIssue[];
}

export function calculateHealthScore(input: HealthScoreInput): HealthScore {
  const categories: HealthCategory[] = [];

  // Quality category
  if (input.qualityMetrics) {
    categories.push({
      name: 'Code Quality',
      score: input.qualityMetrics.overall,
      weight: 0.25,
      status: getStatusFromScore(input.qualityMetrics.overall),
      issues: input.qualityIssues?.filter(i => i.category === 'type-safety' || i.category === 'complexity') || [],
    });
  }

  // Production readiness category
  if (input.productionReadiness) {
    categories.push({
      name: 'Production Ready',
      score: input.productionReadiness.rate,
      weight: 0.25,
      status: getStatusFromScore(input.productionReadiness.rate),
      issues: [],
    });
  }

  // Tech debt category
  if (input.techDebtAnalysis) {
    const debtScore = 100 - input.techDebtAnalysis.totalDebtScore;
    categories.push({
      name: 'Tech Debt',
      score: debtScore,
      weight: 0.20,
      status: getStatusFromScore(debtScore),
      issues: [],
    });
  }

  // Security category
  if (input.securityAnalysis) {
    categories.push({
      name: 'Security',
      score: input.securityAnalysis.score,
      weight: 0.20,
      status: getStatusFromScore(input.securityAnalysis.score),
      issues: [],
    });
  }

  // Gap analysis category
  if (input.gapAnalysis) {
    const gapScore = calculateGapScore(input.gapAnalysis);
    categories.push({
      name: 'Best Practices',
      score: gapScore,
      weight: 0.10,
      status: getStatusFromScore(gapScore),
      issues: [],
    });
  }

  // Calculate overall score
  const overall = calculateWeightedScore(categories);

  return {
    overall,
    grade: getGradeFromScore(overall),
    categories,
    trend: undefined, // Would be calculated from historical data
    lastChecked: new Date().toISOString(),
  };
}

// ============================================================================
// SCORE HELPERS
// ============================================================================

function getStatusFromScore(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 50) return 'fair';
  if (score >= 25) return 'poor';
  return 'critical';
}

function getGradeFromScore(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function calculateWeightedScore(categories: HealthCategory[]): number {
  if (categories.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const category of categories) {
    weightedSum += category.score * category.weight;
    totalWeight += category.weight;
  }

  return Math.round(weightedSum / totalWeight);
}

function calculateGapScore(gapAnalysis: GapAnalysis): number {
  const criticalMissing = gapAnalysis.missing.filter(g => g.impact === 'critical').length;
  const highMissing = gapAnalysis.missing.filter(g => g.impact === 'high').length;
  const mediumMissing = gapAnalysis.missing.filter(g => g.impact === 'medium').length;
  const lowMissing = gapAnalysis.missing.filter(g => g.impact === 'low').length;

  const totalGaps = gapAnalysis.missing.length;
  if (totalGaps === 0) return 100;

  // Weighted penalty based on severity
  const penalty =
    criticalMissing * 20 +
    highMissing * 12 +
    mediumMissing * 6 +
    lowMissing * 2;

  return Math.max(0, 100 - penalty);
}

// ============================================================================
// ISSUE COUNTING
// ============================================================================

export function countIssuesBySeverity(issues: QualityIssue[]): Record<string, number> {
  const counts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  for (const issue of issues) {
    if (counts[issue.severity] !== undefined) {
      counts[issue.severity]++;
    }
  }

  return counts;
}

export function getCriticalIssues(issues: QualityIssue[]): QualityIssue[] {
  return issues.filter(i => i.severity === 'critical' || i.severity === 'high');
}

// ============================================================================
// EXPORTS
// ============================================================================

export * from './types';
