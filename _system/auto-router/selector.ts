/**
 * AUTO-ROUTE v4.0 - Skill Selector
 *
 * Dynamic skill selection based on project detection results.
 */

import { glob } from 'glob';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import type { DetectionResult, TechStack } from './detector';

export interface Skill {
  name: string;
  path: string;
  description: string;
  category: SkillCategory;
  isCore: boolean;
  score: number;
  reasons: string[];
  dependencies: string[];
  scales: Scale[];
  triggers: string[];
  priority: 'high' | 'medium' | 'low';
}

export type SkillCategory =
  | 'backend'
  | 'frontend'
  | 'database'
  | 'devops'
  | 'security'
  | 'observability'
  | 'data'
  | 'mobile'
  | 'ml'
  | 'team'
  | 'infrastructure'
  | 'other';

export type Scale = 'mvp' | 'small' | 'medium' | 'large' | 'enterprise';

export interface SelectionResult {
  core: Skill[];
  context: Skill[];
  optional: Skill[];
  skipped: Skill[];
  dependencies: DependencyNode[];
}

export interface DependencyNode {
  skill: string;
  dependencies: string[];
  dependents: string[];
  loadOrder: number;
}

interface SkillMetadata {
  category?: string;
  core?: boolean;
  scale?: Scale[];
  triggers?: string[];
  dependencies?: string[];
  priority?: string;
  description?: string;
}

// Score weights
const SCORE_WEIGHTS = {
  CORE: 10,
  TECH_MATCH: 25,
  PHASE_MATCH: 30,
  SCALE_MATCH: 15,
  DEPENDENCY_RESOLVED: 5,
};

