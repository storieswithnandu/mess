import React, { useState, useEffect } from 'react';
import { busSchedule, type BusEntry } from '../data/busData';
import type { DayOfWeek } from '../data/menu';
import styles from './BusScheduleCard.module.css';

interface BusScheduleCardProps {
    day: DayOfWeek;
}

type RouteDirection = 'N->S' | 'S->N';

export const BusScheduleCard: React.FC<BusScheduleCardProps> = ({ day }) => {
    const [selectedRoute, setSelectedRoute] = useState<RouteDirection | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute to keep list fresh
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getScheduleForDay = () => {
        if (day === 'Saturday') return busSchedule.saturdays;
        if (day === 'Sunday') return busSchedule.sundays;
        return busSchedule.workingDays;
    };

    const schedule = getScheduleForDay();
    const dayType = day === 'Saturday' ? 'Saturday' : day === 'Sunday' ? 'Sunday' : 'Working Day';

    // Helper to Convert "7:45" or "1:30" to minutes from midnight
    // Assumes the list is sorted chronologically to infer AM/PM
    const parseBusTime = (timeStr: string, prevMinutes: number = -1): number => {
        // Handle dot separator (e.g. 5.15)
        const cleanTime = timeStr.replace('.', ':').toUpperCase();

        let [hStr, mStr] = cleanTime.split(':');
        let h = parseInt(hStr);
        let m = parseInt(mStr);

        // Basic normalization
        if (h === 12) h = 0; // Treat 12 as 0 initially for calculation

        let minutes = h * 60 + m;

        // If this time is "smaller" than previous, it probably crossed noon or midnight
        // But we need to be careful. The list starts at morning (AM).
        // 7:45 (465) -> 8:30 (510) ... -> 11:50 (710) -> 12:15 (735) -> 1:00 (60)

        // If strict drop (e.g. 735 -> 60), it definitely crossed to PM (add 720)
        // If minutes < prevMinutes, add 12h (720 min)
        if (minutes < prevMinutes) {
            minutes += 720;
        }
        // Also handle the 12:xx PM case where it might be slightly larger than 11:xx but implies PM?
        // Actually 12:xx (0:xx) is usually smaller than 11:xx, so the logic above handles it.
        // Wait: 11:50 (710). 12:15 (0*60+15 = 15). 15 < 710. Add 720 -> 735. Correct.

        // Edge case: Late night 7:00 (420) vs morning 7:00?
        // The list is sorted.
        // 1:00 (780) ... 6:30 (1110) ... 7:00 (420 < 1110 -> 1140). Correct.

        // One global fix: The generated minutes should be generally increasing.
        // Determine "base" offset based on prevMinutes.

        return minutes;
    };

    const getUpcomingBuses = (routeItems: BusEntry[]) => {
        const isToday = new Date().toDateString() === new Date().toDateString(); // Simplified check, assumes 'day' prop is strictly calendar day?
        // Actually, 'day' prop comes from App's 'activeDay'. 
        // If activeDay != Today, we should show ALL items (reset).

        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const viewDayIndex = days.indexOf(day);
        const currentDayIndex = now.getDay();

        // If viewing a different day, show ALL buses
        if (viewDayIndex !== currentDayIndex) {
            return routeItems;
        }

        // If viewing TODAY, filter past buses
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // We need to map the whole schedule to minutes first to handle the AM/PM flow correctly
        let lastMin = 0;
        const mappedWithMinutes = routeItems.map(item => {
            const mins = parseBusTime(item.time, lastMin);
            lastMin = mins;
            return { ...item, mins };
        });

        return mappedWithMinutes.filter(item => item.mins >= currentMinutes);
    };

    const activeList = selectedRoute === 'N->S'
        ? getUpcomingBuses(schedule.nilaToSahyadri)
        : selectedRoute === 'S->N'
            ? getUpcomingBuses(schedule.sahyadriToNila)
            : [];

    return (
        <div className={styles.cardContainer}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <span>🚌</span> Bus Schedule
                </div>
                <div className={styles.dayBadge}>{dayType}</div>
            </div>

            {/* Toggle Buttons */}
            <div className={styles.toggleContainer}>
                <button
                    className={`${styles.toggleBtn} ${selectedRoute === 'N->S' ? styles.active : ''}`}
                    onClick={() => setSelectedRoute('N->S')}
                >
                    Nila ➔ Sahyadri
                </button>
                <button
                    className={`${styles.toggleBtn} ${selectedRoute === 'S->N' ? styles.active : ''}`}
                    onClick={() => setSelectedRoute('S->N')}
                >
                    Sahyadri ➔ Nila
                </button>
            </div>

            {/* List */}
            <div className={styles.listContainer}>
                {!selectedRoute && (
                    <div className={styles.placeholder}>
                        Select a route to view buses
                    </div>
                )}

                {selectedRoute && activeList.length === 0 && (
                    <div className={styles.emptyState}>
                        No more buses today 🌙
                    </div>
                )}

                {selectedRoute && activeList.map((entry, index) => (
                    <div key={index} className={styles.timeItem}>
                        <span className={styles.time}>{entry.time}</span>
                        {entry.isMultiple && <span className={styles.multipleMarker}>(Multiple)</span>}
                    </div>
                ))}
            </div>

            {/* Disclaimer for full reset */}
            {!selectedRoute && (
                <p className={styles.hint}>* Schedules refresh daily</p>
            )}
        </div>
    );
};
