/**
 * AUTO-ROUTER v10.0 - Tech Debt Analyzer Module
 *
 * Analyzes technical debt including outdated packages,
 * deprecated API usage, and security vulnerabilities.
 */

import { existsSync, readFile } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';
import type {
  TechDebtAnalysis,
  PackageIssue,
  DeprecatedAPI,
  Vulnerability,
  SeverityLevel,
} from './types';

// ============================================================================
// TECH DEBT ANALYSIS
// ============================================================================

export interface TechDebtInput {
  cwd: string;
  packageJson?: Record<string, unknown>;
  checkNpm?: boolean;
}

export async function analyzeTechDebt(input: TechDebtInput): Promise<TechDebtAnalysis> {
  const { cwd, packageJson } = input;

  const [outdatedPackages, deprecatedAPIs, vulnerabilities] = await Promise.all([
    analyzeOutdatedPackages(cwd, packageJson),
    analyzeDeprecatedAPIs(cwd),
    analyzeVulnerabilities(cwd, packageJson),
  ]);

  const totalDebtScore = calculateDebtScore(outdatedPackages, deprecatedAPIs, vulnerabilities);
  const estimatedFixTime = estimateFixTime(outdatedPackages, vulnerabilities);

  return {
    outdatedPackages,
    deprecatedAPIs,
    securityVulnerabilities: vulnerabilities,
    totalDebtScore,
    estimatedFixTime,
  };
}

// ============================================================================
// OUTDATED PACKAGES ANALYSIS
// ============================================================================

async function analyzeOutdatedPackages(
  cwd: string,
  packageJson?: Record<string, unknown>
): Promise<PackageIssue[]> {
  const issues: PackageIssue[] = [];

  if (!packageJson) {
    try {
      const content = await readFile(join(cwd, 'package.json'), 'utf-8');
      packageJson = JSON.parse(content);
    } catch {
      return issues;
    }
  }

  const deps = {
    ...(packageJson.dependencies as Record<string, string> || {}),
    ...(packageJson.devDependencies as Record<string, string> || {}),
  };

  // Known outdated patterns to check
  const KNOWN_OUTDATED: Record<string, { minVersion: string; reason: string }> = {
    'react': { minVersion: '18.0.0', reason: 'React 18 has major improvements' },
    'react-dom': { minVersion: '18.0.0', reason: 'React 18 has major improvements' },
    'next': { minVersion: '14.0.0', reason: 'Next.js 14 has App Router improvements' },
    'typescript': { minVersion: '5.0.0', reason: 'TypeScript 5 has better performance' },
    'eslint': { minVersion: '8.0.0', reason: 'ESLint 8+ has flat config support' },
    'jest': { minVersion: '29.0.0', reason: 'Jest 29+ has better TypeScript support' },
    'webpack': { minVersion: '5.0.0', reason: 'Webpack 5 has better tree-shaking' },
    'axios': { minVersion: '1.0.0', reason: 'Axios 1.0 has interceptors improvements' },
    'mongoose': { minVersion: '7.0.0', reason: 'Mongoose 7 has async iterators' },
    'prisma': { minVersion: '5.0.0', reason: 'Prisma 5 has better performance' },
    '@nestjs/core': { minVersion: '10.0.0', reason: 'NestJS 10 has standalone apps' },
    'express': { minVersion: '4.18.0', reason: 'Express 4.18 has better error handling' },
  };

  for (const [name, version] of Object.entries(deps)) {
    const known = KNOWN_OUTDATED[name];
    if (known) {
      const currentMajor = parseInt(version.replace(/[\^~>=<]/g, '').split('.')[0] || '0');
      const minMajor = parseInt(known.minVersion.split('.')[0]);

      if (currentMajor < minMajor) {
        issues.push({
          name,
          currentVersion: version,
          latestVersion: known.minVersion,
          severity: currentMajor < minMajor - 1 ? 'high' : 'medium',
          breakingChange: true,
          updateCommand: `npm install ${name}@${known.minVersion}`,
        });
      }
    }
  }

  return issues;
}

// ============================================================================
// DEPRECATED API DETECTION
// ============================================================================

