import WebSocket from 'ws';
import Notification from '../models/index.model.js';

const API_KEY = 'd163otpr01qhvkj60i90d163otpr01qhvkj60i9g';
let socket;

async function checkPriceAlerts(symbol, price) {
    const notifications = await Notification.find({
        symbol,
        triggered: false,
        $or: [
            { targetPrice: { $lte: price } }, // For price >= target (buy alerts)
            { targetPrice: { $gte: price } }  // For price <= target (sell alerts)
        ]
    });

    notifications.forEach(async (notification) => {
        notification.triggered = true;
        await notification.save();
        console.log(`Notification triggered: ${notification.message}`);
        // Here you could add real-time notification logic (Socket.io, email, etc.)
    });
}

function startPriceWatcher() {
    socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

    socket.on('open', async () => {
        console.log('Connected to price watcher');
        const activeSymbols = await Notification.distinct('symbol', { triggered: false });
        activeSymbols.forEach(symbol => {
            socket.send(JSON.stringify({ type: 'subscribe', symbol }));
        });
    });

    socket.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === 'trade') {
            message.data.forEach(trade => {
                checkPriceAlerts(trade.s, trade.p);
            });
        }
    });

    socket.on('error', (err) => {
        console.error('Price watcher error:', err);
    });
}

export { startPriceWatcher };