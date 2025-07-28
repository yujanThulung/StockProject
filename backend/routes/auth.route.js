import express from 'express';
import { validateSignup,authenticate } from "../middleware/index.middleware.js";
import { signup,login,logout,updateUser,checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login',login);
router.post('/logout',authenticate,logout);
router.put('/update-user',authenticate,updateUser);
router.get('/check-auth', authenticate, checkAuth);

export default router;