# backend/routes/investments.py
from fastapi import APIRouter
import pandas as pd
import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from openai import OpenAI
router = APIRouter()
client = OpenAI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "tech_fundings.csv")
df = pd.read_csv(csv_path)


@router.get("/investments/top")
def get_top_investments():
    df = pd.read_csv(csv_path)
    df["Funding Amount (USD)"] = pd.to_numeric(df["Funding Amount (USD)"], errors="coerce")
    df = df.dropna(subset=["Funding Amount (USD)", "Company", "Vertical", "Region"])
    top10 = df.sort_values(by="Funding Amount (USD)", ascending=False).head(20)

    result = []
    for _, row in top10.iterrows():
        result.append({
            "company": row["Company"],
            "sector": row["Vertical"],
            "country": row["Region"],
            "amount": float(row["Funding Amount (USD)"]),
        })
    return result
# En alt satıra şunu ekle:
investments_router = router

class CompanyInfo(BaseModel):
    company: str
    sector: str
    country: str
    amount: float

class InvestmentExplainRequest(BaseModel):
    companies: List[CompanyInfo]

@router.post("/investments/ai-reasons")
async def get_investment_reasons(req: InvestmentExplainRequest):
    explanations = []

    for c in req.companies:
        prompt = (
            f"{c.company} isimli şirket {c.sector} sektöründe faaliyet göstermekte ve {c.country} ülkesinde yer almaktadır. "
            f"2020-2025 arasında {c.amount:,.0f} USD yatırım almıştır. "
            f"Bu şirkete yapılan bu kadar yüksek yatırımın nedeni ne olabilir? Kısa ve sektörel bir yorum yap. 5 cümlelik olsun"
        )

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}]
            )
            comment = response.choices[0].message.content.strip()
        except Exception as e:
            comment = f"Yorum alınamadı: {str(e)}"

        explanations.append({
            "company": c.company,
            "comment": comment
        })

    return {"status": "success", "comments": explanations}
