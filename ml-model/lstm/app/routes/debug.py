from flask import jsonify
from ..services.data_service import DataService
from .. import app

data_service = DataService()

@app.route("/debug/<ticker>", methods=["GET"])
def debug_ticker(ticker):
    try:
        ticker = ticker.upper()
        df = data_service.fetch_full_history(ticker)
        
        return jsonify({
            "status": "success",
            "ticker": ticker,
            "data_shape": df.shape,
            "columns": list(df.columns),
            "date_range": {
                "start": df["Date"].min().strftime("%Y-%m-%d"),
                "end": df["Date"].max().strftime("%Y-%m-%d")
            },
            "sample_data": df.head(3).to_dict(orient="records"),
            "recent_data": df.tail(3).to_dict(orient="records")
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "ticker": ticker,
            "error": str(e)
        }), 500