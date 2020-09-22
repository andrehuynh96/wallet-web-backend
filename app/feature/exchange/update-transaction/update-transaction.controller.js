const logger = require('app/lib/logger');
const ExchangeTransaction = require('app/model/wallet').exchange_transactions;

module.exports = async (req, res, next) => {
  try {
    const where = { member_id: req.user.id, id: req.params.id };
    const transaction = await ExchangeTransaction.findOne({ where: where });
    if (!transaction) {
      return res.badRequest(res.__("TRANSACTION_NOT_FOUND"), "TRANSACTION_NOT_FOUND", {
        fields: ['id'],
      });
    }

    await ExchangeTransaction.update({
      tx_id: req.body.tx_id
    }, {
        where: {
          id: transaction.id
        },
      });

    return res.ok(true);
  }
  catch (err) {
    logger.error("get update-transaction fail: ", err);
    next(err);
  }
}
