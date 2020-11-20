const _ = require('lodash');
const moment = require('moment');
const logger = require('app/lib/logger');
const config = require('app/config');
const ClaimPoint = require('app/model/wallet').point_histories;
const claimPointMapper = require('app/feature/response-schema/point-history.response-schema');
const ClaimPointStatus = require('../../../model/wallet/value-object/point-status');
const MembershipType = require('app/model/wallet').membership_types;
const Setting = require('app/model/wallet').settings;
const Member = require('app/model/wallet').members;
const database = require('app/lib/database').db().wallet;
const PointAction = require("app/model/wallet/value-object/point-action");
const MsPointPhaseType = require("app/model/wallet/value-object/ms-point-phase-type");
const Surveys = require('app/model/wallet').surveys;
const SurveyResult = require('app/model/wallet').survey_results;
const settingHelper = require('app/lib/utils/setting-helper');
const Sequelize = require('sequelize');
const SurveyStatus = require('app/model/wallet/value-object/survey-status');
const SurveyType = require('app/model/wallet/value-object/survey-type');

const Op = Sequelize.Op;
const keys = [
  config.setting.MS_POINT_MODE,
  config.setting.MS_POINT_DELAY_TIME_IN_SECONDS,
  config.setting.MS_POINT_CLAIMING_IS_ENABLED,
  config.setting.MS_POINT_DELAY_TIME_DURATION,
  config.setting.MS_POINT_SURVEY_IS_ENABLED,
];

