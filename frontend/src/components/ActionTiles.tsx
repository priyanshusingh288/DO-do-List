import { Plus, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';

interface ActionTilesProps {
  onAddTask: () => void;
  onOpenCalendar: () => void;
  selectedDate?: Date;
}

export const ActionTiles = ({
  onAddTask,
  onOpenCalendar,
  selectedDate = new Date(),
}: ActionTilesProps) => {
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const weekday = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
  });

  return (
    <div className="grid grid-cols-2 gap-3 mt-3 select-none">
      {/* Tile 1: + Add task */}
      <button
        onClick={onAddTask}
        type="button"
        className="group relative flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-[#EBF3ED] via-[#E5EFE8] to-[#DDECE1] border border-[#CFE1D4] text-left shadow-sm hover:shadow-md hover:border-[#B4D0BC] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
      >
        <div className="flex items-center justify-between w-full">
          <div className="w-10 h-10 rounded-xl bg-[#1E5338] text-white flex items-center justify-center shadow-sm shadow-[#1E5338]/30 group-hover:scale-105 group-hover:bg-[#16442D] transition-all">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="p-1 rounded-full text-[#1E5338]/60 group-hover:text-[#1E5338] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        <div className="mt-4">
          <span className="text-base font-bold text-[#15241B] block group-hover:text-[#1E5338] transition-colors">
            + Add task
          </span>
          <span className="text-xs font-medium text-[#738578] mt-0.5 block">
            Plan or schedule
          </span>
        </div>
      </button>

      {/* Tile 2: Calendar */}
      <button
        onClick={onOpenCalendar}
        type="button"
        className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white border border-[#E2EAE4] text-left shadow-sm hover:shadow-md hover:border-[#CADBD0] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
      >
        <div className="flex items-center justify-between w-full">
          <div className="w-10 h-10 rounded-xl bg-[#FAF9F4] text-[#1E5338] border border-[#E2EAE4] flex items-center justify-center group-hover:bg-[#EBF3ED] group-hover:border-[#CFE1D4] transition-all">
            <CalendarIcon className="w-5 h-5 stroke-[2]" />
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FAF9F4] text-[#1E5338] border border-[#E2EAE4]">
            {weekday}
          </span>
        </div>

        <div className="mt-4">
          <span className="text-base font-bold text-[#15241B] block group-hover:text-[#1E5338] transition-colors">
            Calendar
          </span>
          <span className="text-xs font-semibold text-[#8A9A8F] mt-0.5 block flex items-center gap-1">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="text-[#3A7554] font-medium">Timeline</span>
          </span>
        </div>
      </button>
    </div>
  );
};
