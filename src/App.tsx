import { type ChangeEvent, type KeyboardEvent, useCallback, useState } from 'react';

import { ClockIcon, SaveIcon } from './components/Icons';
import { NotesPanel } from './components/NotesPanel';
import { Timer } from './components/Timer';
import { TrackerList } from './components/TrackerList';
import {
    ICON_SIZE,
    INITIAL_TIME,
    KEYBOARD_KEYS,
    LABELS,
    STORAGE_KEY_CURRENT_TIME,
    STORAGE_KEY_NOTES,
    STORAGE_KEY_TRACKERS
} from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Note, Tracker } from './types';

import styles from './App.module.css';

function App() {
    const [trackers, setTrackers] = useLocalStorage<Tracker[]>(STORAGE_KEY_TRACKERS, []);
    const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY_NOTES, []);
    const [currentTime, setCurrentTime] = useLocalStorage(STORAGE_KEY_CURRENT_TIME, INITIAL_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [trackerName, setTrackerName] = useState('');

    const handleSaveTracker = () => {
        if (!trackerName.trim()) return;

        const newTracker: Tracker = {
            id: Date.now(),
            name: trackerName.trim(),
            time: currentTime,
            createdAt: new Date().toISOString()
        };

        setTrackers(prev => [newTracker, ...prev]);
        setTrackerName('');
        setCurrentTime(INITIAL_TIME);
        setIsRunning(false);
    };

    const handleUpdateTracker = useCallback(
        (id: number, updates: Partial<Tracker>) => {
            setTrackers(prev => prev.map(tracker => (tracker.id === id ? { ...tracker, ...updates } : tracker)));
        },
        [setTrackers]
    );

    const handleDeleteTracker = useCallback(
        (id: number) => {
            setTrackers(prev => prev.filter(tracker => tracker.id !== id));
        },
        [setTrackers]
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === KEYBOARD_KEYS.ENTER) {
            handleSaveTracker();
        }
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTrackerName(e.target.value);
    };

    const handleAddNote = useCallback(
        (content: string) => {
            const newNote: Note = {
                id: Date.now(),
                content,
                createdAt: new Date().toISOString()
            };
            setNotes(prev => [newNote, ...prev]);
        },
        [setNotes]
    );

    const handleUpdateNote = useCallback(
        (id: number, content: string) => {
            setNotes(prev => prev.map(note => (note.id === id ? { ...note, content } : note)));
        },
        [setNotes]
    );

    const handleDeleteNote = useCallback(
        (id: number) => {
            setNotes(prev => prev.filter(note => note.id !== id));
        },
        [setNotes]
    );

    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    <ClockIcon size={ICON_SIZE.XL} />
                    {LABELS.APP_TITLE}
                </h1>
            </header>

            <div className={styles.container}>
                <div className={styles.leftColumn}>{/* Statistics will be added here */}</div>

                <main className={styles.centerColumn}>
                    <section className={styles.currentTracker}>
                        <Timer
                            time={currentTime}
                            setTime={setCurrentTime}
                            isRunning={isRunning}
                            setIsRunning={setIsRunning}
                        />

                        <div className={styles.saveTracker}>
                            <input
                                type='text'
                                className={styles.input}
                                placeholder={LABELS.INPUT_PLACEHOLDER}
                                value={trackerName}
                                onChange={handleNameChange}
                                onKeyDown={handleKeyDown}
                            />
                            <button className={styles.btnSave} onClick={handleSaveTracker} disabled={!trackerName.trim()}>
                                <SaveIcon size={ICON_SIZE.MD} />
                                {LABELS.SAVE}
                            </button>
                        </div>
                    </section>

                    <section className={styles.savedTrackers}>
                        <h2 className={styles.sectionTitle}>{LABELS.SAVED_TRACKERS}</h2>
                        <TrackerList trackers={trackers} onUpdate={handleUpdateTracker} onDelete={handleDeleteTracker} />
                    </section>
                </main>

                <div className={styles.rightColumn}>
                    <NotesPanel notes={notes} onAdd={handleAddNote} onUpdate={handleUpdateNote} onDelete={handleDeleteNote} />
                </div>
            </div>
        </div>
    );
}

export default App;
