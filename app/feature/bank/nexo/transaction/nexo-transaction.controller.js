const logger = require('app/lib/logger');
const NexoTransaction = require('app/model/wallet').nexo_transactions;
const Mapper = require('./nexo-transaction.response-schema');
const conf = require("app/config");

module.exports = {
  getTxById: async (req, res, next) => {
    try {
      const where = { member_id: req.user.id, id: req.params.id };
      let transaction = await NexoTransaction.findOne({
        where: where
      });
      if (!transaction) {
        return res.badRequest(res.__("TRANSACTION_NOT_FOUND"), "TRANSACTION_NOT_FOUND", {
          fields: ['id'],
        });
      }
      else {
        return res.ok(Mapper(transaction));
      }
    } catch (err) {
      logger.error('get nexo transaction fail: ', err);
      next(err)
    }
  },
  getTxs: async (req, res, next) => {
    try {
      let { query: { offset, limit, sort_field, sort_by }, user } = req;
      const where = { member_id: user.id };
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(conf.appLimit);
      const field = sort_field || 'createdAt';
      field = (field == 'created_at' ? 'createdAt' : field);
      field = (field == 'updated_at' ? 'updatedAt' : field);
      const by = sort_by && (sort_by.toUpperCase() == 'DESC' || sort_by.toUpperCase() == 'ASC') ? sort_by.toUpperCase() : 'DESC'
      let { count: total, rows: transactions } = await NexoTransaction.findAndCountAll({
        where: where,
        limit: lim,
        offset: off,
        order: [[field, by]]
      });
      return res.ok({
        items: Mapper(transactions),
        offset: off,
        limit: lim,
        total: total
      });
    } catch (err) {
      logger.error("get nexo transaction by user fail: ", err);
      next(err)
    }
  }
}