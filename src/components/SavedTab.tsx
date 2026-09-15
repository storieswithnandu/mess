import React from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertTriangle } from './Icons';

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
          <Phone size={22} color="var(--color-cyan)" />
          Quick Contacts
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Auto drivers & campus helpline numbers
        </p>
      </header>

      {/* Coming Soon Card */}
      <div className="campus-card" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        border: '1px dashed rgba(56, 189, 248, 0.25)',
        background: 'rgba(56, 189, 248, 0.03)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          fontSize: '1.75rem'
        }}>
          🛺
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
          Auto Driver Numbers
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', maxWidth: '240px' }}>
          Trusted auto driver contacts for IIT Palakkad will be listed here soon.
        </p>
        <span className="badge badge-cyan" style={{ marginTop: '1rem' }}>
          Coming Soon
        </span>
      </div>

      {/* Disclaimer */}
      <div className="campus-card" style={{ border: '1px solid rgba(245, 158, 11, 0.25)', background: 'rgba(245, 158, 11, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <AlertTriangle size={18} color="var(--color-amber)" />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>Official Disclaimer</h4>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
          💡 Always cross-check bus schedules and mess menu updates with official campus notice boards and staff. Timings may adjust on institute holidays.
        </p>
      </div>
    </motion.div>
  );
};
