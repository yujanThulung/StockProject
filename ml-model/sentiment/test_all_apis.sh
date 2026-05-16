#!/bin/bash
BASE_URL="http://localhost:5000"

echo "1. Testing /health..."
curl -s "$BASE_URL/health" | jq .
echo -e "\n"

echo "2. Testing /news/latest..."
curl -s "$BASE_URL/news/latest?limit=2" | jq .
echo -e "\n"

echo "3. Testing /news/ticker/AAPL..."
curl -s "$BASE_URL/news/ticker/AAPL?limit=2" | jq .
echo -e "\n"

echo "4. Testing /sentiment (Bulk)..."
curl -s -X POST "$BASE_URL/sentiment" \
     -H "Content-Type: application/json" \
     -d '{"texts": ["Apple is doing great", "Tesla is crashing"]}' | jq .
echo -e "\n"

echo "5. Testing /sentiment/ticker (Ticker)..."
curl -s -X POST "$BASE_URL/sentiment/ticker" \
     -H "Content-Type: application/json" \
     -d '{"ticker": "AAPL", "limit": 5}' | jq .
echo -e "\n"
