'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '@/store/AppContext';
import { APExam } from '@/types';
import { format } from 'date-fns';

const examColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4', '#f97316'];

const defaultExams = [
  'AP Calculus AB', 'AP Calculus BC', 'AP Statistics', 'AP Physics 1',
  'AP Physics 2', 'AP Chemistry', 'AP Biology', 'AP US History',
  'AP World History', 'AP European History', 'AP English Language',
  'AP English Literature', 'AP Computer Science A', 'AP Psychology',
  'AP Environmental Science', 'AP Human Geography', 'AP Macroeconomics',
  'AP Microeconomics', 'AP Government US', 'AP Comparative Government',
];

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
      className={`${inputCls} ${props.className || ''}`}
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

export function ExamTracker() {
  const { exams, addExam, updateExam, deleteExam } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', date: '', score: '', color: examColors[0] });
  const [topicInput, setTopicInput] = useState('');
  const [topics, setTopics] = useState<{ id: string; name: string; mastered: boolean }[]>([]);
  const [search, setSearch] = useState('');

  const resetForm = () => {
    setForm({ name: '', date: '', score: '', color: examColors[0] });
    setTopics([]);
    setTopicInput('');
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (exam: APExam) => {
    setForm({ name: exam.name, date: exam.date, score: exam.score?.toString() || '', color: exam.color });
    setTopics(exam.topics);
    setEditingId(exam.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.date) return;

    const examData: APExam = {
      id: editingId || uuidv4(),
      name: form.name,
      date: form.date,
      score: form.score ? parseInt(form.score) : null,
      color: form.color,
      topics,
      createdAt: editingId ? exams.find(e => e.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    };

    if (editingId) {
      updateExam(examData);
    } else {
      addExam(examData);
    }
    resetForm();
  };

  const addTopic = () => {
    if (!topicInput.trim()) return;
    setTopics(prev => [...prev, { id: uuidv4(), name: topicInput.trim(), mastered: false }]);
    setTopicInput('');
  };

  const toggleTopic = (id: string) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, mastered: !t.mastered } : t));
  };

  const removeTopic = (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  const filteredExams = exams.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          type="text"
          placeholder="Search exams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-48"
        />
        <button
          onClick={() => setShowForm(true)}
          className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          + Add Exam
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
              <label className={labelCls} style={{ color: 'var(--muted)' }}>Exam Name</label>
              <Input
                list="exam-suggestions"
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. AP Calculus BC"
              />
              <datalist id="exam-suggestions">
                {defaultExams.map(name => <option key={name} value={name} />)}
              </datalist>
            </div>
            <div>
              <label className={labelCls} style={{ color: 'var(--muted)' }}>Exam Date</label>
              <Input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: 'var(--muted)' }}>Target Score (1-5)</label>
              <Input
                type="number"
                min={1}
                max={5}
                value={form.score}
                onChange={e => setForm({ ...form, score: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: 'var(--muted)' }}>Color</label>
              <div className="flex gap-2 flex-wrap">
                {examColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    className={`w-7 h-7 rounded-full transition-transform ${form.color === color ? 'scale-125 ring-2 ring-white/30 dark:ring-white/30 ring-black/20' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls} style={{ color: 'var(--muted)' }}>Topics</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTopic()}
                placeholder="Add a topic..."
                className="flex-1"
              />
              <button
                onClick={addTopic}
                className="px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--foreground)' }}
              >
                Add
              </button>
            </div>
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {topics.map(topic => (
                  <span
                    key={topic.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                      topic.mastered ? 'bg-emerald-500/20 text-emerald-400' : ''
                    }`}
                    style={!topic.mastered ? { backgroundColor: 'var(--surface)', color: 'var(--muted)' } : {}}
                    onClick={() => toggleTopic(topic.id)}
                  >
                    {topic.mastered ? '✓' : '○'} {topic.name}
                    <button onClick={e => { e.stopPropagation(); removeTopic(topic.id); }} className="ml-1 hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={resetForm}
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
              {editingId ? 'Update' : 'Save'} Exam
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {filteredExams.map(exam => {
          const daysLeft = Math.ceil((new Date(exam.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const mastered = exam.topics.filter(t => t.mastered).length;
          const total = exam.topics.length;

          return (
            <motion.div
              key={exam.id}
              layout
              className="border rounded-xl p-4 transition-colors duration-300"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: exam.color }} />
                  <div>
                    <h3 className="font-medium">{exam.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {format(new Date(exam.date), 'MMM d, yyyy')}
                      {exam.score && ` • Target: ${exam.score}/5`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    daysLeft < 0 ? '' :
                    daysLeft <= 7 ? 'bg-red-500/10 text-red-400' :
                    daysLeft <= 30 ? 'bg-amber-500/10 text-amber-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}
                    style={daysLeft < 0 ? { backgroundColor: 'var(--surface)', color: 'var(--muted)' } : {}}
                  >
                    {daysLeft < 0 ? 'Passed' : daysLeft === 0 ? 'Today' : `${daysLeft}d`}
                  </span>
                  <button
                    onClick={() => startEdit(exam)}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted-light)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {total > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
                    <span>Topics mastered</span>
                    <span>{mastered}/{total}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(mastered / total) * 100}%`,
                        backgroundColor: exam.color,
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg" style={{ color: 'var(--muted)' }}>No exams tracked yet</p>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Add your AP exams to start tracking</p>
        </div>
      )}
    </div>
  );
}
