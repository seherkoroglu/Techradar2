from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from auth.auth_utils import get_current_user
from database.mongo import users_collection
from typing import List  # bu satırı ekle


router = APIRouter()

class ProfileUpdateRequest(BaseModel):
    company: str
    website: str
    sector: str
    subfields: List[str]  # burayı düzelttik
    description: str

@router.put("/me/update")
async def update_profile(update_data: ProfileUpdateRequest, current_user: dict = Depends(get_current_user)):
    email = current_user.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Geçersiz kullanıcı")

    updated_user = users_collection.find_one_and_update(
        {"email": email},
        {"$set": {
            "company": update_data.company,
            "website": update_data.website,
            "sector": update_data.sector,
            "subfields": update_data.subfields,
            "description": update_data.description
        }},
        return_document=True
    )

    if not updated_user:
        raise HTTPException(status_code=404, detail="Kullanıcı güncellenemedi")

    updated_user.pop("_id", None)
    return {"status": "success", "user": updated_user}