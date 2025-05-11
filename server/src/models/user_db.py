import random
from src.schema.users_sc import UserBase, UserCreate

def generateID()-> str:
    return random.randbytes(32).hex()

fake_db = {
    generateID() : UserBase(
        username= "Admin",
        password= "Admin",
        email= "admin@scrape.ai",
        full_name= "Admin",
        disabled= False
    )
}


async def getUser(email: str, password: str) -> UserBase | None:
    for user in fake_db.values():
        if user.email == email and user.password == password:
            return user
    return None

async def getUserByEmail(email: str) -> UserBase | None:
    for user in fake_db.values():
        if user.email == email:
            return user
    return None


async def createUser(data: UserCreate) -> str | None:
    if await getUserByEmail(data.email):
        return None
    
    user_id = generateID()
    fake_db[user_id] = UserBase(
        **data.model_dump()
    )
    return user_id