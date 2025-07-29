import pandas as pd
import numpy as np
import tensorflow as tf
import numpy as np
import joblib
from datetime import datetime, timedelta
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from ..utils.indicators import calculate_indicators
from ..config import Config
import os

class ModelService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.loaded = False
        
    def _validate_model_paths(self):
        """Check if model files exist"""
        if not os.path.exists(Config.MODEL_PATH):
            raise FileNotFoundError(
                f"Model file not found at {Config.MODEL_PATH}")
        if not os.path.exists(Config.SCALER_PATH):
            raise FileNotFoundError(
                f"Scaler file not found at {Config.SCALER_PATH}\n"
                f"Current working directory: {os.getcwd()}\n"
                f"Resolved path: {os.path.abspath(Config.MODEL_PATH)}"
)
    
    def load_model(self):
        """Lazy loading of model and scaler"""
        if not self.loaded:
            try:
                self._validate_model_paths()
                self.scaler = joblib.load(Config.SCALER_PATH)
                self.model = tf.keras.models.load_model(Config.MODEL_PATH, compile=False)
                self.loaded = True
            except Exception as e:
                raise RuntimeError(f"Failed to load model: {e}")
    
    def create_sequences(self, data, window_size):
        """Create sequences for LSTM model"""
        X, y = [], []
        for i in range(window_size, len(data)):
            X.append(data[i-window_size:i])
            y.append(data[i, 0])
        return np.array(X), np.array(y)
    
    def predict(self, historical_data):
        """Make predictions for given historical data"""
        if not self.loaded:
            self.load_model()
        
        # Calculate indicators
        df = calculate_indicators(historical_data)
        
        # Prepare features
        feats = ["Close", "Volume", "SMA_50", "RSI", "MACD"]
        raw = df[feats].values
        scaled_data = self.scaler.transform(raw)
        
        # Create sequences
        X, y = self.create_sequences(scaled_data, Config.WINDOW_SIZE)
        
        # Split data
        split = int(len(X) * 0.8)
        X_train, y_train = X[:split], y[:split]
        X_test, y_test = X[split:], y[split:]
        
        # Make predictions
        p_scaled = self.model.predict(X_test)
        buf_p = np.zeros_like(scaled_data[:len(p_scaled)])
        buf_p[:, 0] = p_scaled[:, 0]
        pred = self.scaler.inverse_transform(buf_p)[:, 0]
        
        buf_t = np.zeros_like(scaled_data[:len(y_test)])
        buf_t[:, 0] = y_test
        actual = self.scaler.inverse_transform(buf_t)[:, 0]
        
        # Calculate metrics
        metrics = {
            "r2": r2_score(actual, pred),
            "mae": mean_absolute_error(actual, pred),
            "rmse": np.sqrt(mean_squared_error(actual, pred)),
            "stderr": np.std(actual - pred)
        }
        
        # Next-day prediction
        last_win = scaled_data[-Config.WINDOW_SIZE:].reshape(1, Config.WINDOW_SIZE, len(feats))
        nxt_s = self.model.predict(last_win)
        buf2 = np.zeros((1, len(feats)))
        buf2[0, 0] = nxt_s[0, 0]
        nxt = self.scaler.inverse_transform(buf2)[0, 0]
        
        # Prepare dates
        dates = df["Date"].iloc[Config.WINDOW_SIZE:].reset_index(drop=True)
        dates_train = dates.iloc[:len(y_train)].dt.strftime("%Y-%m-%d").tolist()
        dates_test = dates.iloc[len(y_train):].dt.strftime("%Y-%m-%d").tolist()
        next_day = (pd.to_datetime(dates_test[-1]) + pd.Timedelta(days=1)).strftime("%Y-%m-%d")
        
        return {
            "metrics": metrics,
            "train_dates": dates_train,
            "train_prices": self.scaler.inverse_transform(
                np.column_stack([y_train, np.zeros((len(y_train), len(feats)-1))])
            )[:, 0].tolist(),
            "test_dates": dates_test,
            "test_prices": actual.tolist(),
            "predicted_dates": dates_test + [next_day],
            "predicted_prices": np.concatenate([pred, [nxt]]).tolist()
        }