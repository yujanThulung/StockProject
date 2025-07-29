

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room
import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import os, json, requests, time, threading
from io import StringIO
from datetime import datetime, timedelta
from dotenv import load_dotenv
import pandas_market_calendars as mcal
import websocket
import threading
import queue
import time


load_dotenv()

# ─── Flask + SocketIO setup ─────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:8000"])
socketio = SocketIO(app, cors_allowed_origins="*")


# Configure Socket.IO with CORS
socketio = SocketIO(
    app,
    cors_allowed_origins="*",  # Allow all origins (or specify ["http://localhost:5173"])
    logger=True,  # Debugging
    engineio_logger=True  # More debugging
)


# ─── Twelve Data API Constants ──────────────────────────────────────────────
TWELVE_DATA_API_KEY = os.getenv("TWELVE_DATA_API_KEY")
TWELVE_DATA_BASE_URL = "https://api.twelvedata.com"

# ─── Other Constants ────────────────────────────────────────────────────────
FINNHUB_KEY = os.getenv("FINNHUB_KEY")
START_DATE = os.getenv("START_DATE", "2015-01-01")
MODEL_PATH = os.getenv("MODEL_PATH", "multivariate_lstm_model.h5")
SCALER_PATH = os.getenv("SCALER_PATH", "scaler.save")
WINDOW_SIZE = int(os.getenv("WINDOW_SIZE", 60))
CACHE_DIR = "twelve_data_cache"
LAST_CHECKED = os.path.join(CACHE_DIR, "last_checked.json")
EXCHANGE_CAL = mcal.get_calendar("NYSE")

# ─── Rate Limiting ──────────────────────────────────────────────────────────
API_CALL_LOCK = threading.Lock()
LAST_API_CALL_TIME = 0
MIN_API_INTERVAL = 1  # Twelve Data allows more frequent calls on paid plans

def wait_for_rate_limit():
    """Ensure we don't exceed API rate limits"""
    global LAST_API_CALL_TIME
    with API_CALL_LOCK:
        current_time = time.time()
        time_since_last_call = current_time - LAST_API_CALL_TIME
        
        if time_since_last_call < MIN_API_INTERVAL:
            wait_time = MIN_API_INTERVAL - time_since_last_call
            print(f"Rate limiting: waiting {wait_time:.1f} seconds...")
            time.sleep(wait_time)
        
        LAST_API_CALL_TIME = time.time()

