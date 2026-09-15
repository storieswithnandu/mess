import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, ArrowLeftRight, Utensils, Bus, ThumbsUp, CloudCheck, MapPin, ChevronRight, Clock } from './Icons';
import { week1Menu, week2Menu } from '../data/menu';
import type { DailyMenu, DayOfWeek } from '../data/menu';
import { busSchedule } from '../data/busData';
import { getWeekParity, getFormatDate, getCurrentDay } from '../utils/timeUtils';

interface TodayTabProps {
  onNavigateToBus: () => void;
  onNavigateToMess: () => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({ onNavigateToBus, onNavigateToMess }) => {
  const [direction, setDirection] = useState<'sahyadriToNila' | 'nilaToSahyadri'>('sahyadriToNila');
  const [selectedDayOffset, setSelectedDayOffset] = useState<0 | 1>(0); // 0 = today, 1 = tomorrow

  const now = new Date();
  const targetDate = new Date(now.getTime() + selectedDayOffset * 86400000);
  const weekParity = getWeekParity(targetDate);
  // currentDayName removed
  
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = (now.getDay() + selectedDayOffset) % 7;
  const targetDayName = days[dayIndex];

  const currentMenu: DailyMenu = weekParity === 'odd' ? week1Menu[targetDayName] : week2Menu[targetDayName];

  // Dynamic Shuttle Countdown Calculation
  const [minutesLeft, setMinutesLeft] = useState<number>(12);
  const [nextBusTime, setNextBusTime] = useState<string>('01:00 PM');

  useEffect(() => {
    const updateCountdown = () => {
      const currentMins = now.getHours() * 60 + now.getMinutes();
      const routes = busSchedule.workingDays[direction];
      
      let foundTime = '01:00 PM';
      let minDiff = 999;

      for (const entry of routes) {
        const parts = entry.time.split(':');
        let h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        // Approximation for PM/AM in 12h format
        if (h < 7) h += 12; // PM
        const busMins = h * 60 + m;

        if (busMins >= currentMins && (busMins - currentMins) < minDiff) {
          minDiff = busMins - currentMins;
          foundTime = entry.time;
        }
      }

      setMinutesLeft(minDiff === 999 ? 15 : minDiff);
      setNextBusTime(foundTime);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 30000);
    return () => clearInterval(interval);
  }, [direction]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="app-viewport"
    >
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'var(--color-cyan)',
            color: '#0b1329',
            padding: '0.4rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 800,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            🎓 CampusPulse
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)' }}></span>
            Online
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: 'var(--border-subtle)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <MapPin size={13} color="var(--color-cyan)" />
            Sahyadri
          </div>
          <button style={{
            background: 'var(--bg-surface)',
            border: 'var(--border-subtle)',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}>
            <Bell size={16} />
          </button>
        </div>
      </header>

      {/* Greeting Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Hey, Student 👋
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
            Kedaram Mess • Week {weekParity === 'odd' ? '1 / 3' : '2 / 4'}
          </p>
        </div>

        <div className="badge badge-subtle" style={{ gap: '0.3rem', padding: '0.35rem 0.65rem' }}>
          <CloudCheck size={13} color="var(--color-cyan)" />
          <span>Cached</span>
        </div>
      </div>

      {/* Shuttle Live Banner */}
      <div className="campus-card active-glow" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bus size={17} color="var(--color-cyan)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Inter-Campus Shuttle
            </span>
          </div>

          <div className="badge badge-emerald">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)' }}></span>
            Filling up (70%)
          </div>
        </div>

        {/* Route Direction Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{direction === 'sahyadriToNila' ? 'Sahyadri' : 'Nila'}</span>
            <span style={{ color: 'var(--color-cyan)' }}>➔</span>
            <span>{direction === 'sahyadriToNila' ? 'Nila' : 'Sahyadri'}</span>
          </div>

          <button
            onClick={() => setDirection(prev => prev === 'sahyadriToNila' ? 'nilaToSahyadri' : 'sahyadriToNila')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-cyan)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease'
            }}
            title="Swap Direction"
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Departs at <strong style={{ color: '#ffffff' }}>{nextBusTime}</strong> sharp
        </p>

        {/* Progress Bar & Minutes Countdown */}
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Arriving at {direction === 'sahyadriToNila' ? 'Sahyadri Circle' : 'Nila Gate'} in
            </span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-cyan)' }}>
              {minutesLeft} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>mins</span>
            </span>
          </div>

          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(20, (1 - minutesLeft / 30) * 100))}%`, background: 'var(--color-cyan)' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            <span>Boarding Stop: Academic Block 1</span>
            <span>Bus #KL-09-8422</span>
          </div>
        </div>
      </div>

      {/* Date Toggle (Today vs Tomorrow) */}
      <div style={{
        background: 'var(--bg-surface)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-pill)',
        padding: '3px',
        display: 'flex',
        marginBottom: '1.25rem'
      }}>
        <button
          onClick={() => setSelectedDayOffset(0)}
          style={{
            flex: 1,
            border: 'none',
            background: selectedDayOffset === 0 ? 'var(--color-cyan)' : 'transparent',
            color: selectedDayOffset === 0 ? '#0b1329' : 'var(--text-muted)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Today ({getFormatDate(now).split(',')[1]?.trim() || 'Today'})
        </button>
        <button
          onClick={() => setSelectedDayOffset(1)}
          style={{
            flex: 1,
            border: 'none',
            background: selectedDayOffset === 1 ? 'var(--color-cyan)' : 'transparent',
            color: selectedDayOffset === 1 ? '#0b1329' : 'var(--text-muted)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Tomorrow
        </button>
      </div>

      {/* Lunch Service Card (Serving Now) */}
      <div className="campus-card" style={{ background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Utensils size={18} color="var(--color-amber)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Lunch Service</h3>
          </div>
          <div className="badge badge-amber">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-amber)' }}></span>
            Serving Now • 45m left
          </div>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          Mess Hall (Kedaram Dining) • <strong style={{ color: 'var(--color-cyan)' }}>12:30 PM – 02:30 PM</strong>
        </p>

        {/* Menu Item Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {currentMenu.Lunch.slice(0, 5).map((item, idx) => {
            const isVegSpecial = item.toLowerCase().includes('paneer') || item.toLowerCase().includes('khichdi');
            const isNonVeg = item.toLowerCase().includes('chicken') || item.toLowerCase().includes('egg');

            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: `2px solid ${isNonVeg ? 'var(--color-rose)' : 'var(--color-emerald)'}`,
                    display: 'inline-block'
                  }}></span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{item}</span>
                </div>

                <span className={`badge ${isNonVeg ? 'badge-rose' : isVegSpecial ? 'badge-amber' : 'badge-subtle'}`}>
                  {isNonVeg ? 'Non-Veg Option' : isVegSpecial ? 'Veg Special' : 'Standard'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rating & Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ThumbsUp size={14} color="var(--color-amber)" />
            <strong style={{ color: '#ffffff' }}>88%</strong> students approved
          </span>
          <button
            onClick={onNavigateToMess}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: 'var(--color-cyan)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            View Full Menu
          </button>
        </div>
      </div>

      {/* Next Meal Preview */}
      <div className="campus-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-cyan)', letterSpacing: '0.05em' }}>NEXT MEAL</span>
            <span className="badge badge-subtle">04:30 PM</span>
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem' }}>Evening Snacks</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {currentMenu.Snacks.join(', ')} • Tea & Coffee
          </p>
        </div>
        <button
          onClick={onNavigateToMess}
          style={{ background: 'transparent', border: 'none', color: 'var(--color-cyan)', cursor: 'pointer' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Later Shuttles */}
      <div className="campus-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em' }}>LATER SHUTTLES</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{direction === 'sahyadriToNila' ? 'Sahyadri ➔ Nila' : 'Nila ➔ Sahyadri'}</p>
          </div>
          <Clock size={16} color="var(--text-muted)" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>02:15 PM</span>
            <span style={{ color: 'var(--text-muted)' }}>Class Rush Express</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>03:45 PM</span>
            <span style={{ color: 'var(--text-muted)' }}>Regular Trip</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.4rem 0' }}>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>05:30 PM</span>
            <span className="badge badge-emerald">High Frequency</span>
          </div>
        </div>

        <button
          onClick={onNavigateToBus}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-cyan)',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          View complete timetable <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};
