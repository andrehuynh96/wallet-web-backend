const logger = require('app/lib/logger');
const config = require("app/config");
const MemberAccount = require('app/model/wallet').member_accounts;
const MemberAccountType = require('app/model/wallet/value-object/member-account-type');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bankAccountMapper = require('app/feature/response-schema/bank-account.response-schema');
const MembershipBankCurrency = require('app/model/wallet/value-object/membership-bank-currency');
const database = require('app/lib/database').db().wallet;

module.exports = {
  getCryptoAccountSetting: async (req, res, next) => {
    try {
      if (config.membership.receivingRewardPlatform.length == 0) {
        return res.ok([])
      }
      let result = await MemberAccount.findAll({
        where: {
          member_id: req.user.id,
          deleted_flg: false,
          type: MemberAccountType.Crypto,
          currency_symbol: { [Op.in]: config.membership.receivingRewardPlatform }
        },
        raw: true
      });

      let data = [];
      for (let e of config.membership.receivingRewardPlatform) {
        let i = result.filter(x => x.currency_symbol == e);
        if (!i || i.length == 0) {
          i = new MemberAccount();
          i.currency_symbol = e;
        }
        else {
          i = i[0];
        }
        data.push(i);
      }

      let response = data.map(x => {
        return {
          id: x.id || "",
          currency_symbol: x.currency_symbol,
          wallet_id: x.wallet_id || "",
          wallet_address: x.wallet_address || "",
        }
      });

      return res.ok(response);
    }
    catch (err) {
      logger.error("getCryptoAccountSetting fail: ", err);
      next(err);
    }
  },
  getCryptoAccount: async (req, res, next) => {
    try {
      let result = await MemberAccount.findAll({
        where: {
          member_id: req.user.id,
          deleted_flg: false,
          type: MemberAccountType.Crypto,
          currency_symbol: { [Op.in]: config.membership.receivingRewardPlatform }
        },
        raw: true
      });

      if (!result || result.length == 0) {
        return res.ok([]);
      }
      let response = result.map(x => {
        return {
          id: x.id,
          currency_symbol: x.currency_symbol,
          wallet_id: x.wallet_id,
          wallet_address: x.wallet_address,
        }
      });

      return res.ok(response);
    }
    catch (err) {
      logger.error("getCryptoAccount fail: ", err);
      next(err);
    }
  },
  getBankCurrency: async (req, res, next) => {
    try {
      return res.ok(Object.values(MembershipBankCurrency));
    }
    catch (err) {
      logger.error("getBankAccount fail: ", err);
      next(err);
    }
  },
  getBankAccount: async (req, res, next) => {
    try {
      console.log(req.user.id);
      let result = await MemberAccount.findAll({
        where: {
          member_id: req.user.id,
          deleted_flg: false,
          type: MemberAccountType.Bank
        },
        raw: true
      });

      console.log(result);

      return res.ok(bankAccountMapper(result));
    }
    catch (err) {
      logger.error("getBankAccount fail: ", err);
      next(err);
    }
  },
  getBankAccountDetail: async (req, res, next) => {
    try {
      let result = await MemberAccount.findOne({
        where: {
          id: req.params.id,
          member_id: req.user.id,
          type: MemberAccountType.Bank
        }
      });

      if (!result) {
        return res.badRequest(res.__('NOT_FOUND_BANK_ACCOUNT'), 'NOT_FOUND_BANK_ACCOUNT');
      }
      return res.ok(bankAccountMapper(result));
    }
    catch (err) {
      logger.error("deleteBankAccount fail: ", err);
      next(err);
    }
  },
  deleteBankAccount: async (req, res, next) => {
    try {
      let result = await MemberAccount.findOne({
        where: {
          id: req.params.id,
          member_id: req.user.id,
          type: MemberAccountType.Bank
        }
      });

      if (!result) {
        return res.badRequest(res.__('NOT_FOUND_BANK_ACCOUNT'), 'NOT_FOUND_BANK_ACCOUNT');
      }
      await MemberAccount.update({
        deleted_flg: true
      }, {
          where: {
            id: req.params.id,
          },
        });
      return res.ok(true);
    }
    catch (err) {
      logger.error("deleteBankAccount fail: ", err);
      next(err);
    }
  },
  createBankAccount: async (req, res, next) => {
    try {
      let result = await MemberAccount.create({
        ...req.body,
        member_id: req.user.id,
        type: MemberAccountType.Bank
      });

      if (!result) {
        return res.serverInternalError();
      }
      if (result.default_flg) {
        await MemberAccount.update({
          default_flg: false
        }, {
            where: {
              member_id: req.user.id,
              type: MemberAccountType.Bank
            },
          });
      }
      return res.ok(true);
    }
    catch (err) {
      logger.error("createBankAccount fail: ", err);
      next(err);
    }
  },
  editBankAccount: async (req, res, next) => {
    try {
      let result = await MemberAccount.findOne({
        where: {
          id: req.params.id,
          member_id: req.user.id,
          type: MemberAccountType.Bank
        }
      });

      if (!result) {
        return res.badRequest(res.__('NOT_FOUND_BANK_ACCOUNT'), 'NOT_FOUND_BANK_ACCOUNT');
      }
      result = await MemberAccount.update({
        ...req.body,
      }, {
          where: {
            id: req.params.id,
          },
          returning: true
        });

      if (result.default_flg) {
        await MemberAccount.update({
          default_flg: false
        }, {
            where: {
              member_id: req.user.id,
              type: MemberAccountType.Bank
            },
          });
      }
      return res.ok(bankAccountMapper(result));
    }
    catch (err) {
      logger.error("editBankAccount fail: ", err);
      next(err);
    }
  },
  updateCryptoAccount: async (req, res, next) => {
    let transaction;
    try {
      transaction = await database.transaction();
      let items = [];
      for (let e of req.body.items) {
        let i = await MemberAccount.findOne({
          where: {
            member_id: req.user.id,
            type: MemberAccountType.Crypto,
            currency_symbol: e.currency_symbol
          }
        });

        if (!i) {
          items.push({
            member_id: req.user.id,
            type: MemberAccountType.Crypto,
            currency_symbol: e.currency_symbol,
            wallet_id: e.wallet_id,
            wallet_address: e.wallet_address
          })
        }
        else {
          await MemberAccount.update({
            wallet_id: e.wallet_id,
            wallet_address: e.wallet_address
          }, {
              where: {
                member_id: req.user.id,
                type: MemberAccountType.Crypto,
                currency_symbol: e.currency_symbol
              },
              transaction
            });
        }
      }

      await MemberAccount.bulkCreate(items, transaction);
      await transaction.commit();
      return res.ok(true);
    }
    catch (err) {
      if (transaction) {
        await transaction.rollback()
      };
      logger.error("editBankAccount fail: ", err);
      next(err);
    }
  }
}