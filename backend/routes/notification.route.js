// import express from 'express';
// import { createAlert, getAlerts, deleteAlert, updateAlert } from '../controllers/notification.controller.js';
// import authenticate from '../middleware/authenticate.middleware.js';

// const router = express.Router();

// router.post('/alert', authenticate, createAlert);
// router.put('/alert/:id', authenticate, updateAlert); // Assuming this is for updating an alert
// router.get('/alert', authenticate, getAlerts);
// router.delete('/alert/:id', authenticate, deleteAlert);

// export default router;



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