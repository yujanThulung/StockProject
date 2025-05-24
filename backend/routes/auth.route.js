import express from 'express';
import { validateSignup,authenticate } from "../middleware/index.middleware.js";
import { signup,login,logout,updateUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login',login);
router.post('/logout',logout);
router.put('/update-user',authenticate,updateUser);

export default router;