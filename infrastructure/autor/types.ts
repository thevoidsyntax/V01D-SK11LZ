/**
 * AUTO-ROUTER v10.0 - Enhanced Type Definitions
 *
 * Comprehensive type definitions for quality analysis, gap detection,
 * health scoring, and actionable recommendations.
 */

// ============================================================================
// CORE TYPES
// ============================================================================

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

// ============================================================================
// v10.0 NEW TYPES: QUALITY ANALYSIS
// ============================================================================

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface QualityMetrics {
  typeSafety: number;           // 0-100: TypeScript strictness score
  testCoverage: number;        // 0-100: Estimated test coverage
  lintingScore: number;         // 0-100: Linting compliance
  complexityScore: number;      // 0-100: Code complexity (higher = worse)
  overall: number;             // 0-100: Weighted overall quality
}

export interface QualityIssue {
  id: string;
  severity: SeverityLevel;
  category: 'type-safety' | 'linting' | 'complexity' | 'testing' | 'security' | 'performance';
  title: string;
  description: string;
  file?: string;
  line?: number;
  suggestion: string;
  effort: '5min' | '15min' | '1hour' | 'half-day' | 'day+';
  autoFixable: boolean;
}

export interface TypeSafetyDetails {
  anyTypeCount: number;
  unknownTypeCount: number;
  missingReturnTypes: number;
  nonNullAssertions: number;
  totalInterfaces: number;
  totalTypeAliases: number;
}

// ============================================================================
// v10.0 NEW TYPES: GAP ANALYSIS
// ============================================================================

export interface GapAnalysis {
  missing: GapItem[];
  warnings: GapItem[];
  recommendations: string[];
}

export interface GapItem {
  id: string;
  category: GapCategory;
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  bestPractice: string;
  howToFix: string;
  skill?: string;
}

export type GapCategory =
  | 'security'
  | 'observability'
  | 'error-handling'
  | 'testing'
  | 'performance'
  | 'configuration'
  | 'documentation'
  | 'infrastructure'
  | 'patterns';

export interface ProductionReadiness {
  healthEndpoint: boolean;
  gracefulShutdown: boolean;
  structuredLogging: boolean;
  errorBoundaries: boolean;
  rateLimiting: boolean;
  corsConfiguration: boolean;
  environmentValidation: boolean;
  inputValidation: boolean;
  rate: number;  // 0-100: Production readiness score
}

// ============================================================================
// v10.0 NEW TYPES: TECH DEBT
// ============================================================================

export interface TechDebtAnalysis {
  outdatedPackages: PackageIssue[];
  deprecatedAPIs: DeprecatedAPI[];
  securityVulnerabilities: Vulnerability[];
  totalDebtScore: number;  // 0-100: Higher = more debt
  estimatedFixTime: string;
}

export interface PackageIssue {
  name: string;
  currentVersion: string;
  latestVersion: string;
  severity: SeverityLevel;
  breakingChange: boolean;
  updateCommand: string;
}

export interface DeprecatedAPI {
  file: string;
  line: number;
  deprecatedItem: string;
  replacement: string;
  urgency: SeverityLevel;
}

export interface Vulnerability {
  id: string;
  package: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  fixCommand: string;
  cweId?: string;
}

// ============================================================================
// v10.0 NEW TYPES: PROJECT PHASE
// ============================================================================

export type ProjectPhase = 'mvp' | 'growth' | 'scale' | 'enterprise';

export interface ProjectContext {
  phase: ProjectPhase;
  confidence: number;          // 0-1: Detection confidence
  indicators: string[];       // What led to this detection
  teamSize: 'solo' | 'small' | 'medium' | 'large';
  estimatedUsers: 'few' | 'hundreds' | 'thousands' | 'millions';
  features: number;           // Approximate feature count
  age: 'new' | 'weeks' | 'months' | 'years';
}

export interface PhaseRecommendation {
  currentPhase: ProjectPhase;
  targetPhase: ProjectPhase;
  priorities: string[];
  skillSuggestions: string[];
  quickWins: QuickWin[];
}

export interface QuickWin {
  title: string;
  description: string;
  command?: string;
  skill?: string;
  impact: 'high' | 'medium' | 'low';
  effort: '5min' | '15min' | '1hour';
}

// ============================================================================
// v10.0 NEW TYPES: HEALTH SCORE
// ============================================================================

