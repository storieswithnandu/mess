import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Utensils, Coffee, Moon, Sun, Filter, Sparkles } from './Icons';
import { week1Menu, week2Menu, DailyMenu, DayOfWeek } from '../data/menu';
import { getWeekParity, getFormatDate, getMealStatus, MEAL_WINDOWS } from '../utils/timeUtils';

export const MessMenuTab: React.FC = () => {
  const [selectedDayOffset, setSelectedDayOffset] = useState<0 | 1>(0);
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg' | 'special'>('all');

  const now = new Date();
  const targetDate = new Date(now.getTime() + selectedDayOffset * 86400000);
  const weekParity = getWeekParity(targetDate);

  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = (now.getDay() + selectedDayOffset) % 7;
  const targetDayName = days[dayIndex];

  const currentMenu: DailyMenu = weekParity === 'odd' ? week1Menu[targetDayName] : week2Menu[targetDayName];

  const filterItems = (items: string[]) => {
    if (dietFilter === 'all') return items;
    if (dietFilter === 'veg') return items.filter(i => !i.toLowerCase().includes('egg') && !i.toLowerCase().includes('chicken'));
    if (dietFilter === 'nonveg') return items.filter(i => i.toLowerCase().includes('egg') || i.toLowerCase().includes('chicken'));
    if (dietFilter === 'special') return items.filter(i => i.toLowerCase().includes('sweet') || i.toLowerCase().includes('biryani') || i.toLowerCase().includes('paneer') || i.toLowerCase().includes('ice cream') || i.toLowerCase().includes('kheer'));
    return items;
  };

  const mealCards = [
    { type: 'Breakfast' as const, icon: Sun, iconColor: 'var(--color-amber)' },
    { type: 'Lunch' as const, icon: Utensils, iconColor: 'var(--color-emerald)' },
    { type: 'Snacks' as const, icon: Coffee, iconColor: 'var(--color-cyan)' },
    { type: 'Dinner' as const, icon: Moon, iconColor: 'var(--color-purple)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="app-viewport"
    >
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Utensils size={20} color="var(--color-cyan)" />
            Kedaram Mess Menu
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            IIT Palakkad • Week {weekParity === 'odd' ? '1 / 3' : '2 / 4'} ({targetDayName})
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

      {/* Date Toggle */}
      <div style={{
        background: 'var(--bg-surface)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-pill)',
        padding: '3px',
        display: 'flex',
        marginBottom: '1rem'
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
            cursor: 'pointer'
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
            cursor: 'pointer'
          }}
        >
          Tomorrow
        </button>
      </div>

      {/* Diet Filter Pills */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { id: 'all', label: 'All Items', icon: Filter },
          { id: 'veg', label: 'Pure Veg', color: 'var(--color-emerald)' },
          { id: 'nonveg', label: 'Non-Veg', color: 'var(--color-rose)' },
          { id: 'special', label: 'Special Items', icon: Sparkles, color: 'var(--color-amber)' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setDietFilter(filter.id as any)}
            style={{
              background: dietFilter === filter.id ? 'var(--bg-subtle)' : 'var(--bg-surface)',
              color: dietFilter === filter.id ? '#ffffff' : 'var(--text-muted)',
              border: dietFilter === filter.id ? '1px solid var(--color-cyan)' : 'var(--border-subtle)',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            {filter.color && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: filter.color }}></span>}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Scheduled Meals List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Daily Schedule</h3>
        <span className="badge badge-emerald">Kedaram Mess</span>
      </div>

      {/* Render Each Meal Card */}
      {mealCards.map(({ type, icon: Icon, iconColor }) => {
        const mealTimeStr = MEAL_WINDOWS.find(w => w.type === type)?.timeRangeStr || '';
        const items = filterItems(currentMenu[type] || []);
        const mealStatus = selectedDayOffset === 0 ? getMealStatus(type, now) : { status: 'Upcoming' };

        const isServing = mealStatus.status === 'Serving Now';

        return (
          <div
            key={type}
            className={`campus-card ${isServing ? 'emerald-glow' : ''}`}
            style={{ borderLeft: isServing ? '4px solid var(--color-emerald)' : undefined }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Icon size={18} color={iconColor} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>{type}</h4>
              </div>

              <span className={`badge ${isServing ? 'badge-emerald' : mealStatus.status === 'Finished' ? 'badge-subtle' : 'badge-cyan'}`}>
                {isServing ? (
                  <>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)' }}></span>
                    Serving Now • {mealStatus.closesInMins}m left
                  </>
                ) : mealStatus.status}
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: isServing ? 'var(--color-cyan)' : 'var(--text-muted)', fontWeight: 600, marginBottom: '0.65rem' }}>
              {mealTimeStr}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {items.map((item, idx) => {
                const isNonVeg = item.toLowerCase().includes('chicken') || item.toLowerCase().includes('egg');

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: isNonVeg ? 'var(--color-rose)' : '#ffffff', fontWeight: 600 }}>
                    <span>{isNonVeg ? '🍗' : '🥦'}</span>
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};
