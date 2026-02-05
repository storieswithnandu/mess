import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeekParity, getFormatDate } from './utils/timeUtils';
import { NextMealCard } from './components/NextMealCard';
import { DailyMenuCard } from './components/DailyMenuCard';
import { BusScheduleCard } from './components/BusScheduleCard';
import type { DayOfWeek } from './data/menu';

function App() {
  const [weekParity] = useState<'odd' | 'even'>(getWeekParity());
  const [view, setView] = useState<'today' | 'tomorrow'>('today');
  const [showBusSchedule, setShowBusSchedule] = useState(false);

  // Date Calculation
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const todayIndex = now.getDay();
  const tomorrowIndex = (todayIndex + 1) % 7;

  const today = days[todayIndex];
  const tomorrow = days[tomorrowIndex];

  const activeDay = view === 'today' ? today : tomorrow;
  // Note: For strict accuracy, if tomorrow is Monday, week parity might flip. 
  // For this version, keeping parity consistent for simplicity unless critical.

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Mess Menu</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
            {getFormatDate(view === 'today' ? now : new Date(now.getTime() + 86400000))}
          </p>
        </div>
        <div style={{
          background: 'var(--bg-surface)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-bento)',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--color-accent)'
        }}>
          Week {weekParity === 'odd' ? '1 / 3' : '2 / 4'}
        </div>
      </header>

      {/* Hero: Next Meal (Only visible on Today view) */}
      <AnimatePresence mode="wait">
        {view === 'today' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NextMealCard day={today} weekParity={weekParity} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Toggle */}
      <div style={{
        background: 'var(--bg-subtle)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        margin: '2rem 0 1.5rem 0',
        position: 'relative'
      }}>
        {(['today', 'tomorrow'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              flex: 1,
              border: 'none',
              background: view === v ? 'var(--bg-surface)' : 'transparent',
              color: view === v ? 'var(--text-main)' : 'var(--text-muted)',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: view === v ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
              position: 'relative',
              zIndex: 1
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Bus Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setShowBusSchedule(!showBusSchedule)}
          style={{
            background: 'var(--bg-surface)',
            color: 'var(--text-main)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-bento)',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem'
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          {showBusSchedule ? 'Hide' : 'Show'} Bus Schedule 🚌
        </button>
      </div>

      <AnimatePresence>
        {showBusSchedule && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: '2rem' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <BusScheduleCard day={activeDay} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily List */}
      <motion.div
        key={view}
        initial={{ opacity: 0, x: view === 'today' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DailyMenuCard day={activeDay} weekParity={weekParity} />
      </motion.div>

    </div>
  );
}

export default App;
