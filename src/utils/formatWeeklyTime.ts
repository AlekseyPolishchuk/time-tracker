import { SECONDS_IN_HOUR, SECONDS_IN_MINUTE, TIME_PAD_CHAR, TIME_PAD_LENGTH } from '../constants';

export function formatWeeklyTime(seconds: number): string {
    const hours = Math.floor(seconds / SECONDS_IN_HOUR);
    const minutes = Math.floor((seconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
    return `${hours}h ${minutes.toString().padStart(TIME_PAD_LENGTH, TIME_PAD_CHAR)}min`;
}
