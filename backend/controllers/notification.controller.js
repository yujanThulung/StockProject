
// this is new code 

import { Notification } from '../models/index.model.js';

// Create new notification
// export const createNotification = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { symbol, targetPrice, message } = req.body;

//     const existitingNotification = await Notification.findOne({ userId, symbol, targetPrice });
//     if (existitingNotification) {
//       console.log(`Notification already exists for ${symbol} at $${targetPrice.toFixed(2)}`);
//       return res.status(400).json({ error: 'Notification already exists for this symbol and target price' });
//     }

//     const notification = new Notification({
//       userId,
//       symbol,
//       targetPrice,
//       message,
//     });

//     await notification.save();

//     console.log(`Notification created: ${symbol} alert at $${targetPrice.toFixed(2)}`);

//     res.status(201).json(notification);
//   } catch (error) {
//     console.error('Create error:', error.message);
//     res.status(400).json({ error: error.message });
//   }
// };



export const createNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { symbol, targetPrice, message, condition } = req.body;

    if (!['gte', 'lte'].includes(condition)) {
      return res.status(400).json({ error: 'Invalid condition. Must be gte or lte.' });
    }

    const existitingNotification = await Notification.findOne({
      userId,
      symbol,
      targetPrice,
      condition,
    });

    if (existitingNotification) {
      console.log(`Notification already exists for ${symbol} at $${targetPrice.toFixed(2)} with condition ${condition}`);
      return res.status(400).json({ error: 'Notification already exists for this symbol, price and condition' });
    }

    const notification = new Notification({
      userId,
      symbol,
      targetPrice,
      message,
      condition,
    });

    await notification.save();

    console.log(`Notification created: ${symbol} alert at $${targetPrice.toFixed(2)} with condition ${condition}`);

    res.status(201).json(notification);
  } catch (error) {
    console.error('Create error:', error.message);
    res.status(400).json({ error: error.message });
  }
};


// Controller: getNotifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { triggered } = req.query;

    const filter = { userId };
    if (triggered === 'true') {
      filter.triggered = true;
    }

    const notifications = await Notification.find(filter).sort({createdAt: -1});

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update notification (price and message)
// export const updateNotification = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { id } = req.params;
//     const { targetPrice, message } = req.body;

//     // Find and update the notification
//     const updatedNotification = await Notification.findOneAndUpdate(
//       { _id: id, userId }, // ensure the user owns this notification
//       { targetPrice, message },
//       { new: true } // return the updated document
//     );

//     if (!updatedNotification) {
//       console.log(`Update failed: Notification with ID ${id} not found or unauthorized.`);
//       return res.status(404).json({ error: 'Notification not found or unauthorized' });
//     }

//     console.log(`Notification updated: ${updatedNotification.symbol} alert updated successfully.`);

//     res.json({
//       message: `${updatedNotification.symbol} alert updated successfully`,
//       data: updatedNotification
//     });
//   } catch (error) {
//     console.error('Update error:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// };



export const updateNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { targetPrice, message, condition } = req.body;

    if (!['gte', 'lte'].includes(condition)) {
      return res.status(400).json({ error: 'Invalid condition. Must be gte or lte.' });
    }

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { targetPrice, message, condition },
      { new: true }
    );

    if (!updatedNotification) {
      console.log(`Update failed: Notification with ID ${id} not found or unauthorized.`);
      return res.status(404).json({ error: 'Notification not found or unauthorized' });
    }

    console.log(`Notification updated: ${updatedNotification.symbol} alert successfully updated.`);

    res.json({
      message: `${updatedNotification.symbol} alert updated successfully`,
      data: updatedNotification,
    });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ error: error.message });
  }
};


// Delete notification with confirmation message
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const deletedNotification = await Notification.findOneAndDelete({ _id: id, userId });

    if (!deletedNotification) {
      console.log(`Delete failed: Notification with ID ${id} not found or unauthorized.`);
      return res.status(404).json({ error: 'Notification not found or unauthorized' });
    }

    console.log(`Notification deleted: ${deletedNotification.symbol} alert deleted successfully.`);

    res.json({ message: `${deletedNotification.symbol} alert deleted successfully` });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

