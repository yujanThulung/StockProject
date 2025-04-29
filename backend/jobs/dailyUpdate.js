import cron from 'node-cron';

import fetchAndStoreTopGainers from '../services/fetchAndTopGainer.service.js';
import fetchAndStoreTopLosers from '../services/fetchAndStoreTopLosers.service.js';


cron.schedule("0 16 * * *", async ()=>{
    console.log("🕓 Running daily update job...");
    await fetchAndStoreTopGainers();
  await fetchAndStoreTopLosers();
  console.log("✅ Daily update completed");
})