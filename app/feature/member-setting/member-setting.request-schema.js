const Joi = require('joi');

const schema = Joi.object().keys({
  is_receiced_system_notification_flg: Joi.bool().optional(),
  is_receiced_activity_notification_flg: Joi.bool().optional(),
  is_receiced_news_notification_flg: Joi.bool().optional(),
  is_receiced_marketing_notification_flg: Joi.bool().optional(),
});

module.exports = schema;
