import mongoose from "mongoose";

const topGainerSchema = new mongoose.Schema({
    symbol: String,
    name: String,
    price: Number,
    change: Number,
    changesPercentage: Number,
    dateFetched: {
      type: Date,
      default: Date.now,
    },
})


const TopGainer = mongoose.model("TopGainer", topGainerSchema);
export default TopGainer;