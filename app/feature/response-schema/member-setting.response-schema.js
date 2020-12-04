const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].member_id': '[].member_id',
    '[].is_receiced_system_notification_flg': '[].is_receiced_system_notification_flg',
    '[].is_receiced_activity_notification_flg': '[].is_receiced_activity_notification_flg',
    '[].is_receiced_news_notification_flg': '[].is_receiced_news_notification_flg',
    '[].is_receiced_marketing_notification_flg': '[].is_receiced_marketing_notification_flg',
    '[].is_allow_message_flg': '[].is_allow_message_flg',
    '[].is_received_point_notification_flg': '[].is_received_point_notification_flg',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    member_id: 'member_id',
    is_receiced_system_notification_flg: 'is_receiced_system_notification_flg',
    is_receiced_activity_notification_flg: 'is_receiced_activity_notification_flg',
    is_receiced_news_notification_flg: 'is_receiced_news_notification_flg',
    is_receiced_marketing_notification_flg: 'is_receiced_marketing_notification_flg',
    is_allow_message_flg: 'is_allow_message_flg',
    is_received_point_notification_flg: 'is_received_point_notification_flg',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (srcObject === undefined || srcObject.length == 0) {
      return srcObject;
    } else {
      return objectMapper(srcObject, destObject.array);
    }
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
};
