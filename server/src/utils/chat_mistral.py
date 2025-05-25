import json
import httpx
from httpx import Timeout
from src.config.Config import config
from src.schema.mistral_sc import MistralRequestAPI, MistralModel, MistralMessage, MistralToolResponse
from src.schema.mcp_sc import MCPRequest
from os import environ as env
from async_lru import alru_cache


MISTRAL_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "MistralClient/1.0",
    "Authorization": f"Bearer {env['MISTRAL_API_KEY']}"
}

MCP_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": f"Bearer {env['MCP_API_KEY']}"
}


def createSystemPrompt(username: str, model: str = "mistral") -> str:
    """
    Create a system prompt for the Mistral API.
    """
    return f"""
    You are the best AI assistant for entreprises in the world called '{model}'.
    You are using a sophisticated technology to interact with entreprises data as files, database, directories, etc.
    You are able to answer questions, provide information, and assist with various tasks.

    ## Enterprise Information
    You are managing the entreprise data of '{config.enterprise_name}'.
    The entreprise description is '{config.enterprise_description}'.

    ## User Information
    The user who is talking to you is named '{username}'.
    The user job is 'admin'.
    The user access to the entreprise data is 'admin'.
    """


async def sendChat(history: list[MistralMessage], model: MistralModel, temperature: float=0.7, max_tokens: int=1000):

    buffer = ""
    tool_calls = {}

    prompt = MistralRequestAPI(
        model= model,
        messages= history,
        temperature= temperature,
        max_tokens= max_tokens,
        top_p= 1.0,
        stream= True,

        tools= await getTools(),
        tool_choice= "auto",
    ).model_dump(mode= "json")

    print(f"Sending prompt to Mistral API: {prompt}")

    async with httpx.AsyncClient() as client:
        async with client.stream(method= "POST", url= config.mistral_api_url,
                        headers= MISTRAL_HEADERS, json= prompt) as response:
            if response.status_code == 200:
                async for chunk in response.aiter_bytes():
                    if not chunk:
                        continue

                    # Ajout au buffer (important car un JSON peut être split sur plusieurs chunks)
                    buffer += chunk.decode("utf-8")

                    # Traitement ligne par ligne
                    while "\n" in buffer:
                        line, buffer = buffer.split("\n", 1)
                        line = line.strip()

                        if not line or not line.startswith("data:"):
                            continue
                        data_str = line[5:].strip()

                        if data_str == "[DONE]":
                            return

                        try:
                            data = json.loads(data_str)
                            choices = data.get("choices", [])
                            for choice in choices:
                                delta = choice.get("delta", {})
                                print("chunk:", delta, flush=True)

                                # Cas 1 : contenu assistant (texte)
                                if "content" in delta:
                                    yield delta["content"]

                                # Cas 2 : Tool call détecté
                                if "tool_calls" in delta:
                                    for tool in delta["tool_calls"]:
                                        tool_id = tool.get("id")
                                        name = tool["function"]["name"]
                                        args = tool["function"]["arguments"]

                                        tool_calls[tool_id] = {
                                            "name": name,
                                            "arguments": args
                                        }

                            # Si l'appel est terminé et que le modèle a indiqué un appel de tool
                            if choice.get("finish_reason") == "tool_calls":
                                # Traitement des tools
                                for tool_id, call in tool_calls.items():
                                    print(f"\n🔧 Tool Call Detected: {call['name']} with args {call['arguments']}")

                                    print("id", tool_id)
                                    print("name", call["name"])
                                    print("arguments", call["arguments"])

                                    response = await callTool(
                                        call_function_id= tool_id,
                                        tool_name= call["name"],
                                        arguments= call["arguments"]
                                    )

                                    yield f"[TOOL_CALL] {call['name']} - {call['arguments']}"
                        except json.JSONDecodeError:
                            # Chunk incomplet, attendre le prochain
                            continue
            else:
                print(f"Error: {response.status_code} - {await response.aread()}")
                response.raise_for_status()


### --- TOOLS --- ###

@alru_cache(maxsize=128)
async def callTool(call_function_id: str, tool_name: str, arguments: str) -> MistralToolResponse:
    """
    Fetch data from the MCP Server using a tool call.
    """

    req_body = MCPRequest(
        id=call_function_id,
        method= f"tools/{tool_name}",
        params=json.loads(arguments)
    ).model_dump_json()

    print("Calling Tool Request:", req_body)

    try:
        async with httpx.AsyncClient(timeout= Timeout(timeout= 3)) as client:
            print("url:", f"{config.mcp_tools_base_url}/{tool_name}")
            print("headers:", MCP_HEADERS)
            response = await client.post(
                url=f"{config.mcp_tools_base_url}/{tool_name}",
                headers=MCP_HEADERS,
                json=req_body
            )
            if response.status_code == 200:
                response = response.json()
            else:
                print(f"Error calling tool '{tool_name}' ({response.status_code}): {response.text}")
                response = "Error calling tool {status: %d, response: %s}" % (response.status_code, response.text)
    except httpx.RequestError as e:
        print(f"Request error while calling tool '{tool_name}': {e}")
        response = f"Request error: {str(e)}"
    except httpx.TimeoutException:
        print(f"Timeout error while calling tool '{tool_name}'")
        response = "Timeout error while calling tool"
    except:
        response = "An unexpected error occurred while calling the tool [Internal Server Error]"

    print(f"Tool Call Response: {response}")
    return MistralToolResponse(
        role="tool",
        name=tool_name,
        content=response,
        tool_call_id=call_function_id
    ).model_dump(mode="json")


@alru_cache(maxsize=128)
async def getTools() -> list[dict]:
    """
    Get the list of available tools from the MCP Server.
    """
    return [
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
        }
    ]
    # async with httpx.get(url=f"{config.mistral_api_url}/tools", headers=headers) as response:
    #     if response.status_code == 200:
    #         return response.json()
    #     else:
    #         response.raise_for_status()