async function analyzeDeprecatedAPIs(cwd: string): Promise<DeprecatedAPI[]> {
  const issues: DeprecatedAPI[] = [];

  const DEPRECATED_PATTERNS: Array<{
    pattern: RegExp;
    replacement: string;
    severity: SeverityLevel;
    message: string;
  }> = [
    // React deprecated
    { pattern: /React\.createClass/g, replacement: 'class extends React.Component', severity: 'high', message: 'React.createClass is deprecated' },
    { pattern: /componentWillMount/g, replacement: 'componentDidMount', severity: 'high', message: 'componentWillMount is deprecated in React 17' },
    { pattern: /componentWillReceiveProps/g, replacement: 'getDerivedStateFromProps', severity: 'high', message: 'componentWillReceiveProps is deprecated' },
    { pattern: /componentWillUpdate/g, replacement: 'componentDidUpdate', severity: 'high', message: 'componentWillUpdate is deprecated' },
    { pattern: /UNSAFE_componentWillMount/g, replacement: 'componentDidMount', severity: 'medium', message: 'UNSAFE_componentWillMount will be removed' },

    // JavaScript deprecated
    { pattern: /__dirname/g, replacement: 'import.meta.url', severity: 'medium', message: '__dirname is deprecated in ESM' },
    { pattern: /__filename/g, replacement: 'import.meta.url', severity: 'medium', message: '__filename is deprecated in ESM' },
    { pattern: /\beval\(/g, replacement: 'use Function constructor or sandbox', severity: 'high', message: 'eval() is dangerous and deprecated' },
    { pattern: /with\s*\(/g, replacement: 'avoid with statement', severity: 'medium', message: 'with statement is deprecated' },

    // Node.js deprecated
    { pattern: /new Buffer\(/g, replacement: 'Buffer.from()', severity: 'high', message: 'new Buffer() is deprecated in Node.js' },
    { pattern: /process\.env\.\w+\s*\|\|\s*['"]/g, replacement: 'nullish coalescing ??', severity: 'low', message: 'Consider using ?? instead of || for env vars' },

    // TypeScript deprecated
    { pattern: /namespace\s+\w+/g, replacement: 'ES modules', severity: 'low', message: 'namespace is deprecated in TypeScript 5' },
    { pattern: /import \* as .+ from/g, replacement: 'named imports', severity: 'low', message: 'Consider named imports for tree-shaking' },
  ];

  const tsFiles = await glob('**/*.{ts,tsx,js,jsx}', {
    cwd,
    ignore: ['**/node_modules/**', '**/dist/**'],
  });

  for (const file of tsFiles.slice(0, 50)) {
    try {
      const content = await readFile(join(cwd, file), 'utf-8');
      const lines = content.split('\n');

      for (const { pattern, replacement, severity, message } of DEPRECATED_PATTERNS) {
        const matches = content.match(new RegExp(pattern, 'g'));
        if (matches) {
          lines.forEach((line, idx) => {
            if (pattern.test(line)) {
              issues.push({
                file,
                line: idx + 1,
                deprecatedItem: message,
                replacement,
                urgency: severity,
              });
            }
          });
        }
      }
    } catch {
      // Skip unreadable files
    }
  }

  return issues;
}

// ============================================================================
// VULNERABILITY DETECTION
// ============================================================================

async function analyzeVulnerabilities(
  cwd: string,
  packageJson?: Record<string, unknown>
): Promise<Vulnerability[]> {
  const vulnerabilities: Vulnerability[] = [];

  if (!packageJson) {
    try {
      const content = await readFile(join(cwd, 'package.json'), 'utf-8');
      packageJson = JSON.parse(content);
    } catch {
      return vulnerabilities;
    }
  }

  const KNOWN_VULNERABLE: Record<string, Array<{ severity: SeverityLevel; title: string; description: string }>> = {
    'serialize-javascript': [
      { severity: 'critical', title: 'Remote Code Execution', description: 'Allows remote code execution through serialized JavaScript' },
    ],
    'lodash': [
      { severity: 'high', title: 'Prototype Pollution', description: 'Vulnerable to prototype pollution attacks' },
    ],
    'axios': [
      { severity: 'high', title: 'SSRF Vulnerability', description: 'axios < 0.21.1 is vulnerable to SSRF' },
    ],
    'minimist': [
      { severity: 'high', title: 'Prototype Pollution', description: 'Vulnerable to prototype pollution in older versions' },
    ],
    'node-fetch': [
      { severity: 'medium', title: 'Redirect Injection', description: 'Vulnerable to redirect injection in older versions' },
    ],
  };

  const deps = {
    ...(packageJson.dependencies as Record<string, string> || {}),
    ...(packageJson.devDependencies as Record<string, string> || {}),
  };

  for (const [name, version] of Object.entries(deps)) {
    const known = KNOWN_VULNERABLE[name];
    if (known) {
      const versionNum = parseFloat(version.replace(/[\^~>=<]/g, '').split('.')[0] || '0');

      for (const vuln of known) {
        // Simplified check - in real implementation would use npm audit or similar
        vulnerabilities.push({
          id: `vuln-${name}-${vuln.title.toLowerCase().replace(/\s+/g, '-')}`,
          package: name,
          severity: vuln.severity,
          title: vuln.title,
          description: vuln.description,
          fixCommand: `npm audit fix --package=${name}`,
        });
      }
    }
  }

  return vulnerabilities;
}

// ============================================================================
// DEBT SCORE CALCULATION
// ============================================================================

function calculateDebtScore(
  outdatedPackages: PackageIssue[],
  deprecatedAPIs: DeprecatedAPI[],
  vulnerabilities: Vulnerability[]
): number {
  const severityWeights: Record<SeverityLevel, number> = {
    critical: 30,
    high: 20,
    medium: 10,
    low: 5,
    info: 1,
  };

  let totalPenalty = 0;

  for (const pkg of outdatedPackages) {
    totalPenalty += severityWeights[pkg.severity];
  }

  for (const api of deprecatedAPIs) {
    totalPenalty += severityWeights[api.urgency];
  }

  for (const vuln of vulnerabilities) {
    totalPenalty += severityWeights[vuln.severity];
  }

  return Math.min(100, totalPenalty);
}

function estimateFixTime(
  outdatedPackages: PackageIssue[],
  vulnerabilities: Vulnerability[]
): string {
  const totalItems = outdatedPackages.length + vulnerabilities.length;

  if (totalItems === 0) return '0 minutes';
  if (totalItems <= 3) return '15-30 minutes';
  if (totalItems <= 10) return '1-2 hours';
  if (totalItems <= 25) return 'Half day';
  return '1-2 days';
}

// ============================================================================
// EXPORTS
// ============================================================================

export * from './types';
