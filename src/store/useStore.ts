import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_TIME, MILLISECONDS_IN_SECOND, STORAGE_KEY_NAME } from '../constants';
import type { Note, TodoItem, Tracker } from '../types';

export type Theme = 'darkest' | 'night';

interface StoreState {
    // State
    trackers: Tracker[];
    notes: Note[];
    currentTime: number;
    isRunning: boolean;
    startedAt: number | null;
    activeTrackerId: number | null;
    activeTrackerName: string;
    theme: Theme;
    dotColor: string;

    // Theme actions
    setTheme: (theme: Theme) => void;
    setDotColor: (color: string) => void;

    // Tracker actions
    addTracker: (name: string) => void;
    updateTracker: (id: number, updates: Partial<Tracker>) => void;
    deleteTracker: (id: number) => void;
    clearAllTrackers: () => void;
    setActiveTracker: (id: number | null) => void;
    saveTracker: (name: string) => void;
    setActiveTrackerName: (name: string) => void;

    // Note actions
    addNote: (content: string) => void;
    updateNote: (id: number, content: string) => void;
    deleteNote: (id: number) => void;
    clearAllNotes: () => void;

    // Todo list actions
    addTodoList: (title: string, items: TodoItem[]) => void;
    updateTodoListTitle: (noteId: number, title: string) => void;
    addTodoItem: (noteId: number, text: string) => void;
    toggleTodoItem: (noteId: number, itemId: number) => void;
    updateTodoItem: (noteId: number, itemId: number, text: string) => void;
    deleteTodoItem: (noteId: number, itemId: number) => void;

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
            startedAt: null,
            activeTrackerId: null,
            activeTrackerName: '',
            theme: 'darkest',
            dotColor: '#0fffc3',

            // Theme actions
            setTheme: (theme) => set({ theme }),
            setDotColor: (color) => set({ dotColor: color }),

            // Tracker actions
            addTracker: (name) =>
                set((state) => {
                    // Calculate actual time including elapsed time if running
                    const actualTime =
                        state.isRunning && state.startedAt
                            ? state.currentTime + Math.floor((Date.now() - state.startedAt) / MILLISECONDS_IN_SECOND)
                            : state.currentTime;

                    return {
                        trackers: [
                            {
                                id: Date.now(),
                                name,
                                time: actualTime,
                                createdAt: new Date().toISOString()
                            },
                            ...state.trackers
                        ],
                        currentTime: INITIAL_TIME,
                        isRunning: false,
                        startedAt: null
                    };
                }),

            updateTracker: (id, updates) =>
                set((state) => ({
                    trackers: state.trackers.map((tracker) => (tracker.id === id ? { ...tracker, ...updates } : tracker))
                })),

            deleteTracker: (id) =>
                set((state) => ({
                    trackers: state.trackers.filter((tracker) => tracker.id !== id)
                })),

            clearAllTrackers: () => set({ trackers: [], activeTrackerId: null, activeTrackerName: '' }),

            setActiveTracker: (id) =>
                set((state) => {
                    // First, save current tracker time if there's an active one running
                    let updatedTrackers = state.trackers;
                    if (state.activeTrackerId !== null && state.isRunning && state.startedAt) {
                        const elapsed = Math.floor((Date.now() - state.startedAt) / MILLISECONDS_IN_SECOND);
                        const actualTime = state.currentTime + elapsed;
                        updatedTrackers = state.trackers.map((t) =>
                            t.id === state.activeTrackerId ? { ...t, time: actualTime } : t
                        );
                    } else if (state.activeTrackerId !== null) {
                        // Save current time even if not running
                        updatedTrackers = state.trackers.map((t) =>
                            t.id === state.activeTrackerId ? { ...t, time: state.currentTime } : t
                        );
                    }

                    // If selecting null (new tracker), reset everything
                    if (id === null) {
                        return {
                            trackers: updatedTrackers,
                            activeTrackerId: null,
                            activeTrackerName: '',
                            currentTime: INITIAL_TIME,
                            isRunning: false,
                            startedAt: null
                        };
                    }

                    // Find the tracker to activate
                    const tracker = updatedTrackers.find((t) => t.id === id);
                    if (!tracker) return state;

                    return {
                        trackers: updatedTrackers,
                        activeTrackerId: id,
                        activeTrackerName: tracker.name,
                        currentTime: tracker.time,
                        isRunning: false,
                        startedAt: null
                    };
                }),

