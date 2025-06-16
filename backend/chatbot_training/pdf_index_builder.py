import fitz
import openai
import faiss
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

pdf_path = "2505.06120v1.pdf"
index_path = "arxiv_index.index"
chunks_txt = "arxiv_chunks.txt"

def extract_text(path):
    doc = fitz.open(path)
    return "\n".join([p.get_text() for p in doc])

def split_text(text, max_tokens=300):
    import tiktoken
    enc = tiktoken.get_encoding("cl100k_base")
    words = text.split(". ")
    chunks, chunk = [], ""
    for w in words:
        if len(enc.encode(chunk + w)) < max_tokens:
            chunk += w + ". "
        else:
            chunks.append(chunk.strip())
            chunk = w + ". "
    if chunk:
        chunks.append(chunk.strip())
    return chunks

def build_index(chunks):
    embeddings = []
    for chunk in chunks:
        response = client.embeddings.create(
            input=chunk,
            model="text-embedding-3-small"
        )
        embeddings.append(np.array(response.data[0].embedding, dtype="float32"))
    index = faiss.IndexFlatL2(len(embeddings[0]))
    index.add(np.array(embeddings))
    faiss.write_index(index, index_path)
    with open(chunks_txt, "w", encoding="utf-8") as f:
        for c in chunks:
            f.write(c + "\n")
    print("✅ Index oluşturuldu.")

if __name__ == "__main__":
    text = extract_text(pdf_path)
    chunks = split_text(text)
    build_index(chunks)
