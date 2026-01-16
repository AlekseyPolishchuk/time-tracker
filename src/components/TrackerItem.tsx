import { ICON_SIZE, LABELS } from '../constants';
import { useStore } from '../store/useStore';
import type { Tracker } from '../types';
import { formatTime } from '../utils/formatTime';
import { DeleteIcon } from './Icons';

import styles from './TrackerItem.module.css';

interface TrackerItemProps {
    tracker: Tracker;
    isDeleting: boolean;
    onDelete: () => void;
}

export function TrackerItem({ tracker, isDeleting, onDelete }: TrackerItemProps) {
    const setActiveTracker = useStore((state) => state.setActiveTracker);
    const activeTrackerId = useStore((state) => state.activeTrackerId);

    const isActive = activeTrackerId === tracker.id;

    const handleClick = () => {
        if (!isActive && !isDeleting) {
            setActiveTracker(tracker.id);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    const itemClasses = [styles.item, isActive && styles.active, isDeleting && styles.deleting]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={itemClasses} onClick={handleClick}>
            <div className={styles.info}>
                <span className={styles.name}>{tracker.name}</span>
                <span className={styles.time}>{formatTime(tracker.time)}</span>
            </div>
            <div className={styles.controls}>
                <button className={`${styles.btn} ${styles.btnDelete}`} onClick={handleDelete} title={LABELS.DELETE}>
                    <DeleteIcon size={ICON_SIZE.SM} />
                </button>
            </div>
        </div>
    );
}
