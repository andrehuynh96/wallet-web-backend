const logger = require('app/lib/logger');
const Wallet = require('app/model/wallet').wallets;
const WalletToken = require('app/model/wallet').wallet_tokens;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const Member = require('app/model/wallet').members;
const mapper = require('app/feature/response-schema/wallet-token.response-schema');
const speakeasy = require('speakeasy');
const config = require('app/config');
const database = require('app/lib/database').db().wallet;

var token = {};

token.create = async (req, res, next) => {
  try {
    logger.info('wallet token::create');
    const { params: { wallet_id } } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id,
        deleted_flg: false
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }
    let priv = await WalletPrivateKey.findOne({
      where: {
        wallet_id: wallet_id,
        platform: req.body.platform,
        deleted_flg: false
      }
    });
    if (!priv) {
      return res.badRequest(res.__("COIN_NOT_FOUND"), "COIN_NOT_FOUND");
    }
    let token = await WalletToken.findOne({
      where: {
        wallet_id: wallet_id,
        symbol: req.body.symbol,
        platform: req.body.platform,
        sc_token_address: req.body.sc_token_address,
        deleted_flg: false
      }
    })
    if (token) {
      return res.badRequest(res.__("TOKEN_EXISTED"), "TOKEN_EXISTED");
    }
    let data = {
      ...req.body,
      wallet_id: wallet_id
    }
    let result = await WalletToken.create(data);
    return res.ok(mapper(result));
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}


token.delete = async (req, res, next) => {
  try {
    logger.info('wallet token::delete');
    const { params: { wallet_id, id } } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id,
        deleted_flg: false
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }
    await WalletToken.update({ deleted_flg: true }, { where: { id: id } });
    return res.ok({ deleted: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

token.getPrivKey = async (req, res, next) => {
  try {
    const { params: { wallet_id, id }, body: { twofa_code } } = req;
    let user = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });
    if (user.twofa_download_key_flg) {
      var verified = speakeasy.totp.verify({
        secret: user.twofa_secret,
        encoding: 'base32',
        token: twofa_code,
        window: config.twofaStep
      });
      if (!verified) {
        return res.badRequest(res.__('TWOFA_CODE_INCORRECT'), 'TWOFA_CODE_INCORRECT', { fields: ['twofa_code'] });
      }
    }

    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id,
        deleted_flg: false
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }
    let token = await WalletToken.findOne({
      where: {
        id: id,
        deleted_flg: false
      }
    })
    if (!token) {
      return res.badRequest(res.__("TOKEN_NOT_FOUND"), "TOKEN_NOT_FOUND")
    }
    let priv = await WalletPrivateKey.findOne({
      where: {
        platform: token.platform,
        wallet_id: token.wallet_id,
        deleted_flg: false
      }
    })
    if (!priv) {
      return res.badRequest(res.__("PRIVATE_KEY_NOT_FOUND"), "PRIVATE_KEY_NOT_FOUND");
    }
    return res.ok({ encrypted_private_key: priv.encrypted_private_key });
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

token.all = async (req, res, next) => {
  try {
    logger.info('tokens::all');
    const { query: { offset, limit }, params: { wallet_id } } = req;
    const where = { deleted_flg: false, wallet_id: wallet_id };

    const off = parseInt(offset) || 0;
    const lim = parseInt(limit) || parseInt(config.appLimit);

    const { count: total, rows: wallet_tokens } = await WalletToken.findAndCountAll({ offset: off, limit: lim, where: where, order: [['order_index','ASC'],['created_at', 'DESC']] });
    return res.ok({
      items: mapper(wallet_tokens),
      offset: off,
      limit: lim,
      total: total
    });
  }
  catch (err) {
    logger.error("get coins: ", err);
    next(err);
  }
}
token.get = async (req, res, next) => {
  try {
    logger.info('token::get');
    const { params: { wallet_id, id } } = req;
    const where = { deleted_flg: false, wallet_id: wallet_id, id: id };
    let token = await WalletToken.findOne({ where: where });
    if (!key) {
      return res.badRequest();
    } else {
      return res.ok(mapper(token));
    }
  }
  catch (err) {
    logger.error("get key: ", err);
    next(err);
  }
}
token.sort = async (req, res, next) => {
  let transaction;
  try {
    const { params: { wallet_id }, body: { items } } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id,
        deleted_flg: false
      }
    });

    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }

    transaction = await database.transaction();
    for (let i of items) {
      const token = await WalletToken.findOne({
        where: {
          wallet_id: wallet_id,
          symbol: i.symbol,
          platform: i.platform,
          deleted_flg: false
        }
      });

      if (!token) {
        await transaction.rollback();
        return res.badRequest(res.__("TOKEN_NOT_FOUND"), "TOKEN_NOT_FOUND", { field: [{ "symbol": i.symbol }, { "platform": i.platform }] });
      }

      await WalletToken.update({
        order_index: i.index
      }, {
        where: {
          id: token.id,
          wallet_id: wallet_id,
          symbol: i.symbol,
          platform: i.platform,
          deleted_flg: false
        },
        transaction: transaction
      });
    }

    await transaction.commit();
    return res.ok(true);

  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    logger.error("update order index fail ", error);
    next(error);
  }
}

module.exports = token;