import express from 'express';
import TopGainer from '../models/TopGainer.model';
import TopLoser from '../models/TopLoser.model';


const router = express.Router();

// Fetch top gainers
router.get('/top-gainers', async (req, res)=>{
    try {
        const data = await TopGainer.find();
        res.json(data);
    } catch (error) {
        console.error('Error fetching top gainers:', error);
        res.status(500).json({error: 'Failed to fetch top gainers'});
    }
});



// Fetch top losers
router.get('/top-losers', async (req, res)=>{
    try {
        const data = await TopLoser.find();
        res.json(data);
    } catch (error) {
        console.error('Error fetching top losers:', error.message);
        res.status(500).json({error: 'Failed to fetch top losers'});
    }
})


export default router;