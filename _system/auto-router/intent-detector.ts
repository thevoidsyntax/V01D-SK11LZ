/**
 * AUTO-ROUTE v6.0 - Intent Detection Engine
 *
 * Focused module for user intent detection
 * Extracted from detector.ts to reduce god class complexity
 */

// ============================================================================
// INTENT PATTERNS
// ============================================================================

interface IntentConfig {
  patterns: string[];
}

export const INTENT_PATTERNS: Record<string, IntentConfig> = {
  CREATE: {
    patterns: ['create', 'add', 'new', 'build', 'implement', 'generate', 'setup']
  },
  READ: {
    patterns: ['read', 'get', 'fetch', 'retrieve', 'show', 'list', 'display']
  },
  UPDATE: {
    patterns: ['update', 'modify', 'change', 'edit', 'refactor', 'improve']
  },
  DELETE: {
    patterns: ['delete', 'remove', 'drop', 'uninstall', 'cleanup']
  },
  DEBUG: {
    patterns: ['debug', 'fix', 'bug', 'error', 'issue', 'problem', 'crash']
  },
  ANALYZE: {
    patterns: ['analyze', 'audit', 'review', 'check', 'validate', 'test']
  },
  DEPLOY: {
    patterns: ['deploy', 'release', 'publish', 'push', 'ship', 'launch']
  },
  CONFIGURE: {
    patterns: ['config', 'setup', 'configure', 'install', 'init', 'initialize']
  }
};

// ============================================================================
// INTENT DETECTION
// ============================================================================

/**
 * Detect user intent from input
 */
export function detectIntent(input: string): string[] {
  const detected: string[] = [];

  for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
    if (config.patterns.some(p => input.includes(p))) {
      detected.push(intent);
    }
  }

  return detected;
}

/**
 * Detect user intent from input (returns single intent string)
 */
export function detectIntentSimple(input: string): string {
  const intents = detectIntent(input);
  return intents[0] || 'EXPLORE';
}
