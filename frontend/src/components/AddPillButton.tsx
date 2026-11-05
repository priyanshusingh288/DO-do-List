import { Plus } from 'lucide-react';

interface AddPillButtonProps {
  onAddTask: () => void;
}

export const AddPillButton = ({ onAddTask }: AddPillButtonProps) => {
  return (
    <button
      type="button"
      onClick={onAddTask}
      aria-label="Add new task"
      className="group relative w-full h-[94px] min-h-[94px] rounded-full bg-gradient-to-r from-[#16462D] via-[#1E5338] to-[#286C48] text-white p-3 shadow-lg shadow-[#1E5338]/30 hover:shadow-xl hover:shadow-[#1E5338]/40 border-2 border-[#3C865F]/40 active:scale-[0.96] hover:scale-[1.02] transition-all duration-200 flex items-center justify-between px-5 select-none cursor-pointer overflow-hidden"
    >
      {/* Ambient glow highlight */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/15 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#F9C66B]/20 rounded-full blur-lg pointer-events-none" />

      {/* Text block */}
      <div className="flex flex-col text-left z-10">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#A2D5B4] group-hover:text-white transition-colors">
          Plan & DO
        </span>
        <span className="text-base font-black tracking-tight text-white leading-tight">
          + Add task
        </span>
        <span className="text-[10px] font-medium text-[#C4DEC9] mt-0.5">
          New schedule
        </span>
      </div>

      {/* Elevated circular plus icon */}
      <div className="w-12 h-12 rounded-full bg-white text-[#1E5338] shadow-md shadow-black/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#FAF9F4] transition-all duration-200">
        <Plus className="w-6 h-6 stroke-[3]" />
      </div>
    </button>
  );
};
