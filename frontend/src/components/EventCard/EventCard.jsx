import React from 'react';
import './EventCard.css';

const EventCard = ({ event }) => {
    const title = event.title.toUpperCase();
    const dateObject = new Date(event.date);
    const day = dateObject.getDate();
    const month = dateObject.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase();

    return (
        <div className="event-card">
            {/* Colonne gauche */}
            <div className="event-card-date">
                <p className="day">{day}</p>
                <p className="month">{month}</p>
                {event.time && <p className="time">{event.time}</p>}
            </div>

            {/* Colonne droite */}
            <div className="event-card-content">
                <h3 className="title">{title}</h3>
                {event.description && <p className="description">{event.description}</p>}
            </div>
        </div>
    );
};

export default EventCard;
