import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

import logTimeCounter from './middleware/logTimeCounter.middleware.js';
import stockRoutes from './routes/fetchStockData.route.js';
import overview from './routes/overview.route.js';
import connectDB from './config/db.js';
import { startScheduledJobs } from './jobs/dailyUpdate.js';
import authRoutes from './routes/auth.route.js';
import watchlistRoutes from './routes/watchlist.route.js';
import authenticate from './middleware/authenticate.middleware.js';
import notificationRoutes from './routes/notification.route.js';
import { startPriceWatcher } from './services/priceWatcher.service.js';

// 🆕 Finnhub WebSocket Manager
import { connectWebSocket, setSocketIO } from './services/finnhubService.js';
import finnhubRoutes from './routes/finnhub.route.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // For socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

const PORT = process.env.PORT || 8000;

console.log('🔧 Initializing server setup...');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logTimeCounter);

// Routes
app.get('/', (req, res) => {
  res.send('✅ Server is running...');
});
app.use('/api', authRoutes);
app.use('/api', stockRoutes);
app.use('/api', overview);
app.use('/api/watchlist', authenticate, watchlistRoutes);
app.use('/api/alert', notificationRoutes);
app.use('/api/finnhub', finnhubRoutes);

// 🔌 Handle socket.io connections
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("join-room", (symbol) => {
    symbol = symbol.toUpperCase();
    socket.join(symbol);
    console.log(`📥 Socket ${socket.id} joined room: ${symbol}`);
  });

  socket.on("subscribe", (symbol) => {
    console.log(`📡 Client subscribed to ${symbol}`);
    // optional: you could call subscribe(symbol) here too
  });

  socket.on("unsubscribe", (symbol) => {
    socket.leave(symbol);
    console.log(`📤 Socket ${socket.id} left room: ${symbol}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});


// Inject io into service
setSocketIO(io);
connectWebSocket(); 

// Start app
const start = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`.yellow.bold);
      startScheduledJobs(); // Optional: your cron or daily jobs
    });
  } catch (error) {
    console.error('❌ Error during server startup:', error.message);
    process.exit(1);
  }
};

start();
