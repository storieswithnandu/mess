import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, ArrowLeftRight, Bell, ChevronDown, ChevronUp } from './Icons';
import { busSchedule } from '../data/busData';
import { parseBusTimesOrdered, formatBusTime } from '../utils/timeUtils';
import { getAlarms, toggleAlarm, clearAllAlarms, removeAlarm, type BusAlarm } from '../utils/alarmUtils';

export const BusTimingTab: React.FC = () => {
  const [direction, setDirection] = useState<'sahyadriToNila' | 'nilaToSahyadri'>('sahyadriToNila');
  const [dayType, setDayType] = useState<'workingDays' | 'saturdays' | 'sundays'>('workingDays');
  const [showExtra, setShowExtra] = useState<boolean>(false);
  const [alarms, setAlarms] = useState<BusAlarm[]>(getAlarms());
  const [showAlarmModal, setShowAlarmModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentRoute = busSchedule[dayType][direction];
  const extraBuses = busSchedule[dayType].extraBuses || [];

  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  // Ordered minutes for correct AM/PM resolution
  const orderedMins = parseBusTimesOrdered(currentRoute.map(b => b.time));

  // Find next upcoming bus dynamically
  let nextBusIndex = -1;
  let minDiff = 9999;

  orderedMins.forEach((bMins, index) => {
    if (bMins >= currentMins && (bMins - currentMins) < minDiff) {
      minDiff = bMins - currentMins;
      nextBusIndex = index;
    }
  });

  // Categorize buses into Morning, Afternoon, Evening using ordered minutes
  const morningBuses = currentRoute.filter((_, i) => orderedMins[i] < 12 * 60);
  const afternoonBuses = currentRoute.filter((_, i) => orderedMins[i] >= 12 * 60 && orderedMins[i] < 17 * 60);
  const eveningBuses = currentRoute.filter((_, i) => orderedMins[i] >= 17 * 60);

  // Auto-dismiss toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleToggleAlarm = (busTimeStr: string) => {
    const formatted = formatBusTime(busTimeStr);
    const label = direction === 'sahyadriToNila' ? 'Sahyadri ➔ Nila' : 'Nila ➔ Sahyadri';
    const result = toggleAlarm(busTimeStr, direction, label);
    setAlarms(result.alarms);

    if (result.isSet) {
      showToast(`🔔 Alarm set for ${formatted} (${label})`);
    } else {
      showToast(`🔕 Alarm removed for ${formatted}`);
    }
  };

  const handleRemoveAlarm = (id: string) => {
    const updated = removeAlarm(id);
    setAlarms(updated);
    showToast(`🔕 Alarm removed`);
  };

  const handleClearAll = () => {
    clearAllAlarms();
    setAlarms([]);
    showToast(`Cleared all bus alarms`);
  };

  // Background Alarm Checker Engine (Runs every 15 seconds)
  useEffect(() => {
    const checkAlarms = () => {
      const activeAlarms = getAlarms();
      if (activeAlarms.length === 0) return;

      const n = new Date();
      const curMinutes = n.getHours() * 60 + n.getMinutes();

      activeAlarms.forEach(alarm => {
        // Parse time
        const parts = alarm.timeStr.split(':');
        let hrs = parseInt(parts[0], 10);
        const mins = parseInt(parts[1], 10);
        let busMins = hrs * 60 + mins;
        if (hrs >= 1 && hrs <= 6) busMins += 12 * 60; // 1-6 PM heuristic

        const diff = busMins - curMinutes;
        // Trigger alert if bus is departing in 5 minutes
        if (diff === 5) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🚍 Campus Bus Reminder`, {
              body: `Bus departing at ${formatBusTime(alarm.timeStr)} (${alarm.directionLabel}) in 5 minutes!`,
              icon: '/mess-icon.svg'
            });
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 15000);
    return () => clearInterval(interval);
  }, []);

  const renderBusList = (buses: typeof currentRoute) => {
    return buses.map((bus, idx) => {
      const routeIdx = currentRoute.indexOf(bus);
      const bMins = orderedMins[routeIdx] ?? 0;
      const isPast = bMins < currentMins;
      const isNext = routeIdx === nextBusIndex;
      const alarmId = `${direction}_${bus.time}`;
      const hasAlarm = alarms.some(a => a.id === alarmId);

      let diffStr = '';
      if (isNext) {
        diffStr = `Next in ${minDiff}m`;
      } else if (!isPast) {
        const remaining = bMins - currentMins;
        const hrs = Math.floor(remaining / 60);
        const mins = remaining % 60;
        diffStr = hrs > 0 ? `In ${hrs}h ${mins}m` : `In ${mins}m`;
      }

      return (
        <div
          key={idx}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.65rem 0.85rem',
            background: isNext ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
            border: isNext ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-md)',
            opacity: isPast ? 0.7 : 1,
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0 }}>
            <span style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: isNext ? 'var(--color-cyan)' : '#ffffff',
              textDecoration: isPast ? 'line-through' : 'none',
              whiteSpace: 'nowrap'
            }}>
              {formatBusTime(bus.time)} {bus.isMultiple && '(m)'}
            </span>
            {isNext && (
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', flexShrink: 0 }}>
                {diffStr}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <span style={{ fontSize: '0.75rem', color: isNext ? 'var(--color-cyan)' : isPast ? 'var(--text-sub)' : 'var(--text-muted)' }}>
              {isPast ? 'Departed' : isNext ? 'Next 🚍' : diffStr}
            </span>

            {/* Touch-friendly Mobile Alarm Button */}
            <button
              onClick={() => handleToggleAlarm(bus.time)}
              title={hasAlarm ? 'Cancel Alarm' : 'Set Alarm (5m before)'}
              aria-label={hasAlarm ? 'Cancel Alarm' : 'Set Alarm'}
              style={{
                background: hasAlarm ? 'rgba(245, 158, 11, 0.25)' : 'rgba(56, 189, 248, 0.12)',
                border: hasAlarm ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.3rem 0.55rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: hasAlarm ? 'var(--color-amber)' : 'var(--color-cyan)',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <Bell 
                size={14} 
                color={hasAlarm ? 'var(--color-amber)' : 'var(--color-cyan)'} 
                fill={hasAlarm ? 'var(--color-amber)' : 'none'} 
              />
              <span>{hasAlarm ? 'Alarm On' : 'Alarm'}</span>
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="app-viewport"
      style={{ position: 'relative' }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: '#0b1329',
              border: '1px solid var(--color-cyan)',
              color: '#ffffff',
              padding: '0.65rem 1.1rem',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              pointerEvents: 'none'
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bus size={22} color="var(--color-cyan)" />
            CampusPulse Transit
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Transit / Bus Schedules • IIT Palakkad
          </p>
        </div>

        <button 
          onClick={() => setShowAlarmModal(true)}
          title="Active Alarms"
          style={{
            background: alarms.length > 0 ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
            border: alarms.length > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: alarms.length > 0 ? 'var(--color-amber)' : 'var(--text-main)',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Bell size={18} fill={alarms.length > 0 ? 'var(--color-amber)' : 'none'} />
          {alarms.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: 'var(--color-amber)',
              color: '#0b1329',
              fontSize: '0.62rem',
              fontWeight: 800,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {alarms.length}
            </span>
          )}
        </button>
      </header>

      {/* Active Alarms Modal */}
      <AnimatePresence>
        {showAlarmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                width: '100%',
                maxWidth: '380px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🔔 Active Bus Alarms ({alarms.length})
                </h3>
                <button
                  onClick={() => setShowAlarmModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>

              {alarms.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
                  <Bell size={28} color="var(--text-muted)" style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.85rem' }}>No active alarms set.</p>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>Tap the bell icon next to any bus time to set a reminder!</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem' }}>
                    {alarms.map(alarm => (
                      <div
                        key={alarm.id}
                        style={{
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center',
                          padding: '0.6rem 0.85rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-amber)', display: 'block' }}>
                            ⏰ {formatBusTime(alarm.timeStr)}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {alarm.directionLabel} (5 mins before)
                          </span>
                        </div>

                        <button
                          onClick={() => handleRemoveAlarm(alarm.id)}
                          style={{
                            background: 'rgba(244, 63, 94, 0.15)',
                            border: 'none',
                            color: 'var(--color-rose)',
                            padding: '0.3rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleClearAll}
                    style={{
                      width: '100%',
                      background: 'rgba(244, 63, 94, 0.12)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      color: 'var(--color-rose)',
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-pill)',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Clear All Alarms
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route Switcher Tabs */}
      <div style={{
        background: 'var(--bg-surface)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-pill)',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginBottom: '0.75rem'
      }}>
        <button
          onClick={() => setDirection('sahyadriToNila')}
          style={{
            flex: 1,
            border: 'none',
            background: direction === 'sahyadriToNila' ? 'var(--color-cyan)' : 'transparent',
            color: direction === 'sahyadriToNila' ? '#0b1329' : 'var(--text-muted)',
            padding: '0.6rem 0.5rem',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem'
          }}
        >
          Sahyadri ➔ Nila
        </button>

        <button
          onClick={() => setDirection('nilaToSahyadri')}
          style={{
            flex: 1,
            border: 'none',
            background: direction === 'nilaToSahyadri' ? 'var(--color-cyan)' : 'transparent',
            color: direction === 'nilaToSahyadri' ? '#0b1329' : 'var(--text-muted)',
            padding: '0.6rem 0.5rem',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem'
          }}
        >
          Nila ➔ Sahyadri
        </button>

        <button
          onClick={() => setDirection(prev => prev === 'sahyadriToNila' ? 'nilaToSahyadri' : 'sahyadriToNila')}
          style={{
            background: 'var(--bg-subtle)',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            color: 'var(--color-cyan)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowLeftRight size={16} />
        </button>
      </div>

      {/* Sub Stats Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-md)',
        padding: '0.5rem 0.75rem',
        marginBottom: '1.25rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <span>📍 6.8 km</span>
        <span>•</span>
        <span>⏱ 15-20 mins</span>
        <span>•</span>
        <span style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>⚡ Free Shuttle</span>
      </div>

      {/* Live Shuttle Tracking Card */}
      <div className="campus-card active-glow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-emerald)' }}></span>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-emerald)', letterSpacing: '0.05em' }}>NEXT SHUTTLE</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="badge badge-cyan">
              {nextBusIndex !== -1 ? formatBusTime(currentRoute[nextBusIndex].time) : '07:45 PM'}
            </span>
            {nextBusIndex !== -1 && (
              <button
                onClick={() => handleToggleAlarm(currentRoute[nextBusIndex].time)}
                title="Quick Alarm for Next Bus"
                style={{
                  background: alarms.some(a => a.id === `${direction}_${currentRoute[nextBusIndex].time}`) ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <Bell 
                  size={13} 
                  color={alarms.some(a => a.id === `${direction}_${currentRoute[nextBusIndex].time}`) ? 'var(--color-amber)' : '#ffffff'} 
                  fill={alarms.some(a => a.id === `${direction}_${currentRoute[nextBusIndex].time}`) ? 'var(--color-amber)' : 'none'} 
                />
              </button>
            )}
          </div>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
          Departure from {direction === 'sahyadriToNila' ? 'Sahyadri Main Gate' : 'Nila Main Gate'}
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
            {minDiff !== 9999 ? `${minDiff} mins left` : 'Finished for today'}
          </span>
        </div>
      </div>

      {/* Day Schedule Filter Pills */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {[
          { id: 'workingDays', label: 'Working Days' },
          { id: 'saturdays', label: 'Saturdays / Holidays' },
          { id: 'sundays', label: 'Sundays' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setDayType(tab.id as any)}
            style={{
              flex: 1,
              background: dayType === tab.id ? 'var(--color-cyan)' : 'var(--bg-surface)',
              color: dayType === tab.id ? '#0b1329' : 'var(--text-muted)',
              border: 'none',
              padding: '0.5rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.75rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daily Schedule List */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
        Daily Schedule
      </h3>

      {/* Morning Slots */}
      {morningBuses.length > 0 && (
        <div className="campus-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)' }}>🌅 Morning Slots</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {renderBusList(morningBuses)}
          </div>
        </div>
      )}

      {/* Afternoon Slots */}
      {afternoonBuses.length > 0 && (
        <div className="campus-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-cyan)' }}>☀️ Afternoon Slots</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {renderBusList(afternoonBuses)}
          </div>
        </div>
      )}

      {/* Evening Slots */}
      {eveningBuses.length > 0 && (
        <div className="campus-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>🌙 Evening & Night Slots</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {renderBusList(eveningBuses)}
          </div>
        </div>
      )}

      {/* Extra Buses Toggle */}
      <div className="campus-card" style={{ padding: '0.85rem 1rem' }}>
        <button
          onClick={() => setShowExtra(!showExtra)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-cyan)',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>📍 Palakkad Town & Wise Park Routes ({extraBuses.length})</span>
          {showExtra ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        <AnimatePresence>
          {showExtra && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.85rem' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {extraBuses.map((extra, i) => (
                  <div key={i} style={{ background: 'var(--bg-subtle)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-cyan)' }}>{extra.time}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>{extra.label}</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>{extra.route}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
