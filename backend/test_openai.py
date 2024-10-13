# test_openai_api.py

import openai
from config import GPT_API_KEY

openai.api_key = GPT_API_KEY

try:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "Hello, how are you?"}
        ]
    )
    print("API call successful!")
    print(response['choices'][0]['message']['content'])
except Exception as e:
    print(f"API call failed: {e}")
