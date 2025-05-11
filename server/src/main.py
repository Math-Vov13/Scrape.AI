from fastapi import FastAPI
from src.endpoints.users import router as users_router

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "ok"}

app.include_router(users_router, prefix="/users", tags=["users"])