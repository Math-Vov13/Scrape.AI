import random
from src.schema.users_sc import UserBase, UserCreate
from src.security.secure import hash_password, verify_password

def generateID()-> str:
    return random.randbytes(32).hex()

fake_db = {
    generateID() : UserBase(
        username= "Admin",
        password= "$2b$12$FRRwuN1mOqEU3yW0y23m1.7asJU7NdglFatuPr2QSI4InSsQ3SO3C",
        email= "admin@scrape.ai",
        full_name= "Admin",
        disabled= False
    )
}


async def getUser(email: str, password: str) -> UserBase | None:
    for user in fake_db.values():
        if user.email == email and verify_password(password, user.password):
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
        username= data.username,
        password= hash_password(data.password),
        email= data.email,
        full_name= data.full_name,
        disabled= False
    )
    print(fake_db)
    return user_id