import { useState } from 'react';
import type { Task } from '../types/task';
import { isSameDay, formatTimeRange } from '../utils/dateUtils';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Plus,
} from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onAddTaskForDate: (date: Date) => void;
  onToggleTask: (taskId: number) => void;
}

export const CalendarModal = ({
  isOpen,
  onClose,
  tasks,
  selectedDate,
  onSelectDate,
  onAddTaskForDate,
  onToggleTask,
}: CalendarModalProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(selectedDate));

  if (!isOpen) return null;

  // Month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Build calendar matrix
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  // Filter tasks for the selected date
  const dayTasks = tasks.filter((t) => {
    if (!t.start_time) return false;
    return isSameDay(new Date(t.start_time), selectedDate);
  });

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const formattedSelected = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Surface */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E2EAE4] shadow-2xl p-6 sm:p-7 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE4]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] text-[#1E5338] flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#15241B]">Calendar Agenda</h3>
              <p className="text-xs text-[#8A9A8F]">Schedule & daily overview</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8A9A8F] hover:text-[#15241B] hover:bg-[#F3F5EE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Body */}
        <div className="flex-1 overflow-y-auto pt-3 space-y-4">
          {/* Month Controller */}
          <div className="flex items-center justify-between px-1">
            <h4 className="font-extrabold text-sm text-[#15241B]">{monthLabel}</h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-[#6F8175] hover:bg-[#F0F5F1] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  setCurrentMonth(now);
                  onSelectDate(now);
                }}
                className="px-2 py-0.5 rounded text-[11px] font-bold text-[#1E5338] bg-[#EBF3ED] hover:bg-[#DDECE1] transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-[#6F8175] hover:bg-[#F0F5F1] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#8A9A8F] uppercase tracking-wider">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className="h-9" />;
              }

              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());
              const countForDay = tasks.filter(
                (t) => t.start_time && isSameDay(new Date(t.start_time), date)
              ).length;

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`h-9 rounded-xl flex flex-col items-center justify-center relative transition-all text-xs font-semibold ${
                    isSelected
                      ? 'bg-[#1E5338] text-white shadow-sm font-bold scale-105'
                      : isToday
                      ? 'bg-[#EBF3ED] text-[#1E5338] font-bold border border-[#CADBD0]'
                      : 'hover:bg-[#F3F5EE] text-[#15241B]'
                  }`}
                >
                  <span>{date.getDate()}</span>
                  {countForDay > 0 && (
                    <span
                      className={`w-1 h-1 rounded-full mt-0.5 ${
                        isSelected ? 'bg-[#EFA343]' : 'bg-[#1E5338]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tasks for the Selected Day */}
          <div className="pt-3 border-t border-[#E2EAE4]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#15241B]">
                Tasks for {formattedSelected} ({dayTasks.length})
              </span>
              <button
                type="button"
                onClick={() => onAddTaskForDate(selectedDate)}
                className="text-xs font-bold text-[#1E5338] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add for this day</span>
              </button>
            </div>

            {dayTasks.length > 0 ? (
              <div className="space-y-2">
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-[#FAF9F4] border border-[#E2EAE4] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleTask(t.id)}
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            t.is_completed
                              ? 'bg-[#1E5338] border-[#1E5338] text-white'
                              : 'border-[#CADBD0]'
                          }`}
                        >
                          {t.is_completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </button>
                        <span
                          className={`text-xs font-bold truncate ${
                            t.is_completed ? 'line-through text-[#8A9A8F]' : 'text-[#15241B]'
                          }`}
                        >
                          {t.title}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8A9A8F] mt-1 ml-6 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#1E5338]" />
                        <span>{formatTimeRange(t.start_time, t.end_time)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#8A9A8F] bg-[#FAF9F4] rounded-2xl border border-dashed border-[#E2EAE4]">
                No tasks scheduled for this day yet.
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2EAE4] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1E5338] text-white text-xs font-bold hover:bg-[#16442D]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
