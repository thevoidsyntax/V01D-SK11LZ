#!/usr/bin/env node

/**
 * AUTO-ROUTER CLI v6.0
 * Smart Project Intelligence Tool
 *
 * Usage: auto-router --smart [options]
 */

import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import {
  drawDashboard,
  drawQuickActions,
  drawProjectStatus,
  drawSuccess,
  drawError,
  drawInfo,
  drawLoading,
  clearScreen,
  type SkillDisplay,
  type ProjectDisplay
} from './smart-ui';
import { detectSkillsFromInput, getKeywordRecommendations, loadProjectState, detectIntentSimple, detectTechStack } from './detector';
import { selectSkills } from './selector';

// ============================================================================
// TYPES
// ============================================================================

interface CliOptions {
  smart: boolean;
  new: boolean;
  analyze: boolean;
  phase?: number;
  status: boolean;
  workflow?: string;
  help: boolean;
}

interface GlobalState {
  selectedSkills: Set<string>;
  projectPath: string;
}

// ============================================================================
// MAIN CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const options = parseArguments(args);

  if (options.help) {
    printHelp();
    return;
  }

  // Smart mode (default when no specific mode)
  if (options.smart || (!options.new && !options.analyze && !options.status)) {
    await runSmartMode(options);
    return;
  }

  // New project mode
  if (options.new) {
    await runNewProjectMode();
    return;
  }

  // Analyze mode
  if (options.analyze) {
    await runAnalyzeMode();
    return;
  }

  // Status mode
  if (options.status) {
    await runStatusMode();
    return;
  }
}

// ============================================================================
// ARGUMENT PARSER
// ============================================================================

function parseArguments(args: string[]): CliOptions {
  const options: CliOptions = {
    smart: false,
    new: false,
    analyze: false,
    status: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--smart' || arg === '-s') options.smart = true;
    if (arg === '--new' || arg === '-n') options.new = true;
    if (arg === '--analyze' || arg === '-a') options.analyze = true;
    if (arg === '--status') options.status = true;
    if (arg === '--help' || arg === '-h') options.help = true;

    // Parse --phase N
    const phaseMatch = arg.match(/^--phase=(\d+)$/);
    if (phaseMatch) {
      const phase = parseInt(phaseMatch[1], 10);
      if (!isNaN(phase) && phase >= 1 && phase <= 6) {
        options.phase = phase;
      }
    }

    // Parse --workflow NAME
    const workflowMatch = arg.match(/^--workflow=(.+)$/);
    if (workflowMatch) options.workflow = workflowMatch[1];
  }

  return options;
}

// ============================================================================
// SMART MODE
// ============================================================================

async function runSmartMode(options: CliOptions) {
  clearScreen();

  // Get current directory
  const cwd = process.cwd();

  // Load project state if exists (with error handling)
  let projectState = null;
  try {
    projectState = await loadProjectState(cwd);
  } catch (err) {
    console.warn('[cli] Failed to load project state:', err instanceof Error ? err.message : err);
  }

  // Get user input from environment or default
  const userInput = process.env.AUTO_ROUTER_INPUT || '';

  // Run skill selection
  const result = await runSkillSelection(cwd, userInput, options.phase);

  // Prepare display data
  const projectDisplay: ProjectDisplay = {
    name: projectState?.projectName || cwd.split(/[/\\]/).pop() || 'unknown',
    phase: options.phase || projectState?.currentPhase || 1,
    scale: projectState?.scale || 'unknown',
    techStack: result.techStack,
  };

  const skillsDisplay: SkillDisplay[] = result.skills.map(s => ({
    name: s.name,
    description: s.description,
    score: s.score,
    confidence: s.confidence,
    category: s.category,
    selected: result.selectedSkills.has(s.name),
  }));

  // Write active-skills.md file
  const activeSkills: ActiveSkill[] = [
    ...result.coreSkills.map(s => ({ name: s.name, description: s.description, category: s.category[0] || 'other', source: 'core' as const })),
    ...result.contextSkills.map(s => ({ name: s.name, description: s.description, category: s.category[0] || 'other', source: 'context' as const })),
    ...result.optionalSkills.map(s => ({ name: s.name, description: s.description, category: s.category[0] || 'other', source: 'optional' as const })),
  ];

  try {
    await writeActiveSkillsFile(
      cwd,
      activeSkills,
      result.techStack,
      options.phase || 1,
      projectDisplay.name
    );
  } catch (err) {
    console.warn('[cli] Failed to write active skills file:', err instanceof Error ? err.message : err);
  }

  // Render dashboard
  const dashboard = drawDashboard({
    project: projectDisplay,
    skills: skillsDisplay,
    intent: result.intent,
    confidence: result.confidence,
    phase: `Phase ${options.phase || 1}`,
  });

  console.log(dashboard);

  // Interactive prompt
  console.log('\n');
  console.log(drawInfo('Type your request or select options:'));
  console.log(drawInfo('Examples:'));
  console.log('  "I need to add JWT authentication"');
  console.log('  "Debug 500 error in API"');
  console.log('  "Optimize database queries"');
}

