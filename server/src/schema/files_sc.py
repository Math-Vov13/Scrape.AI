from typing import Any, Dict, Optional
from pydantic import BaseModel
from datetime import datetime

class FileSchema(BaseModel):
    """
    Schema for file metadata.
    """
    name: str
    size: int
    type: str
    #content: bytes = None  # Optional binary content of the file
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        orm_mode = True  # Allows compatibility with ORM models
        anystr_strip_whitespace = True  # Strips whitespace from string fields
        use_enum_values = True  # Use enum values instead of enum instances

class FileDB(BaseModel):
    """
    Database model for file metadata.
    """
    id: Optional[str] = None  # Optional ID for the file, can be used for database references
    name: str
    size: int
    type: str
    #content: bytes = None  # Optional binary content of the file
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        orm_mode = True  # Allows compatibility with ORM models
        anystr_strip_whitespace = True  # Strips whitespace from string fields
        use_enum_values = True  # Use enum values instead of enum instances