from typing import Any, Dict, Optional
from pydantic import BaseModel

class MCPRequest(BaseModel):
    """Structure d'une requête MCP"""
    jsonrpc: str = "2.0"
    id: Optional[str] = None
    method: str = ""
    params: Dict[str, Any] = None