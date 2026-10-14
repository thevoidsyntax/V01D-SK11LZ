/**
 * AUTO-ROUTER v10.0 - Quality Analyzer Module
 *
 * Analyzes code quality metrics including type safety, linting,
 * test coverage estimation, and complexity indicators.
 */

import { glob } from 'glob';
import { readFile } from 'fs/promises';
import type {
  QualityMetrics,
  QualityIssue,
  TypeSafetyDetails,
  SeverityLevel,
  GapCategory,
} from './types';

// ============================================================================
// QUALITY ANALYSIS
// ============================================================================

/**
 * Analyze overall code quality metrics
 */
export async function analyzeQuality(cwd: string): Promise<{
  metrics: QualityMetrics;
  issues: QualityIssue[];
  typeDetails: TypeSafetyDetails;
}> {
  const [typeSafety, linting, complexity] = await Promise.all([
    analyzeTypeSafety(cwd),
    analyzeLinting(cwd),
    analyzeComplexity(cwd),
  ]);

  const testCoverage = await estimateTestCoverage(cwd);

  const metrics: QualityMetrics = {
    typeSafety: typeSafety.score,
    testCoverage,
    lintingScore: linting.score,
    complexityScore: complexity.score,
    overall: calculateOverallQuality(typeSafety.score, testCoverage, linting.score, complexity.score),
  };

  const issues: QualityIssue[] = [
    ...typeSafety.issues,
    ...linting.issues,
    ...complexity.issues,
  ];

  return {
    metrics,
    issues,
    typeDetails: typeSafety.details,
  };
}

// ============================================================================
// TYPE SAFETY ANALYSIS
// ============================================================================

interface TypeSafetyResult {
  score: number;
  issues: QualityIssue[];
  details: TypeSafetyDetails;
}

