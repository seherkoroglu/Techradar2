from fastapi import APIRouter, Depends
from auth.auth_utils import get_current_user
from openai import OpenAI
from datetime import datetime
from pymongo import MongoClient
import os

# OpenAI istemcisi
ai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Mongo istemcisi
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client[os.getenv("DB_NAME")]
requests_collection = db["collaboration_requests"]

router = APIRouter()

@router.get("/skill-map-analysis")
async def analyze_skills(current_user: dict = Depends(get_current_user)):
    user_skills = current_user.get("subfields", [])
    target_field = current_user.get("sector", "")

    all_users = db["users"].find({"email": {"$ne": current_user["email"]}})
    competitor_skills = list({skill for user in all_users for skill in user.get("subfields", [])})

    raw_partners = requests_collection.find({"sender_email": current_user["email"], "status": "accepted"})
    partner_candidates = [r["receiver_email"] for r in raw_partners]

    prompt = f"""
Bir teknoloji şirketinin sahip olduğu yetenekler: {', '.join(user_skills)}
Rakip şirketlerin yetenekleri: {', '.join(competitor_skills)}
Hedef alan: {target_field}
Potansiyel işbirliği adayları: {', '.join(partner_candidates)}

1. Eksik olan ama hedef alanda gerekli yetenekleri listele.
2. Rakip şirketlerle kıyasla güçlü/zayıf yönleri çıkar.
3. Bu eksikleri gidermek için bir gelişim yol haritası yaz (zaman planı dahil).
4. Partner şirketlerle nasıl tamamlayıcı işbirliği yapılabilir, açıklayıcı analiz sun.
"""

    response = ai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Yetenek analizi yap ve her bölümü başlıklandır."},
            {"role": "user", "content": prompt}
        ]
    )
    return {"result": response.choices[0].message.content}
