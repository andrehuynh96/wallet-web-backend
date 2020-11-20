const logger = require('app/lib/logger');
const Surveys = require('app/model/wallet').surveys;
const Questions = require('app/model/wallet').questions;
const Answers = require('app/model/wallet').question_answers;
const SurveyResult = require('app/model/wallet').survey_results;
const SurveyAnswer = require('app/model/wallet').survey_answers;
const PointHistory = require('app/model/wallet').point_histories;
const Member = require('app/model/wallet').members;

const QuestionType = require('app/model/wallet/value-object/question-type');
const PointStatus = require('app/model/wallet/value-object/point-status');
const PointAction = require('app/model/wallet/value-object/point-action');
const SystemType = require('app/model/wallet/value-object/system-type');

const surveyMapper = require('./survey.response-schema');
const questionMapper = require('./question.response-schema');


const database = require('app/lib/database').db().wallet;
const sequelize = require('sequelize');

module.exports = {
  getSurveys: async (req, res, next) => {
    try {
      let survey = await Surveys.findOne({
        where: sequelize.literal(
          `actived_flg = true AND deleted_flg=false AND start_date<NOW() AND NOW()<end_date AND created_at = (SELECT MAX(created_at) from surveys)`)
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
  },
  submitSurveys: async (req, res, next) => {
    let transaction;
    try {
      let { params: { id }, body: { items }, user } = req;
      let survey = await Surveys.findOne({
        where: {
          id: id
        }
      });

      if (!survey) return res.badRequest(res.__("SURVEY_NOT_FOUND"), "SURVEY_NOT_FOUND");

      let point = survey.dataValues.point;
      let questions = await Questions.findAll({
        where: {
          survey_id: id,
          actived_flg: true
        },
        include: [{
          model: Answers,
          as: "Answers"
        }]
      })

      if (questions.length != items.length) {
        return res.badRequest(res.__("MISS_SOME_QUESTION"), "MISS_SOME_QUESTION");
      }

      let totalCorrect = 0, totalAnswers = 0;

      for (let i = 0; i < questions.length; i++) {
        let idx = items.findIndex(x => x.question_id == questions[i].dataValues.id);
        if (idx < 0)
          return res.badRequest(res.__("QUESTIONS_NOT_MATCH"), "QUESTIONS_NOT_MATCH");
        let userAns = items[idx], question = questions[i].dataValues, answer = questions[i].Answers;
        totalAnswers += 1;
        if ((question.question_type == QuestionType.OPEN_ENDED || questions.question_type == QuestionType.NUMERIC_OPEN_ENDED) && userAns.value.length > 0) {
          totalCorrect += 1;
          userAns.open = true;
        }
        else {
          let result = true;
          userAns.open = false;
          for (let j = 0; j < userAns.answer_id.length; j++) {
            let userAnsId = userAns.answer_id[j],
              userAnsVal = userAns.value[j];
            if (!answer[userAnsId].is_correct_flg || userAnsVal != answer[userAnsId].text) {
              result = false;
              break;
            }
          }
          if (result) {
            totalCorrect += 1;
          }
        }
      }
      transaction = await database.transaction();

      items.map(item => {
        new_value = {};
        if (!item.open) {
          item.answer_id.forEach(function (value, index) {
            new_value[value] = item.value[index]
          });
          item.value = new_value;
        };
        item.member_id = user.id;
        item.survey_id = id;

      });

      await Member.increment(
        { points: +point},
        { where: { id: user.id } },
        { transaction }
      );

      await SurveyAnswer.bulkCreate({
        items
      }, { transaction });

      await SurveyResult.create({
        member_id: user.id,
        survey_id: id,
        total_answer: totalAnswers,
        total_correct: totalCorrect,
        point: point
      }, { transaction });

      await PointHistory.create({
        member_id: user.id,
        status: PointStatus.APPROVED,
        action: PointAction.SURVEY,
        currency_symbol: 'MS_POINT',
        system_type: SystemType.MEMBERSHIP,
        object_id: id,
        amount: 0
      }, { transaction });

      await transaction.commit();

      return res.ok(true);
    } catch (err) {
      logger.error('submit surveys fail: ', err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  }
}
