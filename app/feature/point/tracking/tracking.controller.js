const logger = require('app/lib/logger');
const config = require('app/config');
const PointHistory = require('app/model/wallet').point_histories;
const MembershipType = require('app/model/wallet').membership_types;
const PointStatus = require("app/model/wallet/value-object/point-status");
const PointAction = require("app/model/wallet/value-object/point-action");
const Setting = require('app/model/wallet').settings;
const Member = require('app/model/wallet').members;
const EmailTemplate = require('app/model/wallet').email_templates;
const NotificationService = require('app/lib/notification');
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const database = require('app/lib/database').db().wallet;

module.exports = {
  staking: async (req, res, next) => {
    let transaction;
    try {
      let { body: { amount, tx_id, platform } } = req;
      platform = platform == "TADA" ? "ADA" : platform;

      if (!req.user.membership_type_id) {
        return res.badRequest(res.__("UPGRADE_MEMBERSHIP_TYPE_TO_RECEIVE_STAKING_POINT"), "UPGRADE_MEMBERSHIP_TYPE_TO_RECEIVE_STAKING_POINT");
      }

      let history = await PointHistory.findOne({
        where: {
          member_id: req.user.id,
          action: PointAction.STAKING,
          platform: platform,
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
      if (!setting || setting.value == 'false') {
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

      transaction = await database.transaction();
      await PointHistory.create({
        member_id: req.user.id,
        amount: membershipType.staking_points || 0,
        currency_symbol: "MS_POINT",
        status: PointStatus.APPROVED,
        action: PointAction.STAKING,
        tx_id: tx_id,
        platform: platform,
        source_amount: amount,
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

      _sendNotification({
        member_id: req.user.id,
        amount: amount,
        platform: platform,
        point: membershipType.staking_points,
        tx_id: tx_id
      });

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

async function _sendNotification({ member_id, point, platform, tx_id, amount }) {
  try {
    let member = await Member.findOne({
      where: {
        id: member_id
      }
    });

    let data = {
      sent_all_flg: false,
      actived_flg: true,
      deleted_flg: false
    };
    let templates = await _findEmailTemplate(EmailTemplateType.MS_POINT_NOTIFICATION_ADD_POINT_STAKING);

    for (let t of templates) {
      let content = NotificationService.buildNotificationContent(t.template, {
        firstName: member.first_name,
        lastName: member.last_name,
        point: point,
        point_unit: 'points',
        amount: amount,
        platform: platform
      });
      if (t.language.toLowerCase() == 'ja') {
        data.title_ja = t.subject;
        data.content_ja = content;
      }
      else {
        data.title = t.subject;
        data.content = content;
      }
    }

    await NotificationService.createNotificationMember(data, member_id);
  }
  catch (err) {
    logger.error(`point tracking _sendNotification::`, err);
  }
}

async function _findEmailTemplate(templateName) {
  let templates = await EmailTemplate.findAll({
    where: {
      name: templateName
    }
  });

  return templates;
} 