from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import r2_score
from sklearn.metrics import mean_absolute_error
import yfinance as yf
from datetime import datetime, timedelta
import joblib
from flask_cors import CORS
import os

app = Flask(__name__)
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

def create_sequences(dataset, window_size):
    X, y = [], []
    for i in range(window_size, len(dataset)):
        X.append(dataset[i-window_size:i])
        y.append(dataset[i, 0])  # Predicting Close price (first column)
    return np.array(X), np.array(y)

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

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df.reset_index()
    df = df[['Date', 'Close', 'Volume']]

    df['SMA_50'] = df['Close'].rolling(window=50).mean()
    df['RSI'] = calculate_RSI(df['Close'], period=14)
    df['MACD'] = calculate_MACD(df['Close'])
    df.dropna(inplace=True)
    df.reset_index(drop=True, inplace=True)
    return df

# ----------------------------------------
# API Endpoints
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


        if today_price is not None:
            response_predictions.append({
                'date': end_date.strftime('%Y-%m-%d'),
                'price': today_price,
                'type': 'actual'
            })

        if two_days_back_price is not None:
            response_predictions.append({
                'date': two_days_back.strftime('%Y-%m-%d'),
                'price': two_days_back_price,
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

@app.route('/model_results', methods=['POST'])
def model_results():
    try:
        data = request.get_json()
        ticker = data.get('ticker', 'META')

        if model is None or scaler is None:
            return jsonify({'status': 'error', 'message': 'Model not loaded'})

        today = pd.to_datetime('today').normalize()
        df = prepare_data(ticker, '2015-01-01', today.strftime('%Y-%m-%d'))
        data = df[features].values
        scaled_data = scaler.transform(data)

        X, y = create_sequences(scaled_data, window_size)
        train_size = int(len(X) * 0.8)
        X_train, y_train = X[:train_size], y[:train_size]
        X_test, y_test = X[train_size:], y[train_size:]

        # Predict test set
        pred_scaled = model.predict(X_test)

        dummy = np.zeros((len(pred_scaled), len(features)))
        dummy[:, 0] = pred_scaled[:, 0]
        predicted = scaler.inverse_transform(dummy)[:, 0]

        # Actual test values
        dummy_true = np.zeros((len(y_test), len(features)))
        dummy_true[:, 0] = y_test
        actual = scaler.inverse_transform(dummy_true)[:, 0]

        # Actual training values
        dummy_train = np.zeros((len(y_train), len(features)))
        dummy_train[:, 0] = y_train
        train_actual = scaler.inverse_transform(dummy_train)[:, 0]

        # Predict tomorrow
        last_sequence = scaled_data[-window_size:]
        last_sequence = np.expand_dims(last_sequence, axis=0)
        pred_tomorrow_scaled = model.predict(last_sequence)
        dummy_tomorrow = np.zeros((1, len(features)))
        dummy_tomorrow[0, 0] = pred_tomorrow_scaled[0, 0]
        predicted_tomorrow = scaler.inverse_transform(dummy_tomorrow)[0, 0]
        tomorrow_date = (today + timedelta(days=1)).strftime('%Y-%m-%d')

        r_squared = r2_score(actual, predicted)
        dates_train = df['Date'].iloc[window_size:window_size + train_size].dt.strftime('%Y-%m-%d').tolist()
        dates_test = df['Date'].iloc[window_size + train_size:].dt.strftime('%Y-%m-%d').tolist()

        # Append tomorrow's prediction to predicted prices and date
        predicted_prices = [float(price) for price in predicted] + [float(predicted_tomorrow)]
        predicted_dates = dates_test + [tomorrow_date]

        return jsonify({
            'status': 'success',
            'ticker': ticker,
            'r_squared': r_squared,
            'train_dates': dates_train,
            'train_prices': [float(price) for price in train_actual],
            'test_dates': dates_test,
            'test_prices': [float(price) for price in actual],
            'actual_prices': [float(price) for price in actual],  # actuals end today
            'predicted_prices': predicted_prices,                 # includes tomorrow
            'predicted_dates': predicted_dates,                   # includes tomorrow
            'train_test_split_date': str(dates_train)
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})


if __name__ == '__main__':
    load_model()
    app.run(debug=True, port=5000)