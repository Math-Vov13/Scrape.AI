from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class CompanyBase(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    industry: Optional[str] = None
    employeeCount: Optional[int] = None
    foundedYear: Optional[int] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    services: Optional[list[str]] = None
    departments: Optional[list[str]] = None
    created_at: Optional[datetime] = None