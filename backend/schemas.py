from pydantic import BaseModel,model_validator,ConfigDict,EmailStr
from datetime import datetime
from typing import Optional

class TaskCreate(BaseModel):
    title:str
    note:str | None = None
    start_time:datetime
    end_time:datetime
    remind:datetime | None = None

    @model_validator(mode="after")
    def validate_schedule(self):
        if self.end_time <= self.start_time:
            raise ValueError("end time stricly should be after start time")
        if self.remind and self.remind > self.start_time:
            raise ValueError("remind time cannot be set after start_time")
        return self

class TaskResponse(TaskCreate):
    id:int
    is_completed:bool
    created_at:datetime

    model_config = ConfigDict(from_attributes=True)

class TaskUpdate(BaseModel):
    title:str | None = None
    note:str | None = None
    start_time:datetime | None = None
    end_time:datetime | None = None
    remind:datetime |None = None

class Usercreate(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id:int
    email:EmailStr
    is_active:bool

    class config:
        from_attributes :True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None