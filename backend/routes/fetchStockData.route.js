import { fetchLosers, fetchGainers } from '../controllers/fetchTopGainerLosers.controller.js';


import express from 'express';
const router = express.Router();


router.get('/top-losers', fetchLosers);
router.get('/top-gainers', fetchGainers);


export default router;
