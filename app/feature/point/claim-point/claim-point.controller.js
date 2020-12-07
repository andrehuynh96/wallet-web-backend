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
const settingHelper = require('app/lib/utils/setting-helper');
const surveyHelper = require('app/lib/utils/survey-helper');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const keys = [
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
        msPointDelayTimeInSeconds,
        msPointDelayTimeDuration,
        msPointClaimingIsEnabled,
        msPointSurveyIsEnabled,
      } = await getSettings();
      const survey = await surveyHelper.getInProcessSurvey(msPointSurveyIsEnabled, req.user.id);

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
          code: 'NOT_FOUND_MEMBERSHIP_TYPE',
        });
      }

      const {
        msPointDelayTimeInSeconds,
        msPointClaimingIsEnabled,
        msPointSurveyIsEnabled,
      } = await getSettings();
      const survey = await surveyHelper.getInProcessSurvey(msPointSurveyIsEnabled, req.user.id);
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
          action: [PointAction.CLAIM, PointAction.SURVEY],
        },
        order: [['created_at', 'DESC']]
      });

      let next_time = claim ? Date.parse(claim.createdAt) / 1000 + msPointDelayTimeInSeconds : 0;
      if (now / 1000 < next_time) {
        return res.badRequest(res.__("CANNOT_CLAIM_POINT"), "CANNOT_CLAIM_POINT", {
          next_time,
          date: moment(claim.createdAt).add(msPointDelayTimeInSeconds, 'second').utc().format('YYYY-MM-DD HH:mm:ss UTC'),
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

      const survey = await surveyHelper.getInProcessSurvey(msPointSurveyIsEnabled, req.user.id);
      if (survey) {
        const points = surveyHelper.getSurveyPoint(survey, membershipType.key);

        return res.ok({
          claimable: true,
          mode: MsPointPhaseType.PHASE_3_SURVEY,
          survey: {
            id: survey.id,
            membership_name: membershipType.name,
            points,
            type: survey.type
          },
        });
      }

      let claim = await ClaimPoint.findOne({
        where: {
          member_id: req.user.id,
          action: [PointAction.CLAIM, PointAction.SURVEY],
        },
        order: [['created_at', 'DESC']]
      });

      let next_time = claim ? Date.parse(claim.createdAt) / 1000 + msPointDelayTimeInSeconds : 0;
      let claimable = true;
      let now = Date.now() / 1000;
      if (now < next_time) {
        claimable = false;
      }

      const date = claim ? moment(claim.createdAt).add(msPointDelayTimeInSeconds, 'second').utc().format('YYYY-MM-DD HH:mm:ss UTC') : new Date;

      return res.ok({
        claimable: claimable,
        mode: MsPointPhaseType.PHASE_1,
        next_time: next_time,
        date: date,
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
  const msPointDelayTimeInSeconds = settingHelper.getPropertyValue(settings, 'ms_point_delay_time_in_seconds', 0);
  const msPointDelayTimeDuration = settingHelper.getPropertyValue(settings, 'ms_point_delay_time_duration', '');
  const msPointClaimingIsEnabled = settingHelper.getPropertyValue(settings, 'ms_point_claiming_is_enabled', 'false');
  const msPointSurveyIsEnabled = settingHelper.getPropertyValue(settings, 'ms_point_survey_is_enabled', 'false');

  return {
    msPointDelayTimeInSeconds,
    msPointDelayTimeDuration,
    msPointClaimingIsEnabled,
    msPointSurveyIsEnabled,
  };
};

