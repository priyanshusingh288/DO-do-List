# DO-do List - Frontend

A bespoke, production-ready React + Tailwind CSS single-page interface for the **DO-do List** mindful task tracker, designed with a calm forest green and warm cream aesthetic and directly mapped to the FastAPI backend schema.

## 🌿 Aesthetic & Design System

- **Theme**: Calm forest/sage green and soft warm cream palette.
- **Background**: Soft cream/mint (`#F3F5EE`).
- **Primary Forest Green**: `#1E5338` (Hero card banner, CTA buttons, active tabs, checkbox badges).
- **Card Surface**: Crisp off-white/cream (`#FFFFFF` or `#FAF9F4`) with subtle borders (`#E2EAE4`) and soft shadows.
- **Text**: Deep forest-tinted charcoal (`#15241B`) for primary text; muted sage gray (`#8A9A8F`) for subtext and time intervals.
- **Mascot / Hero Illustration**: Bespoke SVG vector illustration of a cute dodo bird holding a checklist clipboard with a pencil, embedded in the main top banner.

## 📱 Layout & Screen Composition

- **Centered Mobile/Tablet Viewport**: Optimized as a centered, high-end responsive container on desktop and full width on mobile devices.
- **Top Navigation**: Logo `"DO-do List"` with minimalist clock/task icon, live backend status indicator (`FastAPI Live` / `Local Mode`), and quick refresh.
- **Hero Banner**: Rounded `#1E5338` forest green container with `"Today"`, dynamic `"X tasks left"` counter, animated progress meter, and the animated cute dodo mascot.
- **Action Tiles**: 2-column tactile grid with `"+ Add task"` (soft green gradient) and `"Calendar"` (live date preview and weekday tag).
- **Task List Section**:
  - `"Today"` title with task count badge and expandable `"See all"` filter tabs (`All Tasks`, `Pending`, `Completed`, `Reminders`).
  - Task cards with exact **12px vertical gap** (`gap-3`).
  - Custom rounded checkbox with green check badge, smooth scale animation, and strikethrough/dimmed title text.
  - Start-to-end time badge (e.g. `09:00 - 09:30`) and optional note preview.
  - Subtle reminder bell indicator with alert time badge and quick action options menu (edit details, delete with confirmation).
- **Floating Bottom Tab Bar**: Pill-shaped dark green container with `"Today"` (active state), `"Calendar"`, central elevated `"+"` quick-add action, and `"Reminders"` with badge count.
- **Modals & Drawers**:
  - `TaskModal`: Full add & edit dialog with real-time schedule validation strictly enforcing backend rules (`end_time > start_time` and `remind <= start_time`), duration presets (`+30m`, `+45m`, `+1h`, `+2h`), and reminder offset helpers.
  - `CalendarModal`: Interactive month view with day selector, daily schedule view, and quick task creation for any date.
  - `RemindersModal`: Dedicated overview for all scheduled alerts and notifications.

## ⚡ FastAPI Schema Integration

Mapped directly to the backend Pydantic model:

```typescript
interface Task {
  id: number;
  title: string;
  note?: string | null;
  start_time?: string | null; // ISO datetime string
  end_time?: string | null;   // ISO datetime string
  remind?: string | null;     // ISO datetime string
  is_completed: boolean;
  created_at: string;
}
```

### Endpoints Covered:
- `GET /tasks`: Loads scheduled tasks with optional date filtering.
- `POST /tasks`: Creates a task with strict start/end/reminder validation.
- `PATCH /tasks/{id}/toggle`: Toggles task completion with optimistic UI updates.
- `PATCH /tasks/{id}`: Updates task title, notes, or schedule.
- `DELETE /tasks/{id}`: Deletes a task.

> **Offline & Local Storage Fallback**: When the FastAPI server is offline, the app seamlessly runs on Local Storage with preloaded sample tasks and live sync capability.

## 🚀 Running the App

### Start Frontend Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```
