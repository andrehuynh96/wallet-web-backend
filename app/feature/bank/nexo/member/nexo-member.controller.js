const logger = require('app/lib/logger');
const BankFactory = require('app/service/banking/factory');
const BankProvider = require('app/service/banking/provider');
const NexoMember = require('app/model/wallet').nexo_members;
const Status = require('app/model/wallet/value-object/nexo-member-status');
const mapper = require('./nexo-member.response-schema');
module.exports = {
  create: async (req, res, next) => {
    try {
      let member = await NexoMember.findOne({
        where: {
          email: req.body.email
        }
      })
      if (member)
        return res.badRequest(res.__("EMAIL_EXISTED"), "EMAIL_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let account = await Service.createAccount(req.body);
      if (account.error)
        return res.badRequest(account.error.message, "NEXO_ERROR");
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
  },
  verify: async (req, res, next) => {
    try {
      let member = await NexoMember.findOne({
        where: {
          member_id: req.user.id,
          email: req.body.email
        }
      })
      if (!member)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let result = await Service.verifyEmail({
        nexo_id: member.nexo_id,
        secret: member.user_secret,
        code: req.body.code
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_ERROR");
      await NexoMember.update({
        status: Status.ACTIVATED
      }, {
        where: {
          member_id: req.user.id,
          email: req.body.email
        }
      });
      return res.ok(true);
    } catch (err) {
      logger.error('create nexo account fail:', err);
      next(err);
    }
  },
  recoveryRequest: async (req, res, next) => {
    try {
      let member = NexoMember.findOne({
        where: {
          email: req.body.email
        }
      });
      if (!member)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let result = await Service.requestRecoveryCode({
        email: req.body.email
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_ERROR");
      return res.ok(true);
    } catch (err) {
      logger.error('request recovery nexo account fail:', err);
      next(err);
    }
  },
  verifyRecovery: async (req, res, next) => {
    try {
      let member = NexoMember.findOne({
        where: {
          email: req.body.email
        }
      });
      if (!member)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let result = await Service.verifyRecoveryCode({
        email: req.body.email,
        code: req.body.code
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_ERROR");
      await NexoMember.update({
        nexo_id: result.id,
        user_secret: result.secret,
        member_id: req.user.id
      }, {
        where: {
          email: req.body.email
        }
      });
      return res.ok(true);
    } catch (err) {
      logger.error('verify recovery nexo account code fail:', err);
      next(err);
    }
  }
}