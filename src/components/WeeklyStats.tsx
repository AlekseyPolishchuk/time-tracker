import { useMemo } from 'react';
import {
    DAYS_IN_WEEK,
    EMPTY_TIME_DISPLAY,
    HOURS_IN_DAY,
    MIN_ACTIVITY_FALLBACK,
    MIN_BAR_HEIGHT_PERCENT,
    PERCENT_MULTIPLIER,
    STATS_TITLE
} from '../constants';
import type { Tracker } from '../types';
import { formatWeeklyTime } from '../utils/formatWeeklyTime';
import { getDayLabel } from '../utils/getDayLabel';
import styles from './WeeklyStats.module.css';

interface WeeklyStatsProps {
    trackers: Tracker[];
}

interface DayStats {
    label: string;
    totalSeconds: number;
    hourlyActivity: number[];
}

export function WeeklyStats({ trackers }: WeeklyStatsProps) {
    const weekStats = useMemo(() => {
        const stats: DayStats[] = [];
        const now = new Date();

        // Calculate stats for last 7 days
        for (let daysAgo = 0; daysAgo < DAYS_IN_WEEK; daysAgo++) {
            const targetDate = new Date(now);
            targetDate.setDate(now.getDate() - daysAgo);
            targetDate.setHours(0, 0, 0, 0);

            const nextDay = new Date(targetDate);
            nextDay.setDate(targetDate.getDate() + 1);

            const hourlyActivity = new Array(HOURS_IN_DAY).fill(0);
            let totalSeconds = 0;

            // Sum up time for trackers created on this day
            trackers.forEach(tracker => {
                const trackerDate = new Date(tracker.createdAt);
                if (trackerDate >= targetDate && trackerDate < nextDay) {
                    totalSeconds += tracker.time;

                    // Add to hourly activity
                    const hour = trackerDate.getHours();
                    hourlyActivity[hour] += tracker.time;
                }
            });

            stats.push({
                label: getDayLabel(daysAgo),
                totalSeconds,
                hourlyActivity
            });
        }

        return stats;
    }, [trackers]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{STATS_TITLE}</h2>

            <div className={styles.daysList}>
                {weekStats.map((day, index) => {
                    const maxActivity = Math.max(...day.hourlyActivity, MIN_ACTIVITY_FALLBACK);

                    return (
                        <div key={index} className={styles.dayItem}>
                            <div className={styles.dayLabel}>{day.label}</div>

                            <div className={styles.chart}>
                                {day.hourlyActivity
                                    .map((activity, hour) => ({ activity, hour }))
                                    .filter(item => item.activity > 0)
                                    .map((item, index) => {
                                        const height = (item.activity / maxActivity) * PERCENT_MULTIPLIER;
                                        return (
                                            <div
                                                key={index}
                                                className={styles.bar}
                                                style={{ height: `${Math.max(height, MIN_BAR_HEIGHT_PERCENT)}%` }}
                                            />
                                        );
                                    })}
                            </div>

                            <div className={styles.dayTime}>
                                {day.totalSeconds > 0 ? formatWeeklyTime(day.totalSeconds) : EMPTY_TIME_DISPLAY}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
