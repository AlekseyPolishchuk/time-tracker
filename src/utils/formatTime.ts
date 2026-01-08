import { SECONDS_IN_HOUR, SECONDS_IN_MINUTE, TIME_PAD_CHAR, TIME_PAD_LENGTH, TIME_SEPARATOR } from '../constants';

export function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / SECONDS_IN_HOUR);
    const minutes = Math.floor((totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
    const seconds = totalSeconds % SECONDS_IN_MINUTE;

    return [hours, minutes, seconds]
        .map(val => val.toString().padStart(TIME_PAD_LENGTH, TIME_PAD_CHAR))
        .join(TIME_SEPARATOR);
}
