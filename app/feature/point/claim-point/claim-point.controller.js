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
      let membershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id,
          deleted_flg: false
        }
      })
      let setting = await Setting.findOne({
        where: {
          key: config.setting.MS_POINT_DELAY_TIME_IN_SECONDS
        }
      })
      return res.ok({
        amount: membershipType ? membershipType.claim_points : undefined,
        time: setting ? parseInt(setting.value) : undefined
      })
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
      })
      if (membershipType) {
        let claim = await ClaimPoint.findOne({
          where: {
            member_id: req.user.id,
          },
          order: [['created_at', 'DESC']]
        });
        let setting = await Setting.findOne({
          where: {
            key: config.setting.MS_POINT_DELAY_TIME_IN_SECONDS
          }
        })
        let next_time = claim ? Date.parse(claim.createdAt) / 1000 + parseInt(setting.value) : 0;
        if (Date.now() / 1000 < next_time)
          return res.badRequest(res.__("CANNOT_CLAIM_POINT"), "CANNOT_CLAIM_POINT", {
            next_time
          });
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
        })
        transaction.commit();
        return res.ok(true);
      } else {
        return res.ok(false);
      }
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
      let membershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id,
          deleted_flg: false
        }
      })
      if (membershipType) {
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
        })
        let next_time = claim ? Date.parse(claim.createdAt) / 1000 + parseInt(setting.value) : 0;
        let claimable = true;
        let now = Date.now() / 1000;
        if (now < next_time)
          claimable = false;
        return res.ok({
          claimable: claimable,
          next_time: next_time
        });
      } else {
        return res.ok({
          claimable: false
        });
      }
    } catch (err) {
      logger.error("check claim point fail: ", err);
      next(err);
    }
  }
}
