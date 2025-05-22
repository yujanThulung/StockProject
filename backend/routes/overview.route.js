import express from 'express';
import { fetchOverview } from '../controllers/overview.controller.js';

const router = express.Router();

router.get('/overview/:symbol', fetchOverview);


export default router;