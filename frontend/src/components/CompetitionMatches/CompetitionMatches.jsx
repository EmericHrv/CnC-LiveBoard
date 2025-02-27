import React from 'react';
import Match from '../Match/Match';
import './CompetitionMatches.css'; // Styles génériques pour les deux composants

const CompetitionMatches = ({ title, matches, emptyMessage, clubId }) => {
    return (
        <div className="common-component">
            <div className="common-component-header">
                <h3>{title}</h3>
            </div>
            <div className="competition-matches-body">
                {matches.length > 0 ? (
                    matches.map((match, index) => (
                        <React.Fragment key={match.id}>
                            <Match clubId={clubId} match={match} />
                            {index < matches.length - 1 && <hr className="divider" />}
                        </React.Fragment>
                    ))
                ) : (
                    <p className="no-matches">{emptyMessage}</p>
                )}
            </div>
        </div>
    );
};

export default CompetitionMatches;
