import { describe, it, expect } from 'vitest';
import { formatWeeklyTime } from '../../src/utils/formatWeeklyTime';

describe('formatWeeklyTime', () => {
    it('formats 0 seconds', () => {
        expect(formatWeeklyTime(0)).toBe('0h 00min');
    });

    it('formats minutes only', () => {
        expect(formatWeeklyTime(60)).toBe('0h 01min');
        expect(formatWeeklyTime(180)).toBe('0h 03min');
        expect(formatWeeklyTime(3540)).toBe('0h 59min');
    });

    it('formats hours and minutes', () => {
        expect(formatWeeklyTime(3600)).toBe('1h 00min');
        expect(formatWeeklyTime(3661)).toBe('1h 01min');
        expect(formatWeeklyTime(7325)).toBe('2h 02min');
    });

    it('pads minutes with zeros', () => {
        expect(formatWeeklyTime(3605)).toBe('1h 00min');
        expect(formatWeeklyTime(3665)).toBe('1h 01min');
    });

    it('ignores seconds', () => {
        expect(formatWeeklyTime(3659)).toBe('1h 00min'); // 1h 0m 59s -> 1h 00min
        expect(formatWeeklyTime(3719)).toBe('1h 01min'); // 1h 1m 59s -> 1h 01min
    });

    it('formats many hours', () => {
        expect(formatWeeklyTime(36000)).toBe('10h 00min');
        expect(formatWeeklyTime(86399)).toBe('23h 59min');
    });
});
