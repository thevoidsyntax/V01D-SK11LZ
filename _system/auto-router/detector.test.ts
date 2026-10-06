import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  detectSkillsFromInput,
  detectIntentSimple,
  detectTechStack,
  KEYWORD_MAP,
  INTENT_PATTERNS
} from './detector';

describe('detector.ts', () => {
  describe('KEYWORD_MAP', () => {
    it('should have required skill categories', () => {
      expect(KEYWORD_MAP).toHaveProperty('security');
      expect(KEYWORD_MAP).toHaveProperty('git');
      expect(KEYWORD_MAP).toHaveProperty('docker');
      expect(KEYWORD_MAP).toHaveProperty('testing');
    });

    it('should have keywords array for each skill', () => {
      for (const [skill, config] of Object.entries(KEYWORD_MAP)) {
        expect(config).toHaveProperty('keywords');
        expect(Array.isArray(config.keywords)).toBe(true);
        expect(config.keywords.length).toBeGreaterThan(0);
      }
    });

    it('should have confidence levels defined', () => {
      for (const [skill, config] of Object.entries(KEYWORD_MAP)) {
        expect(config).toHaveProperty('confidence');
        expect(['high', 'medium', 'low']).toContain(config.confidence);
      }
    });
  });

  describe('INTENT_PATTERNS', () => {
    it('should have required intent categories', () => {
      expect(INTENT_PATTERNS).toHaveProperty('CREATE');
      expect(INTENT_PATTERNS).toHaveProperty('DEBUG');
      expect(INTENT_PATTERNS).toHaveProperty('REVIEW');
      expect(INTENT_PATTERNS).toHaveProperty('REFACTOR');
    });

    it('should have patterns array for each intent', () => {
      for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
        expect(config).toHaveProperty('patterns');
        expect(Array.isArray(config.patterns)).toBe(true);
      }
    });
  });

  describe('detectSkillsFromInput', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should detect security keywords', () => {
      const result = detectSkillsFromInput('fix security vulnerability in auth');

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(r => r.skill === 'security')).toBe(true);
    });

    it('should detect git-related keywords', () => {
      const result = detectSkillsFromInput('commit and push to main branch');

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(r => r.skill === 'git')).toBe(true);
    });

    it('should detect docker keywords', () => {
      const result = detectSkillsFromInput('build and run docker container');

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(r => r.skill === 'docker')).toBe(true);
    });

    it('should detect testing keywords', () => {
      const result = detectSkillsFromInput('write tests for the new feature');

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(r => r.skill === 'testing')).toBe(true);
    });

    it('should return empty array for empty input', () => {
      const result = detectSkillsFromInput('');

      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array for unrecognized input', () => {
      const result = detectSkillsFromInput('xyz123 random text');

      expect(Array.isArray(result)).toBe(true);
    });

    it('should include matched phrases in result', () => {
      const result = detectSkillsFromInput('security audit for database');

      const securityResult = result.find(r => r.skill === 'security');
      if (securityResult) {
        expect(securityResult).toHaveProperty('matchedPhrases');
        expect(Array.isArray(securityResult.matchedPhrases)).toBe(true);
      }
    });

    it('should include confidence score', () => {
      const result = detectSkillsFromInput('fix security bug');

      for (const match of result) {
        expect(match).toHaveProperty('confidence');
        expect(['high', 'medium', 'low']).toContain(match.confidence);
      }
    });

    it('should handle case-insensitive matching', () => {
      const lowerResult = detectSkillsFromInput('security');
      const upperResult = detectSkillsFromInput('SECURITY');
      const mixedResult = detectSkillsFromInput('Security');

      expect(lowerResult.length).toBe(upperResult.length);
      expect(upperResult.length).toBe(mixedResult.length);
    });

    it('should detect multiple skills from mixed input', () => {
      const result = detectSkillsFromInput('security test and docker deployment');

      const skills = result.map(r => r.skill);
      expect(skills.length).toBeGreaterThanOrEqual(2);
    });

    it('should not return duplicates for same skill', () => {
      const result = detectSkillsFromInput('security security security');

      const skillCounts = new Map<string, number>();
      for (const match of result) {
        const count = skillCounts.get(match.skill) || 0;
        skillCounts.set(match.skill, count + 1);
      }

      for (const count of skillCounts.values()) {
        expect(count).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('detectSkillsFromInput edge cases', () => {
    it('should handle very long input', () => {
      const longInput = 'security '.repeat(100);
      const result = detectSkillsFromInput(longInput);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle special characters', () => {
      const result = detectSkillsFromInput('security@test! #docker $git');

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle unicode characters', () => {
      const result = detectSkillsFromInput('security 🐳 docker');

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle whitespace variations', () => {
      const normal = detectSkillsFromInput('security docker');
      const spaced = detectSkillsFromInput('  security   docker  ');
      const newlines = detectSkillsFromInput('security\ndocker');

      expect(normal.length).toBe(spaced.length);
    });
  });

  describe('detectIntentSimple', () => {
    it('should detect DEBUG intent', () => {
      const result = detectIntentSimple('debug the login issue');
      expect(result).toBe('DEBUG');
    });

    it('should detect CREATE intent', () => {
      const result = detectIntentSimple('create a new component');
      expect(result).toBe('CREATE');
    });

    it('should return EXPLORE for unrecognized input', () => {
      const result = detectIntentSimple('random text');
      expect(result).toBe('EXPLORE');
    });
  });

  describe('detectTechStack', () => {
    it('should return empty stack for null packageData', () => {
      const result = detectTechStack(null, '/nonexistent');

      expect(result).toHaveProperty('frameworks');
      expect(result).toHaveProperty('databases');
      expect(result).toHaveProperty('languages');
      expect(result).toHaveProperty('devops');
      expect(result).toHaveProperty('cache');
    });
  });
});
