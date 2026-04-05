'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/store/AppContext';
import { useTheme } from '@/store/ThemeContext';
import { Tab } from '@/types';
import { Dashboard } from '@/components/Dashboard';
import { ExamTracker } from '@/components/ExamTracker';
import { StudyLogger } from '@/components/StudyLogger';
import { HabitTracker } from '@/components/HabitTracker';
import { ThemeToggle } from '@/components/ThemeToggle';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '◉' },
  { id: 'exams', label: 'Exams', icon: '◈' },
  { id: 'study', label: 'Study', icon: '◐' },
  { id: 'habits', label: 'Habits', icon: '◆' },
];

export default function TrackerApp() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              AP Tracker
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Stay sharp. Score high.</p>
          </div>
          <ThemeToggle />
        </header>

        <nav className="fixed bottom-0 left-0 right-0 md:relative md:mb-8 z-50">
          <div className="backdrop-blur-xl border-t md:border md:rounded-2xl transition-colors duration-300"
            style={{
              backgroundColor: 'var(--nav-bg)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="max-w-5xl mx-auto flex md:justify-center">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 md:flex-none flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-3 md:px-5 md:py-2.5 text-xs md:text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? ''
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
                  }}
                >
                  <span className="text-lg md:text-base">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 md:hidden"
                      style={{ backgroundColor: 'var(--accent)' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'exams' && <ExamTracker />}
            {activeTab === 'study' && <StudyLogger />}
            {activeTab === 'habits' && <HabitTracker />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
