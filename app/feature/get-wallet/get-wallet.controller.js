const logger = require('app/lib/logger');
const config = require('app/config');
const Wallet = require('app/model/wallet').wallets;
const Currency = require('app/model/wallet').currencies;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const WalletToken = require('app/model/wallet').wallet_tokens;
const walletMapper = require('app/feature/response-schema/wallet.response-schema');
const walletPrivateKeyMapper = require('app/feature/response-schema/wallet-private-key.response-schema');
const Sequelize = require('sequelize');
const database = require('app/lib/database').db().wallet;
module.exports = {
  getAll: async (req, res, next) => {
    try {
      logger.info('wallet::all');
      const { query: { offset, limit, default_flg, platform, token }, user } = req;
      const where = { deleted_flg: false, member_id: user.id };
      if (default_flg != undefined) {
        where.default_flg = default_flg;
      }
      let include = [];
      if (token) {
        let whereToken = {
          symbol: token.toUpperCase(),
          deleted_flg: false
        }
        if (platform) {
          whereToken.platform = platform.toUpperCase()
        }
        include.push(
          {
            model: WalletToken,
            where: whereToken
          }
        )
      } else {
        if (platform) {
          include.push(
            {
              model: WalletPrivateKey,
              where: {
                platform: platform.toUpperCase(),
                deleted_flg: false
              },
            }
          )
        }
      }
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: wallets } = await Wallet.findAndCountAll({ offset: off, limit: lim, where: where, include: include, order: [['order_index', 'ASC'],['created_at','DESC']] });
      return res.ok({
        items: walletMapper(wallets),
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get wallets fail: ", err);
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      logger.info('coins::all');
      const { query: { offset, limit, platform, order_by }, params: { wallet_id } } = req;
      const where = { deleted_flg: false, wallet_id: wallet_id };
      if (platform) {
        where.platform = platform.toUpperCase()
      }
      let order = [];
      if (order_by) {
        for (let sort of order_by.split(',')) {
          if (sort.includes('-')) {
            if (sort.trim().substring(1) == "name") {
              order.push([Currency, 'name', 'DESC'])
            } else {
              order.push([sort.trim().substring(1), 'DESC'])
            }
          } else {
            if (sort.trim() == "name") {
              order.push([Currency, 'name', 'ASC'])
            } else {
              order.push([sort.trim(), 'ASC'])
            }

          }
        }
      } else {
        order.push(['order_index', 'ASC'], [Currency, 'name', 'ASC']);
      }
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);
      let include = [
        {
          model: Currency,
          as: "currency",
          required: false,
        }
      ]

      const { count: total, rows: wallet_priv_keys } = await WalletPrivateKey.findAndCountAll({ offset: off, limit: lim, where: where, include: include, order: order });
      return res.ok({
        items: walletPrivateKeyMapper(wallet_priv_keys),
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get coins: ", err);
      next(err);
    }
  },
  getKey: async (req, res, next) => {
    try {
      logger.info('key::get');
      const { params: { wallet_id, id } } = req;
      const where = { deleted_flg: false, wallet_id: wallet_id, id: id };
      let key = await WalletPrivateKey.findOne({ where: where });
      if (!key) {
        return res.badRequest();
      } else {
        return res.ok(walletPrivateKeyMapper(key));
      }
    }
    catch (err) {
      logger.error("get key: ", err);
      next(err);
    }
  },
  saveIndex: async (req,res,next) => {
    let transaction;
    try {
      const { items } = req.body;

      const memberWallets = await Wallet.findAll({
        where: {
          member_id: req.user.id,
          deleted_flg: false
        }
      });
      const cache = memberWallets.reduce((result, value) => {
        result[value.id] = value;

        return result;
      }, {});
      const notFoundIdList = [];
      items.forEach(item => {
        if (!cache[item.wallet_id]) {
          notFoundIdList.push(item.wallet_id);
        }
      });
      if (notFoundIdList.length > 0) {
        return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND", {
          field: ['wallet_id'],
          notFoundIdList,
        });
      }
      const transaction = await database.transaction();
      for(let item of items) {
        await Wallet.update({
          order_index: item.index
        },{
          where: {
            id: item.wallet_id
          },
          transaction: transaction
        })
      }
      transaction.commit();
      return res.ok(true);
    }
    catch (error) {
      if(transaction) {
        transaction.rollback();
      }
      logger.error('save wallet index fail',error);
      next(error);
    }
  }
}
