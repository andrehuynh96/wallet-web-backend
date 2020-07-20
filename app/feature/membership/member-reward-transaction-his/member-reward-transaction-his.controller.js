const logger = require('app/lib/logger');
const config = require('app/config');
const MemberRewardTransactionHis = require('app/model/wallet').member_reward_transaction_his;
const MemberRewardTransactionHisMapper = require('app/feature/response-schema/membership/member-reward-transaction-his.response-schema');
const SystemType = require('app/model/wallet/value-object/system-type');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      logger.info('MemberRewardTransactionHis::all');
      const { query: { offset, limit, order_by }, user } = req;
      const where = {
        member_id: user.id,
        system_type: SystemType.MEMBERSHIP
      };
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);
      let order = [];
      if (order_by) {
        for (let sort of order_by.split(',')) {
          if (sort.includes('-')) {
            order.push([sort.trim().substring(1), 'DESC'])
          } else {
            order.push([sort.trim(), 'ASC'])
          }
        }
      } else {
        order.push(['updated_at', 'DESC']);
      }
      const { count: total, rows: memberRewardTransactionHises } = await MemberRewardTransactionHis.findAndCountAll({ offset: off, limit: lim, where: where, order: order });
      return res.ok({
        items: MemberRewardTransactionHisMapper(memberRewardTransactionHises),
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get member reward transaction histories fail: ", err);
      next(err);
    }
  }

}
