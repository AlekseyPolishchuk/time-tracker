export interface Tracker {
    id: number;
    name: string;
    time: number;
    createdAt: string;
}

export interface Note {
    id: number;
    content: string;
    createdAt: string;
}

export interface TimerProps {
    time: number;
    setTime: React.Dispatch<React.SetStateAction<number>>;
    isRunning: boolean;
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IconProps {
    size?: number;
}
