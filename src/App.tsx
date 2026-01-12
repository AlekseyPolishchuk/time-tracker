import { type ChangeEvent, type KeyboardEvent, useState } from 'react';

import { ClockIcon, DeleteIcon, SaveIcon } from './components/Icons';
import { ConfirmDialog } from './components/ConfirmDialog';
import { NotesPanel } from './components/NotesPanel';
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

    const addTracker = useStore((state) => state.addTracker);
    const clearAllTrackers = useStore((state) => state.clearAllTrackers);

    const setCurrentTime = useStore((state) => state.setCurrentTime);
    const setIsRunning = useStore((state) => state.setIsRunning);

    // Local UI state
    const [trackerName, setTrackerName] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleSaveTracker = () => {
        if (!trackerName.trim()) return;
        addTracker(trackerName.trim());
        setTrackerName('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === KEYBOARD_KEYS.ENTER) {
            handleSaveTracker();
        }
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTrackerName(e.target.value);
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

    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    <ClockIcon size={ICON_SIZE.XL} />
                    {LABELS.APP_TITLE}
                </h1>
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
                                value={trackerName}
                                onChange={handleNameChange}
                                onKeyDown={handleKeyDown}
                            />
                            <button className={styles.btnSave} onClick={handleSaveTracker} disabled={!trackerName.trim()}>
                                <SaveIcon size={ICON_SIZE.MD} />
                                {LABELS.SAVE_BTN}
                            </button>
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
