import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import User from '../models/user.model.js';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Limiteur de tentatives pour l'authentification
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite à 5 tentatives
    message: { error: 'Trop de tentatives, veuillez réessayer plus tard.' },
});

// Schéma Joi pour la validation
const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
    userId: Joi.string().required(),
    newPassword: Joi.string()
        .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}'))
        .required(),
});

// Endpoint de connexion
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }

        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ error: 'Nom d\'utilisateur ou mot de passe invalide' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '48h' },
        );

        res.send({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).send({ error: 'Erreur interne du serveur.' });
    }
});

// Endpoint pour changer le mot de passe
router.post('/change-password', async (req, res) => {
    try {
        const { error } = changePasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }

        const { userId, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user || !user.first_login) {
            return res.status(404).send({ error: 'Utilisateur introuvable ou non autorisé.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.first_login = false;
        await user.save();

        res.send({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe :', error);
        res.status(500).send({ error: 'Erreur interne du serveur.' });
    }
});

export default router;
