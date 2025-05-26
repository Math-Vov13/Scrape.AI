import logging
from pymongo import AsyncMongoClient
from urllib.parse import quote_plus
from dotenv import load_dotenv
from os import getenv

load_dotenv()


class MongoDBSingleton:
    _instance = None
    logger = logging.getLogger(__name__)
    client = None

    def __new__(cls, uri="mongodb://localhost:27017", db_name: str = None):
        if cls._instance is None:
            cls._instance = super(MongoDBSingleton, cls).__new__(cls)
            #cls._instance._init_connection(uri, db_name)
        return cls._instance

    def _init_connection(self, uri: str, db_name: str):
        if self.client:
            self.logger.warning("MongoDB client already initialized.")
            return
        
        uri = "mongodb://mongodb:27017/"
        base_uri = uri or "mongodb://%s:%s/" % (
            # quote_plus(getenv("MONGO_INITDB_ROOT_USERNAME")), quote_plus(getenv("MONGO_INITDB_ROOT_PASSWORD")),
            quote_plus(getenv("MONGO_HOST")), quote_plus(getenv("MONGO_PORT"))
            )
        
        print(f"Connecting to MongoDB at {base_uri}")
        self.client = AsyncMongoClient(base_uri)
        print(self.client)
        print("type", type(self.client))

    def get_db(self, db_name: str=None):
        return self.client[db_name or getenv("MONGO_INITDB_DATABASE")]
    
    async def close_connection(self):
        await self.client.close()


connector: MongoDBSingleton = MongoDBSingleton()