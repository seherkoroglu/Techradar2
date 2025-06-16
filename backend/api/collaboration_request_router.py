from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from auth.auth_utils import get_current_user
from pymongo import MongoClient
from bson import ObjectId
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
import os

router = APIRouter()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

collection = db["users"]
requests_collection = db["collaboration_requests"]

class CollaborationRequest(BaseModel):
    receiver_email: EmailStr

class StatusUpdateRequest(BaseModel):
    request_id: str
    new_status: str

class RequestResponse(BaseModel):
    request_id: str
    action: str  # "accept" veya "reject"

@router.post("/collaboration/send-request")
def send_collaboration_request(
    req: CollaborationRequest,
    sender: dict = Depends(get_current_user)
):
    receiver = collection.find_one({"email": req.receiver_email})
    if not receiver:
        raise HTTPException(status_code=404, detail="Hedef kullanıcı bulunamadı")

    requests_collection.insert_one({
        "sender_email": sender["email"],
        "receiver_email": req.receiver_email,
        "status": "pending",
        "timestamp": datetime.utcnow()
    })

    subject = f"{sender['company']} ile İş Birliği Talebi"
    body = f"""
Merhaba {receiver['company']} ekibi,

{sender['company']} şirketi olarak sizinle iş birliği yapmak istiyoruz!

Detaylar için bizimle iletişime geçebilirsiniz:
📧 {sender['email']}
🌐 {sender.get('website', 'Belirtilmemiş')}
📝 {sender.get('description', '')}

TechRadar üzerinden gönderildi.
"""
    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = os.getenv("SMTP_SENDER")
    message["To"] = req.receiver_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(os.getenv("SMTP_SENDER"), os.getenv("SMTP_PASSWORD"))
            smtp.send_message(message)
            return {"message": "İş birliği isteği başarıyla gönderildi."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"E-posta gönderilemedi: {str(e)}")

@router.get("/collaboration/sent-requests")
def get_sent_requests(current_user: dict = Depends(get_current_user)):
    sent = list(requests_collection.find(
        {"sender_email": current_user["email"]}
    ))
    for item in sent:
        item["_id"] = str(item["_id"])
    return sent

@router.get("/collaboration/received-requests")
def get_received_requests(current_user: dict = Depends(get_current_user)):
    received = list(requests_collection.find(
        {"receiver_email": current_user["email"]}
    ))
    for item in received:
        item["_id"] = str(item["_id"])
    return received

@router.post("/api/collaboration/respond-request")
def respond_request(data: RequestResponse, user: dict = Depends(get_current_user)):
    if data.action not in ["accept", "reject"]:
        raise HTTPException(status_code=400, detail="Geçersiz işlem")

    request_obj = requests_collection.find_one({"_id": ObjectId(data.request_id)})

    if not request_obj:
        raise HTTPException(status_code=404, detail="İstek bulunamadı")

    if request_obj["receiver_email"] != user["email"]:
        raise HTTPException(status_code=403, detail="Yetkisiz işlem")

    result = requests_collection.update_one(
        {"_id": ObjectId(data.request_id)},
        {"$set": {"status": data.action}}
    )

    if result.modified_count == 1:
        return {"message": "İstek güncellendi"}
    else:
        raise HTTPException(status_code=500, detail="Güncelleme başarısız")

@router.post("/collaboration/update-status")
def update_status(
    data: StatusUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    if data.new_status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Geçersiz durum")

    result = requests_collection.update_one(
        {"_id": ObjectId(data.request_id), "receiver_email": current_user["email"]},
        {"$set": {"status": data.new_status}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="İstek bulunamadı veya yetki yok")

    return {"message": "Durum güncellendi"}
