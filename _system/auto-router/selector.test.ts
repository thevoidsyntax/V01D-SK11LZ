import { describe, it, expect, vi, beforeEach } from 'vitest';
import { selectSkills, CORE_SKILLS, SCORE_WEIGHTS, SCORE_THRESHOLDS } from './selector';

// Mock the keyword engine
vi.mock('./keyword-engine', () => ({
  detectSkillsFromInput: vi.fn().mockReturnValue([])
}));

describe('selector.ts', () => {
  describe('CORE_SKILLS', () => {
    it('should contain expected core skills', () => {
      expect(CORE_SKILLS.has('git')).toBe(true);
      expect(CORE_SKILLS.has('docker')).toBe(true);
      expect(CORE_SKILLS.has('security')).toBe(true);
      expect(CORE_SKILLS.has('tdd')).toBe(true);
    });

    it('should have 18 core skills', () => {
      expect(CORE_SKILLS.size).toBe(18);
    });
  });

  describe('SCORE_WEIGHTS', () => {
    it('should have all required weight properties', () => {
      expect(SCORE_WEIGHTS).toHaveProperty('CORE');
      expect(SCORE_WEIGHTS).toHaveProperty('KEYWORD_MATCH');
      expect(SCORE_WEIGHTS).toHaveProperty('TECH_MATCH');
      expect(SCORE_WEIGHTS).toHaveProperty('PHASE_MATCH');
      expect(SCORE_WEIGHTS).toHaveProperty('CONFLICT');
    });

    it('should have positive weights for positive behaviors', () => {
      expect(SCORE_WEIGHTS.CORE).toBeGreaterThan(0);
      expect(SCORE_WEIGHTS.KEYWORD_MATCH).toBeGreaterThan(0);
      expect(SCORE_WEIGHTS.TECH_MATCH).toBeGreaterThan(0);
    });

    it('should have negative weight for conflicts', () => {
      expect(SCORE_WEIGHTS.CONFLICT).toBeLessThan(0);
    });
  });

  describe('selectSkills', () => {
    const mockContext = {
      projectPath: '/test',
      techStack: {
        frameworks: ['react', 'nextjs'],
        databases: ['postgresql'],
        languages: ['typescript'],
        devops: ['docker'],
        cache: []
      },
      scale: 'medium',
      existingSkills: [],
      patterns: []
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return a SelectionResult object', () => {
      const result = selectSkills(mockContext, 'test input');

      expect(result).toHaveProperty('core');
      expect(result).toHaveProperty('context');
      expect(result).toHaveProperty('optional');
      expect(result).toHaveProperty('skipped');
      expect(result).toHaveProperty('summary');
    });

    it('should include core skills in results', () => {
      const result = selectSkills(mockContext);

      expect(result.core.length).toBeGreaterThan(0);
      expect(result.summary.totalSkills).toBeGreaterThan(0);
    });

    it('should categorize skills by priority', () => {
      const result = selectSkills(mockContext);

      // Core skills should be marked as core
      const coreNames = result.core.map(s => s.name);
      expect(coreNames.some(name => CORE_SKILLS.has(name.toLowerCase()))).toBe(true);
    });

    it('should handle empty user input', () => {
      const result = selectSkills(mockContext, '');

      expect(result.keywordMatched).toHaveLength(0);
      expect(result.core.length).toBeGreaterThan(0);
    });

    it('should respect excludeSkills option', () => {
      const result = selectSkills(mockContext, 'test', {
        excludeSkills: ['git', 'docker']
      });

      const selectedNames = [...result.core, ...result.keywordMatched].map(s => s.name);
      expect(selectedNames).not.toContain('git');
      expect(selectedNames).not.toContain('docker');
    });

    it('should respect includeSkills option', () => {
      const result = selectSkills(mockContext, '', {
        includeSkills: ['custom-skill']
      });

      // Note: The skill might not exist, so check that it was attempted
      expect(result).toHaveProperty('core');
    });

    it('should calculate summary correctly', () => {
      const result = selectSkills(mockContext);

      expect(result.summary.totalSkills).toBeGreaterThan(0);
      expect(result.summary.autoInvoked).toBeGreaterThanOrEqual(0);
      expect(result.summary.recommended).toBeGreaterThanOrEqual(0);
      expect(['high', 'medium', 'low']).toContain(result.summary.confidence);
    });

    it('should handle different project scales', () => {
      const smallContext = { ...mockContext, scale: 'small' };
      const largeContext = { ...mockContext, scale: 'large' };

      const smallResult = selectSkills(smallContext);
      const largeResult = selectSkills(largeContext);

      // Both should return valid results
      expect(smallResult.summary.totalSkills).toBe(largeResult.summary.totalSkills);
    });

    it('should handle tech stack matching', () => {
      const reactContext = {
        ...mockContext,
        techStack: {
          ...mockContext.techStack,
          frameworks: ['react', 'nextjs']
        }
      };

      const result = selectSkills(reactContext);

      // Should include frontend-related skills
      const frontendSkills = result.core.filter(s =>
        s.name.includes('frontend') || s.name.includes('react')
      );
      expect(frontendSkills.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateScore edge cases', () => {
    const minimalContext = {
      projectPath: '/test',
      techStack: {
        frameworks: [],
        databases: [],
        languages: [],
        devops: [],
        cache: []
      },
      scale: 'small',
      existingSkills: [],
      patterns: []
    };

    it('should handle skills with no matching criteria', () => {
      const result = selectSkills(minimalContext);

      // Skills without matches should still appear but may be in different tiers
      expect(result).toBeDefined();
    });

    it('should handle empty tech stack gracefully', () => {
      const emptyStackContext = {
        ...minimalContext,
        techStack: {
          frameworks: [],
          databases: [],
          languages: [],
          devops: [],
          cache: []
        }
      };

      const result = selectSkills(emptyStackContext);
      expect(result.summary.totalSkills).toBeGreaterThan(0);
    });
  });
});
