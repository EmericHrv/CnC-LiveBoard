import React from 'react';
import './AppHeader.css';

const AppHeader = ({ title }) => {
    return (
        <div className="header-container">
            <h1 className="header-title">{title}</h1>
        </div>
    );
};

export default AppHeader;
