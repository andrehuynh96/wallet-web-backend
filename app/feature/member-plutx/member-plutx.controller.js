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
      const { body: { subdomain, crypto, address, walletId, action } } = req;
      let wallet = await WalletPrivKey.findOne({
        where: {
          address: { [Op.iLike]: `${address}` },
          wallet_id: walletId
        }
      });
      if (!wallet)
        return res.badRequest(res.__("WALLETID_AND_ADDRESS_NOT_VALID"), "WALLETID_AND_ADDRESS_NOT_VALID", { fields: ['address', 'walletId'] });
      let record = await MemberPlutx.findOne({
        where: {
          member_domain_name: subdomain,
          platform: crypto
        }
      });
      if (!record) {
        if (action == PlutxUserAddressAction.REMOVE_ADDRESS || action == PlutxUserAddressAction.EDIT_ADDRESS)
          return res.badRequest(res.__("PLATFORM_ADDRESS_NOT_AVAILABLE"), "PLATFORM_ADDRESS_NOT_AVAILABLE", { fields: ['address'] });
        record = {
          domain_name: 'temp',
          member_id: req.user.id,
          member_domain_name: subdomain,
          platform: crypto,
          address: address,
          active_flg: true,
          wallet_id: walletId
        }
      }
      else {
        if (action == PlutxUserAddressAction.ADD_ADDRESS)
          return res.badRequest(res.__("PLATFORM_ADDRESS_AVAILABLE_ALREADY"), "PLATFORM_ADDRESS_AVAILABLE_ALREADY", { fields: ['address'] });
      }

      let signedTx, response;
      switch (action) {
        case PlutxUserAddressAction.ADD_ADDRESS:
          signedTx = await PlutxContract.userAddAddress(config.plutx.domain, subdomain, crypto, address);
          // response = await Plutx.sendRawTransaction({ rawTx: signedTx.rawTx, requestType: action });
          if (signedTx) await MemberPlutx.create({
            ...record
          })
          break;
        case PlutxUserAddressAction.EDIT_ADDRESS:
          signedTx = await PlutxContract.userEditAddress(config.plutx.domain, subdomain, crypto, address);
          // response = await Plutx.sendRawTransaction({ rawTx: signedTx.rawTx, requestType: action });
          record.address = address;
          if (signedTx) await MemberPlutx.update({
            ...record
          }, {
            where: {
              id: record.id
            }
          })
          break;
        case PlutxUserAddressAction.REMOVE_ADDRESS:
          signedTx = await PlutxContract.userRemoveAddress(config.plutx.domain, subdomain, crypto);
          // response = await Plutx.sendRawTransaction({ rawTx: signedTx.rawTx, requestType: action });
          if (signedTx) await MemberPlutx.delete({
            where: {
              id: record.id
            }
          })
          break;
      }
      return res.ok({ tx_id: signedTx });
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
      return res.ok(response.data);
    }
    catch (err) {
      logger.error("get crypto addresses of Plutx subdomain fail: ", err);
      next(err);
    }
  },
  lookup: async (req, res, next) => {
    try {
      logger.info('member_plutxs::lookup');
      // req.query.fullDomain = config.plutx.domain;
      // let response = await Plutx.lookup(req.query);
      // response = response.data;
      // let subdomainList = response.map(ele => ele.fullDomain);
      let retObject = {};
      let walletIdList = await MemberPlutx.findAll({
        attributes: ['member_domain_name', 'wallet_id', 'platform', 'address'],
        where: {
          active_flg: true
        },
        raw: true
      });
      walletIdList.map(ele => {
        if (!retObject[ele.platform]) {
          retObject[ele.platform] = [];
          retObject[ele.platform].push({ walletId: ele.wallet_id, address: ele.address, member_domain_name: member_domain_name })
        }
        else {
          retObject[ele.platform].push({ walletId: ele.wallet_id, address: ele.address, member_domain_name: member_domain_name })
        }
      });
      return res.ok(retObject);
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
          wallet_id: walletId
        }
      });
      return res.ok(walletPrivKeyMapper(wallet));
    }
    catch (err) {
      logger.error("load address by platform and walletid fail: ", err);
      next(err);
    }
  },
}
