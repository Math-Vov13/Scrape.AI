import logging
from fastapi import FastAPI
from src.endpoints.users import router as users_router
from src.endpoints.chat import router as chat_router
from src.endpoints.admin import router as admin_router
from src.endpoints.token import router as token_router
from src.models.db_connect import connector
from src.config.logs import setup_logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from os import getenv

load_dotenv()

setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting MongoDB connection...")
    connector._init_connection(
        uri="mongodb://mongodb:27017/",
        db_name=getenv("MONGO_ACCOUNTS_DATABASE")
    )
    # connector = MongoDBSingleton(uri=None, db_name=getenv("MONGO_ACCOUNTS_DATABASE"))

    ping = await connector.client.admin.command('ping')
    if ping.get("ok") == 1:
        print("MongoDB connection is alive")
    else:
        print("MongoDB connection failed")
        raise Exception("MongoDB connection failed")
    
    yield

    logger.info("Closing MongoDB connection...")
    await connector.close_connection()
    logger.info("MongoDB connection closed")

app = FastAPI(lifespan= lifespan)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "ok"}

app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(admin_router, prefix="/admin", tags=["admin"])
app.include_router(token_router, prefix="/token", tags=["token"], include_in_schema=True)