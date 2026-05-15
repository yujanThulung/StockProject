import express from 'express';
import authenticate from '../middleware/authenticate.middleware.js';
import authorizeAdmin from '../middleware/authorizeAdmin.middleware.js';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authenticate, authorizeAdmin);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
