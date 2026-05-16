import sys
import os
from pathlib import Path
import joblib

# Add the current directory to sys.path
sys.path.append(str(Path(__file__).parent))

from .sentiment_routes import sentiment_by_ticker, set_model
from pydantic import BaseModel

class MockRequest:
    def __init__(self, ticker, limit=20):
        self.ticker = ticker
        self.limit = limit

MODEL_PATH = Path(__file__).parent.parent / "data" / "models" / "svm_sentiment_model.pkl"
model = joblib.load(MODEL_PATH)
set_model(model)

try:
    print("Testing sentiment_by_ticker('TSLA')...")
    # Simulate a Pydantic model
    class TickerSentimentRequest(BaseModel):
        ticker: str
        limit: int = 20

    request = TickerSentimentRequest(ticker="TSLA")
    result = sentiment_by_ticker(request)
    print(f"Success! Result: {result['summary']}")
except Exception as e:
    print(f"Failed: {e}")
    import traceback
    traceback.print_exc()
