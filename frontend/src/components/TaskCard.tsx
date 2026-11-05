import { useState } from 'react';
import type { Task } from '../types/task';
import { formatTimeRange, formatReminderTime } from '../utils/dateUtils';
import {
  Check,
  Clock,
  Bell,
  Trash2,
  Edit3,
  MoreVertical,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}: TaskCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const timeRange = formatTimeRange(task.start_time, task.end_time);
  const reminderTime = formatReminderTime(task.remind);

  return (
    <div
      className={`group relative rounded-2xl p-4 transition-all duration-200 border ${
        task.is_completed
          ? 'bg-[#FAF9F4]/70 border-[#E5ECE7] opacity-80'
          : 'bg-white border-[#E2EAE4] hover:border-[#CADBD0] shadow-[0_2px_8px_rgba(21,36,27,0.03)] hover:shadow-[0_4px_14px_rgba(21,36,27,0.06)]'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Left: Custom Rounded Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-label={task.is_completed ? 'Mark uncompleted' : 'Mark completed'}
          className={`shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
            task.is_completed
              ? 'bg-[#1E5338] border-[#1E5338] text-white scale-100 shadow-sm'
              : 'border-[#CADBD0] bg-white hover:border-[#1E5338] hover:scale-105'
          }`}
        >
          {task.is_completed && (
            <Check className="w-3.5 h-3.5 stroke-[3] animate-in zoom-in-50 duration-150" />
          )}
        </button>

        {/* Middle: Title, Time Badge, and Optional Note */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <h3
              onClick={() => onToggle(task.id)}
              className={`font-bold text-[15px] leading-snug cursor-pointer select-none transition-colors ${
                task.is_completed
                  ? 'line-through text-[#8A9A8F]'
                  : 'text-[#15241B] hover:text-[#1E5338]'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {/* Time range badge */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0F5F1] text-[#1E5338] border border-[#E0EBE2] text-[11px] font-semibold">
              <Clock className="w-3 h-3 text-[#1E5338]/80" />
              <span>{timeRange}</span>
            </div>

            {/* Reminder Badge if remind is set */}
            {reminderTime && (
              <div
                title={`Reminder set for ${reminderTime}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF7EB] text-[#C07B1A] border border-[#FDE3B8] text-[11px] font-medium"
              >
                <Bell className="w-2.5 h-2.5 fill-[#C07B1A]" />
                <span>{reminderTime}</span>
              </div>
            )}
          </div>

          {/* Optional Note Preview */}
          {task.note && (
            <div className="mt-2 text-xs text-[#6F8175] flex items-start gap-1.5 line-clamp-2 bg-[#FAF9F4] p-2 rounded-xl border border-[#EDF2EE]">
              <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#8A9A8F]" />
              <p className="leading-relaxed break-words">{task.note}</p>
            </div>
          )}
        </div>

        {/* Right: Reminder Bell & Quick Action Menu */}
        <div className="shrink-0 flex items-center gap-1 relative">
          {/* Subtle reminder bell */}
          {task.remind ? (
            <span
              title={`Reminder active at ${reminderTime}`}
              className="p-1 text-[#D98A28] rounded-full hover:bg-[#FFF7EB] transition-colors"
            >
              <Bell className="w-4 h-4 fill-[#EFA343] stroke-[#D98A28]" />
            </span>
          ) : (
            <span
              title="No reminder set"
              className="p-1 text-[#B6C7BC] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Bell className="w-4 h-4" />
            </span>
          )}

          {/* Action Dots */}
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="Task options"
            className="p-1 rounded-lg text-[#8A9A8F] hover:text-[#15241B] hover:bg-[#F0F5F1] transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Quick Action Dropdown Menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => {
                  setShowMenu(false);
                  setShowDeleteConfirm(false);
                }}
              />
              <div className="absolute right-0 top-7 z-30 w-36 rounded-xl bg-white border border-[#E2EAE4] shadow-lg shadow-black/5 py-1 text-xs select-none animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(task);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 text-[#15241B] hover:bg-[#F3F5EE] text-left transition-colors font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#1E5338]" />
                  <span>Edit details</span>
                </button>

                <div className="h-px bg-[#E2EAE4] my-1" />

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2 text-[#D94F4F] hover:bg-[#FFF1F1] text-left transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete task</span>
                  </button>
                ) : (
                  <div className="p-2 bg-[#FFF1F1] rounded-lg m-1">
                    <p className="text-[11px] text-[#D94F4F] font-semibold mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Confirm delete?
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowMenu(false);
                          onDelete(task.id);
                        }}
                        className="px-2 py-1 rounded bg-[#D94F4F] text-white text-[10px] font-bold hover:bg-[#C23C3C]"
                      >
                        Yes, delete
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(false);
                        }}
                        className="px-2 py-1 rounded bg-white text-[#8A9A8F] text-[10px] font-medium border border-[#E2EAE4]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
