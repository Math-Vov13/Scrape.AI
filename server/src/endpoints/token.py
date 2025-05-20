from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status

from src.models.user_db import getUser, getUserByEmail
from src.security.secure import create_access_token, verify_access_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    token_decoded = verify_access_token(token)
    if not token_decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await getUserByEmail(token_decoded.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@router.post("")
async def create_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """
    Login endpoint to authenticate users and return a token.
    """    
    user = await getUser(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({
        "sub": form_data.username,
        "scopes": form_data.scopes,
    }, expires_delta=3600)
    return {"access_token": token, "token_type": "bearer"}