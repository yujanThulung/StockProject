const API_KEY = process.env.REACT_APP_API_KEY;
export const fetchStockData = async()=>{
    try {
        const res = await fetch(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${API_KEY}`);
    } catch (error) {
        
    }
}