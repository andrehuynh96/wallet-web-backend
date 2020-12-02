const _ = require('lodash');
const logger = require('app/lib/logger');
const config = require('app/config');
const Quiz = require('app/model/wallet').quizzes;
const Questions = require('app/model/wallet').questions;
const Answers = require('app/model/wallet').question_answers;
const SurveyResult = require('app/model/wallet').survey_results;
const Setting = require('app/model/wallet').settings;
const SurveyAnswer = require('app/model/wallet').survey_answers;
const PointHistory = require('app/model/wallet').point_histories;
const Member = require('app/model/wallet').members;
const QuestionType = require('app/model/wallet/value-object/question-type');
const PointStatus = require('app/model/wallet/value-object/point-status');
const PointAction = require('app/model/wallet/value-object/point-action');
const SystemType = require('app/model/wallet/value-object/system-type');
const surveyMapper = require('./survey.response-schema');
const questionMapper = require('./question.response-schema');
const SurveyStatus = require('app/model/wallet/value-object/survey-status');
const MsPointPhaseType = require("app/model/wallet/value-object/ms-point-phase-type");
const settingHelper = require('app/lib/utils/setting-helper');
const surveyHelper = require('app/lib/utils/survey-helper');
const MembershipType = require('app/model/wallet').membership_types;
const Sequelize = require('sequelize');
const SurveyResultStatus = require("app/model/wallet/value-object/survey-result-status");
const SurveyType = require('app/model/wallet/value-object/survey-type');


const database = require('app/lib/database').db().wallet;

const Op = Sequelize.Op;
const keys = [
  config.setting.MS_POINT_MODE,
  config.setting.MS_POINT_DELAY_TIME_IN_SECONDS,
  config.setting.MS_POINT_CLAIMING_IS_ENABLED,
  config.setting.MS_POINT_DELAY_TIME_DURATION,
  config.setting.MS_POINT_SURVEY_IS_ENABLED,
];

