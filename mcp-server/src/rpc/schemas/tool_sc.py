from pydantic import BaseModel
from typing import Callable, Any


class ToolModule(BaseModel):
    schema: dict[str, str]
    tool: Callable[[Any], Any]