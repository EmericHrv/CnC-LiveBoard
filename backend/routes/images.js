import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import Image from '../models/image.model.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Chemin pour le stockage des images dans le volume Docker
const UPLOADS_DIR = path.join('assets', 'uploads');

// Vérifiez que le dossier existe, sinon créez-le
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configuration de Multer pour le stockage local
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR); // Dossier pour le stockage
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}.jpg`; // Génère un nom unique avec UUID
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Endpoint pour uploader une image
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            console.error('No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('=== File Received ===');
        console.log(file);

        // Nouveau chemin pour le fichier optimisé
        const optimizedFileName = `${uuidv4()}.jpg`; // Nouveau nom pour le fichier optimisé
        const optimizedPath = path.join(UPLOADS_DIR, optimizedFileName);

        console.log(`Original file path: ${file.path}`);
        console.log(`Optimized file path: ${optimizedPath}`);

        // Optimisation de l'image avec Sharp
        await sharp(file.path)
            .jpeg({ quality: 80 }) // Compression pour optimiser l'image
            .toFile(optimizedPath);

        console.log('File optimized successfully');

        // Supprimer le fichier original après optimisation
        fs.unlinkSync(file.path);

        // Enregistrer les métadonnées dans MongoDB
        const newImage = new Image({
            name: optimizedFileName,
            path: optimizedPath,
            mimeType: 'image/jpeg',
            size: fs.statSync(optimizedPath).size,
        });

        await newImage.save();

        console.log('=== Saved Image Metadata ===');
        console.log(newImage);

        res.status(201).json({
            message: 'Image uploaded successfully',
            id: newImage._id,
            url: `/assets/uploads/${optimizedFileName}`, // URL pour accéder au fichier optimisé
        });
    } catch (err) {
        console.error('=== Upload Error ===');
        console.error(err);
        res.status(500).json({ error: 'Failed to upload image', details: err.message });
    }
});

// Endpoint pour récupérer une image par ID
router.get('/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            console.error('Image not found');
            return res.status(404).json({ error: 'Image not found' });
        }

        res.set('Content-Type', image.mimeType);
        res.sendFile(path.resolve(image.path));
    } catch (err) {
        console.error('=== Fetch Error ===');
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch image', details: err.message });
    }
});

// Endpoint pour lister toutes les images (optionnel)
router.get('/', async (req, res) => {
    try {
        const images = await Image.find({});
        res.status(200).json(images);
    } catch (err) {
        console.error('=== Error Fetching All Images ===');
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch images', details: err.message });
    }
});

export default router;
