from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI

router = APIRouter()
client = OpenAI()  # Yeni sürümde böyle olmalı

class ForecastItem(BaseModel):
    ticker: str
    predicted_price: float
    lower_bound: float
    upper_bound: float
    count: Optional[int] = None
    status: Optional[str] = None

class ForecastCommentRequest(BaseModel):
    forecasts: List[ForecastItem]

@router.post("/ai/forecast-comments")
async def generate_comments(req: ForecastCommentRequest):
    comments = []

    for f in req.forecasts:
        prompt = (
            f"{f.ticker} hissesi için model tarafından {f.predicted_price} dolar tahmin edilmiştir. "
            f"Güven aralığı: {f.lower_bound} - {f.upper_bound} dolar. "
            f"{f.status or ''} Bu bilgilere göre kısa bir yatırım yorumu yapar mısın?"
        )

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}]
            )
            comment_text = response.choices[0].message.content.strip()

        except Exception as e:
            comment_text = f"Yorum alınamadı: {str(e)}"

        comments.append({
            "ticker": f.ticker,
            "comment": comment_text
        })

    return {"status": "success", "comments": comments}
