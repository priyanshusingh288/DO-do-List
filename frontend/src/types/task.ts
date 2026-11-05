/**
 * DO-do List Task Schema
 * Directly mapped to FastAPI Pydantic schema in backend/schemas.py
 */

export interface Task {
  id: number;
  title: string;
  note?: string | null;
  start_time?: string | null; // ISO datetime string, e.g. "2026-11-04T09:00:00"
  end_time?: string | null;   // ISO datetime string, e.g. "2026-11-04T09:30:00"
  remind?: string | null;     // ISO datetime string, e.g. "2026-11-04T08:45:00"
  is_completed: boolean;
  created_at: string;         // ISO datetime string
}

export interface TaskCreateInput {
  title: string;
  note?: string | null;
  start_time: string; // ISO datetime string
  end_time: string;   // ISO datetime string
  remind?: string | null; // ISO datetime string
}

export interface TaskUpdateInput {
  title?: string;
  note?: string | null;
  start_time?: string;
  end_time?: string;
  remind?: string | null;
}

export type TabType = 'today' | 'calendar' | 'add' | 'reminders';

export type TaskFilter = 'all' | 'pending' | 'completed' | 'reminders';
