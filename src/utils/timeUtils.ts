import type { DayOfWeek, MealType } from "../data/menu";


export function getCurrentMeal(): { type: MealType | 'Next Day'; isActive: boolean } {
    const now = new Date();
    const day = now.getDay();
    const timeInMinutes = now.getHours() * 60 + now.getMinutes();

    const isWeekend = day === 0 || day === 6;

    // Dinner ends at 9:00 PM (21:00)
    if (timeInMinutes >= 21 * 60) return { type: 'Next Day', isActive: false };

    // Breakfast: Mon-Fri (7:20-9:30), Sat-Sun (8:00-10:00)
    const bStart = isWeekend ? 8 * 60 : 7 * 60 + 20;
    const bEnd = isWeekend ? 10 * 60 : 9 * 60 + 30;
    if (timeInMinutes < bEnd) {
        return { type: 'Breakfast', isActive: timeInMinutes >= bStart };
    }

    // Lunch: 12:00-2:15 (14:15)
    const lStart = 12 * 60;
    const lEnd = 14 * 60 + 15;
    if (timeInMinutes < lEnd) {
        return { type: 'Lunch', isActive: timeInMinutes >= lStart };
    }

    // Snacks: 4:30 (16:30)-6:00 (18:00)
    const sStart = 16 * 60 + 30;
    const sEnd = 18 * 60;
    if (timeInMinutes < sEnd) {
        return { type: 'Snacks', isActive: timeInMinutes >= sStart };
    }

    // Dinner: 7:00 (19:00)-9:00 (21:00)
    const dStart = 19 * 60;
    const dEnd = 21 * 60;
    if (timeInMinutes < dEnd) {
        return { type: 'Dinner', isActive: timeInMinutes >= dStart };
    }

    return { type: 'Next Day', isActive: false };
}


export function getCurrentDay(): DayOfWeek {
    const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}

export function getWeekParity(date: Date = new Date()): 'odd' | 'even' {
    // Anchor: Mon Feb 2, 2026 is start of "Week 2/4" (Even).
    const anchorDate = new Date('2026-02-02T00:00:00');

    // Calculate difference in milliseconds
    const diffTime = date.getTime() - anchorDate.getTime();
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
