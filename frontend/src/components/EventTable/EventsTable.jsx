import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import './EventsTable.css';

const EventsTable = ({ events, onEdit, onDelete, onCreate }) => {
    // Tri décroissant par date
    const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

    const isPastEvent = (date) => new Date(date) < new Date();

    return (
        <div className="events-table-wrapper">
            <div className="events-table-header">
                <div className="events-table-info">
                    <h1 className="events-table-title">Événements</h1>
                    <p className="events-table-description">
                        Liste de tous les événements programmés, incluant leur titre, date et actions disponibles.
                    </p>
                </div>
                <div className="events-table-add-button">
                    <button type="button" onClick={onCreate} className="btn-primary">
                        Ajouter un événement
                    </button>
                </div>
            </div>

            <div className="events-table-container">
                <table className="events-table">
                    <thead>
                        <tr>
                            <th className="table-header">Titre</th>
                            <th className="table-header">Date</th>
                            <th className="table-header table-actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedEvents.map((event) => (
                            <tr
                                key={event._id}
                                className={`table-row ${isPastEvent(event.date) ? 'event-passed' : ''}`}
                            >
                                <td className="table-cell">{event.title}</td>
                                <td className="table-cell">
                                    {new Date(event.date).toLocaleDateString()}
                                    {isPastEvent(event.date) && (
                                        <span className="event-status"> (Passé)</span>
                                    )}
                                </td>
                                <td className="table-cell table-cell-actions">
                                    <div onClick={() => onEdit(event)} className="action-icon edit" title="Modifier">
                                        <PencilSquareIcon className="icon" />
                                    </div>
                                    <div onClick={() => onDelete(event._id)} className="action-icon delete" title="Supprimer">
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

export default EventsTable;
