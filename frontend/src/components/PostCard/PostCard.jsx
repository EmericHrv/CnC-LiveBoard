import React from 'react';
import ReactMarkdown from 'react-markdown';
import './PostCard.css';

const PostCard = ({ title, image, text }) => {
    return (
        <div className="post-card">

            <div className="post-image-container">
                <img src={image} alt={title} className="post-image" />
            </div>
            <div className="post-content">
                <h3 className="post-title">{title}</h3>
                <div className="post-text">
                    <ReactMarkdown>{text}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
