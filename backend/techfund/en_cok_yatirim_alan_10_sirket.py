import pandas as pd
import matplotlib.pyplot as plt

# Veriyi yükle
df = pd.read_csv("tech_fundings.csv")

# Sayısal formata çevir
df["Funding Amount (USD)"] = pd.to_numeric(df["Funding Amount (USD)"], errors="coerce")

# Eksik veya hatalı satırları at
df = df.dropna(subset=["Funding Amount (USD)", "Company", "Vertical", "Region"])

# En çok yatırım alan 10 şirketi al
top10 = df.sort_values(by="Funding Amount (USD)", ascending=False).head(10)

# 📊 Görselleştir
plt.figure(figsize=(12, 6))
bars = plt.barh(top10["Company"], top10["Funding Amount (USD)"], color="mediumseagreen")
plt.xlabel("Yatırım Miktarı (USD)")
plt.title("En Çok Yatırım Alan 10 Şirket")

# Her bar üzerine etiket ekle
for bar, sector, country in zip(bars, top10["Vertical"], top10["Region"]):
    width = bar.get_width()
    plt.text(width + 50000, bar.get_y() + bar.get_height()/2,
             f"{sector} | {country}", va="center", fontsize=9)

plt.gca().invert_yaxis()
plt.tight_layout()
plt.show()

# 🖨️ İsteğe bağlı olarak yazdır
print(top10[["Company", "Vertical", "Region", "Funding Amount (USD)"]])
