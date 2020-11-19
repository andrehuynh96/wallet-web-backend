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

const Op = Sequelize.Op;
const keys = [
  config.setting.MS_POINT_MODE,
  config.setting.MS_POINT_DELAY_TIME_IN_SECONDS,
  config.setting.MS_POINT_CLAIMING_IS_ENABLED,
  config.setting.MS_POINT_DELAY_TIME_DURATION,
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

      const settings = await Setting.findAll({
        where: {
          key: {
            [Op.in]: keys,
          }
        }
      });
      const msPointMode = settingHelper.getPropertyValue(settings, 'ms_point_mode', MsPointPhaseType.PHASE_1);
      const msPointDelayTimeInSeconds = settingHelper.getPropertyValue(settings, 'ms_point_delay_time_in_seconds', 0);
      const msPointDelayTimeDuration = settingHelper.getPropertyValue(settings, 'ms_point_delay_time_duration', '');
      const msPointClaimingIsEnabled = settingHelper.getPropertyValue(settings, 'ms_point_claiming_is_enabled', 'false');

      return res.ok({
        mode: msPointMode,
        amount: membershipType ? membershipType.claim_points : undefined,
        claiming: {
          amount: membershipType ? membershipType.claim_points : undefined,
          is_enabled: msPointClaimingIsEnabled,
          time: msPointDelayTimeInSeconds,
          duration: msPointDelayTimeDuration,
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
      const settings = await Setting.findAll({
        where: {
          key: {
            [Op.in]: keys
          }
        }
      });
      const msPointMode = settingHelper.getPropertyValue(settings, 'ms_point_mode', MsPointPhaseType.PHASE_1);
      const msPointDelayTimeInSeconds = settingHelper.getPropertyValue(settings, 'ms_point_delay_time_in_seconds', 0);
      const msPointClaimingIsEnabled = settingHelper.getPropertyValue(settings, 'ms_point_claiming_is_enabled', 'false');
      if (msPointMode === MsPointPhaseType.PHASE_3_SURVEY) {
        // Find active survey
        const now = Date.now();
        const cond = {
          actived_flg: true,
          deleted_flg: false,
          start_date: {
            [Op.lt]: now
          },
          end_date: {
            [Op.gte]: now
          },
        };
        const survey = await Surveys.findOne({
          where: cond,
          order: [['created_at', 'DESC']]
        });

        if (survey) {
          const surveyResult = await SurveyResult.findOne({
            where: {
              survey_id: survey.id,
              member_id: req.user.id,
            }
          });

          // Member have not submited survey
          if (!surveyResult) {
            return res.forbidden(res.__("MEMBER_HAVE_NOT_SUBMITED_SURVEY"), "MEMBER_HAVE_NOT_SUBMITED_SURVEY", {
              mode: msPointMode,
              survey_id: survey.id,
            });
          }
        }
      }

      if (!msPointClaimingIsEnabled) {
        return res.forbidden(res.__("MS_POINT_CLAIMING_IS_DISABLED"), "MS_POINT_CLAIMING_IS_DISABLED", {
          mode: msPointMode,
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
          claimable: false,
          code: 'NOT_FOUND_MEMBERSHIPSHIP',
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
      if (!msPointClaimingIsEnabled) {
        return res.ok({
          claimable: false
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

      let claim = await ClaimPoint.findOne({
        where: {
          member_id: req.user.id,
          action: PointAction.CLAIM
        },
        order: [['created_at', 'DESC']]
      });
      let setting = await Setting.findOne({
        where: {
          key: config.setting.MS_POINT_DELAY_TIME_IN_SECONDS
        }
      });
      let next_time = claim ? Date.parse(claim.createdAt) / 1000 + parseInt(setting.value) : 0;
      let claimable = true;
      let now = Date.now() / 1000;
      if (now < next_time) {
        claimable = false;
      }

      return res.ok({
        claimable: claimable,
        next_time: next_time,
        date: moment.utc().add(msPointDelayTimeInSeconds, 'second').format('YYYY-MM-DD HH:mm:ss UTC'),
        claiming: {
          is_enabled: msPointClaimingIsEnabled,
          time: msPointDelayTimeInSeconds,
          duration: msPointDelayTimeDuration,
        },
      });
    } catch (err) {
      logger.error("check claim point fail: ", err);
      next(err);
    }
  }
};
