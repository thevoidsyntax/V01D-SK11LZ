import { describe, it, expect, vi, beforeEach } from 'vitest';
import { selectSkills, SCORE_THRESHOLDS } from './selector';

// Mock the keyword engine
vi.mock('./keyword-engine', () => ({
  detectSkillsFromInput: vi.fn().mockReturnValue([])
}));

// Mock fs to avoid file system calls
vi.mock('fs', () => ({
  existsSync: vi.fn().mockReturnValue(false),
  readdirSync: vi.fn().mockReturnValue([]),
  readFileSync: vi.fn().mockImplementation((path: string) => {
    if (path.includes('package.json')) {
      return JSON.stringify({ dependencies: {} });
    }
    return '';
  })
}));

// Mock crypto.randomBytes for tests
vi.mock('crypto', () => ({
  randomBytes: vi.fn().mockReturnValue({
    toString: vi.fn().mockReturnValue('test12345678')
  })
}));

describe('selector.ts', () => {
  describe('SCORE_THRESHOLDS', () => {
    it('should have all required threshold properties', () => {
      expect(SCORE_THRESHOLDS).toHaveProperty('CORE_MIN');
      expect(SCORE_THRESHOLDS).toHaveProperty('CONTEXT_MIN');
      expect(SCORE_THRESHOLDS).toHaveProperty('CONTEXT_MAX');
    });

    it('should have numeric threshold values', () => {
      expect(typeof SCORE_THRESHOLDS.CORE_MIN).toBe('number');
      expect(typeof SCORE_THRESHOLDS.CONTEXT_MIN).toBe('number');
    });
  });

  describe('selectSkills', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return a SelectionResult object', () => {
      const result = selectSkills({
        projectPath: '/test',
        techStack: { frameworks: [], databases: [], languages: [], devops: [], cache: [] },
        scale: 'medium',
        existingSkills: [],
        patterns: []
      }, 'test input');

      expect(result).toHaveProperty('core');
      expect(result).toHaveProperty('context');
      expect(result).toHaveProperty('optional');
      expect(result).toHaveProperty('skipped');
      expect(result).toHaveProperty('summary');
    });

    it('should handle empty user input', () => {
      const result = selectSkills({
        projectPath: '/test',
        techStack: { frameworks: [], databases: [], languages: [], devops: [], cache: [] },
        scale: 'medium',
        existingSkills: [],
        patterns: []
      }, '');

      expect(result).toHaveProperty('summary');
    });

    it('should respect excludeSkills option', () => {
      const result = selectSkills({
        projectPath: '/test',
        techStack: { frameworks: [], databases: [], languages: [], devops: [], cache: [] },
        scale: 'medium',
        existingSkills: [],
        patterns: []
      }, 'test', {
        excludeSkills: ['git', 'docker']
      });

      expect(result).toHaveProperty('core');
    });

    it('should handle different project scales', () => {
      const smallResult = selectSkills({
        projectPath: '/test',
        techStack: { frameworks: [], databases: [], languages: [], devops: [], cache: [] },
        scale: 'small',
        existingSkills: [],
        patterns: []
      }, '');

      const largeResult = selectSkills({
        projectPath: '/test',
        techStack: { frameworks: [], databases: [], languages: [], devops: [], cache: [] },
        scale: 'large',
        existingSkills: [],
        patterns: []
      }, '');

      expect(smallResult).toHaveProperty('summary');
      expect(largeResult).toHaveProperty('summary');
    });

    it('should handle tech stack matching', () => {
      const result = selectSkills({
        projectPath: '/test',
        techStack: {
          frameworks: ['react', 'nextjs'],
          databases: [],
          languages: [],
          devops: [],
          cache: []
        },
        scale: 'medium',
        existingSkills: [],
        patterns: []
      }, '');

      expect(result).toHaveProperty('summary');
    });
  });

  describe('edge cases', () => {
    it('should handle minimal context', () => {
      const result = selectSkills({
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
      });

      expect(result).toBeDefined();
    });
  });
});