// ============================================================================
// SKILL SELECTION ENGINE
// ============================================================================

async function runSkillSelection(
  cwd: string,
  userInput: string,
  currentPhase?: number
): Promise<{
  skills: Array<{
    name: string;
    description: string;
    score: number;
    confidence: 'high' | 'medium' | 'low';
    category: string;
  }>;
  selectedSkills: Set<string>;
  coreSkills: Array<{ name: string; description: string; category: string[] }>;
  contextSkills: Array<{ name: string; description: string; category: string[] }>;
  optionalSkills: Array<{ name: string; description: string; category: string[] }>;
  intent: string;
  confidence: 'high' | 'medium' | 'low';
  techStack: string[];
}> {
  // Get keyword matches
  const keywordMatches = userInput
    ? detectSkillsFromInput(userInput)
    : [];

  // Get recommendations
  const recommendations = userInput
    ? getKeywordRecommendations(userInput)
    : [];

  // Determine intent from input
  const intent = detectIntentFromInput(userInput);

  // Detect tech stack from cwd
  const techStack = await detectTechStack(cwd);

  // Get selection from selector
  const selection = selectSkills({
    projectPath: cwd,
    techStack: {
      frameworks: techStack.filter(t => ['react', 'vue', 'fastify', 'express', 'nestjs'].includes(t)),
      databases: techStack.filter(t => ['postgres', 'mysql', 'mongodb', 'redis'].includes(t)),
      languages: techStack.filter(t => ['typescript', 'javascript', 'python', 'go'].includes(t)),
      devops: techStack.filter(t => ['docker', 'kubernetes', 'terraform'].includes(t)),
    },
    currentPhase,
    scale: 'small',
    existingSkills: [],
    patterns: [],
  }, userInput);

  // Calculate confidence
  const confidence = selection.summary.confidence;

  // Selected skills (core + keyword matched)
  const selectedSkills = new Set<string>();
  selection.core.forEach(s => selectedSkills.add(s.name));
  selection.keywordMatched.forEach(s => selectedSkills.add(s.name));

  return {
    skills: [
      ...selection.core,
      ...selection.context,
      ...selection.optional,
    ].slice(0, 10).map(s => ({
      name: s.name,
      description: s.description.substring(0, 50),
      score: 85,
      confidence: 'high' as const,
      category: s.category[0] || 'other',
    })),
    selectedSkills,
    coreSkills: selection.core,
    contextSkills: selection.context,
    optionalSkills: selection.optional,
    intent,
    confidence,
    techStack,
  };
}

function detectIntentFromInput(input: string): string {
  return detectIntentSimple(input.toLowerCase());
}

async function scanLocalTechStack(cwd: string): Promise<string[]> {
  const packageJsonPath = join(cwd, 'package.json');

  let packageData: Record<string, unknown> | null = null;

  if (existsSync(packageJsonPath)) {
    try {
      const content = readFileSync(packageJsonPath, 'utf-8');
      packageData = JSON.parse(content);
    } catch {
      // Continue with null packageData
    }
  }

  const stack = detectTechStack(packageData, cwd);

  return [
    ...stack.frameworks,
    ...stack.databases,
    ...stack.languages,
    ...stack.devops,
    ...stack.cache
  ];
}

// ============================================================================
// OTHER MODES
// ============================================================================

async function runNewProjectMode() {
  clearScreen();
  console.log(drawLoading('Initializing new project wizard...'));
  console.log('\n');
  console.log(drawInfo('Use /project-init command in Claude Code for new project setup.'));
}

