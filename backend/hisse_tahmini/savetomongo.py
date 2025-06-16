import json
from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()

# Mongo bağlantısı
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db["stock_forecasts"]

# JSON dosyasını oku ve içeriği MongoDB'ye ekle
with open("stock_forecasts_3yearsyeni.json", "r", encoding="utf-8") as f:
    lines = f.readlines()
    data = [json.loads(line) for line in lines]

# Önceki verileri sil (opsiyonel)
collection.delete_many({})

# Yeni verileri ekle
collection.insert_many(data)

print("✅ Tahmin verileri MongoDB'ye başarıyla eklendi.")
