import { describe, it, expect } from 'vitest';
import { getDayLabel } from '../../src/utils/getDayLabel';

describe('getDayLabel', () => {
    it('returns "Today" for 0', () => {
        expect(getDayLabel(0)).toBe('Today');
    });

    it('returns "Yesterday" for 1', () => {
        expect(getDayLabel(1)).toBe('Yesterday');
    });

    it('returns weekday name for other values', () => {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Check that for 2-6 days ago it returns a valid day name
        for (let daysAgo = 2; daysAgo <= 6; daysAgo++) {
            const label = getDayLabel(daysAgo);
            expect(weekdays).toContain(label);
        }
    });

    it('returns correct day name for specific date', () => {
        // Create a date and check that getDayLabel returns the correct day
        const today = new Date();
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);

        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const expectedDay = weekdays[twoDaysAgo.getDay()];

        expect(getDayLabel(2)).toBe(expectedDay);
    });
});
