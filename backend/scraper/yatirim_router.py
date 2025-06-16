from fastapi import APIRouter
from pymongo import MongoClient
import os

router = APIRouter()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

collection = db["investment_opportunities"]

@router.get("/investment-opportunities")
def get_investment_opportunities():
    results = list(collection.find({}, {"_id": 0}))
    return results
