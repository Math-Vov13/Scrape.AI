from pydantic import BaseModel
from enum import StrEnum
from typing import Optional, List, Any

############## API Enums #############
class OpenAIModel(StrEnum):
    """
    Enum representing the available OpenAI models.
    """
    OpenAI_BASIC_NANO = "gpt-4.1-nano"
    OpenAI_BASIC_MINI = "gpt-4.1-mini"
    OpenAI_LARGE = "gpt-4.1-2025-04-14"
    OpenAI_LARGE_2024 = "gpt-4.1-2024-10-01"

class OpenAIMessageRole(StrEnum):
    """
    Enum representing the roles of messages in a OpenAI conversation.
    """
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    TOOL = "tool"


############## API REQUESTS #############

class OpenAIToolFunctionRequest(BaseModel):
    """
    Represents a function that can be called by the OpenAI API.
    """
    name: str
    arguments: str | dict[str, Any]

class OpenAIToolCallRequest(BaseModel):
    """
    Represents a tool call in a OpenAI conversation.
    """
    id: str
    type: str = "function"  # Type of the tool call, typically "function"
    function: OpenAIToolFunctionRequest
    index: int  # Index of the tool call in the message, if applicable

# class OpenAIToolRequest(BaseModel):
#     tool_calls: List[OpenAIToolCallRequest] = []

class OpenAIUserMessage(BaseModel):
    """
    Represents a message in a OpenAI conversation.
    """
    role: OpenAIMessageRole = "user"
    content: str | dict[str, str] = ""

class OpenAIAssistantMessage(BaseModel):
    """
    Represents a message from the assistant in a OpenAI conversation.
    """
    role: OpenAIMessageRole = "assistant"
    content: str | dict[str, str] = ""
    tool_calls: Optional[List[OpenAIToolCallRequest]] = None


class OpenAIRequest(BaseModel):
    """
    Represents a request to the OpenAI API.
    """
    model: OpenAIModel
    messages: List[OpenAIUserMessage | OpenAIAssistantMessage]
    temperature: float = 0.2
    top_p: float = 1.0
    max_tokens: int = 1024
    stop: List[str] = None


############# RESPONSES #############

class OpenAIResponse(BaseModel):
    """
    Represents a response from the OpenAI API.
    """
    id: str
    object: str
    created: int
    model: OpenAIModel
    choices: List[dict]
    usage: dict


class OpenAIToolMessage(BaseModel):
    role: str= "tool"
    name: str
    content: Any
    tool_call_id: str


################# REAL API REQUESTS #############

class OpenAIToolFunctionSchema(BaseModel):
    """
    Represents a function that can be called by the OpenAI API.
    """
    name: str
    description: str = ""
    strict: bool = False
    parameters: dict = {}


class OpenAIToolSchema(BaseModel):
    """
    Represents a tool that can be used by the OpenAI API.
    """
    type: str = "function"
    function: OpenAIToolFunctionSchema


class OpenAIRequestAPI(BaseModel):
    """
    Represents a request to the OpenAI API for streaming responses.
    """
    model: OpenAIModel
    temperature: float= 0.2
    top_p: int= 1
    max_tokens: int= 0
    stream: bool= False
    messages: List[OpenAIUserMessage | OpenAIAssistantMessage | OpenAIToolMessage] = []

    tools: List[OpenAIToolSchema | dict[str, str]] = []
    tool_choice: str= "auto"
    parallel_tool_calls: bool= True