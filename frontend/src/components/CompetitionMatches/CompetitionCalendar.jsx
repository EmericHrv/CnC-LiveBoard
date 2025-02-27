import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompetitionMatches from './CompetitionMatches';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const CompetitionCalendar = ({ team }) => {
    const [calendar, setCalendar] = useState([]);

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const { competition: { id: competitionId, phase: phaseId, poule: groupId } } = team;
                const response = await axios.post(`${API_BASE_URL}/api/fff/competitioncalendar`, {
                    competitionId,
                    phaseId,
                    groupId,
                });
                setCalendar(response.data);
            } catch (error) {
                console.error('Error fetching competition calendar:', error);
            }
        };

        fetchCalendar();
    }, [team]);

    return (
        <CompetitionMatches
            title="Calendrier du groupe"
            matches={calendar}
            emptyMessage="Aucun match disponible"
            clubId={team.clubId}
        />
    );
};

export default CompetitionCalendar;
