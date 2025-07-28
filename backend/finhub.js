import WebSocket from 'ws';

// Configuration
const API_KEY = 'd163otpr01qhvkj60i90d163otpr01qhvkj60i9g';
const TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']; // Add your desired tickers here
const RECONNECT_DELAY = 5000; // 5 seconds delay before reconnecting

// WebSocket client
let socket;

function connectWebSocket() {
  socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

  socket.on('open', () => {
    console.log('WebSocket connected');
    
    // Subscribe to each ticker
    TICKERS.forEach(ticker => {
      socket.send(JSON.stringify({ type: 'subscribe', symbol: ticker }));
      console.log(`Subscribed to ${ticker}`);
    });
  });

  socket.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      if (message.type === 'trade') {
        // Process trade updates
        message.data.forEach(trade => {
          console.log(`[${new Date().toISOString()}] ${trade.s}: $${trade.p} (Volume: ${trade.v})`);
        });
      } else if (message.type === 'ping') {
        // Respond to ping to keep connection alive
        socket.send(JSON.stringify({ type: 'pong' }));
      } else {
        console.log('Received message:', message);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  socket.on('close', () => {
    console.log('WebSocket disconnected. Attempting to reconnect...');
    setTimeout(connectWebSocket, RECONNECT_DELAY);
  });

  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

// Start the connection
connectWebSocket();

// Handle process termination
process.on('SIGINT', () => {
  console.log('Disconnecting...');
  
  // Unsubscribe from all tickers before closing
  if (socket && socket.readyState === WebSocket.OPEN) {
    TICKERS.forEach(ticker => {
      socket.send(JSON.stringify({ type: 'unsubscribe', symbol: ticker }));
    });
    socket.close();
  }
  
  process.exit();
});