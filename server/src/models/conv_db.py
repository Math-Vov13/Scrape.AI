from src.models.db_connect import connector
from dotenv import load_dotenv
from os import getenv

from src.schema.users_sc import UserBase

load_dotenv()

# async def createConv(data: UserCreate) -> str | None:
#     db = connector.get_db(getenv("MONGO_CONVS_DATABASE"))
#     user_data = {
#         "username": data.username,
#         "password": hash_password(data.password),
#         "email": data.email,
#         "full_name": data.full_name,
#         "disabled": False,
#     }

#     result = await db["accounts"].insert_one(user_data)
#     return str(result.inserted_id)

# async def getConvById(conv_id: str) -> UserBase | None:
#     db = connector.get_db(getenv("MONGO_CONVS_DATABASE"))
#     conv_doc = await db["conversations"].find_one({"_id": conv_id})
    
#     if conv_doc:
#         return UserBase(**conv_doc, id=str(conv_doc["_id"]))
    
#     return None

# async def getConvsByUserId(user_id: str) -> list[UserBase]:
#     db = connector.get_db(getenv("MONGO_CONVS_DATABASE"))
#     convs_cursor = db["conversations"].find({"user_id": user_id})
    
#     convs = []
#     async for conv_doc in convs_cursor:
#         convs.append(UserBase(**conv_doc, id=str(conv_doc["_id"])))
    
#     return convs

# async def updateConv(conv_id: str, data: UserBase) -> bool:
#     db = connector.get_db(getenv("MONGO_CONVS_DATABASE"))
#     result = await db["conversations"].update_one({"_id": conv_id}, {"$set": data.model_dump()})
    
#     return result.modified_count > 0