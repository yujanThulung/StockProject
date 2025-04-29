import axios from "axios";


import TopGainer from '../models/TopGainer.model.js';


export const fetchTopGainer = async () => {

    try {
        

    const res = await axios.get(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${process.env.FMP_API_KEY}`);

    const topGainers = res.data;

    await TopGainer.deleteMany({})

    await TopGainer.insertMany(topGainers.map(item =>({
        symbol: item.symbol,
        name: item.name,
        price: item.price,
        change: item.change,
        changesPercentage: item.changesPercentage,
        dateFetched: new Date(),
    })));

    console.log("✅ Top Gainers updated")

    // console.log(topGainers);
} catch (error) {
    console.error("❌ Error fetching top gainers:", error.message);
}
}

export default fetchTopGainer;