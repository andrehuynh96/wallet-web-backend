const logger = require('app/lib/logger');
const config = require('app/config');
const MemberRewardTransactionHis = require('app/model/wallet').member_reward_transaction_his;
const MemberRewardTransactionHisMapper = require('app/feature/response-schema/membership/member-reward-transaction-his.response-schema');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      logger.info('MemberRewardTransactionHis::all');
      const { query: { offset, limit }, user} = req;
      const where = { member_id: user.id };
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: memberRewardTransactionHises } = await MemberRewardTransactionHis.findAndCountAll({offset: off, limit: lim, where: where, order: [['updated_at', 'DESC']]});
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
