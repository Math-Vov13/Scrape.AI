from datetime import datetime
from src.schema.files_sc import *
from src.models.db_connect import connector
from dotenv import load_dotenv
from os import getenv

load_dotenv()


async def create_files(files: list[FileSchema]) -> list[str]:
    """
    Create a new file record in the database.
    """
    db = connector.get_db(getenv("MONGO_INITDB_DATABASE"))
    file_docs = [file.model_dump(mode="json") for file in files]
    result = await db["files"].insert_many(file_docs)
    return result.inserted_ids


async def get_files(limit: int = 100, offset: int = 0) -> list[FileSchema]:
    """
    Retrieve a list of files from the database.
    """
    db = connector.get_db(getenv("MONGO_INITDB_DATABASE"))
    files_cursor = db["files"].find().skip(offset).limit(limit)
    
    files = []
    async for file_doc in files_cursor:
        file = FileDB(**file_doc, id=str(file_doc["_id"]))
        files.append(file)
    
    return files

async def delete_file(file_id: str) -> bool:
    from bson import ObjectId
    """
    Delete a file record from the database by its ID.
    """
    db = connector.get_db(getenv("MONGO_INITDB_DATABASE"))
    result = await db["files"].delete_one({"_id": ObjectId(file_id)})
    
    if result.deleted_count == 1:
        return True
    return False