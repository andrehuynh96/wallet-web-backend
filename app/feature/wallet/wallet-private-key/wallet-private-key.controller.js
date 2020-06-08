const logger = require('app/lib/logger');
const Wallet = require('app/model/wallet').wallets;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const Member = require('app/model/wallet').members;
const mapper = require('app/feature/response-schema/wallet-private-key.response-schema');
const speakeasy = require('speakeasy');
const database = require('app/lib/database').db().wallet;
const WalletToken = require('app/model/wallet').wallet_tokens;
const Webhook = require('app/lib/webhook');
const config = require('app/config');

var privkey = {};

privkey.create = async (req, res, next) => {
  try {
    logger.info('wallet private key::create');
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
    let items = [];
    for (item of req.body.items) {
      let data = {
        wallet_id: wallet_id,
        platform: item.platform,
        address: item.address,
        hd_path: item.hd_path,
        encrypted_private_key: item.encrypted_private_key
      }
      let coin = await WalletPrivateKey.findOne({
        where: {
          wallet_id: wallet_id,
          platform: item.platform,
          deleted_flg: false
        }
      })
      if (!coin) {
        items.push(data);
      }
    }
    if (items.length == 0) {
      return res.badRequest(res.__("COIN_EXISTED"), "COIN_EXISTED");
    }
    let results = await WalletPrivateKey.bulkCreate(items);

    for (let item of items) {
      Webhook.addAddresses(item.platform, item.address);
    }
    return res.ok(mapper(results));
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

privkey.update = async (req, res, next) => {
  let transaction;
  try {
    logger.info('wallet private key::update');
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
    transaction = await database.transaction();
    for (item of req.body.items) {
      let data = {
        encrypted_private_key: item.encrypted_private_key
      }
      await WalletPrivateKey.update(data, { where: { id: item.id, wallet_id: wallet_id, platform: item.platform } }, { transaction });
    }
    await transaction.commit();
    return res.ok(true);
  } catch (ex) {
    logger.error(ex);
    if (transaction) await transaction.rollback();
    next(ex);
  }
}


privkey.delete = async (req, res, next) => {
  let transaction;
  try {
    logger.info('wallet private key::delete');
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

    let key = await WalletPrivateKey.findOne({
      where: {
        id: id,
        deleted_flg: false
      }
    });
    if (!key) {
      return res.badRequest(res.__("COIN_NOT_FOUND"), "COIN_NOT_FOUND")
    }
    transaction = await database.transaction();
    await WalletToken.update({ deleted_flg: true }, { where: { wallet_id: wallet_id, platform: key.platform } }, { transaction });
    await WalletPrivateKey.update({ deleted_flg: true }, { where: { id: id } }, { transaction });
    await transaction.commit();
    Webhook.removeAddresses(key.platform, key.address);
    return res.ok({ deleted: true });
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    next(error);
  }
};

privkey.getPrivKey = async (req, res, next) => {
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
    let priv = await WalletPrivateKey.findOne({
      where: {
        id: id,
        deleted_flg: false
      }
    })
    if (!priv) {
      return res.badRequest(res.__("COIN_NOT_FOUND"), "COIN_NOT_FOUND")
    }
    return res.ok({ encrypted_private_key: priv.encrypted_private_key });
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

module.exports = privkey;