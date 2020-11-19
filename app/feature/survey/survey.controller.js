const _ = require('lodash');
const logger = require('app/lib/logger');
const config = require('app/config');
const Surveys = require('app/model/wallet').surveys;
const Questions = require('app/model/wallet').questions;
const Answers = require('app/model/wallet').question_answers;
const SurveyResult = require('app/model/wallet').survey_results;
const Setting = require('app/model/wallet').settings;
const surveyMapper = require('./survey.response-schema');
const questionMapper = require('./question.response-schema');
const SurveyStatus = require('app/model/wallet/value-object/survey-status');
const SurveyType = require('app/model/wallet/value-object/survey-type');
const MsPointPhaseType = require("app/model/wallet/value-object/ms-point-phase-type");
const settingHelper = require('app/lib/utils/setting-helper');
const Sequelize = require('sequelize');

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
      const {
        msPointClaimingIsEnabled,
        msPointSurveyIsEnabled,
      } = await getSettings();

      if (!msPointSurveyIsEnabled) {
        return res.ok({
          claimable: false,
          claimingIsEnabled: msPointClaimingIsEnabled,
          surveyIsEnabled: msPointSurveyIsEnabled,
        });
      }

      const survey = await getInProcessSurvey(msPointSurveyIsEnabled, req.user.id);
      if (!survey) {
        return res.notFound(res.__("NOT_FOUND_IN_PROCESS_SURVEY"), "NOT_FOUND_IN_PROCESS_SURVEY");
      }

      let questions = await Questions.findAll({
        where: {
          survey_id: survey.id,
          actived_flg: true
        },
        include: [{
          model: Answers,
          as: "Answers"
        }]
      });

      let ret_survey = surveyMapper(survey);
      let ret_questions = questionMapper(questions);

      if (req.user.current_language == 'ja') {
        ret_survey.content = survey.content_ja || ret_survey.content;
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

  const surveys = await Surveys.findAll({
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
