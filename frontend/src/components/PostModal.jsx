import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import { PhotoIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const PostModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');

    // Remplit les champs avec les données initiales si elles existent
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
            if (initialData.imageId) {
                setPreview(`${API_BASE_URL}/assets/uploads/${initialData.imageId.url}`); // URL de l'image
            } else {
                setPreview('');
            }
            setImage(null); // Réinitialise l'image (si une nouvelle est ajoutée, elle remplacera l'existante)
        } else {
            setTitle('');
            setContent('');
            setPreview('');
            setImage(null);
        }
    }, [initialData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Prévisualisation de l'image importée
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image); // Ajout de l'image uniquement si elle est changée
        }
        onSubmit(formData); // Soumission des données au parent
    };

    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                    <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        {initialData ? 'Modifier un post' : 'Créer un post'}
                                    </h2>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="title"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Titre
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="image"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Image
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                <label
                                                    htmlFor="image"
                                                    className="cursor-pointer flex items-center space-x-2 text-sm text-gray-500 hover:text-primary"
                                                >
                                                    <PhotoIcon className="w-5 h-5" />
                                                    <span>Importer une image</span>
                                                    <input
                                                        type="file"
                                                        id="image"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {preview && (
                                                    <img
                                                        src={preview}
                                                        alt="Aperçu de l'image"
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="content"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Corps (Markdown)
                                            </label>
                                            <textarea
                                                id="content"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                                rows="6"
                                                required
                                            ></textarea>
                                            <div className="mt-2">
                                                <h3 className="text-sm font-medium text-gray-700">
                                                    Aperçu du Markdown :
                                                </h3>
                                                <div className="mt-2 border rounded-md p-4 bg-gray-50">
                                                    <ReactMarkdown>{content}</ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                className="rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                                                onClick={onClose}
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                type="submit"
                                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                                            >
                                                {initialData ? 'Modifier' : 'Créer'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default PostModal;
