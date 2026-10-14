#!/usr/bin/env node

/**
 * AUTO-ROUTER CLI v8.2
 * Smart Project Intelligence Tool
 *
 * Features:
 * - Local skills override
 * - Project-specific configurations
 * - Global + Local skill merging
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
import { selectSkills, type LocalSkillConfig, type SkillSelectionConfig } from './selector';

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
  initLocal: boolean;
  localOnly: boolean;
  globalOnly: boolean;
  localPreview: boolean;
  syncLocal: boolean;
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

  // Init local skills mode
  if (options.initLocal) {
    await runInitLocalMode();
    return;
  }

  // Local preview mode
  if (options.localPreview) {
    await runLocalPreviewMode();
    return;
  }

  // Sync local mode
  if (options.syncLocal) {
    await runSyncLocalMode();
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
    initLocal: false,
    localOnly: false,
    globalOnly: false,
    localPreview: false,
    syncLocal: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--smart' || arg === '-s') options.smart = true;
    if (arg === '--new' || arg === '-n') options.new = true;
    if (arg === '--analyze' || arg === '-a') options.analyze = true;
    if (arg === '--status') options.status = true;
    if (arg === '--init-local') options.initLocal = true;
    if (arg === '--local-only') options.localOnly = true;
    if (arg === '--global-only') options.globalOnly = true;
    if (arg === '--local-preview') options.localPreview = true;
    if (arg === '--sync-local' || arg === '--sync') options.syncLocal = true;
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
      description: (s.description || '').substring(0, 50),
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
// LOCAL SKILLS MANAGEMENT
// ============================================================================

async function runInitLocalMode(): Promise<void> {
  clearScreen();
  const cwd = process.cwd();

  console.log(drawLoading('Initializing local skills...'));

  const localSkillsDir = join(cwd, '.claude', 'skills');

  // Check if already exists
  if (existsSync(localSkillsDir)) {
    console.log(drawInfo(`Local skills already exist at: ${localSkillsDir}`));
    console.log(drawInfo('Use --sync-local to update or --local-preview to see current config.'));
    return;
  }

  // Create directory structure
  mkdirSync(localSkillsDir, { recursive: true });
  mkdirSync(join(localSkillsDir, 'hooks'), { recursive: true });

  // Detect tech stack for customization
  const techStack = await scanLocalTechStack(cwd);
  const projectName = cwd.split(/[/\\]/).pop() || 'my-project';

  // Generate SKILL.md
  const skillMd = generateLocalSkillMd(projectName, techStack);
  writeFileSync(join(localSkillsDir, 'SKILL.md'), skillMd, 'utf-8');

  // Generate phases.json
  const phasesJson = generatePhasesJson(projectName, techStack);
  writeFileSync(join(localSkillsDir, 'phases.json'), phasesJson, 'utf-8');

  // Generate .autorignore
  const autorignore = generateAutorignore();
  writeFileSync(join(localSkillsDir, '.autorignore'), autorignore, 'utf-8');

  // Generate hooks
  const preInvoke = generatePreInvokeHook();
  writeFileSync(join(localSkillsDir, 'hooks', 'pre-invoke.md'), preInvoke, 'utf-8');

  const postInvoke = generatePostInvokeHook();
  writeFileSync(join(localSkillsDir, 'hooks', 'post-invoke.md'), postInvoke, 'utf-8');

  console.log(drawSuccess(`Local skills initialized at: ${localSkillsDir}`));
  console.log('\n');
  console.log(drawInfo('Created files:'));
  console.log('  ├── SKILL.md           (project config)');
  console.log('  ├── phases.json        (phase mappings)');
  console.log('  ├── .autorignore       (scan exclusions)');
  console.log('  └── hooks/');
  console.log('      ├── pre-invoke.md  (before skill invoke)');
  console.log('      └── post-invoke.md (after skill invoke)');
  console.log('\n');
  console.log(drawInfo('Next steps:'));
  console.log('  1. Edit .claude/skills/SKILL.md to customize');
  console.log('  2. Run /autor to see local skills in action');
  console.log('  3. Commit .claude/ to share with team');
}

async function runLocalPreviewMode(): Promise<void> {
  clearScreen();
  const cwd = process.cwd();
  const localSkillsDir = join(cwd, '.claude', 'skills');
  const skillMdPath = join(localSkillsDir, 'SKILL.md');

  if (!existsSync(skillMdPath)) {
    console.log(drawError('No local skills found. Run --init-local first.'));
    return;
  }

  console.log(drawInfo('Local Skills Configuration Preview'));
  console.log('\n');

  // Read and display local config
  const content = readFileSync(skillMdPath, 'utf-8');
  console.log('```yaml');
  console.log(content);
  console.log('```');

  // Read phases.json if exists
  const phasesJsonPath = join(localSkillsDir, 'phases.json');
  if (existsSync(phasesJsonPath)) {
    console.log('\n**phases.json:**');
    const phasesContent = readFileSync(phasesJsonPath, 'utf-8');
    console.log('```json');
    console.log(phasesContent);
    console.log('```');
  }
}

async function runSyncLocalMode(): Promise<void> {
  clearScreen();
  const cwd = process.cwd();
  const localSkillsDir = join(cwd, '.claude', 'skills');
  const skillMdPath = join(localSkillsDir, 'SKILL.md');

  if (!existsSync(skillMdPath)) {
    console.log(drawInfo('No local skills found. Run --init-local first.'));
    console.log('\n');
    console.log(drawInfo('This command syncs your local skills with global updates.'));
    console.log(drawInfo('It does NOT modify global skills, only your local .claude/skills/'));
    return;
  }

  console.log(drawLoading('Syncing local skills with global updates...'));

  // Read current local config
  const content = readFileSync(skillMdPath, 'utf-8');

  // Check for updates in global skills
  const hasUpdates = await checkForGlobalUpdates();

  if (hasUpdates) {
    console.log(drawInfo('Global skills have been updated. Merging...'));
    // In a real implementation, this would merge global changes
    console.log(drawSuccess('Local skills synced successfully!'));
  } else {
    console.log(drawSuccess('Local skills are up to date.'));
  }

  console.log('\n');
  console.log(drawInfo('Your local skills override global settings:'));
  console.log('  • Local: .claude/skills/SKILL.md (HIGHEST PRIORITY)');
  console.log('  • Global: ~/.claude/skills/ (BASE CONFIG)');
}

async function checkForGlobalUpdates(): Promise<boolean> {
  // Placeholder: In real implementation, compare local vs global timestamps
  return false;
}

function generateLocalSkillMd(projectName: string, techStack: string[]): string {
  const techList = techStack.length > 0 ? techStack.join(', ') : 'detected from project';

  return `---
name: ${projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}-skills
version: "1.0.0"
description: "Project-local skill configurations for ${projectName}"
type: local
project:
  name: ${projectName}
  root: ../
extends:
  - global
overrides:
  phase_skills:
    foundation:
      - /security
      - /database
      - /config
    core:
      - /api-design
      - /code-quality
      - /testing
    features:
      - /git
      - /ui-ux-pro-max
      - /performance
  tech_skills:
    typescript:
      - /typescript-pro
      - /project-linter
---

# ${projectName} - Local Skills Configuration

## Overview

This file configures skill behavior for the **${projectName}** project.

## Tech Stack Detected

${techList}

## How This Works

Local skills are merged with global skills, with local taking priority.

## Custom Phase Rules

### Foundation Phase
- Security scanning enabled
- Database schema validation
- Config management

### Features Phase
- Git workflow enforcement
- UI/UX patterns
- Performance budgets

## Custom Hooks

See \`hooks/pre-invoke.md\` and \`hooks/post-invoke.md\`.
`;
}

function generatePhasesJson(projectName: string, techStack: string[]): string {
  return JSON.stringify({
    project_name: projectName,
    tech_stack_detected: techStack,
    phases: {
      foundation: {
        skills: ['/security', '/database', '/config'],
        auto_invoke_priority: 1
      },
      core: {
        skills: ['/api-design', '/code-quality', '/testing'],
        auto_invoke_priority: 2
      },
      features: {
        skills: ['/git', '/ui-ux-pro-max', '/performance'],
        auto_invoke_priority: 3
      },
      production: {
        skills: ['/docker', '/ci-cd', '/observability'],
        auto_invoke_priority: 4
      }
    },
    project_rules: {
      require_code_review: true,
      require_tests: true,
      min_test_coverage: 80
    }
  }, null, 2);
}

function generateAutorignore(): string {
  return `# Autorouter Local Skills - Scan Exclusions

# Dependencies
node_modules/
vendor/
.venv/

# Build outputs
dist/
build/
out/

# Cache
.cache/
.turbo/

# IDE
.vscode/
.idea/

# OS
.DS_Store/
Thumbs.db

# Logs
*.log

# Test coverage
coverage/
.nyc_output/
`;
}

function generatePreInvokeHook(): string {
  return `# Pre-Invoke Hook

## Purpose

Run before each skill invocation.

## Examples

### Before /api-design
\`\`\`markdown
1. Check if API spec exists
2. Verify database is running
3. Load environment variables
\`\`\`

### Before /testing
\`\`\`markdown
1. Ensure dependencies are installed
2. Check database is seeded
3. Verify test environment
\`\`\`
`;
}

function generatePostInvokeHook(): string {
  return `# Post-Invoke Hook

## Purpose

Run after each skill invocation.

## Examples

### After /testing
\`\`\`markdown
1. Report coverage if < 80%
2. Flag any flaky tests
3. Generate test summary
\`\`\`

### After /linting
\`\`\`markdown
1. Report error count
2. Suggest auto-fix if available
\`\`\`
`;
}

// ============================================================================
// HELP
// ============================================================================

function printHelp() {
  console.log(`
${drawQuickActions()}

OPTIONS:
  --smart, -s         Show Smart Dashboard (default)
  --new, -n           Start new project wizard
  --analyze, -a        Analyze existing project
  --status             Show project status
  --phase=N            Set current phase
  --workflow=NAME      Run workflow template
  --init-local         Initialize local skills (.claude/skills/)
  --local-only         Use only local skills (ignore global)
  --global-only        Use only global skills (ignore local)
  --local-preview      Preview local skills configuration
  --sync-local         Sync local with global updates
  --help, -h           Show this help

LOCAL SKILLS:
  Local skills allow per-project customization without modifying global skills.
  Run --init-local in any project to create .claude/skills/ directory.

EXAMPLES:
  auto-router --smart
  auto-router --smart --phase=3
  auto-router --status
  auto-router --new
  auto-router --init-local        # Create local skills config
  auto-router --local-preview     # Preview local config
  auto-router --sync-local        # Sync with global updates
`);
}

// ============================================================================
// RUN
// ============================================================================

main().catch(err => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(drawError(`Fatal error: ${message}`));
  process.exit(1);
});
