from pydantic import BaseModel
from enum import StrEnum
from typing import Optional, List, Any

class MistralModel(StrEnum):
    """
    Enum representing the available Mistral models.
    """
    MISTRAL_SMALL_LATEST = "mistral-small-latest"
    MISTRAL_LARGE_LATEST = "mistral-large-latest"

class MistralMessageRole(StrEnum):
    """
    Enum representing the roles of messages in a Mistral conversation.
    """
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class MistralMessage(BaseModel):
    """
    Represents a message in a Mistral conversation.
    """
    role: MistralMessageRole
    content: str

class MistralRequest(BaseModel):
    """
    Represents a request to the Mistral API.
    """
    model: MistralModel
    messages: List[MistralMessage]
    temperature: float = 0.7
    top_p: float = 1.0
    max_tokens: int = 1024
    stop: List[str] = None

class MistralResponse(BaseModel):
    """
    Represents a response from the Mistral API.
    """
    id: str
    object: str
    created: int
    model: MistralModel
    choices: List[dict]
    usage: dict

class MistralStreamResponse(BaseModel):
    """
    Represents a streamed response from the Mistral API.
    """
    id: str
    object: str
    created: int
    model: MistralModel
    choices: List[dict]
    usage: dict
    delta: MistralMessage
    finish_reason: str = None

class MistralToolResponse(BaseModel):
    role: str= "tool"
    name: str
    content: Any
    tool_call_id: str



class MistralToolFunction(BaseModel):
    """
    Represents a function that can be called by the Mistral API.
    """
    name: str
    description: str = ""
    strict: bool = False
    parameters: dict = {}

class MistralTool(BaseModel):
    """
    Represents a tool that can be used by the Mistral API.
    """
    type: str = "function"
    function: MistralToolFunction

class MistralRequestAPI(BaseModel):
    """
    Represents a request to the Mistral API for streaming responses.
    """
    model: MistralModel
    temperature: float= .7
    top_p: int= 1
    max_tokens: int= 0
    stream: bool= False
    messages: List[MistralMessage]

    tools: List[MistralTool | dict[str, str]] = []
    tool_choice: str= "auto"
    # parallel_tool_calls: bool= True