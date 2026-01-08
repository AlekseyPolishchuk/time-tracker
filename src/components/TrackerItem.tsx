import { useEffect, useRef, useState } from 'react';

import { ICON_SIZE, INITIAL_TIME, LABELS, MILLISECONDS_IN_SECOND } from '../constants';
import type { TrackerItemProps } from '../types';
import { formatTime } from '../utils/formatTime';
import { DeleteIcon, PauseIcon, PlayIcon, ResetIcon } from './Icons';

import styles from './TrackerItem.module.css';

export function TrackerItem({ tracker, onUpdate, onDelete }: TrackerItemProps) {
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                onUpdate(tracker.id, { time: tracker.time + 1 });
            }, MILLISECONDS_IN_SECOND);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, tracker.id, tracker.time, onUpdate]);

    const handlePlayPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        onUpdate(tracker.id, { time: INITIAL_TIME });
    };

    return (
        <div className={styles.item}>
            <div className={styles.info}>
                <span className={styles.name}>{tracker.name}</span>
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
                    onClick={() => onDelete(tracker.id)}
                    title={LABELS.DELETE}>
                    <DeleteIcon size={ICON_SIZE.SM} />
                </button>
            </div>
        </div>
    );
}
