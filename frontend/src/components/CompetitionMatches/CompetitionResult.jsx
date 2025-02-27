import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompetitionMatches from './CompetitionMatches';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const CompetitionResult = ({ team }) => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const { competition: { id: competitionId, phase: phaseId, poule: groupId } } = team;
                const response = await axios.post(`${API_BASE_URL}/api/fff/competitionresults`, {
                    competitionId,
                    phaseId,
                    groupId,
                });
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching competition results:', error);
            }
        };

        fetchResults();
    }, [team]);

    return (
        <CompetitionMatches
            title="Résultats du groupe"
            matches={results}
            emptyMessage="Aucun résultat disponible"
            clubId={team.clubId}
        />
    );
};

export default CompetitionResult;
