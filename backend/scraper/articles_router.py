import re

from fastapi import APIRouter, Depends
from auth.auth_utils import get_current_user

from fastapi import APIRouter
from pymongo import MongoClient
import os
from datetime import datetime
from typing import List
from datetime import datetime

# API Router
router = APIRouter()
# Ortam değişkenlerinden URI ve DB bilgisi al
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db["articles"]  # JSON yüklenirken bu koleksiyona atılmış olmalı
@router.get("/by-subfield")
async def get_articles_by_subfield(user: dict = Depends(get_current_user)):
    user_subfields = user.get("subfields", [])

    print("📌 Gelen kullanıcı:", user)
    print("🎯 Subfields:", user_subfields)

    if not user_subfields:
        return []

    results = list(collection.find({
        "tags": {
            "$in": [re.compile(re.escape(tag), re.IGNORECASE) for tag in user_subfields]
        }
    }))
    for r in results:
        r["_id"] = str(r["_id"])
    return results
