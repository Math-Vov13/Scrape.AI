from pydantic import BaseModel
from enum import StrEnum
from typing import Optional, List, Any

############## API Enums #############
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


############## API REQUESTS #############

class MistralToolFunctionRequest(BaseModel):
    """
    Represents a function that can be called by the Mistral API.
    """
    name: str
    arguments: str | dict[str, Any]

class MistralToolCallRequest(BaseModel):
    """
    Represents a tool call in a Mistral conversation.
    """
    {'tool_calls': [{'id': 'GJbuwCdaF', 'function': {'name': 'getEnterpriseData', 'arguments': '{"enterprise_name": "My Enterprise", "enterprise_description": "This is a sample enterprise description."}'}, 'index': 0}]}

    id: str
    function: MistralToolFunctionRequest
    index: int  # Index of the tool call in the message, if applicable

# class MistralToolRequest(BaseModel):
#     tool_calls: List[MistralToolCallRequest] = []

class MistralUserMessage(BaseModel):
    """
    Represents a message in a Mistral conversation.
    """
    role: MistralMessageRole = "user"
    content: str | dict[str, str] = ""

class MistralAssistantMessage(BaseModel):
    """
    Represents a message from the assistant in a Mistral conversation.
    """
    role: MistralMessageRole = "assistant"
    content: str | dict[str, str] = ""
    tool_calls: Optional[List[MistralToolCallRequest]] = None


class MistralRequest(BaseModel):
    """
    Represents a request to the Mistral API.
    """
    model: MistralModel
    messages: List[MistralUserMessage | MistralAssistantMessage]
    temperature: float = 0.2
    top_p: float = 1.0
    max_tokens: int = 1024
    stop: List[str] = None


############# RESPONSES #############

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


class MistralToolMessage(BaseModel):
    role: str= "tool"
    name: str
    content: Any
    tool_call_id: str


################# REAL API REQUESTS #############

class MistralToolFunctionSchema(BaseModel):
    """
    Represents a function that can be called by the Mistral API.
    """
    name: str
    description: str = ""
    strict: bool = False
    parameters: dict = {}


class MistralToolSchema(BaseModel):
    """
    Represents a tool that can be used by the Mistral API.
    """
    type: str = "function"
    function: MistralToolFunctionSchema


class MistralRequestAPI(BaseModel):
    """
    Represents a request to the Mistral API for streaming responses.
    """
    model: MistralModel
    temperature: float= 0.2
    top_p: int= 1
    max_tokens: int= 0
    stream: bool= False
    messages: List[MistralUserMessage | MistralAssistantMessage | MistralToolMessage] = []

    tools: List[MistralToolSchema | dict[str, str]] = []
    tool_choice: str= "auto"
    parallel_tool_calls: bool= True