export interface HealthScore {
  overall: number;            // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  categories: HealthCategory[];
  trend?: 'improving' | 'stable' | 'declining';
  lastChecked: string;
}

export interface HealthCategory {
  name: string;
  score: number;             // 0-100
  weight: number;            // Contribution to overall
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  issues: QualityIssue[];
}

export interface HealthCheck {
  name: string;
  category: string;
  passed: boolean;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// v10.0 NEW TYPES: ACTIONABLE RECOMMENDATIONS
// ============================================================================

export interface Recommendation {
  id: string;
  priority: SeverityLevel;
  category: GapCategory;
  title: string;
  description: string;
  action: RecommendationAction;
  skills?: string[];
  prerequisites?: string[];
  estimatedTime: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
}

export interface RecommendationAction {
  type: 'command' | 'skill' | 'file' | 'manual';
  value: string;
  description?: string;
}

export interface RecommendationsSummary {
  critical: Recommendation[];
  high: Recommendation[];
  medium: Recommendation[];
  low: Recommendation[];
  quickWins: QuickWin[];
  totalIssues: number;
  estimatedTotalTime: string;
}

// ============================================================================
// v10.0 NEW TYPES: SECURITY ANALYSIS
// ============================================================================

export interface SecurityAnalysis {
  score: number;              // 0-100
  criticalVulnerabilities: Vulnerability[];
  securityHeaders: SecurityHeader[];
  authentication: AuthStatus;
  authorization: AuthzStatus;
  inputValidation: ValidationStatus;
  dependencies: DepSecurity;
}

export interface SecurityHeader {
  name: string;
  present: boolean;
  value?: string;
  recommendation?: string;
}

export interface AuthStatus {
  implemented: boolean;
  method?: 'jwt' | 'session' | 'oauth' | 'api-key' | 'other';
  issues: string[];
}

export interface AuthzStatus {
  implemented: boolean;
  rbac: boolean;
  resourceLevel: boolean;
  issues: string[];
}

export interface ValidationStatus {
  inputValidation: boolean;
  outputEncoding: boolean;
  sqlInjection: boolean;
  xss: boolean;
  csrf: boolean;
  issues: string[];
}

export interface DepSecurity {
  totalPackages: number;
  vulnerablePackages: number;
  outdatedPackages: number;
  licenseIssues: number;
}

// ============================================================================
// v10.0 NEW TYPES: ENHANCED DETECTION RESULT
// ============================================================================

export interface EnhancedDetectionResult extends DetectionResult {
  // New v10.0 fields
  qualityMetrics?: QualityMetrics;
  qualityIssues?: QualityIssue[];
  gapAnalysis?: GapAnalysis;
  productionReadiness?: ProductionReadiness;
  techDebtAnalysis?: TechDebtAnalysis;
  projectContext?: ProjectContext;
  healthScore?: HealthScore;
  securityAnalysis?: SecurityAnalysis;
  recommendations?: RecommendationsSummary;
  skills: string[];           // Required skills based on analysis
  enhancedSkills: string[];   // Skills with priority levels
}

// ============================================================================
// v10.0 NEW TYPES: MODULE EXPORTS (for internal use)
// ============================================================================

// Re-export for quality-analyzer.ts
export type { HealthScoreInput } from './health-scorer';
export type { TechDebtInput } from './tech-debt-analyzer';
export type { PhaseDetectionInput } from './phase-detector';
export type { RecommendationInput } from './recommendation-engine';

// ============================================================================
// v10.0 NEW TYPES: ANALYSIS REPORT
// ============================================================================

export interface AnalysisReport {
  timestamp: string;
  project: {
    name: string;
    path: string;
    phase: ProjectPhase;
  };
  summary: {
    healthScore: number;
    healthGrade: 'A' | 'B' | 'C' | 'D' | 'F';
    totalIssues: number;
    criticalIssues: number;
    techDebtScore: number;
    productionReady: boolean;
  };
  sections: {
    techStack: TechStack;
    quality: QualityMetrics;
    gaps: GapAnalysis;
    techDebt: TechDebtAnalysis;
    security: SecurityAnalysis;
    production: ProductionReadiness;
    recommendations: RecommendationsSummary;
  };
  skills: {
    required: string[];
    recommended: string[];
    optional: string[];
  };
  output: ReportOutput;
}

export interface ReportOutput {
  format: 'full' | 'summary' | 'critical' | 'skills-only';
  style: 'terminal' | 'markdown' | 'json';
  sections: string[];
}
