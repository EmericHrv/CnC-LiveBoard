import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.liveboard.esmorannes.com';

export const fetchClubsData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/fff/teams`);

        // Filtrer les clubs avec des équipes
        const clubsWithTeams = response.data.filter(club => club.teams && club.teams.length > 0);

        // Regrouper les équipes par tranches de 3
        const clubsWithGroupedTeams = clubsWithTeams.flatMap(club => {
            const sortedTeams = club.teams.sort((a, b) => a.id - b.id);
            const groupedTeams = [];
            for (let i = 0; i < sortedTeams.length; i += 3) {
                groupedTeams.push({
                    ...club,
                    teams: sortedTeams.slice(i, i + 3),
                });
            }
            return groupedTeams;
        });

        return clubsWithGroupedTeams;
    } catch (error) {
        throw error; // Relancer l'erreur pour qu'elle soit gérée dans le composant
    }
};
