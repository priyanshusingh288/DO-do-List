from fastapi import FastAPI,APIRouter,HTTPException,Depends,Response,status,Query
from typing import Optional,List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import models,schemas
from database import get_db
from schemas import TaskCreate, TaskResponse, TaskUpdate

Router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

@Router.post("/",response_model=TaskResponse,status_code=status.HTTP_201_CREATED)
async def Create_tasks(task_in : TaskCreate , db:AsyncSession = Depends(get_db)):
    new_task = models.Task(**task_in.model_dump())
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)

    return new_task

@Router.get("/",response_model=List[TaskResponse])
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

@Router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
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

@Router.patch("/{task_id}/toggle",response_model=schemas.TaskResponse)
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

@Router.patch("/{task_id}", response_model=schemas.TaskResponse)
async def update_task(
    task_id: int, 
    task_update: schemas.TaskUpdate, 
    db: AsyncSession = Depends(get_db)
):
    stmt = select(models.Task).where(models.Task.id == task_id)
    result = await db.execute(stmt)
    task = result.scalars().first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Task not found"
        )

    update_data = task_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(task, key, value)

    await db.commit()
    await db.refresh(task)
    return task