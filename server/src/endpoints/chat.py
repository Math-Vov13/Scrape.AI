from typing import Annotated
import json, time
from fastapi import APIRouter, Body, Depends, status
from fastapi.responses import JSONResponse, StreamingResponse
from src.endpoints.token import get_current_user
from src.schema.users_sc import UserBase
from src.utils.chat_openai import sendChat, createSystemPrompt
from src.schema.openai_sc import *

router = APIRouter()

@router.post("/completion")
async def chat(current_user: Annotated[UserBase, Depends(get_current_user)], prompt: OpenAIRequest = Body(...)):
    
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
        prompt.messages.insert(0, OpenAIUserMessage(
            role="system",
            content= createSystemPrompt(current_user.username, model=prompt.model)
        ))
    
    async def event_generator():
        try:
            async for chunk in sendChat(prompt.messages, model=prompt.model, temperature=prompt.temperature, max_tokens=prompt.max_tokens):
                if "[TOOL_CALL]" in chunk:
                    chunk = chunk.replace("[TOOL_CALL] ", "")
                    id = chunk.split("id: ", 1)[1].split(",", 1)[0]
                    name = chunk.split("name: ", 1)[1].split(",", 1)[0]
                    params = chunk.split("parameters:", 1)[1].split("\n", 1)[0]
                    print("tool name streaming:", name, flush=True)
                    print("tool params streaming:", params, flush=True)
                    yield f"tool: {json.dumps({"id": id[5:], "name": name, "params": params.strip(), "timestamp": time.time()})}<||CHUNK||>"
                    continue
                yield f"data: {chunk}<||CHUNK||>"
        except Exception as e:
            print("Erreur:", e)
            yield f"error: {str(e)}<||CHUNK||>"
        finally:
            yield "[DONE]<||CHUNK||>"


    return StreamingResponse(
        status_code=status.HTTP_200_OK,
        content= event_generator(),
        media_type="text/event-stream"
    )