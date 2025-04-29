import mongoose from "mongoose";

const topLoserSchema = new mongoose.Schema({
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

const TopLoser = mongoose.model("TopLoser", topLoserSchema);
export default TopLoser;