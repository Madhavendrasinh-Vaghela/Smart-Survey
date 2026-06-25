from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from typing import List

app = FastAPI()

print("Loading BART model...")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
print("Model loaded")

class AnalyzeRequest(BaseModel):
    surveyId: str
    responses: List[str]

def is_meaningful(text: str) -> bool:
    """Filter out ratings, numbers, single words"""
    text = text.strip()
    if not text:
        return False
    # Skip if it's just a number (ratings like "1","2","3","4","5")
    if text.isdigit():
        return False
    # Skip very short answers (less than 3 words)
    if len(text.split()) < 3:
        return False
    return True

@app.post("/analyze")
def analyze(data: AnalyzeRequest):
    # Filter only meaningful text answers
    meaningful = [r for r in data.responses if is_meaningful(r)]

    # If no meaningful text answers, generate a rating summary instead
    if not meaningful:
        numbers = []
        for r in data.responses:
            try:
                numbers.append(float(r.strip()))
            except:
                pass

        if numbers:
            avg = sum(numbers) / len(numbers)
            summary = (
                f"Survey received {len(data.responses)} responses. "
                f"The average rating across all questions was {avg:.1f} out of 5. "
                f"Ratings ranged from {int(min(numbers))} to {int(max(numbers))}. "
                f"Overall sentiment appears {'positive' if avg >= 3.5 else 'neutral' if avg >= 2.5 else 'negative'}."
            )
        else:
            summary = f"Survey received {len(data.responses)} responses. No detailed text feedback was provided."

        return {
            "surveyId": data.surveyId,
            "totalResponses": len(data.responses),
            "summary": summary
        }

    # Combine meaningful text answers
    combined = ". ".join(meaningful)

    # Chunk into 900-char pieces for BART
    chunk_size = 900
    chunks = [combined[i:i+chunk_size] for i in range(0, len(combined), chunk_size)]

    summaries = []
    for i, chunk in enumerate(chunks):
        if len(chunk.split()) < 10:
            summaries.append(chunk)
            continue
        print(f"Summarizing chunk {i+1}/{len(chunks)}")
        result = summarizer(
            chunk,
            max_length=150,
            min_length=40,
            do_sample=False
        )
        summaries.append(result[0]["summary_text"])

    final_summary = " ".join(summaries)

    # If multiple chunks, summarize the summaries
    if len(summaries) > 1 and len(final_summary.split()) > 50:
        print("Creating final combined summary...")
        result = summarizer(
            final_summary,
            max_length=180,
            min_length=60,
            do_sample=False
        )
        final_summary = result[0]["summary_text"]

    return {
        "surveyId": data.surveyId,
        "totalResponses": len(data.responses),
        "summary": final_summary
    }