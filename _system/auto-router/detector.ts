/**
 * AUTO-ROUTE v6.0 - Project Intelligence Detector
 *
 * Main orchestrator module that combines:
 * - Keyword detection (keyword-engine.ts)
 * - Intent detection (intent-detector.ts)
 * - Tech stack scanning (tech-scanner.ts)
 * - Pattern detection (pattern-detector.ts)
 *
 * This module was refactored from 722 lines to reduce god class complexity.
 */

import { glob } from 'glob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

// Re-export types for backward compatibility
export type { TechStack, PhaseInfo, DetectionResult, KeywordMatch, UserPreference } from './types';
export type { } from './types';

// Import from extracted modules
export { detectSkillsFromInput, getKeywordRecommendations, KEYWORD_MAP } from './keyword-engine';
export { detectIntent, detectIntentSimple, INTENT_PATTERNS } from './intent-detector';
export { detectTechStack } from './tech-scanner';
export { detectPatterns } from './pattern-detector';

// Import types
import type { TechStack, PhaseInfo, DetectionResult, KeywordMatch, UserPreference } from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

const STATE_DIR = join(process.env.HOME || process.env.USERPROFILE || '', '.claude', 'auto-router');
const STATE_FILE = join(STATE_DIR, 'projects.json');

// ============================================================================
// MAIN DETECTION FUNCTION
// ============================================================================

export async function detectProject(cwd: string): Promise<DetectionResult> {
  const [
    hasGit,
    packageJsonFiles,
    claudeMdPath,
    dockerFiles,
    ciFiles,
  ] = await Promise.all([
    checkGit(cwd),
    glob('**/package.json', { cwd, ignore: ['**/node_modules/**'] }),
    checkFile(join(cwd, 'CLAUDE.md')),
    glob('**/{Dockerfile,docker-compose.yml}', { cwd }),
    glob('**/.github/workflows/*.yml', { cwd }),
  ]);

  const isNew = !hasGit && packageJsonFiles.length === 0;

  // Parse package.json
  let packageData: Record<string, unknown> | null = null;
  let packageManager: string | undefined;

  if (packageJsonFiles.length > 0) {
    try {
      const content = await readFile(packageJsonFiles[0], 'utf-8');
      packageData = JSON.parse(content);
      packageManager = detectPackageManager(packageJsonFiles[0]);
    } catch (err) {
      console.warn(`[detector] Failed to parse package.json:`, err instanceof Error ? err.message : err);
    }
  }

  // Use extracted detection modules
  const { detectTechStack } = await import('./tech-scanner');
  const { detectPatterns } = await import('./pattern-detector');

  const techStack = detectTechStack(packageData, cwd);
  const scale = estimateScale(packageData, dockerFiles.length, ciFiles.length);
  const phase = claudeMdPath ? parsePhaseFromClaudeMd(claudeMdPath) : undefined;
  const detectedPatterns = await detectPatterns(cwd);

  const projectName = packageData?.name as string ||
    cwd.split(/[/\\]/).pop() ||
    'unknown';

  return {
    isNew,
    cwd,
    projectName,
    techStack,
    scale,
    phase,
    hasGit,
    hasCLAUDEmd: !!claudeMdPath,
    hasPackageJson: packageJsonFiles.length > 0,
    missingFiles: [],
    packageManager,
    detectedPatterns
  };
}

// ============================================================================
// STATE PERSISTENCE
// ============================================================================

export async function loadProjectState(projectPath: string): Promise<{
  projectName: string;
  path: string;
  scale: string;
  currentPhase?: number;
  activeSkills: string[];
  lastAnalyzed: string;
  history: { date: string; action: string; result: string }[];
  preferences: UserPreference[];
} | null> {
  try {
    if (!existsSync(STATE_FILE)) return null;

    const content = await readFile(STATE_FILE, 'utf-8');
    const allStates = JSON.parse(content);

    return allStates[projectPath] || null;
  } catch (err) {
    console.warn(`[detector] Failed to load project state from ${STATE_FILE}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

export async function saveProjectState(state: Record<string, unknown>): Promise<void> {
  try {
    if (!existsSync(STATE_DIR)) {
      await mkdir(STATE_DIR, { recursive: true });
    }

    let allStates: Record<string, unknown> = {};

    if (existsSync(STATE_FILE)) {
      try {
        const content = await readFile(STATE_FILE, 'utf-8');
        allStates = JSON.parse(content);
      } catch {
        // Start fresh
      }
    }

    allStates[state.path as string] = {
      ...state,
      lastAnalyzed: new Date().toISOString(),
    };

    // Atomic write using rename: write to temp file first, then atomic rename
    const tempFile = `${STATE_FILE}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;
    const newContent = JSON.stringify(allStates, null, 2);

    await writeFile(tempFile, newContent, 'utf-8');

    try {
      const { rename } = await import('fs/promises');
      await rename(tempFile, STATE_FILE);
    } catch (err) {
      console.warn(`[detector] Atomic rename failed, falling back:`, err instanceof Error ? err.message : err);
      await writeFile(STATE_FILE, newContent, 'utf-8');
      try {
        const { unlink } = await import('fs/promises');
        await unlink(tempFile);
      } catch {
        // Ignore cleanup
      }
    }
  } catch (error) {
    console.error('[detector] Failed to save project state:', error);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function checkGit(cwd: string): Promise<boolean> {
  return existsSync(join(cwd, '.git'));
}

async function checkFile(path: string): Promise<string | null> {
  try {
    await readFile(path, 'utf-8');
    return path;
  } catch {
    return null;
  }
}

function detectPackageManager(packageJsonPath: string): string {
  const dir = join(packageJsonPath, '..');

  if (existsSync(join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(dir, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(dir, 'bun.lockb'))) return 'bun';
  return 'npm';
}

function estimateScale(
  packageData: Record<string, unknown> | null,
  dockerFiles: number,
  ciFiles: number
): 'mvp' | 'small' | 'medium' | 'large' | 'enterprise' {
  if (!packageData) return 'mvp';

  const deps = {
    ...(packageData.dependencies as Record<string, string> || {}),
    ...(packageData.devDependencies as Record<string, string> || {}),
  };
  const depCount = Object.keys(deps).length;

  if (depCount > 100 || ciFiles > 5 || dockerFiles > 3) return 'enterprise';
  if (depCount > 50 || ciFiles > 2 || dockerFiles > 1) return 'large';
  if (depCount > 20) return 'medium';
  if (depCount > 5) return 'small';
  return 'mvp';
}

function parsePhaseFromClaudeMd(claudeMdPath: string): PhaseInfo | undefined {
  try {
    const content = readFileSync(claudeMdPath, 'utf-8');
    const phaseMatch = content.match(/##\s+Phase\s+(\d+)/i);

    if (phaseMatch) {
      return {
        current: `Phase ${phaseMatch[1]}`,
        number: parseInt(phaseMatch[1], 10),
        total: 5,
        status: 'in-progress',
        requiredSkills: [],
        completedSkills: []
      };
    }
  } catch {
    // Ignore
  }
  return undefined;
}
