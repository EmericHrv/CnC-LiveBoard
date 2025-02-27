import React from 'react';
import './TeamHeaderCard.css'; // Import des styles spécifiques

const TeamHeaderCard = ({ title, competitionName, poule }) => {
    return (
        <div className="team-header-card">
            <h2 className="team-header-title">{title}</h2>
            <p className="team-header-subtitle">{competitionName} - {poule}</p>
        </div>
    );
};

export default TeamHeaderCard;
