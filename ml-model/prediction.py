# from flask import Flask, request, jsonify
# import numpy as np
# import pandas as pd
# import tensorflow as tf
# from sklearn.preprocessing import MinMaxScaler
# from sklearn.metrics import r2_score
# from sklearn.metrics import mean_absolute_error
# import yfinance as yf
# from datetime import datetime, timedelta
# import joblib
# from flask_cors import CORS
# import os
# import traceback


# app = Flask(__name__)


# # Global variables
# model = None
# scaler = None
# features = ['Close', 'Volume', 'SMA_50', 'RSI', 'MACD']
# window_size = 60

# # ----------------------------------------
# # Technical indicators
# # ----------------------------------------
# def calculate_RSI(series, period=14):
#     delta = series.diff()
#     gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
#     loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
#     RS = gain / loss
#     RSI = 100 - (100 / (1 + RS))
#     return RSI

# def calculate_MACD(series):
#     ema12 = series.ewm(span=12, adjust=False).mean()
#     ema26 = series.ewm(span=26, adjust=False).mean()
#     return ema12 - ema26

# def create_sequences(dataset, window_size):
#     X, y = [], []
#     for i in range(window_size, len(dataset)):
#         X.append(dataset[i-window_size:i])
#         y.append(dataset[i, 0])  # Predicting Close price (first column)
#     return np.array(X), np.array(y)

# # ----------------------------------------
# # Load Model & Scaler
# # ----------------------------------------
# def load_model():
#     global model, scaler
#     try:
#         model_path = 'model/multivariate_lstm_model.h5'
#         scaler_path = 'scaler.save'

#         if not os.path.exists(model_path):
#             raise FileNotFoundError(f"Model file not found at {model_path}")
#         if not os.path.exists(scaler_path):
#             raise FileNotFoundError(f"Scaler file not found at {scaler_path}")

#         model = tf.keras.models.load_model(model_path, compile=False)
#         scaler = joblib.load(scaler_path)
#         print("✅ Model and scaler loaded successfully.")
#     except Exception as e:
#         print("❌ Error loading model or scaler:", e)

# ----------------------------------------
# Prepare Data for Prediction
# ----------------------------------------
# def prepare_data(ticker, start_date, end_date):
#     df = yf.download(ticker, start=start_date, end=end_date)

#     if isinstance(df.columns, pd.MultiIndex):
#         df.columns = df.columns.get_level_values(0)

#     df = df.reset_index()
#     df = df[['Date','Open', 'High', 'Low', 'Close', 'Volume']]

# #     df['SMA_50'] = df['Close'].rolling(window=50).mean()
# #     df['RSI'] = calculate_RSI(df['Close'], period=14)
# #     df['MACD'] = calculate_MACD(df['Close'])
# #     df.dropna(inplace=True)
# #     df.reset_index(drop=True, inplace=True)
# #     return df


# # def prepare_data(ticker, start_date, end_date):
# #     start_date = pd.to_datetime(start_date)
# #     end_date = pd.to_datetime(end_date)

# #     buffer_days = 60  # add buffer for SMA_50 and other indicators
# #     start_buffered = start_date - timedelta(days=buffer_days)

# #     df = yf.download(ticker, start=start_buffered.strftime('%Y-%m-%d'), end=end_date.strftime('%Y-%m-%d'))

# #     if isinstance(df.columns, pd.MultiIndex):
# #         df.columns = df.columns.get_level_values(0)

# #     df = df.reset_index()
# #     df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]

# #     df['SMA_50'] = df['Close'].rolling(window=50).mean()
# #     df['RSI'] = calculate_RSI(df['Close'], period=14)
# #     df['MACD'] = calculate_MACD(df['Close'])

# #     df.dropna(inplace=True)
# #     df = df[df['Date'] >= start_date]  # filter back to requested range
# #     df.reset_index(drop=True, inplace=True)
# #     return df




# # from datetime import timedelta

