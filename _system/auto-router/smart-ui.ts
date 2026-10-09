/**
 * AUTO-ROUTER v6.0 - Smart Terminal Interface
 *
 * Features:
 * - Rich terminal UI with colors and boxes
 * - Interactive skill selection
 * - Progress indicators
 * - Keyboard navigation
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// ============================================================================
// CONSTANTS & COLORS
// ============================================================================

export const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Bright foreground
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Background
  bgBlack: '\x1b[40m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

export const ICONS = {
  rocket: '🚀',
  check: '✅',
  cross: '❌',
  warning: '⚠️',
  info: '💡',
  star: '⭐',
  gear: '⚙️',
  chart: '📊',
  brain: '🧠',
  lightning: '⚡',
  target: '🎯',
  arrow: '➡️',
  folder: '📁',
  file: '📄',
  sparkles: '✨',
  trophy: '🏆',
  fire: '🔥',
};

// ============================================================================
// SMART UI COMPONENTS
// ============================================================================

export interface SkillDisplay {
  name: string;
  description: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  category: string;
  selected: boolean;
}

export interface ProjectDisplay {
  name: string;
  phase: number;
  scale: string;
  techStack: string[];
}

/**
 * Draw a horizontal line
 */
function drawLine(width: number, style: 'double' | 'single' | 'heavy' = 'single'): string {
  const chars = {
    double: '═',
    single: '─',
    heavy: '━',
  };
  return chars[style].repeat(width);
}

/**
 * Draw a box with content
 */
export function drawBox(lines: string[], options: {
  width?: number;
  title?: string;
  style?: 'double' | 'single' | 'heavy' | 'rounded';
  titleColor?: string;
  borderColor?: string;
} = {}): string {
  const {
    width = 60,
    title,
    style = 'double',
    titleColor = COLORS.cyan,
    borderColor = COLORS.cyan,
  } = options;

  const chars = {
    double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', v: '║', h: '═' },
    single: { tl: '┌', tr: '┐', bl: '└', br: '┘', v: '│', h: '─' },
    heavy: { tl: '┏', tr: '┓', bl: '┗', br: '┛', v: '┃', h: '━' },
    rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', v: '│', h: '─' },
  }[style];

  const result: string[] = [];

  // Top border with optional title
  if (title) {
    const padding = width - 4 - strlen(title);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    result.push(`${borderColor}${chars.tl}${chars.h.repeat(leftPad)} ${titleColor}${title}${COLORS.reset} ${borderColor}${chars.h.repeat(rightPad)}${chars.tr}${COLORS.reset}`);
  } else {
    result.push(`${borderColor}${chars.tl}${drawLine(width, style as any)}${chars.tr}${COLORS.reset}`);
  }

  // Content
  for (const line of lines) {
    const content = line.length > width - 4 ? line.substring(0, width - 7) + '...' : line;
    result.push(`${borderColor}${chars.v}${COLORS.reset} ${content.padEnd(width - 4)} ${borderColor}${chars.v}${COLORS.reset}`);
  }

  // Bottom border
  result.push(`${borderColor}${chars.bl}${drawLine(width, style as any)}${chars.br}${COLORS.reset}`);

  return result.join('\n');
}

/**
 * Calculate string length (handle ANSI codes)
 */
