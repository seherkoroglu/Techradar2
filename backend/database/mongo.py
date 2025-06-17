import os
from dotenv import load_dotenv
from pymongo import MongoClient

# .env dosyasını yükle
load_dotenv()

# Ortam değişkenlerini al
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "techradar")  # Eğer yoksa default olarak techradar
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")  # Yine fallback'li

# Mongo bağlantısı
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Koleksiyonlar
users_collection = db["users"]
articles = db["articles"]
