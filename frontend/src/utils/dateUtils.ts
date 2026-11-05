/**
 * Utility functions for date & time formatting in DO-do List
 */

export function formatTimeRange(startTime?: string | null, endTime?: string | null): string {
  if (!startTime) return 'No time set';
  
  try {
    const start = new Date(startTime);
    const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    if (!endTime) return startStr;
    
    const end = new Date(endTime);
    const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    return `${startStr} - ${endStr}`;
  } catch {
    return 'Invalid time';
  }
}

export function formatReminderTime(remindTime?: string | null): string | null {
  if (!remindTime) return null;
  try {
    const date = new Date(remindTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return null;
  }
}

export function formatHumanDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const today = new Date();
  
  if (isSameDay(date, today)) {
    return 'Today';
  }
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(date, tomorrow)) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function toInputDateTimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function parseLocalInputToIso(val: string): string {
  if (!val) return '';
  const date = new Date(val);
  return date.toISOString();
}

export function validateSchedule(
  startTimeStr: string,
  endTimeStr: string,
  remindStr?: string | null
): { valid: boolean; error?: string } {
  if (!startTimeStr) {
    return { valid: false, error: 'Start time is required.' };
  }
  if (!endTimeStr) {
    return { valid: false, error: 'End time is required.' };
  }

  const start = new Date(startTimeStr).getTime();
  const end = new Date(endTimeStr).getTime();

  if (isNaN(start) || isNaN(end)) {
    return { valid: false, error: 'Please enter valid date and time values.' };
  }

  if (end <= start) {
    return { valid: false, error: 'End time strictly should be after start time' };
  }

  if (remindStr) {
    const remind = new Date(remindStr).getTime();
    if (!isNaN(remind) && remind > start) {
      return { valid: false, error: 'Remind time cannot be set after start_time' };
    }
  }

  return { valid: true };
}
