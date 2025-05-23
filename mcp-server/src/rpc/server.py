from fastapi import FastAPI, Request, Body
from pathlib import Path
from fastapi.responses import JSONResponse
from rpc.schemas.request_sc import RPCRequest, RPCResponse
from rpc.utils.ClassTool import Tool_Object

rpc = FastAPI(title="MCP-Server-ScrapeAI")

BASE_PATH_TOOLS = "./rpc/tools"
tools: dict[str, Tool_Object] = {}
request_id = 0


def get_tool_path(tool_name: str) -> Path | None:
    # SANITIZE FILE PATH
    if tool_name.find(".") != -1: # SANITIZE DIR PATH
        return None
    
    tool_name += ".py"
    tool_name = tool_name.replace("-", "_")

    print("Tool name:", tool_name)

    path = Path(BASE_PATH_TOOLS) / tool_name
    return path


@rpc.post("/{function_name}")
async def handle_function(request: Request, function_name: str, body: RPCRequest = Body(...)):
    tool_id = request.headers.get("X-Tool-ID")

    tool: Tool_Object = None
    tool = tools.get(function_name) # Get Tool from cache

    if not tool:
        print("Tool not found in cache, loading...")

        Tool_Path = get_tool_path(function_name)
        if Tool_Path and Tool_Path.exists() and Tool_Path.is_file():
            tool = Tool_Object(Tool_Path)
            tools[Tool_Path.stem] = tool
            
        else:
            return JSONResponse(
                status_code=404,
                content=RPCResponse(
                    id=body.id,
                    jsonrpc=body.jsonrpc,
                    result=None,
                    error={"code": -32601, "message": f"Function {function_name} not found"}
                ).model_dump(),
                headers={"X-Request-ID": str(request_id)}
            )


    try:
        return JSONResponse(
            status_code=200,
            content=RPCResponse(
                id=body.id,
                jsonrpc=body.jsonrpc,
                result=tool.get_function(**body.params),
                error=None
            ).model_dump(),
            headers={"X-Request-ID": str(request_id)}
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=RPCResponse(
                id=body.id,
                jsonrpc=body.jsonrpc,
                result=None,
                error={"code": -32603, "message": str(e)}
            ).model_dump(),
            headers={"X-Request-ID": str(request_id)}
        )


@rpc.middleware("http")
async def add_request_id(request, call_next):
    global request_id
    request_id += 1

    response = await call_next(request)
    response.headers["X-Request-ID"] = str(request_id)
    response.headers["X-Request-Path"] = request.url.path

    return response