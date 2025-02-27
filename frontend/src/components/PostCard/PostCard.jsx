import React from 'react';
import ReactMarkdown from 'react-markdown';
import './PostCard.css';

const PostCard = ({ title, image, text }) => {
    // Vérifiez les données pour éviter les erreurs
    if (!title && !text) {
        return (
            <div className="post-card">
                <p className="post-error">Contenu indisponible</p>
            </div>
        );
    }

    return (
        <div className="post-card">
            {/* Affichage conditionnel de l'image */}
            {image && (
                <div className="post-image-container">
                    <img src={image} alt={title || 'Image de la publication'} className="post-image" />
                </div>
            )}

            <div className="post-content">
                {/* Titre avec fallback si absent */}
                <h3 className="post-title">{title || 'Titre non disponible'}</h3>

                {/* Contenu en Markdown */}
                <div className="post-text">
                    <ReactMarkdown>{text || 'Aucun contenu à afficher.'}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
