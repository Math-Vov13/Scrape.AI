import json
import httpx
from httpx import Timeout
from src.config.Config import config
from src.schema.openai_sc import *
from src.schema.mcp_sc import MCPRequest
from os import environ as env
from async_lru import alru_cache
import asyncio


OPENAI_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": f"Bearer {env['CHATGPT_API_KEY']}"
}

MCP_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": f"Bearer {env['MCP_API_KEY']}"
}


def createSystemPrompt(username: str, model: str = "OpenAI") -> str:
    """
    Create a system prompt for the OpenAI API.
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
    The user prefered language is 'english'.
    The user access to the entreprise data is 'admin'.
    """


async def sendChat(conv_history: list[OpenAIUserMessage | OpenAIAssistantMessage], model: OpenAIModel, temperature: float, max_tokens: int):
    history: list[OpenAIUserMessage | OpenAIAssistantMessage | OpenAIToolMessage] = conv_history.copy()

    async with httpx.AsyncClient() as client:
        while True:
            print("Starting new chat loop", flush=True)
            buffer = ""
            tool_calls: dict[str, OpenAIToolCallRequest] = {}  # Store tool calls to handle them after the response
            usingTool = False
            actual_tool_id = None

            prompt = OpenAIRequestAPI(
                model=model,
                messages=history,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=1.0,
                stream=True,
                tools= await getTools(),
                tool_choice="auto",
            ).model_dump(mode="json")

            print(f"Sending prompt to OpenAI API: {prompt}", flush=True)

            async with client.stream(method="POST", url=config.openai_api_url,
                                     headers=OPENAI_HEADERS, json=prompt) as response:
                if response.status_code == 200:
                    async for chunk in response.aiter_bytes():
                        if not chunk:
                            continue

                        buffer += chunk.decode("utf-8")

                        while "\n" in buffer:
                            line, buffer = buffer.split("\n", 1)
                            line = line.strip()

                            if not line.startswith("data:"):
                                continue

                            data_str = line[5:].strip()
                            if data_str == "[DONE]":
                                break

                            try:
                                data = json.loads(data_str)
                                choices = data.get("choices", [])

                                for choice in choices:
                                    print("Chunk:", data, flush=True)
                                    delta = choice.get("delta", {})

                                    if "content" in delta and delta["content"] != None:
                                        yield delta["content"]

                                    if "tool_calls" in delta:
                                        # OpenAI streams tool_calls in chunks, sometimes splitting arguments
                                        for tool in delta["tool_calls"]:
                                            tool_id = tool.get("id", None)
                                            index = tool.get("index", 0)
                                            name = tool["function"].get("name")
                                            args = tool["function"].get("arguments", "")

                                            print(f"Processing tool call: id={tool_id}, index={index}, name={name}, args={args}", flush=True)

                                            if tool_id is None:
                                                if tool_calls.get(actual_tool_id) is None:
                                                    raise ValueError("Tool call without ID found in response.")
                                                tool_calls.get(actual_tool_id).function.arguments += args
                                            else:
                                                tool_call = OpenAIToolCallRequest(
                                                    id=tool_id,
                                                    index=index,
                                                    function=OpenAIToolFunctionRequest(
                                                        name=name,
                                                        arguments=args
                                                    )
                                                )
                                                tool_calls[tool_id] = tool_call
                                                actual_tool_id = tool_id

                                if choice.get("finish_reason") == "tool_calls":
                                    print("Tool calls detected in response, processing...")
                                    usingTool = True

                                    history.append(
                                        OpenAIAssistantMessage(
                                            role="assistant",
                                            tool_calls=tool_calls.values()
                                        ).model_dump(mode="json")
                                    )

                                    for tool_request in tool_calls.values():
                                        yield f"[TOOL_CALL] id: {tool_request.id}, name: {tool_request.function.name}, parameters: {tool_request.function.arguments}\n"

                                        response = await callTool(
                                            call_function_id=tool_request.id,
                                            tool_name=tool_request.function.name,
                                            arguments=tool_request.function.arguments
                                        )

                                        # Ensure response is a dict before accessing "result"
                                        result_content = response["result"] if isinstance(response, dict) and "result" in response else str(response)
                                        history.append(OpenAIToolMessage(
                                            role="tool",
                                            name=tool_request.function.name,
                                            content=json.dumps(result_content),
                                            tool_call_id=tool_request.id
                                        ))

                            except json.JSONDecodeError:
                                continue
                else:
                    print(f"Error: {response.status_code} - {await response.aread()}", flush=True)
                    response.raise_for_status()

            print("end of loop", usingTool, flush=True)
            if not usingTool:
                break
            else:
                print("Waiting...", flush=True)
                await asyncio.sleep(0.3)  # Avoid error '429 Too Many Requests' if tool calls are made
    print("Chat loop finished", flush=True)



### --- TOOLS --- ###

@alru_cache(maxsize=128)
async def callTool(call_function_id: str, tool_name: str, arguments: str) -> str:
    """
    Fetch data from the MCP Server using a tool call.
    """

    req_body = MCPRequest(
        id=call_function_id,
        method= f"tools/{tool_name}",
        params=json.loads(arguments)
    ).model_dump(mode="json")

    print("Calling Tool Request:", req_body)

    try:
        async with httpx.AsyncClient(timeout= Timeout(timeout= 700)) as client:
            print("url:", f"{config.mcp_url}{config.mcp_tools_base_url}/{tool_name}")
            print("headers:", MCP_HEADERS)
            response = await client.post(
                url=f"{config.mcp_url}{config.mcp_tools_base_url}/{tool_name}",
                headers=MCP_HEADERS,
                json=req_body
            )

            print("Tool Call Response:", response.status_code, response.text, flush=True)

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
    return response


@alru_cache(maxsize=128)
async def getTools() -> list[dict]:
    """
    Get the list of available tools from the MCP Server.
    """
    async with httpx.AsyncClient(timeout=Timeout(timeout=5)) as client:
        try:
            print("url:", f"{config.mcp_url}{config.mcp_tools_url}")
            print("headers:", MCP_HEADERS)
            response = await client.get(
                url=f"{config.mcp_url}{config.mcp_tools_url}",
                headers=MCP_HEADERS
            )
            if response.status_code == 200:
                tools = response.json()
                print("Tools fetched successfully:", type(tools), tools)
                return tools["tools"] if "tools" in tools else tools
            else:
                print(f"Error fetching tools: {response.status_code} - {response.text}")
                return []
        except httpx.RequestError as e:
            print(f"Request error while fetching tools: {e}")
            return []
        except httpx.TimeoutException:
            print("Timeout error while fetching tools")
            return []
        except Exception as e:
            print(f"An unexpected error occurred while fetching tools: {e}")
            return []