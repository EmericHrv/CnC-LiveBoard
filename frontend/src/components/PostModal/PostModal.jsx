import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import { PhotoIcon } from '@heroicons/react/24/outline';
import './PostModal.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const PostModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
            if (initialData.imageId) {
                setPreview(`${API_BASE_URL}/assets/uploads/${initialData.imageId.url}`);
            } else {
                setPreview('');
            }
            setImage(null);
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
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }
        onSubmit(formData);
    };

    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="post-modal-overlay" onClose={onClose}>
                <Transition.Child as={React.Fragment}>
                    <div className="post-modal-backdrop" />
                </Transition.Child>

                <div className="post-modal-container">
                    <div className="post-modal-dialog">
                        <Transition.Child as={React.Fragment}>
                            <Dialog.Panel className="post-modal-panel">
                                <h2 className="post-modal-title">
                                    {initialData ? 'Modifier un post' : 'Créer un post'}
                                </h2>
                                <form onSubmit={handleSubmit} className="post-modal-form">
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
                                        <label htmlFor="image">Image</label>
                                        <div className="image-upload">
                                            <label htmlFor="image" className="image-label">
                                                <PhotoIcon className="icon" />
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
                                                    alt="Aperçu"
                                                    className="image-preview"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="content">Corps (Markdown)</label>
                                        <textarea
                                            id="content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows="6"
                                            required
                                        ></textarea>
                                        <div className="markdown-preview">
                                            <h3>Aperçu du Markdown :</h3>
                                            <div className="preview-box">
                                                <ReactMarkdown>{content}</ReactMarkdown>
                                            </div>
                                        </div>
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

export default PostModal;