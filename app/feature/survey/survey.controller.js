const logger = require('app/lib/logger');
const Surveys = require('app/model/wallet').surveys;
const Questions = require('app/model/wallet').questions;
const Answers = require('app/model/wallet').question_answers;
const SurveyResult = require('app/model/wallet').survey_results;
const surveyMapper = require('./survey.response-schema');
const questionMapper = require('./question.response-schema');
const sequelize = require('sequelize');

module.exports = {
  getSurveys: async (req, res, next) => {
    try {
      let survey = await Surveys.findOne({
        where: sequelize.literal(
          `actived_flg = true AND start_date<NOW() AND NOW()<end_date AND created_at = (SELECT MAX(created_at) from surveys)`)
      });
      if (survey) {
        let surveyResult = await SurveyResult.findOne({
          where: {
            member_id: req.user.id,
            survey_id: survey.id
          }
        });

        if (surveyResult) {
          return res.notFound();
        }
      }

      let ret_survey = surveyMapper(survey);
      if (!ret_survey || !ret_survey.id) return res.ok({})
      let questions = await Questions.findAll({
        where: {
          survey_id: ret_survey.id,
          actived_flg: true
        },
        include: [{
          model: Answers,
          as: "Answers"
        }]
      })
      let ret_questions = questionMapper(questions)
      if (req.user.current_language == 'ja') {
        ret_survey.content = survey.content_ja;
        for (let i = 0; i < ret_questions.length; i++) {
          ret_questions[i].title = questions[i].dataValues.title_ja
          for (let j = 0; j < ret_questions[i].Answers.length; j++) {
            ret_questions[i].Answers[j].text = questions[i].dataValues.Answers[j].text_ja
          }
        }
      }
      return res.ok({
        ...ret_survey,
        questions: ret_questions
      })
    } catch (err) {
      logger.error('get active surveys fail: ', err);
      next(err);
    }
  }
}