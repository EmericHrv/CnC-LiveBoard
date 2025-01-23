import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Endpoint de connexion
router.post('/login', loginLimiter, async (req, res) => {
    console.log('Requête de connexion reçue');
    console.log('Corps de la requête :', req.body);

    try {
        const { username, password } = req.body;
        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ error: 'Nom d\'utilisateur ou mot de passe invalide' });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '48h' },
        );
        res.send({ token });
    } catch (error) {
        res.status(500).send({ error: 'Erreur interne du serveur.' });
    }
});

export default router;
