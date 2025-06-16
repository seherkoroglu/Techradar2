FROM python:3.10

# Çalışma dizini
WORKDIR /app

# Gerekli dosyaları kopyala
COPY . .

# Gerekli paketleri yükle
RUN pip install --no-cache-dir -r requirements.txt

# Uvicorn ile çalıştır
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
