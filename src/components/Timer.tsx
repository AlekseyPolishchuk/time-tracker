import { useEffect, useRef, useState } from 'react';

import { ICON_SIZE, LABELS, MILLISECONDS_IN_SECOND } from '../constants';
import { useStore } from '../store/useStore';
import type { TimerProps } from '../types';
import { formatTime } from '../utils/formatTime';
import { DotMatrix } from './DotMatrix';
import { PauseIcon, PlayIcon, ResetIcon } from './Icons';

import styles from './Timer.module.css';

export function Timer({ time, setTime, isRunning, setIsRunning }: TimerProps) {
    const startedAt = useStore((state) => state.startedAt);
    const dotColor = useStore((state) => state.dotColor);
    const setDotColor = useStore((state) => state.setDotColor);
    const [displayTime, setDisplayTime] = useState(time);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isRunning && startedAt) {
            // Update display time based on real elapsed time
            const updateDisplayTime = () => {
                const elapsed = Math.floor((Date.now() - startedAt) / MILLISECONDS_IN_SECOND);
                setDisplayTime(time + elapsed);
            };

            updateDisplayTime();
            intervalRef.current = setInterval(updateDisplayTime, MILLISECONDS_IN_SECOND);
        } else {
            setDisplayTime(time);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, startedAt, time]);

    // Update browser tab title with current time
    useEffect(() => {
        const formattedTime = formatTime(displayTime);
        document.title = `${formattedTime} ${LABELS.APP_TITLE}`;
    }, [displayTime]);

    const handlePlayPause = () => {
        if (isRunning && startedAt) {
            // When pausing, save the actual elapsed time
            const elapsed = Math.floor((Date.now() - startedAt) / MILLISECONDS_IN_SECOND);
            setTime(time + elapsed);
        }
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        // Reset time but keep running state
        useStore.getState().resetTimer();
    };

    const handleColorClick = () => {
        colorInputRef.current?.click();
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDotColor(e.target.value);
    };

    return (
        <div className={styles.timer}>
            <div className={styles.displayWrapper}>
                <div className={styles.display}>
                    <DotMatrix value={formatTime(displayTime)} color={dotColor} />
                </div>
                <button
                    className={styles.btnColor}
                    onClick={handleColorClick}
                    title="Change color"
                    style={{ '--preview-color': dotColor } as React.CSSProperties}>
                    <input
                        ref={colorInputRef}
                        type="color"
                        value={dotColor}
                        onChange={handleColorChange}
                        className={styles.colorInput}
                    />
                </button>
            </div>
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
