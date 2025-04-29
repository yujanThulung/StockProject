import {create} from 'zustand';
import axios from 'axios';


const useStockStore = create((set)=>({
    gainers:[],
    losers:[],
    loading:false,
    error:null,


    fetchGainers:async ()=>{
        set({loading:true,error:null});


        try {
            const res = await axios.get('http://localhost:8000/api/top-gainers');
            set({gainers: res.data, loading:false})
        } catch (error) {
            set({error:error.message,loading:false})
        }
    },

    fetchLosers: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get('http://localhost:8000/api/top-losers');
          set({ losers: res.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
    
      clearError: () => set({ error: null }),
    }));
    
    export default useStockStore;