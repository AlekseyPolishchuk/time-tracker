import { type ChangeEvent, type KeyboardEvent, useEffect, useState } from 'react';

import { ClockIcon, DeleteIcon, PlusIcon, SaveIcon } from './components/Icons';
import { ConfirmDialog } from './components/ConfirmDialog';
import { NotesPanel } from './components/NotesPanel';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Timer } from './components/Timer';
import { TrackerList } from './components/TrackerList';
import { WeeklyStats } from './components/WeeklyStats';
import { ICON_SIZE, KEYBOARD_KEYS, LABELS } from './constants';
import { useStore } from './store/useStore';

import styles from './App.module.css';

function App() {
    const trackers = useStore((state) => state.trackers);
    const currentTime = useStore((state) => state.currentTime);
    const isRunning = useStore((state) => state.isRunning);
    const activeTrackerId = useStore((state) => state.activeTrackerId);
    const activeTrackerName = useStore((state) => state.activeTrackerName);
    const theme = useStore((state) => state.theme);

    const saveTracker = useStore((state) => state.saveTracker);
    const setActiveTracker = useStore((state) => state.setActiveTracker);
    const setActiveTrackerName = useStore((state) => state.setActiveTrackerName);
    const clearAllTrackers = useStore((state) => state.clearAllTrackers);

    const setCurrentTime = useStore((state) => state.setCurrentTime);
    const setIsRunning = useStore((state) => state.setIsRunning);

    // Local UI state
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleSaveTracker = () => {
        if (!activeTrackerName.trim()) return;
        saveTracker(activeTrackerName.trim());
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === KEYBOARD_KEYS.ENTER) {
            handleSaveTracker();
        }
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setActiveTrackerName(e.target.value);
    };

    const handleNewTracker = () => {
        setActiveTracker(null);
    };

    const handleClearAll = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmClear = () => {
        clearAllTrackers();
        setShowConfirmDialog(false);
    };

    const handleCancelClear = () => {
        setShowConfirmDialog(false);
    };

    const isEditing = activeTrackerId !== null;

    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    <ClockIcon size={ICON_SIZE.XL} />
                    {LABELS.APP_TITLE}
                </h1>
                <ThemeSwitcher />
            </header>

            <div className={styles.container}>
                <div className={styles.leftColumn}>
                    <WeeklyStats trackers={trackers} />
                </div>

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
                                value={activeTrackerName}
                                onChange={handleNameChange}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                className={styles.btnSave}
                                onClick={handleSaveTracker}
                                disabled={!activeTrackerName.trim()}>
                                <SaveIcon size={ICON_SIZE.MD} />
                                {isEditing ? 'Update' : LABELS.SAVE_BTN}
                            </button>
                            {isEditing && (
                                <button className={styles.btnNew} onClick={handleNewTracker} title='New tracker'>
                                    <PlusIcon size={ICON_SIZE.MD} />
                                    New
                                </button>
                            )}
                        </div>
                    </section>

                    <section className={styles.savedTrackers}>
                        <div className={styles.savedTrackersHeader}>
                            <h2 className={styles.sectionTitle}>{LABELS.SAVED_TRACKERS}</h2>
                            {trackers.length > 0 && (
                                <button className={styles.btnClearAll} onClick={handleClearAll} title={LABELS.CLEAR_ALL}>
                                    <DeleteIcon size={ICON_SIZE.SM} />
                                    {LABELS.CLEAR_ALL}
                                </button>
                            )}
                        </div>
                        <TrackerList trackers={trackers} />
                    </section>
                </main>

                <div className={styles.rightColumn}>
                    <NotesPanel />
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirmDialog}
                title={LABELS.CONFIRM_CLEAR_TITLE}
                message={LABELS.CONFIRM_CLEAR_MESSAGE}
                confirmLabel={LABELS.CLEAR_ALL}
                cancelLabel={LABELS.CANCEL_BTN}
                onConfirm={handleConfirmClear}
                onCancel={handleCancelClear}
            />
        </div>
    );
}

export default App;
