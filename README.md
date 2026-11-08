# 🦤 DO-do List

**Plan. Organise. DO.**

A calm, minimal to-do app with a FastAPI backend and a React frontend. Named after the dodo bird, because getting things done beats going extinct.

## Features

- Add tasks with a title, note, start/end time and an optional reminder
- Mark tasks complete with a tap
- Filter tasks by date range
- Delete tasks you no longer need
- Forest-green, cream-toned UI with a dodo mascot

## Tech Stack

| Layer    | Tools                                      |
| -------- | ------------------------------------------ |
| Frontend | Vite, React, TypeScript, GSAP              |
| Backend  | FastAPI, async SQLAlchemy                  |

## Task Model

| Field          | Description                          |
| -------------- | ------------------------------------ |
| `title`        | Task name                            |
| `note`         | Optional details                     |
| `start_time`   | When the task starts                 |
| `end_time`     | When the task ends                   |
| `remind`       | When to send a reminder              |
| `is_completed` | Whether it's done                    |

Validation: `end_time` must be after `start_time`, and `remind` must be at or before `start_time`.

## API

| Method   | Endpoint              | Purpose                          |
| -------- | --------------------- | -------------------------------- |
| `POST`   | `/tasks`              | Create a task                    |
| `GET`    | `/tasks`              | List tasks (supports date range) |
| `PATCH`  | `/tasks/{id}/toggle`  | Toggle completion                |
| `DELETE` | `/tasks/{id}`         | Delete a task                    |

## Getting Started

**Backend**

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the API at `http://localhost:8000` by default.

## Roadmap

- [x] Core CRUD backend
- [x] Today screen (hero, task cards, add task)
- [ ] User login
- [ ] Calendar view
- [ ] Tasks for specific dates
- [ ] Deployment

## Author

Built by [Priyanshu](https://github.com/priyanshusingh288).