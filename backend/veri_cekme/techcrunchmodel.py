import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib

# 1. Veri Yükleme
print("📂 Veriler yukleniyor...")
df = pd.read_csv("../scraper/techcrunch_full_news.csv")

# 2. Temizlik: Eksik başlık veya kategori olanları at
print("🧹 Temizlik yapılıyor...")
df = df.dropna(subset=["title", "category"])
print(f"📚 Toplam haber sayısı: {len(df)}")

# 3. Gürültülü/Etkinlik isimli kategorileri çıkar
noise_keywords = [
    "TechCrunch", "Disrupt", "TC Sessions", "StrictlyVC", "All Stage",
    "Early Stage", "2023", "2024", "2025", "–", "San Francisco", "Los Angeles", "London", "Greece"
]

def is_noise(label):
    return any(nk.lower() in label.lower() for nk in noise_keywords)

df = df[~df["category"].apply(is_noise)]

# 4. En az 30 haberi olan kategorileri al (az olanlar modeli bozar)
category_counts = df["category"].value_counts()
valid_categories = category_counts[category_counts >= 30].index
df = df[df["category"].isin(valid_categories)]

print(f"✅ Kalan haber sayısı (filtrelenmiş): {len(df)}")
print(f"🔢 Kategori sayısı: {len(valid_categories)}")

# 5. Özellik ve Etiketleri Belirleme
X = df["title"]
y = df["category"]

# 6. Eğitim / Test Ayrımı
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 7. TF-IDF Vektörizasyonu
vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# 8. Model Eğitimi
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

# 9. Değerlendirme
y_pred = model.predict(X_test_vec)
print(f"\n🎯 Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("📋 Classification Report:\n")
print(classification_report(y_test, y_pred, zero_division=0))

# 10. Kaydet
joblib.dump(model, "../scraper/techcrunch_clean_model.pkl")
joblib.dump(vectorizer, "../scraper/techcrunch_clean_vectorizer.pkl")
print("\n✅ Model ve vectorizer kaydedildi!")
