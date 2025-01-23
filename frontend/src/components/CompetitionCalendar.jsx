import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Match from './Match';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';  // Define API_BASE_URL here

const CompetitionResult = ({ team }) => {
    const [calandars, setCalandars] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/fff/competitioncalendar`, {
                    competitionId: team.competition.id,
                    phaseId: team.competition.phase,
                    groupId: team.competition.poule,
                });
                setCalandars(response.data);
            } catch (error) {
                console.error('Error fetching competition results:', error);
            }
        };

        fetchResults();
    }, [team]);

    return (
        <div className="competition-results border rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary text-text p-2 text-center">
                <h3 className="text-lg font-bold">Agenda du groupe</h3>
            </div>
            <div className="px-4 py-2">
                {calandars.length > 0 ? (
                    calandars.map((match, index) => (
                        <React.Fragment key={match.id}>
                            <Match clubId={team.clubId} match={match} />
                            {index < calandars.length - 1 && (
                                <hr className="my-1 border-t border-gray-300" />
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Aucun match disponible</p>
                )}
            </div>
        </div>
    );
};

export default CompetitionResult;
