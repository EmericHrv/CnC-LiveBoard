import Joi from 'joi';

// Validator for /teams
export const teamsValidator = Joi.object({
    clubIds: Joi.array().items(Joi.number()).required(),
});

// Validator for /rankings
export const rankingsValidator = Joi.object({
    clubId: Joi.number().required(),
    teams: Joi.array()
        .items(
            Joi.object({
                id: Joi.number().required(),
                competition: Joi.object({
                    id: Joi.number().required(),
                    phase: Joi.number().required(),
                    poule: Joi.number().required(),
                }).required(),
            })
        )
        .required(),
});

// Validator for /ranking, /competitionresults, /competitioncalendar
export const rankingValidator = Joi.object({
    competitionId: Joi.number().required(),
    phaseId: Joi.number().required(),
    groupId: Joi.number().required(),
});

// Validator for /nextmatch and /lastmatch
export const matchValidator = Joi.object({
    clubId: Joi.number().required(),
    teamId: Joi.number().required(),
});
