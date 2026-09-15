import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Star, AlertTriangle, ShieldCheck, Heart } from './Icons';

export const SavedTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="app-viewport"
    >
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Bookmark size={22} color="var(--color-cyan)" />
          Saved & Favorites
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Bookmarked Shuttles, Mess Schedules & Campus Rules
        </p>
      </header>

      {/* Bookmarked Bus Route */}
      <div className="campus-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Star size={16} color="var(--color-amber)" fill="var(--color-amber)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Favorite Bus: 05:15 PM Express</h4>
          </div>
          <span className="badge badge-amber">High Demand</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Sahyadri ➔ Nila • Daily Post-Lab Commute (Multiple buses available)
        </p>
      </div>

      {/* Bookmarked Special Meal */}
      <div className="campus-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Heart size={16} color="var(--color-rose)" fill="var(--color-rose)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Favorite Meal: Biryani & Gulab Jamun</h4>
          </div>
          <span className="badge badge-emerald">Sunday Special</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Served on Sunday Lunch & Wednesday Dinner
        </p>
      </div>

      {/* Important Disclaimer Card */}
      <div className="campus-card" style={{ border: '1px solid rgba(245, 158, 11, 0.25)', background: 'rgba(245, 158, 11, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <AlertTriangle size={18} color="var(--color-amber)" />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>Official Disclaimer</h4>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
          💡 Always cross-check bus schedules and mess menu updates with official campus notice boards and staff. Timings may adjust on institute holidays.
        </p>
      </div>

      {/* Campus Info Card */}
      <div className="campus-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--color-cyan)" />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>IIT Palakkad Dining & Transit</h4>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Kedaram Mess (North) • Sahyadri Mess (South) • Inter-Campus Transit Sync v2.5
        </p>
      </div>
    </motion.div>
  );
};
