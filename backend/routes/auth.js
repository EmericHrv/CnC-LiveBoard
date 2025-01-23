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
    console.log('Requête de connexion reçue');
    console.log('Corps de la requête :', req.body);

    try {
        // Validation de la requête
        const { error } = loginSchema.validate(req.body);
        if (error) {
            console.warn('Erreur de validation :', error.details[0].message);
            return res.status(400).send({ error: error.details[0].message });
        }

        const { username, password } = req.body;

        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ username });
        if (!user) {
            console.warn('Utilisateur non trouvé pour le nom d\'utilisateur :', username);
            return res.status(401).send({ error: 'Nom d\'utilisateur ou mot de passe invalide' });
        }

        console.log('Utilisateur trouvé :', user);

        // Comparaison des mots de passe
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.warn('Mot de passe incorrect pour l\'utilisateur :', username);
            return res.status(401).send({ error: 'Nom d\'utilisateur ou mot de passe invalide' });
        }

        console.log('Mot de passe validé pour l\'utilisateur :', username);

        // Génération du token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '48h' },
        );

        console.log('Token JWT généré avec succès pour l\'utilisateur :', username);

        res.send({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).send({ error: 'Erreur interne du serveur.' });
    }
});

// Endpoint pour changer le mot de passe
router.post('/change-password', async (req, res) => {
    console.log('Requête de changement de mot de passe reçue');
    console.log('Corps de la requête :', req.body);

    try {
        // Validation de la requête
        const { error } = changePasswordSchema.validate(req.body);
        if (error) {
            console.warn('Erreur de validation :', error.details[0].message);
            return res.status(400).send({ error: error.details[0].message });
        }

        const { userId, newPassword } = req.body;

        // Recherche de l'utilisateur
        const user = await User.findById(userId);
        if (!user) {
            console.warn('Utilisateur non trouvé pour l\'ID :', userId);
            return res.status(404).send({ error: 'Utilisateur introuvable ou non autorisé.' });
        }

        if (!user.first_login) {
            console.warn('Tentative de changer un mot de passe pour un utilisateur non autorisé :', userId);
            return res.status(403).send({ error: 'Changement de mot de passe non autorisé.' });
        }

        // Mise à jour du mot de passe
        user.password = await bcrypt.hash(newPassword, 10);
        user.first_login = false;
        await user.save();

        console.log('Mot de passe changé avec succès pour l\'utilisateur :', user.username);

        res.send({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe :', error);
        res.status(500).send({ error: 'Erreur interne du serveur.' });
    }
});

export default router;