function strlen(str: string): number {
  return str.replace(/\x1b\[[0-9;]*m/g, '').length;
}

/**
 * Pad string with ANSI support
 */
function padEnd(str: string, len: number): string {
  const rawLen = strlen(str);
  return str + ' '.repeat(Math.max(0, len - rawLen));
}

/**
 * Draw progress bar
 */
export function drawProgressBar(value: number, max: number, width: number = 20): string {
  // Guard against division by zero or invalid values
  if (max === 0 || !Number.isFinite(max) || !Number.isFinite(value)) {
    return `${COLORS.dim}${'░'.repeat(width)}${COLORS.reset}`;
  }

  // Handle negative and overflow values
  const safeValue = Math.max(0, Math.min(value, max));
  const safeMax = Math.max(1, max);
  const filled = Math.min(width, Math.round((safeValue / safeMax) * width));
  const empty = Math.max(0, width - filled);

  const filledChar = '█';
  const emptyChar = '░';

  return `${COLORS.green}${filledChar.repeat(filled)}${COLORS.dim}${emptyChar.repeat(empty)}${COLORS.reset}`;
}

// ============================================================================
// MAIN UI FUNCTIONS
// ============================================================================

/**
 * Draw the main auto-router dashboard
 */
export function drawDashboard(data: {
  project: ProjectDisplay;
  skills: SkillDisplay[];
  intent: string;
  confidence: 'high' | 'medium' | 'low';
  phase: string;
}): string {
  // Validate input
  if (!data || !data.project) {
    return 'Error: Invalid dashboard data - project information required';
  }

  const width = 70;
  const lines: string[] = [];

  // Header
  lines.push('');
  lines.push(`${COLORS.brightCyan}${COLORS.bold}╔══════════════════════════════════════════════════════════════════════════╗${COLORS.reset}`);
  lines.push(`${COLORS.brightCyan}${COLORS.bold}║${COLORS.reset}  ${COLORS.brightCyan}${ICONS.rocket} AUTO-ROUTER v6.0 ${COLORS.brightBlue}${ICONS.sparkles} SMART PROJECT INTELLIGENCE${COLORS.reset}   ${COLORS.brightCyan}${COLORS.bold}║${COLORS.reset}`);
  lines.push(`${COLORS.brightCyan}${COLORS.bold}╚══════════════════════════════════════════════════════════════════════════╝${COLORS.reset}`);
  lines.push('');

  // Project info bar
  const projectInfo = `${ICONS.folder} ${data.project.name}  ${COLORS.dim}|${COLORS.reset}  ${ICONS.target} Phase ${data.project.phase}  ${COLORS.dim}|${COLORS.reset}  ${ICONS.chart} ${data.project.scale}`;
  lines.push(`  ${projectInfo}`);

  // Tech stack
  const techStr = data.project.techStack.length > 0
    ? data.project.techStack.slice(0, 4).join(' + ')
    : 'No tech detected';
  lines.push(`  ${COLORS.dim}Tech:${COLORS.reset} ${techStr}`);
  lines.push('');

  // Intent & Confidence bar
  const confidenceColor = {
    high: COLORS.green,
    medium: COLORS.yellow,
    low: COLORS.red,
  }[data.confidence] || COLORS.white;

  const confidenceIcon = {
    high: ICONS.trophy,
    medium: ICONS.star,
    low: ICONS.warning,
  }[data.confidence] || ICONS.info;

  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Intent:${COLORS.reset} ${COLORS.cyan}${data.intent}${COLORS.reset}    ${COLORS.brightWhite}${COLORS.bold}Confidence:${COLORS.reset} ${confidenceColor}${confidenceIcon} ${data.confidence.toUpperCase()}${COLORS.reset}`);
  lines.push('');

  // Skills section
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}${drawLine(60, 'heavy')}${COLORS.reset}`);
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}${ICONS.check} KEYWORD-MATCHED (Auto-invoked)${COLORS.reset}`);
  lines.push(`  ${COLORS.dim}${drawLine(60, 'single')}${COLORS.reset}`);

  const keywordSkills = data.skills.filter(s => s.selected);
  const otherSkills = data.skills.filter(s => !s.selected);

  if (keywordSkills.length === 0) {
    lines.push(`  ${COLORS.dim}  No keyword matches${COLORS.reset}`);
  } else {
    for (const skill of keywordSkills.slice(0, 5)) {
      const bar = drawProgressBar(skill.score ?? 0, 100, 25);
      const confIcon = skill.confidence === 'high' ? COLORS.green : skill.confidence === 'medium' ? COLORS.yellow : COLORS.red;
      const checkbox = `${COLORS.green}${ICONS.check}${COLORS.reset}`;
      const name = skill.name ?? 'unknown';
      lines.push(`  ${checkbox} ${COLORS.cyan}/${name.padEnd(18)}${bar} ${(skill.score ?? 0).toString().padStart(3)}%  ${confIcon}${(skill.confidence ?? 'low').toUpperCase()}${COLORS.reset}`);
    }
  }

  lines.push('');
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}${drawLine(60, 'heavy')}${COLORS.reset}`);
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}${ICONS.star} RECOMMENDED${COLORS.reset}`);
  lines.push(`  ${COLORS.dim}${drawLine(60, 'single')}${COLORS.reset}`);

  if (otherSkills.length === 0) {
    lines.push(`  ${COLORS.dim}  No recommendations${COLORS.reset}`);
  } else {
    for (const skill of otherSkills.slice(0, 5)) {
      const bar = drawProgressBar(skill.score ?? 0, 100, 25);
      const confIcon = skill.confidence === 'high' ? COLORS.green : skill.confidence === 'medium' ? COLORS.yellow : COLORS.red;
      const name = skill.name ?? 'unknown';
      lines.push(`  ${COLORS.dim}[ ]${COLORS.reset} ${COLORS.white}/${name.padEnd(18)}${bar} ${(skill.score ?? 0).toString().padStart(3)}%  ${confIcon}${(skill.confidence ?? 'low').toUpperCase()}${COLORS.reset}`);
    }
  }

  lines.push('');
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}${drawLine(60, 'heavy')}${COLORS.reset}`);
  lines.push(`  ${COLORS.dim}  ${ICONS.arrow} Select [1-5] to toggle  ${COLORS.dim}|${COLORS.reset}  ${COLORS.cyan}[Enter] Invoke & Continue${COLORS.reset}  ${COLORS.dim}|${COLORS.reset}  ${COLORS.brightYellow}[Q] Quit${COLORS.reset}`);

  return lines.join('\n');
}

