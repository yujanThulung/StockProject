import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import cookieParser from 'cookie-parser';


import predictRoute from './routes/predictRoute.routes.js';
import stockRoutes from './routes/fetchStockData.route.js';

import TopGainer from './models/TopGainer.model.js';
import TopLoser from './models/TopLoser.model.js';

import connectDB from './config/db.js';


import "./jobs/dailyUpdate.js";
import fetchAndStoreTopLosers from './services/fetchAndStoreTopLosers.service.js';
import fetchAndStoreTopGainers from './services/fetchAndTopGainer.service.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is running...');
});


app.use("/api",predictRoute);
app.use("/api",stockRoutes)
console.log("API routes initialized");

// API routes
app.get("/api/top-gainers", async (req, res) => {
  const data = await TopGainer.find({});
  res.json(data);
});

app.get("/api/top-losers", async (req, res) => {
  const data = await TopLoser.find({});
  res.json(data);
});


// connectDB();
// app.listen(PORT, () => {
//     //connectDB();
//     console.log(Server is running on port ${PORT});
//     console.log(http://localhost:${PORT}.yellow.bold);
// });



const start = async ()=>{
  try {
    await connectDB();


    // await fetchAndStoreTopLosers();
    // await fetchAndStoreTopGainers();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`.yellow.bold);
    })
  } catch (error) {
    console.error("❌ Error during server startup:", error.message);
    process.exit(1); 
  }
};

start();


