import React, { useState, useEffect } from 'react';
import TeamColumn from '../../components/TeamColumn';
import Header from '../../components/Header/Header';
import '../../styles/tailwind.css';

const ClubPage = ({ club }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(0);

        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % 3);
        }, 20000);

        return () => clearInterval(interval);
    }, [club]);

    return (
        <div className="club-page w-full">
            <Header title={club.clubName} />
            <div className="flex flex-wrap gap-4 px-4 mt-2">
                {club.teams.length > 0 ? (
                    club.teams.map((team) => (
                        <TeamColumn key={team.id} team={team} clubId={club.clubId} index={index} />
                    ))
                ) : (
                    <p className="text-center w-full mt-4">Aucune équipe engagée en compétition pour le moment</p>
                )}
            </div>
        </div>
    );
};

export default ClubPage;