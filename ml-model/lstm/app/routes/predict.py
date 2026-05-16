import pandas as pd
from flask import request, jsonify
from ..services.data_service import DataService
from ..services.model_service import ModelService
from .. import app

data_service = DataService()
model_service = ModelService()

@app.route("/predict", methods=["POST"])
def predict():
    try:
        ticker = request.json.get("ticker", "MSFT").upper()

        # Fetch historical data
        df = data_service.fetch_full_history(ticker)

        # Optionally add today's data
        try:
            today = pd.Timestamp.now().normalize()
            if df["Date"].max().date() < today.date():
                today_bar = data_service.fetch_realtime_quote(ticker)
                today_df = pd.DataFrame([today_bar])
                today_df["Date"] = pd.to_datetime(today_df["Date"])
                today_df["Volume"] = today_df.get("Volume", 1000000)
                df = pd.concat([df, today_df]).sort_values("Date").reset_index(drop=True)
        except Exception as e:
            app.logger.warning(f"Failed to append today's quote: {e}")

        # Make prediction
        prediction = model_service.predict(df)

        return jsonify({"status": "success", "ticker": ticker, **prediction})
    
    except Exception as e:
        app.logger.error(f"Error in /predict: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
