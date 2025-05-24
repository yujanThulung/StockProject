

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import colors from 'colors';
// import cookieParser from 'cookie-parser';

// import logTimeCounter from './middleware/logTimeCounter.middleware.js';


// import stockRoutes from './routes/fetchStockData.route.js';
// import overview from './routes/overview.route.js';
// import connectDB from './config/db.js';
// import { startScheduledJobs } from './jobs/dailyUpdate.js';

// import authRoutes from './routes/auth.route.js';

// dotenv.config();
// const app = express();

// connectDB();


// const PORT = process.env.PORT || 8000;

// console.log("🔧 Initializing server setup...");
// // Middleware setup
// console.time("Startup: Middleware Setup");
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(logTimeCounter);


// console.timeEnd("Startup: Middleware Setup");

// // Health check route
// app.get('/', (req, res) => {
//   res.send('✅ Server is running...');
// });

// // Routes
// console.time("Startup: Route Setup");
// app.use("/api",authRoutes);
// app.use("/api", stockRoutes);
// app.use('/api',overview);



// console.timeEnd("Startup: Route Setup");

// console.log("✅ Routes initialized");

// // Start server with timing breakdown
// const start = async () => {
//   try {
//     console.time("Startup: Total");

//     console.time("Startup: DB Connection");
//     await connectDB();
//     console.timeEnd("Startup: DB Connection");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on port ${PORT}`);
//       console.log(`🌐 http://localhost:${PORT}`.yellow.bold);

//       console.time("Startup: Cron Jobs");
//       startScheduledJobs();
//       console.timeEnd("Startup: Cron Jobs");
//       console.timeEnd("Startup: Total");
//     });

//   } catch (error) {
//     console.error("❌ Error during server startup:", error.message);
//     process.exit(1);
//   }
// };


// start();



import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import logTimeCounter from './middleware/logTimeCounter.middleware.js';
import stockRoutes from './routes/fetchStockData.route.js';
import overview from './routes/overview.route.js';
import connectDB from './config/db.js';
import { startScheduledJobs } from './jobs/dailyUpdate.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

console.log("🔧 Initializing server setup...");

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logTimeCounter);

// Routes
app.get('/', (req, res) => {
  res.send('✅ Server is running...');
});

app.use("/api", authRoutes);
app.use("/api", stockRoutes);
app.use('/api', overview);

const start = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`.yellow.bold);
      startScheduledJobs();
    });
  } catch (error) {
    console.error("❌ Error during server startup:", error.message);
    process.exit(1);
  }
};

start();