import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Utensils, Coffee, Moon, Sun, AlertCircle, Sparkles, Filter } from './Icons';
import { week1Menu, week2Menu } from '../data/menu';
import type { DailyMenu, DayOfWeek } from '../data/menu';
import { getWeekParity, getFormatDate } from '../utils/timeUtils';

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

  // Helper to filter items based on diet filter
  const filterItems = (items: string[]) => {
    if (dietFilter === 'all') return items;
    if (dietFilter === 'veg') return items.filter(i => !i.toLowerCase().includes('egg') && !i.toLowerCase().includes('chicken'));
    if (dietFilter === 'nonveg') return items.filter(i => i.toLowerCase().includes('egg') || i.toLowerCase().includes('chicken'));
    if (dietFilter === 'special') return items.filter(i => i.toLowerCase().includes('sweet') || i.toLowerCase().includes('biryani') || i.toLowerCase().includes('paneer') || i.toLowerCase().includes('ice cream'));
    return items;
  };

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
            Mess Menu
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Kedaram Mess • IIT Campus Dining
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

      {/* Dining Hall Selector */}
      <div style={{
        background: 'var(--bg-surface)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dining Hall:</span>
        <select style={{
          background: 'var(--bg-subtle)',
          color: 'var(--color-cyan)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          padding: '0.4rem 0.8rem',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 700,
          fontSize: '0.85rem',
          outline: 'none',
          cursor: 'pointer'
        }}>
          <option>Kedaram Mess (North)</option>
          <option>Sahyadri Mess (South)</option>
        </select>
      </div>

      {/* Notice Banner */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start'
      }}>
        <AlertCircle size={20} color="var(--color-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-amber)', letterSpacing: '0.05em' }}>MESS COMMITTEE NOTICE</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>2h ago</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '0.2rem', lineHeight: '1.35' }}>
            Week {weekParity === 'odd' ? '1 / 3' : '2 / 4'} is currently active. Always cross-check with official data!
          </p>
        </div>
      </div>

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
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          Tomorrow
          <span className="badge badge-amber" style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem' }}>SPECIAL</span>
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
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Scheduled Meals</h3>
        <span className="badge badge-emerald">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)' }}></span>
          Mess Active
        </span>
      </div>

      {/* Breakfast Card */}
      <div className="campus-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sun size={18} color="var(--color-amber)" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Breakfast</h4>
          </div>
          <span className="badge badge-subtle">07:30 AM - 09:30 AM</span>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.4', marginBottom: '0.85rem' }}>
          {filterItems(currentMenu.Breakfast).join(', ')}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>610 kcal est.</span>
          <span className="badge badge-emerald">Pure Veg & Egg</span>
        </div>
      </div>

      {/* Lunch Card (Ongoing Glow Effect) */}
      <div className="campus-card emerald-glow" style={{ borderLeft: '4px solid var(--color-emerald)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Utensils size={18} color="var(--color-emerald)" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Lunch</h4>
          </div>
          <span className="badge badge-emerald">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)' }}></span>
            Ongoing • Closes in 40m
          </span>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600, marginBottom: '0.6rem' }}>
          12:30 PM - 02:30 PM • High Traffic Now
        </p>

        {/* Detailed Menu items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.85rem' }}>
          {filterItems(currentMenu.Lunch).map((item, i) => {
            const isNonVeg = item.toLowerCase().includes('chicken') || item.toLowerCase().includes('egg');

            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: isNonVeg ? 'var(--color-amber)' : '#ffffff', fontWeight: 600 }}>
                <span>{isNonVeg ? '🍗' : '🥦'}</span>
                <span>{item}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span className="badge badge-subtle">820 kcal</span>
            <span className="badge badge-subtle">32g Protein</span>
          </div>

          <button style={{
            background: 'var(--bg-subtle)',
            border: 'var(--border-subtle)',
            color: 'var(--text-main)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            Rate Meal
          </button>
        </div>
      </div>

      {/* High Tea & Snacks */}
      <div className="campus-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Coffee size={18} color="var(--color-cyan)" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>High Tea & Snacks</h4>
          </div>
          <span className="badge badge-subtle">04:30 PM - 05:30 PM</span>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.4', marginBottom: '0.85rem' }}>
          {filterItems(currentMenu.Snacks).join(', ')}, Tea & Coffee
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>310 kcal est.</span>
          <button style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: 'var(--color-cyan)',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            🔔 Set Reminder
          </button>
        </div>
      </div>

      {/* Dinner Card */}
      <div className="campus-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Moon size={18} color="var(--color-purple)" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Dinner</h4>
          </div>
          <span className="badge badge-subtle">07:30 PM - 09:45 PM</span>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.4', marginBottom: '0.85rem' }}>
          {filterItems(currentMenu.Dinner).join(', ')}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span className="badge badge-subtle">Veg & Non-Veg Option</span>
          <span>740 kcal</span>
        </div>
      </div>

      {/* Report Quality Footer Card */}
      <div className="campus-card" style={{ textAlign: 'center', background: 'var(--bg-subtle)' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
          Report Quality or Food Shortage?
        </h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Instant ping to on-duty mess prefect & caterer desk.
        </p>
        <button style={{
          background: 'var(--color-cyan)',
          color: '#0b1329',
          border: 'none',
          padding: '0.5rem 1.5rem',
          borderRadius: 'var(--radius-pill)',
          fontWeight: 800,
          fontSize: '0.8rem',
          cursor: 'pointer'
        }}>
          Send Feedback
        </button>
      </div>
    </motion.div>
  );
};
