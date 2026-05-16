from fastapi import APIRouter, HTTPException, Query
from .news_service import get_general_news, get_ticker_news

router = APIRouter(prefix="/news", tags=["news"])


@router.get("/latest")
def latest_news(limit: int = Query(default=20, ge=1, le=100)):
    try:
        articles = get_general_news()
        articles_sorted = sorted(articles, key=lambda x: x.get("datetime", 0), reverse=True)
        return {
            "status":   "success",
            "total":    len(articles_sorted),
            "articles": articles_sorted[:limit],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ticker/{ticker}")
def ticker_news(ticker: str, limit: int = Query(default=10, ge=1, le=50)):
    try:
        articles = get_ticker_news(ticker.upper())
        articles_sorted = sorted(articles, key=lambda x: x.get("datetime", 0), reverse=True)
        return {
            "status":   "success",
            "ticker":   ticker.upper(),
            "total":    len(articles_sorted),
            "articles": articles_sorted[:limit],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