async function analyzeTypeSafety(cwd: string): Promise<TypeSafetyResult> {
  const tsFiles = await glob('**/*.{ts,tsx}', {
    cwd,
    ignore: ['**/node_modules/**', '**/*.d.ts', '**/dist/**'],
  });

  const details: TypeSafetyDetails = {
    anyTypeCount: 0,
    unknownTypeCount: 0,
    missingReturnTypes: 0,
    nonNullAssertions: 0,
    totalInterfaces: 0,
    totalTypeAliases: 0,
  };

  const issues: QualityIssue[] = [];

  for (const file of tsFiles.slice(0, 50)) { // Limit for performance
    try {
      const content = await readFile(`${cwd}/${file}`, 'utf-8');
      const lines = content.split('\n');

      // Count 'any' types
      const anyMatches = content.match(/: any\b/g);
      if (anyMatches) details.anyTypeCount += anyMatches.length;

      // Count 'unknown' types
      const unknownMatches = content.match(/: unknown\b/g);
      if (unknownMatches) details.unknownTypeCount += unknownMatches.length;

      // Count non-null assertions
      const nonNullMatches = content.match(/!\./g);
      if (nonNullMatches) details.nonNullAssertions += nonNullMatches.length;

      // Count interfaces and type aliases
      const interfaceMatches = content.match(/\binterface\s+\w+/g);
      if (interfaceMatches) details.totalInterfaces += interfaceMatches.length;

      const typeAliasMatches = content.match(/\btype\s+\w+\s*=/g);
      if (typeAliasMatches) details.totalTypeAliases += typeAliasMatches.length;

      // Check for missing return types on exported functions
      lines.forEach((line, idx) => {
        if (/^(export\s+)?(async\s+)?function\s+\w+\s*\(/.test(line) && !line.includes('):')) {
          details.missingReturnTypes++;
          issues.push(createTypeIssue('function', file, idx + 1, line.trim()));
        }
      });
    } catch {
      // Skip unreadable files
    }
  }

  const totalIndicators = details.anyTypeCount + details.unknownTypeCount + details.missingReturnTypes + details.nonNullAssertions;
  const score = Math.max(0, 100 - (totalIndicators * 5));

  return { score, issues, details };
}

function createTypeIssue(
  category: 'any-type' | 'unknown-type' | 'missing-return' | 'non-null',
  file: string,
  line: number,
  lineContent: string
): QualityIssue {
  const severityMap: Record<string, SeverityLevel> = {
    'any-type': 'medium',
    'unknown-type': 'low',
    'missing-return': 'low',
    'non-null': 'info',
  };

  const suggestionMap: Record<string, string> = {
    'any-type': 'Replace `: any` with explicit type or use `unknown` if type is truly unknown',
    'unknown-type': 'Consider using a more specific type instead of `unknown`',
    'missing-return': 'Add explicit return type annotation for better type safety',
    'non-null': 'Consider using optional chaining or explicit null checks instead of non-null assertions',
  };

  return {
    id: `type-${category}-${file}-${line}`,
    severity: severityMap[category],
    category: 'type-safety',
    title: `Type safety: ${category.replace('-', ' ')} usage`,
    description: `Found ${category.replace('-', ' ')} at line ${line}: ${lineContent.slice(0, 60)}...`,
    file,
    line,
    suggestion: suggestionMap[category],
    effort: '15min',
    autoFixable: false,
  };
}

// ============================================================================
// LINTING ANALYSIS
// ============================================================================

interface LintingResult {
  score: number;
  issues: QualityIssue[];
}

async function analyzeLinting(cwd: string): Promise<LintingResult> {
  const issues: QualityIssue[] = [];

  // Check for ESLint config
  const hasEslint = await glob('{ .eslintrc*, eslint.config.*, .eslintrc.js }', { cwd });
  const hasPrettier = await glob('{ .prettierrc*, prettier.config.* }', { cwd });
  const hasTypeScript = await glob('tsconfig*.json', { cwd });

  // Score based on linting config presence
  let score = 40; // Base score

  if (hasEslint.length > 0) score += 20;
  if (hasPrettier.length > 0) score += 15;
  if (hasTypeScript.length > 0) score += 25;

  // Check for strict mode in tsconfig
  if (hasTypeScript.length > 0) {
    try {
      const tsconfig = await readFile(`${cwd}/tsconfig.json`, 'utf-8');
      const config = JSON.parse(tsconfig);

      if (config.compilerOptions?.strict) score += 10;
      if (config.compilerOptions?.noImplicitAny) score += 5;
      if (config.compilerOptions?.strictNullChecks) score += 5;
    } catch {
      // Ignore parse errors
    }
  }

  if (hasEslint.length === 0) {
    issues.push({
      id: 'lint-no-eslint',
      severity: 'medium',
      category: 'linting',
      title: 'No ESLint configuration found',
      description: 'ESLint helps catch code quality issues and enforces consistent style',
      suggestion: 'Run: npx eslint --init or create .eslintrc.json',
      effort: '15min',
      autoFixable: true,
    });
  }

  if (hasPrettier.length === 0) {
    issues.push({
      id: 'lint-no-prettier',
      severity: 'low',
      category: 'linting',
      title: 'No Prettier configuration found',
      description: 'Prettier ensures consistent code formatting across the project',
      suggestion: 'Run: npx prettier --init or create .prettierrc.json',
      effort: '5min',
      autoFixable: true,
    });
  }

  return { score: Math.min(100, score), issues };
}

// ============================================================================
// COMPLEXITY ANALYSIS
// ============================================================================

interface ComplexityResult {
  score: number;
  issues: QualityIssue[];
}

async function analyzeComplexity(cwd: string): Promise<ComplexityResult> {
  const tsFiles = await glob('**/*.{ts,tsx}', {
    cwd,
    ignore: ['**/node_modules/**', '**/*.d.ts', '**/dist/**'],
  });

  const issues: QualityIssue[] = [];
  let totalComplexity = 0;
  let fileCount = 0;

  for (const file of tsFiles.slice(0, 30)) {
    try {
      const content = await readFile(`${cwd}/${file}`, 'utf-8');

      // Simple cyclomatic complexity estimation
      const functions = content.match(/function\s+\w+|=>\s*{/g) || [];
      const conditionals = (content.match(/\bif\b|\belse\b|\bswitch\b|\bcase\b|\bfor\b|\bwhile\b|\bcatch\b/g) || []).length;

      const fileComplexity = Math.max(1, functions.length * 2 + conditionals);
      totalComplexity += fileComplexity;
      fileCount++;

      // Flag high complexity files
      if (fileComplexity > 20) {
        issues.push({
          id: `complex-${file}`,
          severity: fileComplexity > 40 ? 'high' : 'medium',
          category: 'complexity',
          title: `High complexity in ${file}`,
          description: `Estimated cyclomatic complexity: ${fileComplexity}`,
          file,
          suggestion: 'Consider breaking down into smaller functions or extracting complex logic',
          effort: '1hour',
          autoFixable: false,
        });
      }
    } catch {
      // Skip unreadable files
    }
  }

  // Score: lower complexity = higher score
  const avgComplexity = fileCount > 0 ? totalComplexity / fileCount : 0;
  const score = Math.max(0, Math.min(100, 100 - (avgComplexity - 5) * 2));

  return { score, issues };
}

// ============================================================================
// TEST COVERAGE ESTIMATION
// ============================================================================

async function estimateTestCoverage(cwd: string): Promise<number> {
  const sourceFiles = await glob('**/*.{ts,tsx}', {
    cwd,
    ignore: ['**/node_modules/**', '**/*.d.ts', '**/dist/**', '**/*.test.ts', '**/*.spec.ts'],
  });

  const testFiles = await glob('**/*.{test,spec}.{ts,tsx}', {
    cwd,
    ignore: ['**/node_modules/**'],
  });

  // Check for test framework
  const hasJest = await glob('jest.config.*', { cwd });
  const hasVitest = await glob('vitest.config.*', { cwd });
  const hasMocha = await glob('{mocha,nyc}*.{js,json,yaml,yml}', { cwd });

  const hasTestFramework = hasJest.length > 0 || hasVitest.length > 0 || hasMocha.length > 0;

  if (!hasTestFramework) {
    return 0;
  }

  // Simple coverage estimation based on test/source ratio
  const ratio = testFiles.length / Math.max(1, sourceFiles.length);

  // Expected ratio varies by project size
  // Small: 0.5, Medium: 0.3, Large: 0.2
  const expectedRatio = sourceFiles.length < 20 ? 0.5 : sourceFiles.length < 100 ? 0.3 : 0.2;

  if (ratio >= expectedRatio) {
    return Math.min(90, 60 + ratio * 30);
  }

  return Math.max(0, Math.round(ratio * 100));
}

// ============================================================================
// OVERALL CALCULATION
// ============================================================================

function calculateOverallQuality(
  typeSafety: number,
  testCoverage: number,
  lintingScore: number,
  complexityScore: number
): number {
  // Weighted average: type safety is most important
  const weights = {
    typeSafety: 0.35,
    testCoverage: 0.30,
    lintingScore: 0.20,
    complexityScore: 0.15,
  };

  return Math.round(
    typeSafety * weights.typeSafety +
    testCoverage * weights.testCoverage +
    lintingScore * weights.lintingScore +
    complexityScore * weights.complexityScore
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export * from './types';
