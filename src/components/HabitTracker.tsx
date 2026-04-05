'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '@/store/AppContext';
import { Habit } from '@/types';
import { format, subDays } from 'date-fns';

const habitIcons = ['📚', '✍️', '🧠', '💪', '🎯', '⏰', '📝', '🔥', '💡', '📊'];

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

export function HabitTracker() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', icon: habitIcons[0] });
  const [viewDays, setViewDays] = useState(14);

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    const habit: Habit = {
      id: uuidv4(),
      name: form.name.trim(),
      icon: form.icon,
      completedDates: [],
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    addHabit(habit);
    setForm({ name: '', icon: habitIcons[0] });
    setShowForm(false);
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const days = Array.from({ length: viewDays }, (_, i) => {
    const date = subDays(new Date(), viewDays - 1 - i);
    return format(date, 'yyyy-MM-dd');
  });

  const dayLabels = days.map(d => {
    const date = new Date(d + 'T00:00:00');
    return format(date, 'EEE').slice(0, 2);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setViewDays(d)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={viewDays === d
                ? { backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }
                : { backgroundColor: 'var(--surface)', color: 'var(--muted)' }
              }
              onMouseEnter={e => {
                if (viewDays !== d) (e.currentTarget as HTMLElement).style.color = 'var(--muted-light)';
              }}
              onMouseLeave={e => {
                if (viewDays !== d) (e.currentTarget as HTMLElement).style.color = 'var(--muted)';
              }}
            >
              {d}d
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          + Add Habit
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-xl p-5 space-y-4"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div>
            <label className={labelCls} style={{ color: 'var(--muted)' }}>Habit Name</label>
            <Input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Review flashcards"
            />
          </div>

          <div>
            <label className={labelCls} style={{ color: 'var(--muted)' }}>Icon</label>
            <div className="flex gap-2 flex-wrap">
              {habitIcons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setForm({ ...form, icon })}
                  className="w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all duration-200"
                  style={form.icon === icon
                    ? { backgroundColor: 'var(--accent-soft)', outline: `1px solid var(--accent)` }
                    : { backgroundColor: 'var(--surface)' }
                  }
                  onMouseEnter={e => {
                    if (form.icon !== icon) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={e => {
                    if (form.icon !== icon) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)';
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
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
              Add Habit
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {habits.map(habit => {
          const completedToday = habit.completedDates.includes(today);
          return (
            <motion.div
              key={habit.id}
              layout
              className="border rounded-xl p-4 transition-colors duration-300"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{habit.icon}</span>
                  <div>
                    <h3 className="font-medium text-sm">{habit.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      🔥 {habit.streak} day streak
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleHabit(habit.id, today)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                    style={completedToday
                      ? { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }
                      : { backgroundColor: 'var(--surface)', color: 'var(--muted)' }
                    }
                    onMouseEnter={e => {
                      if (!completedToday) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
                    }}
                    onMouseLeave={e => {
                      if (!completedToday) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)';
                    }}
                  >
                    {completedToday ? 'Done ✓' : 'Mark Done'}
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1">
                {days.map((date, i) => {
                  const completed = habit.completedDates.includes(date);
                  const isTodayDate = date === today;
                  return (
                    <button
                      key={date}
                      onClick={() => toggleHabit(habit.id, date)}
                      className="flex-shrink-0 w-6 h-8 rounded flex flex-col items-center justify-center text-[9px] transition-all duration-200"
                      style={completed
                        ? { backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }
                        : isTodayDate
                        ? { backgroundColor: 'var(--surface-hover)', color: 'var(--muted-light)' }
                        : { backgroundColor: 'rgba(39, 39, 42, 0.3)', color: 'var(--muted)' }
                      }
                      title={date}
                    >
                      <span className="text-[8px] opacity-60">{dayLabels[i]}</span>
                      <span className="font-medium">{new Date(date + 'T00:00:00').getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg" style={{ color: 'var(--muted)' }}>No habits tracked yet</p>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Build consistency during AP season</p>
        </div>
      )}
    </div>
  );
}
