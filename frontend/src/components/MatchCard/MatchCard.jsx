import React from 'react';
import './MatchCard.css'; // Import des styles spécifiques
import Match from '../Match/Match';

const MatchCard = ({ clubId, match, title }) => {
    return (
        <div className="common-component">
            <div className="common-component-header match-card-header">
                {title}
            </div>
            {match ? (
                <Match clubId={clubId} match={match} />
            ) : (
                <div className="no-match">
                    Pas de match
                </div>
            )}
        </div>
    );
};

export default MatchCard;
