import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import './PostsTable.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const PostsTable = ({ posts, onEdit, onCreate, onDelete }) => {
    return (
        <div className="posts-table-wrapper">
            <div className="posts-table-header">
                <div className="posts-table-info">
                    <h1 className="posts-table-title">Posts</h1>
                    <p className="posts-table-description">
                        Liste de tous les posts créés, incluant leur titre, contenu et image associée.
                    </p>
                </div>
                <div className="posts-table-add-button">
                    <button type="button" onClick={onCreate} className="btn-primary">
                        Ajouter un post
                    </button>
                </div>
            </div>

            <div className="posts-table-container">
                <table className="posts-table">
                    <thead>
                        <tr>
                            <th className="table-header">Titre</th>
                            <th className="table-header">Contenu</th>
                            <th className="table-header">Image</th>
                            <th className="table-header">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id} className="table-row">
                                <td className="table-cell">{post.title}</td>
                                <td className="table-cell">
                                    {post.content.length > 50
                                        ? `${post.content.substring(0, 50)}...`
                                        : post.content}
                                </td>
                                <td className="table-cell">
                                    {post.image ? (
                                        <img
                                            src={`${API_BASE_URL}${post.image.url}`}
                                            alt={post.title}
                                            className="post-image-preview"
                                        />
                                    ) : (
                                        <span className="text-muted italic">Aucune image</span>
                                    )}
                                </td>
                                <td className="table-cell table-cell-actions">
                                    <div
                                        onClick={() => onEdit(post)}
                                        className="action-icon edit"
                                        title="Éditer ce post"
                                    >
                                        <PencilSquareIcon className="icon" />
                                    </div>
                                    <div
                                        onClick={() => onDelete(post.id)}
                                        className="action-icon delete"
                                        title="Supprimer ce post"
                                    >
                                        <TrashIcon className="icon" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostsTable;