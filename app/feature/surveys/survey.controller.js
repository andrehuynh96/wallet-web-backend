const logger = require('app/lib/logger');
const Surveys = require('app/model/wallet').surveys;
const Questions = require('app/model/wallet').questions;
const surveyMapper = require('./survey.response-schema');
const questionMapper = require('./question.response-schema');
const sequelize = require('sequelize');
module.exports = {
    getSurveys: async (req, res, next) => {
        try {
            let survey = await Surveys.findOne({
                where: sequelize.literal(
                    `start_date<NOW() AND NOW()<end_date AND created_at = (SELECT MAX(created_at) from surveys)`)
            });
            survey = surveyMapper(survey);
            if (!survey || !survey.id) return res.ok({})
            let questions = await Questions.findAll({
                where: {
                    survey_id: survey.id
                }
            })
            questions = questionMapper(questions)
            return res.ok({
                ...survey,
                questions: questions
            })
        } catch (err) {
            logger.error('get active surveys fail: ', err);
            next(err);
        }
    }
}