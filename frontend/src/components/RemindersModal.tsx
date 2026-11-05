import type { Task } from '../types/task';
import { formatTimeRange, formatReminderTime } from '../utils/dateUtils';
import {
  X,
  Bell,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onToggleTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
}

export const RemindersModal = ({
  isOpen,
  onClose,
  tasks,
  onToggleTask,
  onEditTask,
}: RemindersModalProps) => {
  if (!isOpen) return null;

  // Filter tasks that have reminders
  const reminderTasks = tasks.filter((t) => !!t.remind);

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
            <div className="w-8 h-8 rounded-xl bg-[#FFF7EB] text-[#C07B1A] flex items-center justify-center border border-[#FDE3B8]">
              <Bell className="w-4 h-4 fill-[#EFA343] stroke-[#C07B1A]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#15241B]">Scheduled Reminders</h3>
              <p className="text-xs text-[#8A9A8F]">
                {reminderTasks.length} reminder{reminderTasks.length === 1 ? '' : 's'} configured
              </p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-3 space-y-3">
          {reminderTasks.length > 0 ? (
            reminderTasks.map((t) => {
              const reminderTime = formatReminderTime(t.remind);
              const schedule = formatTimeRange(t.start_time, t.end_time);

              return (
                <div
                  key={t.id}
                  className="p-3.5 rounded-2xl bg-[#FAF9F4] border border-[#E2EAE4] hover:border-[#CADBD0] transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onToggleTask(t.id)}
                      className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
                        t.is_completed
                          ? 'bg-[#1E5338] border-[#1E5338] text-white'
                          : 'border-[#CADBD0] bg-white hover:border-[#1E5338]'
                      }`}
                    >
                      {t.is_completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          t.is_completed ? 'line-through text-[#8A9A8F]' : 'text-[#15241B]'
                        }`}
                      >
                        {t.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF7EB] text-[#C07B1A] border border-[#FDE3B8] text-[10px] font-bold">
                          <Bell className="w-2.5 h-2.5 fill-[#C07B1A]" />
                          Alert at {reminderTime}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[10px] text-[#8A9A8F]">
                          <Clock className="w-2.5 h-2.5 text-[#1E5338]" />
                          {schedule}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEditTask(t);
                    }}
                    className="text-[11px] font-semibold text-[#1E5338] hover:underline shrink-0"
                  >
                    Adjust
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 px-4 bg-[#FAF9F4] rounded-2xl border border-dashed border-[#E2EAE4]">
              <div className="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#1E5338] flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5 text-[#EFA343]" />
              </div>
              <h4 className="text-sm font-bold text-[#15241B]">No Reminders Active</h4>
              <p className="text-xs text-[#8A9A8F] max-w-xs mx-auto mt-1">
                You haven’t set any reminders yet. Click on any task or the "+ Add task" button to set an alert before your task begins.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E2EAE4] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1E5338] text-white text-xs font-bold hover:bg-[#16442D]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
