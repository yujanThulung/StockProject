import WebSocket from 'ws';

let ws;
const subscribedSymbols = new Set();

export const connectFinnhubSocket = (apiKey) => {
    if (ws) return ws; // reuse if exists

    ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);

    ws.on('open', () => console.log('Finnhub WebSocket Connected'));
    ws.on('message', (data) => handleSocketData(JSON.parse(data)));
    ws.on('close', () => console.log('Finnhub WebSocket Disconnected'));
    ws.on('error', (err) => console.error('Finnhub WS Error:', err));

    return ws;
};

const handleSocketData = (data) => {
    if (data.type === 'trade') {
        const trades = data.data;
        trades.forEach(trade => {
            const { s: symbol, p: price } = trade;
            checkAlerts(symbol, price);
        });
    }
};

import Notification from '../models/Notification.model.js';
const checkAlerts = async (symbol, price) => {
    const alerts = await Notification.find({ symbol, triggered: false });
    alerts.forEach(async (alert) => {
        if (price >= alert.targetPrice) {
            alert.triggered = true;
            await alert.save();
            console.log(`🎯 Alert Triggered for ${symbol} at $${price}`);
            // Optionally: Emit via socket.io to frontend if needed later
        }
    });
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
