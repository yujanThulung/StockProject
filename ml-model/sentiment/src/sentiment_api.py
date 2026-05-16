from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List
import uvicorn
import re


app = FastAPI(title="Sentiment Analysis API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print ("Loading model...")
model = joblib.load('../data/models/svm_sentiment_model.pkl')
print("Model is ready!!!")

def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r'\$([a-zA-Z]{1,5})', r'ticker \1', text)
    text = re.sub(r'(\d+\.?\d*)\s*%', r'\1 percent', text)
    text = re.sub(r'\$[\d,.]+[bmk]?', 'dollar amount', text)
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


class SentimentRequest(BaseModel):
    texts: List[str]
    ticker: str = None

class SentimentResult(BaseModel):
    text:str
    sentiment: str
    confidence: float
    scores: dict

class SentimentResponse(BaseModel):
    ticker: str | None
    results: List[SentimentResult]
    summary: dict #overal sentiment count 


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model": "SVM Sentiment"
    }


@app.post("/sentiment", response_model = SentimentResponse)
def analyze_sentiment(request:SentimentRequest):

    if not request.texts:
        raise HTTPException(status_code=400, detail="tests list is empty")
    
    texts = [t.strip() for t in request.texts if t.strip()]
    texts = [clean_text(t) for t in texts]


    if not texts:
        raise HTTPException(status_code=400, detail= "No valid texts provided")

    try:
        predictions = model.predict(texts)
        probabilities = model.predict_proba(texts)

        class_names = ['negative','neutral','positive']

        results = []
        for text, pred, probs in zip(texts,predictions,probabilities):
            confidence = float(np.max(probs))

            results.append(SentimentResult(
                text=text,
                sentiment=pred,
                confidence=round(confidence, 4),
                scores={
                    "negative": round(float(probs[0]), 4),
                    "neutral": round(float(probs[1]), 4),
                    "positive": round(float(probs[2]), 4)
                }
            ))

            # Summary count
        summary = {
            "total": len(results),
            "positive": sum(1 for r in results if r.sentiment == "positive"),
            "neutral": sum(1 for r in results if r.sentiment == "neutral"),
            "negative": sum(1 for r in results if r.sentiment == "negative"),
            "overall": _get_overall_sentiment(results)
         }

        return SentimentResponse(
            ticker=request.ticker,
            results= results,
            summary= summary
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _get_overall_sentiment(results: List[SentimentResult]) -> str:
    score = 0

    for r in results:
        if r.sentiment == "positive":
            score += r.scores["positive"]
        elif r.sentiment == "negative":
            score -= r.scores["negative"]

    avg = score / len(results) if results else 0

    if avg > 0.1:
        return "positive"
    elif avg < -0.1:
        return "negative"
    else:
        return "neutral"

if __name__ == "__main__":
    port = 5000
    print(f"Local:   http://localhost:{port}/docs")
    uvicorn.run(app, host = "0.0.0.0", port = port)