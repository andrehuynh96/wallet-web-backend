const logger = require('app/lib/logger');
const NexoTransaction = require('app/model/wallet').nexo_transactions;
const Mapper = require('../transaction/nexo-transaction.response-schema');
const NexoMember = require('app/model/wallet').nexo_members;
const BankFactory = require('app/service/banking/factory');
const BankProvider = require('app/service/banking/provider');
const Status = require('app/model/wallet/value-object/nexo-member-status');
const TransactionStatus = require('app/model/wallet/value-object/nexo-transaction-status');

module.exports = {
  withdraw: async (req, res, next) => {
    try {
      let member = await NexoMember.findOne({
        where: {
          member_id: req.user.id,
          nexo_id: req.body.nexo_id
        }
      });
      if (!member)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      if (member.status != Status.ACTIVATED)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_ACTIVATED"), "NEXO_MEMBER_NOT_ACTIVATED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let result = await Service.withdraw({ 
        ...req.body,
        secret: member.user_secret
      });
      if (result.error) 
        return res.badRequest(result.error.message, "NEXO_WITHDRAW_ERROR");
      let transaction = await NexoTransaction.create({
        ...req.body,
        member_id: req.user.id,
        nexo_transaction_id: result.id,
        address: result.wallet_address,
        nexo_currency_id: result.currency_id,
        memo: req.body.tag
      });
      return res.ok(Mapper(transaction));
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('nexo witdraw fail:', err);
      if (err.response.status == 400) {
        return res.badRequest(err.response.data.error.detail, "NEXO_WITHDRAW_ERROR");
      }
      next(err);
    }
  },
  verify: async (req, res, next) => {
    try {
      let member = await NexoMember.findOne({
        where: {
          member_id: req.user.id,
          nexo_id: req.body.nexo_id
        }
      });
      if (!member)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      if (member.status != Status.ACTIVATED)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_ACTIVATED"), "NEXO_MEMBER_NOT_ACTIVATED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let result = await Service.verifyWithdraw({
        nexo_id: member.nexo_id,
        secret: member.user_secret,
        code: req.body.code
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_VERIFY_WITHDRAW_ERROR");
      await NexoTransaction.update({
        status: TransactionStatus.PENDING
      }, {
        where: {
          nexo_transaction_id: req.body.nexo_transaction_id
        }
      });
      return res.ok(true);
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('verify nexo witdraw fail:', err);
      if (err.response.status == 400) {
        return res.badRequest(err.response.data.error.detail, "NEXO_VERIFY_WITHDRAW_ERROR");
      }
      next(err);
    }
  }
}