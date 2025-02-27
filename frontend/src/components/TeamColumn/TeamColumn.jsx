import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MatchCard from '../MatchCard/MatchCard';
import RankingTable from '../RankingTable/RankingTable';
import TeamHeaderCard from '../TeamHeaderCard/TeamHeaderCard';
import CompetitionResult from '../CompetitionMatches/CompetitionResult';
import CompetitionCalendar from '../CompetitionMatches/CompetitionCalendar';
import './TeamColumn.css'; // Import des styles spécifiques

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

const TeamColumn = ({ team, clubId, index }) => {
    const [ranking, setRanking] = useState([]);
    const [lastMatch, setLastMatch] = useState(null);
    const [nextMatch, setNextMatch] = useState(null);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/fff/ranking`, {
                    competitionId: team.competition.id,
                    phaseId: team.competition.phase,
                    groupId: team.competition.poule,
                });
                setRanking(response.data.ranking);
            } catch (error) {
                console.error('Error fetching ranking:', error);
            }
        };

        const fetchLastMatch = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/fff/lastmatch`, {
                    clubId,
                    teamId: team.id,
                });
                setLastMatch(response.data.lastMatch);
            } catch (error) {
                console.error('Error fetching last match:', error);
            }
        };

        const fetchNextMatch = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/fff/nextmatch`, {
                    clubId,
                    teamId: team.id,
                });
                setNextMatch(response.data.nextMatch);
            } catch (error) {
                console.error('Error fetching next match:', error);
            }
        };

        fetchRanking();
        fetchLastMatch();
        fetchNextMatch();
    }, [team, clubId]);

    return (
        <div className="team-column">
            <TeamHeaderCard
                title={team.title}
                competitionName={team.competition ? team.competition.name : ''}
                poule={team.competition ? `Poule ${team.competition.pouleLetter}` : ''}
            />

            {index === 0 && (
                <div className="team-content">
                    {ranking.length > 0 && (
                        <div className="team-ranking">
                            <RankingTable ranking={ranking} clubId={clubId} />
                        </div>
                    )}
                    <div className="team-last-match">
                        <MatchCard clubId={clubId} match={lastMatch} title="Dernier Match" />
                    </div>
                    <div className="team-next-match">
                        <MatchCard clubId={clubId} match={nextMatch} title="Prochain Match" />
                    </div>
                </div>
            )}

            {index === 1 && (
                <div className="team-content">
                    <CompetitionResult team={team} />
                </div>
            )}

            {index === 2 && (
                <div className="team-content">
                    <CompetitionCalendar team={team} />
                </div>
            )}
        </div>
    );
};

export default TeamColumn;