# def prepare_historical_data(ticker, start_date, end_date):
#     # ensure start/end are Timestamps
#     start = pd.to_datetime(start_date)
#     end   = pd.to_datetime(end_date)
    
#     # yfinance 'end' is exclusive, so add one day to include end_date itself
#     yf_end = (end + timedelta(days=1)).strftime('%Y-%m-%d')
    
#     # download just the requested window — no extra buffer
#     df = yf.download(ticker,
#                      start=start.strftime('%Y-%m-%d'),
#                      end=yf_end,
#                      progress=False)
    
#     # flatten multi-index if necessary
#     if isinstance(df.columns, pd.MultiIndex):
#         df.columns = df.columns.get_level_values(0)
    
#     # move Date into a column and trim down
#     df = df.reset_index()[['Date','Open','High','Low','Close','Volume']]
    
#     # compute indicators *on this window* (they’ll be NaN at the top until there’s enough data)
#     df['SMA_50'] = df['Close'].rolling(window=50).mean()
#     df['RSI']    = calculate_RSI(df['Close'], period=14)
#     df['MACD']   = calculate_MACD(df['Close'])
    
#     # force Date to plain date for JSON serialization
#     df['Date'] = df['Date'].dt.date
    
#     # make absolutely sure we only have rows within [start_date, end_date]
#     df = df[(df['Date'] >= start.date()) & (df['Date'] <= end.date())]
#     df.reset_index(drop=True, inplace=True)
    
#     return df


# # ----------------------------------------
# # API Endpoints
# # ----------------------------------------
# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         # Check if model and scaler are loaded
#         if model is None or scaler is None:
#             return jsonify({'status': 'error', 'message': 'Model or scaler not loaded.'})

#         # Get the input data from the request
#         data = request.get_json()
#         ticker = data.get('ticker', 'AAPL')
#         days_to_predict = int(data.get('days', 3))  # Default to 3 if no "days" field is provided

#         # ----------------------------------------
#         # Define start and end dates for the prediction period
#         # ----------------------------------------
#         end_date = datetime.now().date()
#         start_date = end_date - timedelta(days=100 + days_to_predict + window_size)

#         # Prepare the data
#         df = prepare_historical_data(ticker, start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))

#         # ----------------------------------------
#         # Get yesterday's, today's, and two days back data
#         # ----------------------------------------
#         yesterday = end_date - timedelta(days=1)
#         two_days_back = end_date - timedelta(days=2)
#         df['Date'] = pd.to_datetime(df['Date']).dt.date  # Ensure 'Date' column is in date format

#         # Get yesterday's, today's, and two days back data
#         yesterday_row = df[df['Date'] == yesterday]
#         two_days_back_row = df[df['Date'] == two_days_back]
#         today_row = df[df['Date'] == end_date]


#         # Set actual prices
#         yesterday_price = round(float(yesterday_row.iloc[0]['Close']), 2) if not yesterday_row.empty else None
#         two_days_back_price = round(float(two_days_back_row.iloc[0]['Close']), 2) if not two_days_back_row.empty else None
#         today_price = round(float(today_row.iloc[0]['Close']), 2) if not today_row.empty else None

#         # ----------------------------------------
#         # Generate prediction dates starting from tomorrow
#         # ----------------------------------------
#         start_prediction_date = end_date + timedelta(days=1)
#         prediction_dates = [start_prediction_date + timedelta(days=i) for i in range(days_to_predict)]
#         prediction_dates = [d.strftime('%Y-%m-%d') for d in prediction_dates]

#         # Scale data and prepare the window for prediction
#         data = df[features].values
#         scaled_data = scaler.transform(data)

#         last_window = scaled_data[-window_size:]
#         last_window = np.expand_dims(last_window, axis=0)

#         predictions = []
#         current_window = last_window.copy()

#         # ----------------------------------------
#         # Predict future values
#         # ----------------------------------------
#         for _ in range(days_to_predict):
#             next_pred_scaled = model.predict(current_window, verbose=0)

