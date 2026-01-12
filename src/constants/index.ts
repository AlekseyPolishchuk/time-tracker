// Time constants
export const MILLISECONDS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = 3600;
export const TIME_PAD_LENGTH = 2;
export const TIME_PAD_CHAR = '0';
export const TIME_SEPARATOR = ':';
export const INITIAL_TIME = 0;

// Storage
export const STORAGE_KEY_TRACKERS = 'trackers';
export const STORAGE_KEY_NOTES = 'notes';
export const STORAGE_KEY_CURRENT_TIME = 'currentTime';
export const STORAGE_KEY_NAME = 'time-tracker-storage';

// Icon sizes
export const ICON_SIZE = {
    XS: 14,
    SM: 16,
    MD: 18,
    LG: 20,
    XL: 28,
    DEFAULT: 24
} as const;

// Labels
export const LABELS = {
    APP_TITLE: 'Time Tracker',
    SAVED_TRACKERS: 'Saved Trackers',
    PLAY: 'Play',
    PAUSE: 'Pause',
    RESET: 'Reset',
    DELETE: 'Delete',
    INPUT_PLACEHOLDER: 'Enter tracker name...',
    EMPTY_LIST: 'No saved trackers yet. Add one above!',
    ADD_NOTE: 'add note',
    NOTE_PLACEHOLDER: 'Enter note...',
    CLEAR_ALL: 'Clear all',
    CLEAR_ALL_NOTES: 'Clear all',
    CONFIRM_CLEAR_TITLE: 'Clear all trackers?',
    CONFIRM_CLEAR_MESSAGE: 'Are you sure you want to clear all saved trackers? This action cannot be undone.',
    CONFIRM_CLEAR_NOTES_TITLE: 'Clear all notes?',
    CONFIRM_CLEAR_NOTES_MESSAGE: 'Are you sure you want to clear all notes? This action cannot be undone.',
    SAVE_BTN: 'Save',
    CANCEL_BTN: 'Cancel',
    CLOSE: 'Close'
} as const;

// Keys
export const KEYBOARD_KEYS = {
    ENTER: 'Enter',
    ESCAPE: 'Escape'
} as const;

// Date/Time
export const HOURS_IN_DAY = 24;
export const DAYS_IN_WEEK = 7;

// UI
export const MIN_BAR_HEIGHT_PERCENT = 30;
export const PERCENT_MULTIPLIER = 100;
export const MIN_ACTIVITY_FALLBACK = 1;

// Day labels
export const DAY_LABELS = {
    TODAY: 'Today',
    YESTERDAY: 'Yesterday'
} as const;

export const WEEKDAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
] as const;

export const EMPTY_TIME_DISPLAY = '0h 00min';
export const STATS_TITLE = 'Last 7 Days';
