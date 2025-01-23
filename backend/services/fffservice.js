import { getClubTeams, getGroupRanking, getCompetitionTeams } from '../services/fff/fff_data_module.mjs';

export const getAllTeams = async (clubIDs) => {
    const allTeams = await Promise.all(
        clubIDs.map(async (clubID) => {
            const { clubName, teams } = await getClubTeams(clubID);
            return { clubId: clubID, clubName, teams };
        })
    );
    return allTeams;
};

export const fetchAndAssignRankings = async (teams) => {
    const rankingPromises = teams.map(async (team) => {
        if (team.competition) {
            const ranking = await getGroupRanking(
                team.competition.id,
                team.competition.phase,
                team.competition.poule
            );
            team.ranking = ranking.length > 0 ? ranking : await getCompetitionTeams(
                team.competition.id,
                team.competition.phase,
                team.competition.poule
            );
        } else {
            team.ranking = null;
        }
    });
    await Promise.all(rankingPromises);
};

export const handleError = (error) => {
    console.error('FetchError:', error.message);
};
