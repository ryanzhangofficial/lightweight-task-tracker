'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/store/AppContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isBefore, startOfWeek, endOfWeek } from 'date-fns';
import { APExam, StudySession } from '@/types';

interface DayItem {
  type: 'exam' | 'session';
  data: APExam | StudySession;
  exam?: APExam;
}

interface CalendarProps {
  compact?: boolean;
}

function Calendar({ compact = false }: CalendarProps) {
  const { exams, sessions } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getItemsForDay = (date: Date): DayItem[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const items: DayItem[] = [];

    exams.forEach(exam => {
      if (exam.date === dateStr) {
        items.push({ type: 'exam', data: exam });
      }
    });

    sessions.forEach(session => {
      if (session.date === dateStr) {
        const exam = exams.find(e => e.id === session.examId);
        items.push({ type: 'session', data: session, exam });
      }
    });

    return items;
  };

  const selectedItems = selectedDay ? getItemsForDay(selectedDay) : [];

  const headerSize = compact ? 'text-xs' : 'text-sm';
  const dayLabelSize = compact ? '[10px]' : '[10px]';
  const buttonSize = compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs';
  const dotSize = compact ? 'w-1 h-1' : 'w-1.5 h-1.5';

  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      <div className="flex items-center justify-between">
        <h2 className={`font-semibold uppercase tracking-wider ${headerSize}`} style={{ color: 'var(--muted)' }}>
          Calendar
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className={`${buttonSize} rounded-lg flex items-center justify-center transition-colors duration-200`}
            style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)'; }}
          >
            ←
          </button>
          <span className={`font-medium text-center ${compact ? 'min-w-[90px] text-xs' : 'min-w-[120px] text-sm'}`}>
            {format(currentMonth, compact ? 'MMM yyyy' : 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className={`${buttonSize} rounded-lg flex items-center justify-center transition-colors duration-200`}
            style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)'; }}
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className={`text-center font-medium py-1 ${dayLabelSize}`} style={{ color: 'var(--muted)' }}>
            {day}
          </div>
        ))}

        {days.map((day, idx) => {
          const items = getItemsForDay(day);
          const examItems = items.filter(i => i.type === 'exam');
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDay && isSameDay(day, selectedDay);
          const today = isToday(day);
          const past = isBefore(day, new Date()) && !today;

          return (
            <button
              key={idx}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`
                relative aspect-square rounded flex flex-col items-center justify-center transition-all duration-200 ring-2
                ${isCurrentMonth ? '' : 'opacity-30'}
                ${isSelected ? 'ring-violet-500 dark:ring-violet-400 ring-black/10' : 'ring-transparent hover:opacity-80'}
              `}
              style={{
                backgroundColor: isSelected ? 'var(--accent-soft)' : today ? 'var(--surface-hover)' : 'transparent',
                color: past ? 'var(--muted)' : 'var(--foreground)',
              }}
            >
              <span className={`font-medium flex items-center justify-center ${today ? 'rounded-full w-5 h-5' : ''}`}
                style={today ? { backgroundColor: 'var(--accent)', color: '#fff', fontSize: compact ? '9px' : '10px' } : { fontSize: compact ? '10px' : '11px' }}
              >
                {format(day, 'd')}
              </span>
              {examItems.length > 0 && (
                <div className="flex gap-px mt-px">
                  {examItems.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className={`${dotSize} rounded-full`}
                      style={{ backgroundColor: (item.data as APExam).color }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {compact && selectedDay && (
        <div
          className="border rounded-lg p-3 space-y-2"
          style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent)' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            {format(selectedDay, 'EEEE, MMM d')}
          </p>
          {selectedItems.length > 0 ? (
            <div className="space-y-1.5">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  {item.type === 'exam' ? (
                    <>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: (item.data as APExam).color }} />
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>{(item.data as APExam).name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>Exam</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.exam?.color || '#888' }} />
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>{item.exam?.name || 'Unknown'}</span>
                      <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>{(item.data as StudySession).duration}m</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>No items</p>
          )}
        </div>
      )}

      {!compact && (
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="border rounded-lg p-3 space-y-2"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
                  {format(selectedDay, 'EEEE, MMMM d')}
                </p>
                {selectedItems.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {item.type === 'exam' ? (
                          <>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: (item.data as APExam).color }} />
                            <span className="font-medium">{(item.data as APExam).name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>Exam</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.exam?.color || '#888' }} />
                            <span className="font-medium">{item.exam?.name || 'Unknown'}</span>
                            <span className="text-xs" style={{ color: 'var(--muted)' }}>{(item.data as StudySession).duration}m</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>No items on this day</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export { Calendar };
