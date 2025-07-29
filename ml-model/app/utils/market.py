import pandas_market_calendars as mcal
from datetime import datetime, timedelta
from ..config import Config

class MarketCalendar:
    def __init__(self):
        self.exchange = mcal.get_calendar("NYSE")
    
    def is_market_open(self, date=None):
        """Check if market is open on given date (default: today)"""
        date = date or datetime.now().date()
        schedule = self.exchange.schedule(
            start_date=date,
            end_date=date
        )
        return not schedule.empty
    
    def get_market_days(self, start_date, end_date=None):
        """Get all market days between start and end dates"""
        end_date = end_date or datetime.now().date()
        schedule = self.exchange.schedule(
            start_date=start_date,
            end_date=end_date
        )
        return schedule.index.date.tolist()
    
    def get_previous_market_day(self, date=None):
        """Get the previous market day"""
        date = date or datetime.now().date()
        days_back = 1
        while days_back < 30:  
            check_date = date - timedelta(days=days_back)
            if self.is_market_open(check_date):
                return check_date
            days_back += 1
        return None