from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from typing import List

app = FastAPI()

print("⏳ Loading BART model...")
summarizer = pipeline(
    "summarization",
    model="facebook/bart-base"
)
print("✅ Model loaded")


# ---------- CONFIG ----------
MAX_WORDS_PER_CHUNK = 400   # safe for BART
CHUNK_SUMMARY_MIN = 50
CHUNK_SUMMARY_MAX = 150
FINAL_SUMMARY_MIN = 80
FINAL_SUMMARY_MAX = 200
# ----------------------------


class AnalyzeRequest(BaseModel):
    surveyId: str
    responses: List[str]


def chunk_text(text: str, max_words: int):
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_words):
        chunk = " ".join(words[i:i + max_words])
        chunks.append(chunk)
    return chunks


def summarize_chunks(chunks: List[str]) -> List[str]:
    summaries = []
    for idx, chunk in enumerate(chunks):
        print(f"🧠 Summarizing chunk {idx + 1}/{len(chunks)}")
        result = summarizer(
            chunk,
            max_length=CHUNK_SUMMARY_MAX,
            min_length=CHUNK_SUMMARY_MIN,
            do_sample=False
        )
        summaries.append(result[0]["summary_text"])
    return summaries


@app.post("/analyze")
def analyze(data: AnalyzeRequest):
    # 1️⃣ Combine all responses
    combined_text = " ".join(data.responses)

    # 2️⃣ Split into chunks
    chunks = chunk_text(combined_text, MAX_WORDS_PER_CHUNK)
    print(f"🔹 Total chunks created: {len(chunks)}")

    # 3️⃣ Summarize each chunk
    chunk_summaries = summarize_chunks(chunks)

    # 4️⃣ Combine chunk summaries
    combined_summary_text = " ".join(chunk_summaries)

    # 5️⃣ Final summarization (summary of summaries)
    print("🔥 Creating final summary")
    final_summary = summarizer(
        combined_summary_text,
        max_length=FINAL_SUMMARY_MAX,
        min_length=FINAL_SUMMARY_MIN,
        do_sample=False
    )[0]["summary_text"]

    return {
        "surveyId": data.surveyId,
        "totalResponses": len(data.responses),
        "totalChunks": len(chunks),
        "summary": final_summary
    }
