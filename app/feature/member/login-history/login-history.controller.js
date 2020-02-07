const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');

module.exports = async (req, res, next) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;

    const { count: total, rows: items } = await MemberActivityLog.findAndCountAll({
      limit,
      offset,
      where: {
        user_id: req.user.id,
        action: ActionType.LOGIN
      },
      order: [['created_at', 'DESC']]
    });

    return res.ok({
      items: items,
      offset: offset,
      limit: limit,
      total: total
    });
  }
  catch (err) {
    logger.error('loginHistory fail:', err);
    next(err);
  }
}