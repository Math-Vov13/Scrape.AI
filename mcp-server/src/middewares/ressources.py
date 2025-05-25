from fastapi import Request
from fastapi.responses import JSONResponse


async def middleware(request: Request, new_request_id: int, call_next):
    if request.method != "GET" and request.method != "OPTIONS":
        return JSONResponse(
            status_code=405,
            content={"error": "Method not allowed"},
            headers={"X-Request-ID": str(new_request_id)}
        )
    
    response = await call_next(request)
    return response