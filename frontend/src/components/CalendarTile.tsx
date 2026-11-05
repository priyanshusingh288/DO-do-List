import { ArrowUpRight } from 'lucide-react';

interface CalendarTileProps {
  selectedDate: Date;
  onOpenCalendar: () => void;
  tasksCountForDay: number;
}

export const CalendarTile = ({
  selectedDate,
  onOpenCalendar,
  tasksCountForDay,
}: CalendarTileProps) => {
  const dayNumber = selectedDate.getDate();
  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'short' });
  const weekday = selectedDate.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <button
      type="button"
      onClick={onOpenCalendar}
      className="group w-full h-full min-h-[105px] p-3.5 rounded-3xl bg-white border border-[#E2EAE4] hover:border-[#CADBD0] shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 text-left flex flex-col justify-between cursor-pointer select-none"
    >
      <div className="flex items-center justify-between w-full">
        {/* Calendar icon from reference sheet */}
        <div className="w-10 h-10 rounded-2xl bg-[#1A4A35] overflow-hidden shadow-sm flex items-center justify-center shrink-0">
          <img
            src="/assets/mascot/cal_icon.png"
            alt="Calendar Icon"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#FAF9F4] text-[#1E5338] border border-[#E2EAE4]">
            {weekday}
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#8A9A8F] group-hover:text-[#1E5338] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-[#15241B] leading-none">
              {dayNumber}
            </span>
            <span className="text-xs font-bold text-[#6F8175]">
              {monthName}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#8A9A8F] block mt-0.5">
            {tasksCountForDay} item{tasksCountForDay === 1 ? '' : 's'} scheduled
          </span>
        </div>

        <span className="text-[10px] font-bold text-[#1E5338] group-hover:underline">
          View Agenda
        </span>
      </div>
    </button>
  );
};
