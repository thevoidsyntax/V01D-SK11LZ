import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  drawDashboard,
  drawProgressBar,
  drawInfo,
  drawError,
  drawSuccess,
  formatDate,
  truncate,
  COLORS
} from './smart-ui';

describe('smart-ui.ts', () => {
  describe('COLORS', () => {
    it('should have all required color constants', () => {
      expect(COLORS).toHaveProperty('reset');
      expect(COLORS).toHaveProperty('red');
      expect(COLORS).toHaveProperty('green');
      expect(COLORS).toHaveProperty('yellow');
      expect(COLORS).toHaveProperty('blue');
      expect(COLORS).toHaveProperty('cyan');
      expect(COLORS).toHaveProperty('magenta');
    });

    it('should have bright variants', () => {
      expect(COLORS).toHaveProperty('brightRed');
      expect(COLORS).toHaveProperty('brightGreen');
      expect(COLORS).toHaveProperty('brightYellow');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const long = 'a'.repeat(100);
      const result = truncate(long, 50);

      expect(result.length).toBe(50);
      expect(result).toContain('...');
    });

    it('should not truncate short strings', () => {
      const short = 'hello';
      const result = truncate(short, 10);

      expect(result).toBe(short);
    });

    it('should handle exact length strings', () => {
      const exact = 'hello';
      const result = truncate(exact, 5);

      expect(result).toBe(exact);
    });

    it('should handle zero maxLength', () => {
      const result = truncate('hello', 0);

      expect(result).toBe('...');
    });

    it('should handle negative maxLength', () => {
      const result = truncate('hello', -5);

      expect(result).toBe('...');
    });

    it('should handle empty string', () => {
      const result = truncate('', 10);

      expect(result).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format valid ISO date', () => {
      const result = formatDate('2024-01-15T10:30:00Z');

      expect(result).not.toBe('Unknown');
      expect(result).not.toBe('');
    });

    it('should return Unknown for invalid date', () => {
      const result = formatDate('not-a-date');

      expect(result).toBe('Unknown');
    });

    it('should return Unknown for empty string', () => {
      const result = formatDate('');

      expect(result).toBe('Unknown');
    });

    it('should handle Date object', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date.toISOString());

      expect(result).not.toBe('Unknown');
    });
  });

  describe('drawProgressBar', () => {
    it('should draw progress bar with percentage', () => {
      const result = drawProgressBar(50, 100, 40);

      expect(result).toContain('50%');
    });

    it('should handle zero max value', () => {
      const result = drawProgressBar(0, 0, 40);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle negative value', () => {
      const result = drawProgressBar(-10, 100, 40);

      expect(result).toBeDefined();
    });

    it('should handle zero width', () => {
      const result = drawProgressBar(50, 100, 0);

      expect(result).toBeDefined();
    });

    it('should cap at 100%', () => {
      const result = drawProgressBar(150, 100, 40);

      expect(result).toContain('100%');
    });

    it('should show 0% for negative values', () => {
      const result = drawProgressBar(-10, 100, 40);

      expect(result).toContain('0%');
    });
  });

  describe('drawInfo', () => {
    it('should return a string', () => {
      const result = drawInfo('Test message');

      expect(typeof result).toBe('string');
    });

    it('should include the message', () => {
      const result = drawInfo('Test message');

      expect(result).toContain('Test message');
    });
  });

  describe('drawError', () => {
    it('should return a string', () => {
      const result = drawError('Error occurred');

      expect(typeof result).toBe('string');
    });

    it('should include the error message', () => {
      const result = drawError('Something went wrong');

      expect(result).toContain('Something went wrong');
    });
  });

  describe('drawSuccess', () => {
    it('should return a string', () => {
      const result = drawSuccess('Operation completed');

      expect(typeof result).toBe('string');
    });

    it('should include the success message', () => {
      const result = drawSuccess('All tests passed');

      expect(result).toContain('All tests passed');
    });
  });

  describe('drawDashboard', () => {
    it('should return a string', () => {
      const result = drawDashboard({
        totalSkills: 50,
        autoInvoked: 10,
        recommended: 20,
        confidence: 'high'
      });

      expect(typeof result).toBe('string');
    });

    it('should include skill counts', () => {
      const result = drawDashboard({
        totalSkills: 50,
        autoInvoked: 10,
        recommended: 20,
        confidence: 'high'
      });

      expect(result).toContain('50');
      expect(result).toContain('10');
      expect(result).toContain('20');
    });

    it('should include confidence level', () => {
      const result = drawDashboard({
        totalSkills: 50,
        autoInvoked: 10,
        recommended: 20,
        confidence: 'high'
      });

      expect(result).toContain('HIGH');
    });

    it('should handle all confidence levels', () => {
      const highResult = drawDashboard({ totalSkills: 50, autoInvoked: 10, recommended: 20, confidence: 'high' });
      const medResult = drawDashboard({ totalSkills: 50, autoInvoked: 10, recommended: 20, confidence: 'medium' });
      const lowResult = drawDashboard({ totalSkills: 50, autoInvoked: 10, recommended: 20, confidence: 'low' });

      expect(highResult).toContain('HIGH');
      expect(medResult).toContain('MEDIUM');
      expect(lowResult).toContain('LOW');
    });

    it('should handle zero values', () => {
      const result = drawDashboard({
        totalSkills: 0,
        autoInvoked: 0,
        recommended: 0,
        confidence: 'low'
      });

      expect(typeof result).toBe('string');
    });
  });
});
