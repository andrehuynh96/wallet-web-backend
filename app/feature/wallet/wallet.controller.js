const logger = require('app/lib/logger');
const Wallet = require('app/model/wallet').wallets;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const database = require('app/lib/database').db().wallet;
const Member = require('app/model/wallet').members;
const mapper = require('app/feature/response-schema/wallet.response-schema');

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
    let  data = {
      member_id: req.user.id,
      default_flg: req.body.default_flg ? req.body.default_flg: false,
      encrypted_passphrase: req.body.encrypted_passphrase
    }
    let wallet = await Wallet.create(data);
    return res.ok(mapper(wallet));
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
    const { params: { wallet_id } } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }
    return res.ok({encrypted_passphrase: wallet.encrypted_passphrase});
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

module.exports = wallet;