import { describe, it, expect } from 'vitest';
import { formatTime } from '../../src/utils/formatTime';

describe('formatTime', () => {
    it('formats 0 seconds', () => {
        expect(formatTime(0)).toBe('00:00:00');
    });

    it('formats seconds', () => {
        expect(formatTime(5)).toBe('00:00:05');
        expect(formatTime(45)).toBe('00:00:45');
    });

    it('formats minutes', () => {
        expect(formatTime(60)).toBe('00:01:00');
        expect(formatTime(125)).toBe('00:02:05');
    });

    it('formats hours', () => {
        expect(formatTime(3600)).toBe('01:00:00');
        expect(formatTime(3661)).toBe('01:01:01');
    });

    it('formats many hours', () => {
        expect(formatTime(36000)).toBe('10:00:00');
        expect(formatTime(86399)).toBe('23:59:59');
    });

    it('pads numbers with zeros (padStart works for all)', () => {
        expect(formatTime(3605)).toBe('01:00:05');
        expect(formatTime(305)).toBe('00:05:05');
    });
});
