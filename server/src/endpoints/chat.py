from typing import Annotated
from fastapi import APIRouter, Body, Depends, status
from fastapi.responses import JSONResponse
from src.endpoints.token import get_current_user
from src.schema.users_sc import UserBase

router = APIRouter()

@router.post("/completion")
async def chat(current_user: Annotated[UserBase, Depends(get_current_user)], prompt: str = Body(...)):
    print("User:", current_user)
    return JSONResponse(status_code=status.HTTP_200_OK, content={
        "message": "Chat response",
        "response": f"Chatbot response to: {prompt}"
    })