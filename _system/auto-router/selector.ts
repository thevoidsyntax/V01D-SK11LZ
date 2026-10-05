/**
 * AUTO-ROUTE v6.0 - Ultimate Skill Selector
 *
 * Features:
 * - Keyword-based selection
 * - Context-aware recommendations
 * - Dependency resolution
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { detectSkillsFromInput, type KeywordMatch } from './detector';

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
}

export interface Recommendation {
  skill: string;
  title: string;
  description: string;
  score: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DependencyNode {
  skill: string;
  dependencies: string[];
  dependents: string[];
  loadOrder: number;
}

interface DetectionContext {
  projectPath: string;
  techStack: {
    frameworks: string[];
    databases: string[];
    languages: string[];
    devops: string[];
  };
  currentPhase?: number;
  scale: string;
  existingSkills: string[];
}

// Score weights
const SCORE_WEIGHTS = {
  CORE: 50,
  KEYWORD: 30,
  TECH_MATCH: 25,
  PHASE_MATCH: 30,
  SCALE_MATCH: 15,
  DEPENDENCY_RESOLVED: 10,
  PREVIOUS_INVOCATION: 10,
};

// Core skills that always invoke
const CORE_SKILLS = [
  'git',
  'docker',
  'ci-cd',
  'code-quality',
  'deployment',
  'logging',
  'config',
  'security',
];

export function selectSkills(
  context: DetectionContext,
  userInput?: string,
  options?: { includeSkills?: string[]; excludeSkills?: string[] }
): SelectionResult {
  // Discover skills
  const allSkills = discoverSkills();

  // Get keyword matches from user input
  const keywordMatches = userInput ? detectSkillsFromInput(userInput) : [];

  // Calculate scores
  const scored = allSkills.map(skill => {
    const score = calculateScore(skill, context, keywordMatches);
    const reasons = getReasons(skill, context, keywordMatches);
    return { skill, score, reasons };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Separate by category
  const core = scored
    .filter(s => CORE_SKILLS.includes(s.skill.name.toLowerCase()) || s.skill.priority === 'critical')
    .map(s => s.skill);

  const keywordMatched = scored
    .filter(s => keywordMatches.some(k => k.skill === s.skill.name) && s.score >= 30)
    .map(s => s.skill);

  const context_ = scored
    .filter(s =>
      !CORE_SKILLS.includes(s.skill.name.toLowerCase()) &&
      s.score >= 30 &&
      s.score < 50 &&
      !keywordMatched.includes(s.skill)
    )
    .map(s => s.skill);

  const optional = scored
    .filter(s =>
      s.score >= 20 &&
      s.score < 30 &&
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
  let selected = [...core, ...keywordMatched, ...context_, ...optional];

  if (options?.excludeSkills?.length) {
    selected = selected.filter(s => !options.excludeSkills!.includes(s.name));
  }

  if (options?.includeSkills?.length) {
    const additional = allSkills.filter(s => options.includeSkills!.includes(s.name));
    selected.push(...additional);
  }

  // Resolve dependencies
  const dependencies = resolveDependencies(selected.map(s => s.name), allSkills);

  // Generate recommendations
  const recommendations = scored
    .filter(s => s.score >= 30 && s.score < 50)
    .slice(0, 5)
    .map(s => ({
      skill: s.skill.name,
      title: s.skill.name.replace(/-/g, ' '),
      description: s.skill.description,
      score: s.score,
      reason: s.reasons.join(', '),
      priority: s.score >= 45 ? 'high' : s.score >= 35 ? 'medium' : 'low',
    }));

  return {
    core,
    context: context_,
    optional,
    skipped,
    keywordMatched,
    recommendations,
    dependencies,
  };
}

function discoverSkills(): Skill[] {
  const skillsDir = join(process.env.HOME || process.env.USERPROFILE || '', '.claude', 'skills');
  const skills: Skill[] = [];

  if (!existsSync(skillsDir)) return skills;

  const categories = readdirSync(skillsDir, { withFileTypes: true });

  for (const category of categories) {
    if (!category.isDirectory()) continue;
    if (category.name.startsWith('.')) continue;
    if (category.name.startsWith('_')) continue;

    const categoryPath = join(skillsDir, category.name);
    const entries = readdirSync(categoryPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillPath = join(categoryPath, entry.name);
      const skillFiles = ['SKILL.md', 'skill.md'];

      for (const skillFile of skillFiles) {
        const fullPath = join(skillPath, skillFile);
        if (existsSync(fullPath)) {
          try {
            const skill = parseSkillMetadata(fullPath, category.name);
            skills.push(skill);
          } catch {
            // Skip invalid skills
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

    // Parse auto_invoke
    if (yaml.includes('auto_invoke:')) {
      const autoInvokeMatch = yaml.match(/auto_invoke:\s*\n([\s\S]*?)(?=\n\w|\n---|$)/);
      if (autoInvokeMatch) {
        result.auto_invoke = {
          enabled: !autoInvokeMatch[1].includes('enabled: false'),
        };
      }
    }
  }

  return {
    name: result.name || skillFile.split(/[/\\]/).slice(-2, -1)[0],
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
      return trimmed.substring(0, 100);
    }
  }
  return '';
}

function calculateScore(
  skill: Skill,
  context: DetectionContext,
  keywordMatches: KeywordMatch[]
): number {
  let score = 0;

  // Core skill bonus
  if (CORE_SKILLS.includes(skill.name.toLowerCase())) {
    score += SCORE_WEIGHTS.CORE;
  }

  // Keyword match
  const keywordMatch = keywordMatches.find(k => k.skill === skill.name);
  if (keywordMatch) {
    score += SCORE_WEIGHTS.KEYWORD + keywordMatch.score;
  }

  // Tech stack match
  if (skill.tech_stack) {
    const { frameworks, databases, languages, services } = skill.tech_stack;

    if (frameworks?.some(f => context.techStack.frameworks.includes(f))) {
      score += SCORE_WEIGHTS.TECH_MATCH;
    }

    if (databases?.some(d => context.techStack.databases.includes(d))) {
      score += SCORE_WEIGHTS.TECH_MATCH;
    }

    if (languages?.some(l => context.techStack.languages.includes(l))) {
      score += SCORE_WEIGHTS.TECH_MATCH - 5;
    }

    if (services?.some(s => context.techStack.devops.includes(s))) {
      score += SCORE_WEIGHTS.TECH_MATCH;
    }
  }

  // Phase match
  if (context.currentPhase && skill.phase !== 'any') {
    const phases = Array.isArray(skill.phase) ? skill.phase : [skill.phase];
    if (phases.some(p => p === `phase-${context.currentPhase}` || p === String(context.currentPhase))) {
      score += SCORE_WEIGHTS.PHASE_MATCH;
    }
  }

  // Scale match
  if (skill.scale?.includes(context.scale)) {
    score += SCORE_WEIGHTS.SCALE_MATCH;
  }

  // Previous invocation
  if (context.existingSkills.includes(skill.name)) {
    score += SCORE_WEIGHTS.PREVIOUS_INVOCATION;
  }

  return score;
}

function getReasons(
  skill: Skill,
  context: DetectionContext,
  keywordMatches: KeywordMatch[]
): string[] {
  const reasons: string[] = [];

  // Core skill
  if (CORE_SKILLS.includes(skill.name.toLowerCase())) {
    reasons.push('Core skill');
  }

  // Keyword match
  const keywordMatch = keywordMatches.find(k => k.skill === skill.name);
  if (keywordMatch) {
    reasons.push(`Keywords: ${keywordMatch.matchedPhrases.join(', ')}`);
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

function resolveDependencies(
  skillNames: string[],
  allSkills: Skill[]
): DependencyNode[] {
  const skillMap = new Map(allSkills.map(s => [s.name, s]));
  const resolved: DependencyNode[] = [];
  const visiting = new Set<string>();
  const resolvedSet = new Set<string>();

  function visit(skillName: string): void {
    if (resolvedSet.has(skillName)) return;
    if (visiting.has(skillName)) {
      console.warn(`Cyclic dependency detected: ${skillName}`);
      return;
    }

    visiting.add(skillName);

    const skill = skillMap.get(skillName);
    if (skill?.dependencies) {
      for (const dep of skill.dependencies) {
        if (skillNames.includes(dep) && !resolvedSet.has(dep)) {
          visit(dep);
        }
      }
    }

    visiting.delete(skillName);
    resolvedSet.add(skillName);

    const dependents = skillNames.filter(s => {
      const s2 = skillMap.get(s);
      return s2?.dependencies?.includes(skillName);
    });

    resolved.push({
      skill: skillName,
      dependencies: skill?.dependencies?.filter(d => skillNames.includes(d)) || [],
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
  lines.push('║                     🎯 SKILL SELECTION RESULTS                            ║');
  lines.push('╚════════════════════════════════════════════════════════════════════════════╝');

  // Core skills
  if (result.core.length > 0) {
    lines.push('║');
    lines.push('║  🟢 CORE SKILLS (Auto-activated):');
    for (const skill of result.core) {
      lines.push(`║    ✅ /${skill.name.padEnd(20)} - ${skill.description.substring(0, 40)}`);
    }
  }

  // Keyword matched
  if (result.keywordMatched.length > 0) {
    lines.push('║');
    lines.push('║  🔵 KEYWORD-MATCHED (Auto-invoked):');
    for (const skill of result.keywordMatched) {
      lines.push(`║    ✅ /${skill.name.padEnd(20)} - ${skill.description.substring(0, 40)}`);
    }
  }

  // Context skills
  if (result.context.length > 0) {
    lines.push('║');
    lines.push('║  🟡 CONTEXT SKILLS (Recommended):');
    for (const skill of result.context.slice(0, 5)) {
      lines.push(`║    📋 /${skill.name.padEnd(20)} - ${skill.description.substring(0, 40)}`);
    }
  }

  // Optional
  if (result.optional.length > 0) {
    lines.push('║');
    lines.push('║  ⚪ OPTIONAL SKILLS:');
    lines.push('║    [Select by number or "all"]');
    result.optional.slice(0, 5).forEach((skill, i) => {
      lines.push(`║    [${i + 1}] /${skill.name.padEnd(18)} - ${skill.description.substring(0, 35)}`);
    });
  }

  // Recommendations
  if (result.recommendations.length > 0) {
    lines.push('║');
    lines.push('║  💡 RECOMMENDATIONS:');
    for (const rec of result.recommendations.slice(0, 3)) {
      lines.push(`║    📌 /${rec.skill.padEnd(18)} (${rec.priority}) - ${rec.reason}`);
    }
  }

  lines.push('║');
  lines.push('╠════════════════════════════════════════════════════════════════════════════╣');
  lines.push('║');
  lines.push('║  ACTIONS:');
  lines.push('║    • Press Enter to continue with auto-selected skills');
  lines.push('║    • Type numbers to add optional skills (e.g., 1,3,5)');
  lines.push('║    • Type "all" to select all optional skills');
  lines.push('║    • Type "none" to skip optional skills');
  lines.push('║');
  lines.push('╚════════════════════════════════════════════════════════════════════════════╝');
  lines.push('```\n');

  return lines.join('\n');
}