async function runAnalyzeMode() {
  clearScreen();
  console.log(drawLoading('Analyzing project...'));
  console.log('\n');
  console.log(drawInfo('Use /analyze-project command in Claude Code for project analysis.'));
}

async function runStatusMode() {
  clearScreen();
  const cwd = process.cwd();

  let projectState = null;
  try {
    projectState = await loadProjectState(cwd);
  } catch (err) {
    console.warn('[cli] Failed to load project state:', err instanceof Error ? err.message : err);
  }

  if (projectState) {
    const status = drawProjectStatus({
      name: projectState.projectName || 'Unknown',
      path: projectState.path,
      phase: projectState.currentPhase || 1,
      scale: projectState.scale || 'Unknown',
      activeSkills: projectState.activeSkills || [],
      lastAnalyzed: projectState.lastAnalyzed || 'Never',
    });
    console.log(status);
  } else {
    console.log(drawInfo('No project state found. Run --smart to analyze current directory.'));
  }
}

// ============================================================================
// ACTIVE SKILLS FILE
// ============================================================================

interface ActiveSkill {
  name: string;
  description: string;
  category: string;
  source: 'core' | 'tech' | 'context' | 'optional';
}

async function writeActiveSkillsFile(
  cwd: string,
  skills: ActiveSkill[],
  techStack: string[],
  phase: number,
  projectName: string
): Promise<void> {
  const claudeDir = join(cwd, '.claude');

  // Ensure .claude directory exists
  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const time = new Date().toLocaleTimeString();

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, ActiveSkill[]>);

  // Build markdown content
  const content = `# Active Skills for "${projectName}"

Generated by /auto-router on ${timestamp} at ${time}

## Project Info

| Property | Value |
|----------|-------|
| Project | ${projectName} |
| Path | ${cwd} |
| Phase | ${phase} |
| Tech Stack | ${techStack.length > 0 ? techStack.join(', ') : 'None detected'} |
| Skills Active | ${skills.length} |
| Last Updated | ${timestamp} ${time} |

---

## Skills by Category

${Object.entries(groupedSkills).map(([category, categorySkills]) => `
### ${category.charAt(0).toUpperCase() + category.slice(1)} (${categorySkills.length})

| Skill | Description | Source |
|-------|------------|--------|
${categorySkills.map(s => `| \`/${s.name}\` | ${s.description} | ${s.source} |`).join('\n')}
`).join('\n')}

---

## Quick Reference

### Core Skills (Always Active)
\`\`\`
${skills.filter(s => s.source === 'core').map(s => `/${s.name}`).join(' ')}
\`\`\`

### Tech-Based Skills (Auto-detected)
${techStack.length > 0 ? `\`\`\`
${techStack.map(t => `- ${t}`).join('\n')}
\`\`\`` : '*No tech stack detected*'}

---

## Override Skills

### Skip These Skills
Add to \`.claude/SKIP_SKILLS\`: \`\`\`
\`\`\`

### Add Extra Skills
Add to \`.claude/ADD_SKILLS\`: \`\`\`
\`\`\`

---

## How This File Works

This file is auto-generated by \`/auto-router\` and lists all skills currently active for this project.

- **Core Skills**: Always invoked with \`/auto-router\` (shown in bold above)
- **Tech Skills**: Auto-detected based on your tech stack
- **Context Skills**: Based on current phase and project patterns
- **Optional Skills**: Available but not auto-invoked

To refresh: Run \`/auto-router\` again

---

*Generated by /auto-router v7.0*
`;

  const filePath = join(claudeDir, 'active-skills.md');
  writeFileSync(filePath, content, 'utf-8');
  console.log(drawInfo(`Active skills saved to: ${filePath}`));
}

// ============================================================================
// HELP
// ============================================================================

function printHelp() {
  console.log(`
${drawQuickActions()}

OPTIONS:
  --smart, -s      Show Smart Dashboard (default)
  --new, -n        Start new project wizard
  --analyze, -a     Analyze existing project
  --status          Show project status
  --phase=N         Set current phase
  --workflow=NAME   Run workflow template
  --help, -h        Show this help

EXAMPLES:
  auto-router --smart
  auto-router --smart --phase=3
  auto-router --status
  auto-router --new
`);
}

// ============================================================================
// RUN
// ============================================================================

main().catch(err => {
  console.error(drawError(`Fatal error: ${err.message}`));
  process.exit(1);
});
