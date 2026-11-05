import { DodoMascot } from './DodoMascot';
import { CheckCircle2, Calendar } from 'lucide-react';

interface HeroBannerProps {
  uncompletedCount: number;
  totalCount: number;
  selectedDate?: Date;
}

export const HeroBanner = ({
  uncompletedCount,
  totalCount,
  selectedDate = new Date(),
}: HeroBannerProps) => {
  const isAllDone = totalCount > 0 && uncompletedCount === 0;

  const dateLabel = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F3824] via-[#14422B] to-[#0D2E1E] text-white p-5 sm:p-6 shadow-xl shadow-[#0F3824]/20 border border-[#23583C]/40 select-none">
      {/* Decorative organic glow accents */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-10 w-44 h-44 rounded-full bg-[#296D46]/20 blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-2">
        {/* Left side text details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-[#D4EAD9] tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9C66B] animate-pulse" />
            <span>DAILY FOCUS</span>
          </div>

          <h2 className="text-3xl sm:text-[36px] font-extrabold tracking-tight text-white leading-none">
            Today
          </h2>

          <p className="mt-2 text-sm sm:text-base font-medium text-[#C8DECFA0] flex items-center gap-1.5">
            {isAllDone ? (
              <span className="text-[#A7E2BE] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#A7E2BE]" />
                All tasks done for today!
              </span>
            ) : uncompletedCount === 1 ? (
              <span>
                <strong className="text-white font-bold">1 task</strong> left to do
              </span>
            ) : (
              <span>
                <strong className="text-white font-bold">{uncompletedCount} tasks</strong> left for today
              </span>
            )}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#A8C7B3] font-medium bg-black/20 px-2.5 py-1 rounded-xl border border-white/5">
            <Calendar className="w-3.5 h-3.5 text-[#F9C66B]" />
            <span>{dateLabel}</span>
          </div>
        </div>

        {/* Right side mascot illustration */}
        <div className="shrink-0 flex items-center justify-center -mr-2 sm:mr-0">
          <DodoMascot
            size={165}
            mood={isAllDone ? 'running' : 'checklist'}
          />
        </div>
      </div>
    </div>
  );
};
