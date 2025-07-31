// import WebSocket from 'ws';

// let ws;
// const subscribedSymbols = new Set();

// export const connectFinnhubSocket = (apiKey) => {
//     if (ws) return ws; // reuse if exists

//     ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);

//     ws.on('open', () => console.log('Finnhub WebSocket Connected'));
//     ws.on('message', (data) => handleSocketData(JSON.parse(data)));
//     ws.on('close', () => console.log('Finnhub WebSocket Disconnected'));
//     ws.on('error', (err) => console.error('Finnhub WS Error:', err));

//     return ws;
// };

// const handleSocketData = (data) => {
//     if (data.type === 'trade') {
//         const trades = data.data;
//         trades.forEach(trade => {
//             const { s: symbol, p: price } = trade;
//             checkAlerts(symbol, price);
//         });
//     }
// };



// import Notification from '../models/Notification.model.js';
// const checkAlerts = async (symbol, price) => {
//     const alerts = await Notification.find({ symbol, triggered: false });
//     alerts.forEach(async (alert) => {
//         if (price >= alert.targetPrice) {
//             alert.triggered = true;
//             await alert.save();
//             console.log(`🎯 Alert Triggered for ${symbol} at $${price}`);
            

//             // ✅ Emit to specific user room
//             io.to(alert.userId.toString()).emit('alert_triggered', {
//                 symbol,
//                 targetPrice: alert.targetPrice,
//                 price,
//                 message: alert.message,
//                 _id: alert._id,
//             });
//         }
//     });
// };

// export const subscribeSymbol = (symbol) => {
//     if (!subscribedSymbols.has(symbol) && ws && ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({ type: 'subscribe', symbol }));
//         subscribedSymbols.add(symbol);
//     }
// };

// export const unsubscribeSymbol = (symbol) => {
//     if (subscribedSymbols.has(symbol) && ws && ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
//         subscribedSymbols.delete(symbol);
//     }
// };









// services/finnhubService.js
import WebSocket from 'ws';
import { Notification } from '../models/index.model.js';

let ws;
const subscribedSymbols = new Set();
let io; // <- This will hold your socket instance

export const setSocketIO = (ioInstance) => {
  io = ioInstance; // <- Store socket.io instance
};

export const connectWebSocket = () => {
  if (ws) return;

  ws = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);

  ws.on('open', () => console.log('📡 Finnhub WebSocket Connected'));

  ws.on('message', async (rawData) => {
    const data = JSON.parse(rawData);
    if (data.type === 'trade') {
      const trades = data.data;
      for (const trade of trades) {
        const { s: symbol, p: price } = trade;
        await checkAlerts(symbol, price);
      }
    }
  });

  ws.on('close', () => console.log('❌ Finnhub WebSocket Disconnected'));
  ws.on('error', (err) => console.error('🛑 Finnhub WS Error:', err));
};

const checkAlerts = async (symbol, price) => {
  const alerts = await Notification.find({ symbol, triggered: false });

  for (const alert of alerts) {
    const shouldTrigger =
      (alert.condition === 'gte' && price >= alert.targetPrice) ||
      (alert.condition === 'lte' && price <= alert.targetPrice);

    if (shouldTrigger) {
      alert.triggered = true;
      await alert.save();

      console.log(`🎯 Alert triggered for ${symbol} @ $${price}`);

      // 🟡 Send real-time notification to user
      if (io) {
        io.to(alert.userId.toString()).emit('alert_triggered', {
          symbol,
          targetPrice: alert.targetPrice,
          price,
          message: alert.message || `Alert for ${symbol} triggered at $${price}`,
          _id: alert._id,
        });
      }
    }
  }
};

export const subscribeSymbol = (symbol) => {
  if (!subscribedSymbols.has(symbol) && ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'subscribe', symbol }));
    subscribedSymbols.add(symbol);
  }
};

export const unsubscribeSymbol = (symbol) => {
  if (subscribedSymbols.has(symbol) && ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    subscribedSymbols.delete(symbol);
  }
};