# ─── Helpers ─────────────────────────────────────────────────────────────────
def calculate_RSI(series, period=14):
    delta = series.diff()
    gain = delta.clip(lower=0).rolling(period).mean()
    loss = (-delta).clip(lower=0).rolling(period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def create_sequences(data, window):
    X, y = [], []
    for i in range(window, len(data)):
        X.append(data[i-window:i])
        y.append(data[i, 0])
    return np.array(X), np.array(y)

def load_last_checked():
    if not os.path.isdir(CACHE_DIR):
        os.makedirs(CACHE_DIR)
    if os.path.exists(LAST_CHECKED):
        try:
            return json.load(open(LAST_CHECKED))
        except:
            return {}
    return {}

def save_last_checked(d):
    try:
        json.dump(d, open(LAST_CHECKED, "w"), indent=2)
    except Exception as e:
        print(f"Error saving last_checked: {e}")

def fetch_twelve_data_time_series(ticker, start_date=None, end_date=None):
    """Fetch time series data from Twelve Data API"""
    try:
        wait_for_rate_limit()
        
        # Build the API URL
        url = f"{TWELVE_DATA_BASE_URL}/time_series"
        params = {
            "symbol": ticker,
            "interval": "1day",
            "apikey": TWELVE_DATA_API_KEY,
            "format": "JSON",
            "outputsize": "5000"  
        }
        
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
            
        print(f"Fetching data for {ticker} from Twelve Data...")
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        # Check for API errors
        if "status" in data and data["status"] == "error":
            raise ValueError(f"API Error: {data.get('message', 'Unknown error')}")
        
        if "code" in data and data["code"] in [400, 401, 429]:
            raise ValueError(f"API Error {data['code']}: {data.get('message', 'Unknown error')}")
        
        if "values" not in data or not data["values"]:
            raise ValueError(f"No data returned for {ticker}")
        
        # Convert to DataFrame
        df_data = []
        for item in data["values"]:
            df_data.append({
                "Date": pd.to_datetime(item["datetime"]),
                "Open": float(item["open"]),
                "High": float(item["high"]),
                "Low": float(item["low"]),
                "Close": float(item["close"]),
                "Volume": int(item["volume"]) if item["volume"] else 0
            })
        
        df = pd.DataFrame(df_data)
        df = df.sort_values("Date").reset_index(drop=True)
        
        print(f"Successfully fetched {len(df)} records for {ticker}")
        return df
        
    except requests.exceptions.RequestException as e:
        print(f"Network error fetching {ticker}: {e}")
        raise
    except ValueError as e:
        print(f"Data error for {ticker}: {e}")
        raise
    except Exception as e:
        print(f"Unexpected error fetching {ticker}: {e}")
        raise




def fetch_full_history(ticker):
    """Fetch full history with caching for Twelve Data"""
    cache_file = os.path.join(CACHE_DIR, f"{ticker}_FULL.csv")
    last_checked = load_last_checked()
    today = datetime.today().date()
    today_str = today.isoformat()
    
    print(f"\n=== Fetching history for {ticker} ===")
    
    try:
        # Get market calendar
        sched = EXCHANGE_CAL.schedule(
            start_date=START_DATE,
            end_date=today.isoformat()
        )
        market_days = set(sched.index.date)
        print(f"Market days from {START_DATE} to {today}: {len(market_days)}")
        
        # Check if today is a trading day
        today_is_trading_day = today in market_days
    except Exception as e:
        print(f"Market calendar error for {ticker}: {e}")
        # Fallback: use weekdays
        start_dt = datetime.strptime(START_DATE, "%Y-%m-%d").date()
        market_days = set()
        current_date = start_dt
        while current_date <= today:
            if current_date.weekday() < 5:  # Weekdays only
                market_days.add(current_date)
            current_date += timedelta(days=1)
        print(f"Using weekday fallback: {len(market_days)} days")
        today_is_trading_day = today.weekday() < 5  # Weekday fallback

    # Load cached data
    df_cached = pd.DataFrame()
    if os.path.exists(cache_file):
        try:
            df_cached = pd.read_csv(cache_file, parse_dates=["Date"])
            print(f"Loaded cached data for {ticker}: {len(df_cached)} records")
        except Exception as e:
            print(f"Error loading cache for {ticker}: {e}")
            df_cached = pd.DataFrame()

    # Check what dates we're missing
    have_dates = set(df_cached["Date"].dt.date if not df_cached.empty else [])
    missing_dates = sorted([d for d in market_days if d < today and d not in have_dates])
    
    print(f"Have {len(have_dates)} dates, missing {len(missing_dates)} dates")
    
    # Get the last cached date
    last_cached_date = df_cached["Date"].max().date() if not df_cached.empty else None

    # Only fetch today's data if:
    # 1. Today is a trading day AND
    # 2. We don't already have today's data AND
    # 3. Current time is after market close (4PM ET)
    now = datetime.now()
    market_close_time = datetime.combine(today, datetime.strptime("16:00", "%H:%M").time())
    should_fetch_today = (
        today_is_trading_day and
        (last_cached_date is None or last_cached_date < today) and
        now >= market_close_time
    )
    
    # Only fetch if we have missing historical dates or need today's data
    should_fetch = missing_dates or should_fetch_today
    
    if should_fetch:
        print(f"Fetching data for {ticker}...")
        
        try:
            # Fetch new data from Twelve Data
            start_date_str = START_DATE
            if not df_cached.empty:
                # Get data from last cached date to avoid duplicates
                last_cached_date = df_cached["Date"].max().date()
                start_date_str = (last_cached_date + timedelta(days=1)).isoformat()
            
            df_new = fetch_twelve_data_time_series(
                ticker, 
                start_date=start_date_str, 
                end_date=today_str
            )
            
            if not df_new.empty:
                # Combine with cached data
                df_combined = pd.concat([df_cached, df_new]).drop_duplicates("Date").sort_values("Date")
                df_combined.to_csv(cache_file, index=False)
                df_cached = df_combined
                print(f"Updated cache for {ticker}: {len(df_cached)} total records")
                
                # Only update last_checked if we actually fetched new data
                last_checked[ticker] = today_str
                save_last_checked(last_checked)
            else:
                print(f"No new data received for {ticker}")
                
        except Exception as e:
            print(f"Error fetching data for {ticker}: {e}")
            if df_cached.empty:
                raise RuntimeError(f"No cached data and API failed for {ticker}: {e}")
    else:
        print(f"Using cached data for {ticker}")

    # Filter and return final data
    result_df = df_cached[df_cached["Date"] >= START_DATE].reset_index(drop=True)
    print(f"Returning {len(result_df)} records for {ticker}")
    
    if result_df.empty:
        raise RuntimeError(f"No data available for {ticker} after filtering")
    
    return result_df

def fetch_twelve_data_quote(ticker):
    """Fetch real-time quote from Twelve Data"""
    try:
        wait_for_rate_limit()
        
        url = f"{TWELVE_DATA_BASE_URL}/quote"
        params = {
            "symbol": ticker,
            "apikey": TWELVE_DATA_API_KEY
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Check for API errors
        if "status" in data and data["status"] == "error":
            raise ValueError(f"Quote API Error: {data.get('message', 'Unknown error')}")
        
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return {
            "Date": now,
            "Open": float(data["open"]),
            "High": float(data["high"]),
            "Low": float(data["low"]),
            "Close": float(data["close"]),
        }
    except Exception as e:
        print(f"Error fetching Twelve Data quote for {ticker}: {e}")
        # Fallback to Finnhub
        return fetch_finnhub_quote(ticker)

def fetch_finnhub_quote(ticker):
    """Fallback to Finnhub for real-time quotes"""
    try:
        url = f"https://finnhub.io/api/v1/quote?symbol={ticker}&token={FINNHUB_KEY}"
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        js = r.json()
        
        # Check if we got valid data
        if js.get("c") == 0 and js.get("o") == 0:
            raise ValueError(f"Invalid quote data for {ticker}")
        
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return {
            "Date": now,
            "Open": js["o"],
            "High": js["h"],
            "Low": js["l"],
            "Close": js["c"],
        }
    except Exception as e:
        print(f"Error fetching Finnhub quote for {ticker}: {e}")
        raise

# ─── REST endpoints ───────────────────────────────────────────────────────────
@app.route("/debug/<ticker>", methods=["GET"])
def debug_ticker(ticker):
    """Debug endpoint to test individual tickers"""
    try:
        ticker = ticker.upper()
        print(f"\n=== DEBUG: Testing {ticker} ===")
        
        # Test the full fetch process
        df = fetch_full_history(ticker)
        
        return jsonify({
            "status": "success",
            "ticker": ticker,
            "data_shape": df.shape,
            "columns": list(df.columns),
            "date_range": {
                "start": df["Date"].min().isoformat(),
                "end": df["Date"].max().isoformat()
            },
            "sample_data": df.head(3).to_dict(orient="records"),
            "recent_data": df.tail(3).to_dict(orient="records")
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "ticker": ticker,
            "error": str(e),
            "error_type": type(e).__name__
        }), 500

@app.route("/historical", methods=["POST"])
def historical():
    print("Historical route called!")
    try:
        ticker = request.json.get("ticker", "PEP").upper()
        df = fetch_full_history(ticker)

        # Convert dates to string format
        df["Date"] = df["Date"].dt.strftime("%Y-%m-%d %H:%M:%S")
        records = df.to_dict(orient="records")

        # Try to append today's quote if available
        try:
            today_bar = fetch_twelve_data_quote(ticker)
            if not records or records[-1]["Date"][:10] != today_bar["Date"][:10]:
                records.append(today_bar)
        except Exception as e:
            print(f"Could not fetch today's quote for {ticker}: {e}")

        return jsonify({"status": "success", "historical": records})
    except Exception as e:
        print(f"Error in historical endpoint: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500




# For Testing it is working for 1 day 
@app.route("/predict", methods=["POST"])
def predict():
    try:
        ticker = request.json.get("ticker", "PEP").upper()
        if not os.path.exists(SCALER_PATH) or not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("Model or scaler missing")

        scaler = joblib.load(SCALER_PATH)
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)

        # STEP 1: Get historical data
        df = fetch_full_history(ticker)

        # ✅ STEP 2: Try to append today's quote if it's not already in DataFrame
        try:
            today = datetime.now().date()

            def is_market_open_today():
                today_ny = pd.Timestamp.now(tz="America/New_York").normalize()
                sched = EXCHANGE_CAL.schedule(start_date=today_ny, end_date=today_ny)
                return not sched.empty

            if is_market_open_today() and df["Date"].max().date() < today:
                today_bar = fetch_twelve_data_quote(ticker)
                today_df = pd.DataFrame([today_bar])
                today_df["Date"] = pd.to_datetime(today_df["Date"])
                
                # Fill in missing fields if needed
                if "Volume" not in today_df:
                    today_df["Volume"] = 1000000  # Default/fallback volume

                df = pd.concat([df, today_df], ignore_index=True).sort_values("Date").reset_index(drop=True)
                print(f"Appended today's data: {today_bar}")
        except Exception as e:
            print(f"Failed to append today's quote: {e}")


        # STEP 3: Calculate indicators
        df["SMA_50"] = df["Close"].rolling(50).mean()
        df["RSI"] = calculate_RSI(df["Close"])
        ema12 = df["Close"].ewm(span=12, adjust=False).mean()
        ema26 = df["Close"].ewm(span=26, adjust=False).mean()
        df["MACD"] = ema12 - ema26
        df["MACD_signal"] = df["MACD"].ewm(span=9, adjust=False).mean()

        df.dropna(inplace=True)
        df.reset_index(drop=True, inplace=True)
        if len(df) < WINDOW_SIZE + 10:
            raise ValueError("Not enough data after indicators")

        # STEP 4: Prepare features
        feats = ["Close", "Volume", "SMA_50", "RSI", "MACD"]
        raw = df[feats].values
        scaled_data = scaler.transform(raw)
        X, y = create_sequences(scaled_data, WINDOW_SIZE)

        # STEP 5: Split data
        split = int(len(X) * 0.8)
        X_train, y_train = X[:split], y[:split]
        X_test, y_test = X[split:], y[split:]

        dates = df["Date"].iloc[WINDOW_SIZE:].reset_index(drop=True)
        dates_train = dates.iloc[:len(y_train)].dt.strftime("%Y-%m-%d").tolist()
        dates_test = dates.iloc[len(y_train):].dt.strftime("%Y-%m-%d").tolist()

        # STEP 6: Make predictions
        p_scaled = model.predict(X_test)
        buf_p = np.zeros_like(scaled_data[:len(p_scaled)])
        buf_p[:, 0] = p_scaled[:, 0]
        pred = scaler.inverse_transform(buf_p)[:, 0]

        buf_t = np.zeros_like(scaled_data[:len(y_test)])
        buf_t[:, 0] = y_test
        actual = scaler.inverse_transform(buf_t)[:, 0]

        # STEP 7: Metrics
        r2 = r2_score(actual, pred)
        mae = mean_absolute_error(actual, pred)
        rmse = np.sqrt(mean_squared_error(actual, pred))
        stderr = np.std(actual - pred)

        # STEP 8: Next-day prediction
        last_win = scaled_data[-WINDOW_SIZE:].reshape(1, WINDOW_SIZE, len(feats))
        nxt_s = model.predict(last_win)
        buf2 = np.zeros((1, len(feats)))
        buf2[0, 0] = nxt_s[0, 0]
        nxt = scaler.inverse_transform(buf2)[0, 0]

        next_day = (pd.to_datetime(dates_test[-1]) + timedelta(days=1)).strftime("%Y-%m-%d")
        all_pred_dates = dates_test + [next_day]
        all_pred_prices = np.concatenate([pred, [nxt]]).tolist()

        return jsonify({
            "status": "success",
            "ticker": ticker,
            "r_squared": r2,
            "mae": mae,
            "rmse": rmse,
            "std_error": stderr,
            "train_dates": dates_train,
            "train_prices": scaler.inverse_transform(
                np.column_stack([y_train, np.zeros((len(y_train), len(feats)-1))])
            )[:, 0].tolist(),
            "test_dates": dates_test,
            "test_prices": actual.tolist(),
            "predicted_dates": all_pred_dates,
            "predicted_prices": all_pred_prices
        })

    except Exception as e:
        print(f"Error in predict endpoint: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    socketio.run(app, debug=True) 