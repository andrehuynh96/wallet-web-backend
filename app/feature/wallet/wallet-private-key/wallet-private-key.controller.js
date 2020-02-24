const logger = require('app/lib/logger');
const Wallet = require('app/model/wallet').wallets;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const mapper = require('app/feature/response-schema/wallet-private-key.response-schema');
const { put, get} = require('app/service/s3.service');
const bcrypt = require('bcrypt');

var privkey = {};

privkey.create = async (req, res, next) => {
  try {
    logger.info('wallet private key::create');
    const { params: {wallet_id}} = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id
      }
    });
    const match = await bcrypt.compare(req.body.password_hash, wallet.user_wallet_pass_hash);
    if (!match) {
      return res.badRequest(res.__("PASSWORD_INCORRECT"), "PASSWORD_INCORRECT");
    }
    let results = [];
    for (item in req.body.items) {
      let  data = {
        user_wallet_pass_hash: bcrypt.hashSync(req.body.password_hash, 10),
        member_id: req.user.id,
        default_flg: req.body.default_flg ? req.body.default_flg: false,
        key_store_path: 'passphrase'
      }
      let wallet = await Wallet.create(data);
      let key = 'private_key/' + wallet.member_id + '/' + wallet.id + '/' + req.body.address;
      let putObject = await put(key, req.body.passphrase_hash, next);
      if (putObject) {
        let [_, result] = await Wallet.update({key_store_path: key}, {
          where: {
            id: wallet.id
          }, returning: true
        });
        return res.ok(mapper(result));
      } else {
        await Wallet.destroy({ where: {id: wallet.id}})
        return res.ok(null);
      }
    }
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
        id: wallet_id
      }
    });
    const match = await bcrypt.compare(req.body.password_hash, wallet.user_wallet_pass_hash);
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
    const { params: { wallet_id, id }, query: {password_hash} } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id
      }
    });
    const match = await bcrypt.compare(password_hash, wallet.user_wallet_pass_hash);
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
    return res.ok({private_key_hash: getObject.Body.toString()});
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

module.exports = wallet;