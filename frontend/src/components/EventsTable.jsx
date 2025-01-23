import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'; // Heroicons v2

const EventsTable = ({ events, onEdit, onDelete, onCreate }) => {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Événements</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Liste de tous les événements programmés, incluant leur titre, date et actions disponibles.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        onClick={onCreate} // Ouvre la modale pour la création
                    >
                        Ajouter un événement
                    </button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Titre
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900 w-24 sticky right-0 bg-white"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {events.map((event) => (
                                    <tr key={event._id}>
                                        <td className="whitespace-normal py-4 px-4 text-sm font-medium text-gray-900 sm:pl-0 break-words">
                                            {event.title}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                            {new Date(event.date).toLocaleDateString()}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 flex items-center space-x-4 sticky right-0 bg-white">
                                            {/* Icone Éditer */}
                                            <div
                                                onClick={() => onEdit(event)} // Ouvre la modale pour l'édition
                                                className="cursor-pointer text-primary hover:text-primary/80"
                                            >
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </div>
                                            {/* Icone Supprimer */}
                                            <div
                                                onClick={() => onDelete(event._id)} // Supprime l'événement
                                                className="cursor-pointer text-red-600 hover:text-red-800"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsTable;
