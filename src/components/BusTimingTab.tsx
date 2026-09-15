import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, ArrowLeftRight, Bell, Info, ChevronDown, ChevronUp } from './Icons';
import { busSchedule } from '../data/busData';
import { parseBusTimeToMins } from '../utils/timeUtils';

export const BusTimingTab: React.FC = () => {
  const [direction, setDirection] = useState<'sahyadriToNila' | 'nilaToSahyadri'>('sahyadriToNila');
  const [dayType, setDayType] = useState<'workingDays' | 'saturdays' | 'sundays'>('workingDays');
  const [showExtra, setShowExtra] = useState<boolean>(false);

  const currentRoute = busSchedule[dayType][direction];
  const extraBuses = busSchedule[dayType].extraBuses || [];

  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  // Find next upcoming bus dynamically
  let nextBusIndex = -1;
  let minDiff = 9999;

  currentRoute.forEach((bus, index) => {
    const bMins = parseBusTimeToMins(bus.time);
    if (bMins >= currentMins && (bMins - currentMins) < minDiff) {
      minDiff = bMins - currentMins;
      nextBusIndex = index;
    }
  });

  // Categorize buses into Morning, Afternoon, Evening
  const categorizeTime = (timeStr: string) => {
    const parts = timeStr.split(':');
    let h = parseInt(parts[0], 10);
    if (h < 7) h += 12;
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  };

  const morningBuses = currentRoute.filter(b => categorizeTime(b.time) === 'morning');
  const afternoonBuses = currentRoute.filter(b => categorizeTime(b.time) === 'afternoon');
  const eveningBuses = currentRoute.filter(b => categorizeTime(b.time) === 'evening');

  const renderBusList = (buses: typeof currentRoute) => {
    return buses.map((bus, idx) => {
      const bMins = parseBusTimeToMins(bus.time);
      const isPast = bMins < currentMins;
      const isNext = currentRoute.indexOf(bus) === nextBusIndex;

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
            justify: 'space-between',
            alignItems: 'center',
            padding: '0.6rem 0.85rem',
            background: isNext ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
            border: isNext ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-md)',
            opacity: isPast ? 0.55 : 1
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: isNext ? 'var(--color-cyan)' : '#ffffff',
              textDecoration: isPast ? 'line-through' : 'none'
            }}>
              {bus.time} {bus.isMultiple && '(m)'}
            </span>
            {isNext && (
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                {diffStr}
              </span>
            )}
          </div>

          <span style={{ fontSize: '0.75rem', color: isNext ? 'var(--color-cyan)' : isPast ? 'var(--text-sub)' : 'var(--text-muted)' }}>
            {isPast ? 'Departed' : isNext ? 'EV Shuttle 🚍' : diffStr}
          </span>
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
    >
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

        <button style={{
          background: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-main)',
          cursor: 'pointer'
        }}>
          <Bell size={18} />
        </button>
      </header>

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
        justify: 'space-around',
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
          <span className="badge badge-cyan">
            {nextBusIndex !== -1 ? currentRoute[nextBusIndex].time : '07:45'} PM
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
          Departure from {direction === 'sahyadriToNila' ? 'Sahyadri Main Gate' : 'Nila Main Gate'}
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
            {minDiff !== 9999 ? minDiff : 15} mins left
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
            justify: 'space-between',
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
