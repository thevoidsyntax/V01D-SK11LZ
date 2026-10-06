/**
 * AUTO-ROUTE v6.0 - Shared Types
 *
 * Centralized type definitions for all modules
 */

export interface TechStack {
  languages: string[];
  frameworks: string[];
  databases: string[];
  devops: string[];
  cache: string[];
  frontend: string[];
}

export interface PhaseInfo {
  current: string;
  number: number;
  total: number;
  status: 'done' | 'in-progress' | 'next' | 'todo';
  requiredSkills: string[];
  completedSkills: string[];
}

export interface DetectionResult {
  isNew: boolean;
  cwd: string;
  projectName: string;
  techStack: TechStack;
  scale: 'mvp' | 'small' | 'medium' | 'large' | 'enterprise';
  phase?: PhaseInfo;
  hasGit: boolean;
  hasCLAUDEmd: boolean;
  hasPackageJson: boolean;
  missingFiles: string[];
  packageManager?: string;
  recentCommits?: number;
  detectedPatterns: string[];
}

export interface KeywordMatch {
  skill: string;
  matchedPhrases: string[];
  score: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface UserPreference {
  skill: string;
  useCount: number;
  lastUsed: string;
  preferred: boolean;
}
