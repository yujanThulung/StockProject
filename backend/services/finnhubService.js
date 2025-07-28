
import WebSocket from 'ws';
import { Notification } from '../models/index.model.js';
import WatchlistItem from '../models/WatchlistItem.model.js';

const API_KEY = process.env.FINNHUB_API_KEY;
const RECONNECT_DELAY = 5000;

let socket;
let subscribedTickers = new Set();
let ioInstance = null;

async function connectWebSocket() {
  socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

  socket.on('open', async () => {
    console.log('✅ Finnhub WebSocket connected');
    await resubscribeAllFromDB(); // Updated to fetch from DB
  });

  socket.on('message', async (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === 'trade') {
  for (const trade of message.data) {
    const payload = {
      symbol: trade.s,
      price: trade.p,
      volume: trade.v,
      time: trade.t,
    };

    console.log('📡 Sending live quote:', payload);

    if (ioInstance) {
      ioInstance.to(payload.symbol).emit('finnhub_data', payload);
    }

    // 🔔 Find matching alerts for both gte and lte
    const notifications = await Notification.find({
      symbol: trade.s,
      triggered: false,
      $or: [
        { condition: 'gte', targetPrice: { $lte: trade.p } },
        { condition: 'lte', targetPrice: { $gte: trade.p } },
      ]
    });

    for (const notification of notifications) {
      const userRoom = notification.userId.toString();

      ioInstance.to(userRoom).emit('price_alert', {
        symbol: trade.s,
        currentPrice: trade.p,
        message: notification.message,
        alertId: notification._id,
        triggeredAt: trade.t,
      });

      console.log(`🔔 Alert sent to user ${userRoom}: ${notification.symbol} hit $${trade.p}`);

      notification.triggered = true;
      await notification.save();
    }
  }
}

    } catch (err) {
      console.error('❌ Message parsing or notification error:', err.message);
    }
  });

  socket.on('close', () => {
    console.log('⚠️ Finnhub WebSocket closed. Reconnecting...');
    setTimeout(connectWebSocket, RECONNECT_DELAY);
  });

  socket.on('error', (error) => {
    console.error('❌ Finnhub WebSocket error:', error.message);
  });
}

function setSocketIO(io) {
  ioInstance = io;
}

async function resubscribeAllFromDB() {
  try {
    const items = await WatchlistItem.find({});
    const uniqueSymbols = [...new Set(items.map(item => item.symbol.toUpperCase()))];

    uniqueSymbols.forEach(symbol => {
      if (!subscribedTickers.has(symbol)) {
        subscribedTickers.add(symbol);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'subscribe', symbol }));
          console.log(`🔄 Resubscribed to ${symbol} from DB`);
        }
      }
    });
  } catch (err) {
    console.error('❌ Failed to resubscribe from DB:', err.message);
  }
}

function subscribe(ticker) {
  ticker = ticker.toUpperCase();
  if (!subscribedTickers.has(ticker)) {
    subscribedTickers.add(ticker);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'subscribe', symbol: ticker }));
      console.log(`✅ Subscribed to ${ticker}`);
    }
  }
}

function unsubscribe(ticker) {
  ticker = ticker.toUpperCase();
  if (subscribedTickers.has(ticker)) {
    subscribedTickers.delete(ticker);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'unsubscribe', symbol: ticker }));
      console.log(`❌ Unsubscribed from ${ticker}`);
    }
  }
}

function getSubscriptions() {
  return Array.from(subscribedTickers);
}

export {
  connectWebSocket,
  setSocketIO,
  subscribe,
  unsubscribe,
  getSubscriptions,
};
