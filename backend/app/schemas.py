from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    user_name: str
    user_email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_on: datetime
    last_update: datetime

    class Config:
        from_attributes = True

class NoteBase(BaseModel):
    note_title: str
    note_content: str

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: str
    user_id: str
    created_on: datetime
    last_update: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[str] = None
