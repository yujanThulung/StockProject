from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:8000"])

# Load configuration
from .config import Config
app.config.from_object(Config)

# Register routes
from .routes import predict, historical


# Import routes after app and socketio are initialized
from .routes import debug, historical, predict