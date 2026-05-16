import pandas as pd
import numpy as np

def calculate_RSI(series, period=14):
    """Calculate Relative Strength Index"""
    delta = series.diff()
    gain = delta.clip(lower=0).rolling(period).mean()
    loss = (-delta).clip(lower=0).rolling(period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_MACD(series, fast=12, slow=26, signal=9):
    """Calculate MACD indicator"""
    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()
    macd = ema_fast - ema_slow
    signal_line = macd.ewm(span=signal, adjust=False).mean()
    return macd, signal_line

def calculate_indicators(df):
    """Calculate all technical indicators for the DataFrame"""
    df = df.copy()
    
    # Simple Moving Averages
    df["SMA_50"] = df["Close"].rolling(50).mean()
    
    # Relative Strength Index
    df["RSI"] = calculate_RSI(df["Close"])
    
    # MACD
    df["MACD"], df["MACD_signal"] = calculate_MACD(df["Close"])
    
    # Drop any rows with NaN values from calculations
    df.dropna(inplace=True)
    
    return df