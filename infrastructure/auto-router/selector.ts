/**
 * AUTO-ROUTE v6.0 - Optimized Skill Selector
 *
 * Optimizations:
 * - Enhanced scoring with multiple factors
 * - Context-aware recommendations
 * - User preference learning
 * - Better dependency resolution
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { detectSkillsFromInput, type KeywordMatch } from './keyword-engine';

export interface Skill {
  name: string;
  path: string;
  description: string;
  version: string;
  category: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  phase: string | string[];
  tech_stack?: {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    services?: string[];
  };
  auto_invoke?: {
    enabled: boolean;
    conditions?: {
      has_file?: string;
      tech_stack?: string[];
      command?: string;
      phrase?: string[];
      phase?: string;
      reason?: string;
    }[];
  };
  triggers?: {
    commands?: string[];
    phrases?: string[];
    files?: string[];
  };
  dependencies?: string[];
  conflicts?: string[];
  scale?: string[];
  capabilities?: string[];
}

export interface SelectionResult {
  core: Skill[];
  context: Skill[];
  optional: Skill[];
  skipped: Skill[];
  keywordMatched: Skill[];
  recommendations: Recommendation[];
  dependencies: DependencyNode[];
  summary: {
    totalSkills: number;
    autoInvoked: number;
    recommended: number;
    confidence: 'high' | 'medium' | 'low';
  };
}

export interface Recommendation {
  skill: string;
  title: string;
  description: string;
  score: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  confidence: 'high' | 'medium' | 'low';
}

export interface DependencyNode {
  skill: string;
  dependencies: string[];
  dependents: string[];
  loadOrder: number;
}

export interface LocalSkillConfig {
  name: string;
  version: string;
  description: string;
  type: 'local';
  project: {
    name: string;
    root: string;
  };
  extends: string[];
  overrides?: {
    phase_skills?: Record<string, string[]>;
    tech_skills?: Record<string, string[]>;
    core_skills?: string[];
  };
}

export interface SkillSelectionConfig extends DetectionContext {
  localSkills?: LocalSkillConfig;
}

interface DetectionContext {
  projectPath: string;
  techStack: {
    frameworks: string[];
    databases: string[];
    languages: string[];
    devops: string[];
    cache: string[];
  };
  currentPhase?: number;
  scale: string;
  existingSkills: string[];
  patterns: string[];
  preferences?: { skill: string; useCount: number }[];
}

// Optimized score weights
const SCORE_WEIGHTS = {
  CORE: 50,           // Core skill always available
  KEYWORD_MATCH: 35,  // Keyword detected in user input
  KEYWORD_EXACT: 15,   // Exact keyword match
  TECH_MATCH: 25,      // Tech stack match
  PHASE_MATCH: 30,     // Current phase requirement
  SCALE_MATCH: 15,     // Project scale match
  DEPENDENCY_RESOLVED: 10, // Dependencies met
  PREFERENCE: 15,      // User preference/history
  CONFLICT: -50,      // Skill conflicts
};

// Score thresholds for skill categorization (exported for testing)
export const SCORE_THRESHOLDS = {
  CORE_MIN: 50,           // Minimum score for core/keyword-matched
  CONTEXT_MIN: 40,        // Minimum score for context skills
  CONTEXT_MAX: 60,       // Maximum score for context (above = core/keyword)
  OPTIONAL_MIN: 25,      // Minimum score for optional skills
  OPTIONAL_MAX: 40,      // Maximum score for optional (above = context)
  RECOMMENDATION_MIN: 30, // Minimum score for recommendations
  RECOMMENDATION_MAX: 50, // Maximum score for recommendations
  RECOMMENDATION_SLICE: 8, // Max number of recommendations to show
  PHRASE_SLICE: 3,        // Max phrases to show in reasons
  PATTERN_BOOST: 20,      // Boost for pattern matches
  TECH_MATCH_OFFSET: 5,  // Offset for language match (less weight)
};

// UI display constants
const UI_CONSTANTS = {
  DESCRIPTION_TRUNCATE: 100,  // Truncate skill descriptions
  SKILL_PAD: 18,              // Pad skill names
  SKILL_PAD_LONG: 20,        // Pad longer skill names
  REASON_TRUNCATE: 30,       // Truncate reason text
  REASON_SLICE: 4,            // Max reasons to show
  MAX_LINES: 5,              // Max context skills to show
};

// Core skills that always invoke (universal foundation)
const CORE_SKILLS = new Set([
  // Version Control & DevOps (always needed)
  'git', 'docker', 'ci-cd', 'deployment',

  // Quality & Testing (essential for any project)
  'code-quality', 'testing', 'tdd',

  // Config & Observability (foundation)
  'config', 'logging', 'observability',

  // Security (critical for any project)
  'security',

  // Backend Development (most projects need API)
  'api-design', 'database',

  // Architecture & Patterns (good practices)
  'domain-modeling', 'architecture-patterns',

  // Debugging (always helpful)
  'diagnosing-bugs',

  // Memory & Context (persistent across sessions)
  'mem-search',

  // Project Foundation (requirements & docs)
  'feature-forge',

  // Implementation & Frontend (essential for most projects)
  'implement', 'ui-ux-pro-max', 'documentation',

  // Performance & Browser Automation
  'performance', 'browser-use', 'anti-slop',

  // Code Review & Commits (daily practice)
  'pr-review', 'commit',

  // Reliability & Scalability (production readiness)
  'reliability', 'scalability',

  // Project Init & Analysis
  'project-init', 'analyze-project',
]);

// Skill categories for grouping
const SKILL_CATEGORIES: Record<string, string[]> = {
  // Security & Auth
  'security': ['security', 'pentest', 'identity', 'compliance'],

  // Database & Data
  'database': ['database', 'postgresql-pro', 'data-engineering', 'data-quality', 'messaging'],

  // API Development
  'api': ['api-design', 'api-client', 'nestjs-expert', 'graphql'],

  // Infrastructure & DevOps
  'infrastructure': ['docker', 'kubernetes', 'terraform', 'ci-cd', 'deployment', 'ansible', 'serverless'],

  // Frontend & UI
  'frontend': ['ui-ux-pro-max', 'ui-ux-pro-max-design-system', 'ui-ux-pro-max-styling'],

  // Memory & Meta
  'memory': ['mem-search'],

  // Quality & Testing
  'quality': ['testing', 'tdd', 'code-quality', 'audit', 'diagnosing-bugs'],

  // Observability
  'observability': ['logging', 'observability', 'reliability'],

  // Architecture & Patterns
  'architecture': ['architecture-patterns', 'domain-modeling', 'design-patterns', 'integration-patterns'],

  // AI/ML (Specialized)
  'ai-ml': ['rag-architect', 'llm-evaluation', 'ml-pipeline', 'langchain-architect', 'feature-forge'],

  // Languages
  'languages': ['python-pro', 'typescript-pro', 'go-pro', 'rust-pro'],

  // Process & Workflow
  'process': ['implement', 'wayfinder', 'documentation', 'anti-slop', 'handoff', 'grill-with-docs', 'writing-for-agents'],

  // GitHub Workflow
  'github': ['new-issue', 'validate-issue', 'work-on-issue', 'fix-pr-review', 'pr-review', 'commit', 'create-release', 'sync-docs'],
};

export function selectSkills(
  context: DetectionContext,
  userInput?: string,
  options?: { includeSkills?: string[]; excludeSkills?: string[] }
): SelectionResult {
  // Discover skills
  const allSkills = discoverSkills();

  // Get keyword matches from user input
  const keywordMatches = userInput ? detectSkillsFromInput(userInput) : [];

  // Calculate scores for all skills
  const scored = allSkills.map(skill => {
    const score = calculateScore(skill, context, keywordMatches);
    const reasons = getReasons(skill, context, keywordMatches);
    const confidence = getConfidence(skill, context, keywordMatches);
    return { skill, score, reasons, confidence };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Categorize skills using thresholds
  const core = scored
    .filter(s => CORE_SKILLS.has(s.skill.name.toLowerCase()) || s.skill.priority === 'critical')
    .map(s => s.skill);

  const keywordMatched = scored
    .filter(s => keywordMatches.some(k => k.skill === s.skill.name) && s.score >= SCORE_THRESHOLDS.CONTEXT_MIN)
    .map(s => s.skill);

  const context_ = scored
    .filter(s =>
      !CORE_SKILLS.has(s.skill.name.toLowerCase()) &&
      s.score >= SCORE_THRESHOLDS.CONTEXT_MIN &&
      s.score < SCORE_THRESHOLDS.CONTEXT_MAX &&
      !keywordMatched.includes(s.skill)
    )
    .map(s => s.skill);

  const optional = scored
    .filter(s =>
      s.score >= SCORE_THRESHOLDS.OPTIONAL_MIN &&
      s.score < SCORE_THRESHOLDS.OPTIONAL_MAX &&
      !core.includes(s.skill) &&
      !keywordMatched.includes(s.skill)
    )
    .map(s => s.skill);

  const skipped = allSkills.filter(
    s =>
      !core.includes(s) &&
      !keywordMatched.includes(s) &&
      !context_.includes(s) &&
      !optional.includes(s)
  );

  // Apply includes/excludes
  let selected = [...core, ...keywordMatched, ...context_];

  if (options?.excludeSkills?.length) {
    selected = selected.filter(s => !options.excludeSkills.includes(s.name));
  }

  if (options?.includeSkills?.length) {
    const additional = allSkills.filter(s => options.includeSkills.includes(s.name));
    selected.push(...additional);
  }

  // Resolve dependencies
  const dependencies = resolveDependencies(selected.map(s => s.name), allSkills);

  // Generate recommendations
  const recommendations = generateRecommendations(scored, keywordMatches);

  // Calculate summary
  const summary = {
    totalSkills: allSkills.length,
    autoInvoked: core.length + keywordMatched.length,
    recommended: context_.length + optional.length,
    confidence: calculateOverallConfidence(keywordMatches, scored)
  };

  return {
    core,
    context: context_,
    optional,
    skipped,
    keywordMatched,
    recommendations,
    dependencies,
    summary
  };
}

function calculateScore(
  skill: Skill,
  context: DetectionContext,
  keywordMatches: KeywordMatch[]
): number {
  let score = 0;

  // 1. Core skill bonus
  if (CORE_SKILLS.has(skill.name.toLowerCase())) {
    score += SCORE_WEIGHTS.CORE;
  }

  // 2. Keyword match (with boost for high confidence)
  const keywordMatch = keywordMatches.find(k => k.skill === skill.name);
  if (keywordMatch) {
    score += SCORE_WEIGHTS.KEYWORD_MATCH;
    if (keywordMatch.confidence === 'high') score += SCORE_WEIGHTS.KEYWORD_EXACT;
  }

  // 3. Tech stack match
  if (skill.tech_stack) {
    const { frameworks, databases, languages, services } = skill.tech_stack;

    if (frameworks?.some(f => context.techStack.frameworks.includes(f))) {
      score += SCORE_WEIGHTS.TECH_MATCH;
    }

    if (databases?.some(d => context.techStack.databases.includes(d))) {
      score += SCORE_WEIGHTS.TECH_MATCH;
    }

    // Languages get slightly less weight than frameworks/databases
    if (languages?.some(l => context.techStack.languages.includes(l))) {
      score += SCORE_WEIGHTS.TECH_MATCH - SCORE_THRESHOLDS.TECH_MATCH_OFFSET;
    }

    if (services?.some(s => context.techStack.devops.includes(s))) {
      score += SCORE_WEIGHTS.TECH_MATCH;
    }
  }

  // 4. Phase match
  if (context.currentPhase && skill.phase !== 'any') {
    const phases = Array.isArray(skill.phase) ? skill.phase : [skill.phase];
    if (phases.some(p =>
      p === `phase-${context.currentPhase}` ||
      p === String(context.currentPhase) ||
      p === 'any'
    )) {
      score += SCORE_WEIGHTS.PHASE_MATCH;
    }
  }

  // 5. Scale match
  if (skill.scale?.includes(context.scale)) {
    score += SCORE_WEIGHTS.SCALE_MATCH;
  }

  // 6. User preference/history
  if (context.preferences) {
    const pref = context.preferences.find(p => p.skill === skill.name);
    if (pref) {
      score += Math.min(SCORE_WEIGHTS.PREFERENCE, pref.useCount * 2);
    }
  }

  // 7. Pattern match
  if (context.patterns.length > 0) {
    // DDD pattern boost
    if (context.patterns.includes('ddd') && skill.name === 'domain-modeling') {
      score += SCORE_THRESHOLDS.PATTERN_BOOST;
    }
    // Microservices pattern boost
    if (context.patterns.includes('microservices') && skill.name === 'architecture-patterns') {
      score += SCORE_THRESHOLDS.PATTERN_BOOST;
    }
  }

  // 8. Conflict penalty (SCORE_WEIGHTS.CONFLICT is already negative)
  if (skill.conflicts) {
    for (const conflict of skill.conflicts) {
      if (context.existingSkills.includes(conflict)) {
        score += SCORE_WEIGHTS.CONFLICT;
      }
    }
  }

  return Math.max(0, score);
}

function getReasons(
  skill: Skill,
  context: DetectionContext,
  keywordMatches: KeywordMatch[]
): string[] {
  const reasons: string[] = [];

  // Core skill
  if (CORE_SKILLS.has(skill.name.toLowerCase())) {
    reasons.push('Core skill');
  }

  // Keyword match
  const keywordMatch = keywordMatches.find(k => k.skill === skill.name);
  if (keywordMatch) {
    reasons.push(`Keywords: ${keywordMatch.matchedPhrases.slice(0, SCORE_THRESHOLDS.PHRASE_SLICE).join(', ')}`);
  }

  // Tech match
  if (skill.tech_stack) {
    const matches: string[] = [];

    if (skill.tech_stack.frameworks?.some(f => context.techStack.frameworks.includes(f))) {
      matches.push(...skill.tech_stack.frameworks.filter(f => context.techStack.frameworks.includes(f)));
    }

    if (skill.tech_stack.databases?.some(d => context.techStack.databases.includes(d))) {
      matches.push(...skill.tech_stack.databases.filter(d => context.techStack.databases.includes(d)));
    }

    if (matches.length > 0) {
      reasons.push(`Tech: ${matches.join(', ')}`);
    }
  }

  // Phase match
  if (context.currentPhase && skill.phase !== 'any') {
    reasons.push(`Phase ${context.currentPhase}`);
  }

  return reasons;
}

function getConfidence(
  skill: Skill,
  context: DetectionContext,
  keywordMatches: KeywordMatch[]
): 'high' | 'medium' | 'low' {
  let factors = 0;

  if (CORE_SKILLS.has(skill.name.toLowerCase())) factors++;
  if (keywordMatches.some(k => k.skill === skill.name && k.confidence === 'high')) factors++;
  if (skill.tech_stack && Object.values(skill.tech_stack).some(v => v && v.length > 0)) factors++;
  if (context.currentPhase && skill.phase !== 'any') factors++;

  // 3+ factors = high, 2+ = medium, else low
  if (factors >= 3) return 'high';
  if (factors >= 2) return 'medium';
  return 'low';
}

function calculateOverallConfidence(
  keywordMatches: KeywordMatch[],
  scored: { score: number; confidence: string }[]
): 'high' | 'medium' | 'low' {
  const highConfidence = scored.filter(s => s.confidence === 'high').length;
  const matchedHighConfidence = keywordMatches.filter(k => k.confidence === 'high').length;

  // High if many high-confidence skills found
  if (highConfidence >= 5 || matchedHighConfidence >= 3) return 'high';
  if (highConfidence >= 2 || matchedHighConfidence >= 1) return 'medium';
  return 'low';
}

function generateRecommendations(
  scored: { skill: Skill; score: number; reasons: string[]; confidence: string }[],
  keywordMatches: KeywordMatch[]
): Recommendation[] {
  return scored
    .filter(s => s.score >= SCORE_THRESHOLDS.RECOMMENDATION_MIN && s.score < SCORE_THRESHOLDS.RECOMMENDATION_MAX)
    .slice(0, SCORE_THRESHOLDS.RECOMMENDATION_SLICE)
    .map(s => ({
      skill: s.skill.name,
      title: formatTitle(s.skill.name),
      description: s.skill.description,
      score: s.score,
      reason: s.reasons.join(' • ') || 'Suggested based on context',
      priority: s.score >= 45 ? 'high' : s.score >= 35 ? 'medium' : 'low',
      confidence: s.confidence as 'high' | 'medium' | 'low'
    }));
}

function formatTitle(skillName: string): string {
  return skillName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function getSkillsDir(): string {
  const home = process.env.HOME || process.env.USERPROFILE;
  if (!home) {
    throw new Error('HOME or USERPROFILE environment variable must be set');
  }
  return join(home, '.claude', 'skills');
}

function discoverSkills(): Skill[] {
  const skillsDir = getSkillsDir();
  const skills: Skill[] = [];
  const seenSkills = new Set<string>(); // Avoid duplicates

  if (!existsSync(skillsDir)) return skills;

  const categories = readdirSync(skillsDir, { withFileTypes: true });

  // Helper to add skill, avoiding duplicates
  const addSkill = (skill: Skill) => {
    if (!seenSkills.has(skill.name)) {
      seenSkills.add(skill.name);
      skills.push(skill);
    }
  };

  for (const category of categories) {
    if (!category.isDirectory()) continue;
    if (category.name.startsWith('.')) continue;
    if (category.name.startsWith('_')) continue;

    const categoryPath = join(skillsDir, category.name);

    // 1. Check if this root-level directory has SKILL.md (flat structure)
    const rootSkillFiles = ['SKILL.md', 'skill.md'];
    for (const skillFile of rootSkillFiles) {
      const rootSkillPath = join(categoryPath, skillFile);
      if (existsSync(rootSkillPath)) {
        try {
          const skill = parseSkillMetadata(rootSkillPath, category.name);
          addSkill(skill);
        } catch (err) {
          console.warn(`[auto-router] Skipping invalid root skill at ${rootSkillPath}:`, err instanceof Error ? err.message : err);
        }
        break;
      }
    }

    // 2. Scan subdirectories (nested structure)
    const entries = readdirSync(categoryPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillPath = join(categoryPath, entry.name);
      const skillFiles = ['SKILL.md', 'skill.md'];

      for (const skillFile of skillFiles) {
        const fullPath = join(skillPath, skillFile);
        if (existsSync(fullPath)) {
          try {
            const skill = parseSkillMetadata(fullPath, entry.name);
            addSkill(skill);
          } catch (err) {
            console.warn(`[auto-router] Skipping invalid skill at ${fullPath}:`, err instanceof Error ? err.message : err);
          }
          break;
        }
      }
    }
  }

  return skills;
}

function parseSkillMetadata(skillFile: string, category: string): Skill {
  const content = readFileSync(skillFile, 'utf-8');
  const result: Partial<Skill> = {};

  // Parse YAML frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1];

    // Extract fields
    const nameMatch = yaml.match(/^name:\s*(.+)$/m);
    const descMatch = yaml.match(/^description:\s*["']?([^"'\n]+)["']?/m);
    const versionMatch = yaml.match(/^version:\s*["']?([^"'\n]+)["']?/m);
    const priorityMatch = yaml.match(/^priority:\s*(\w+)/m);

    if (nameMatch) result.name = nameMatch[1].trim();
    if (descMatch) result.description = descMatch[1].trim();
    if (versionMatch) result.version = versionMatch[1].trim();
    if (priorityMatch) result.priority = priorityMatch[1] as Skill['priority'];

    // Parse category
    const categoryMatch = yaml.match(/^category:\s*\[?([^\]\n]+)\]?/m);
    if (categoryMatch) {
      result.category = categoryMatch[1].split(',').map(s => s.trim().replace(/[\[\]]/g, ''));
    } else {
      result.category = [category];
    }

    // Parse phase
    const phaseMatch = yaml.match(/^phase:\s*(\w+|\[[^\]]+\])/m);
    if (phaseMatch) {
      result.phase = phaseMatch[1].replace(/[\[\]]/g, '');
    }

    // Parse tech_stack
    if (yaml.includes('tech_stack:')) {
      const techMatch = yaml.match(/tech_stack:\s*\n([\s\S]*?)(?=\n\w|\n---|$)/);
      if (techMatch) {
        const techContent = techMatch[1];
        result.tech_stack = {};

        const frameworks = techContent.match(/frameworks?:\s*\[([^\]]+)\]/);
        if (frameworks) result.tech_stack.frameworks = frameworks[1].split(',').map(s => s.trim());

        const databases = techContent.match(/databases?:\s*\[([^\]]+)\]/);
        if (databases) result.tech_stack.databases = databases[1].split(',').map(s => s.trim());

        const languages = techContent.match(/languages?:\s*\[([^\]]+)\]/);
        if (languages) result.tech_stack.languages = languages[1].split(',').map(s => s.trim());

        const services = techContent.match(/services?:\s*\[([^\]]+)\]/);
        if (services) result.tech_stack.services = services[1].split(',').map(s => s.trim());
      }
    }

    // Parse triggers
    if (yaml.includes('triggers:')) {
      const triggersMatch = yaml.match(/triggers:\s*\n([\s\S]*?)(?=\n\w|\n---|$)/);
      if (triggersMatch) {
        result.triggers = {
          commands: [],
          phrases: [],
          files: []
        };

        const phraseMatches = triggersMatch[1].matchAll(/phrases?:\s*-\s*(.+)/gi);
        for (const match of phraseMatches) {
          result.triggers!.phrases!.push(match[1].trim());
        }
      }
    }

    // Parse dependencies
    if (yaml.includes('dependencies:')) {
      const depMatch = yaml.match(/dependencies:\s*\[([^\]]+)\]/);
      if (depMatch) {
        result.dependencies = depMatch[1].split(',').map(s => s.trim());
      }
    }

    // Parse conflicts
    if (yaml.includes('conflicts:')) {
      const conflictMatch = yaml.match(/conflicts:\s*\[([^\]]+)\]/);
      if (conflictMatch) {
        result.conflicts = conflictMatch[1].split(',').map(s => s.trim());
      }
    }

    // Parse scale
    if (yaml.includes('scale:')) {
      const scaleMatch = yaml.match(/scale:\s*\[([^\]]+)\]/);
      if (scaleMatch) {
        result.scale = scaleMatch[1].split(',').map(s => s.trim());
      }
    }
  }

  return {
    name: result.name || skillFile.split(/[/\\]/).at(-2) || skillFile,
    path: skillFile,
    description: result.description || extractFirstLine(content),
    version: result.version || '1.0.0',
    category: result.category || [category],
    priority: result.priority || 'medium',
    phase: result.phase || 'any',
    ...result,
  } as Skill;
}

function extractFirstLine(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
      return trimmed.substring(0, UI_CONSTANTS.DESCRIPTION_TRUNCATE);
    }
  }
  return '';
}

function resolveDependencies(
  skillNames: string[],
  allSkills: Skill[]
): DependencyNode[] {
  const skillMap = new Map(allSkills.map(s => [s.name, s]));
  const resolved: DependencyNode[] = [];
  const visiting = new Set<string>();
  const resolvedSet = new Set<string>();
  const skillNamesSet = new Set(skillNames);

  // Pre-compute dependents map to avoid O(N²) in hot path
  const dependentsMap = new Map<string, string[]>();
  for (const skill of skillNames) {
    const s = skillMap.get(skill);
    if (s?.dependencies) {
      for (const dep of s.dependencies) {
        if (!dependentsMap.has(dep)) {
          dependentsMap.set(dep, []);
        }
        dependentsMap.get(dep)!.push(skill);
      }
    }
  }

  function visit(skillName: string): void {
    if (resolvedSet.has(skillName)) return;
    // Skip gracefully on cycle (common in skill dependencies)
    if (visiting.has(skillName)) return;

    visiting.add(skillName);

    const skill = skillMap.get(skillName);
    if (skill?.dependencies) {
      for (const dep of skill.dependencies) {
        if (skillNamesSet.has(dep) && !resolvedSet.has(dep)) {
          visit(dep);
        }
      }
    }

    visiting.delete(skillName);
    resolvedSet.add(skillName);

    // Use pre-computed dependents map (O(1) lookup)
    const dependents = dependentsMap.get(skillName) || [];

    resolved.push({
      skill: skillName,
      dependencies: skill?.dependencies?.filter(d => skillNamesSet.has(d)) || [],
      dependents,
      loadOrder: resolved.length,
    });
  }

  for (const skill of skillNames) {
    if (!resolvedSet.has(skill)) {
      visit(skill);
    }
  }

  return resolved;
}

export function generateSelectionPrompt(result: SelectionResult): string {
  const lines: string[] = [];

  lines.push('\n```');
  lines.push('╔════════════════════════════════════════════════════════════════════════════╗');
  lines.push('║              🚀 AUTO-ROUTER v6.0 - SKILL SELECTION                     ║');
  lines.push('╚════════════════════════════════════════════════════════════════════════════╝');

  // Summary
  lines.push('║');
  lines.push(`║  📊 Summary: ${result.summary.totalSkills} skills available`);
  lines.push(`║     ✅ Auto-invoke: ${result.summary.autoInvoked} skills`);
  lines.push(`║     📋 Recommended: ${result.summary.recommended} skills`);
  lines.push(`║     🎯 Confidence: ${result.summary.confidence.toUpperCase()}`);

  // Core skills
  if (result.core.length > 0) {
    lines.push('║');
    lines.push('║  🟢 CORE SKILLS (Always Active):');
    for (const skill of result.core) {
      lines.push(`║     ✅ /${skill.name.padEnd(UI_CONSTANTS.SKILL_PAD_LONG)} ${skill.description.substring(0, 35)}`);
    }
  }

  // Keyword matched
  if (result.keywordMatched.length > 0) {
    lines.push('║');
    lines.push('║  🔵 KEYWORD-MATCHED (Auto-invoked):');
    for (const skill of result.keywordMatched) {
      lines.push(`║     ✅ /${skill.name.padEnd(UI_CONSTANTS.SKILL_PAD_LONG)} ${skill.description.substring(0, 35)}`);
    }
  }

  // Context skills
  if (result.context.length > 0) {
    lines.push('║');
    lines.push('║  🟡 CONTEXT SKILLS (Recommended):');
    for (const skill of result.context.slice(0, UI_CONSTANTS.MAX_LINES)) {
      lines.push(`║     📋 /${skill.name.padEnd(UI_CONSTANTS.SKILL_PAD)} ${skill.description.substring(0, 35)}`);
    }
  }

  // Recommendations
  if (result.recommendations.length > 0) {
    lines.push('║');
    lines.push('║  💡 RECOMMENDATIONS:');
    for (const rec of result.recommendations.slice(0, UI_CONSTANTS.REASON_SLICE)) {
      const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      lines.push(`║     ${priorityIcon} /${rec.skill.padEnd(UI_CONSTANTS.SKILL_PAD)} (${rec.reason.substring(0, UI_CONSTANTS.REASON_TRUNCATE)})`);
    }
  }

  lines.push('║');
  lines.push('╠════════════════════════════════════════════════════════════════════════════╣');
  lines.push('║  ACTIONS: [Enter] Continue | [1-5] Select optional | [all/none] Batch      ║');
  lines.push('╚════════════════════════════════════════════════════════════════════════════╝');
  lines.push('```\n');

  return lines.join('\n');
}
