import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_TIME, STORAGE_KEY_NAME } from '../constants';
import type { Note, Tracker } from '../types';

interface StoreState {
    // State
    trackers: Tracker[];
    notes: Note[];
    currentTime: number;
    isRunning: boolean;

    // Tracker actions
    addTracker: (name: string) => void;
    updateTracker: (id: number, updates: Partial<Tracker>) => void;
    deleteTracker: (id: number) => void;
    clearAllTrackers: () => void;

    // Note actions
    addNote: (content: string) => void;
    updateNote: (id: number, content: string) => void;
    deleteNote: (id: number) => void;

    // Timer actions
    setCurrentTime: (time: number) => void;
    setIsRunning: (isRunning: boolean) => void;
    resetTimer: () => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            // Initial state
            trackers: [],
            notes: [],
            currentTime: INITIAL_TIME,
            isRunning: false,

            // Tracker actions
            addTracker: (name) =>
                set((state) => ({
                    trackers: [
                        {
                            id: Date.now(),
                            name,
                            time: state.currentTime,
                            createdAt: new Date().toISOString()
                        },
                        ...state.trackers
                    ],
                    currentTime: INITIAL_TIME,
                    isRunning: false
                })),

            updateTracker: (id, updates) =>
                set((state) => ({
                    trackers: state.trackers.map((tracker) => (tracker.id === id ? { ...tracker, ...updates } : tracker))
                })),

            deleteTracker: (id) =>
                set((state) => ({
                    trackers: state.trackers.filter((tracker) => tracker.id !== id)
                })),

            clearAllTrackers: () => set({ trackers: [] }),

            // Note actions
            addNote: (content) =>
                set((state) => ({
                    notes: [
                        {
                            id: Date.now(),
                            content,
                            createdAt: new Date().toISOString()
                        },
                        ...state.notes
                    ]
                })),

            updateNote: (id, content) =>
                set((state) => ({
                    notes: state.notes.map((note) => (note.id === id ? { ...note, content } : note))
                })),

            deleteNote: (id) =>
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id)
                })),

            // Timer actions
            setCurrentTime: (time) => set({ currentTime: time }),
            setIsRunning: (isRunning) => set({ isRunning }),
            resetTimer: () => set({ currentTime: INITIAL_TIME, isRunning: false })
        }),
        {
            name: STORAGE_KEY_NAME,
            partialize: (state) => ({
                trackers: state.trackers,
                notes: state.notes,
                currentTime: state.currentTime
            }),
            merge: (persistedState, currentState) => ({
                ...currentState,
                ...(persistedState as Partial<StoreState>),
                currentTime: (persistedState as any)?.currentTime ?? INITIAL_TIME
            })
        }
    )
);
