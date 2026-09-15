import React from 'react';
import { Calendar, Utensils, Bus, Bookmark } from './Icons';

export type TabType = 'today' | 'mess' | 'bus' | 'saved';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'mess', label: 'Mess Menu', icon: Utensils },
    { id: 'bus', label: 'Bus Timing', icon: Bus },
    { id: 'saved', label: 'Contacts', icon: Bookmark },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      background: 'rgba(11, 19, 41, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.5rem 1rem 0.75rem 1rem',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: isActive ? 'var(--color-cyan)' : 'transparent',
              color: isActive ? '#0b1329' : 'var(--text-muted)',
              border: 'none',
              padding: isActive ? '0.5rem 1.1rem' : '0.5rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              display: 'flex',
              flexDirection: isActive ? 'row' : 'column',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.78rem',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive ? '0 4px 14px rgba(56, 189, 248, 0.35)' : 'none'
            }}
          >
            <Icon size={isActive ? 18 : 20} color={isActive ? '#0b1329' : 'var(--text-muted)'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
