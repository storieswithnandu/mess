export interface BusAlarm {
  id: string; // e.g. "sahyadriToNila_17:15"
  timeStr: string; // "17:15" or "05:15 PM"
  direction: 'sahyadriToNila' | 'nilaToSahyadri';
  directionLabel: string;
  createdAt: number;
}

const STORAGE_KEY = 'campus_bus_alarms';

export function getAlarms(): BusAlarm[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isAlarmSet(timeStr: string, direction: 'sahyadriToNila' | 'nilaToSahyadri'): boolean {
  const alarms = getAlarms();
  const id = `${direction}_${timeStr}`;
  return alarms.some(a => a.id === id);
}

export function toggleAlarm(
  timeStr: string, 
  direction: 'sahyadriToNila' | 'nilaToSahyadri',
  directionLabel: string
): { isSet: boolean; alarms: BusAlarm[] } {
  let alarms = getAlarms();
  const id = `${direction}_${timeStr}`;
  const exists = alarms.some(a => a.id === id);

  if (exists) {
    alarms = alarms.filter(a => a.id !== id);
  } else {
    alarms.push({
      id,
      timeStr,
      direction,
      directionLabel,
      createdAt: Date.now()
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  } catch (e) {
    console.error('Failed to save bus alarms to localStorage', e);
  }

  // Request browser notification permission if setting alarm
  if (!exists && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  return { isSet: !exists, alarms };
}

export function clearAllAlarms(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear alarms', e);
  }
}

export function removeAlarm(id: string): BusAlarm[] {
  let alarms = getAlarms().filter(a => a.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  } catch (e) {
    console.error('Failed to remove alarm', e);
  }
  return alarms;
}
