import { useEffect, useRef } from 'react';

import { ICON_SIZE, INITIAL_TIME, LABELS, MILLISECONDS_IN_SECOND } from '../constants';
import type { TimerProps } from '../types';
import { formatTime } from '../utils/formatTime';
import { PauseIcon, PlayIcon, ResetIcon } from './Icons';

import styles from './Timer.module.css';

export function Timer({ time, setTime, isRunning, setIsRunning }: TimerProps) {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, MILLISECONDS_IN_SECOND);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, setTime]);

    const handlePlayPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(INITIAL_TIME);
    };

    return (
        <div className={styles.timer}>
            <div className={styles.display}>{formatTime(time)}</div>
            <div className={styles.controls}>
                <button className={`${styles.btn} ${styles.btnReset}`} onClick={handleReset} title={LABELS.RESET}>
                    <ResetIcon size={ICON_SIZE.LG} />
                </button>
                <button
                    className={`${styles.btn} ${styles.btnPlay} ${isRunning ? styles.active : ''}`}
                    onClick={handlePlayPause}
                    title={isRunning ? LABELS.PAUSE : LABELS.PLAY}>
                    {isRunning ? <PauseIcon size={ICON_SIZE.LG} /> : <PlayIcon size={ICON_SIZE.LG} />}
                </button>
            </div>
        </div>
    );
}
