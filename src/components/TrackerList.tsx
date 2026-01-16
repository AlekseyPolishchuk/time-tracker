import { useState } from 'react';

import { LABELS } from '../constants';
import { useStore } from '../store/useStore';
import type { Tracker } from '../types';
import { TrackerItem } from './TrackerItem';

import styles from './TrackerList.module.css';

interface TrackerListProps {
    trackers: Tracker[];
}

export function TrackerList({ trackers }: TrackerListProps) {
    const deleteTracker = useStore((state) => state.deleteTracker);
    const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

    const handleDelete = (id: number) => {
        setDeletingIds((prev) => new Set(prev).add(id));

        setTimeout(() => {
            deleteTracker(id);
            setDeletingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }, 300);
    };

    if (trackers.length === 0) {
        return <div className={styles.empty}>{LABELS.EMPTY_LIST}</div>;
    }

    return (
        <div className={styles.list}>
            {trackers.map((tracker) => (
                <TrackerItem
                    key={tracker.id}
                    tracker={tracker}
                    isDeleting={deletingIds.has(tracker.id)}
                    onDelete={() => handleDelete(tracker.id)}
                />
            ))}
        </div>
    );
}
