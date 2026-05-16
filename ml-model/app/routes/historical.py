from flask import request, jsonify
from ..services.data_service import DataService
from .. import app

data_service = DataService()

@app.route("/historical", methods=["POST"])
def historical():
    try:
        ticker = request.json.get("ticker", "PEP").upper()
        df = data_service.fetch_full_history(ticker)

        df["Date"] = df["Date"].dt.strftime("%Y-%m-%d %H:%M:%S")
        records = df.to_dict(orient="records")

        try:
            today_bar = data_service.fetch_realtime_quote(ticker)
            if not records or records[-1]["Date"][:10] != today_bar["Date"][:10]:
                records.append(today_bar)
        except Exception as e:
            app.logger.warning(f"Failed to fetch today's quote: {e}")

        return jsonify({"status": "success", "historical": records})

    except Exception as e:
        app.logger.error(f"Error in /historical: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
