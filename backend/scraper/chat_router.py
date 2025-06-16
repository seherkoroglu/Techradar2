from fastapi import APIRouter, Request
from chatbot_training.excel_query_handler import query_excel_tables  # Excel destek
from chatbot_training.excel_query_handler import extract_excel_as_text

import openai
import os
from dotenv import load_dotenv
load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter()

conversation_history = []
@router.post("/chat")
async def chat(request: Request):
    body = await request.json()
    message = body.get("message", "")

    try:
        excel_text = extract_excel_as_text()

        messages = [
            {
                "role": "system",
                "content": "Aşağıdaki tablo bilgilerine göre resmi ve teknik bir yanıt ver. Yorum ekleme, sadece net bilgi sun:"
            },
            {
                "role": "user",
                "content": f"Veri:\n{excel_text}\n\nSoru: {message}"
            }
        ]

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        reply = response.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        return {"error": str(e)}
