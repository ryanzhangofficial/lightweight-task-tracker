'use client';

import { APExam, StudySession, Habit } from '@/types';
import { getExams, saveExams, getSessions, saveSessions, getHabits, saveHabits } from '@/lib/storage';
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface AppState {
  exams: APExam[];
  sessions: StudySession[];
  habits: Habit[];
  addExam: (exam: APExam) => void;
  updateExam: (exam: APExam) => void;
  deleteExam: (id: string) => void;
  addSession: (session: StudySession) => void;
  deleteSession: (id: string) => void;
  addHabit: (habit: Habit) => void;
  toggleHabit: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [exams, setExams] = useState<APExam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setExams(getExams());
    setSessions(getSessions());
    setHabits(getHabits());
    setLoaded(true);
  }, []);

  const addExam = useCallback((exam: APExam) => {
    setExams(prev => {
      const next = [...prev, exam];
      saveExams(next);
      return next;
    });
  }, []);

  const updateExam = useCallback((exam: APExam) => {
    setExams(prev => {
      const next = prev.map(e => e.id === exam.id ? exam : e);
      saveExams(next);
      return next;
    });
  }, []);

  const deleteExam = useCallback((id: string) => {
    setExams(prev => {
      const next = prev.filter(e => e.id !== id);
      saveExams(next);
      return next;
    });
  }, []);

  const addSession = useCallback((session: StudySession) => {
    setSessions(prev => {
      const next = [...prev, session];
      saveSessions(next);
      return next;
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      saveSessions(next);
      return next;
    });
  }, []);

  const addHabit = useCallback((habit: Habit) => {
    setHabits(prev => {
      const next = [...prev, habit];
      saveHabits(next);
      return next;
    });
  }, []);

  const toggleHabit = useCallback((id: string, date: string) => {
    setHabits(prev => {
      const next = prev.map(h => {
        if (h.id !== id) return h;
        const completed = h.completedDates.includes(date);
        const completedDates = completed
          ? h.completedDates.filter(d => d !== date)
          : [...h.completedDates, date];
        const streak = calculateStreak(completedDates);
        return { ...h, completedDates, streak };
      });
      saveHabits(next);
      return next;
    });
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => {
      const next = prev.filter(h => h.id !== id);
      saveHabits(next);
      return next;
    });
  }, []);

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      exams, sessions, habits,
      addExam, updateExam, deleteExam,
      addSession, deleteSession,
      addHabit, toggleHabit, deleteHabit,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let current = new Date(today);
  
  for (const date of sorted) {
    const expected = current.toISOString().split('T')[0];
    if (date === expected) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else if (date < expected) {
      break;
    }
  }
  return streak;
}
