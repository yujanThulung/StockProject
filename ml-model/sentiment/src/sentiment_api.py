from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import joblib
import numpy as np
import uvicorn
import re
from pathlib import Path

from .news_routes import router as news_router
from .sentiment_routes import router as sentiment_router, set_model, clean_text, _calculate_summary

MODEL_PATH = Path(__file__).parent.parent / "data" / "models" / "svm_sentiment_model.pkl"

print("Loading sentiment model...")
model = joblib.load(MODEL_PATH)
set_model(model)
print("Sentiment model ready")

app = FastAPI(title="Sentiment Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(news_router)
app.include_router(sentiment_router)


class SentimentRequest(BaseModel):
    texts: List[str]
    ticker: Optional[str] = None


@app.get("/health")
def health_check():
    return {"status": "ok", "model": "SVM Sentiment"}


@app.post("/sentiment")
def analyze_sentiment_bulk(request: SentimentRequest):
    if not request.texts:
        raise HTTPException(status_code=400, detail="texts list is empty")

    texts = [clean_text(t.strip()) for t in request.texts if t.strip()]
    if not texts:
        raise HTTPException(status_code=400, detail="No valid texts provided")

    try:
        predictions  = model.predict(texts)
        probabilities = model.predict_proba(texts)

        results = []
        for pred, probs in zip(predictions, probabilities):
            results.append({
                "sentiment": str(pred),
                "confidence": float(np.max(probs)),
                "scores": {
                    "negative": float(probs[0]),
                    "neutral":  float(probs[1]),
                    "positive": float(probs[2]),
                }
            })

        summary = _calculate_summary(results)
        return {
            "status": "success",
            "ticker": request.ticker,
            "summary": summary
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


if __name__ == "__main__":
    port = 5000
    print(f"Running at http://localhost:{port}/docs")
    uvicorn.run("sentiment_api:app", host="0.0.0.0", port=port, reload=False)
