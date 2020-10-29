const logger = require('app/lib/logger');
const config = require('app/config');
const PointHistory = require('app/model/wallet').point_histories;
const MembershipType = require('app/model/wallet').membership_types;
const PointStatus = require("app/model/wallet/value-object/point-status");
const PointAction = require("app/model/wallet/value-object/point-action");
const Setting = require('app/model/wallet').settings;
const Member = require('app/model/wallet').members;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const database = require('app/lib/database').db().wallet;

module.exports = {
  staking: async (req, res, next) => {
    let transaction;
    try {
      if (!req.user.membership_type_id) {
        return res.badRequest(res.__("UPGRADE_MEMBERSHIP_TYPE_TO_RECEIVE_STAKING_POINT"), "UPGRADE_MEMBERSHIP_TYPE_TO_RECEIVE_STAKING_POINT");
      }

      let history = await PointHistory.findOne({
        where: {
          member_id: req.user.id,
          action: PointAction.STAKING,
          status: {
            [Op.ne]: PointStatus.CANCELED
          }
        }
      });
      if (history) {
        return res.badRequest(res.__("YOU_HAVE_BEEN_RECEIVED_POINT_FOR_STAKING"), "YOU_HAVE_BEEN_RECEIVED_POINT_FOR_STAKING");
      }

      let setting = await Setting.findOne({
        where: {
          key: config.setting.MS_POINT_STAKING_IS_ENABLED
        }
      });
      if (!setting || Boolean(setting.value) == false) {
        return res.badRequest(res.__("POINT_STAKING_IS_DISABLE"), "POINT_STAKING_IS_DISABLE");
      }

      let membershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id,
          deleted_flg: false
        }
      });
      if (!membershipType) {
        return res.serverInternalError();
      }
      console.log(membershipType)

      transaction = await database.transaction();
      await PointHistory.create({
        member_id: req.user.id,
        amount: membershipType.staking_points || 0,
        currency_symbol: "MS_POINT",
        status: PointStatus.APPROVED,
        action: PointAction.STAKING,
        tx_id: req.body.tx_id,
        platform: req.body.platform,
        source_amount: req.body.amount,
        description: JSON.stringify(req.body)
      }, transaction);

      await Member.increment({
        points: parseInt(membershipType.staking_points || 0)
      }, {
          where: {
            id: req.user.id
          },
          transaction
        })
      transaction.commit();
      return res.ok(true);
    }
    catch (err) {
      logger.error(`point tracking staking`, err);
      if (transaction) {
        transaction.rollback();
      }
      next(err);
    }
  }
}