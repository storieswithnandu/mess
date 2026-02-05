import React from 'react';
import { busSchedule } from '../data/busData';
import type { DayOfWeek } from '../data/menu';
import styles from './BusScheduleCard.module.css';

interface ExtraBusCardProps {
    day: DayOfWeek;
}

export const ExtraBusCard: React.FC<ExtraBusCardProps> = ({ day }) => {
    const getScheduleForDay = () => {
        if (day === 'Saturday') return busSchedule.saturdays;
        if (day === 'Sunday') return busSchedule.sundays;
        return busSchedule.workingDays;
    };

    const schedule = getScheduleForDay();
    const extraBuses = schedule.extraBuses || [];

    if (extraBuses.length === 0) {
        return (
            <div className={styles.cardContainer}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <span>🚐</span> Extra Bus Routes
                    </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                    No extra buses scheduled for this day.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.cardContainer}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <span>🚐</span> Extra Bus Routes
                </div>
            </div>

            <div className={styles.extraList}>
                {extraBuses.map((bus, index) => (
                    <div key={index} className={styles.extraItem}>
                        <div className={styles.extraTime}>{bus.time}</div>
                        <div className={styles.extraInfo}>
                            <div className={styles.extraLabel}>{bus.label}</div>
                            <div className={styles.extraRoute}>{bus.route}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
