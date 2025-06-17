from fastapi import APIRouter
from pymongo import MongoClient
import os

router = APIRouter()

# Ortam değişkenlerinden ya da doğrudan URI ve DB bilgisi
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db["products"]

@router.get("/products")
def get_all_products():
    """Tüm ürünleri döner."""
    products = list(collection.find({}, {"_id": 0}))  # _id olmadan
    return products

@router.get("/products/by-company")
def get_products_by_company(company: str):
    """Şirkete göre filtrelenmiş ürünleri döner."""
    products = list(collection.find({"company": company}, {"_id": 0}))
    return products

@router.get("/products/by-subfield")
def get_products_by_subfield(subfield: str):
    """Alt alana göre filtrelenmiş ürünleri döner."""
    products = list(collection.find({"subfield": subfield}, {"_id": 0}))
    return products
