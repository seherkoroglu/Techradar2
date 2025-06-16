from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time
import random

# Başlat
options = webdriver.ChromeOptions()
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Aranacak Anahtar Kelimeler
keywords = ['AI', 'Web Development', 'IoT', 'Android', 'iOS', 'Blockchain', 'Game Development', 'Unity', 'Cyber Security', 'Data Science', 'LLM', 'NLP']

# Verileri saklamak için liste
data = []

# Sayfa gezintisi
for keyword in keywords:
    for page in range(1, 6):  # İlk 5 sayfa
        url = f"https://github.com/search?q={keyword}&type=repositories&p={page}"
        driver.get(url)
        time.sleep(random.uniform(5, 15))  # Rastgele bekleme süresi

        try:
            repos = driver.find_elements(By.XPATH, "//div[@class='Box-sc-g0xbh4-0 jgRnBg']")

            for repo in repos:
                try:
                    name = repo.find_element(By.XPATH, ".//h3/div/div[2]/a").text
                    stars = repo.find_element(By.XPATH, ".//ul/li[2]/a").text
                    description = repo.find_element(By.XPATH, ".//div[1]/span").text
                    language = repo.find_element(By.XPATH, ".//ul/li[1]/span").text
                    updated_at = repo.find_element(By.XPATH, ".//ul/li[3]/span").text

                    data.append([name, stars, description, language, updated_at, keyword])
                except:
                    continue

        except Exception as e:
            print(f"Hata: {str(e)} - 60 saniye bekleniyor...")
            time.sleep(60)  # Rate limit hatasında 60 saniye bekle ve devam et

# Verileri CSV'ye kaydet
df = pd.DataFrame(data, columns=['Project Name', 'Stars', 'Description', 'Language', 'Last Updated', 'Keyword'])
df.to_csv('github_search_data.csv', index=False)

print("✅ Veriler başarıyla CSV dosyasına kaydedildi.")
driver.quit()
