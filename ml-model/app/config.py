# import os
# from pathlib import Path
# from dotenv import load_dotenv

# BASE_DIR = Path(__file__).parent.resolve()
# load_dotenv()

# class Config:
#     # API Configuration
#     TWELVE_DATA_API_KEY = os.getenv("TWELVE_DATA_API_KEY")
#     TWELVE_DATA_BASE_URL = "https://api.twelvedata.com"
#     FINNHUB_KEY = os.getenv("FINNHUB_KEY")
    
#     # Data Configuration
#     START_DATE = os.getenv("START_DATE", "2015-01-01")
#     WINDOW_SIZE = int(os.getenv("WINDOW_SIZE", 60))
    
#     # Model Configuration
#     MODEL_PATH = str(BASE_DIR / "models" / "multivariate_lstm_model.h5")
#     SCALER_PATH = str(BASE_DIR / "models" / "scaler.save")
    
#     # Cache Configuration
#     CACHE_DIR = str(BASE_DIR / "twelve_data_cache")
#     LAST_CHECKED = str(BASE_DIR / "twelve_data_cache" / "last_checked.json")
#     CACHE_EXPIRY_DAYS = 7
    
#     # Rate Limiting
#     MIN_API_INTERVAL = 1
    
#     # CORS Configuration
#     ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:8080"]

# # Initialize directories
# os.makedirs(Config.CACHE_DIR, exist_ok=True)
# os.makedirs(Path(Config.MODEL_PATH).parent, exist_ok=True)


import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.resolve()
load_dotenv()

class Config:
    # API Configuration
    TWELVE_DATA_API_KEY = os.getenv("TWELVE_DATA_API_KEY")
    TWELVE_DATA_BASE_URL = "https://api.twelvedata.com"
    FINNHUB_KEY = os.getenv("FINNHUB_KEY")
    
    # Data Configuration
    START_DATE = os.getenv("START_DATE", "2015-01-01")
    WINDOW_SIZE = int(os.getenv("WINDOW_SIZE", 60))
    
    # Model Configuration
    MODEL_PATH = str(BASE_DIR / "models" / "multivariate_lstm_model.h5")
    SCALER_PATH = str(BASE_DIR / "models" / "scaler.save")
    
    # Cache Configuration
    CACHE_DIR = str(BASE_DIR / "twelve_data_cache")
    LAST_CHECKED = str(BASE_DIR / "twelve_data_cache" / "last_checked.json")
    CACHE_EXPIRY_DAYS = 7
    
    # Rate Limiting
    MIN_API_INTERVAL = 1
    
    # CORS Configuration
    ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:8000"]

# Create required directories
os.makedirs(Config.CACHE_DIR, exist_ok=True)
os.makedirs(Path(Config.MODEL_PATH).parent, exist_ok=True)