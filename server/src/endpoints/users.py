from typing import Annotated
from fastapi import APIRouter, Body, status, Depends
from fastapi.responses import JSONResponse
from src.endpoints.token import get_current_user
from src.schema.users_sc import UserBase, UserCreate, UserLogin
import src.models.user_db as user_db

router = APIRouter()

@router.get("/")
async def get_users():
    
    users = await user_db.getAllUsers()
    if not users:
        return JSONResponse(status_code= status.HTTP_404_NOT_FOUND, content={
            "message": "No users found!",
        })
    
    return JSONResponse(status_code= status.HTTP_200_OK, headers={"Cache-Control": "no-store"}, content={
        "message": "Users retrieved successfully!",
        "users": [ i.model_dump(mode="json") for i in users ]
    })


@router.delete("/{user_id}")
async def delete_user(user_id: str, current_user: Annotated[UserBase, Depends(get_current_user)]):
    if not current_user.admin:
        return JSONResponse(status_code= status.HTTP_403_FORBIDDEN, content={
            "message": "You do not have permission to delete users!",
        })
    
    deleted = await user_db.deleteUser(user_id)
    if not deleted:
        return JSONResponse(status_code= status.HTTP_404_NOT_FOUND, content={
            "message": "User not found!",
        })
    
    return JSONResponse(status_code= status.HTTP_200_OK, content={
        "message": "User deleted successfully!",
    })


@router.post("/register")
async def register(body: UserCreate = Body(...)):
    data = await user_db.createUser(body)
    if not data:
        return JSONResponse(status_code= status.HTTP_409_CONFLICT, content={
            "message": "User already exists!",
        })
    
    return JSONResponse(status_code= status.HTTP_201_CREATED, content={
        "message": "A new user has been created!",
        "user": {
            "id": data,
            "username": body.username,
            "full_name": body.full_name,
            "email": body.email,
        }
    })


@router.post("/login")
async def login(body: UserLogin = Body(...)):
    user = await user_db.getUser(body.email, body.password)
    if not user:
        return JSONResponse(status_code= status.HTTP_404_NOT_FOUND, content={
            "message": "User does not exists!",
        })

    return JSONResponse(status_code= status.HTTP_200_OK, content={
        "message": "You logged in successfully!",
        "user": {
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "email": user.email,
            "admin": user.admin,
        }
    })