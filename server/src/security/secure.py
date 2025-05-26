from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
import jwt
from jwt import PyJWTError

from src.schema.users_sc import JWTTokenUser

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return password_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: int = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes= expires_delta or 15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str) -> JWTTokenUser:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return JWTTokenUser(
            email= payload.get("sub"),
            scopes= payload.get("scopes"),
        )
        
    except PyJWTError:
        print("JWTError with Token decoding:", str(PyJWTError))
        return None
    
    except Exception as e:
        print("Exception with Token decoding:", str(e))
        return None