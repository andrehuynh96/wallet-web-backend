const logger = require('app/lib/logger');
const Wallet = require('app/model/wallet').wallets;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const database = require('app/lib/database').db().wallet;
const Member = require('app/model/wallet').members;
const mapper = require('app/feature/response-schema/wallet.response-schema');
const { put, get} = require('app/service/s3.service');
const bcrypt = require('bcrypt');
const aes256 = require('aes256');

var wallet = {};

wallet.create = async (req, res, next) => {
  try {
    logger.info('wallet::create');
    let user = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });
    if (!user.twofa_enable_flg) {
      return res.forbidden(res.__("TWOFA_NOT_ACTIVE", "TWOFA_NOT_ACTIVE"));
    }
    let passHash = bcrypt.hashSync(req.body.password_hash, 10);
    let  data = {
      user_wallet_pass_hash: aes256.encrypt(req.body.password_hash, passHash),
      member_id: req.user.id,
      default_flg: req.body.default_flg ? req.body.default_flg: false,
      key_store_path: 'passphrase'
    }
    let wallet = await Wallet.create(data);
    let key = 'passphrase/' + wallet.member_id + '/' + wallet.id;
    let encrypted = aes256.encrypt(passHash, req.body.passphrase_hash);
    let putObject = await put(key, encrypted, next);
    if (putObject) {
      await Wallet.update({key_store_path: key}, {
        where: {
          id: wallet.id
        }, returning: true
      });
      return res.ok(mapper(wallet));
    } else {
      await Wallet.destroy({ where: {id: wallet.id}})
      return res.ok(null);
    }
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

wallet.update =  async (req, res, next) => {
  const transaction = await database.transaction();
  try {
    logger.info('wallet::update');
    const { params: { id}, body } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: id,
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
    if (body.default_flg) {
      await Wallet.update({default_flg: false}, {where: {
        member_id: req.user.id, 
        default_flg: true
      }, returning: true}, { transaction});
    }
    let [_, [result]] = await Wallet.update(body, { where: {
      id: id
    }, returning: true}, { transaction});
    await transaction.commit();
    return res.ok(mapper(result));
  } catch (ex) {
    logger.error(ex);
    await transaction.rollback();
    next(ex);
  }
}

wallet.delete = async (req, res, next) => {
  const transaction = await database.transaction();
  try {
    logger.info('wallet::delete');
    const { params: { id }} = req;
    let wallet = await Wallet.findOne({
      where: {
        id: id,
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
    await WalletPrivateKey.update({deleted_flg: true}, {where: {wallet_id: id}}, {transaction});
    await Wallet.update({ deleted_flg: true}, { where: { id: id } }, { transaction});
    await transaction.commit();
    return res.ok({ deleted: true });
  } catch (error) {
    logger.error(error);
    await transaction.rollback();
    next(error);
  }
};

wallet.getPassphrase = async (req, res, next) => {
  try {
    const { params: { wallet_id }, query: {password_hash} } = req;
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
    let getObject = await get(wallet.key_store_path, next);
    return res.ok({passphrase_hash: aes256.decrypt(decrypted, getObject.Body.toString())});
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

wallet.check = async (req, res, next) => {
  try {
    const { params: { wallet_id , password_hash} } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id
      }
    });
    const decrypted = aes256.decrypt(password_hash, wallet.user_wallet_pass_hash);
    const match = await bcrypt.compare(password_hash, decrypted);
    return res.ok({check: match});
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

module.exports = wallet;