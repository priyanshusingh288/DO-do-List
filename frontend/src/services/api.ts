/**
 * API service for DO-do List
 * Integrates with FastAPI backend (/tasks) with seamless Local Storage fallback.
 */
import type { Task, TaskCreateInput, TaskUpdateInput } from '../types/task';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const STORAGE_KEY = 'dodo_tasks_v1';

// Seed initial demo tasks if local storage is empty
const INITIAL_DEMO_TASKS: Task[] = [
  {
    id: 1,
    title: 'Morning Forest Walk & Mindfulness',
    note: 'Stroll near the pine trees, deep breath work & mental clear-out.',
    start_time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(8, 45, 0, 0)).toISOString(),
    remind: new Date(new Date().setHours(7, 45, 0, 0)).toISOString(),
    is_completed: true,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 2,
    title: 'Review System Architecture with Team',
    note: 'Finalize database schema & async session pooling in FastAPI.',
    start_time: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    remind: new Date(new Date().setHours(9, 15, 0, 0)).toISOString(),
    is_completed: false,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 3,
    title: 'Draft DO-do List Component Hierarchy',
    note: 'Polishing Tailwind forest green aesthetics and cute mascot SVG.',
    start_time: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(12, 15, 0, 0)).toISOString(),
    remind: new Date(new Date().setHours(10, 50, 0, 0)).toISOString(),
    is_completed: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 4,
    title: 'Botanical Garden Seedling Watering',
    note: 'Mist the ferns and check soil moisture in the greenhouse.',
    start_time: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
    remind: null,
    is_completed: false,
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 5,
    title: 'Evening Chamomile Tea & Journaling',
    note: 'Reflect on wins of the day and sketch tomorrow’s priorities.',
    start_time: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(18, 30, 0, 0)).toISOString(),
    remind: new Date(new Date().setHours(17, 50, 0, 0)).toISOString(),
    is_completed: false,
    created_at: new Date().toISOString(),
  },
];

function getStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_TASKS));
      return INITIAL_DEMO_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_TASKS;
  }
}

function saveStoredTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const taskApi = {
  /**
   * Health check to detect if FastAPI is live
   */
  async checkBackend(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${BASE_URL}/`, { signal: controller.signal });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Fetch all tasks (with optional start_date and end_date)
   */
  async getTasks(params?: { startDate?: string; endDate?: string }): Promise<{ tasks: Task[]; isLiveBackend: boolean }> {
    try {
      const url = new URL(`${BASE_URL}/tasks`);
      if (params?.startDate) url.searchParams.append('start_date', params.startDate);
      if (params?.endDate) url.searchParams.append('end_date', params.endDate);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(url.toString(), { credentials: 'omit', signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: Task[] = await res.json();
      return { tasks: data, isLiveBackend: true };
    } catch {
      // Graceful local fallback
      let tasks = getStoredTasks();
      if (params?.startDate) {
        const start = new Date(params.startDate).getTime();
        tasks = tasks.filter((t) => (t.start_time ? new Date(t.start_time).getTime() >= start : true));
      }
      if (params?.endDate) {
        const end = new Date(params.endDate).getTime();
        tasks = tasks.filter((t) => (t.start_time ? new Date(t.start_time).getTime() <= end : true));
      }
      return { tasks, isLiveBackend: false };
    }
  },

  /**
   * Create a new task (matches POST /tasks)
   */
  async createTask(input: TaskCreateInput): Promise<{ task: Task; isLiveBackend: boolean }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        const detail = errJson?.detail?.[0]?.msg || errJson?.detail || 'Failed to create task';
        throw new Error(detail);
      }
      const data: Task = await res.json();
      return { task: data, isLiveBackend: true };
    } catch {
      // Local fallback create
      const tasks = getStoredTasks();
      const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
      const newTask: Task = {
        id: nextId,
        title: input.title,
        note: input.note || null,
        start_time: input.start_time,
        end_time: input.end_time,
        remind: input.remind || null,
        is_completed: false,
        created_at: new Date().toISOString(),
      };
      tasks.push(newTask);
      saveStoredTasks(tasks);
      return { task: newTask, isLiveBackend: false };
    }
  },

  /**
   * Toggle task completion (matches PATCH /tasks/{id}/toggle)
   */
  async toggleTask(taskId: number): Promise<{ task: Task; isLiveBackend: boolean }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${BASE_URL}/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('Failed to toggle task');
      const data: Task = await res.json();
      return { task: data, isLiveBackend: true };
    } catch {
      const tasks = getStoredTasks();
      const target = tasks.find((t) => t.id === taskId);
      if (!target) throw new Error('Task not found');
      target.is_completed = !target.is_completed;
      saveStoredTasks(tasks);
      return { task: target, isLiveBackend: false };
    }
  },

  /**
   * Update task fields (matches PATCH /tasks/{id})
   */
  async updateTask(taskId: number, updates: TaskUpdateInput): Promise<{ task: Task; isLiveBackend: boolean }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.detail || 'Failed to update task');
      }
      const data: Task = await res.json();
      return { task: data, isLiveBackend: true };
    } catch {
      const tasks = getStoredTasks();
      const index = tasks.findIndex((t) => t.id === taskId);
      if (index === -1) throw new Error('Task not found');
      const updated: Task = {
        ...tasks[index],
        ...updates,
      };
      tasks[index] = updated;
      saveStoredTasks(tasks);
      return { task: updated, isLiveBackend: false };
    }
  },

  /**
   * Delete a task (matches DELETE /tasks/{id})
   */
  async deleteTask(taskId: number): Promise<{ success: boolean; isLiveBackend: boolean }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok && res.status !== 204) throw new Error('Failed to delete task');
      return { success: true, isLiveBackend: true };
    } catch {
      const tasks = getStoredTasks().filter((t) => t.id !== taskId);
      saveStoredTasks(tasks);
      return { success: true, isLiveBackend: false };
    }
  },

  /**
   * Reset local storage to initial demo state
   */
  resetLocalDemo(): Task[] {
    saveStoredTasks(INITIAL_DEMO_TASKS);
    return INITIAL_DEMO_TASKS;
  },
};
