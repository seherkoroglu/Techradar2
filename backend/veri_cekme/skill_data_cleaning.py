import pandas as pd
import json
import matplotlib.pyplot as plt
import seaborn as sns

# JSON Dosyasını Yükle
with open("skill_map_readme.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Veriyi DataFrame'e Dönüştür
skills = []
for item in data:
    for skill in item["skills"]:
        skills.append({"subfield": item["subfield"], "skill": skill["name"], "frequency": skill["frequency"]})

df = pd.DataFrame(skills)

# ✅ 1. Popüler Beceriler Analizi
popular_skills = df.groupby("skill")["frequency"].sum().sort_values(ascending=False).head(20)
plt.figure(figsize=(12, 6))
popular_skills.plot(kind='bar', color='skyblue')
plt.title("En Popüler 20 Beceri")
plt.xlabel("Beceriler")
plt.ylabel("Frekans")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# ✅ 2. Alt Alanlara Göre Beceri Dağılımı
subfield_counts = df['subfield'].value_counts()
plt.figure(figsize=(12, 6))
subfield_counts.plot(kind='bar', color='orange')
plt.title("Alt Alanlara Göre Beceri Dağılımı")
plt.xlabel("Alt Alanlar")
plt.ylabel("Beceri Sayısı")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# ✅ 3. Belli Bir Alt Alandaki En Popüler Beceriler
ai_skills = df[df['subfield'] == "Yapay Zeka"].sort_values(by="frequency", ascending=False).head(10)
plt.figure(figsize=(12, 6))
plt.barh(ai_skills['skill'], ai_skills['frequency'], color='purple')
plt.title("Yapay Zeka Alt Alanındaki En Popüler 10 Beceri")
plt.xlabel("Frekans")
plt.ylabel("Beceriler")
plt.tight_layout()
plt.show()

# ✅ 4. Heatmap (Alt Alanlar Arası Beceri Karşılaştırması)
skill_matrix = df.pivot_table(index='skill', columns='subfield', values='frequency', aggfunc='sum', fill_value=0)
plt.figure(figsize=(14, 8))
sns.heatmap(skill_matrix, cmap='YlGnBu')
plt.title("Alt Alanlar Arası Beceri Yoğunluğu (Heatmap)")
plt.show()

# ✅ 5. Kullanıcıdan Beceri Alarak Alt Alan Önerisi
user_skills = input("\nBildiğiniz becerileri virgülle ayırarak girin (Örn: python, tensorflow, docker): ").split(",")
suggested_subfields = df[df['skill'].str.lower().isin([skill.strip().lower() for skill in user_skills])]
recommended = suggested_subfields['subfield'].value_counts().idxmax()
print(f"\n✅ Size önerilen alt alan: {recommended}")
