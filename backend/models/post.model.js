import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Titre du poste
    content: { type: String, required: true }, // Contenu du poste
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: false }, // Référence à l'image
    createdAt: { type: Date, default: Date.now }, // Date de création
});

const Post = mongoose.model('Post', postSchema);

export default Post;
