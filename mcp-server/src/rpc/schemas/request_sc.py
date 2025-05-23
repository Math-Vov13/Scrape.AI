from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class RPCRequest(BaseModel):
    """Structure d'une requête MCP"""
    jsonrpc: str = "2.0"
    id: Optional[str] = None
    method: str = ""
    params: Dict[str, Any] = None


class RPCResponse(BaseModel):
    """Structure d'une réponse MCP"""
    jsonrpc: str = "2.0"
    id: Optional[str] = None
    result: Optional[Any] = None
    error: Optional[Dict[str, Any]] = None