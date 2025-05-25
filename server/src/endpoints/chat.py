from typing import Annotated
from fastapi import APIRouter, Body, Depends, status
from fastapi.responses import JSONResponse, StreamingResponse
from src.endpoints.token import get_current_user
from src.schema.users_sc import UserBase
from src.utils.chat_mistral import sendChat, createSystemPrompt
from src.schema.mistral_sc import MistralMessage, MistralRequest, MistralResponse, MistralStreamResponse

router = APIRouter()

@router.post("/completion")
async def chat(current_user: Annotated[UserBase, Depends(get_current_user)], prompt: MistralRequest = Body(...)):

    print("Welcome user:", current_user.username)
    
    if prompt.temperature < 0 or prompt.temperature > 1:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Temperature must be between 0 and 1."}
        )
    
    if prompt.max_tokens <= 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Max tokens must be a positive integer."}
        )
    
    if prompt.messages is None or len(prompt.messages) == 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Messages cannot be empty."}
        )
    
    if prompt.messages[0].role != "system":
        prompt.messages.insert(0, MistralMessage(
            role="system",
            content= createSystemPrompt(current_user.username, model=prompt.model)
        ))

    return StreamingResponse(
        status_code=status.HTTP_200_OK,
        content= sendChat(prompt.messages, model=prompt.model, temperature=prompt.temperature, max_tokens=prompt.max_tokens),
        media_type="text/event-stream"
    )