module.exports = {
  getInProcessSurvey: async (req, res, next) => {
    try {
      let membershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id,
          deleted_flg: false
        }
      });
      if (!membershipType) {
        return res.forbidden(res.__("NOT_FOUND_MEMBERSHIP_TYPE"), "NOT_FOUND_MEMBERSHIP_TYPE");
      }

      const {
        msPointSurveyIsEnabled,
      } = await getSettings();
      if (!msPointSurveyIsEnabled) {
        return res.forbidden(res.__("MS_POINT_SURVEY_IS_DISABLED"), "MS_POINT_SURVEY_IS_DISABLED");
      }

      const survey = await getInProcessSurvey(msPointSurveyIsEnabled, req.user.id);
      if (!survey) {
        return res.notFound(res.__("NOT_FOUND_IN_PROCESS_SURVEY"), "NOT_FOUND_IN_PROCESS_SURVEY");
      }

      let questions = await Questions.findAll({
        where: {
          survey_id: survey.id,
          actived_flg: true,
          deleted_flg: false
        },
        include: [{
          model: Answers,
          as: "Answers",
          where: {
            [Op.or]: {
              text: { [Op.not]: '' },
              is_other_flg: true
            }
          },
          required: false,
        }],
        order: [[{ model: Answers, as: 'Answers' }, 'is_other_flg', 'ASC']]
      });


      let ret_survey = surveyMapper(survey);
      ret_survey.points = surveyHelper.getSurveyPoint(survey, membershipType ? membershipType.key : '');

      let ret_questions = questions.length > 0 ? questionMapper(questions) : [];

      if (req.user.current_language == 'ja') {
        ret_survey.content = survey.content_ja || ret_survey.content;
        ret_survey.title = survey.title_ja || ret_survey.title;
        delete survey.content_ja;

        ret_questions.forEach(question => {
          question.title = question.title_ja || question.title;
          delete question.title_ja;

          (question.answers || []).forEach(answer => {
            answer.text = answer.text_ja || answer.text;
            delete answer.text_ja;
          });
        });
      }

      return res.ok({
        ...ret_survey,
        questions: ret_questions
      });
    } catch (err) {
      logger.error('get active surveys fail: ', err);
      next(err);
    }
  },
  submitSurveys: async (req, res, next) => {
    let transaction;
    try {
      let { params: { id }, body: { items }, user } = req;
      let survey = await Quiz.findOne({
        where: {
          id: id
        }
      });

      if (!survey) {
        return res.badRequest(res.__("SURVEY_NOT_FOUND"), "SURVEY_NOT_FOUND");
      }

      let membershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id,
          deleted_flg: false
        }
      });
      if (!membershipType) {
        return res.forbidden(res.__("NOT_FOUND_MEMBERSHIP_TYPE"), "NOT_FOUND_MEMBERSHIP_TYPE");
      }

      let point = surveyHelper.getSurveyPoint(survey, membershipType ? membershipType.key : '');
      let questions = await Questions.findAll({
        where: {
          survey_id: id,
          actived_flg: true,
          deleted_flg: false
        },
        include: [{
          model: Answers,
          as: "Answers",
          required: false,
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
        userAns.is_correct_flg = false;
        totalAnswers += 1;
        if ((question.question_type == QuestionType.OPEN_ENDED || questions.question_type == QuestionType.NUMERIC_OPEN_ENDED) && userAns.value.length > 0) {
          totalCorrect += 1;
          userAns.open = true;
        }
        else {
          let result = true;
          userAns.open = false;
          for (let j = 0; j < userAns.answer_id.length; j++) {
            let userAnsId = userAns.answer_id[j];
            let currentAnswer = answer.find(x => x.id == userAnsId);
            if (!currentAnswer.is_correct_flg) {
              result = false;
              break;
            }
          }
          if (result) {
            totalCorrect += 1;
          }
          userAns.is_correct_flg = result;
        }
      }
      transaction = await database.transaction();
      items.map(item => {
        let new_value = {};
        if (!item.open) {
          item.answer_id.forEach(function (value, index) {
            new_value[value] = item.value[index]
          });
          item.value = JSON.stringify(new_value);
        }
        else {
          item.value = item.value.join(',');
        }
        item.member_id = user.id;
        item.survey_id = id;
        item.answer_id = item.answer_id.join(',');
      });

      await SurveyAnswer.bulkCreate(items, { transaction: transaction });
      await SurveyResult.create({
        member_id: user.id,
        survey_id: id,
        total_answer: totalAnswers,
        total_correct: totalCorrect,
        point: point,
        status: SurveyResultStatus.COMPLETE
      }, { transaction });
      if (SurveyType.QUIZ != survey.type || (SurveyType.QUIZ == survey.type && totalCorrect == totalAnswers)) {
        await Member.increment({
          points: point
        }, {
          where: {
            id: user.id
          },
          transaction
        });
        await PointHistory.create({
          member_id: user.id,
          status: PointStatus.APPROVED,
          action: PointAction.SURVEY,
          currency_symbol: 'MS_POINT',
          system_type: SystemType.MEMBERSHIP,
          object_id: id,
          amount: point
        }, { transaction });
      }
      await transaction.rollback();

      return res.ok({
        total_answer: totalAnswers,
        total_correct: totalCorrect,
        point: point
      });
    } catch (err) {
      logger.error('submit surveys fail: ', err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  }
};

const getSettings = async () => {
  const settings = await Setting.findAll({
    where: {
      key: {
        [Op.in]: keys
      }
    }
  });
  const msPointMode = settingHelper.getPropertyValue(settings, 'ms_point_mode', MsPointPhaseType.PHASE_1);
  const msPointDelayTimeInSeconds = settingHelper.getPropertyValue(settings, 'ms_point_delay_time_in_seconds', 0);
  const msPointDelayTimeDuration = settingHelper.getPropertyValue(settings, 'ms_point_delay_time_duration', '');
  const msPointClaimingIsEnabled = settingHelper.getPropertyValue(settings, 'ms_point_claiming_is_enabled', 'false');
  const msPointSurveyIsEnabled = settingHelper.getPropertyValue(settings, 'ms_point_survey_is_enabled', 'false');

  return {
    msPointMode,
    msPointDelayTimeInSeconds,
    msPointDelayTimeDuration,
    msPointClaimingIsEnabled,
    msPointSurveyIsEnabled,
  };
};

const getInProcessSurvey = async (msPointSurveyIsEnabled, userId) => {
  if (!msPointSurveyIsEnabled) {
    return null;
  }

  const now = Date.now();
  const cond = {
    status: SurveyStatus.READY,
    deleted_flg: false,
    start_date: {
      [Op.lt]: now,
    },
    end_date: {
      [Op.gte]: now,
    },
  };

  const surveys = await Quiz.findAll({
    where: cond,
    order: [['created_at', 'DESC']]
  });

  if (!surveys.length) {
    return null;
  }

  const surveyIdList = surveys.map(item => item.id);
  const surveyResults = await SurveyResult.findAll({
    where: {
      survey_id: {
        [Op.in]: surveyIdList,
      },
      member_id: userId,
    }
  });
  const submitedCache = _.keyBy(surveyResults, 'survey_id');
  const notSubmitedList = surveys.filter(item => !submitedCache[item.id]);

  return notSubmitedList.length > 0 ? notSubmitedList[0] : null;
};
