from datetime import datetime
import random
from src.schema.users_sc import UserBase, UserCreate
from src.security.secure import hash_password, verify_password
from src.models.db_connect import connector
from dotenv import load_dotenv
from os import getenv

load_dotenv()

# def generateID()-> str:
#     return random.randbytes(32).hex()

# fake_db = {
#     generateID() : UserBase(
#         username= "Admin",
#         password= "$2b$12$FRRwuN1mOqEU3yW0y23m1.7asJU7NdglFatuPr2QSI4InSsQ3SO3C", # password: Password_Admin
#         email= "admin@scrape.ai",
#         full_name= "Admin",
#         disabled= False
#     )
# }


async def getUser(email: str, password: str) -> UserBase | None:
    db = connector.get_db(getenv("MONGO_INITDB_DATABASE"))
    user_doc = await db["accounts"].find_one({"email": email})
    
    if user_doc and verify_password(password, user_doc["password"]):
        return UserBase(**user_doc, id=str(user_doc["_id"]))
    
    return None

    # for user in fake_db.values():
    #     if user.email == email and verify_password(password, user.password):
    #         return user
    # return None

async def getUserByEmail(email: str) -> UserBase | None:
    db = connector.get_db(getenv("MONGO_INITDB_DATABASE"))
    user_doc = await db["accounts"].find_one({"email": email})
    
    if user_doc:
        return UserBase(**user_doc, id=str(user_doc["_id"]))
    
    return None

    # for user in fake_db.values():
    #     if user.email == email:
    #         return user
    # return None


async def createUser(data: UserCreate) -> str | None:
    db = connector.get_db(getenv("MONGO_INITDB_DATABASE"))

    # Vérifie si un utilisateur existe déjà
    existing_user = await db["accounts"].find_one({"email": data.email})
    if existing_user:
        return None  # déjà existant

    user_data = {
        "username": data.username,
        "password": hash_password(data.password),
        "email": data.email,
        "full_name": data.full_name,
        "disabled": False,
        "admin": data.admin or False,
        "created_at": data.created_at or datetime.utcnow(),
    }

    result = await db["accounts"].insert_one(user_data)
    return str(result.inserted_id)

    # with connector.get_db(getenv("MONGO_ACCOUNTS_DATABASE")) as conn:
    #     conn["accounts"].insert_one({
    #         "username": data.username,
    #         "password": hash_password(data.password),
    #         "email": data.email,
    #         "full_name": data.full_name,
    #         "disabled": False
    #     })

    # if await getUserByEmail(data.email):
    #     return None
    
    # user_id = generateID()
    # fake_db[user_id] = UserBase(
    #     username= data.username,
    #     password= hash_password(data.password),
    #     email= data.email,
    #     full_name= data.full_name,
    #     disabled= False
    # )
    # print(fake_db)
    # return user_id

async def getAllUsers() -> list[UserBase]:
    db = connector.get_db(getenv("MONGO_INITDB_DATABASE"))
    users_cursor = db["accounts"].find()
    
    users = []
    async for user_doc in users_cursor:
        user = UserBase(**user_doc, id=str(user_doc["_id"]))
        users.append(user)
    
    return users

    # return list(fake_db.values())

async def deleteUser(user_id: str) -> bool:
    from bson import ObjectId
    db = connector.get_db(getenv("MONGO_INITDB_DATABASE"))
    result = await db["accounts"].delete_one({"_id": ObjectId(user_id)})
    
    return result.deleted_count > 0

    # if user_id in fake_db:
    #     del fake_db[user_id]
    #     return True
    # return False