#             next_row_scaled = np.zeros((1, len(features)))
#             next_row_scaled[0, 0] = next_pred_scaled[0, 0]
#             next_row_scaled[0, 1:] = current_window[0, -1, 1:]

#             predictions.append(next_row_scaled)

#             current_window = np.append(current_window[:, 1:, :], [next_row_scaled], axis=1)

#         # Inverse transform predictions
#         predicted_prices = []
#         for pred in predictions:
#             dummy = np.zeros((1, len(features)))
#             dummy[0, :] = pred[0]
#             predicted_price = scaler.inverse_transform(dummy)[0, 0]
#             predicted_prices.append(predicted_price)

#         # ----------------------------------------
#         # Build response with actual and predicted data
#         # ----------------------------------------
#         response_predictions = []

#         # Include actual data for yesterday, today, and two days back
#         if yesterday_price is not None:
#             response_predictions.append({
#                 'date': yesterday.strftime('%Y-%m-%d'),
#                 'price': yesterday_price,
#                 'type': 'actual'
#             })


#         if today_price is not None:
#             response_predictions.append({
#                 'date': end_date.strftime('%Y-%m-%d'),
#                 'price': today_price,
#                 'type': 'actual'
#             })

#         if two_days_back_price is not None:
#             response_predictions.append({
#                 'date': two_days_back.strftime('%Y-%m-%d'),
#                 'price': two_days_back_price,
#                 'type': 'actual'
#             })

        

#         # Add predicted prices
#         for d, p in zip(prediction_dates, predicted_prices):
#             response_predictions.append({
#                 'date': d,
#                 'price': round(p, 2),
#                 'type': 'predicted'
#             })

#         return jsonify({
#             'ticker': ticker,
#             'predictions': response_predictions,
#             'status': 'success'
#         })

#     except Exception as e:
#         return jsonify({'status': 'error', 'message': str(e)})



# @app.route('/model_results', methods=['POST'])
# def model_results():
#     try:
#         data = request.get_json()
#         ticker = data.get('ticker', 'GOOGL')

#         if model is None or scaler is None:
#             return jsonify({'status': 'error', 'message': 'Model not loaded'})
        
#         today = pd.to_datetime('today').normalize()
#         end_date = (today + timedelta(days=1)).strftime('%Y-%m-%d')
#         df = prepare_historical_data(ticker, '2015-01-01', end_date)

#         # Convert Date column to datetime if it's not already
#         df['Date'] = pd.to_datetime(df['Date'])

#         data = df[features].values
#         scaled_data = scaler.transform(data)

#         X, y = create_sequences(scaled_data, window_size)
#         train_size = int(len(X) * 0.8)
#         X_train, y_train = X[:train_size], y[:train_size]
#         X_test, y_test = X[train_size:], y[train_size:]

#         # Predict test set
#         pred_scaled = model.predict(X_test)

#         dummy = np.zeros((len(pred_scaled), len(features)))
#         dummy[:, 0] = pred_scaled[:, 0]
#         predicted = scaler.inverse_transform(dummy)[:, 0]

#         # Actual test values
#         dummy_true = np.zeros((len(y_test), len(features)))
#         dummy_true[:, 0] = y_test
#         actual = scaler.inverse_transform(dummy_true)[:, 0]

#         # Actual training values
#         dummy_train = np.zeros((len(y_train), len(features)))
#         dummy_train[:, 0] = y_train
#         train_actual = scaler.inverse_transform(dummy_train)[:, 0]

#         # Predict tomorrow
#         last_sequence = scaled_data[-window_size:]
#         last_sequence = np.expand_dims(last_sequence, axis=0)
#         pred_tomorrow_scaled = model.predict(last_sequence)
#         dummy_tomorrow = np.zeros((1, len(features)))
#         dummy_tomorrow[0, 0] = pred_tomorrow_scaled[0, 0]
#         predicted_tomorrow = scaler.inverse_transform(dummy_tomorrow)[0, 0]
#         tomorrow_date = (today + timedelta(days=1)).strftime('%Y-%m-%d')

