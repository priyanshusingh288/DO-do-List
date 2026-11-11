from datetime import datetime
from sqlalchemy import Integer, String, Text, Boolean, DateTime, func,ForeignKey,Column,DATETIME
from sqlalchemy.orm import Mapped, mapped_column,relationship
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    remind: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

class users(Base):
      __tablename__ = "users"

      id = Column(Integer,Primary_key = True, index = True)
      email = Column(String,primary_key = True,unique = True,nullable=False)
      hashed_password = Column(String, nullable = False)
      is_active = Column(Boolean,nullable = True)

      Task = relationship("Task",back_populates="owner",cascade="all, delete-orphan")