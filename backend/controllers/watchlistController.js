// import WatchlistItem from '../models/WatchlistItem.model.js';

// // Add item to watchlist
// export const addToWatchlist = async (req, res) => {
//   try {
//     let { symbol} = req.body;
//     const userId = req.user.userId;

//     symbol = symbol.toUpperCase();

//     const existingItem = await WatchlistItem.findOne({userId,symbol});

//     if(existingItem){
//       return res.status(400).json({error: 'Symbol already exists in watchlist'})
//     }


//     const newItem = new WatchlistItem({ userId, symbol});
//     await newItem.save();

//     res.status(201).json(newItem);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error', details: error.message });
//   }
// };

// // Get user's watchlist
// export const getWatchlist = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const items = await WatchlistItem.find({ userId });
//     res.json(items);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };



// // Remove item from watchlist
// export const removeFromWatchlist = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const itemId = req.params.id;

//     const item = await WatchlistItem.findOneAndDelete({ _id: itemId, userId });
//     if (!item) {
//       return res.status(404).json({ error: 'Item not found' });
//     }

//     res.json({ message: 'Item removed' });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };




import WatchlistItem from '../models/WatchlistItem.model.js';
import { subscribe, unsubscribe } from '../services/finnhubService.js';

// Add item to watchlist
export const addToWatchlist = async (req, res) => {
  try {
    let { symbol } = req.body;
    const userId = req.user.userId;

    symbol = symbol.toUpperCase();

    const existingItem = await WatchlistItem.findOne({ userId, symbol });
    if (existingItem) {
      return res.status(400).json({ error: 'Symbol already exists in watchlist' });
    }

    const newItem = new WatchlistItem({ userId, symbol });
    await newItem.save();

    // Subscribe to Finnhub WebSocket if not already subscribed
    subscribe(symbol);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get user's watchlist
export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const items = await WatchlistItem.find({ userId }).sort({createdAt: -1});
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove item from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const itemId = req.params.id;

    const item = await WatchlistItem.findOneAndDelete({ _id: itemId, userId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const symbol = item.symbol;

    const count = await WatchlistItem.countDocuments({ symbol });
    console.log(`🧾 Remaining watchers for ${symbol}: ${count}`);
if (count === 0) {
  console.log(`👉 No more watchers for ${symbol}, unsubscribing...`);
  unsubscribe(symbol);
}


    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
