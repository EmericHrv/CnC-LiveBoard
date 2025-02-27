import React from 'react';
import './RankingTable.css'; // Import des styles spécifiques

const RankingTable = ({ ranking, clubId }) => {
    return (
        <div className="common-component">
            {/* En-tête de la table */}
            <div className="common-component-header">
                <h3>Classements du groupe</h3>
            </div>

            {/* Contenu avec scroll vertical pour limiter la hauteur */}
            <div className="ranking-table-body">
                <table className="ranking-table-content">
                    <thead>
                        <tr>
                            <th className="center">Pl</th>
                            <th>Équipe</th>
                            <th className="right">Pts</th>
                            <th className="right">J</th>
                            <th className="right">G</th>
                            <th className="right">N</th>
                            <th className="right">P</th>
                            <th className="right">BP</th>
                            <th className="right">BC</th>
                            <th className="right">Diff</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((rank, index) => {
                            const isCurrentClub = rank.team.clubId === clubId;
                            return (
                                <tr
                                    key={index}
                                    className={`${isCurrentClub
                                        ? 'highlight-row'
                                        : index % 2 === 0
                                            ? 'even-row'
                                            : 'odd-row'
                                        }`}
                                >
                                    <td className="center bold">{rank.rank}</td>
                                    <td className={`${isCurrentClub ? 'bold' : ''}`}>
                                        {rank.team.name}
                                    </td>
                                    <td className="right bold">{rank.nbPoints}</td>
                                    <td className="right">{rank.nbMatchsPlayed}</td>
                                    <td className="right">{rank.nbMatchsWin}</td>
                                    <td className="right">{rank.nbMatchsEqual}</td>
                                    <td className="right">{rank.nbMatchsLost}</td>
                                    <td className="right">{rank.nbGoalsFor}</td>
                                    <td className="right">{rank.nbGoalsAgainst}</td>
                                    <td className="right">{rank.nbGoalsDiff}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankingTable;