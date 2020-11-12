const logger = require('app/lib/logger');
const BankFactory = require('app/service/banking/factory');
const BankProvider = require('app/service/banking/provider');
const NexoMember = require('app/model/wallet').nexo_members;
const Status = require('app/model/wallet/value-object/nexo-member-status');
const mapper = require('./nexo-member.response-schema');
const balanceMapper = require('./nexo-balance.response-schema');
module.exports = {
  create: async (req, res, next) => {
    try {
      let member = await NexoMember.findOne({
        where: {
          email: req.body.email
        }
      });
      if (member)
        return res.badRequest(res.__("EMAIL_EXISTED"), "EMAIL_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let account = await Service.createAccount(req.body);
      if (account.error)
        return res.badRequest(account.error.message, "NEXO_CREATE_ACCOUNT_ERROR");
      let nexoMember = await NexoMember.create({
        ...req.body,
        member_id: req.user.id,
        nexo_id: account.id,
        user_secret: account.secret
      });
      return res.ok(mapper(nexoMember));
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('create nexo account fail:', err);
      if (err.response.status == 400) {
        return res.badRequest(err.response.data.error.detail, "NEXO_CREATE_ACCOUNT_ERROR");
      }
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
      });
      if (!member)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      let result = await Service.verifyEmail({
        nexo_id: member.nexo_id,
        secret: member.user_secret,
        code: req.body.code
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_VERIFY_ACCOUNT_ERROR");
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
      logger[err.canLogAxiosError ? 'error' : 'info']('verify nexo account fail:', err);
      if (err.response.status == 400) {
        return res.badRequest(err.response.data.error.detail, "NEXO_VERIFY_ACCOUNT_ERROR");
      }
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
        return res.badRequest(result.error.message, "NEXO_PROVIDER_ERROR");
      return res.ok(true);
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('request recovery nexo account fail:', err);
      if (err.response.status == 400) {
        return res.badRequest(err.response.data.error.detail, "NEXO_PROVIDER_ERROR");
      }
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
        return res.badRequest(result.error.message, "NEXO_PROVIDER_ERROR");
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
      logger[err.canLogAxiosError ? 'error' : 'info']('verify recovery nexo account code fail:', err);
      if (err.response.status == 400) {
        return res.badRequest(err.response.data.error.detail, "NEXO_PROVIDER_ERROR");
      }
      next(err);
    }
  },
  getAccount: async (req, res, next) => {
    try {
      let account = await NexoMember.findOne({
        where: {
          member_id: req.user.id
        }
      });
      if (!account)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      return res.ok(mapper(account));
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('get nexo account fail:', err);
      next(err);
    }
  },
  getBalance: async (req, res, next) => {
    try {
      let account = await NexoMember.findOne({
        where: {
          member_id: req.user.id
        }
      });
      if (!account)
        return res.badRequest(res.__("NEXO_MEMBER_NOT_EXISTED"), "NEXO_MEMBER_NOT_EXISTED");
      const Service = BankFactory.create(BankProvider.Nexo, {});
      const result = await Service.getBalance({
        nexo_id: account.nexo_id,
        secret: account.user_secret
      });
      if (result.error)
        return res.badRequest(result.error.message, "NEXO_PROVIDER_ERROR");
      return res.ok(balanceMapper(result))
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('get balance by nexo account fail:', err);
      if (err.response.status == 400) {
        return res.badRequest(err.response.data.error.detail, "NEXO_PROVIDER_ERROR");
      }
      next(err);
    }
  }
};
