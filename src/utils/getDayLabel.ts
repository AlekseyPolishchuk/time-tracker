import { DAY_LABELS, WEEKDAY_NAMES } from '../constants';

export function getDayLabel(daysAgo: number): string {
    if (daysAgo === 0) return DAY_LABELS.TODAY;
    if (daysAgo === 1) return DAY_LABELS.YESTERDAY;

    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return WEEKDAY_NAMES[date.getDay()];
}