export async function selectSkills(
  detection: DetectionResult,
  options: { includeSkills?: string[]; excludeSkills?: string[] }
): Promise<SelectionResult> {
  // Discover all available skills
  const allSkills = await discoverSkills();

  // Calculate relevance scores
  const scored = allSkills.map(skill => ({
    skill,
    score: calculateScore(skill, detection),
    reasons: getReasons(skill, detection),
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Apply includes/excludes
  let filtered = scored;

  if (options.excludeSkills?.length) {
    filtered = filtered.filter(
      s => !options.excludeSkills!.includes(s.skill.name)
    );
  }

  if (options.includeSkills?.length) {
    // Boost included skills
    filtered = filtered.map(s => {
      if (options.includeSkills!.includes(s.skill.name)) {
        return { ...s, score: s.score + 50 };
      }
      return s;
    });
    filtered.sort((a, b) => b.score - a.score);
  }

  // Separate by category
  const core = filtered
    .filter(s => s.skill.isCore || s.score >= SCORE_WEIGHTS.CORE)
    .map(s => s.skill);

  const context = filtered
    .filter(s => !s.skill.isCore && s.score >= 20 && s.score < SCORE_WEIGHTS.CORE)
    .map(s => s.skill);

  const optional = filtered
    .filter(s => !s.skill.isCore && s.score < 20)
    .map(s => s.skill);

  const skipped = allSkills.filter(
    s => !core.includes(s) && !context.includes(s) && !optional.includes(s)
  );

  // Resolve dependencies
  const allSelectedNames = [...core, ...context, ...optional].map(s => s.name);
  const dependencies = resolveDependencies(allSelectedNames, allSkills);

  return {
    core,
    context,
    optional,
    skipped,
    dependencies,
  };
}

export async function discoverSkills(): Promise<Skill[]> {
  const skillsDir = getSkillsDirectory();
  const skills: Skill[] = [];

  if (!existsSync(skillsDir)) {
    return skills;
  }

  const entries = readdirSync(skillsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    const skillPath = join(skillsDir, entry.name);
    const skillFile = join(skillPath, 'SKILL.md');

    if (existsSync(skillFile)) {
      try {
        const metadata = await parseSkillMetadata(skillFile);
        skills.push({
          name: entry.name,
          path: skillPath,
          description: metadata.description || `Skill: ${entry.name}`,
          category: (metadata.category as SkillCategory) || 'other',
          isCore: metadata.core || false,
          score: 0, // Calculated per detection
          reasons: [], // Calculated per detection
          dependencies: metadata.dependencies || [],
          scales: metadata.scale || ['mvp', 'small', 'medium', 'large', 'enterprise'],
          triggers: metadata.triggers || [],
          priority: (metadata.priority as Skill['priority']) || 'medium',
        });
      } catch {
        // Skip invalid skills
        console.warn(`Failed to parse skill: ${entry.name}`);
      }
    }
  }

  return skills;
}

async function parseSkillMetadata(skillFile: string): Promise<SkillMetadata> {
  const content = await readFile(skillFile, 'utf-8');

  // Parse YAML frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    try {
      return parseYamlFrontmatter(frontmatterMatch[1]);
    } catch {
      // Fall through to tag parsing
    }
  }

  // Parse @tags
  return {
    category: extractFirstTag(content, '@category'),
    core: hasAnyTag(content, ['@core', '@always']),
    scale: extractAllTags(content, '@scale') as Scale[],
    triggers: extractAllTags(content, '@trigger'),
    dependencies: extractAllTags(content, '@requires'),
    priority: extractFirstTag(content, '@priority'),
    description: extractFirstTag(content, '@description'),
  };
}

function parseYamlFrontmatter(yaml: string): SkillMetadata {
  const result: SkillMetadata = {};
  const lines = yaml.split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      const cleanValue = value.replace(/^["']|["']$/g, '').trim();

      switch (key) {
        case 'category':
        case 'description':
        case 'priority':
          (result as Record<string, unknown>)[key] = cleanValue;
          break;
        case 'core':
        case 'always':
          (result as Record<string, unknown>)[key] = cleanValue === 'true';
          break;
        case 'scale':
        case 'triggers':
        case 'dependencies':
          (result as Record<string, unknown>)[key] = cleanValue.split(',').map(s => s.trim());
          break;
      }
    }
  }

  return result;
}

function extractFirstTag(content: string, tag: string): string | undefined {
  const match = content.match(new RegExp(`${tag}:\\s*(.+?)(?:\\n|$)`));
  return match?.[1]?.trim();
}

function extractAllTags(content: string, tag: string): string[] {
  const regex = new RegExp(`${tag}:\\s*(.+?)(?:\\n|$)`, 'g');
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(...match[1].split(',').map(s => s.trim()));
  }
  return matches;
}

function hasAnyTag(content: string, tags: string[]): boolean {
  return tags.some(tag => content.includes(tag));
}

function calculateScore(skill: Skill, detection: DetectionResult): number {
  let score = 0;

  // Core skill bonus
  if (skill.isCore) {
    score += SCORE_WEIGHTS.CORE;
  }

  // Tech stack match
  const techMatches = getTechMatches(skill, detection.techStack);
  if (techMatches.length > 0) {
    score += SCORE_WEIGHTS.TECH_MATCH;
  }

  // Phase match
  if (detection.phase?.requiredSkills?.includes(skill.name)) {
    score += SCORE_WEIGHTS.PHASE_MATCH;
  }

  // Scale match
  if (skill.scales.includes(detection.scale)) {
    score += SCORE_WEIGHTS.SCALE_MATCH;
  }

  return score;
}

function getReasons(skill: Skill, detection: DetectionResult): string[] {
  const reasons: string[] = [];

  if (skill.isCore) {
    reasons.push('Core skill (always invoked)');
  }

  const techMatches = getTechMatches(skill, detection.techStack);
  if (techMatches.length > 0) {
    reasons.push(`Tech stack: ${techMatches.join(', ')}`);
  }

  if (detection.phase?.requiredSkills?.includes(skill.name)) {
    reasons.push(`Required by ${detection.phase.current}`);
  }

  if (skill.scales.includes(detection.scale)) {
    reasons.push(`Scale: ${detection.scale}`);
  }

  return reasons;
}

