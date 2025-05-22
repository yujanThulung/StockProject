// import { create } from "zustand";

// const useStockStore = create((set) => ({
//   ticker: "GOOGL",
//   stockData: null,
//   loading: false,
//   error: null,

//   fetchStockData: async (ticker) => {
//     set({ loading: true, error: null, ticker });

//     try {
//       const response = await fetch(`http://localhost:8000/api/overview/${ticker}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch stock data");
//       }

//       const data = await response.json();
//       console.log(data);
//       set({
//         stockData: data,
//         loading: false,
//       });
//     } catch (error) {
//       set({
//         error: error.message,
//         loading: false,
//       });
//     }
//   },
// }));

// export default useStockStore;




