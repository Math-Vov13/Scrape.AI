from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    email: str
    password: str
    full_name: str | None = None
    authorization: str | None = None
    disabled: bool | None = None

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: str | None = None

class UserLogin(BaseModel):
    email: str
    password: str