import React, { useEffect, useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import EventsTable from '../../components/EventTable/EventsTable';
import EventModal from '../../components/EventModal/EventModal';
import Notification from '../../components/Notification';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [eventsError, setEventsError] = useState('');
    const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' });
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/events/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setEvents(data);
                setEventsError('');
            } else {
                setEventsError('Erreur lors de la récupération des événements.');
            }
        } catch (error) {
            setEventsError('Erreur serveur : impossible de charger les événements.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
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
        setEventToEdit(event);
        setIsEventModalOpen(true);
    };

    const handleCreateEvent = () => {
        setEventToEdit(null);
        setIsEventModalOpen(true);
    };

    const handleDeleteEvent = async (eventId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                showNotification('success', 'Événement supprimé', 'L\'événement a été supprimé.');
                fetchEvents();
            } else {
                showNotification('error', 'Erreur', 'Impossible de supprimer l\'événement.');
            }
        } catch (error) {
            showNotification('error', 'Erreur serveur', 'Erreur lors de la suppression.');
        } finally {
            setLoading(false);
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
                    eventToEdit ? 'Événement modifié' : 'Événement créé',
                    `L'événement a été ${eventToEdit ? 'modifié' : 'créé'} avec succès.`
                );
                fetchEvents();
                setIsEventModalOpen(false);
            } else {
                showNotification('error', 'Erreur', 'Échec lors de la sauvegarde de l\'événement.');
            }
        } catch (error) {
            showNotification('error', 'Erreur serveur', 'Une erreur s\'est produite.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="events-page">
            <DashboardHeader currentPage="Événements" onLogout={handleLogout} />
            <main className="main-content">
                <EventsTable
                    events={events}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                    onCreate={handleCreateEvent}
                />
                {loading && <p className="loading-message">Chargement en cours...</p>}
            </main>
            <Notification {...notification} onClose={() => setNotification({ show: false, type: '', title: '', message: '' })} />
            <EventModal
                isOpen={isEventModalOpen}
                onClose={() => {
                    setIsEventModalOpen(false);
                    setEventToEdit(null);
                }}
                onSubmit={handleSubmitEvent}
                initialData={eventToEdit}
            />
        </div>
    );
};

export default EventsPage;