'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '@/store/AppContext';
import { StudySession } from '@/types';
import { format, parseISO } from 'date-fns';

const inputCls = 'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors duration-200';
const labelCls = 'text-xs uppercase tracking-wider mb-1 block';
const cardCls = 'border rounded-xl transition-colors duration-300';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`${cardCls} ${className}`}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
    >
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${inputCls} ${props.className || ''}`}
      style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--foreground)' }}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputCls} resize-none ${props.className || ''}`}
      style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--foreground)' }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${inputCls} ${props.className || ''}`}
      style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--foreground)' }}
    />
  );
}

export function StudyLogger() {
  const { exams, sessions, addSession, deleteSession } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ examId: '', duration: '', notes: '', rating: 3, date: format(new Date(), 'yyyy-MM-dd') });
  const [filter, setFilter] = useState<string>('all');

  const handleSubmit = () => {
    if (!form.examId || !form.duration) return;

    const session: StudySession = {
      id: uuidv4(),
      examId: form.examId,
      date: form.date,
      duration: parseInt(form.duration),
      notes: form.notes,
      rating: form.rating,
    };

    addSession(session);
    setForm({ examId: '', duration: '', notes: '', rating: 3, date: format(new Date(), 'yyyy-MM-dd') });
    setShowForm(false);
  };

  const filteredSessions = sessions
    .filter(s => filter === 'all' || s.examId === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalMinutes = filteredSessions.reduce((acc, s) => acc + s.duration, 0);
  const avgRating = filteredSessions.length > 0
    ? (filteredSessions.reduce((acc, s) => acc + s.rating, 0) / filteredSessions.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-48"
        >
          <option value="all">All Exams</option>
          {exams.map(exam => (
            <option key={exam.id} value={exam.id}>{exam.name}</option>
          ))}
        </Select>
        <button
          onClick={() => setShowForm(true)}
          className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          + Log Session
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-xl p-5 space-y-4"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: 'var(--muted)' }}>Exam</label>
              <Select
                value={form.examId}
                onChange={e => setForm({ ...form, examId: e.target.value })}
              >
                <option value="">Select exam...</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className={labelCls} style={{ color: 'var(--muted)' }}>Duration (minutes)</label>
              <Input
                type="number"
                min={1}
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 45"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: 'var(--muted)' }}>Date</label>
              <Input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: 'var(--muted)' }}>Productivity (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setForm({ ...form, rating: n })}
                    className="w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200"
                    style={form.rating === n
                      ? { backgroundColor: 'var(--accent)', color: '#fff' }
                      : { backgroundColor: 'var(--surface)', color: 'var(--muted)' }
                    }
                    onMouseEnter={e => {
                      if (form.rating !== n) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
                    }}
                    onMouseLeave={e => {
                      if (form.rating !== n) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)';
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls} style={{ color: 'var(--muted)' }}>Notes</label>
            <TextArea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="What did you study?"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm transition-colors duration-200"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--foreground)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Log Session
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Total Time</p>
          <p className="text-xl font-bold mt-1">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Avg Rating</p>
          <p className="text-xl font-bold mt-1">{avgRating}/5</p>
        </Card>
      </div>

      <div className="space-y-2">
        {filteredSessions.map(session => {
          const exam = exams.find(e => e.id === session.examId);
          return (
            <motion.div
              key={session.id}
              layout
              className="border rounded-xl p-4 transition-colors duration-300 group"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: exam?.color || '#888' }} />
                    <span className="font-medium text-sm">{exam?.name || 'Unknown'}</span>
                  </div>
                  {session.notes && (
                    <p className="text-xs mt-1 ml-4" style={{ color: 'var(--muted)' }}>{session.notes}</p>
                  )}
                  <p className="text-xs mt-1 ml-4" style={{ color: 'var(--muted)' }}>
                    {format(parseISO(session.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-mono font-medium">{session.duration}m</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                          style={{ backgroundColor: i < session.rating ? 'var(--accent)' : 'var(--surface)' }}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-sm"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg" style={{ color: 'var(--muted)' }}>No study sessions logged</p>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Start logging your study time</p>
        </div>
      )}
    </div>
  );
}
