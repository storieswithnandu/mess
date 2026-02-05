import type { DayOfWeek, MealType } from "../data/menu";


export function getCurrentMeal(): { type: MealType | 'Next Day'; isActive: boolean } {
    const now = new Date();
    const hour = now.getHours();
    // const hour = 13; // Debug

    if (hour < 10) return { type: 'Breakfast', isActive: hour >= 7 };
    if (hour < 15) return { type: 'Lunch', isActive: hour >= 12 }; // Extended window to show 'Lunch' until late afternoon
    if (hour < 19) return { type: 'Snacks', isActive: hour >= 16 };
    if (hour < 22) return { type: 'Dinner', isActive: hour >= 19 };

    return { type: 'Next Day', isActive: false };
}

export function getCurrentDay(): DayOfWeek {
    const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}

export function getWeekParity(): 'odd' | 'even' {
    // Anchor: Mon Feb 2, 2026 is start of "Week 2/4" (Even).
    const anchorDate = new Date('2026-02-02T00:00:00');
    const now = new Date();

    // Calculate difference in milliseconds
    const diffTime = now.getTime() - anchorDate.getTime();
    if (diffTime < 0) return 'even'; // Fallback for pre-anchor dates

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(diffDays / 7);

    // Week 0 (Feb 2-8) is Even (2/4)
    // Week 1 (Feb 9-15) is Odd (1/3)
    return weeksPassed % 2 === 0 ? 'even' : 'odd';
}

export function getFormatDate(date: Date = new Date()): string {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
