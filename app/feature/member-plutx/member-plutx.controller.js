const logger = require('app/lib/logger');
const config = require('app/config');
const MemberPlutx = require('app/model/wallet').member_plutxs;
const Member = require('app/model/wallet').members;
const WalletPrivKey = require('app/model/wallet').wallet_priv_keys;
const mapper = require('app/feature/response-schema/member-plutx.response-schema');
const walletPrivKeyMapper = require('app/feature/response-schema/wallet-private-key.response-schema');
const database = require('app/lib/database').db().wallet;
const Plutx = require('app/lib/plutx');
const PlutxContract = require('app/lib/plutx-contract');
const PlutxUserAddressAction = require("app/model/wallet/value-object/plutx-user-address");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  getAll: async (req, res, next) => {
    try {
      logger.info('member_plutxs::all');
      const { query: { offset, limit }, user } = req;
      const where = { member_id: user.id, active_flg: true };
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: plutxs } = await MemberPlutx.findAndCountAll({ offset: off, limit: lim, where: where, order: [['updated_at', 'DESC']] });
      return res.ok({
        items: mapper(plutxs),
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get member plutxs fail: ", err);
      next(err);
    }
  },
  update: async (req, res, next) => {
    let transaction;
    try {
      logger.info("member_plutxs::update");
      transaction = await database.transaction();
      let member = await Member.findOne({
        where: {
          id: req.user.id
        }
      });
      let newDatas = [];
      for (let e of req.body.items) {
        let priv = await WalletPrivKey.findOne({
          where: {
            wallet_id: e.wallet_id,
            platform: e.platform,
            deleted_flg: false
          }
        });
        if (priv) {
          e.address = priv.address;
          let plutx = await MemberPlutx.findOne({
            where: {
              member_id: req.user.id,
              platform: e.platform,
              wallet_id: e.wallet_id,
              address: e.address
            }
          })
          if (plutx) {
            if (plutx.active_flg == false) {
              await MemberPlutx.update({ active_flg: false }, {
                where: {
                  member_id: req.user.id,
                  platform: e.platform,
                  active_flg: true
                }
              }, { transaction });
              await MemberPlutx.update({ active_flg: true }, {
                where: {
                  id: plutx.id
                }
              }, { transaction });
            }
          } else {
            await MemberPlutx.update({ active_flg: false }, {
              where: {
                member_id: req.user.id,
                platform: e.platform,
                active_flg: true
              }
            }, { transaction });
            e.member_id = req.user.id;
            e.member_domain_name = member.domain_name;
            e.active_flg = true;
            e.domain_name = `${e.platform}.${e.wallet_id.replace(/-/g, '')}.${member.domain_id}`.toLowerCase();
            /** create plutx domain */
            let params = { body: { domainName: e.domain_name, domainOwnerAddress: e.address } };
            let result = await Plutx.registerDomain(params);
            if (result.data) {
              newDatas.push(e);
            } else {
              logger.error(`can't register domain member plutxs --domainName::${e.domain_name} --domainOwnerAddress::${e.address}: `, result.error);
            }
          }
        }
      }
      if (newDatas.length > 0) {
        await MemberPlutx.bulkCreate(newDatas, { transaction });
      }
      await transaction.commit();
      return res.ok(true);
    } catch (err) {
      logger.error("update member plutxs: ", err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  },
  checkId: async (req, res, next) => {
    try {
      logger.info('member_plutxs::checkId');
      const { params: { domain_name, platform } } = req;
      const where = {
        member_domain_name: domain_name,
        platform,
        active_flg: true
      };

      const response = await MemberPlutx.findOne({
        where
      });
      return res.ok(mapper(response));
    }
    catch (err) {
      logger.error("check member_plutxs id fail: ", err);
      next(err);
    }
  },
  updatePlutxAddress: async (req, res, next) => {
    try {
      logger.info('member_plutxs::updatePlutxAddress');
      let member = await Member.findOne({
        where: {
          id: req.user.id
        }
      });
      if (!member)
        return res.serverInternalError();
      if (!member.domain_name)
        subdomain = member.domain_id.toString().padStart(6, '0') + '.' + config.plutx.domain;
      else subdomain = member.domain_name;
      const { body: { crypto, address, walletId, action } } = req;
      if (walletId && address) {
        let wallet = await WalletPrivKey.findOne({
          where: {
            address: { [Op.iLike]: `${address}` },
            wallet_id: walletId,
            deleted_flg: false
          }
        });
        if (!wallet)
          return res.badRequest(res.__("WALLETID_AND_ADDRESS_NOT_VALID"), "WALLETID_AND_ADDRESS_NOT_VALID", { fields: ['address', 'walletId'] });
      }
      let unsignedTx;
      switch (action) {
        case PlutxUserAddressAction.ADD_ADDRESS:
          unsignedTx = await PlutxContract.userAddAddress(config.plutx.domain, subdomain.split('.')[0], crypto.toLowerCase(), address);
          if (!member.domain_name)
            await Member.update({
              domain_name: subDomain
            }, {
              where: {
                id: req.user.id
              }
            })
          break;
        case PlutxUserAddressAction.EDIT_ADDRESS:
          unsignedTx = await PlutxContract.userEditAddress(config.plutx.domain, subdomain.split('.')[0], crypto.toLowerCase(), address);
          break;
        case PlutxUserAddressAction.REMOVE_ADDRESS:
          unsignedTx = await PlutxContract.userRemoveAddress(config.plutx.domain, subdomain.split('.')[0], crypto.toLowerCase());
          break;
      }
      return res.ok(unsignedTx);
    }
    catch (err) {
      logger.error("update Plutx crypto addresses fail: ", err);
      next(err);
    }
  },
  getAddress: async (req, res, next) => {
    try {
      logger.info('member_plutxs::getAddress');
      let response = await Plutx.getAddress(req.query);
      if (!response)
        return res.badRequest(res.__("SUBDOMAIN_NOT_FOUND"), "SUBDOMAIN_NOT_FOUND");
      response = response.data;
      let addressList = response.cryptos.map(ele => ele.address);
      let walletIdList = await WalletPrivKey.findAll({
        attributes: ["id", "address", "platform"],
        where: {
          address: addressList,
          deleted_flg: false
        },
        raw: true
      });
      let ret = response.cryptos.map(ele => {
        return {
          address: ele.address,
          cryptoName: ele.cryptoName,
          walletId: walletIdList.find(ele1 => ele1.address == ele.address).id
        }
      });
      response.cryptos = ret;
      delete response.domain;
      delete response.subDomain;

      return res.ok(response);
    }
    catch (err) {
      logger.error("get crypto addresses of Plutx subdomain fail: ", err);
      next(err);
    }
  },
  lookup: async (req, res, next) => {
    try {
      logger.info('member_plutxs::lookup');
      let response = await Plutx.lookup({
        ...req.query,
        addressAndMetaData: true,
        fullDomain: config.plutx.domain,
        onlyDefaultAddress: false
      });
      // console.log(response);
      if (!response || response.data.length == 0)
        return res.badRequest(res.__("FULLDOMAIN_NOT_FOUND"), "FULLDOMAIN_NOT_FOUND");
      response = response.data;
      let addressList = response.map(ele => ele.crypto.address);
      let walletIdList = await WalletPrivKey.findAll({
        attributes: ["id", "address", "platform"],
        where: {
          address: addressList,
          deleted_flg: false
        },
        raw: true
      });
      let ret = response.map(ele => {
        let newEle = Object.assign({}, ele);
        newEle.crypto.walletId = walletIdList.find(ele1 => ele1.address == ele.address).id;
        return newEle;
      })
      return res.ok(ret);
    }
    catch (err) {
      logger.error("get crypto addresses of Plutx subdomain fail: ", err);
      next(err);
    }
  },
  createSubdomain: async (req, res, next) => {
    try {
      logger.info('member_plutxs::createSubdomain');
      let member = await Member.findOne({
        where: {
          id: req.user.id
        }
      });
      if (!member)
        return res.serverInternalError();
      let response = await PlutxContract.createSubdomain(config.plutx.domain, member.domain_id.toString().padStart(6, '0') + '.' + config.plutx.domain);
      return res.ok(response);
    }
    catch (err) {
      logger.error("create Plutx subdomain fail: ", err);
      next(err);
    }
  },
  getAddressByPlatformAndWalletId: async (req, res, next) => {
    try {
      logger.info('member_plutxs::getAddressByPlatformAndWalletId');
      const { query: { platform, walletId } } = req
      let wallet = await WalletPrivKey.findOne({
        where: {
          platform: { [Op.iLike]: `${platform}` },
          wallet_id: walletId,
          deleted_flg: false
        }
      });
      return res.ok(walletPrivKeyMapper(wallet));
    }
    catch (err) {
      logger.error("load address by platform and walletid fail: ", err);
      next(err);
    }
  },
  sendRawTx: async (req, res, next) => {
    try {
      logger.info('member_plutxs::sendRawTx');
      let params = { body: { requestType: req.body.action, rawTx: '0x' + req.body.rawTx.replace('0x', '') } };
      let response = await Plutx.sendRawTransaction(params);
      if (response.data.error)
        return res.serverInternalError(response.data.error);
      return res.ok(response.data);
    }
    catch (err) {
      logger.error("call send-raw-transaction Plutx API fail: ", err);
      next(err);
    }
  }
}
