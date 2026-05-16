from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import numpy as np
import re

from .news_service import get_ticker_news

router = APIRouter(prefix="/sentiment", tags=["sentiment"])

_model = None


def set_model(m):
    global _model
    _model = m


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


def _score_texts(texts: list[str]) -> list[dict]:
    # Ensure model is available
    if _model is None:
        raise RuntimeError("Sentiment model not initialized")

    cleaned = [clean_text(t) for t in texts]
    if not cleaned:
        return []
    
    try:
        predictions = _model.predict(cleaned)
        probabilities = _model.predict_proba(cleaned)
        
        results = []
        for text, pred, probs in zip(cleaned, predictions, probabilities):
            # scikit-learn classes are ordered: ['negative', 'neutral', 'positive']
            results.append({
                "sentiment":  str(pred),
                "confidence": float(np.max(probs)),
                "scores": {
                    "negative": float(probs[0]),
                    "neutral":  float(probs[1]),
                    "positive": float(probs[2]),
                },
            })
        return results
    except Exception as e:
        print(f"Prediction error: {e}")
        return []


def _calculate_summary(scored_results: list[dict]) -> dict:
    if not scored_results:
        return {
            "sentiment": "Neutral",
            "score": 0.0,
            "index": 50.0,
            "confidence": 0.0,
            "distribution": {"bullish": 0, "neutral": 0, "bearish": 0},
            "total_analyzed": 0
        }

    total_score = 0.0
    total_confidence = 0.0
    pos_count = 0
    neu_count = 0
    neg_count = 0

    for r in scored_results:
        conf = r["confidence"]
        total_confidence += conf
        
        # Weighted score: positive adds, negative subtracts, neutral is near 0
        if r["sentiment"] == "positive":
            total_score += conf
            pos_count += 1
        elif r["sentiment"] == "negative":
            total_score -= conf
            neg_count += 1
        else:
            neu_count += 1

    count = len(scored_results)
    avg_score = total_score / count
    avg_confidence = total_confidence / count

    # Map -1..1 score to 0..100 index
    # (avg_score + 1) / 2 * 100
    sentiment_index = round((avg_score + 1) / 2 * 100, 2)
    
    # Determine label
    if sentiment_index > 60:
        label = "Bullish"
    elif sentiment_index < 40:
        label = "Bearish"
    else:
        label = "Neutral"

    return {
        "sentiment": label,
        "score": round(avg_score, 4),
        "index": sentiment_index,
        "confidence": round(avg_confidence, 4),
        "distribution": {
            "bullish": pos_count,
            "neutral": neu_count,
            "bearish": neg_count
        },
        "total_analyzed": count
    }


class TickerSentimentRequest(BaseModel):
    ticker: str
    limit: Optional[int] = 20


@router.post("/ticker")
def sentiment_by_ticker(request: TickerSentimentRequest):
    if not request.ticker:
        raise HTTPException(status_code=400, detail="ticker is required")

    ticker = request.ticker.upper()
    limit  = min(request.limit or 20, 50)

    try:
        articles = get_ticker_news(ticker)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"News service error: {str(e)}")

    if not articles:
        raise HTTPException(status_code=404, detail=f"No news found for {ticker}")

    articles_to_score = articles[:limit]
    
    # Combine Headline and Summary as per training data
    combined_texts = []
    for a in articles_to_score:
        h = str(a.get("headline") or "").strip()
        s = str(a.get("summary") or "").strip()
        combined = f"{h}. {s}" if s else h
        combined_texts.append(combined)

    try:
        scored = _score_texts(combined_texts)
        if not scored:
            raise ValueError("Model failed to score news texts")
            
        summary = _calculate_summary(scored)

        return {
            "status": "success",
            "ticker": ticker,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sentiment analysis failed: {str(e)}")
