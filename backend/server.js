import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import cookieParser from 'cookie-parser';


import predictRoute from './routes/predictRoute.routes.js';
import stockRoutes from './routes/fetchStockData.route.js';


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

app.listen(PORT, () => {
    //connectDB();
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`.yellow.bold);
});
