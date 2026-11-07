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
from fastapi.middleware.cors import CORSMiddleware
from routers import tasks


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.Router)



@app.get("/")
def root():
    return {"server":"live"}