// const config = require('app/config');
const logger = require('app/lib/logger');
const MemberSetting = require('app/model/wallet').member_settings;
const mapper = require('app/feature/response-schema/member-setting.response-schema');

module.exports = {
  get: async (req, res, next) => {
    try {
      const response = await MemberSetting.findOne({
        where: {
          member_id: req.user.id
        }
      });
      if (!response || response.length == 0) {
        return res.notFound(res.__("MEMBER_SETTING_NOT_FOUND"), "MEMBER_SETTING_NOT_FOUND");
      }
      return res.ok(
        mapper(response)
      );
    }
    catch (err) {
      logger.error('get member setting fail:', err);
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { body } = req;
      let value = {};
      // if (body.is_receiced_system_notification_flg != undefined) {
      //   value.is_receiced_system_notification_flg = body.is_receiced_system_notification_flg;
      // }
      // if (body.is_receiced_activity_notification_flg != undefined) {
      //   value.is_receiced_activity_notification_flg = body.is_receiced_activity_notification_flg;
      // }
      if (body.is_allow_message_flg != undefined) {
        value.is_allow_message_flg = body.is_allow_message_flg;
      }
      const [_, response] = await MemberSetting.update(
        value,
        {
          where: {
            member_id: req.user.id
          },
          returning: true
        });
      if (!response) {
        return res.notFound(res.__("MEMBER_SETTING_NOT_FOUND"), "MEMBER_SETTING_NOT_FOUND");
      }
      return res.ok(true);
    }
    catch (err) {
      logger.error('update member setting fail:', err);
      next(err);
    }
  }
};
