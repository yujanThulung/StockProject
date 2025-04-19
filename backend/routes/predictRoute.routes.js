import express from 'express';
import { fetchPrediction } from '../controllers/prediction.controller.js';

const router = express.Router();

router.post('/predict', fetchPrediction);

export default router;
