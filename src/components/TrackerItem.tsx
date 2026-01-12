import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { ICON_SIZE, INITIAL_TIME, KEYBOARD_KEYS, LABELS, MILLISECONDS_IN_SECOND } from '../constants';
import { useStore } from '../store/useStore';
import type { Tracker } from '../types';
import { formatTime } from '../utils/formatTime';
import { DeleteIcon, EditIcon, PauseIcon, PlayIcon, ResetIcon } from './Icons';

import styles from './TrackerItem.module.css';

interface TrackerItemProps {
    tracker: Tracker;
}

export function TrackerItem({ tracker }: TrackerItemProps) {
    const updateTracker = useStore((state) => state.updateTracker);
    const deleteTracker = useStore((state) => state.deleteTracker);
    const [isRunning, setIsRunning] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(tracker.name);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                updateTracker(tracker.id, { time: tracker.time + 1 });
            }, MILLISECONDS_IN_SECOND);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, tracker.id, tracker.time, updateTracker]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handlePlayPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        updateTracker(tracker.id, { time: INITIAL_TIME });
    };

    const startEdit = () => {
        setIsEditing(true);
        setEditName(tracker.name);
    };

    const saveEdit = () => {
        if (editName.trim() && editName.trim() !== tracker.name) {
            updateTracker(tracker.id, { name: editName.trim() });
        }
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setEditName(tracker.name);
        setIsEditing(false);
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditName(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === KEYBOARD_KEYS.ENTER) {
            e.preventDefault();
            saveEdit();
        }
        if (e.key === KEYBOARD_KEYS.ESCAPE) {
            cancelEdit();
        }
    };

    return (
        <div className={styles.item}>
            <div className={styles.info}>
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type='text'
                        className={styles.nameInput}
                        value={editName}
                        onChange={handleNameChange}
                        onKeyDown={handleKeyDown}
                        onBlur={saveEdit}
                    />
                ) : (
                    <div className={styles.nameWrapper}>
                        <span className={styles.name} onClick={startEdit}>
                            {tracker.name}
                        </span>
                        <button className={styles.editBtn} onClick={startEdit} title='Edit name'>
                            <EditIcon size={ICON_SIZE.XS} />
                        </button>
                    </div>
                )}
                <span className={styles.time}>{formatTime(tracker.time)}</span>
            </div>
            <div className={styles.controls}>
                <button
                    className={`${styles.btn} ${styles.btnPlay} ${isRunning ? styles.active : ''}`}
                    onClick={handlePlayPause}
                    title={isRunning ? LABELS.PAUSE : LABELS.PLAY}>
                    {isRunning ? <PauseIcon size={ICON_SIZE.SM} /> : <PlayIcon size={ICON_SIZE.SM} />}
                </button>
                <button className={`${styles.btn} ${styles.btnReset}`} onClick={handleReset} title={LABELS.RESET}>
                    <ResetIcon size={ICON_SIZE.SM} />
                </button>
                <button
                    className={`${styles.btn} ${styles.btnDelete}`}
                    onClick={() => deleteTracker(tracker.id)}
                    title={LABELS.DELETE}>
                    <DeleteIcon size={ICON_SIZE.SM} />
                </button>
            </div>
        </div>
    );
}
