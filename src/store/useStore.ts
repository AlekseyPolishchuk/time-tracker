import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_TIME, STORAGE_KEY_NAME } from '../constants';
import type { Note, TodoItem, Tracker } from '../types';

interface StoreState {
    // State
    trackers: Tracker[];
    notes: Note[];
    currentTime: number;
    isRunning: boolean;
    startedAt: number | null;

    // Tracker actions
    addTracker: (name: string) => void;
    updateTracker: (id: number, updates: Partial<Tracker>) => void;
    deleteTracker: (id: number) => void;
    clearAllTrackers: () => void;

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
                isRunning: state.isRunning
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
