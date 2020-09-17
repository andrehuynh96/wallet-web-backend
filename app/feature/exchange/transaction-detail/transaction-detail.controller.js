const logger = require('app/lib/logger');
const ExchangeTransaction = require('app/model/wallet').exchange_transactions;
const Mapper = require("app/feature/response-schema/exchange/transaction.response-schema");

module.exports = async (req, res, next) => {
  try {
    logger.info('transaction::detail');
    const where = { member_id: req.user.id, id: req.params.id };
    const transaction = await ExchangeTransaction.findOne({ where: where });
    return res.ok(Mapper(transaction));
  }
  catch (err) {
    logger.error("get transaction detail fail: ", err);
    next(err);
  }
}
