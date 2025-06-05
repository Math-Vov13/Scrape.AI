from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    id: Optional[str] = None
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    admin: Optional[bool] = False
    authorization: Optional[str] = None
    disabled: Optional[bool] = False
    created_at: Optional[datetime] = None

class UserCreate(BaseModel):
    username: str
    admin: Optional[bool] = False
    email: EmailStr
    password: str
    full_name: str
    created_at: Optional[datetime] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class JWTTokenUser(BaseModel):
    email: str
    scopes: list[str]