module.exports = {
  getAll: async (req, res, next) => {
    try {
      logger.info('claim-point::all');
      const { query: { offset, limit }, user } = req;
      const where = { member_id: user.id };
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: claims } = await ClaimPoint.findAndCountAll({ offset: off, limit: lim, where: where, order: [['created_at', 'DESC']] });
      return res.ok({
        items: claimPointMapper(claims),
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get all claim point fail: ", err);
      next(err);
    }
  },
  setting: async (req, res, next) => {
    try {
      logger.info('claim-point::setting');
      const membershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id,
          deleted_flg: false
        }
      });
      const {
        msPointMode,
        msPointDelayTimeInSeconds,
        msPointDelayTimeDuration,
        msPointClaimingIsEnabled,
        msPointSurveyIsEnabled,
      } = await getSettings();
      const survey = await getInProcessSurvey(msPointSurveyIsEnabled, req.user.id);

      return res.ok({
        mode: survey ? MsPointPhaseType.PHASE_3_SURVEY : MsPointPhaseType.PHASE_1,
        amount: membershipType ? membershipType.claim_points : undefined,
        claiming: {
          amount: membershipType ? membershipType.claim_points : undefined,
          is_enabled: msPointClaimingIsEnabled,
          time: msPointDelayTimeInSeconds,
          duration: msPointDelayTimeDuration,
        },
        survey: {
          is_enabled: msPointSurveyIsEnabled,
        },
      });
    } catch (err) {
      logger.error("get setting claim point fail: ", err);
      next(err);
    }
  },
  create: async (req, res, next) => {
    let transaction;
    try {
      let membershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id,
          deleted_flg: false
        }
      });
      if (!membershipType) {
        return res.ok({
          claimable: false,
          code: 'NOT_FOUND_MEMBERSHIPSHIP',
        });
      }

      const {
        msPointDelayTimeInSeconds,
        msPointClaimingIsEnabled,
        msPointSurveyIsEnabled,
      } = await getSettings();
      const survey = await getInProcessSurvey(msPointSurveyIsEnabled, req.user.id);
      if (survey) {
        return res.forbidden(res.__("MEMBER_NEED_SUBMIT_SURVEY"), "MEMBER_NEED_SUBMIT_SURVEY", {
          mode: MsPointPhaseType.PHASE_3_SURVEY,
          survey_id: survey.id,
        });
      }

      if (!msPointClaimingIsEnabled) {
        return res.forbidden(res.__("MS_POINT_CLAIMING_IS_DISABLED"), "MS_POINT_CLAIMING_IS_DISABLED", {
          mode: MsPointPhaseType.PHASE_1,
        });
      }

      const now = Date.now();
      let claim = await ClaimPoint.findOne({
        where: {
          member_id: req.user.id,
        },
        order: [['created_at', 'DESC']]
      });

      let next_time = claim ? Date.parse(claim.createdAt) / 1000 + msPointDelayTimeInSeconds : 0;
      if (now / 1000 < next_time) {
        return res.badRequest(res.__("CANNOT_CLAIM_POINT"), "CANNOT_CLAIM_POINT", {
          next_time,
          date: moment.utc().add(msPointDelayTimeInSeconds, 'second').format('YYYY-MM-DD HH:mm:ss UTC'),
        });
      }

      transaction = await database.transaction();
      await ClaimPoint.create({
        member_id: req.user.id,
        amount: membershipType.claim_points,
        currency_symbol: req.body.currency_symbol || "MS_POINT",
        status: ClaimPointStatus.APPROVED
      }, transaction);
      await Member.increment({
        points: parseInt(membershipType.claim_points)
      }, {
        where: {
          id: req.user.id
        },
        transaction
      });

      transaction.commit();

      return res.ok({
        claimable: true,
        claim_points: membershipType.claim_points,
      });
    } catch (err) {
      logger.error("create claim point fail: ", err);
      if (transaction) {
        transaction.rollback();
      }
      next(err);
    }
  },
  check: async (req, res, next) => {
    try {
      const {
        msPointDelayTimeInSeconds,
        msPointDelayTimeDuration,
        msPointClaimingIsEnabled,
        msPointSurveyIsEnabled,
      } = await getSettings();

      if (!msPointClaimingIsEnabled && !msPointSurveyIsEnabled) {
        return res.ok({
          claimable: false,
          claimingIsEnabled: msPointClaimingIsEnabled,
          surveyIsEnabled: msPointSurveyIsEnabled,
        });
      }

      let membershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id,
          deleted_flg: false
        }
      });
      if (!membershipType) {
        return res.ok({
          claimable: false
        });
      }

      const survey = await getInProcessSurvey(msPointSurveyIsEnabled, req.user.id);
      if (survey) {
        const points = getSurveyPoint(survey, membershipType.name);

        return res.ok({
          claimable: true,
          mode: MsPointPhaseType.PHASE_3_SURVEY,
          survey: {
            id: survey.id,
            membership_name: membershipType.name,
            points,
          },
        });
      }

      let claim = await ClaimPoint.findOne({
        where: {
          member_id: req.user.id,
          action: PointAction.CLAIM
        },
        order: [['created_at', 'DESC']]
      });

      let next_time = claim ? Date.parse(claim.createdAt) / 1000 + msPointDelayTimeInSeconds : 0;
      let claimable = true;
      let now = Date.now() / 1000;
      if (now < next_time) {
        claimable = false;
      }

      return res.ok({
        claimable: claimable,
        mode: MsPointPhaseType.PHASE_1,
        next_time: next_time,
        date: moment.utc().add(msPointDelayTimeInSeconds, 'second').format('YYYY-MM-DD HH:mm:ss UTC'),
        claiming: {
          is_enabled: msPointClaimingIsEnabled,
          time: msPointDelayTimeInSeconds,
          duration: msPointDelayTimeDuration,
        },
        survey: {
          is_enabled: msPointSurveyIsEnabled,
        },
      });
    } catch (err) {
      logger.error("check claim point fail: ", err);
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

const getSurveyPoint = (survey, membershipTypeName) => {
  let points = 0;

  switch (membershipTypeName.trim().toUpperCase()) {
    case 'SILVER':
      points = survey.silver_membership_point;
      break;

    case 'GOLD':
      points = survey.gold_membership_point;
      break;

    case 'PLATINUM':
      points = survey.platinum_membership_point;
      break;

    // case 'DIAMOND':
    //   points = 0;
    //   break;
  }

  return points;
};
