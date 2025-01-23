import moment from 'moment-timezone'; // Utilisé pour gérer les fuseaux horaires

// Obtenir la lettre correspondant à un index (1-26)
function getLetterFromIndex(index) {
    if (index >= 1 && index <= 26) {
        return String.fromCharCode(64 + index);
    } else {
        throw new Error("L'index doit être compris entre 1 et 26 inclus.");
    }
}

// Formater une date en français (Ex: "lun 01 janvier")
function formatFrenchDate(dateString) {
    const parsedDate = moment.tz(dateString, 'Europe/Paris');
    const formattedDate = parsedDate.locale('fr').format('ddd DD MMMM');
    return formattedDate.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
}

// Obtenir la date actuelle dans le fuseau Europe/Paris
function getCurrentDate() {
    return moment().tz('Europe/Paris').format('YYYY-MM-DD');
}

// Obtenir la date du jour suivant dans le fuseau Europe/Paris
function getNextDayDate() {
    return moment().tz('Europe/Paris').add(1, 'day').format('YYYY-MM-DD');
}

// Obtenir la date dans 2 mois dans le fuseau Europe/Paris
function getNext2MonthDate() {
    return moment().tz('Europe/Paris').add(2, 'month').format('YYYY-MM-DD');
}

// Obtenir un timestamp formaté (Ex: "01-01-2025 12:00:00")
function getTimestamp() {
    const now = moment().tz('Europe/Paris');
    return now.format('DD-MM-YYYY HH:mm:ss');
}

// Formater une date et heure (Ex: "01 janvier 2025 à 12:00")
function formatDateTime(isoDateStr, timeStr) {
    if (!isoDateStr) return null;
    const date = new Date(`${isoDateStr}T${timeStr || '00:00'}:00`);
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'long',
        timeStyle: timeStr ? 'short' : undefined,
        timeZone: 'Europe/Paris',
    }).format(date);
}

export default {
    getLetterFromIndex,
    formatFrenchDate,
    getCurrentDate,
    getNextDayDate,
    getNext2MonthDate,
    getTimestamp,
    formatDateTime, // Fusion de la fonction issue de `dateUtils.js`
};
