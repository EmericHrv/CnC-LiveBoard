export const transformTeam = (teamData) => {
    if (!teamData) return { name: 'EXEMPT' }; // Équipe exemptée
    return {
        id: teamData['number'],
        clubId: teamData['club']['cl_no'],
        categoryCode: teamData['category_code'],
        code: teamData['code'],
        category: teamData['category_code'] === 'SEM' ? 'SENIORS' : teamData['category_code'],
        name: `${teamData['short_name']} ${teamData['code']}`,
        logoUrl: teamData['club']['logo'] || '',
    };
};

export const transformStadium = (stadiumData) => {
    if (!stadiumData) return null;
    return {
        id: stadiumData['te_no'],
        name: stadiumData['name'],
        address: stadiumData['address'],
        city: stadiumData['city'],
        zipCode: stadiumData['zip_code'],
        surface: stadiumData['libelle_surface'],
    };
};
