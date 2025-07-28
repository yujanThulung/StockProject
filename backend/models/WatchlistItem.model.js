import mongoose from 'mongoose';

const watchlistItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symbol: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('WatchlistItem', watchlistItemSchema);
