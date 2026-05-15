import axios from 'axios';
import TopLoser from '../models/TopLoser.model.js';

const fetchAndStoreTopLosers = async () => {
  try {
    const res = await axios.get(
      `https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${process.env.FMP_API_KEY}`
    );

    const data = res.data.slice(0, 15);

    await TopLoser.deleteMany({});
    await TopLoser.insertMany(
      data.map((item) => ({
        symbol: item.symbol,
        name: item.name,
        price: item.price,
        change: item.change,
        changesPercentage: item.changesPercentage,
        dateFetched: new Date(),
      }))
    );

    console.log('Top Losers updated');
  } catch (error) {
    console.error('Error fetching top losers:', error.message);
  }
};

export default fetchAndStoreTopLosers;
