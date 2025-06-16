from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
import os
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
import os
import requests

def serpapi_search(query: str, api_key: str):
    params = {
        "engine": "google",
        "q": query,
        "api_key": api_key,
        "num": 5
    }
    response = requests.get("https://serpapi.com/search", params=params)
    return response.json()


router = APIRouter()
load_dotenv()
@router.post("/events-search")
async def search_google_events(request: Request):
        body = await request.json()
        keyword = body.get("keyword")

        if not keyword:
            raise HTTPException(status_code=400, detail="Keyword gerekli.")

        serpapi_key = os.getenv("SERPAPI_KEY")
        if not serpapi_key:
            raise HTTPException(status_code=401, detail="SerpApi API key bulunamadı.")

        params = {
            "engine": "google_events",
            "q": keyword,
            "hl": "en",
            "gl": "tr",
            "api_key": serpapi_key,
        }

        search = serpapi_search(params)
        results = search.get_dict()

        events = results.get("events_results", [])

        return {"events": events}

