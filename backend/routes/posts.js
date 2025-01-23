import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import Post from '../models/post.model.js';
import Image from '../models/image.model.js';
import fs from 'fs';
import {
    ensureUploadsDirExists,
    deleteFileIfExists,
    optimizeImage,
    UPLOADS_DIR
} from '../utils/fileManager.js';

const router = express.Router();

// Assurez-vous que le dossier d'uploads existe
ensureUploadsDirExists();

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

// Route pour créer un poste avec une image
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content || !req.file) {
            return res.status(400).json({ error: 'Title, content, and image are required' });
        }

        // Optimisation de l'image
        const { optimizedFileName, optimizedPath } = await optimizeImage(req.file.path);

        // Enregistrez l'image dans MongoDB
        const newImage = new Image({
            name: optimizedFileName,
            path: optimizedPath,
            mimeType: 'image/jpeg',
            size: fs.statSync(optimizedPath).size,
        });

        await newImage.save();

        // Enregistrez le poste dans MongoDB
        const newPost = new Post({
            title,
            content,
            imageId: newImage._id,
        });

        await newPost.save();

        res.status(201).json({
            message: 'Post created successfully',
            post: {
                id: newPost._id,
                title: newPost.title,
                content: newPost.content,
                imageUrl: `/assets/uploads/${optimizedFileName}`,
            },
        });
    } catch (err) {
        console.error('Error creating post:', err.message);
        res.status(500).json({ error: 'Failed to create post', details: err.message });
    }
});

// Route pour modifier un poste par ID
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;

        // Trouver le post existant
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!title && !content && !req.file) {
            return res.status(400).json({ error: 'At least one of title, content, or image is required' });
        }

        // Mise à jour du titre et du contenu
        if (title) post.title = title;
        if (content) post.content = content;

        // Gestion de la nouvelle image
        if (req.file) {
            // Supprimer l'ancienne image si elle existe
            if (post.imageId) {
                const oldImage = await Image.findById(post.imageId);
                if (oldImage && oldImage.path) {
                    await deleteFileIfExists(path.join(process.cwd(), oldImage.path));
                    await Image.findByIdAndDelete(post.imageId);
                }
            }

            // Optimiser et sauvegarder la nouvelle image
            const { optimizedFileName, optimizedPath } = await optimizeImage(req.file.path);

            const newImage = new Image({
                name: optimizedFileName,
                path: optimizedPath,
                mimeType: 'image/jpeg',
                size: fs.statSync(optimizedPath).size,
            });

            await newImage.save();
            post.imageId = newImage._id;
        }

        await post.save();

        res.status(200).json({
            message: 'Post updated successfully',
            post: {
                id: post._id,
                title: post.title,
                content: post.content,
                image: post.imageId
                    ? { id: post.imageId, url: `/assets/uploads/${(await Image.findById(post.imageId)).name}` }
                    : null,
            },
        });
    } catch (err) {
        console.error('Error updating post:', err.message);
        res.status(500).json({ error: 'Failed to update post', details: err.message });
    }
});

// Route pour obtenir un poste par ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('imageId');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({
            id: post._id,
            title: post.title,
            content: post.content,
            image: post.imageId
                ? { id: post.imageId._id, url: `/assets/uploads/${post.imageId.name}` }
                : null,
        });
    } catch (err) {
        console.error('Error fetching post:', err.message);
        res.status(500).json({ error: 'Failed to fetch post', details: err.message });
    }
});

// Route pour lister tous les postes
router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const query = Post.find({}).sort({ createdAt: -1 });

        if (limit) {
            query.limit(parseInt(limit, 10));
        }

        const posts = await query.populate('imageId');

        res.json(posts.map((post) => ({
            id: post._id,
            title: post.title,
            content: post.content,
            image: post.imageId
                ? { id: post.imageId._id, url: `/assets/uploads/${post.imageId.name}` }
                : null,
        })));
    } catch (err) {
        console.error('Error fetching posts:', err.message);
        res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
    }
});

// Route pour supprimer un poste par ID
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Supprimer l'image associée si elle existe
        if (post.imageId) {
            const image = await Image.findById(post.imageId);
            if (image && image.path) {
                await deleteFileIfExists(path.join(process.cwd(), image.path));
                await Image.findByIdAndDelete(post.imageId);
            }
        }

        // Supprimer le poste
        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err.message);
        res.status(500).json({ error: 'Failed to delete post', details: err.message });
    }
});

export default router;
