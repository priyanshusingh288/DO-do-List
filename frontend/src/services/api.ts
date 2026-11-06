import type { Task, TaskCreateInput, TaskUpdateInput } from '../types/task';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


export const taskApi = {

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
    }catch (error) {
    console.error("Task update failed:", error);
    throw error;
  }
},

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
    } catch (error) {
    console.error("Task update failed:", error);
    throw error;
  }
},

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
    }catch (error) {
    console.error("Task update failed:", error);
    throw error;
  }
},

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
    }catch (error) {
    console.error("Task update failed:", error);
    throw error;
  }
},

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
    } catch (error) {
    console.error("Task update failed:", error);
    throw error;
  }
},

};