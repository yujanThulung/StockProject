// models/Notification.model.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  targetPrice: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    enum: ['gte', 'lte'], // 'gte' = ≥, 'lte' = ≤
    required: true,
    default: 'gte',
  },
  triggered: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
