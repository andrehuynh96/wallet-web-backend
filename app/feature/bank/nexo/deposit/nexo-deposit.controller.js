const logger = require('app/lib/logger');
const BankFactory = require('app/service/banking/factory');
const BankProvider = require('app/service/banking/provider');
const NexoTransaction = require('app/model/wallet').nexo_transactions;
const NexoMember = require('app/model/wallet').nexo_members;
const Type = require('app/model/wallet/value-object/nexo-transaction-type');
module.exports = {
  get: async (req, res, next) => {
    try {
      let member = await NexoMember.findOne({
        where: {
          nexo_id: req.params.nexo_id,
          member_id: req.user.id
        }
      });
      if (!member)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let result = await Service.getDepositAddress({
        ...req.params,
        secret: member.user_secret
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_GET_DEPOSIT_ERROR");
      return res.ok(result);
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('get address deposit fail:', err);
      if (err.response && err.response.status == 400) {
        return res.badRequest(err.response.data.error.detail, "NEXO_GET_DEPOSIT_ERROR");
      }
      next(err);
    }
  },

  track: async (req, res, next) => {
    try {
      await NexoTransaction.create({
        ...req.body,
        type: Type.DEPOSIT,
        member_id: req.user.id
      })
      return res.ok(true);
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('track deposit nexo fail:', err);
      next(err);
    }
  },
};
