export interface APExam {
  id: string;
  name: string;
  date: string;
  score: number | null;
  color: string;
  topics: Topic[];
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  mastered: boolean;
}

export interface StudySession {
  id: string;
  examId: string;
  date: string;
  duration: number;
  notes: string;
  rating: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  completedDates: string[];
  streak: number;
  createdAt: string;
}

export type Tab = 'dashboard' | 'exams' | 'study' | 'habits';
