import requests
from datetime import datetime
import pandas as pd
from ..utils.cache import CacheManager
from ..utils.market import MarketCalendar
from ..utils.rate_limit import rate_limited
from ..config import Config
from .. import app

class DataService:
    def __init__(self):
        self.cache = CacheManager()
        self.market = MarketCalendar()

    @rate_limited
    def fetch_twelve_data_time_series(self, ticker, start_date=None, end_date=None):
        """Fetch time series data from Twelve Data API"""
        try:
            params = {
                "symbol": ticker,
                "interval": "1day",
                "apikey": Config.TWELVE_DATA_API_KEY,
                "outputsize": "5000"
            }
            if start_date:
                params["start_date"] = start_date
            if end_date:
                params["end_date"] = end_date

            response = requests.get(
                f"{Config.TWELVE_DATA_BASE_URL}/time_series",
                params=params,
                timeout=30
            )
            response.raise_for_status()
            data = response.json()

            if data.get("status") == "error":
                raise ValueError(f"API Error: {data.get('message', 'Unknown error')}")

            df = pd.DataFrame([{
                "Date": pd.to_datetime(item["datetime"]),
                "Open": float(item["open"]),
                "High": float(item["high"]),
                "Low": float(item["low"]),
                "Close": float(item["close"]),
                "Volume": int(item["volume"]) if item["volume"] else 0
            } for item in data.get("values", [])])

            return df.sort_values("Date").reset_index(drop=True)

        except Exception as e:
            app.logger.error(f"Error fetching data for {ticker}: {e}")
            raise

    def fetch_realtime_quote(self, ticker):
        """Fetch real-time quote with fallback"""
        try:
            # Try Twelve Data first
            params = {
                "symbol": ticker.upper(),
                "apikey": Config.TWELVE_DATA_API_KEY
            }
            response = requests.get(
                f"{Config.TWELVE_DATA_BASE_URL}/quote",
                params=params,
                timeout=10
            )
            response.raise_for_status()
            data = response.json()

            if data.get("status") == "error":
                raise ValueError(data.get("message", "Unknown error"))

            return {
                "Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "Open": float(data["open"]),
                "High": float(data["high"]),
                "Low": float(data["low"]),
                "Close": float(data["close"]),
                "Volume": 0
            }

        except Exception as primary_error:
            try:
                # Fallback to Finnhub
                if not Config.FINNHUB_KEY:
                    raise ValueError("No Finnhub API key configured")

                response = requests.get(
                    f"https://finnhub.io/api/v1/quote?symbol={ticker}&token={Config.FINNHUB_KEY}",
                    timeout=10
                )
                response.raise_for_status()
                data = response.json()

                return {
                    "Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "Open": data["o"],
                    "High": data["h"],
                    "Low": data["l"],
                    "Close": data["c"],
                    "Volume": 0
                }

            except Exception as fallback_error:
                raise RuntimeError(
                    f"Failed to fetch quote from both APIs for {ticker}\n"
                    f"Twelve Data error: {str(primary_error)}\n"
                    f"Finnhub error: {str(fallback_error)}"
                )

    def fetch_full_history(self, ticker):
        """Fetch data with caching fallback"""
        ticker = ticker.upper()
        cached_data, _ = self.cache.get_cached_data(ticker)

        try:
            df = self.fetch_twelve_data_time_series(ticker, Config.START_DATE)
            self.cache.update_cache(ticker, df)
            return df
        except Exception as e:
            if cached_data is not None:
                app.logger.warning(f"Using cached data for {ticker}: {str(e)}")
                return cached_data
            raise RuntimeError(f"No cached data and API failed: {str(e)}")

    @rate_limited
    def _fetch_from_api(self, ticker):
        """Actual API implementation"""
        try:
            # Try Twelve Data first
            params = {
                "symbol": ticker,
                "apikey": Config.TWELVE_DATA_API_KEY
            }
            
            response = requests.get(
                f"{Config.TWELVE_DATA_BASE_URL}/quote",
                params=params,
                timeout=10
            )
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status") == "error":
                raise ValueError(data.get("message", "Unknown error"))
            
            return {
                "Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "Open": float(data["open"]),
                "High": float(data["high"]),
                "Low": float(data["low"]),
                "Close": float(data["close"]),
                "Volume": 0  # Volume not available in quote endpoint
            }
            
        except Exception as e:
            # Fallback to Finnhub
            try:
                response = requests.get(
                    f"https://finnhub.io/api/v1/quote?symbol={ticker}&token={Config.FINNHUB_KEY}",
                    timeout=10
                )
                response.raise_for_status()
                data = response.json()
                
                return {
                    "Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "Open": data["o"],
                    "High": data["h"],
                    "Low": data["l"],
                    "Close": data["c"],
                    "Volume": 0
                }
            except Exception as fallback_error:
                raise RuntimeError(
                    f"Failed to fetch quote from both Twelve Data and Finnhub for {ticker}: "
                    f"Primary error: {e}, Fallback error: {fallback_error}"
                )