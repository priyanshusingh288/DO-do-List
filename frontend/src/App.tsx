import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskCreateInput, TaskUpdateInput, TabType, TaskFilter } from './types/task';
import { taskApi } from './services/api';
import { TopNav } from './components/TopNav';
import { HeroBanner } from './components/HeroBanner';
import { ProgressCard } from './components/ProgressCard';
import { CalendarTile } from './components/CalendarTile';
import { AddPillButton } from './components/AddPillButton';
import { TaskListSection } from './components/TaskListSection';
import { BottomTabBar } from './components/BottomTabBar';
import { TaskModal } from './components/TaskModal';
import { CalendarModal } from './components/CalendarModal';
import { RemindersModal } from './components/RemindersModal';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';

export function App() {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: 'success' | 'error' | 'info',
    text: string,
    mascotMood?: 'running' | 'idea' | 'sleeping' | 'checklist'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text, mascotMood }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await taskApi.getTasks();
      setTasks(res.tasks);
      setIsLiveBackend(res.isLiveBackend);
    } catch {
      addToast('error', 'Could not load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    taskApi
      .getTasks()
      .then((res) => {
        if (isMounted) {
          setTasks(res.tasks);
          setIsLiveBackend(res.isLiveBackend);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
          addToast('error', 'Could not load tasks');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Derived counts
  const uncompletedCount = tasks.filter((t) => !t.is_completed).length;
  const completedCount = tasks.filter((t) => t.is_completed).length;
  const remindersCount = tasks.filter((t) => !!t.remind).length;

  // Handlers
  const handleToggleTask = async (taskId: number) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_completed: !t.is_completed } : t))
    );

    try {
      const res = await taskApi.toggleTask(taskId);
      setIsLiveBackend(res.isLiveBackend);
      const isDone = res.task.is_completed;
      addToast(
        'success',
        isDone ? 'Task completed! ✨' : 'Task marked active',
        isDone ? 'running' : 'checklist'
      );
    } catch (err: unknown) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, is_completed: !t.is_completed } : t))
      );
      const message = err instanceof Error ? err.message : 'Failed to toggle task';
      addToast('error', message);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const previous = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      const res = await taskApi.deleteTask(taskId);
      setIsLiveBackend(res.isLiveBackend);
      addToast('info', 'Task deleted');
    } catch (err: unknown) {
      setTasks(previous);
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      addToast('error', message);
    }
  };

  const handleCreateTask = async (input: TaskCreateInput) => {
    const res = await taskApi.createTask(input);
    setTasks((prev) => [res.task, ...prev]);
    setIsLiveBackend(res.isLiveBackend);
    addToast('success', 'Task added to schedule! 📋', 'idea');
  };

  const handleUpdateTask = async (taskId: number, updates: TaskUpdateInput) => {
    const res = await taskApi.updateTask(taskId, updates);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? res.task : t)));
    setIsLiveBackend(res.isLiveBackend);
    addToast('success', 'Task details updated', 'checklist');
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'today') {
      setFilter('all');
    } else if (tab === 'calendar') {
      setIsCalendarModalOpen(true);
    } else if (tab === 'reminders') {
      setIsRemindersModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5EE] text-[#15241B] flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 selection:bg-[#1E5338] selection:text-white relative">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Centered Mobile/Tablet Frame for high-end preview */}
      <main className="w-full max-w-[480px] bg-[#FAF9F4] sm:rounded-[36px] sm:border sm:border-[#E2EAE4] sm:shadow-[0_20px_50px_rgba(21,36,27,0.06)] min-h-screen sm:min-h-[860px] flex flex-col px-4 sm:px-6 relative overflow-hidden">
        {/* Top Navigation */}
        <TopNav
          isLiveBackend={isLiveBackend}
          onRefresh={loadTasks}
          isLoading={isLoading}
        />

        {/* Card 1: Top Dark Forest Green Card (HeroBanner) */}
        <div className="mt-1">
          <HeroBanner
            uncompletedCount={uncompletedCount}
            totalCount={tasks.length}
            selectedDate={selectedDate}
          />
        </div>

        {/* Card 2: Middle Vibrant Green Card (ProgressCard) */}
        <div className="mt-3">
          <ProgressCard
            tasks={tasks}
            completedCount={completedCount}
            totalCount={tasks.length}
          />
        </div>

        {/* Lower Section: Asymmetric Bento Grid directly matching Image 2 */}
        <div className="grid grid-cols-12 gap-3 mt-3 mb-24 items-stretch">
          {/* Left Tall Column: Task List */}
          <div className="col-span-12 sm:col-span-7 flex flex-col">
            <TaskListSection
              tasks={tasks}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              onEdit={handleOpenEdit}
              onAddTask={() => setIsAddModalOpen(true)}
              filter={filter}
              onFilterChange={setFilter}
            />
          </div>

          {/* Right Column: Calendar Tile (top) + 148x94 Add Task Pill (bottom) */}
          <div className="col-span-12 sm:col-span-5 flex flex-col justify-between gap-3">
            <div className="flex-1">
              <CalendarTile
                selectedDate={selectedDate}
                onOpenCalendar={() => setIsCalendarModalOpen(true)}
                tasksCountForDay={tasks.filter((t) => t.start_time).length}
              />
            </div>
            <div className="shrink-0 flex justify-center">
              <AddPillButton onAddTask={() => setIsAddModalOpen(true)} />
            </div>
          </div>
        </div>

        {/* Floating Bottom Tab Bar */}
        <BottomTabBar
          currentTab={activeTab}
          onTabChange={handleTabChange}
          onQuickAdd={() => setIsAddModalOpen(true)}
          remindersCount={remindersCount}
        />

        {/* Modals */}
        <TaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmitCreate={handleCreateTask}
          defaultDate={selectedDate}
        />

        <TaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          onSubmitUpdate={handleUpdateTask}
          initialTask={editingTask}
        />

        <CalendarModal
          isOpen={isCalendarModalOpen}
          onClose={() => {
            setIsCalendarModalOpen(false);
            setActiveTab('today');
          }}
          tasks={tasks}
          selectedDate={selectedDate}
          onSelectDate={(d) => setSelectedDate(d)}
          onAddTaskForDate={(d) => {
            setSelectedDate(d);
            setIsCalendarModalOpen(false);
            setIsAddModalOpen(true);
          }}
          onToggleTask={handleToggleTask}
        />

        <RemindersModal
          isOpen={isRemindersModalOpen}
          onClose={() => {
            setIsRemindersModalOpen(false);
            setActiveTab('today');
          }}
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onEditTask={(t) => {
            setIsRemindersModalOpen(false);
            handleOpenEdit(t);
          }}
        />
      </main>

      {/* Subtle branding watermark on desktop backdrop */}
      <footer className="hidden sm:flex items-center gap-2 mt-4 text-xs font-semibold text-[#8A9A8F] select-none">
        <span>DO-do List</span>
        <span>•</span>
        <span>Forest Green & Warm Cream Aesthetic</span>
        <span>•</span>
        <span>FastAPI Ready</span>
      </footer>
    </div>
  );
}

export default App;
