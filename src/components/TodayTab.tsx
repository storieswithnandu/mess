import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, ArrowLeftRight, Utensils, Bus, MapPin, ChevronRight, Clock } from './Icons';
import { week1Menu, week2Menu } from '../data/menu';
import type { DailyMenu, DayOfWeek } from '../data/menu';
import { busSchedule } from '../data/busData';
import { getWeekParity, getFormatDate, getActiveOrNextMeal, parseBusTimeToMins, MEAL_WINDOWS } from '../utils/timeUtils';

interface TodayTabProps {
  onNavigateToBus: () => void;
  onNavigateToMess: () => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({ onNavigateToBus, onNavigateToMess }) => {
  const [direction, setDirection] = useState<'sahyadriToNila' | 'nilaToSahyadri'>('sahyadriToNila');
  const [selectedDayOffset, setSelectedDayOffset] = useState<0 | 1>(0);

  const now = new Date();
  const targetDate = new Date(now.getTime() + selectedDayOffset * 86400000);
  const weekParity = getWeekParity(targetDate);

  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = (now.getDay() + selectedDayOffset) % 7;
  const targetDayName = days[dayIndex];

  const currentMenu: DailyMenu = weekParity === 'odd' ? week1Menu[targetDayName] : week2Menu[targetDayName];

  // Dynamic Time & Active Meal Calibration
  const mealState = getActiveOrNextMeal(now);
  const displayMealType = selectedDayOffset === 0 
    ? (mealState.activeMeal ? mealState.activeMeal.type : mealState.nextMeal.type)
    : 'Breakfast';

  const isCurrentlyServing = selectedDayOffset === 0 && mealState.activeMeal !== null;
  const currentItems = currentMenu[displayMealType] || [];
  const timeRangeStr = MEAL_WINDOWS.find(w => w.type === displayMealType)?.timeRangeStr || '';

  // Dynamic Bus Countdown Calibration
  const [nextBusTime, setNextBusTime] = useState<string>('07:30');
  const [minutesLeft, setMinutesLeft] = useState<number>(18);

  useEffect(() => {
    const updateBusTiming = () => {
      const currentMins = now.getHours() * 60 + now.getMinutes();
      const routes = busSchedule.workingDays[direction];

      let foundBus = routes[0];
      let minDiff = 9999;

      for (const b of routes) {
        const busMins = parseBusTimeToMins(b.time);
        if (busMins >= currentMins && (busMins - currentMins) < minDiff) {
          minDiff = busMins - currentMins;
          foundBus = b;
        }
      }

      if (minDiff !== 9999) {
        setNextBusTime(foundBus.time);
        setMinutesLeft(minDiff);
      } else {
        // Next day morning fallback
        setNextBusTime(routes[0].time);
        setMinutesLeft(30);
      }
    };

    updateBusTiming();
    const timer = setInterval(updateBusTiming, 30000);
    return () => clearInterval(timer);
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
            padding: '0.4rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 800,
            fontSize: '0.9rem'
          }}>
            CampusPulse
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
            Kedaram Mess
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
            Kedaram Mess Menu
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
            Week {weekParity === 'odd' ? '1 / 3' : '2 / 4'} • {targetDayName}
          </p>
        </div>
      </div>

      {/* Shuttle Live Banner */}
      <div className="campus-card active-glow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bus size={17} color="var(--color-cyan)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Inter-Campus Shuttle
            </span>
          </div>

          <span className="badge badge-cyan">
            Next Departure
          </span>
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
              justifyContent: 'center'
            }}
            title="Swap Direction"
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Departs at <strong style={{ color: '#ffffff' }}>{nextBusTime} PM</strong> sharp
        </p>

        {/* Countdown Box */}
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Next shuttle arriving in
          </span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-cyan)' }}>
            {minutesLeft} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>mins</span>
          </span>
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

      {/* Active Meal Service Card (Calibrated to Real Time) */}
      <div className={`campus-card ${isCurrentlyServing ? 'emerald-glow' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Utensils size={18} color={isCurrentlyServing ? 'var(--color-emerald)' : 'var(--color-cyan)'} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
              {displayMealType} Service
            </h3>
          </div>

          <div className={`badge ${isCurrentlyServing ? 'badge-emerald' : 'badge-subtle'}`}>
            {isCurrentlyServing ? (
              <>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)' }}></span>
                Serving Now
              </>
            ) : 'Upcoming'}
          </div>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          Kedaram Dining Hall • <strong style={{ color: 'var(--color-cyan)' }}>{timeRangeStr}</strong>
        </p>

        {/* Meal Item Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {currentItems.map((item, idx) => {
            const isNonVeg = item.toLowerCase().includes('chicken') || item.toLowerCase().includes('egg');
            const isSpecial = item.toLowerCase().includes('paneer') || item.toLowerCase().includes('biriyani') || item.toLowerCase().includes('sweet') || item.toLowerCase().includes('kheer') || item.toLowerCase().includes('ice cream');

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

                <span className={`badge ${isNonVeg ? 'badge-rose' : isSpecial ? 'badge-amber' : 'badge-subtle'}`}>
                  {isNonVeg ? 'Non-Veg' : isSpecial ? 'Special' : 'Standard'}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={onNavigateToMess}
          style={{
            width: '100%',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: 'var(--color-cyan)',
            padding: '0.55rem',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          View Full Day Menu ➔
        </button>
      </div>

      {/* Later Shuttles */}
      <div className="campus-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em' }}>UPCOMING SHUTTLES</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{direction === 'sahyadriToNila' ? 'Sahyadri ➔ Nila' : 'Nila ➔ Sahyadri'}</p>
          </div>
          <Clock size={16} color="var(--text-muted)" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.75rem' }}>
          {busSchedule.workingDays[direction].slice(0, 4).map((bus, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{bus.time} {bus.isMultiple && '(m)'}</span>
              <span style={{ color: 'var(--text-muted)' }}>Standard Transit</span>
            </div>
          ))}
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
