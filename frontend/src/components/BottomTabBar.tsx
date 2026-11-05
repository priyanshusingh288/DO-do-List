import type { TabType } from '../types/task';
import { Calendar, Bell, Plus, CheckSquare } from 'lucide-react';

interface BottomTabBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onQuickAdd: () => void;
  remindersCount?: number;
}

export const BottomTabBar = ({
  currentTab,
  onTabChange,
  onQuickAdd,
  remindersCount = 0,
}: BottomTabBarProps) => {
  return (
    <div className="fixed bottom-5 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
      <nav
        aria-label="Bottom Navigation"
        className="pointer-events-auto bg-[#1E5338] text-white px-5 py-2.5 rounded-full shadow-[0_12px_30px_rgba(30,83,56,0.35)] border border-[#2D6C4B] flex items-center gap-3 sm:gap-6 backdrop-blur-md select-none transition-all"
      >
        {/* Tab 1: Today */}
        <button
          type="button"
          onClick={() => onTabChange('today')}
          aria-label="Today tasks"
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all cursor-pointer ${
            currentTab === 'today'
              ? 'text-white'
              : 'text-[#BACFBF] hover:text-white'
          }`}
        >
          <div className="relative">
            <CheckSquare className="w-5 h-5 stroke-[2.2]" />
            {currentTab === 'today' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#EFA343] ring-1 ring-[#1E5338]" />
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 tracking-tight">Today</span>
        </button>

        {/* Tab 2: Calendar */}
        <button
          type="button"
          onClick={() => onTabChange('calendar')}
          aria-label="Calendar view"
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all cursor-pointer ${
            currentTab === 'calendar'
              ? 'text-white'
              : 'text-[#BACFBF] hover:text-white'
          }`}
        >
          <div className="relative">
            <Calendar className="w-5 h-5 stroke-[2]" />
            {currentTab === 'calendar' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#EFA343] ring-1 ring-[#1E5338]" />
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 tracking-tight">Calendar</span>
        </button>

        {/* Central Elevated '+' Quick-Add Action */}
        <div className="relative -top-3">
          <button
            type="button"
            onClick={onQuickAdd}
            aria-label="Create new task"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFFFFF] to-[#FAF7F0] text-[#1E5338] shadow-[0_6px_16px_rgba(0,0,0,0.22)] ring-4 ring-[#1E5338] flex items-center justify-center active:scale-95 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Tab 4: Reminders */}
        <button
          type="button"
          onClick={() => onTabChange('reminders')}
          aria-label="Reminders"
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all cursor-pointer ${
            currentTab === 'reminders'
              ? 'text-white'
              : 'text-[#BACFBF] hover:text-white'
          }`}
        >
          <div className="relative">
            <Bell className="w-5 h-5 stroke-[2]" />
            {remindersCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-[#EFA343] text-[#15241B] text-[9px] font-black min-w-[14px] text-center leading-tight">
                {remindersCount}
              </span>
            )}
            {currentTab === 'reminders' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#EFA343] ring-1 ring-[#1E5338]" />
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 tracking-tight">Reminders</span>
        </button>
      </nav>
    </div>
  );
};