#         r_squared = r2_score(actual, predicted)
        
#         # Get dates - now safe because we converted to datetime
#         dates_train = df['Date'].iloc[window_size:window_size + train_size].dt.strftime('%Y-%m-%d').tolist()
#         dates_test = df['Date'].iloc[window_size + train_size:].dt.strftime('%Y-%m-%d').tolist()

#         # Append tomorrow's prediction to predicted prices and date
#         predicted_prices = [float(price) for price in predicted] + [float(predicted_tomorrow)]
#         predicted_dates = dates_test + [tomorrow_date]

#         return jsonify({
#             'status': 'success',
#             'ticker': ticker,
#             'r_squared': r_squared,
#             'train_dates': dates_train,
#             'train_prices': [float(price) for price in train_actual],
#             'test_dates': dates_test,
#             'test_prices': [float(price) for price in actual],
#             'actual_prices': [float(price) for price in actual],  # actuals end today
#             'predicted_prices': predicted_prices,                 # includes tomorrow
#             'predicted_dates': predicted_dates,                   # includes tomorrow
#             'train_test_split_date': dates_train[-1] if dates_train else None
#         })

#     except Exception as e:
#         return jsonify({'status': 'error', 'message': str(e)})



# import numpy as np

# # @app.route('/historical', methods=['POST'])
# # def historical():
# #     try:
# #         data = request.get_json()
# #         ticker = data.get('ticker', 'AAPL')
# #         start_date = data.get('start_date', '2015-01-01')
# #         end_date = data.get('end_date', datetime.now().strftime('%Y-%m-%d'))

# #         df = prepare_historical_data(ticker, start_date, end_date)

# #         # Build response
# #         historical_data = []
# #         for _, row in df.iterrows():
# #             # Utility to safe-round or null out NaNs
# #             def safe_round(val, digits=2):
# #                 return round(float(val), digits) if not np.isnan(val) else None

# #             historical_data.append({
# #                 'date': row['Date'].strftime('%Y-%m-%d'),
# #                 'open':  round(float(row['Open']), 2),
# #                 'high':  round(float(row['High']), 2),
# #                 'low':   round(float(row['Low']), 2),
# #                 'close': round(float(row['Close']), 2),
# #                 'volume': int(row['Volume']),
# #                 'sma_50': safe_round(row['SMA_50']),
# #                 'rsi':    safe_round(row['RSI']),
# #                 'macd':   safe_round(row['MACD']),
# #             })

# #         return jsonify({
# #             'ticker': ticker,
# #             'historical_data': historical_data,
# #             'status': 'success'
# #         })

# #     except Exception as e:
# #         return jsonify({'status': 'error', 'message': str(e)})


# @app.route('/historical', methods=['POST'])
# def historical():
#     try:
#         data = request.get_json()
#         ticker = data.get('ticker', 'AAPL')
#         start_date = data.get('start_date', '2015-01-01')
#         end_date = data.get('end_date', datetime.now().strftime('%Y-%m-%d'))

#         # Get historical price data
#         df = prepare_historical_data(ticker, start_date, end_date)
        
#         # Get fundamental data
#         stock = yf.Ticker(ticker)
#         info = stock.info
        
#         # Get shares outstanding (use current if historical not available)
#         shares_outstanding = info.get('sharesOutstanding')
        
#         # Get trailing PE ratio (current)
#         trailing_pe = info.get('trailingPE')
        
#         # Utility function to safely handle NaN/None values
#         def safe_round(val, digits=2):
#             if val is None:
#                 return None
#             try:
#                 if pd.isna(val):  # This handles both numpy and pandas NA values
#                     return None
#                 return round(float(val), digits)
#             except (TypeError, ValueError):
#                 return None

#         # Build response
#         historical_data = []
#         for _, row in df.iterrows():
#             date_str = row['Date'].strftime('%Y-%m-%d')
            
