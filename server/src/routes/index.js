import express from 'express';
import authRoutes from './authRoutes.js';
import startupRoutes from './startupRoutes.js';
import investorRoutes from './investorRoutes.js';
import professionalRoutes from './professionalRoutes.js';
import systemRoutes from './systemRoutes.js';
import networkRoutes from './networkRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.get('/status', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

router.use('/auth', authRoutes);
router.use('/startups', startupRoutes);
router.use('/investors', investorRoutes);
router.use('/professionals', professionalRoutes);
router.use('/system', systemRoutes);
router.use('/network', networkRoutes);
router.use('/users', userRoutes);

export default router;
