import time
import threading
from functools import wraps
from ..config import Config

class RateLimiter:
    def __init__(self):
        self.lock = threading.Lock()
        self.last_call = 0

    def wait(self):
        with self.lock:
            current_time = time.time()
            time_since_last = current_time - self.last_call
            
            if time_since_last < Config.MIN_API_INTERVAL:
                wait_time = Config.MIN_API_INTERVAL - time_since_last
                time.sleep(wait_time)
            
            self.last_call = time.time()

# Global rate limiter instance
rate_limiter = RateLimiter()

def rate_limited(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        rate_limiter.wait()
        return func(*args, **kwargs)
    return wrapper