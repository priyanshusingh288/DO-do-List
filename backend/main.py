from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional,List
from datetime import datetime
import schemas,models

import models
from database import engine, Base, get_db
from schemas import TaskCreate, TaskResponse

app = FastAPI()

@app.get("/")
def root():
    return {"server":"live"}

@app.post("/tasks",response_model=TaskResponse,status_code=status.HTTP_201_CREATED)
async def Create_tasks(task_in : TaskCreate , db:AsyncSession = Depends(get_db)):
    new_task = models.Task(**task_in.model_dump())
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)

    return new_task

@app.get("/tasks",response_model=List[TaskResponse])
async def get_tasks(
    start_date : Optional[datetime] = Query(None ,description="start of calender splice"),
    end_date : Optional[datetime] = Query(None, description="end of calender splice"),
    db : AsyncSession = Depends(get_db)
):
    stmt = select(models.Task)

    if start_date:
        stmt = stmt.where(models.Task.start_time >= start_date)
    if end_date:
        stmt = stmt.where(models.Task.start_time <= end_date)

    stmt = stmt.order_by(models.Task.start_time.asc())

    result = await db.execute(stmt)
    tasks =  result.scalars().all()
    return tasks        

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(models.Task).where(models.Task.id == task_id)
    result = await db.execute(stmt)
    task = result.scalars().first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Task not found"
        )

    await db.delete(task)
    await db.commit()
    return None

@app.patch("/tasks/{task_id}/toggle",response_model=schemas.TaskResponse)
async def toggle_tasks(task_id:int,db: AsyncSession = Depends(get_db)):
    stmt = select(models.Task).where(models.Task.id == task_id)
    result = await db.execute(stmt)
    toggle_task = result.scalars().first()

    if not toggle_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail = f"current task with {id} cant be founf out")

    toggle_task.is_completed = not toggle_task.is_completed
    
    await db.commit()
    await db.refresh(toggle_task)
    return toggle_task