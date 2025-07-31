

import express from 'express';
import {
    createNotification,
    updateNotification,
    getNotifications,
    deleteNotification
} from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/authenticate.middleware.js'; 

const router = express.Router();

router.use(authMiddleware);

router.post('/add', createNotification);
router.get('/view', getNotifications);
router.put('/update/:id', updateNotification); 
router.delete('/delete/:id', deleteNotification);

export default router;