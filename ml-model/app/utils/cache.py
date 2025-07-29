import os
import pandas as pd
from datetime import datetime, timedelta
from pathlib import Path
import json
from app.config import Config

class CacheManager:
    def __init__(self):
        self.cache_dir = Path(Config.CACHE_DIR)
        self.last_checked_file = Path(Config.LAST_CHECKED)
        self._ensure_cache_structure()

    def _ensure_cache_structure(self):
        """Create required directories and files"""
        self.cache_dir.mkdir(exist_ok=True)
        if not self.last_checked_file.exists():
            with open(self.last_checked_file, 'w') as f:
                json.dump({}, f)

    def _get_cache_file(self, ticker):
        return self.cache_dir / f"{ticker}.csv"

    def _load_last_checked(self):
        with open(self.last_checked_file, 'r') as f:
            return json.load(f)

    def _save_last_checked(self, data):
        with open(self.last_checked_file, 'w') as f:
            json.dump(data, f, indent=2)

    def get_cached_data(self, ticker):
        """Returns (data, last_checked_date) or (None, None)"""
        cache_file = self._get_cache_file(ticker)
        last_checked = self._load_last_checked()
        
        if not cache_file.exists():
            return None, None
            
        try:
            df = pd.read_csv(cache_file, parse_dates=['Date'])
            last_date = last_checked.get(ticker)
            return df, last_date
        except Exception as e:
            print(f"Cache read error for {ticker}: {e}")
            return None, None

    def update_cache(self, ticker, new_data):
        """Update cache with new data"""
        cache_file = self._get_cache_file(ticker)
        last_checked = self._load_last_checked()
        
        try:
            # Save data
            new_data.to_csv(cache_file, index=False)
            
            # Update last checked
            last_checked[ticker] = datetime.now().isoformat()
            self._save_last_checked(last_checked)
            return True
        except Exception as e:
            print(f"Cache update failed for {ticker}: {e}")
            return False

    def is_cache_valid(self, ticker, max_age_days=1):
        """Check if cache is still fresh"""
        last_checked = self._load_last_checked()
        if ticker not in last_checked:
            return False
            
        last_updated = datetime.fromisoformat(last_checked[ticker])
        return (datetime.now() - last_updated) < timedelta(days=max_age_days)