from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import yfinance as yf
from datetime import datetime, timedelta
import joblib
from flask_cors import CORS
import os

app = Flask(__name__)

# CORS(app, origins="http://localhost:5173") 
CORS(app, origins=["http://localhost:5173", "http://localhost:8000"])

# Global variables
model = None
scaler = None
features = ['Close', 'Volume', 'SMA_50', 'RSI', 'MACD']
window_size = 60

# ----------------------------------------
# Technical indicators
# ----------------------------------------
def calculate_RSI(series, period=14):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    RS = gain / loss
    RSI = 100 - (100 / (1 + RS))
    return RSI

def calculate_MACD(series):
    ema12 = series.ewm(span=12, adjust=False).mean()
    ema26 = series.ewm(span=26, adjust=False).mean()
    return ema12 - ema26

# ----------------------------------------
# Load Model & Scaler
# ----------------------------------------
def load_model():
    global model, scaler
    try:
        model_path = 'model/multivariate_lstm_model.h5'
        scaler_path = 'scaler.save'

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
        if not os.path.exists(scaler_path):
            raise FileNotFoundError(f"Scaler file not found at {scaler_path}")

        model = tf.keras.models.load_model(model_path, compile=False)
        scaler = joblib.load(scaler_path)
        print("✅ Model and scaler loaded successfully.")
    except Exception as e:
        print("❌ Error loading model or scaler:", e)

# ----------------------------------------
# Prepare Data for Prediction
# ----------------------------------------
def prepare_data(ticker, start_date, end_date):
    df = yf.download(ticker, start=start_date, end=end_date)

    # If columns are multi-level (e.g., ('Close', 'AAPL')), flatten them
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df.reset_index()  # Move 'Date' from index to a column

    # Keep only needed columns
    df = df[['Date', 'Close', 'Volume']]

    df['SMA_50'] = df['Close'].rolling(window=50).mean()
    df['RSI'] = calculate_RSI(df['Close'], period=14)
    df['MACD'] = calculate_MACD(df['Close'])

    df.dropna(inplace=True)
    df.reset_index(drop=True, inplace=True)

    return df



# ----------------------------------------
# Predict route for handling requests
# ----------------------------------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if model and scaler are loaded
        if model is None or scaler is None:
            return jsonify({'status': 'error', 'message': 'Model or scaler not loaded.'})

        # Get the input data from the request
        data = request.get_json()
        ticker = data.get('ticker', 'AAPL')
        days_to_predict = int(data.get('days', 3))  # Default to 3 if no "days" field is provided

        # ----------------------------------------
        # Define start and end dates for the prediction period
        # ----------------------------------------
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=100 + days_to_predict + window_size)

        # Prepare the data
        df = prepare_data(ticker, start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))

        # ----------------------------------------
        # Get yesterday's, today's, and two days back data
        # ----------------------------------------
        yesterday = end_date - timedelta(days=1)
        two_days_back = end_date - timedelta(days=2)
        df['Date'] = pd.to_datetime(df['Date']).dt.date  # Ensure 'Date' column is in date format

        # Get yesterday's, today's, and two days back data
        yesterday_row = df[df['Date'] == yesterday]
        two_days_back_row = df[df['Date'] == two_days_back]
        today_row = df[df['Date'] == end_date]

        # Set actual prices
        yesterday_price = round(float(yesterday_row.iloc[0]['Close']), 2) if not yesterday_row.empty else None
        two_days_back_price = round(float(two_days_back_row.iloc[0]['Close']), 2) if not two_days_back_row.empty else None
        today_price = round(float(today_row.iloc[0]['Close']), 2) if not today_row.empty else None

        # ----------------------------------------
        # Generate prediction dates starting from tomorrow
        # ----------------------------------------
        start_prediction_date = end_date + timedelta(days=1)
        prediction_dates = [start_prediction_date + timedelta(days=i) for i in range(days_to_predict)]
        prediction_dates = [d.strftime('%Y-%m-%d') for d in prediction_dates]

        # Scale data and prepare the window for prediction
        data = df[features].values
        scaled_data = scaler.transform(data)

        last_window = scaled_data[-window_size:]
        last_window = np.expand_dims(last_window, axis=0)

        predictions = []
        current_window = last_window.copy()

        # ----------------------------------------
        # Predict future values
        # ----------------------------------------
        for _ in range(days_to_predict):
            next_pred_scaled = model.predict(current_window, verbose=0)

            next_row_scaled = np.zeros((1, len(features)))
            next_row_scaled[0, 0] = next_pred_scaled[0, 0]
            next_row_scaled[0, 1:] = current_window[0, -1, 1:]

            predictions.append(next_row_scaled)

            current_window = np.append(current_window[:, 1:, :], [next_row_scaled], axis=1)

        # Inverse transform predictions
        predicted_prices = []
        for pred in predictions:
            dummy = np.zeros((1, len(features)))
            dummy[0, :] = pred[0]
            predicted_price = scaler.inverse_transform(dummy)[0, 0]
            predicted_prices.append(predicted_price)

        # ----------------------------------------
        # Build response with actual and predicted data
        # ----------------------------------------
        response_predictions = []

        # Include actual data for yesterday, today, and two days back
        if yesterday_price is not None:
            response_predictions.append({
                'date': yesterday.strftime('%Y-%m-%d'),
                'price': yesterday_price,
                'type': 'actual'
            })

        if two_days_back_price is not None:
            response_predictions.append({
                'date': two_days_back.strftime('%Y-%m-%d'),
                'price': two_days_back_price,
                'type': 'actual'
            })

        if today_price is not None:
            response_predictions.append({
                'date': end_date.strftime('%Y-%m-%d'),
                'price': today_price,
                'type': 'actual'
            })

        # Add predicted prices
        for d, p in zip(prediction_dates, predicted_prices):
            response_predictions.append({
                'date': d,
                'price': round(p, 2),
                'type': 'predicted'
            })

        return jsonify({
            'ticker': ticker,
            'predictions': response_predictions,
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# ----------------------------------------
# Historical Data Endpoint
# ----------------------------------------
@app.route('/historical', methods=['POST'])
def historical():
    try:
        data = request.get_json()
        ticker = data.get('ticker', 'AAPL')
        start_date = data.get('start_date', '2015-01-01')
        end_date = data.get('end_date', datetime.now().strftime('%Y-%m-%d'))

        df = prepare_data(ticker, start_date, end_date)

        # Ensure 'Date' is datetime
        df['Date'] = pd.to_datetime(df['Date']) 
        print(df.dtypes)
        print(df.head())


        # Build response
        historical_data = []
        for i in range(len(df)):
            row = df.iloc[i]
            print(type(row['Date']), row['Date'])
            historical_data.append({
                'date': row['Date'].strftime('%Y-%m-%d'),
                'close': round(float(row['Close']), 2),
                'volume': int(row['Volume']),
                'sma_50': round(float(row['SMA_50']), 2),
                'rsi': round(float(row['RSI']), 2),
                'macd': round(float(row['MACD']), 2)
            })

        return jsonify({
            'ticker': ticker,
            'historical_data': historical_data,
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})


# ----------------------------------------
# App Entry Point
# ----------------------------------------
if __name__ == '__main__':
    load_model()
    app.run(debug=True, port=5000)