            saveTracker: (name) =>
                set((state) => {
                    const actualTime =
                        state.isRunning && state.startedAt
                            ? state.currentTime + Math.floor((Date.now() - state.startedAt) / MILLISECONDS_IN_SECOND)
                            : state.currentTime;

                    // If editing existing tracker, update it
                    if (state.activeTrackerId !== null) {
                        return {
                            trackers: state.trackers.map((t) =>
                                t.id === state.activeTrackerId ? { ...t, name, time: actualTime } : t
                            ),
                            currentTime: INITIAL_TIME,
                            isRunning: false,
                            startedAt: null,
                            activeTrackerId: null,
                            activeTrackerName: ''
                        };
                    }

                    // Creating new tracker
                    return {
                        trackers: [
                            {
                                id: Date.now(),
                                name,
                                time: actualTime,
                                createdAt: new Date().toISOString()
                            },
                            ...state.trackers
                        ],
                        currentTime: INITIAL_TIME,
                        isRunning: false,
                        startedAt: null,
                        activeTrackerId: null,
                        activeTrackerName: ''
                    };
                }),

            setActiveTrackerName: (name) => set({ activeTrackerName: name }),

            // Note actions
            addNote: (content) =>
                set((state) => ({
                    notes: [
                        {
                            id: Date.now(),
                            type: 'text',
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

            clearAllNotes: () => set({ notes: [] }),

            // Todo list actions
            addTodoList: (title, items) =>
                set((state) => ({
                    notes: [
                        {
                            id: Date.now(),
                            type: 'todo',
                            title,
                            items,
                            createdAt: new Date().toISOString()
                        },
                        ...state.notes
                    ]
                })),

            updateTodoListTitle: (noteId, title) =>
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === noteId && note.type === 'todo' ? { ...note, title } : note
                    )
                })),

            addTodoItem: (noteId, text) =>
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === noteId && note.type === 'todo'
                            ? {
                                  ...note,
                                  items: [
                                      ...note.items,
                                      {
                                          id: Date.now(),
                                          text,
                                          completed: false
                                      }
                                  ]
                              }
                            : note
                    )
                })),

            toggleTodoItem: (noteId, itemId) =>
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === noteId && note.type === 'todo'
                            ? {
                                  ...note,
                                  items: note.items.map((item) =>
                                      item.id === itemId ? { ...item, completed: !item.completed } : item
                                  )
                              }
                            : note
                    )
                })),

            updateTodoItem: (noteId, itemId, text) =>
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === noteId && note.type === 'todo'
                            ? {
                                  ...note,
                                  items: note.items.map((item) => (item.id === itemId ? { ...item, text } : item))
                              }
                            : note
                    )
                })),

            deleteTodoItem: (noteId, itemId) =>
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === noteId && note.type === 'todo'
                            ? {
                                  ...note,
                                  items: note.items.filter((item) => item.id !== itemId)
                              }
                            : note
                    )
                })),

            // Timer actions
            setCurrentTime: (time) => set({ currentTime: time }),
            setIsRunning: (isRunning) =>
                set((state) => ({
                    isRunning,
                    startedAt: isRunning ? Date.now() : null,
                    currentTime: isRunning ? state.currentTime : state.currentTime
                })),
            resetTimer: () =>
                set((state) => ({
                    currentTime: INITIAL_TIME,
                    // Keep running but reset startedAt to now
                    startedAt: state.isRunning ? Date.now() : null
                }))
        }),
        {
            name: STORAGE_KEY_NAME,
            partialize: (state) => ({
                trackers: state.trackers,
                notes: state.notes,
                currentTime: state.currentTime,
                startedAt: state.startedAt,
                isRunning: state.isRunning,
                activeTrackerId: state.activeTrackerId,
                activeTrackerName: state.activeTrackerName,
                theme: state.theme,
                dotColor: state.dotColor
            }),
            merge: (persistedState, currentState) => {
                const migratedState = persistedState as any;

                // Migrate old notes to add type field
                if (migratedState?.notes) {
                    migratedState.notes = migratedState.notes.map((note: any) => {
                        if (!note.type) {
                            return { ...note, type: 'text' };
                        }
                        return note;
                    });
                }

                return {
                    ...currentState,
                    ...migratedState,
                    currentTime: migratedState?.currentTime ?? INITIAL_TIME
                };
            }
        }
    )
);
