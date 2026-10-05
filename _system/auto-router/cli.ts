#!/usr/bin/env node

/**
 * AUTO-ROUTER CLI v6.0
 * Smart Project Intelligence Tool
 *
 * Usage: auto-router --smart [options]
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
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
import { detectSkillsFromInput, getKeywordRecommendations, loadProjectState } from './detector';
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
    if (phaseMatch) options.phase = parseInt(phaseMatch[1]);

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

  // Load project state if exists
  const projectState = await loadProjectState(cwd);

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
    intent,
    confidence,
    techStack,
  };
}

function detectIntentFromInput(input: string): string {
  const lower = input.toLowerCase();

  if (/debug|fix|error|bug|crash/.test(lower)) return 'DEBUG';
  if (/create|add|build|implement|new/.test(lower)) return 'CREATE';
  if (/analyze|audit|review|check|scan/.test(lower)) return 'ANALYZE';
  if (/deploy|release|publish|ship/.test(lower)) return 'DEPLOY';
  if (/test|spec|expect/.test(lower)) return 'TEST';

  return 'EXPLORE';
}

async function detectTechStack(cwd: string): Promise<string[]> {
  const techStack: string[] = [];

  // Check for package.json
  const packageJsonPath = join(cwd, 'package.json');
  if (existsSync(packageJsonPath)) {
    try {
      const content = readFileSync(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);
      const deps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };

      const allDeps = Object.keys(deps).join(' ');

      if (/fastify/.test(allDeps)) techStack.push('fastify');
      if (/express/.test(allDeps)) techStack.push('express');
      if (/@nestjs/.test(allDeps)) techStack.push('nestjs');
      if (/next/.test(allDeps)) techStack.push('next');
      if (/react/.test(allDeps)) techStack.push('react');
      if (/vue/.test(allDeps)) techStack.push('vue');
      if (/typescript/.test(allDeps)) techStack.push('typescript');
      if (/postgres|pg|@prisma/.test(allDeps)) techStack.push('postgres');
      if (/mysql/.test(allDeps)) techStack.push('mysql');
      if (/mongodb|mongoose/.test(allDeps)) techStack.push('mongodb');
      if (/redis|ioredis/.test(allDeps)) techStack.push('redis');
      if (/docker/.test(allDeps)) techStack.push('docker');
      if (/kubernetes|k8s/.test(allDeps)) techStack.push('kubernetes');
    } catch {
      // Ignore parse errors
    }
  }

  // Check for requirements.txt (Python)
  if (existsSync(join(cwd, 'requirements.txt'))) {
    techStack.push('python');
  }

  // Check for go.mod (Go)
  if (existsSync(join(cwd, 'go.mod'))) {
    techStack.push('go');
  }

  return techStack;
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
  const projectState = await loadProjectState(cwd);

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
