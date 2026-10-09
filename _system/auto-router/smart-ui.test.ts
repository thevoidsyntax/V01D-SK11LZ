import { describe, it, expect } from 'vitest';
import {
  drawInfo,
  drawSuccess,
  drawWarning,
  drawError,
  drawProgressBar,
  drawDashboard,
  formatDate,
  truncate,
} from './smart-ui';

describe('smart-ui.ts', () => {
  describe('drawInfo', () => {
    it('should return a string', () => {
      const result = drawInfo('Test message');
      expect(typeof result).toBe('string');
    });

    it('should contain the message', () => {
      const result = drawInfo('Test message');
      expect(result).toContain('Test message');
    });
  });

  describe('drawSuccess', () => {
    it('should return a string', () => {
      const result = drawSuccess('Test message');
      expect(typeof result).toBe('string');
    });

    it('should include the success message', () => {
      const result = drawSuccess('All tests passed');
      expect(result).toContain('All tests passed');
    });
  });

  describe('drawWarning', () => {
    it('should return a string', () => {
      const result = drawWarning('Test warning');
      expect(typeof result).toBe('string');
    });
  });

  describe('drawError', () => {
    it('should return a string', () => {
      const result = drawError('Test error');
      expect(typeof result).toBe('string');
    });

    it('should include the error message', () => {
      const result = drawError('Something went wrong');
      expect(result).toContain('Something went wrong');
    });
  });

  describe('drawProgressBar', () => {
    it('should return a string', () => {
      const result = drawProgressBar(50, 100);
      expect(typeof result).toBe('string');
    });

    it('should handle negative value', () => {
      const result = drawProgressBar(-10, 100);
      expect(typeof result).toBe('string');
    });

    it('should handle value over 100', () => {
      const result = drawProgressBar(110, 100);
      expect(typeof result).toBe('string');
    });

    it('should handle zero max', () => {
      const result = drawProgressBar(50, 0);
      expect(typeof result).toBe('string');
    });
  });

  describe('drawDashboard', () => {
    const validData = {
      project: {
        name: 'Test Project',
        path: '/test',
        techStack: ['TypeScript', 'React']
      },
      skills: [
        { name: 'git', description: 'Version control', score: 80, selected: true, category: 'core' }
      ],
      intent: 'CREATE',
      confidence: 'high' as const,
      phase: 'foundation'
    };

    it('should return a string', () => {
      const result = drawDashboard(validData);
      expect(typeof result).toBe('string');
    });

    it('should handle all confidence levels', () => {
      const highResult = drawDashboard({ ...validData, confidence: 'high' as const });
      const medResult = drawDashboard({ ...validData, confidence: 'medium' as const });
      const lowResult = drawDashboard({ ...validData, confidence: 'low' as const });

      expect(typeof highResult).toBe('string');
      expect(typeof medResult).toBe('string');
      expect(typeof lowResult).toBe('string');
    });

    it('should return error for missing project', () => {
      const result = drawDashboard({
        project: null as any,
        skills: [],
        intent: '',
        confidence: 'high',
        phase: ''
      });
      expect(result).toContain('Error');
    });
  });

  describe('formatDate', () => {
    it('should format valid ISO date', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      expect(typeof result).toBe('string');
    });

    it('should return Unknown for invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Unknown');
    });

    it('should return Unknown for empty string', () => {
      const result = formatDate('');
      expect(result).toBe('Unknown');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const result = truncate('This is a very long string', 10);
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('should not truncate short strings', () => {
      const result = truncate('Hi', 10);
      expect(result).toBe('Hi');
    });

    it('should add ellipsis', () => {
      const result = truncate('This is a very long string', 10);
      expect(result).toContain('...');
    });
  });
});
