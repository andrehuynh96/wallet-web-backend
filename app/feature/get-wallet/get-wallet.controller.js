const logger = require('app/lib/logger');
const Wallet = require("app/model/wallet").wallets;

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let size = req.query.size || 20
      let page = req.query.page || 1

      let total = await Wallet.count({ deleted_flg: false })
      let wallets = await Wallet.findAll({
        where: {
          deleted_flg: false
        },
        raw: true,
        skip: (page - 1) * size,
        limit: size
      });
      return res.ok({
        size, page, total, wallets
      });
    }
    catch (err) {
      logger.error("get wallets fail: ", err);
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      let id = req.params.id
      let wallet = await Wallet.findOne({
        where: {
          deleted_flg: false,
          id: id
        },
        raw: true
      });
      return res.ok(wallet);
    }
    catch (err) {
      logger.error("get wallet detail fail: ", err);
      next(err);
    }
  },
}