/**
 * Draw quick actions menu
 */
export function drawQuickActions(): string {
  const width = 50;
  const lines: string[] = [];

  lines.push('');
  lines.push(`${COLORS.brightMagenta}${COLORS.bold}╔══════════════════════════════════════════╗${COLORS.reset}`);
  lines.push(`${COLORS.brightMagenta}${COLORS.bold}║${COLORS.reset}  ${COLORS.brightMagenta}${ICONS.brain} SMART ACTIONS${COLORS.reset}                    ${COLORS.brightMagenta}${COLORS.bold}║${COLORS.reset}`);
  lines.push(`${COLORS.brightMagenta}${COLORS.bold}╚══════════════════════════════════════════╝${COLORS.reset}`);
  lines.push('');

  const actions = [
    { key: '1', icon: ICONS.rocket, name: 'New Project', desc: 'Start a new project' },
    { key: '2', icon: ICONS.chart, name: 'Analyze', desc: 'Analyze existing project' },
    { key: '3', icon: ICONS.sparkles, name: 'Workflow', desc: 'Run workflow template' },
    { key: '4', icon: ICONS.gear, name: 'Settings', desc: 'Configure auto-router' },
    { key: '5', icon: ICONS.folder, name: 'Browse', desc: 'Select project folder' },
  ];

  for (const action of actions) {
    lines.push(`  ${COLORS.brightCyan}[${action.key}]${COLORS.reset} ${action.icon} ${COLORS.white}${action.name.padEnd(15)}${COLORS.reset} ${COLORS.dim}-${COLORS.reset} ${COLORS.brightWhite}${action.desc}${COLORS.reset}`);
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Draw skill detail view
 */
export function drawSkillDetail(skill: SkillDisplay): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(`${COLORS.brightGreen}${COLORS.bold}╔════════════════════════════════════════════════════════════╗${COLORS.reset}`);
  lines.push(`${COLORS.brightGreen}${COLORS.bold}║${COLORS.reset}  ${COLORS.brightGreen}${ICONS.check} SELECTED SKILL${COLORS.reset}                                         ${COLORS.brightGreen}${COLORS.bold}║${COLORS.reset}`);
  lines.push(`${COLORS.brightGreen}${COLORS.bold}╚════════════════════════════════════════════════════════════╝${COLORS.reset}`);
  lines.push('');

  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Name:${COLORS.reset}        ${COLORS.cyan}/${skill.name}${COLORS.reset}`);
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Description:${COLORS.reset}  ${skill.description}`);
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Category:${COLORS.reset}     ${COLORS.yellow}${skill.category}${COLORS.reset}`);
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Score:${COLORS.reset}        ${drawProgressBar(skill.score, 100, 30)} ${skill.score}%`);
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Confidence:${COLORS.reset}    ${skill.confidence === 'high' ? COLORS.green : skill.confidence === 'medium' ? COLORS.yellow : COLORS.red}${skill.confidence.toUpperCase()}${COLORS.reset}`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Draw project status view
 */
export function drawProjectStatus(data: {
  name: string;
  path: string;
  phase: number;
  scale: string;
  activeSkills: string[];
  lastAnalyzed: string;
}): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(`${COLORS.brightBlue}${COLORS.bold}╔════════════════════════════════════════════════════════════╗${COLORS.reset}`);
  lines.push(`${COLORS.brightBlue}${COLORS.bold}║${COLORS.reset}  ${COLORS.brightBlue}${ICONS.chart} PROJECT STATUS${COLORS.reset}                                        ${COLORS.brightBlue}${COLORS.bold}║${COLORS.reset}`);
  lines.push(`${COLORS.brightBlue}${COLORS.bold}╚════════════════════════════════════════════════════════════╝${COLORS.reset}`);
  lines.push('');

  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Project:${COLORS.reset}     ${COLORS.cyan}${data.name}${COLORS.reset}`);
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Path:${COLORS.reset}       ${COLORS.dim}${data.path}${COLORS.reset}`);
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Phase:${COLORS.reset}      ${COLORS.yellow}${data.phase}${COLORS.reset}`);
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Scale:${COLORS.reset}      ${COLORS.magenta}${data.scale}${COLORS.reset}`);
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Last Analyzed:${COLORS.reset} ${COLORS.dim}${data.lastAnalyzed}${COLORS.reset}`);
  lines.push('');
  lines.push(`  ${COLORS.brightWhite}${COLORS.bold}Active Skills:${COLORS.reset}`);

  if (data.activeSkills.length === 0) {
    lines.push(`  ${COLORS.dim}  No active skills${COLORS.reset}`);
  } else {
    for (const skill of data.activeSkills) {
      lines.push(`  ${COLORS.green}${ICONS.check}${COLORS.reset} ${COLORS.cyan}/${skill}${COLORS.reset}`);
    }
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Draw loading animation
 */
export function drawLoading(message: string): string {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const frame = frames[Math.floor(Date.now() / 100) % frames.length];
  return `${COLORS.cyan}${frame}${COLORS.reset} ${message}`;
}

/**
 * Draw success message
 */
export function drawSuccess(message: string): string {
  return `${COLORS.green}${ICONS.check} ${COLORS.bold}${message}${COLORS.reset}`;
}

/**
 * Draw error message
 */
export function drawError(message: string): string {
  return `${COLORS.red}${ICONS.cross} ${COLORS.bold}${message}${COLORS.reset}`;
}

/**
 * Draw info message
 */
export function drawInfo(message: string): string {
  return `${COLORS.blue}${ICONS.info} ${message}${COLORS.reset}`;
}

/**
 * Draw warning message
 */
export function drawWarning(message: string): string {
  return `${COLORS.yellow}${ICONS.warning} ${message}${COLORS.reset}`;
}

/**
 * Clear terminal screen
 */
export function clearScreen(): void {
  process.stdout.write('\x1b[2J\x1b[H');
}

/**
 * Move cursor to top-left
 */
export function moveToTop(): void {
  process.stdout.write('\x1b[H');
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date for display
 */
export function formatDate(isoString: string): string {
  if (!isoString) return 'Unknown';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Unknown';
  }
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 3) + '...';
}

/**
 * Format skill list for display
 */
export function formatSkillList(skills: SkillDisplay[]): string[] {
  return skills.map((skill, i) => {
    const bar = drawProgressBar(skill.score, 100, 20);
    const confIcon = skill.confidence === 'high' ? COLORS.green : skill.confidence === 'medium' ? COLORS.yellow : COLORS.red;
    const checkbox = skill.selected ? `${COLORS.green}${ICONS.check}${COLORS.reset}` : `${COLORS.dim}[ ]${COLORS.reset}`;

    return `  ${(i + 1).toString().padStart(2)}. ${checkbox} ${COLORS.cyan}/${skill.name.padEnd(15)} ${bar} ${skill.score}%  ${confIcon}${skill.confidence.toUpperCase()}${COLORS.reset}`;
  });
}
