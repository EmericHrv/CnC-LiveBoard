import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Dossier des uploads
export const UPLOADS_DIR = path.join('assets', 'uploads');

// Vérifie et crée le dossier d'uploads si nécessaire
export const ensureUploadsDirExists = () => {
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
};

// Supprime un fichier si celui-ci existe
export const deleteFileIfExists = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log('File deleted successfully:', filePath);
        } else {
            console.warn('File does not exist:', filePath);
        }
    } catch (err) {
        console.error('Error deleting file:', err.message);
    }
};

// Optimise une image et retourne son chemin optimisé
export const optimizeImage = async (originalPath) => {
    const optimizedFileName = `${uuidv4()}.jpg`;
    const optimizedPath = path.join(UPLOADS_DIR, optimizedFileName);

    try {
        await sharp(originalPath)
            .jpeg({ quality: 80 })
            .toFile(optimizedPath);

        // Supprime l'image originale après optimisation
        await deleteFileIfExists(originalPath);

        return { optimizedFileName, optimizedPath };
    } catch (err) {
        console.error('Error optimizing image:', err.message);
        throw new Error('Image optimization failed');
    }
};