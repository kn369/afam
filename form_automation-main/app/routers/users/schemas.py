from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


# REQUEST
class StudentCreate(BaseModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    id: str
    name: str
    school: str
    dept: Optional[str] = None
    email: str
    role: List[str] = ["user"]
    password_hash: str
    student_batch: str
    student_course: str
    student_phone: str


class AdminCreate(BaseModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    id: str
    name: str
    school: str
    dept: Optional[str] = None
    email: str
    role: List[str] = ["admin"]
    password_hash: str
    admin_position: str
    admin_cabin_id: str



# RESPONSE
class CompleteStudentDetails(BaseModel):
    created_at: datetime
    id: str
    name: str
    school: str
    dept: Optional[str] = None
    email: str
    role: List[str] = ["user"]
    student_batch: str
    student_course: str
    student_phone: str

    class Config:
        from_attributes = True


class CompleteAdminDetails(BaseModel):
    created_at: datetime
    id: str
    name: str
    school: str
    dept: Optional[str] = None
    email: str
    role: List[str] = ["admin"]
    admin_position: str
    admin_cabin_id: str

    class Config:
        from_attributes = True