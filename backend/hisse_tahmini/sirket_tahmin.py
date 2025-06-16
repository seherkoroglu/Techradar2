import pandas as pd
from statsmodels.tsa.holtwinters import Holt
from sklearn.metrics import mean_squared_error
from datetime import timedelta
import numpy as np

# Excel dosyasını oku
df = pd.read_excel("Stocks_Data_10yrs.xlsx", sheet_name="Companies_Stocks", engine="openpyxl")
tickers = df["Ticker"].unique()
all_forecasts = []

for ticker in tickers:
    df_ticker = df[df["Ticker"] == ticker].copy()
    df_ticker["date"] = pd.to_datetime(df_ticker["Date"])
    df_ticker = df_ticker.sort_values("date")

    if df_ticker["Close"].nunique() < 3 or len(df_ticker) < 50:
        print(f"⚠️ {ticker} için yeterli çeşitlilik yok, atlandı.")
        continue

    try:
        model = Holt(df_ticker["Close"]).fit()
        forecast = model.forecast(steps=1095)

        # Gerçek ve tahmin karşılaştırması için RMSE hesapla
        train_pred = model.fittedvalues
        rmse = np.sqrt(mean_squared_error(df_ticker["Close"], train_pred))

        last_date = df_ticker["date"].max()
        future_dates = [last_date + timedelta(days=i+1) for i in range(1095)]

        for date, price in zip(future_dates, forecast):
            all_forecasts.append({
                "date": date.strftime("%Y-%m-%d"),
                "predicted_price": round(price, 2),
                "lower_bound": round(price - 1.96 * rmse, 2),
                "upper_bound": round(price + 1.96 * rmse, 2),
                "ticker": ticker
            })

    except Exception as e:
        print(f"❌ {ticker} modeli çalıştırılamadı: {e}")
        continue

# JSON çıktısı
final_df = pd.DataFrame(all_forecasts)
final_df.to_json("stock_forecasts_3yearsyeni.json", orient="records", lines=True)

print("✅ Güven aralıklı tahminler kaydedildi → stock_forecasts_3yearsyeni.json")
