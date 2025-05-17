// PostsPage.jsx
import React, { useEffect, useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import PostsTable from '../../components/PostsTable/PostsTable';
import PostModal from '../../components/PostModal/PostModal';
import Notification from '../../components/Notification';
import { useNavigate } from 'react-router-dom';
import './PostsPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [postsError, setPostsError] = useState('');
    const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' });
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(data);
                setPostsError('');
            } else {
                setPostsError('Erreur lors de la récupération des posts.');
            }
        } catch (error) {
            setPostsError('Erreur serveur : impossible de charger les posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const showNotification = (type, title, message) => {
        setNotification({ show: true, type, title, message });
        setTimeout(() => setNotification({ show: false, type: '', title: '', message: '' }), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleEditPost = (post) => {
        setPostToEdit(post);
        setIsPostModalOpen(true);
    };

    const handleCreatePost = () => {
        setPostToEdit(null);
        setIsPostModalOpen(true);
    };

    const handleDeletePost = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                showNotification('success', 'Post supprimé', 'Le post a été supprimé avec succès.');
                fetchPosts();
            } else {
                showNotification('error', 'Erreur', 'Impossible de supprimer le post.');
            }
        } catch (error) {
            showNotification('error', 'Erreur serveur', 'Erreur lors de la suppression du post.');
        }
    };

    const handleSubmitPost = async (formData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const method = postToEdit ? 'PUT' : 'POST';
            const url = postToEdit
                ? `${API_BASE_URL}/api/posts/${postToEdit.id}`
                : `${API_BASE_URL}/api/posts/create`;

            const response = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                showNotification(
                    'success',
                    postToEdit ? 'Post modifié' : 'Post créé',
                    `Le post a été ${postToEdit ? 'modifié' : 'créé'} avec succès.`
                );
                fetchPosts();
                setIsPostModalOpen(false);
            } else {
                showNotification('error', 'Erreur', 'Impossible de sauvegarder le post.');
            }
        } catch (error) {
            showNotification('error', 'Erreur serveur', 'Une erreur s\'est produite.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="posts-page">
            <DashboardHeader currentPage="Posts" onLogout={handleLogout} />
            <main className="main-content">
                <PostsTable
                    posts={posts}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    onCreate={handleCreatePost}
                />
                {loading && <p className="loading-message">Chargement en cours...</p>}
            </main>
            <Notification {...notification} onClose={() => setNotification({ show: false, type: '', title: '', message: '' })} />
            <PostModal
                isOpen={isPostModalOpen}
                onClose={() => {
                    setIsPostModalOpen(false);
                    setPostToEdit(null);
                }}
                onSubmit={handleSubmitPost}
                initialData={postToEdit}
            />
        </div>
    );
};

export default PostsPage;