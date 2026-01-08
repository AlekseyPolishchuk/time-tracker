// Time constants
export const MILLISECONDS_IN_SECOND = 1000 as const;
export const SECONDS_IN_MINUTE = 60 as const;
export const SECONDS_IN_HOUR = 3600 as const;
export const TIME_PAD_LENGTH = 2 as const;
export const TIME_PAD_CHAR = '0' as const;
export const TIME_SEPARATOR = ':' as const;
export const INITIAL_TIME = 0 as const;

// Storage
export const STORAGE_KEY_TRACKERS = 'trackers' as const;

// Icon sizes
export const ICON_SIZE = {
    SM: 16,
    MD: 18,
    LG: 20,
    XL: 28
} as const;

// Labels
export const LABELS = {
    APP_TITLE: 'Time Tracker',
    SAVED_TRACKERS: 'Saved Trackers',
    SAVE: 'Save',
    PLAY: 'Play',
    PAUSE: 'Pause',
    RESET: 'Reset',
    DELETE: 'Delete',
    INPUT_PLACEHOLDER: 'Enter tracker name...',
    EMPTY_LIST: 'No saved trackers yet. Add one above!'
} as const;

// Keys
export const KEYBOARD_KEYS = {
    ENTER: 'Enter'
} as const;
