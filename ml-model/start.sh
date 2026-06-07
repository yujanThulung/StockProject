#!/bin/bash

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Stop both services on Ctrl+C
cleanup() {
    echo ""
    echo "[*] Stopping all ML services..."
    kill "$LSTM_PID" "$SENTIMENT_PID" 2>/dev/null
    wait "$LSTM_PID" "$SENTIMENT_PID" 2>/dev/null
    echo "[*] Done."
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start LSTM service
echo "[LSTM] Starting on http://localhost:8080 ..."
cd "$SCRIPT_DIR/lstm" || { echo "[ERROR] lstm directory not found"; exit 1; }

# Check LSTM virtual environment
if [ ! -f "./venv/bin/python3" ]; then
    echo "[ERROR] LSTM venv not found"
    exit 1
fi

# Run LSTM in background
./venv/bin/python3 run.py 2>&1 | sed 's/^/[LSTM] /' &
LSTM_PID=$!

# Start Sentiment service
echo "[SENTIMENT] Starting on http://localhost:5001 ..."
cd "$SCRIPT_DIR/sentiment" || { echo "[ERROR] sentiment directory not found"; exit 1; }

# Check Sentiment virtual environment
if [ ! -f "./venv/bin/python3" ]; then
    echo "[ERROR] Sentiment venv not found"
    exit 1
fi

# Run Sentiment in background
./venv/bin/python3 run.py 2>&1 | sed 's/^/[SENTIMENT] /' &
SENTIMENT_PID=$!

# Show service URLs
echo ""
echo "LSTM API      → http://localhost:8080"
echo "Sentiment API → http://localhost:5001"
echo "Press Ctrl+C to stop both services."
echo ""

# Keep script running
wait "$LSTM_PID" "$SENTIMENT_PID"