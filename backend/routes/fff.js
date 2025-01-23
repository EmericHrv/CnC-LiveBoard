import express from 'express';
import dotenv from 'dotenv';
import { getAllTeams, fetchAndAssignRankings } from '../services/fffservice.js';
import { getGroupRanking, getNextTeamMatch, getLastTeamMatch, getCompetitionTeams, getCompetitionResults, getCompetitionCalendar } from '../services/fff/fff_data_module.mjs';
import { sendJsonResponse } from '../utils/response.js';
import { teamsValidator, rankingsValidator, rankingValidator, matchValidator } from '../validation/validators.js';

dotenv.config();
const router = express.Router();

const clubIDs = process.env.CLUB_IDS.split(',').map((id) => parseInt(id, 10));

// Route : /teams
router.get('/teams', async (req, res, next) => {
    try {
        const { error } = teamsValidator.validate({ clubIds: clubIDs });
        if (error) return sendJsonResponse(res, 400, { error: error.details[0].message });

        const teams = await getAllTeams(clubIDs);
        sendJsonResponse(res, 200, teams);
    } catch (error) {
        next(error);
    }
});

// Route : /rankings
router.post('/rankings', async (req, res, next) => {
    const { error } = rankingsValidator.validate(req.body);
    if (error) return sendJsonResponse(res, 400, { error: error.details[0].message });

    try {
        const { clubId, teams } = req.body;
        await fetchAndAssignRankings(teams);
        sendJsonResponse(res, 200, { clubId, teams });
    } catch (error) {
        next(error);
    }
});

// Route : /ranking
router.post('/ranking', async (req, res, next) => {
    const { error } = rankingValidator.validate(req.body);
    if (error) return sendJsonResponse(res, 400, { error: error.details[0].message });

    try {
        const { competitionId, phaseId, groupId } = req.body;
        const ranking = await getGroupRanking(competitionId, phaseId, groupId);

        const result = ranking.length
            ? { competitionId, phaseId, groupId, ranking }
            : {
                competitionId,
                phaseId,
                groupId,
                ranking: await getCompetitionTeams(competitionId, phaseId, groupId),
            };

        sendJsonResponse(res, 200, result);
    } catch (error) {
        next(error);
    }
});

// Route : /nextmatch
router.post('/nextmatch', async (req, res, next) => {
    const { error } = matchValidator.validate(req.body);
    if (error) return sendJsonResponse(res, 400, { error: error.details[0].message });

    try {
        const { clubId, teamId } = req.body;
        const nextMatch = await getNextTeamMatch(clubId, teamId);
        sendJsonResponse(res, 200, { clubId, teamId, nextMatch });
    } catch (error) {
        next(error);
    }
});

// Route : /lastmatch
router.post('/lastmatch', async (req, res, next) => {
    const { error } = matchValidator.validate(req.body);
    if (error) return sendJsonResponse(res, 400, { error: error.details[0].message });

    try {
        const { clubId, teamId } = req.body;
        const lastMatch = await getLastTeamMatch(clubId, teamId);
        sendJsonResponse(res, 200, { clubId, teamId, lastMatch });
    } catch (error) {
        next(error);
    }
});

// Route : /competitionresults
router.post('/competitionresults', async (req, res, next) => {
    const { error } = rankingValidator.validate(req.body);
    if (error) return sendJsonResponse(res, 400, { error: error.details[0].message });

    try {
        const { competitionId, phaseId, groupId } = req.body;
        const results = await getCompetitionResults(competitionId, phaseId, groupId);
        sendJsonResponse(res, 200, results);
    } catch (error) {
        next(error);
    }
});

// Route : /competitioncalendar
router.post('/competitioncalendar', async (req, res, next) => {
    const { error } = rankingValidator.validate(req.body);
    if (error) return sendJsonResponse(res, 400, { error: error.details[0].message });

    try {
        const { competitionId, phaseId, groupId } = req.body;
        const calendar = await getCompetitionCalendar(competitionId, phaseId, groupId);
        sendJsonResponse(res, 200, calendar);
    } catch (error) {
        next(error);
    }
});

export default router;
