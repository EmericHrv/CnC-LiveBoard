import React from 'react';
import errorImage from '../../assets/error-image.svg';
import './ErrorPage.css';

const ErrorPage = ({ message, statusCode }) => {
    return (
        <div className="error-page">
            <h1 className="error-title">
                Oh non ! La frappe a manqué le cadre !
            </h1>
            <img
                src={errorImage}
                alt="Error"
                className="error-image"
            />
            {statusCode && (
                <h2 className="error-status">
                    Erreur {statusCode}
                </h2>
            )}
            <p className="error-message">
                {message}
            </p>
        </div>
    );
};

export default ErrorPage;