import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, ArrowLeftRight, Bell, Info, ChevronDown, ChevronUp } from './Icons';
import { busSchedule } from '../data/busData';

export const BusTimingTab: React.FC = () => {
  const [direction, setDirection] = useState<'sahyadriToNila' | 'nilaToSahyadri'>('sahyadriToNila');
  const [dayType, setDayType] = useState<'workingDays' | 'saturdays' | 'sundays'>('workingDays');
  const [showExtra, setShowExtra] = useState<boolean>(false);

  const currentRoute = busSchedule[dayType][direction];
  const extraBuses = busSchedule[dayType].extraBuses || [];

  // Helper to categorize times into Morning, Afternoon, Evening
  const categorizeTime = (timeStr: string) => {
    const parts = timeStr.split(':');
    let h = parseInt(parts[0], 10);
    if (h < 7) h += 12; // Approximation for PM times like 1:00, 2:15 etc.
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  };

  const morningBuses = currentRoute.filter(b => categorizeTime(b.time) === 'morning');
  const afternoonBuses = currentRoute.filter(b => categorizeTime(b.time) === 'afternoon');
  const eveningBuses = currentRoute.filter(b => categorizeTime(b.time) === 'evening');

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
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-emerald)', letterSpacing: '0.05em' }}>LIVE SHUTTLE TRACKING</span>
          </div>
          <span className="badge badge-subtle">🚍 EV Shuttle #4</span>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
          Next Departure from {direction === 'sahyadriToNila' ? 'Sahyadri Main Gate' : 'Nila Main Gate'}
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
            08 mins left
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', fontWeight: 700 }}>(01:15 PM)</span>
        </div>

        <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span>Occupancy Meter</span>
            <span style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>~14 seats free</span>
          </div>

          <div className="progress-bar-track" style={{ margin: 0 }}>
            <div className="progress-bar-fill" style={{ width: '65%', background: 'var(--color-emerald)' }}></div>
          </div>
        </div>

        <button style={{
          width: '100%',
          background: 'var(--bg-subtle)',
          border: 'var(--border-subtle)',
          color: '#ffffff',
          padding: '0.6rem',
          borderRadius: 'var(--radius-pill)',
          fontWeight: 700,
          fontSize: '0.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem'
        }}>
          <Bell size={14} color="var(--color-amber)" />
          Remind Me (5m before)
        </button>
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

      {/* Notice Card */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.06)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 0.85rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-main)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Info size={16} color="var(--color-amber)" />
          <span>Regular Weekday Schedule • Timings adjust on Holidays</span>
        </div>
        <span style={{ color: 'var(--color-amber)', fontWeight: 700, whiteSpace: 'nowrap' }}>Rules</span>
      </div>

      {/* Daily Schedule List */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
        Daily Schedule
      </h3>

      {/* Morning Slots */}
      <div className="campus-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            🌅 Morning Slots
          </h4>
          <span className="badge badge-subtle">All Departed</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {morningBuses.map((bus, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                opacity: 0.6
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {bus.time} {bus.isMultiple && '(m)'}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>Standard Shuttle</span>
              </div>
              <span className="badge badge-subtle">Departed</span>
            </div>
          ))}
        </div>
      </div>

      {/* Afternoon Slots (Active Window) */}
      <div className="campus-card active-glow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            ☀️ Afternoon Slots
          </h4>
          <span className="badge badge-emerald">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)' }}></span>
            Active Window
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {afternoonBuses.map((bus, idx) => {
            const isFirstActive = idx === 0;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.85rem',
                  background: isFirstActive ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  border: isFirstActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: isFirstActive ? 'var(--color-cyan)' : '#ffffff' }}>
                    {bus.time} {bus.isMultiple && '(m)'}
                  </span>
                  {isFirstActive && (
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                      Next In 8m
                    </span>
                  )}
                </div>

                <span style={{ fontSize: '0.78rem', color: isFirstActive ? 'var(--color-cyan)' : 'var(--text-muted)', fontWeight: 600 }}>
                  {isFirstActive ? 'EV-4 🚍' : 'Standard Transit'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evening & Night Slots */}
      <div className="campus-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            🌙 Evening & Night Slots
          </h4>
          <span className="badge badge-subtle">Upcoming</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {eveningBuses.map((bus, idx) => {
            const isDinnerShuttle = bus.time === '7:30' || bus.time === '8:00';

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.55rem 0.75rem',
                  background: isDinnerShuttle ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  border: isDinnerShuttle ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: isDinnerShuttle ? 'var(--color-amber)' : '#ffffff' }}>
                    {bus.time} {bus.isMultiple && '(m)'}
                  </span>
                  {isDinnerShuttle && (
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Dinner Shuttle</span>
                  )}
                </div>

                <span style={{ fontSize: '0.75rem', color: isDinnerShuttle ? 'var(--color-amber)' : 'var(--text-muted)' }}>
                  {isDinnerShuttle ? 'High Demand' : 'Late Transit'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extra Buses & Town Routes Toggle */}
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
