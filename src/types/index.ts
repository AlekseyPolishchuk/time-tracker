export interface Tracker {
    id: number;
    name: string;
    time: number;
    createdAt: string;
}

export interface TimerProps {
    time: number;
    setTime: React.Dispatch<React.SetStateAction<number>>;
    isRunning: boolean;
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TrackerItemProps {
    tracker: Tracker;
    onUpdate: (id: number, updates: Partial<Tracker>) => void;
    onDelete: (id: number) => void;
}

export interface TrackerListProps {
    trackers: Tracker[];
    onUpdate: (id: number, updates: Partial<Tracker>) => void;
    onDelete: (id: number) => void;
}

export interface IconProps {
    size?: number;
}
