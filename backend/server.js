import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
import notificationRoutes from './routes/notification.route.js';
import { connectWebSocket, setSocketIO } from './services/finnhubService.js';
import finnhubRoutes from './routes/finnhub.route.js';
import adminRoutes from './routes/admin.route.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

const PORT = process.env.PORT || 8000;

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
app.get('/', (_req, res) => {
  res.send('Server is running');
});
app.use('/api', authRoutes);
app.use('/api', stockRoutes);
app.use('/api', overview);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/alert', notificationRoutes);
app.use('/api/finnhub', finnhubRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (symbol) => {
    symbol = symbol.toUpperCase();
    socket.join(symbol);
    console.log(`Socket ${socket.id} joined room: ${symbol}`);
  });

  socket.on('subscribe', (symbol) => {
    console.log(`Client subscribed to ${symbol}`);
  });

  socket.on('unsubscribe', (symbol) => {
    socket.leave(symbol);
    console.log(`Socket ${socket.id} left room: ${symbol}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

setSocketIO(io);
connectWebSocket();

const start = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      startScheduledJobs();
    });
  } catch (error) {
    console.error('Error during server startup:', error.message);
    process.exit(1);
  }
};

start();
