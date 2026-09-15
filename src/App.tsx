import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomNav } from './components/BottomNav';
import type { TabType } from './components/BottomNav';
import { TodayTab } from './components/TodayTab';
import { MessMenuTab } from './components/MessMenuTab';
import { BusTimingTab } from './components/BusTimingTab';
import { SavedTab } from './components/SavedTab';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* Dynamic Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'today' ? -15 : 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'today' ? 15 : -15 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'today' && (
            <TodayTab
              onNavigateToBus={() => setActiveTab('bus')}
              onNavigateToMess={() => setActiveTab('mess')}
            />
          )}

          {activeTab === 'mess' && <MessMenuTab />}

          {activeTab === 'bus' && <BusTimingTab />}

          {activeTab === 'saved' && <SavedTab />}
        </motion.div>
      </AnimatePresence>

      {/* Fixed Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
