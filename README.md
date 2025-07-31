
# 📈 NuroStock

**NuroStock** is a smart and easy-to-use stock prediction and alerting platform. It helps users visualize real-time market trends, make informed decisions with AI-driven predictions, and track their favorite stocks.

---

## 🧠 Features

- 🔐 User authentication
- 📊 Real-time stock charts and volume
- 📈 AI-based stock price prediction using LSTM (via Flask)
- 📌 Add to Watchlist
- 🔔 Set custom alerts for price conditions
- 💡 View top gainers/losers
- 📑 Financials and analytics overview

---

## 🛠️ Tech Stack

| Layer        | Tech Used                             |
|--------------|----------------------------------------|
| Frontend     | React, Zustand, ApexCharts, Tailwind   |
| Backend      | Node.js, Express, MongoDB, Socket.IO   |
| ML API       | Flask (Python 3.10, LSTM), Virtual Env |
| Database     | MongoDB Atlas                          |
| Deployment   | Render *(or run locally)*              |

---

## 🧪 Local Development Setup

### 🔧 Prerequisites

- Node.js
- Python 3.10
- MongoDB (local or Atlas)
- Git

---

---

### ✅ 4. Add Installation Notes for Each Tech

E.g., how to install:
- Node.js: [https://nodejs.org](https://nodejs.org)
- Python 3.10: [https://www.python.org/downloads/release/python-3100/](https://www.python.org/downloads/release/python-3100/)
- MongoDB: [https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database)

A small note like this helps new devs get started faster.

---

### ✅ Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yujanThulung/StockProject.git
cd StockProject
```

---

#### 2. Run Flask ML API (Stock Predictor)

```bash
python -m venv venv310
env310\Scripts\activate  
pip install -r requirements.txt
cd ml-model
python run.py
```

> Make sure Flask runs on a dedicated port (e.g., `http://localhost:5000`)

---

#### 3. Run Express Backend

```bash
cd backend
npm install
npm start
```

---

#### 4. Run React Frontend

```bash
cd frontend
npm install
npm run dev
```




---


## 🔐 Environment Variables Setup
> 📁 You can also refer to `.env.example` files in each directory for format.

Create `.env` files in the following locations and fill in your own keys or tokens.

### 📁 flask-api/.env

```env
API_KEY=your_alpha_vantage_api_key
FUNCTION=TIME_SERIES_DAILY
OUTPUTSIZE=full
DATATYPE=csv
START_DATE=2015-01-01

MODEL_PATH=multivariate_lstm_model.h5
SCALER_PATH=scaler.save
WINDOW_SIZE=60

TWELVE_DATA_API_KEY=your_twelve_data_api_key
API_URL=https://www.alphavantage.co/query
```

---

### 📁 backend/.env

```env
MONGO_URI=your_mongodb_connection_string
PORT=8000
JWT_SECRET=your_jwt_secret

FMP_API_KEY=your_fmp_api_key
FINNHUB_API_KEY=your_finnhub_api_key
FINNHUB_WEBSOCKET_URL=wss://ws.finnhub.io
```

---

### 📁 frontend/.env

```env
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_FINNHUB_API_KEY=your_finnhub_public_api_key
```

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![Made with React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Python](https://img.shields.io/badge/ML-Model-Flask-yellow)

---

## 🙋‍♂️ Author

- GitHub: [@yujanThulung](https://github.com/yujanThulung)
- LinkedIn: [Yujan Rai](https://www.linkedin.com/in/yujan-rai)

 ---
## 📷 Screenshots

<img width="1021" height="757" alt="Screenshot 2025-07-31 183907" src="https://github.com/user-attachments/assets/71743d82-579e-44e4-9008-eb0307089f0d" />
<img width="1920" height="1050" alt="screencapture-localhost-5173-dashboard-watch-list-2025-07-31-18_35_33" src="https://github.com/user-attachments/assets/2efab0fc-6dd5-4e04-a673-88957caab327" />
<img width="1920" height="1644" alt="screencapture-localhost-5173-dashboard-stock-prediction-2025-07-31-18_34_28" src="https://github.com/user-attachments/assets/d3855a04-659c-487d-a792-4d7b6ca2616b" />
<img width="1920" height="1972" alt="screencapture-localhost-5173-dashboard-financial-2025-07-31-18_35_07" src="https://github.com/user-attachments/assets/3f5910f5-4afa-4540-89ff-6b40143e7b0a" />
<img width="1920" height="912" alt="screencapture-localhost-5173-dashboard-alert-2025-07-31-18_36_10" src="https://github.com/user-attachments/assets/2cffa441-9e52-4569-9dbc-3bb6fdf5aeb6" />
<img width="1920" height="1720" alt="screencapture-localhost-5173-dashboard-2025-07-31-18_33_40" src="https://github.com/user-attachments/assets/0f6e4a6a-58be-4a54-980d-634392f17b21" />
<img width="1920" height="4132" alt="screencapture-localhost-5173-2025-07-27-21_22_46" src="https://github.com/user-attachments/assets/0ab9ddf6-9b3f-4172-bc46-9c83b9cf0794" />


--- 

