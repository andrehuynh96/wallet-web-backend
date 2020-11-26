const _ = require('lodash');
const Quiz = require('app/model/wallet').quizzes;
const SurveyResult = require('app/model/wallet').survey_results;
const SurveyStatus = require('app/model/wallet/value-object/survey-status');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

module.exports = {
  getSurveyPoint(survey, membershipTypeKey) {
    const propertyName = `${membershipTypeKey.trim().toLowerCase()}_membership_point`;
    const points = survey[propertyName] || 0;

    return points;
  },
  async getInProcessSurvey(msPointSurveyIsEnabled, userId) {
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
  },


};
