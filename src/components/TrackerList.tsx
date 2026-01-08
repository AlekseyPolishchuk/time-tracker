import { LABELS } from '../constants';
import type { TrackerListProps } from '../types';
import { TrackerItem } from './TrackerItem';

import styles from './TrackerList.module.css';

export function TrackerList({ trackers, onUpdate, onDelete }: TrackerListProps) {
    if (trackers.length === 0) {
        return <div className={styles.empty}>{LABELS.EMPTY_LIST}</div>;
    }

    return (
        <div className={styles.list}>
            {trackers.map(tracker => (
                <TrackerItem key={tracker.id} tracker={tracker} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
        </div>
    );
}
