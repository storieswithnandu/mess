import React from 'react';
import { busSchedule } from '../data/busData';
import type { DayOfWeek } from '../data/menu';
import styles from './BusScheduleCard.module.css';

interface BusScheduleCardProps {
    day: DayOfWeek;
}

export const BusScheduleCard: React.FC<BusScheduleCardProps> = ({ day }) => {
    const getScheduleForDay = () => {
        if (day === 'Saturday') return busSchedule.saturdays;
        if (day === 'Sunday') return busSchedule.sundays;
        return busSchedule.workingDays;
    };

    const schedule = getScheduleForDay();
    const dayType = day === 'Saturday' ? 'Saturday' : day === 'Sunday' ? 'Sunday' : 'Working Day';

    return (
        <div className={styles.cardContainer}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <span>🚌</span> Bus Schedule
                </div>
                <div className={styles.dayBadge}>{dayType}</div>
            </div>

            <div className={styles.grid}>
                <div className={styles.routeColumn}>
                    <div className={styles.routeHeader}>
                        Nila ➔ Sahyadri
                    </div>
                    <div className={styles.timeList}>
                        {schedule.nilaToSahyadri.map((entry, index) => (
                            <div key={index} className={styles.timeItem}>
                                {entry.time}
                                {entry.isMultiple && <span className={styles.multipleMarker} title="Multiple buses">(m)</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.routeColumn}>
                    <div className={styles.routeHeader}>
                        Sahyadri ➔ Nila
                    </div>
                    <div className={styles.timeList}>
                        {schedule.sahyadriToNila.map((entry, index) => (
                            <div key={index} className={styles.timeItem}>
                                {entry.time}
                                {entry.isMultiple && <span className={styles.multipleMarker} title="Multiple buses">(m)</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
