from fastapi import APIRouter
from pymongo import MongoClient
import os
from datetime import datetime
from typing import List
from datetime import datetime
router = APIRouter()

# Ortam değişkenlerinden URI ve DB bilgisi al
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db["stock_forecasts"]  # JSON yüklenirken bu koleksiyona atılmış olmalı

# 1. Tüm tahminleri getir
@router.get("/stock-forecast/all")
def get_all_stock_forecasts():
    all_data = list(collection.find({}, {"_id": 0}))

    # date alanını insan okunabilir formata çevir (örn: "2025-05-03")
    # Tarih formatını kontrol et ve düzgün formatta gönder
    for item in all_data:
        if "date" in item and isinstance(item["date"], str):
            item["date"] = item["date"]  # Tarih zaten stringse doğrudan kullan
        elif "date" in item and isinstance(item["date"], int):
            # Eğer tarih int (timestamp) ise dönüştür
            item["date"] = datetime.fromtimestamp(item["date"] / 1000).strftime("%Y-%m-%d")
        else:
            item["date"] = "Tarih yok"

    return all_data

# 2. Bir şirketin tahminlerini getir (ticker ile)
@router.get("/stock-forecast/{ticker}")
def get_forecast_by_ticker(ticker: str):
    results = list(collection.find({"ticker": ticker.upper()}, {"_id": 0}))
    return results

# 3. Belirli bir tarihe en yakın tahmini getir
@router.get("/stock-forecast/{ticker}/latest")
def get_latest_forecast(ticker: str):
    result = collection.find_one(
        {"ticker": ticker.upper()},
        sort=[("date", -1)],
        projection={"_id": 0}
    )
    return result



