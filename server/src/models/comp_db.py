from src.models.db_connect import connector
from src.schema.company_sc import *
from dotenv import load_dotenv
from os import getenv

load_dotenv()

async def getCompanyInfo() -> CompanyBase | None:
    db = connector.get_db(getenv("MONGO_INITDB_DATABASE"))
    company_doc = await db["company"].find_one({})
    
    if company_doc:
        return CompanyBase(**company_doc, id=str(company_doc["_id"]))
    
    return None

async def updateCompanyInfo(data: CompanyBase) -> bool:
    db = connector.get_db(getenv("MONGO_INITDB_DATABASE"))
    
    # Vérifie si l'entreprise existe déjà
    existing_company = await db["company"].find_one({"_id": data.id})
    if not existing_company:
        return False  # entreprise non trouvée
    
    # Met à jour les informations de l'entreprise
    update_result = await db["company"].update_one(
        {"_id": existing_company["_id"]},
        {"$set": data.model_dump(exclude_unset=True)}
    )
    
    return update_result.modified_count > 0