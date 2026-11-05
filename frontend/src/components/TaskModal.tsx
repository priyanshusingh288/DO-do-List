import { useState } from 'react';
import type { Task, TaskCreateInput, TaskUpdateInput } from '../types/task';
import { DodoMascot } from './DodoMascot';
import {
  toInputDateTimeLocal,
  validateSchedule,
  parseLocalInputToIso,
} from '../utils/dateUtils';
import {
  X,
  Clock,
  Bell,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate?: (data: TaskCreateInput) => Promise<void>;
  onSubmitUpdate?: (taskId: number, data: TaskUpdateInput) => Promise<void>;
  initialTask?: Task | null;
  defaultDate?: Date;
}

interface FormInnerProps {
  onClose: () => void;
  onSubmitCreate?: (data: TaskCreateInput) => Promise<void>;
  onSubmitUpdate?: (taskId: number, data: TaskUpdateInput) => Promise<void>;
  initialTask?: Task | null;
  defaultDate?: Date;
}

function TaskModalForm({
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  initialTask,
  defaultDate,
}: FormInnerProps) {
  const isEditing = Boolean(initialTask);

  // Initialize form state
  const [title, setTitle] = useState(() => initialTask?.title || '');
  const [note, setNote] = useState(() => initialTask?.note || '');

  const [startTime, setStartTime] = useState(() => {
    if (initialTask?.start_time) {
      return toInputDateTimeLocal(new Date(initialTask.start_time));
    }
    const baseDate = defaultDate ? new Date(defaultDate) : new Date();
    const start = new Date(baseDate);
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
    return toInputDateTimeLocal(start);
  });

  const [endTime, setEndTime] = useState(() => {
    if (initialTask?.end_time) {
      return toInputDateTimeLocal(new Date(initialTask.end_time));
    }
    const baseDate = defaultDate ? new Date(defaultDate) : new Date();
    const start = new Date(baseDate);
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
    const end = new Date(start.getTime() + 45 * 60 * 1000);
    return toInputDateTimeLocal(end);
  });

  const [hasReminder, setHasReminder] = useState(() => Boolean(initialTask?.remind));

  const [remindTime, setRemindTime] = useState(() => {
    if (initialTask?.remind) {
      return toInputDateTimeLocal(new Date(initialTask.remind));
    }
    const baseDate = defaultDate ? new Date(defaultDate) : new Date();
    const start = new Date(baseDate);
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
    const remind = new Date(start.getTime() - 15 * 60 * 1000);
    return toInputDateTimeLocal(remind);
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset helpers
  const applyDurationMinutes = (mins: number) => {
    if (!startTime) return;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + mins * 60 * 1000);
    setEndTime(toInputDateTimeLocal(end));
  };

  const applyReminderOffset = (minsBefore: number) => {
    if (!startTime) return;
    const start = new Date(startTime);
    const remind = new Date(start.getTime() - minsBefore * 60 * 1000);
    setRemindTime(toInputDateTimeLocal(remind));
    setHasReminder(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    if (!startTime || !endTime) {
      setError('Start time and End time are required.');
      return;
    }

    // Validate using FastAPI backend rules
    const validation = validateSchedule(
      startTime,
      endTime,
      hasReminder && remindTime ? remindTime : null
    );

    if (!validation.valid) {
      setError(validation.error || 'Invalid schedule');
      return;
    }

    setIsSubmitting(true);
    try {
      const isoStart = parseLocalInputToIso(startTime);
      const isoEnd = parseLocalInputToIso(endTime);
      const isoRemind = hasReminder && remindTime ? parseLocalInputToIso(remindTime) : null;

      if (isEditing && initialTask && onSubmitUpdate) {
        await onSubmitUpdate(initialTask.id, {
          title: title.trim(),
          note: note.trim() || null,
          start_time: isoStart,
          end_time: isoEnd,
          remind: isoRemind,
        });
      } else if (onSubmitCreate) {
        await onSubmitCreate({
          title: title.trim(),
          note: note.trim() || null,
          start_time: isoStart,
          end_time: isoEnd,
          remind: isoRemind,
        });
      }

      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save task';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E2EAE4] shadow-2xl p-6 sm:p-7 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
      {/* Top Header with Dodo Companion */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E2EAE4]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#EBF3ED] border border-[#CADBD0] flex items-center justify-center shrink-0 shadow-inner p-1">
            <DodoMascot mood="idea" size={44} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#15241B]">
                {isEditing ? 'Edit Task' : 'Add New Task'}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#1E5338]">
                Plan. Organise. DO.
              </span>
            </div>
            <p className="text-xs text-[#8A9A8F] mt-0.5">
              {isEditing ? 'Adjust schedule and reminders' : 'Schedule your task intervals with the dodo'}
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

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1">
        {/* Error Banner if any */}
        {error && (
          <div className="p-3 rounded-2xl bg-[#FFF1F1] border border-[#FAD3D3] text-[#D94F4F] text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="font-medium">{error}</div>
          </div>
        )}

        {/* Title Input */}
        <div>
          <label className="block text-xs font-bold text-[#15241B] uppercase tracking-wider mb-1">
            Task Title <span className="text-[#D94F4F]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design review with engineering"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE4] focus:border-[#1E5338] focus:ring-2 focus:ring-[#1E5338]/15 outline-none text-sm text-[#15241B] placeholder-[#A0B0A5] transition-all bg-[#FAF9F4]"
          />
        </div>

        {/* Start and End Time (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Start Time */}
          <div>
            <label className="block text-xs font-bold text-[#15241B] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1E5338]" />
              <span>Start Time *</span>
            </label>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E2EAE4] focus:border-[#1E5338] focus:ring-2 focus:ring-[#1E5338]/15 outline-none text-xs text-[#15241B] bg-[#FAF9F4]"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-xs font-bold text-[#15241B] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1E5338]" />
              <span>End Time *</span>
            </label>
            <input
              type="datetime-local"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E2EAE4] focus:border-[#1E5338] focus:ring-2 focus:ring-[#1E5338]/15 outline-none text-xs text-[#15241B] bg-[#FAF9F4]"
            />
          </div>
        </div>

        {/* Duration Quick Presets */}
        <div className="flex items-center gap-1.5 text-xs text-[#6F8175]">
          <span className="text-[11px] font-semibold text-[#8A9A8F]">Duration:</span>
          {[
            { label: '+30m', mins: 30 },
            { label: '+45m', mins: 45 },
            { label: '+1h', mins: 60 },
            { label: '+2h', mins: 120 },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyDurationMinutes(p.mins)}
              className="px-2 py-0.5 rounded-lg bg-[#F0F5F1] hover:bg-[#E1EDE4] text-[#1E5338] text-[11px] font-semibold border border-[#E0EBE2] transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Reminder Section */}
        <div className="p-3.5 rounded-2xl bg-[#FAF9F4] border border-[#E2EAE4] space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasReminder}
                onChange={(e) => setHasReminder(e.target.checked)}
                className="rounded text-[#1E5338] focus:ring-[#1E5338] w-4 h-4 border-[#CADBD0]"
              />
              <span className="text-xs font-bold text-[#15241B] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#EFA343]" />
                Set Reminder
              </span>
            </label>

            {hasReminder && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => applyReminderOffset(15)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-[#C07B1A] border border-[#FDE3B8] hover:bg-[#FFF7EB]"
                >
                  15m before
                </button>
                <button
                  type="button"
                  onClick={() => applyReminderOffset(30)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-[#C07B1A] border border-[#FDE3B8] hover:bg-[#FFF7EB]"
                >
                  30m before
                </button>
              </div>
            )}
          </div>

          {hasReminder && (
            <div className="animate-in fade-in duration-150">
              <input
                type="datetime-local"
                value={remindTime}
                onChange={(e) => setRemindTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2EAE4] focus:border-[#1E5338] outline-none text-xs text-[#15241B] bg-white"
              />
              <p className="text-[10px] text-[#8A9A8F] mt-1">
                * Note: Remind time must strictly be at or before task start time.
              </p>
            </div>
          )}
        </div>

        {/* Note Input */}
        <div>
          <label className="block text-xs font-bold text-[#15241B] uppercase tracking-wider mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#8A9A8F]" />
            <span>Notes (Optional)</span>
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add key context, links, or sub-points for the dodo to track..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE4] focus:border-[#1E5338] focus:ring-2 focus:ring-[#1E5338]/15 outline-none text-xs text-[#15241B] placeholder-[#A0B0A5] bg-[#FAF9F4] transition-all resize-none"
          />
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-[#E2EAE4] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#8A9A8F] hover:text-[#15241B] hover:bg-[#F3F5EE] transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#1E5338] hover:bg-[#16442D] text-white text-xs font-bold shadow-md shadow-[#1E5338]/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export const TaskModal = ({
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  initialTask,
  defaultDate,
}: TaskModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <TaskModalForm
        key={initialTask ? `task-edit-${initialTask.id}` : `task-new-${defaultDate?.toISOString() || 'now'}`}
        onClose={onClose}
        onSubmitCreate={onSubmitCreate}
        onSubmitUpdate={onSubmitUpdate}
        initialTask={initialTask}
        defaultDate={defaultDate}
      />
    </div>
  );
};
