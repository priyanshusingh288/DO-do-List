from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

import models
from database import get_db
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
                          