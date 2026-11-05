import { useState } from 'react';
import type { Task, TaskFilter } from '../types/task';
import { TaskCard } from './TaskCard';
import { DodoMascot } from './DodoMascot';
import { Filter, Plus } from 'lucide-react';

interface TaskListSectionProps {
  tasks: Task[];
  onToggle: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onAddTask: () => void;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export const TaskListSection = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onAddTask,
  filter,
  onFilterChange,
}: TaskListSectionProps) => {
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.is_completed;
    if (filter === 'completed') return t.is_completed;
    if (filter === 'reminders') return !!t.remind;
    return true; // 'all'
  });

  return (
    <div className="w-full h-full rounded-3xl bg-white border border-[#E2EAE4] shadow-sm p-4 sm:p-4.5 flex flex-col select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-[#15241B] tracking-tight">
            Today
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#1E5338] border border-[#CADBD0]">
            {filteredTasks.length}
          </span>
        </div>

        {/* "See all" toggle */}
        <button
          type="button"
          onClick={() => setShowAllFilters((prev) => !prev)}
          className="text-xs font-bold text-[#1E5338] hover:text-[#143B28] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{showAllFilters ? 'Hide' : 'See all'}</span>
          <Filter className="w-3 h-3 stroke-[2.2]" />
        </button>
      </div>

      {/* Filter Tabs when "See all" is activated */}
      {showAllFilters && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none animate-in fade-in duration-150">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'completed', label: 'Done' },
              { key: 'reminders', label: 'Alerts' },
            ] as { key: TaskFilter; label: string }[]
          ).map((tab) => {
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onFilterChange(tab.key)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1E5338] text-white shadow-sm'
                    : 'bg-[#FAF9F4] text-[#6F8175] border border-[#E2EAE4] hover:text-[#15241B]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Task Cards - 12px gap between cards */}
      <div className="flex-1 overflow-y-auto pr-0.5 max-h-[380px] sm:max-h-[460px]">
        {filteredTasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          /* Empty State with Sleeping Dodo Mascot */
          <div className="rounded-2xl border border-dashed border-[#E2EAE4] bg-[#FAF9F4] p-5 text-center flex flex-col items-center justify-center my-auto min-h-[180px]">
            <DodoMascot
              size={130}
              mood={filter === 'completed' ? 'standing' : 'sleeping'}
            />
            <h4 className="text-sm font-bold text-[#15241B] mt-2">
              {filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'reminders'
                ? 'No reminders scheduled'
                : 'All clear for today!'}
            </h4>
            <p className="text-[11px] text-[#8A9A8F] max-w-[200px] mt-1">
              {filter === 'completed'
                ? 'Check off tasks to see them completed.'
                : 'The dodo is resting. Tap below to add a new task.'}
            </p>
            <button
              type="button"
              onClick={onAddTask}
              className="mt-3 px-3 py-1.5 rounded-xl bg-[#1E5338] text-white text-xs font-bold hover:bg-[#16442D] shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
