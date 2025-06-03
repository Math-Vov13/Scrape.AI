from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from src.middewares.ressources import middleware as middleware_ressources
from src.ressources.ressources import router as RouterRessources
from src.rpc.server import rpc as RpcAPI

app = FastAPI(title= "MCP-Server-ScrapeAI")
request_id = 0

@app.get("/map_tools")
async def get_tools():
    return {
        "tools": [
            {
            "type": "function",
            "function": {
                "name": "getEnterpriseData",
                "description": "Get the enterprise data",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "enterprise_name": {
                            "type": "string",
                            "description": "The name of the enterprise"
                        },
                        "enterprise_description": {
                            "type": "string",
                            "description": "The description of the enterprise"
                        }
                    },
                    "required": ["enterprise_name", "enterprise_description"]
                }
            }
        },
        {"type": "function",
            "function": {
                "name": "getBestMatchingFileByKeyword",
                "description": "Retrieve the best matching file by searching through a company's files with a keyword",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "searching_word": {
                            "type": "string",
                            "description": "The word the user is trying to find in the files"
                        },
                        "similar_words": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                            "description": "Give 5 words that are similar to the searched word and can be used instead of it"
                        }
                    },
                    "required": ["searching_word", "similar_words"]
                }
            }
        }

            # {
            #     "name": "ScrapeAI",
            #     "description": "A tool for scraping data from websites.",
            #     "url": "/scrape"
            # },
            # {
            #     "name": "DataAnalyzer",
            #     "description": "A tool for analyzing scraped data.",
            #     "url": "/analyze"
            # }
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}


# Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    global request_id
    request_id += 1

    if request.url.path.startswith("/ressources"):
        return await middleware_ressources(request, request_id, call_next)


    response = await call_next(request)
    response.headers["X-Request-ID"] = str(request_id)
    response.headers["X-Request-Path"] = request.url.path

    return response


# Routers
app.include_router(
    RouterRessources,
    prefix="/ressources",
    tags=["ressources"],
    responses={404: {"jsonrpc":"2.0","id":"1","method":"ressources/error","params":{}}}
)

app.mount("/tools", RpcAPI, name="tools")