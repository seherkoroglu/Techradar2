import feedparser
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv()  # .env dosyasını yükle

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

db = client["techradar"]
articles = db["articles"]

def scrape_medium_rss():
    feed = feedparser.parse("https://medium.com/feed/tag/artificial-intelligence")

    for entry in feed.entries[:5]:
        doc = {
            "source": "Medium RSS",
            "title": entry.title,
            "url": entry.link,
            "summary": entry.summary,
            "content": "",
            "tags": ["AI"],
            "date": datetime.now().strftime("%Y-%m-%d")
        }
        articles.insert_one(doc)
        print(f"[✓] RSS'den eklendi: {entry.title}")

if __name__ == "__main__":
    scrape_medium_rss()
