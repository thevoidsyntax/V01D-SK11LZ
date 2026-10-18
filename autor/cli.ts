#!/usr/bin/env node

/**
 * AUTO-ROUTER CLI v8.3
 * Utility Tool for Local Skills Management
 *
 * This CLI is a utility companion to the main SKILL.md.
 * Main execution is via SKILL.md (Claude Code skill system).
 *
 * This utility handles:
 * - Local skills initialization
 * - Local skills preview
 * - Project state management
 *
 * Usage: auto-router [command]
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function log(message: string): void {
  console.log(message);
}

function success(message: string): void {
  console.log(`✅ ${message}`);
}

function info(message: string): void {
  console.log(`ℹ️  ${message}`);
}

function error(message: string): void {
  console.error(`❌ ${message}`);
}

// ============================================================================
// HELP
// ============================================================================

function printHelp(): void {
  log(`
╔══════════════════════════════════════════════════════════════════╗
║  AUTO-ROUTER CLI v8.3 Utility                             ║
╚══════════════════════════════════════════════════════════════════╝

USAGE:
  auto-router [command]

COMMANDS:
  init-local       Initialize local skills folder
  local-preview    Preview local skills configuration
  status           Show project status
  help             Show this help

NOTE:
  Main skill execution is via SKILL.md in Claude Code.
  This CLI is a utility for local skills management.

EXAMPLES:
  auto-router init-local
  auto-router local-preview
  auto-router status
  auto-router help
`);
}

// ============================================================================
// INIT LOCAL
// ============================================================================

async function initLocal(): Promise<void> {
  const cwd = process.cwd();
  const localSkillsDir = join(cwd, '.claude', 'skills');

  info('Initializing local skills...');

  if (existsSync(localSkillsDir)) {
    success(`Local skills already exist at: ${localSkillsDir}`);
    return;
  }

  mkdirSync(localSkillsDir, { recursive: true });
  mkdirSync(join(localSkillsDir, 'hooks'), { recursive: true });

  const projectName = cwd.split(/[/\\]/).pop() || 'my-project';

  const skillMd = `---
name: ${projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}-skills
version: "1.0.0"
type: local
description: "Local skill configurations for ${projectName}"
project:
  name: ${projectName}
  root: ../
extends:
  - global
---

# ${projectName} Local Skills

Customize skill behavior for this project.

## Custom Phase Skills

override phase_skills in your SKILL.md to customize.
`;

  writeFileSync(join(localSkillsDir, 'SKILL.md'), skillMd, 'utf-8');
  writeFileSync(join(localSkillsDir, 'phases.json'), JSON.stringify({
    project_name: projectName,
    phases: {
      foundation: { skills: ['/security', '/database'] },
      core: { skills: ['/api-design', '/testing'] },
      features: { skills: ['/git', '/ui-ux-pro-max'] },
      production: { skills: ['/docker', '/ci-cd'] }
    }
  }, null, 2), 'utf-8');
  writeFileSync(join(localSkillsDir, '.autorignore'), `node_modules/
vendor/
dist/
build/
.cache/
coverage/
`, 'utf-8');
  writeFileSync(join(localSkillsDir, 'hooks', 'pre-invoke.md'), `# Pre-Invoke Hook

Customize behavior before skill invocation.
`, 'utf-8');
  writeFileSync(join(localSkillsDir, 'hooks', 'post-invoke.md'), `# Post-Invoke Hook

Customize behavior after skill invocation.
`, 'utf-8');

  success(`Local skills initialized at: ${localSkillsDir}`);
  log(`
Created:
  ├── SKILL.md
  ├── phases.json
  ├── .autorignore
  └── hooks/
      ├── pre-invoke.md
      └── post-invoke.md

Next: Edit .claude/skills/SKILL.md to customize.
`);
}

// ============================================================================
// LOCAL PREVIEW
// ============================================================================

function localPreview(): void {
  const cwd = process.cwd();
  const skillMdPath = join(cwd, '.claude', 'skills', 'SKILL.md');

  if (!existsSync(skillMdPath)) {
    info('No local skills found. Run: auto-router init-local');
    return;
  }

  log('\n╔══════════════════════════════════════════════════════════════════╗');
  log('║  LOCAL SKILLS CONFIGURATION                                   ║');
  log('╚══════════════════════════════════════════════════════════════════╝\n');

  const content = readFileSync(skillMdPath, 'utf-8');
  console.log(content);

  const phasesPath = join(cwd, '.claude', 'skills', 'phases.json');
  if (existsSync(phasesPath)) {
    log('\n--- phases.json ---\n');
    console.log(readFileSync(phasesPath, 'utf-8'));
  }
}

// ============================================================================
// STATUS
// ============================================================================

function status(): void {
  const cwd = process.cwd();
  const claudeDir = join(cwd, '.claude');
  const skillMdPath = join(cwd, '.claude', 'skills', 'SKILL.md');

  log('\n╔══════════════════════════════════════════════════════════════════╗');
  log('║  PROJECT STATUS                                              ║');
  log('╚══════════════════════════════════════════════════════════════════╝\n');

  info(`Project: ${cwd.split(/[/\\]/).pop() || 'unknown'}`);
  info(`Path: ${cwd}`);

  if (existsSync(skillMdPath)) {
    success('Local Skills: Enabled');
    log(`  └── ${skillMdPath}`);
  } else {
    info('Local Skills: Not configured');
    info('  └── Run: auto-router init-local');
  }

  if (existsSync(join(claudeDir, 'CLAUDE.md'))) {
    success('CLAUDE.md: Found');
  } else {
    info('CLAUDE.md: Not found');
  }

  log('');
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();

  switch (command) {
    case 'init-local':
      await initLocal();
      break;

    case 'local-preview':
    case 'preview':
      localPreview();
      break;

    case 'status':
    case 'stat':
      status();
      break;

    case 'help':
    case '--help':
    case '-h':
    default:
      if (args.length === 0) {
        log('\n╔══════════════════════════════════════════════════════════════════╗');
        log('║  AUTO-ROUTER v8.3                                              ║');
        log('║                                                              ║');
        log('║  Main skill execution is via SKILL.md (Claude Code).            ║');
        log('║  This CLI is for local skills management.                      ║');
        log('║                                                              ║');
        log('║  COMMANDS:                                                     ║');
        log('║    init-local     Initialize local skills folder               ║');
        log('║    local-preview  Preview local skills                        ║');
        log('║    status        Show project status                            ║');
        log('║    help          Show this help                                ║');
        log('╚══════════════════════════════════════════════════════════════════╝\n');
      } else {
        printHelp();
      }
  }
}

main().catch(err => {
  error(`Error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
