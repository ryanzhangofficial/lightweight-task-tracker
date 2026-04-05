import { APExam, StudySession, Habit } from '@/types';

const STORAGE_KEYS = {
  exams: 'ap-tracker-exams',
  sessions: 'ap-tracker-sessions',
  habits: 'ap-tracker-habits',
};

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getExams(): APExam[] {
  return loadFromStorage(STORAGE_KEYS.exams, []);
}

export function saveExams(exams: APExam[]): void {
  saveToStorage(STORAGE_KEYS.exams, exams);
}

export function getSessions(): StudySession[] {
  return loadFromStorage(STORAGE_KEYS.sessions, []);
}

export function saveSessions(sessions: StudySession[]): void {
  saveToStorage(STORAGE_KEYS.sessions, sessions);
}

export function getHabits(): Habit[] {
  return loadFromStorage(STORAGE_KEYS.habits, []);
}

export function saveHabits(habits: Habit[]): void {
  saveToStorage(STORAGE_KEYS.habits, habits);
}
