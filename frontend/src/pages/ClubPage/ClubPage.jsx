import React, { useState, useEffect } from 'react';
import TeamColumn from '../../components/TeamColumn/TeamColumn';
import AppHeader from '../../components/AppHeader/AppHeader';
import './ClubPage.css';

const ClubPage = ({ club }) => {
    const [index, setIndex] = useState(0);

    // Gestion de la rotation automatique
    useEffect(() => {
        setIndex(0);

        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % 3); // Passe à la colonne suivante
        }, 20000);

        return () => clearInterval(interval); // Nettoie l'intervalle pour éviter des fuites de mémoire
    }, [club]);

    return (
        <div className="club-page">
            {/* Header avec le nom du club */}
            <AppHeader title={club.clubName} />

            {/* Contenu des colonnes */}
            <div className="club-container">
                {club.teams.length > 0 ? (
                    club.teams.map((team) => (
                        <TeamColumn
                            key={team.id}
                            team={team}
                            clubId={club.clubId}
                            index={index} // Passe l'index pour la rotation automatique
                        />
                    ))
                ) : (
                    <p className="text-center no-teams-message">
                        Aucune équipe engagée en compétition pour le moment
                    </p>
                )}
            </div>
        </div>
    );
};

export default ClubPage;
