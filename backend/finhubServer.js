// backend/index.js
import WebSocket from 'ws';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_URL = `${process.env.FINNHUB_WEBSOCKET_URL}?token=${API_KEY}`;

const RECONNECT_DELAY = 5000;

let socket;
let subscribedTickers = new Set(); // Currently subscribed tickers

// Server setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Connect to Finnhub WebSocket
function connectWebSocket() {
  socket = new WebSocket(FINNHUB_URL);

  socket.on('open', () => {
    console.log('WebSocket connected to Finnhub');
    subscribedTickers.forEach(symbol => {
      socket.send(JSON.stringify({ type: 'subscribe', symbol }));
    });
  });

  socket.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      if (message.type === 'trade') {
        message.data.forEach(trade => {
          io.emit('trade', {
            symbol: trade.s,
            price: trade.p,
            volume: trade.v,
            time: trade.t
          });
        });
      }
    } catch (error) {
      console.error('Message parse error:', error);
    }
  });

  socket.on('close', () => {
    console.log('Finnhub disconnected. Reconnecting...');
    setTimeout(connectWebSocket, RECONNECT_DELAY);
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
}

// Handle UI interactions via Socket.IO
io.on('connection', (client) => {
  console.log('UI connected');

  client.on('subscribe', (symbol) => {
    if (!subscribedTickers.has(symbol)) {
      subscribedTickers.add(symbol);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'subscribe', symbol }));
      }
      console.log(`Subscribed to ${symbol}`);
    }
  });

  client.on('unsubscribe', (symbol) => {
    if (subscribedTickers.has(symbol)) {
      subscribedTickers.delete(symbol);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
      }
      console.log(`Unsubscribed from ${symbol}`);
    }
  });

  client.on('resubscribe_all', () => {
    subscribedTickers.forEach(symbol => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'subscribe', symbol }));
      }
    });
    console.log('Resubscribed to all tickers');
  });

  client.on('disconnect', () => {
    console.log('UI disconnected');
  });
});

// Start
server.listen(5000, () => console.log('Server listening on port 5000'));
connectWebSocket();
