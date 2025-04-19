import {create} from 'zustand';



const useStockStore = create((set)=>({
    ticker: 'AAPL',
    days: 3,
    data:[],
    loading: false,
    error:null,

    setTicker:(ticker)=> set({ticker}),
    setDays: (days)=> set({days}),
    setData: (data)=> set({data}),
    setLoading: (loading)=> set({loading}),
    setError: (error)=> set({error}),

}));

export default useStockStore;