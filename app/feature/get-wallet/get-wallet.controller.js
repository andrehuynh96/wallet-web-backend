const logger = require('app/lib/logger');
const config = require('app/config');
const Wallet = require('app/model/wallet').wallets;
const Currency = require('app/model/wallet').currencies;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const WalletToken = require('app/model/wallet').wallet_tokens;
const walletMapper = require('app/feature/response-schema/wallet.response-schema');
const walletPrivateKeyMapper = require('app/feature/response-schema/wallet-private-key.response-schema');
const Sequelize = require('sequelize');

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

      const { count: total, rows: wallets } = await Wallet.findAndCountAll({ offset: off, limit: lim, where: where, include: include, order: [['created_at', 'DESC']] });
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
      const { query: { offset, limit, platform }, params: { wallet_id } } = req;
      const where = { deleted_flg: false, wallet_id: wallet_id };
      if (platform) {
        where.platform = platform.toUpperCase()
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

      const { count: total, rows: wallet_priv_keys } = await WalletPrivateKey.findAndCountAll({ offset: off, limit: lim, where: where, include: include, order: [[Currency, 'name', 'ASC']] });
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
  }
}
