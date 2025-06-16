import pandas as pd
import os
import openai
import os
from dotenv import load_dotenv
EXCEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "tuik_dosyalar"))

excel_data = {}
load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
for filename in os.listdir(EXCEL_DIR):
    if filename.endswith(".xls") or filename.endswith(".xlsx"):
        file_path = os.path.join(EXCEL_DIR, filename)
        try:
            df = pd.read_excel(file_path, header=4)
            df.columns = [str(col).strip() for col in df.columns]
            df.dropna(how="all", inplace=True)  # Tamamen boş satırları at
            excel_data[filename] = df
            print(f"✅ Yüklendi: {filename} ({df.shape})")
        except Exception as e:
            print(f"⚠️ Hata ({filename}): {e}")

def query_excel_tables(message: str):
    message_lower = message.lower()

    for filename, df in excel_data.items():
        try:
            row_headers = df.iloc[:, 0].astype(str).str.lower()

            for row_idx, row_header in enumerate(row_headers):
                if any(word in row_header for word in message_lower.split()):
                    for col in df.columns[1:]:
                        if any(word in col.lower() for word in message_lower.split()):
                            value = df.iloc[row_idx][col]
                            if pd.notna(value):
                                return f"📊 {col} yılında \"{df.iloc[row_idx][0]}\" için değer: {value}\nKaynak: {filename}"
        except Exception:
            continue
    return None

def extract_excel_as_text(limit_rows=20):
    combined_text = ""
    for filename, df in excel_data.items():
        try:
            df_cleaned = df.dropna(axis=1, how="all").dropna(axis=0, how="all")
            markdown = df_cleaned.head(limit_rows).to_markdown(index=False)
            combined_text += f"\n📁 {filename}\n{markdown}\n"
        except Exception as e:
            continue
    return combined_text
