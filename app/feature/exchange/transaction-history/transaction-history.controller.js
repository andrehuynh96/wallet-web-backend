const logger = require('app/lib/logger');
const config = require('app/config');
const ExchangeTransaction = require('app/model/wallet').exchange_transactions;
const Mapper = require("app/feature/response-schema/exchange/transaction.response-schema");

module.exports = async (req, res, next) => {
  try {
    logger.info('transaction::all');
    const { query: { offset, limit, address }, user } = req;
    const where = { member_id: user.id };
    if (address) {
      where.payin_address = address;
    }
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);

    const { count: total, rows: transactions } = await ExchangeTransaction.findAndCountAll({ offset: off, limit: lim, where: where, order: [['created_at', 'DESC']] });
    return res.ok({
      items: Mapper(transactions),
      offset: off,
      limit: lim,
      total: total
    });
  }
  catch (err) {
    logger.error("get transaction history fail: ", err);
    next(err);
  }
}
