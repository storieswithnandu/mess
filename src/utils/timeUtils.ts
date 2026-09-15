import type { DayOfWeek, MealType } from "../data/menu";

export interface MealWindow {
  type: MealType;
  startMins: number; // minutes from midnight
  endMins: number;
  timeRangeStr: string;
}

export const MEAL_WINDOWS: MealWindow[] = [
  { type: 'Breakfast', startMins: 7 * 60 + 30, endMins: 9 * 60 + 30, timeRangeStr: '07:30 AM – 09:30 AM' },
  { type: 'Lunch', startMins: 12 * 60, endMins: 14 * 60 + 15, timeRangeStr: '12:00 PM – 02:15 PM' },
  { type: 'Snacks', startMins: 16 * 60 + 30, endMins: 18 * 60, timeRangeStr: '04:30 PM – 06:00 PM' },
  { type: 'Dinner', startMins: 19 * 60, endMins: 21 * 60, timeRangeStr: '07:00 PM – 09:00 PM' },
];

export function getMealStatus(mealType: MealType, date: Date = new Date()): {
  status: 'Finished' | 'Serving Now' | 'Upcoming';
  minutesLeft?: number;
  closesInMins?: number;
} {
  const currentMins = date.getHours() * 60 + date.getMinutes();
  const window = MEAL_WINDOWS.find(w => w.type === mealType);
  if (!window) return { status: 'Finished' };

  if (currentMins >= window.endMins) {
    return { status: 'Finished' };
  } else if (currentMins >= window.startMins && currentMins < window.endMins) {
    return { status: 'Serving Now', closesInMins: window.endMins - currentMins };
  } else {
    return { status: 'Upcoming' };
  }
}

export function getActiveOrNextMeal(date: Date = new Date()): {
  activeMeal: MealWindow | null;
  nextMeal: MealWindow;
  closesInMins?: number;
  startsInMins?: number;
} {
  const currentMins = date.getHours() * 60 + date.getMinutes();
  
  // Check if currently serving
  const serving = MEAL_WINDOWS.find(w => currentMins >= w.startMins && currentMins < w.endMins);
  if (serving) {
    const nextIndex = (MEAL_WINDOWS.indexOf(serving) + 1) % MEAL_WINDOWS.length;
    return {
      activeMeal: serving,
      nextMeal: MEAL_WINDOWS[nextIndex],
      closesInMins: serving.endMins - currentMins
    };
  }

  // Find next upcoming meal today
  const upcoming = MEAL_WINDOWS.find(w => currentMins < w.startMins);
  if (upcoming) {
    return {
      activeMeal: null,
      nextMeal: upcoming,
      startsInMins: upcoming.startMins - currentMins
    };
  }

  // If past dinner, next is breakfast tomorrow
  return {
    activeMeal: null,
    nextMeal: MEAL_WINDOWS[0],
    startsInMins: (24 * 60 - currentMins) + MEAL_WINDOWS[0].startMins
  };
}

export function parseBusTimeToMins(timeStr: string): number {
  const parts = timeStr.trim().split(':');
  let h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);

  // Convert 12h format to 24h approximation for bus times
  if (h >= 1 && h <= 6) {
    h += 12; // Afternoon/evening like 1:00 PM, 5:15 PM
  } else if (h === 12 && timeStr.includes('00')) {
    h = 24; // 12:00 AM midnight
  }
  return h * 60 + m;
}

export function getCurrentDay(): DayOfWeek {
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

export function getWeekParity(date: Date = new Date()): 'odd' | 'even' {
  // Anchor: Mon Sept 14, 2026 is start of Week 1 / 3 (Odd parity)
  const anchorDate = new Date('2026-09-14T00:00:00');

  const diffTime = date.getTime() - anchorDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeksPassed = Math.floor(diffDays / 7);

  return Math.abs(weeksPassed) % 2 === 0 ? 'odd' : 'even';
}

export function getFormatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
