import React from 'react';
import './Match.css'; // Import des styles spécifiques

const Match = ({ clubId, match }) => {
    return (
        <div className="match-info">
            <div className="match-date-time">
                {match.date} à {match.time}
            </div>
            <div className="match-teams">
                {/* Équipe à domicile */}
                <div className="team">
                    {match.homeTeam.logoUrl && (
                        <img
                            src={match.homeTeam.logoUrl}
                            className="team-logo"
                            alt={`Logo ${match.homeTeam.name}`}
                        />
                    )}
                    <p className={`team-name ${match.homeTeam.clubId === clubId ? 'highlight' : ''}`}>
                        {match.homeTeam.name}
                    </p>
                </div>

                {/* Score ou état du match */}
                <div className="match-score">
                    <div className="score">
                        <p>{match.homeScore} - {match.awayScore}</p>
                    </div>
                    {match.forfeit && (
                        <div className="forfeit">
                            <p>Forfait</p>
                        </div>
                    )}
                </div>

                {/* Équipe à l'extérieur */}
                <div className="team">
                    {match.awayTeam.logoUrl && (
                        <img
                            src={match.awayTeam.logoUrl}
                            className="team-logo"
                            alt={`Logo ${match.awayTeam.name}`}
                        />
                    )}
                    <p className={`team-name ${match.awayTeam.clubId === clubId ? 'highlight' : ''}`}>
                        {match.awayTeam.name}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Match;
