import os
import json
import requests
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
FINNHUB_BASE    = "https://finnhub.io/api/v1"

CACHE_DIR       = Path(__file__).parent.parent / "data" / "news_cache"
LAST_CHECKED    = CACHE_DIR / "last_checked.json"

TICKER_TTL_MINUTES  = 60
GENERAL_TTL_MINUTES = 30

CACHE_DIR.mkdir(parents=True, exist_ok=True)


def _load_last_checked() -> dict:
    if LAST_CHECKED.exists():
        try:
            return json.loads(LAST_CHECKED.read_text())
        except Exception:
            pass
    return {}


def _save_last_checked(data: dict):
    LAST_CHECKED.write_text(json.dumps(data, indent=2))


def _cache_file(key: str) -> Path:
    return CACHE_DIR / f"{key}.csv"


def _is_fresh(key: str, ttl_minutes: int) -> bool:
    checked = _load_last_checked()
    if key not in checked:
        return False
    last = datetime.fromisoformat(checked[key])
    return (datetime.now() - last) < timedelta(minutes=ttl_minutes)


def _read_cache(key: str) -> list[dict]:
    f = _cache_file(key)
    if not f.exists():
        return []
    try:
        df = pd.read_csv(f)
        # Handle NaN and Inf values which cause JSON serialization errors
        df = df.replace([np.inf, -np.inf], np.nan)
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient="records")
    except Exception:
        return []


def _write_cache(key: str, articles: list[dict]):
    if not articles:
        return
    df = pd.DataFrame(articles)
    df.to_csv(_cache_file(key), index=False)
    checked = _load_last_checked()
    checked[key] = datetime.now().isoformat()
    _save_last_checked(checked)


def _fetch_ticker_news_from_api(ticker: str) -> list[dict]:
    today     = datetime.now().strftime("%Y-%m-%d")
    from_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    resp = requests.get(
        f"{FINNHUB_BASE}/company-news",
        params={
            "symbol": ticker.upper(),
            "from":   from_date,
            "to":     today,
            "token":  FINNHUB_API_KEY,
        },
        timeout=10,
    )
    resp.raise_for_status()
    raw = resp.json()
    return [
        {
            "ticker":    ticker.upper(),
            "datetime":  item.get("datetime", 0),
            "headline":  item.get("headline", ""),
            "summary":   item.get("summary", ""),
            "source":    item.get("source", ""),
            "url":       item.get("url", ""),
            "image":     item.get("image", ""),
            "fetched_at": datetime.now().isoformat(),
        }
        for item in raw
        if item.get("headline")
    ]


def _fetch_general_news_from_api() -> list[dict]:
    resp = requests.get(
        f"{FINNHUB_BASE}/news",
        params={"category": "general", "token": FINNHUB_API_KEY},
        timeout=10,
    )
    resp.raise_for_status()
    raw = resp.json()
    return [
        {
            "ticker":    "general",
            "datetime":  item.get("datetime", 0),
            "headline":  item.get("headline", ""),
            "summary":   item.get("summary", ""),
            "source":    item.get("source", ""),
            "url":       item.get("url", ""),
            "image":     item.get("image", ""),
            "fetched_at": datetime.now().isoformat(),
        }
        for item in raw
        if item.get("headline")
    ]


def get_ticker_news(ticker: str) -> list[dict]:
    key = ticker.upper()
    if _is_fresh(key, TICKER_TTL_MINUTES):
        cached = _read_cache(key)
        if cached:
            return cached
    try:
        articles = _fetch_ticker_news_from_api(ticker)
        _write_cache(key, articles)
        return articles
    except Exception as e:
        print(f"Finnhub error for {ticker}: {e}")
        cached = _read_cache(key)
        if cached:
            print(f"Serving stale cache for {ticker}")
            return cached
        raise RuntimeError(f"No news available for {ticker}: {e}")


def get_general_news() -> list[dict]:
    key = "general"
    if _is_fresh(key, GENERAL_TTL_MINUTES):
        cached = _read_cache(key)
        if cached:
            return cached
    try:
        articles = _fetch_general_news_from_api()
        _write_cache(key, articles)
        return articles
    except Exception as e:
        print(f"Finnhub general news error: {e}")
        cached = _read_cache(key)
        if cached:
            print("Serving stale general news cache")
            return cached
        raise RuntimeError(f"No general news available: {e}")
