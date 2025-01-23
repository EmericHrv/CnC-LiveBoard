import express from 'express';
import authRoutes from './auth.js';
import fffRoutes from './fff.js';
import eventsRoutes from './events.js';
import imageRoutes from './images.js';
import postRoutes from './posts.js';

const router = express.Router();

// Définir les routes des modules
router.use('/auth', authRoutes);
router.use('/fff', fffRoutes);
router.use('/events', eventsRoutes);
router.use('/images', imageRoutes);
router.use('/posts', postRoutes);

// Gestion des erreurs 404 pour des routes inexistantes
router.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

export default router;
