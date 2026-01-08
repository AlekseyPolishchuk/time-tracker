import type { IconProps } from '../types';

const DEFAULT_ICON_SIZE = 24;

export const PlayIcon = ({ size = DEFAULT_ICON_SIZE }: IconProps) => (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
        <path d='M6 4.75c0-1.14 1.28-1.82 2.22-1.17l12 7.25c.86.52.86 1.82 0 2.34l-12 7.25C7.28 21.07 6 20.39 6 19.25V4.75z' />
    </svg>
);

export const PauseIcon = ({ size = DEFAULT_ICON_SIZE }: IconProps) => (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
        <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' />
    </svg>
);

export const StopIcon = ({ size = DEFAULT_ICON_SIZE }: IconProps) => (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
        <rect x='6' y='6' width='12' height='12' rx='1' />
    </svg>
);

export const ResetIcon = ({ size = DEFAULT_ICON_SIZE }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        xmlns='http://www.w3.org/2000/svg'>
        <path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
        <path d='M3 3v5h5' />
    </svg>
);

export const DeleteIcon = ({ size = DEFAULT_ICON_SIZE }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        xmlns='http://www.w3.org/2000/svg'>
        <path d='M3 6h18' />
        <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
        <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
        <line x1='10' y1='11' x2='10' y2='17' />
        <line x1='14' y1='11' x2='14' y2='17' />
    </svg>
);

export const SaveIcon = ({ size = DEFAULT_ICON_SIZE }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        xmlns='http://www.w3.org/2000/svg'>
        <path d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' />
        <polyline points='17 21 17 13 7 13 7 21' />
        <polyline points='7 3 7 8 15 8' />
    </svg>
);

export const ClockIcon = ({ size = DEFAULT_ICON_SIZE }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        xmlns='http://www.w3.org/2000/svg'>
        <circle cx='12' cy='12' r='10' />
        <polyline points='12 6 12 12 16 14' />
    </svg>
);

export const PlusIcon = ({ size = DEFAULT_ICON_SIZE }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        xmlns='http://www.w3.org/2000/svg'>
        <line x1='12' y1='5' x2='12' y2='19' />
        <line x1='5' y1='12' x2='19' y2='12' />
    </svg>
);

export const CloseIcon = ({ size = DEFAULT_ICON_SIZE }: IconProps) => (
    <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        xmlns='http://www.w3.org/2000/svg'>
        <line x1='18' y1='6' x2='6' y2='18' />
        <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
);