#             # Calculate market cap if shares outstanding is available
#             market_cap = None
#             if shares_outstanding and not pd.isna(row['Close']):
#                 market_cap = row['Close'] * shares_outstanding
            
#             historical_data.append({
#                 'date': date_str,
#                 'open': safe_round(row['Open']),
#                 'high': safe_round(row['High']),
#                 'low': safe_round(row['Low']),
#                 'close': safe_round(row['Close']),
#                 'volume': safe_round(row['Volume'], 0),
#                 'sma_50': safe_round(row['SMA_50']),
#                 'rsi': safe_round(row['RSI']),
#                 'macd': safe_round(row['MACD']),
#                 'pe_ratio': safe_round(trailing_pe),  
#                 'market_cap': safe_round(market_cap)
#             })

#         return jsonify({
#             'ticker': ticker,
#             'historical_data': historical_data,
#             'status': 'success',
#             'info': {  
#                 'shares_outstanding': safe_round(shares_outstanding, 0),
#                 'trailing_pe': safe_round(trailing_pe),
#                 'forward_pe': safe_round(info.get('forwardPE')),
#                 'market_cap': safe_round(info.get('marketCap'))
#             }
#         })

#     except Exception as e:
#         return jsonify({
#             'status': 'error', 
#             'message': str(e),
#             'traceback': traceback.format_exc()  
#         })



# if __name__ == '__main__':
#     load_model()
#     app.run(debug=True, port=5000)








# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import traceback
# import joblib
# import numpy as np
# import pandas as pd
# import requests
# from io import StringIO
# from datetime import datetime, timedelta
# import tensorflow as tf
# from tensorflow.keras.models import load_model
# from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# # ─────────────────────────────────────────────────────────────
# # 1. FLASK SETUP
# # ─────────────────────────────────────────────────────────────
# app = Flask(__name__)
# CORS(app, origins=["http://localhost:5173", "http://localhost:8000"])

# # ─────────────────────────────────────────────────────────────
# # 2. GLOBALS & CONFIG
# # ─────────────────────────────────────────────────────────────
# API_KEY     = "MAULMAZ7CKV4HWX9"
# AV_FUNCTION = "TIME_SERIES_DAILY"
# OUTPUTSIZE  = "full"
# DATATYPE    = "csv"
# CACHE_DIR   = "alpha_vantage_data"
# os.makedirs(CACHE_DIR, exist_ok=True)

# MODEL_PATH  = "model/multivariate_lstm_model.h5"
# SCALER_PATH = "model/scaler.save"
# WINDOW_SIZE = 60
# FEATURES    = ['Close','Volume','SMA_50','RSI','MACD']

# model  = None
# scaler = None

# # ─────────────────────────────────────────────────────────────
# # 3. DATA FETCH & INDICATORS
# # ─────────────────────────────────────────────────────────────
# def fetch_full_history(symbol):
#     cache_file = f"{CACHE_DIR}/{symbol}_FULL.csv"
#     if os.path.exists(cache_file):
#         df = pd.read_csv(cache_file, parse_dates=['Date'])
#     else:
#         url = (
#             f"https://www.alphavantage.co/query"
#             f"?function={AV_FUNCTION}&symbol={symbol}"
#             f"&outputsize={OUTPUTSIZE}&datatype={DATATYPE}&apikey={API_KEY}"
#         )
#         resp = requests.get(url)
#         resp.raise_for_status()
#         df = pd.read_csv(StringIO(resp.text))
#         df.rename(columns={'timestamp':'Date'}, inplace=True)
#         df['Date'] = pd.to_datetime(df['Date'])
#         df.sort_values('Date', inplace=True)
#         df = df[['Date','open','high','low','close','volume']]
#         df.columns = ['Date','Open','High','Low','Close','Volume']
#         df.to_csv(cache_file, index=False)
#     return df

