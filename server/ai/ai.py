import openai
from server.read_doc.read_doc import read_file
openai.api_key = "votre-cle-api"

def ask_ai(file_path, prompt):

    system_prompt=""
    user_prompt = f"{prompt} {read_file(file_path)}"

    response = openai.chat.completions.create(
        model="gpt-4o-mini",  # or "gpt-3.5-turbo" if not available
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=100,
        temperature=0
    )
    return response.choices[0].message.content