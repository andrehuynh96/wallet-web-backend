const logger = require('app/lib/logger');
const BankFactory = require('app/service/banking/factory');
const BankProvider = require('app/service/banking/provider');
const NexoMember = require('app/model/wallet').nexo_members;
const mapper = require('./nexo-member.response-schema');
module.exports = {
  create: async (req, res, next) => {
    try {
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let account = await Service.createAccount(req.body);
      if (account.error) 
        return res.badRequest(result.error.message, "NEXO_ERROR");
      let nexoMember = await NexoMember.create({
        ...req.body,
        member_id: req.user.id,
        nexo_id: account.id,
        user_secret: account.secret
      });
      return res.ok(mapper(nexoMember));
    } catch (err) {
      logger.error('create nexo account fail:', err);
      next(err);
    }
  }
}