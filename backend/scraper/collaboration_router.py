from fastapi import APIRouter, Depends
from pymongo import MongoClient
import os
from auth.auth_utils import get_current_user

router = APIRouter()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db["users"]

@router.get("/collaboration/suggestions")
def get_collaboration_suggestions(user: dict = Depends(get_current_user)):
    user_subfields = user.get("subfields", [])
    user_email = user.get("email")

    if not user_subfields:
        return []

    # Aynı subfield'lara sahip diğer kullanıcıları getir (kendisi hariç)
    results = list(users_collection.find({
        "subfields": {"$in": user_subfields},
        "email": {"$ne": user_email}
    }, {
        "_id": 0,
        "company": 1,
        "website": 1,
        "description": 1,
        "subfields": 1,
        "email": 1  # 🔥 BURAYI EKLE
    }))

    return results
