import httpx
from src.config.Config import config
from src.schema.mistral_sc import MistralRequestAPI, MistralModel, MistralMessage
from os import environ as env

headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "MistralClient/1.0",
    "Authorization": f"Bearer {env['MISTRAL_API_KEY']}"
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

    prompt = MistralRequestAPI(
        model= model,
        messages= history,
        temperature= temperature,
        max_tokens= max_tokens,
        # top_p= 1.0,
        stream= True
    ).model_dump(mode= "json")

    print(f"Sending prompt to Mistral API: {prompt}")

    async with httpx.AsyncClient() as client:
        async with client.stream(method= "POST", url= config.mistral_api_url,
                        headers= headers, json= prompt) as response:
            if response.status_code == 200:
                async for chunk in response.aiter_bytes():
                    print(chunk, flush=True)
                    if chunk:
                        yield chunk.decode('utf-8')
            else:
                print(f"Error: {response.status_code} - {await response.aread()}")
                response.raise_for_status()


async def callTool(prompt, model="mistral", temperature=0.7, max_tokens=1000):
    """
    Call the Mistral API with the given parameters.
    """
    response = await sendChat(prompt, model, temperature, max_tokens)
    return response


async def getTools():
    """
    Get the list of available tools from the Mistral API.
    """
    async with httpx.get(url=f"{config.mistral_api_url}/tools", headers=headers) as response:
        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()