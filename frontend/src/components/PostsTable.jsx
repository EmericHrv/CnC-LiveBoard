import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'; // Heroicons v2
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const PostsTable = ({ posts, onEdit, onCreate, onDelete }) => {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Posts</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Liste de tous les posts créés, incluant leur titre, contenu et image associée.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        onClick={onCreate} // Ouvre la modale pour la création
                    >
                        Ajouter un post
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
                                        Contenu
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Image
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {posts.map((post) => (
                                    <tr key={post.id}>
                                        <td className="whitespace-normal py-4 px-4 text-sm font-medium text-gray-900 sm:pl-0 break-words">
                                            {post.title}
                                        </td>
                                        <td className="whitespace-normal px-4 py-4 text-sm text-gray-500 break-words">
                                            {post.content.length > 50
                                                ? `${post.content.substring(0, 50)}...`
                                                : post.content}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                            {post.image ? (
                                                <img
                                                    src={`${API_BASE_URL}${post.image.url}`}
                                                    alt={post.title}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-500 italic">Aucune image</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 flex items-center space-x-4">
                                            {/* Icone Éditer */}
                                            <div
                                                onClick={() => onEdit(post)} // Ouvre la modale pour l'édition
                                                className="cursor-pointer text-primary hover:text-primary/80"
                                                title="Éditer ce post"
                                            >
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </div>
                                            {/* Icone Supprimer */}
                                            <div
                                                onClick={() => onDelete(post.id)} // Supprime le post
                                                className="cursor-pointer text-red-600 hover:text-red-800"
                                                title="Supprimer ce post"
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

export default PostsTable;