# def calculate_RSI(series, period=14):
#     delta = series.diff()
#     gain  = delta.clip(lower=0).rolling(period, min_periods=period).mean()
#     loss  = -delta.clip(upper=0).rolling(period, min_periods=period).mean()
#     rs    = gain / loss
#     return 100 - (100/(1+rs))

# def calculate_MACD(series):
#     ema12 = series.ewm(span=12, adjust=False).mean()
#     ema26 = series.ewm(span=26, adjust=False).mean()
#     macd  = ema12 - ema26
#     signal= macd.ewm(span=9, adjust=False).mean()
#     return macd, signal

# def prepare_historical_data(symbol, start_date, end_date):
#     df = fetch_full_history(symbol)
#     df = df[(df['Date']>=pd.to_datetime(start_date)) & (df['Date']<=pd.to_datetime(end_date))].copy()
#     df['SMA_50']       = df['Close'].rolling(50, min_periods=50).mean()
#     df['RSI']          = calculate_RSI(df['Close'])
#     df['MACD'], _      = calculate_MACD(df['Close'])
#     df.dropna(inplace=True)
#     df.reset_index(drop=True, inplace=True)
#     return df

# # ─────────────────────────────────────────────────────────────
# # 4. SEQUENCE CREATION
# # ─────────────────────────────────────────────────────────────
# def create_sequences(arr, window_size):
#     X = []
#     for i in range(window_size, len(arr)):
#         X.append(arr[i-window_size:i])
#     return np.array(X)

# # ─────────────────────────────────────────────────────────────
# # 5. MODEL & SCALER LOADING
# # ─────────────────────────────────────────────────────────────
# def load_artifacts():
#     global model, scaler
#     if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
#         raise FileNotFoundError("Model or scaler file missing.")
#     model  = load_model(MODEL_PATH, compile=False)
#     scaler = joblib.load(SCALER_PATH)
#     print("✅ Model and scaler loaded.")

# # ─────────────────────────────────────────────────────────────
# # 6a. /predict ENDPOINT
# # ─────────────────────────────────────────────────────────────
# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data   = request.get_json()
#         symbol = data.get('ticker', 'META')
#         days   = int(data.get('days', 3))

#         # Prepare last 5 years of data
#         end   = datetime.now().date()
#         start = end - timedelta(days=365*5)
#         df    = prepare_historical_data(symbol, start, end)

#         arr    = df[FEATURES].values
#         scaled = scaler.transform(arr)

#         # Rolling predictions
#         window = create_sequences(scaled, WINDOW_SIZE)[-1].reshape(1, WINDOW_SIZE, len(FEATURES))
#         preds  = []
#         for _ in range(days):
#             p = model.predict(window, verbose=0)[0,0]
#             new = np.zeros((1, len(FEATURES)))
#             new[0,0] = p
#             new[0,1:] = window[0,-1,1:]
#             preds.append(new)
#             window = np.concatenate([window[:,1:,:], new.reshape(1,1,-1)], axis=1)

#         # Inverse scale only the Close column
#         prices = [ round(float(scaler.inverse_transform(row)[0,0]),2) for row in preds ]
#         dates  = [(end + timedelta(days=i+1)).isoformat() for i in range(days)]

#         return jsonify({
#             'status': 'success',
#             'ticker': symbol,
#             'predictions': [{'date':d,'price':p} for d,p in zip(dates,prices)]
#         })
#     except Exception as e:
#         return jsonify({'status':'error','message':str(e),'traceback':traceback.format_exc()}), 500

# # ─────────────────────────────────────────────────────────────
# # 6b. /model_results ENDPOINT
# # ─────────────────────────────────────────────────────────────
# @app.route('/model_results', methods=['POST'])
# def model_results():
#     try:
#         data   = request.get_json()
#         symbol = data.get('ticker', 'META')

#         # Use 2015-01-01 to tomorrow as in your notebook
#         start = '2015-01-01'
#         end   = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
#         df    = prepare_historical_data(symbol, start, end)