function getTechMatches(skill: Skill, techStack: TechStack): string[] {
  const matches: string[] = [];

  const allTech = [
    ...techStack.frameworks,
    ...techStack.databases,
    ...techStack.languages,
    ...techStack.devops,
    ...techStack.cache,
  ];

  for (const trigger of skill.triggers) {
    if (allTech.some(t => t.includes(trigger) || trigger.includes(t))) {
      matches.push(trigger);
    }
  }

  return matches;
}

export function resolveDependencies(
  skills: string[],
  allSkills: Skill[]
): DependencyNode[] {
  const skillMap = new Map(allSkills.map(s => [s.name, s]));
  const resolved: DependencyNode[] = [];
  const visiting = new Set<string>();
  const resolvedSet = new Set<string>();

  function visit(skillName: string): void {
    if (resolvedSet.has(skillName)) return;
    if (visiting.has(skillName)) {
      throw new CyclicDependencyError(skillName, skills);
    }

    visiting.add(skillName);

    const skill = skillMap.get(skillName);
    if (skill) {
      for (const dep of skill.dependencies) {
        if (skills.includes(dep) && !resolvedSet.has(dep)) {
          visit(dep);
        }
      }
    }

    visiting.delete(skillName);
    resolvedSet.add(skillName);

    const dependents = skills.filter(s => {
      const s2 = skillMap.get(s);
      return s2?.dependencies.includes(skillName);
    });

    resolved.push({
      skill: skillName,
      dependencies: skill?.dependencies.filter(d => skills.includes(d)) || [],
      dependents,
      loadOrder: resolved.length,
    });
  }

  for (const skill of skills) {
    if (!resolvedSet.has(skill)) {
      visit(skill);
    }
  }

  return resolved;
}

class CyclicDependencyError extends Error {
  constructor(
    public skill: string,
    public chain: string[]
  ) {
    super(`Cyclic dependency detected involving skill: ${skill}`);
    this.name = 'CyclicDependencyError';
  }
}

function getSkillsDirectory(): string {
  // Standard Claude Code skills directory
  const home = process.env.HOME || process.env.USERPROFILE || '';
  return join(home, '.claude', 'skills');
}

// Utility: Generate selection prompt
export function generateSelectionPrompt(result: SelectionResult): string {
  const lines: string[] = [];

  lines.push('```');
  lines.push('╔════════════════════════════════════════════════════════════════════╗');
  lines.push('║                     🎯 SELECT OPTIONAL SKILLS                       ║');
  lines.push('╠════════════════════════════════════════════════════════════════════╣');

  if (result.optional.length > 0) {
    lines.push('║                                                                    ║');
    lines.push('║  AVAILABLE SKILLS:                                                 ║');
    lines.push('║                                                                    ║');

    result.optional.forEach((skill, index) => {
      const name = skill.name.padEnd(20);
      const desc = skill.description.substring(0, 40).padEnd(40);
      lines.push(`║  [${String(index + 1).padStart(2)}] /${name} ${desc}║`);
    });

    lines.push('║                                                                    ║');
    lines.push('╠════════════════════════════════════════════════════════════════════╣');
  }

  lines.push('║                                                                    ║');
  lines.push('║  SHORTCUTS:                                                         ║');
  lines.push('║  • all       → Activate all optional skills                       ║');
  lines.push('║  • none      → Skip optional skills                                ║');
  lines.push('║  • recommend → Auto-recommend based on stack                       ║');
  lines.push('║                                                                    ║');
  lines.push('║  Enter numbers (e.g., 1,3,5) or shortcut:                        ║');
  lines.push('╚════════════════════════════════════════════════════════════════════╝');
  lines.push('```');

  return lines.join('\n');
}
