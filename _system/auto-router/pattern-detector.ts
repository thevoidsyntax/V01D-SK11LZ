/**
 * AUTO-ROUTE v6.0 - Pattern Detector
 *
 * Focused module for code pattern detection
 * Extracted from detector.ts to reduce god class complexity
 */

import { glob } from 'glob';

// ============================================================================
// PATTERN DETECTION
// ============================================================================

/**
 * Detect code patterns in project
 * Optimized: parallel glob() calls using Promise.all()
 */
export async function detectPatterns(cwd: string): Promise<string[]> {
  // Run all glob patterns in parallel for better performance
  const [dddResults, cleanResults, microservicesResults, monorepoResults] = await Promise.all([
    glob('**/domain/**/*.ts', { cwd, ignore: ['**/node_modules/**'] }),
    glob('**/{application,domain,infrastructure}/**', { cwd, ignore: ['**/node_modules/**'] }),
    glob('**/services/**/package.json', { cwd }),
    glob('**/packages/**/package.json', { cwd })
  ]);

  const patterns: string[] = [];

  // Check for DDD structure
  if (dddResults.length > 0) patterns.push('ddd');

  // Check for Clean Architecture
  if (cleanResults.length > 5) patterns.push('clean-architecture');

  // Check for microservices
  if (microservicesResults.length > 1) patterns.push('microservices');

  // Check for monorepo
  if (monorepoResults.length > 0) patterns.push('monorepo');

  return patterns;
}