#         arr    = df[FEATURES].values
#         scaled = scaler.transform(arr)

#         X = create_sequences(scaled, WINDOW_SIZE)
#         y = scaled[WINDOW_SIZE:, 0]  # true Close

#         split = int(len(X)*0.8)
#         X_train, y_train = X[:split], y[:split]
#         X_test,  y_test  = X[split:], y[split:]

#         pred_scaled = model.predict(X_test)
#         def inv_close(vals):
#             dummy = np.zeros((len(vals), len(FEATURES)))
#             dummy[:,0] = vals.flatten()
#             return scaler.inverse_transform(dummy)[:,0]

#         train_actual = inv_close(y_train)
#         test_actual  = inv_close(y_test)
#         test_pred    = inv_close(pred_scaled)

#         # Tomorrow’s prediction
#         window = X[-1].reshape(1,WINDOW_SIZE,len(FEATURES))
#         tom_s   = model.predict(window)[0,0]
#         tom_p   = float(inv_close([tom_s])[0])
#         tom_d   = (datetime.now().date() + timedelta(days=1)).isoformat()

#         # Metrics
#         mae  = mean_absolute_error(test_actual, test_pred)
#         rmse = mean_squared_error(test_actual, test_pred, squared=False)
#         r2   = r2_score(test_actual, test_pred)

#         # Dates lists
#         dates = df['Date'].dt.strftime('%Y-%m-%d')
#         train_dates = dates[WINDOW_SIZE:WINDOW_SIZE+len(train_actual)].tolist()
#         test_dates  = dates[WINDOW_SIZE+len(train_actual):
#                              WINDOW_SIZE+len(train_actual)+len(test_actual)].tolist()

#         return jsonify({
#             'status': 'success',
#             'ticker': symbol,
#             'metrics': {
#                 'mae':  round(mae,2),
#                 'rmse': round(rmse,2),
#                 'r2':   round(r2,4)
#             },
#             'train_dates':    train_dates,
#             'train_prices':   train_actual.tolist(),
#             'test_dates':     test_dates,
#             'test_actuals':   test_actual.tolist(),
#             'test_predictions': test_pred.tolist(),
#             'tomorrow':       {'date': tom_d, 'price': tom_p}
#         })
#     except Exception as e:
#         return jsonify({'status':'error','message':str(e),'traceback':traceback.format_exc()}), 500

# # ─────────────────────────────────────────────────────────────
# # 6c. /historical ENDPOINT
# # ─────────────────────────────────────────────────────────────
# @app.route('/historical', methods=['POST'])
# def historical():
#     try:
#         data   = request.get_json()
#         symbol = data.get('ticker', 'META')
#         start  = data.get('start_date', '2015-01-01')
#         end    = data.get('end_date', datetime.now().strftime('%Y-%m-%d'))
#         df     = prepare_historical_data(symbol, start, end)

#         def safe_round(v, d=2):
#             return None if pd.isna(v) else round(float(v), d)

#         hist = []
#         for _, row in df.iterrows():
#             hist.append({
#                 'date': row['Date'].strftime('%Y-%m-%d'),
#                 'open':  safe_round(row['Open']),
#                 'high':  safe_round(row['High']),
#                 'low':   safe_round(row['Low']),
#                 'close': safe_round(row['Close']),
#                 'volume': int(row['Volume']),
#                 'sma_50': safe_round(row['SMA_50']),
#                 'rsi':    safe_round(row['RSI']),
#                 'macd':   safe_round(row['MACD'])
#             })

#         return jsonify({
#             'status': 'success',
#             'ticker': symbol,
#             'historical_data': hist
#         })
#     except Exception as e:
#         return jsonify({'status':'error','message':str(e),'traceback':traceback.format_exc()}), 500

# # ─────────────────────────────────────────────────────────────
# # 7. MAIN
# # ─────────────────────────────────────────────────────────────
# if __name__ == '__main__':
#     load_artifacts()
#     app.run(debug=True, port=5000)
