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

  // Bus schedule runs continuously through the day.
  // Heuristic: hours 7-11 first occurrence = AM (7-11), hour 12 = noon (12),
  // hours 1-6 = PM (13-18), hours 7-11 second occurrence = PM/night (19-23),
  // hour 12 at end = midnight (24).
  // Simplification used here:
  //   h in 1..6  → afternoon/evening (+12)
  //   h in 7..11 → either morning (7-11) or night (19-23)
  //   h == 12    → noon (12) or midnight (24)
  // Since we can't know context from time string alone, we use the conventional rule:
  //   7-11 = morning (AM), 12 = noon, 1-6 = PM, then 7-11 = evening (add 12), 12 = midnight.
  // But that creates ambiguity. Instead we apply a cleaner rule based on realistic campus schedule:
  //   h 7-11 with no suffix → treat as next occurrence after context.
  // Simplest correct approach for this dataset: times are in ascending order, so
  // we rely on the fact that 7-11 early in day are AM, 1-6 are PM, 7-11 late are PM+12.
  // Since this function is called without order context, we use:
  //   h 1-6 → add 12 (PM)
  //   h 7-11 → keep as-is (AM); the later 7-11 entries will be handled by comparing consecutive times
  //   h 12 → 12 (noon)
  // For the night entries (7:00, 8:00, 9:00, 10:00, 11:00, 12:00 at bottom of list),
  // we add a special case: if the parsed time would be <= the previous one, add 12.
  // Since we can't track sequence here, we use a threshold: times on campus typically
  // run from ~7:30 AM to ~12:00 AM. We mark h=7..11 as AM and h=7..11 in the
  // second half as evening by the caller using parseBusTimesToMinsOrdered below.
  //
  // For backwards compat with existing usage: keep the original logic.
  if (h >= 1 && h <= 6) {
    h += 12; // 1:00→13, 5:15→17, etc.
  }
  // h 7-11 stays as 7-11 (morning)
  // h 12 stays as 12 (noon) - evening 12:00 (midnight) handled by context
  return h * 60 + m;
}

/**
 * Parses an ordered list of bus time strings into minutes, correctly handling
 * the wrap-around from morning to evening (e.g. 7:30 AM → ... → 12:00 → 1:00 PM → ... → 7:00 PM → 12:00 AM).
 * Returns an array of minute values, monotonically increasing.
 */
export function parseBusTimesOrdered(times: string[]): number[] {
  const result: number[] = [];
  let prev = 0;
  for (const t of times) {
    let mins = parseBusTimeToMins(t);
    // If this time is less than or equal to previous, it must be in the next period
    // e.g. after 12:30 (noon) comes 1:00 (13:00 via +12 already), after 6:00 PM (18:00)
    // comes 7:00 which parseBusTimeToMins returns as 7*60=420 — need to add 12h.
    if (mins <= prev && prev > 0) {
      mins += 12 * 60;
    }
    result.push(mins);
    prev = mins;
  }
  return result;
}

/**
 * Format bus time string (like "7:30" or "5:15") into human-readable AM/PM.
 */
export function formatBusTime(timeStr: string): string {
  const parts = timeStr.trim().split(':');
  let h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);

  if (h >= 1 && h <= 6) h += 12;

  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const displayM = m.toString().padStart(2, '0');
  return `${displayH}:${displayM} ${period}`;
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
