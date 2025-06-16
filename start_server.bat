@echo off
cd backend
echo 🔴 Eski uvicorn server kapatılıyor...
taskkill /F /IM uvicorn.exe >nul 2>&1

echo 🧹 Cache dosyaları (.pyc) temizleniyor...
del /s /q *.pyc

echo 🚀 Server yeniden başlatılıyor...
uvicorn main:app --reload

pause

