from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "..", "veri_cekme", "migrations.csv")

@router.get("/tech-migrations")
async def get_migrations():
    try:
        df = pd.read_csv(CSV_PATH)

        # Kolon adlarını daha anlaşılır hale getir
        df = df.rename(columns={
            "company": "company",
            "url": "source_url",
            "year": "year",
            "from": "source_tech",
            "to": "destination_tech"
        })

        # İlk 300 satırı döndür
        return {
            "status": "success",
            "data": df[["company", "source_url", "year", "source_tech", "destination_tech"]].head(300).to_dict(orient="records")
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
