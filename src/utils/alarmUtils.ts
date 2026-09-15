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

/**
 * Play a synthesized dual-tone alarm beep using Web Audio API.
 * Works across mobile browsers without external audio file dependencies.
 */
export function playAlarmSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    const playBeep = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // 3-beep alarm chime sequence
    playBeep(880, 0, 0.25);    // A5
    playBeep(1174.66, 0.3, 0.35); // D6
    playBeep(1318.51, 0.7, 0.5);  // E6
  } catch (e) {
    console.warn('Could not play Web Audio alarm sound:', e);
  }
}

/**
 * Trigger mobile vibration pattern for bus alarm.
 */
export function triggerVibration(): void {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([400, 200, 400, 200, 400]);
    } catch {
      // Ignore vibration failures if blocked by policy
    }
  }
}
