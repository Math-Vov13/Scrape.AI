from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from middewares.ressources import middleware as middleware_ressources
from ressources.ressources import router as RouterRessources
from rpc.server import rpc as RpcAPI

app = FastAPI(title= "MCP-Server-ScrapeAI")
request_id = 0

@app.get("/tools")
async def get_tools():
    return {
        "tools": [
            {
                "name": "ScrapeAI",
                "description": "A tool for scraping data from websites.",
                "url": "/scrape"
            },
            {
                "name": "DataAnalyzer",
                "description": "A tool for analyzing scraped data.",
                "url": "/analyze"
            }
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