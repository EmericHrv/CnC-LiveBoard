'use client';

import React, { useEffect, useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Notification from '../../components/Notification';
import EventsTable from '../../components/EventsTable';
import PostsTable from '../../components/PostsTable';
import EventModal from '../../components/EventModal';
import PostModal from '../../components/PostModal'; // Import de la modale pour les posts
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const DashboardPage = () => {
    const [events, setEvents] = useState([]);
    const [posts, setPosts] = useState([]);
    const [eventsError, setEventsError] = useState('');
    const [postsError, setPostsError] = useState('');
    const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' });
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [postToEdit, setPostToEdit] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch events
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/events/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setEvents(data);
                setEventsError('');
            } else {
                setEventsError('Erreur lors de la récupération des événements.');
            }
        } catch (error) {
            console.error('Erreur:', error.message);
            setEventsError('Erreur serveur : impossible de charger les événements.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch posts
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(data);
                setPostsError('');
            } else {
                setPostsError('Erreur lors de la récupération des posts.');
            }
        } catch (error) {
            console.error('Erreur:', error.message);
            setPostsError('Erreur serveur : impossible de charger les posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
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

    const handleEditEvent = (event) => {
        setEventToEdit(event); // Pré-remplit les champs pour l'édition
        setIsEventModalOpen(true);
    };

    const handleCreateEvent = () => {
        setEventToEdit(null); // Réinitialise pour une création
        setIsEventModalOpen(true);
    };

    const handleEditPost = (post) => {
        setPostToEdit(post); // Pré-remplit les champs pour l'édition
        setIsPostModalOpen(true);
    };

    const handleCreatePost = () => {
        setPostToEdit(null); // Réinitialise pour une création
        setIsPostModalOpen(true);
    };

    const handleDeleteEvent = async (eventId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                showNotification('success', 'Suppression réussie', 'L\'événement a été supprimé.');
                fetchEvents();
            } else {
                showNotification('error', 'Erreur', 'Impossible de supprimer l\'événement.');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l’événement:', error.message);
            showNotification('error', 'Erreur', 'Erreur serveur.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                showNotification('success', 'Post supprimé', 'Le post a été supprimé avec succès.');
                fetchPosts(); // Recharge les posts après suppression
            } else {
                showNotification('error', 'Erreur', 'Impossible de supprimer le post.');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du post :', error.message);
            showNotification('error', 'Erreur serveur', 'Une erreur s\'est produite.');
        }
    };


    const handleSubmitEvent = async (data) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const method = eventToEdit ? 'PUT' : 'POST';
            const url = eventToEdit
                ? `${API_BASE_URL}/api/events/${eventToEdit._id}`
                : `${API_BASE_URL}/api/events/create`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                showNotification(
                    'success',
                    eventToEdit ? 'Modification réussie' : 'Création réussie',
                    `L'événement a été ${eventToEdit ? 'modifié' : 'créé'} avec succès.`
                );
                fetchEvents();
                setIsEventModalOpen(false);
            } else {
                showNotification('error', 'Erreur', 'Impossible de sauvegarder l\'événement.');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l’événement:', error.message);
            showNotification('error', 'Erreur', 'Erreur serveur.');
        } finally {
            setLoading(false);
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData, // FormData pour gérer les fichiers
            });

            if (response.ok) {
                showNotification(
                    'success',
                    postToEdit ? 'Modification réussie' : 'Création réussie',
                    `Le post a été ${postToEdit ? 'modifié' : 'créé'} avec succès.`
                );
                fetchPosts();
                setIsPostModalOpen(false);
            } else {
                showNotification('error', 'Erreur', 'Impossible de sauvegarder le post.');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du post:', error.message);
            showNotification('error', 'Erreur', 'Erreur serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full">
            <DashboardHeader currentPage="Tableau de bord" onLogout={handleLogout} />
            <main className="-mt-32">
                <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                        <EventsTable
                            events={events}
                            onEdit={handleEditEvent}
                            onDelete={handleDeleteEvent}
                            onCreate={handleCreateEvent}
                        />
                        {loading && <p className="text-sm text-gray-500 mt-4">Chargement en cours...</p>}
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                        <PostsTable
                            posts={posts}
                            onEdit={handleEditPost}
                            onDelete={handleDeletePost}
                            onCreate={handleCreatePost}
                        />
                    </div>
                </div>
            </main>
            <Notification
                show={notification.show}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification({ show: false, type: '', title: '', message: '' })}
            />
            <EventModal
                isOpen={isEventModalOpen}
                onClose={() => {
                    setIsEventModalOpen(false);
                    setEventToEdit(null); // Réinitialise les données
                }}
                onSubmit={handleSubmitEvent}
                initialData={eventToEdit}
            />
            <PostModal
                isOpen={isPostModalOpen}
                onClose={() => {
                    setIsPostModalOpen(false);
                    setPostToEdit(null); // Réinitialise les données
                }}
                onSubmit={handleSubmitPost}
                initialData={postToEdit}
            />
        </div>
    );
};

export default DashboardPage;
