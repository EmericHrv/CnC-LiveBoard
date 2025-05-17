import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import './EventModal.css';

const EventModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '');
            setTime(initialData.time || '');
            setDescription(initialData.description || '');
        } else {
            setTitle('');
            setDate('');
            setTime('');
            setDescription('');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, date, time, description });
    };

    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="event-modal-overlay" onClose={onClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="modal-enter"
                    enterFrom="modal-enter-from"
                    enterTo="modal-enter-to"
                    leave="modal-leave"
                    leaveFrom="modal-leave-from"
                    leaveTo="modal-leave-to"
                >
                    <div className="event-modal-backdrop" />
                </Transition.Child>

                <div className="event-modal-container">
                    <div className="event-modal-dialog">
                        <Transition.Child
                            as={React.Fragment}
                            enter="modal-panel-enter"
                            enterFrom="modal-panel-enter-from"
                            enterTo="modal-panel-enter-to"
                            leave="modal-panel-leave"
                            leaveFrom="modal-panel-leave-from"
                            leaveTo="modal-panel-leave-to"
                        >
                            <Dialog.Panel className="event-modal-panel">
                                <h2 className="event-modal-title">
                                    {initialData ? 'Modifier un événement' : 'Créer un événement'}
                                </h2>
                                <form onSubmit={handleSubmit} className="event-modal-form">
                                    <div className="form-group">
                                        <label htmlFor="title">Titre</label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="date">Date</label>
                                        <input
                                            type="date"
                                            id="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="time">Heure</label>
                                        <input
                                            type="time"
                                            id="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="4"
                                        ></textarea>
                                    </div>
                                    <div className="modal-actions">
                                        <button type="button" className="btn cancel" onClick={onClose}>
                                            Annuler
                                        </button>
                                        <button type="submit" className="btn submit">
                                            {initialData ? 'Modifier' : 'Créer'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EventModal;
