const logger = require('app/lib/logger');
const config = require('app/config');
const ExchangeTransaction = require('app/model/wallet').exchange_transactions;
const Mapper = require("app/feature/response-schema/exchange/transaction.response-schema");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = async (req, res, next) => {
  try {
    logger.info('transaction::all');
    let { query: { offset, limit, address, sent }, user } = req;
    const where = { member_id: user.id };
    if (address) {
      where.payin_address = address;
    }
    if (sent != undefined) {
      sent = (sent == "true");
      if (sent) {
        where.tx_id = {
          [Op.ne]: null
        }
      }
      else {
        where.tx_id = {
          [Op.is]: null
        }
      }
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
