from fastapi import APIRouter, Body, status
from fastapi.responses import JSONResponse
from src.schema.users_sc import UserCreate, UserLogin
import src.models.user_db as user_db

router = APIRouter()


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