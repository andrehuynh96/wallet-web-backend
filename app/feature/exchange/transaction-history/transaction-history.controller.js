const logger = require('app/lib/logger');
const config = require('app/config');
const Exchange = require('app/model/wallet').exchange_transactions;

module.exports = async (req, res, next) => {
  try {
    logger.info('transaction::all');
    const { query: { offset, limit }, user } = req;
    const where = { member_id: user.id };
    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);

    const { count: total, rows: exchanges } = await Exchange.findAndCountAll({ offset: off, limit: lim, where: where, order: [['created_at', 'DESC']] });
    return res.ok({
      items: exchanges,
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
