import { LABELS } from '../constants';
import type { Tracker } from '../types';
import { TrackerItem } from './TrackerItem';

import styles from './TrackerList.module.css';

interface TrackerListProps {
    trackers: Tracker[];
}

export function TrackerList({ trackers }: TrackerListProps) {
    if (trackers.length === 0) {
        return <div className={styles.empty}>{LABELS.EMPTY_LIST}</div>;
    }

    return (
        <div className={styles.list}>
            {trackers.map(tracker => (
                <TrackerItem key={tracker.id} tracker={tracker} />
            ))}
        </div>
    );
}
