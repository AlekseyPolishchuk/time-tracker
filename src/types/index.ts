export interface Tracker {
    id: number;
    name: string;
    time: number;
    createdAt: string;
}

// Todo item for todo lists
export interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}

// Text note type
export interface TextNote {
    id: number;
    type: 'text';
    content: string;
    createdAt: string;
}

// Todo list note type
export interface TodoListNote {
    id: number;
    type: 'todo';
    title: string;
    items: TodoItem[];
    createdAt: string;
}

// Discriminated union for both note types
export type Note = TextNote | TodoListNote;

// Type guards
export function isTextNote(note: Note): note is TextNote {
    return note.type === 'text';
}

export function isTodoListNote(note: Note): note is TodoListNote {
    return note.type === 'todo';
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
