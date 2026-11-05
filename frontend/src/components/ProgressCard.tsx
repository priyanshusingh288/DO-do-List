import { Sparkles, CheckCircle2, Clock } from 'lucide-react';
import type { Task } from '../types/task';
import { formatTimeRange } from '../utils/dateUtils';

interface ProgressCardProps {
  tasks: Task[];
  completedCount: number;
  totalCount: number;
}

export const ProgressCard = ({
  tasks,
  completedCount,
  totalCount,
}: ProgressCardProps) => {
  const percentDone = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Find next pending task
  const nextTask = tasks
    .filter((t) => !t.is_completed && t.start_time)
    .sort((a, b) => new Date(a.start_time!).getTime() - new Date(b.start_time!).getTime())[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E5338] via-[#2A724B] to-[#1B5235] text-white p-4 sm:p-5 shadow-lg shadow-[#1E5338]/15 border border-[#39825B]/40 select-none">
      {/* Subtle organic light reflections */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#4EA875]/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-3">
        {/* Top Header of Card 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#F9C66B]" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-tight text-[#E2F0E7]">
                Daily Rhythm
              </span>
              <span className="text-[10px] text-[#A6CEB5] ml-2 font-medium">
                Plan. Organise. DO.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/20 text-[11px] font-bold text-white border border-white/10">
            <CheckCircle2 className="w-3 h-3 text-[#87C99F]" />
            <span>{completedCount} / {totalCount} done</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#C4DEC9] font-medium mb-1.5">
            <span>Progress Completed</span>
            <span className="text-white font-extrabold">{percentDone}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-black/25 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#87C99F] via-[#F9C66B] to-[#F4B251] transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${percentDone}%` }}
            />
          </div>
        </div>

        {/* Next Up preview if exists */}
        {nextTask ? (
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-[#D4E8DA] truncate mr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7D7B7] shrink-0">
                Next Up:
              </span>
              <span className="font-semibold truncate text-white">{nextTask.title}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-semibold text-[#EBF4EE] shrink-0">
              <Clock className="w-2.5 h-2.5 text-[#F9C66B]" />
              <span>{formatTimeRange(nextTask.start_time, nextTask.end_time)}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs text-[#C4DEC9]">
            <span className="text-[11px] italic">All scheduled tasks completed for today!</span>
            <span className="text-[10px] font-bold text-[#F9C66B]">Well done 🎉</span>
          </div>
        )}
      </div>
    </div>
  );
};
