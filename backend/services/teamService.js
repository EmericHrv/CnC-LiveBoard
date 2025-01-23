import { getClubTeams, getGroupRanking, getCompetitionTeams } from '../services/fff/fff_data_module.mjs';

export const getAllTeams = async (clubIDs) => {
    return await Promise.all(
        clubIDs.map(async (clubID) => {
            const { clubName, teams } = await getClubTeams(clubID);
            return { clubId: clubID, clubName, teams };
        })
    );
};

export const fetchAndAssignRankings = async (teams) => {
    const rankingPromises = teams.map((team) =>
        team.competition
            ? getGroupRanking(team.competition.id, team.competition.phase, team.competition.poule).then(async (ranking) => {
                team.ranking = ranking.length > 0 ? ranking : await getCompetitionTeams(
                    team.competition.id,
                    team.competition.phase,
                    team.competition.poule
                );
            })
            : (team.ranking = null)
    );
    await Promise.all(rankingPromises);
};
