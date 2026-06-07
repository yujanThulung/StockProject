<div align="center">

# NuroStock

**A smart stock prediction and alerting platform powered by AI.**  
Visualize real-time market trends, get LSTM-based price predictions, and track your favorite stocks.

<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white&labelColor=20232A)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Flask](https://img.shields.io/badge/LSTM_API-Flask-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![FastAPI](https://img.shields.io/badge/Sentiment_API-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

</div>

---

## Features

- User authentication with JWT
- Real-time stock charts and volume via Finnhub WebSocket
- AI-based stock price prediction using LSTM
- News sentiment analysis using a fine-tuned NLP model
- Watchlist management
- Custom price alerts
- Top gainers / losers view
- Financials and analytics overview

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&labelColor=20232A) | React, Zustand, ApexCharts, Tailwind CSS |
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) | Express.js, Socket.IO, Mongoose |
| ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) | MongoDB Atlas |
| ![Flask](https://img.shields.io/badge/-Flask-000000?logo=flask&logoColor=white) | LSTM prediction model (TensorFlow / Keras) |
| ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?logo=fastapi&logoColor=white) | Sentiment analysis (Transformers / Uvicorn) |

---

## Project Structure

```
StockProject/
├── frontend/          # React app              → port 5173
├── backend/           # Node.js Express API    → port 8000
└── ml-model/
    ├── lstm/          # LSTM prediction API    → port 8080
    ├── sentiment/     # Sentiment analysis API → port 5001
    ├── start.sh       # Unified launcher (Linux / macOS)
    └── start.bat      # Unified launcher (Windows)
```

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) | v18+ | [nodejs.org](https://nodejs.org) |
| ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white) | 3.10+ | [python.org](https://www.python.org/downloads/) |
| ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) | Atlas (cloud) | [mongodb.com/atlas](https://www.mongodb.com/atlas/database) |
| ![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white) | Latest | [git-scm.com](https://git-scm.com) |

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yujanThulung/StockProject.git
cd StockProject
```

---

### 2. Backend — Node.js + Express

```bash
cd backend
npm install
npm start
```

> Runs on `http://localhost:8000`

---

### 3. Frontend — React

```bash
cd frontend
npm install
npm run dev
```

> Runs on `http://localhost:5173`

---

### 4. ML Services — LSTM + Sentiment

Both ML services (LSTM and Sentiment) share a **single unified launcher** inside `ml-model/`.  
Before running, make sure each service has its own Python virtual environment set up (see [Manual Setup](#manual-venv-setup) below).

#### Quick Start (Recommended)

**Linux / macOS**
```bash
cd ml-model
chmod +x start.sh
./start.sh
```

**Windows**
```bat
cd ml-model
start.bat
```

The launcher starts both APIs simultaneously:

| Service | URL |
|---------|-----|
| LSTM API | `http://localhost:8080` |
| Sentiment API | `http://localhost:5001` |

> **Linux/macOS**: Press `Ctrl+C` to stop both services at once.  
> **Windows**: Close the two terminal windows that open.

---

#### Manual venv Setup

If the virtual environments don't exist yet, create them once before using the launcher.

**LSTM API**

```bash
# Linux / macOS
cd ml-model/lstm
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
```

```bat
:: Windows
cd ml-model\lstm
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
deactivate
```

**Sentiment API**

```bash
# Linux / macOS
cd ml-model/sentiment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
```

```bat
:: Windows
cd ml-model\sentiment
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
deactivate
```

> The launcher calls each service's venv Python binary directly (`./venv/bin/python3`) to avoid version conflicts with the system Python.

---

### All Services at a Glance

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | `http://localhost:5173` | React dev server |
| Backend | `http://localhost:8000` | Express + Socket.IO |
| LSTM API | `http://localhost:8080` | Flask prediction server |
| Sentiment API | `http://localhost:5001` | FastAPI sentiment server |

> The backend proxies all ML requests — the frontend never calls the ML services directly.

---

## Environment Variables

Each service ships with a `.env.example` file. Copy it to `.env` and fill in your values.

| Service | Example File |
|---------|-------------|
| Backend | [`backend/.env.example`](backend/.env.example) |
| Frontend | [`frontend/.env.example`](frontend/.env.example) |
| LSTM API | [`ml-model/lstm/.env.example`](ml-model/lstm/.env.example) |
| Sentiment API | [`ml-model/sentiment/.env.example`](ml-model/sentiment/.env.example) |

```bash
# Quick copy commands
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp ml-model/lstm/.env.example ml-model/lstm/.env
cp ml-model/sentiment/.env.example ml-model/sentiment/.env
```

---

## Screenshots

<img width="1021" height="757" alt="Dashboard" src="https://github.com/user-attachments/assets/71743d82-579e-44e4-9008-eb0307089f0d" />
<img width="1920" height="1050" alt="Watchlist" src="https://github.com/user-attachments/assets/2efab0fc-6dd5-4e04-a673-88957caab327" />
<img width="1920" height="1644" alt="Stock Prediction" src="https://github.com/user-attachments/assets/d3855a04-659c-487d-a792-4d7b6ca2616b" />
<img width="1920" height="1972" alt="Financials" src="https://github.com/user-attachments/assets/3f5910f5-4afa-4540-89ff-6b40143e7b0a" />
<img width="1920" height="912" alt="Alerts" src="https://github.com/user-attachments/assets/2cffa441-9e52-4569-9dbc-3bb6fdf5aeb6" />
<img width="1920" height="1720" alt="Dashboard Home" src="https://github.com/user-attachments/assets/0f6e4a6a-58be-4a54-980d-634392f17b21" />
<img width="1920" height="4132" alt="Landing Page" src="https://github.com/user-attachments/assets/0ab9ddf6-9b3f-4172-bc46-9c83b9cf0794" />

---

## Author

[![GitHub](https://img.shields.io/badge/GitHub-yujanThulung-181717?logo=github&logoColor=white)](https://github.com/yujanThulung)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Yujan_Rai-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yujan-rai)
