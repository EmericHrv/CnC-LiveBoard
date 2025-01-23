import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../../components/EventCard/EventCard';
import PostCard from '../../components/PostCard/PostCard';
import Header from '../../components/Header/Header';
import './InfosPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const InfosPage = () => {
    const [events, setEvents] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [errorEvents, setErrorEvents] = useState(null);
    const [errorPosts, setErrorPosts] = useState(null);

    // Fetch upcoming events
    useEffect(() => {
        const fetchUpcomingEvents = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/events/upcoming?limit=6`);
                setEvents(data);
            } catch (err) {
                console.error('Error fetching upcoming events:', err);
                setErrorEvents('Impossible de charger les événements.');
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchUpcomingEvents();
    }, []);

    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/posts?limit=3`);
                setPosts(data);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setErrorPosts('Impossible de charger les publications.');
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchPosts();
    }, []);

    // Render events content
    const renderEventsContent = () => {
        if (loadingEvents) {
            return <p className="loading-message">Chargement des événements...</p>;
        }
        if (errorEvents) {
            return <p className="error-message">{errorEvents}</p>;
        }
        if (events.length > 0) {
            return events.map((event) => (
                <div key={event.id} className="event-item">
                    <EventCard event={event} />
                </div>
            ));
        }
        return <p className="no-events-message">Aucun événement à afficher</p>;
    };

    // Render posts content
    const renderPostsContent = () => {
        if (loadingPosts) {
            return <p className="loading-message">Chargement des publications...</p>;
        }
        if (errorPosts) {
            return <p className="error-message">{errorPosts}</p>;
        }
        if (posts.length > 0) {
            return posts.map((post) => (
                <PostCard
                    key={post.id}
                    title={post.title}
                    image={`${API_BASE_URL}${post.image.url}`} // Assume imageUrl is relative
                    text={post.content}
                />
            ));
        }
        return <p className="no-posts-message">Aucune publication à afficher</p>;
    };

    return (
        <div className="infos-page">
            {/* Header fixe */}
            <Header title="Informations Diverses" />

            {/* Contenu principal */}
            <div className="content">
                {/* Colonne gauche pour les événements */}
                <div className="events-column">
                    <div className="events-header">
                        <h2>Événements à venir</h2>
                    </div>
                    <div className="events-list">
                        {renderEventsContent()}
                        {/* separator */}
                        <div className="events-list-footer">
                            <h3>
                                Écran offert avec générosité par notre partenaire et sponsor : <br /> Pulsat
                                Châteauneuf-sur-Sarthe.
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Colonne droite pour les PostCard */}
                <div className="placeholder-column">
                    <div className="placeholder-header">
                        <h2>Autres informations</h2>
                    </div>
                    <div className="placeholder-content">
                        {renderPostsContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfosPage;
