let socket;
const subscribed = new Set();

export const initFinnhubSocket = () => {
    if (!socket) {
        const token = "d163otpr01qhvkj60i90d163otpr01qhvkj60i9g";
        const socket = new WebSocket(`wss://ws.finnhub.io?token=${token}`);

        socket.onopen = () => {
            console.log("🔗 Finnhub WebSocket Connected (Client)");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "trade") {
                console.log("📈 Live Trade:", data);
                // Optionally: Update Zustand state or trigger toast here
            }
        };

        socket.onclose = () => console.log("❌ Finnhub WebSocket Disconnected");
        socket.onerror = (err) => console.error("⚠️ Finnhub WebSocket Error:", err);
    }
};

export const subscribeToFinnhub = (symbol) => {
    if (!subscribed.has(symbol) && socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "subscribe", symbol }));
        subscribed.add(symbol);
        console.log(`✅ Subscribed to ${symbol}`);
    }
};

export const unsubscribeFromFinnhub = (symbol) => {
    if (subscribed.has(symbol) && socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
        subscribed.delete(symbol);
        console.log(`🚫 Unsubscribed from ${symbol}`);
    }
};

// Initialize socket when app starts (run in App.jsx or Zustand)
initFinnhubSocket();
