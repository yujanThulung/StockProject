import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3" # TF log levels: 0=all, 1=INFO off, 2=INFO+WARN off, 3=FATAL only

from app import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
