import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import './DashboardPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const DashboardPage = () => {
    const [eventCount, setEventCount] = useState(0);
    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const [eventsRes, postsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/events/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_BASE_URL}/api/posts`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (eventsRes.ok && postsRes.ok) {
                const events = await eventsRes.json();
                const posts = await postsRes.json();
                setEventCount(events.length);
                setPostCount(posts.length);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des stats :', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-page">
            <DashboardHeader currentPage="Tableau de bord" onLogout={handleLogout} />
            <main className="main-content">
                <h2 className="dashboard-title">Résumé</h2>
                {loading ? (
                    <p className="loading-message">Chargement des statistiques...</p>
                ) : (
                    <div className="dashboard-cards">
                        <div className="dashboard-card" onClick={() => navigate('/events')}>
                            <h3>Événements</h3>
                            <p className="dashboard-value">{eventCount}</p>
                        </div>
                        <div className="dashboard-card" onClick={() => navigate('/posts')}>
                            <h3>Posts</h3>
                            <p className="dashboard-value">{postCount}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;