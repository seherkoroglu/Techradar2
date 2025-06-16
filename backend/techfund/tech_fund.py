import pandas as pd
import matplotlib.pyplot as plt

# CSV dosyasını oku
df = pd.read_csv("tech_fundings.csv")

# Sayısal değere dönüştür ve boşları temizle
df["Funding Amount (USD)"] = pd.to_numeric(df["Funding Amount (USD)"], errors="coerce")
df = df.dropna(subset=["Region", "Vertical", "Funding Amount (USD)"])

# Ülke + Sektör bazlı grupla
grouped = (
    df.groupby(["Region", "Vertical"])["Funding Amount (USD)"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
    .reset_index()
)

# Bar grafiği için etiketleri hazırla
labels = grouped["Region"] + " - " + grouped["Vertical"]
values = grouped["Funding Amount (USD)"]

# Bar grafiği çiz
plt.figure(figsize=(12, 6))
plt.barh(labels, values, color="mediumpurple")
plt.xlabel("Toplam Yatırım (USD)")
plt.title("En Çok Yatırım Alan 10 Ülke-Sektör Çifti")
plt.gca().invert_yaxis()  # En yüksek yatırımı üstte göster
plt.grid(axis="x", linestyle="--", alpha=0.6)
plt.tight_layout()
plt.show()
