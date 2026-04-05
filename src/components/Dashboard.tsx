'use client';

import { useApp } from '@/store/AppContext';
import { format, differenceInDays } from 'date-fns';
import { Calendar } from '@/components/Calendar';

const cardCls = 'border rounded-xl p-4 transition-colors duration-300';
const mutedCls = 'text-xs font-medium uppercase tracking-wider';

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

export function Dashboard() {
  const { exams, sessions, habits } = useApp();

  const totalStudyHours = sessions.reduce((acc, s) => acc + s.duration, 0);
  const todaySessions = sessions.filter(s => s.date === format(new Date(), 'yyyy-MM-dd'));
  const upcomingExams = exams
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  const activeHabits = habits.filter(h => h.streak > 0);
  const totalTopics = exams.reduce((acc, e) => acc + e.topics.length, 0);
  const masteredTopics = exams.reduce((acc, e) => acc + e.topics.filter(t => t.mastered).length, 0);
  const masteryPercent = totalTopics > 0 ? Math.round((masteredTopics / totalTopics) * 100) : 0;

  const stats = [
    { label: 'Study Hours', value: totalStudyHours.toFixed(1), sub: 'total logged' },
    { label: 'Exams', value: exams.length.toString(), sub: `${upcomingExams.length} upcoming` },
    { label: 'Mastery', value: `${masteryPercent}%`, sub: `${masteredTopics}/${totalTopics} topics` },
    { label: 'Active Habits', value: activeHabits.length.toString(), sub: `${habits.length} total` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(stat => (
          <Card key={stat.label}>
            <p className={mutedCls} style={{ color: 'var(--muted)' }}>{stat.label}</p>
            <p className="text-2xl md:text-3xl font-bold mt-1" style={{
              background: 'linear-gradient(to right, var(--foreground), var(--muted))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{stat.sub}</p>
          </Card>
        ))}
      </div>

      {exams.length > 0 && (
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <Card className="p-4">
              <Calendar compact />
            </Card>
          </div>
          <div className="col-span-2">
            <Card className="p-4">
              <h2 className={`text-sm font-semibold ${mutedCls} mb-3`} style={{ color: 'var(--muted)' }}>Upcoming Exams</h2>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {upcomingExams.map(exam => {
                  const daysLeft = differenceInDays(new Date(exam.date), new Date());
                  return (
                    <div key={exam.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: exam.color }} />
                        <div>
                          <p className="font-medium text-sm">{exam.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{format(new Date(exam.date), 'MMM d')}</p>
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        daysLeft <= 7 ? 'bg-red-500/10 text-red-400' :
                        daysLeft <= 30 ? 'bg-amber-500/10 text-amber-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {daysLeft === 0 ? 'Today' : `${daysLeft}d`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}

      {todaySessions.length > 0 && (
        <Card className="p-5">
          <h2 className={`text-sm font-semibold ${mutedCls} mb-4`} style={{ color: 'var(--muted)' }}>Today's Study</h2>
          <div className="space-y-2">
            {todaySessions.map((session, idx) => {
              const exam = exams.find(e => e.id === session.examId);
              return (
                <div key={session.id} className="flex items-center justify-between py-2"
                  style={{ borderBottom: idx < todaySessions.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <div>
                    <p className="text-sm font-medium">{exam?.name || 'Unknown Exam'}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{session.notes.slice(0, 50)}{session.notes.length > 50 ? '...' : ''}</p>
                  </div>
                  <span className="text-sm font-mono" style={{ color: 'var(--muted-light)' }}>{session.duration}m</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {exams.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg" style={{ color: 'var(--muted)' }}>No exams added yet</p>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Head to the Exams tab to get started</p>
        </div>
      )}
    </div>
  );
}
