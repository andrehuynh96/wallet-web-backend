const logger = require('app/lib/logger');
const Wallet = require('app/model/wallet').wallets;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const Member = require('app/model/wallet').members;
const mapper = require('app/feature/response-schema/wallet-private-key.response-schema');
const { put, get} = require('app/service/s3.service');
const bcrypt = require('bcrypt');
const aes256 = require('aes256');
const speakeasy = require('speakeasy');

var privkey = {};

privkey.create = async (req, res, next) => {
  try {
    logger.info('wallet private key::create');
    const { params: {wallet_id}} = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }
    const decrypted = aes256.decrypt(req.body.password_hash, wallet.user_wallet_pass_hash);
    const match = await bcrypt.compare(req.body.password_hash, decrypted);
    if (!match) {
      return res.badRequest(res.__("PASSWORD_INCORRECT"), "PASSWORD_INCORRECT");
    }
    let items = [];
    for (item of req.body.items) {
      let key = 'private_key/' + wallet.member_id + '/' + wallet.id + '/' + `${item.platform}_${item.address}`;
      let data = {
        wallet_id: wallet_id,
        platform: item.platform,
        address: item.address,
        hd_path: item.hd_path,
        key_store_path: key
      }
      items.push(data);
      let encrypted = aes256.encrypt(decrypted, item.private_key_hash);
      await put(key, encrypted, next);
    }
    let results = await WalletPrivateKey.bulkCreate(items);
    return res.ok(mapper(results));
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}


privkey.delete = async (req, res, next) => {
  try {
    logger.info('wallet private key::delete');
    const { params: { wallet_id, id }} = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }
    const decrypted = aes256.decrypt(req.body.password_hash, wallet.user_wallet_pass_hash);
    const match = await bcrypt.compare(req.body.password_hash, decrypted);
    if (!match) {
      return res.badRequest(res.__("PASSWORD_INCORRECT"), "PASSWORD_INCORRECT");
    }
    await WalletPrivateKey.update({deleted_flg: true}, {where: {id: id}});
    return res.ok({ deleted: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

privkey.getPrivKey = async (req, res, next) => {
  try {
    const { params: { wallet_id, id }, query: {password_hash, twofa_code} } = req;
    let user = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });
    if (!user.twofa_enable_flg) {
      return res.forbidden(res.__("TWOFA_NOT_ACTIVE", "TWOFA_NOT_ACTIVE"));
    }
    var verified = speakeasy.totp.verify({
      secret: user.twofa_secret,
      encoding: 'base32',
      token: twofa_code,
    });

    if (!verified) {
      return res.badRequest(res.__('TWOFA_CODE_INCORRECT'), 'TWOFA_CODE_INCORRECT', { fields: ['twofa_code'] });
    }
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }
    const decrypted = aes256.decrypt(password_hash, wallet.user_wallet_pass_hash);
    const match = await bcrypt.compare(password_hash, decrypted);
    if (!match) {
      return res.badRequest(res.__("PASSWORD_INCORRECT"), "PASSWORD_INCORRECT");
    }
    let priv = await WalletPrivateKey.findOne({
      where: {
        id: id
      }
    })
    if (!priv) {
      return res.badRequest(res.__("COIN_NOT_FOUND"), "COIN_NOT_FOUND")
    }
    let getObject = await get(priv.key_store_path, next);
    return res.ok({private_key_hash: aes256.decrypt(decrypted, getObject.Body.toString())});
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

module.exports = privkey;