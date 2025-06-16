from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.auth_router import router as auth_router
from scraper.articles_router import router as articles_router
from scraper.ai_router import router as ai_router
from scraper.eventbrite_router import router as eventbrite_router
from api.forecast_router import router as forecast_router
from api.competitor_router import router as competitor_router
from scraper.admin_router import admin_router as admin_router
from scraper.investments import investments_router
from scraper.migration_router import router as migration_router
from scraper.products import router as products_router
from hisse_tahmini.sirket_hisse_tahmin_router import router as sirket_hisse_router
from scraper.collaboration_router import router as collaboration_router
from scraper.yatirim_router import router as yatirim_router
from api.collaboration_request_router import router as collab_request_router
from scraper.chat_router import router as chat_router
from scraper.gpt_yetenek_analysis import router as ai_skill_router
from scraper.me import router as me_router
from scraper.hissekart_ai import router as hissekart_ai_router

from dotenv import load_dotenv
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend için
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🚀 BACKEND BAŞLADI")

app.include_router(auth_router, prefix="/auth")
app.include_router(ai_router, prefix="/ai")
app.include_router(articles_router, prefix="/articles")
app.include_router(eventbrite_router, prefix="/eventbrite")
app.include_router(forecast_router, prefix="/api")

app.include_router(competitor_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

app.include_router(investments_router, prefix="/investments")
app.include_router(migration_router, prefix="/api")
app.include_router(products_router, prefix="/products")

app.include_router(sirket_hisse_router, prefix="/sirket_hisse_tahmin")
app.include_router(collaboration_router, prefix="/api")
app.include_router(yatirim_router, prefix="/api")
app.include_router(collab_request_router, prefix="/api")
app.include_router(chat_router)
app.include_router(ai_skill_router, prefix="/ai")  # ✅ dikkat

app.include_router(me_router, prefix="/me")

app.include_router(hissekart_ai_router, prefix="/hissekart")




print("📌 Routerlar:", app.routes)
