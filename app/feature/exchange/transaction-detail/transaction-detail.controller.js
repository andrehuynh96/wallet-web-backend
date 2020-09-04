const logger = require('app/lib/logger');
const Exchange = require('app/model/wallet').exchange_transactions;

module.exports = async (req, res, next) => {
  try {
    logger.info('transaction::detail');
    const where = { member_id: req.user.id , id: req.params.id};
    const exchange = await Exchange.findOne({ where: where });
    return res.ok(exchange);
  }
  catch (err) {
    logger.error("get transaction detail fail: ", err);
    next(err);
  }
}
