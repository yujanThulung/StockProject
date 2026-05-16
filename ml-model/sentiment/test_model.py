import joblib
import numpy as np
from pathlib import Path

MODEL_PATH = Path("data/models/svm_sentiment_model.pkl")
print(f"Loading model from {MODEL_PATH}")
model = joblib.load(MODEL_PATH)

texts = ["Apple stock is doing great!", "Bad news for Tesla", "The market is neutral"]
predictions = model.predict(texts)
probabilities = model.predict_proba(texts)

print("Predictions:", predictions)
print("Probabilities:", probabilities)
print("Classes:", model.classes_)
