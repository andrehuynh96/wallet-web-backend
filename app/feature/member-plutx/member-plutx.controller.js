const logger = require('app/lib/logger');
const config = require('app/config');
const MemberPlutx = require('app/model/wallet').member_plutxs;
const Member = require('app/model/wallet').members;
const WalletPrivKey = require('app/model/wallet').wallet_priv_keys;
const mapper = require('app/feature/response-schema/member-plutx.response-schema');
const database = require('app/lib/database').db().wallet;
const Plutx = require('app/lib/plutx');
const PlutxContract = require('app/lib/plutx-contract');
const PlutxUserAddressAction = require("app/model/wallet/value-object/plutx-user-address");

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
  getDomainAdminSigature: async (req, res, next) => {
    try {
      logger.info('member_plutxs::getDomainAdminSigature');
      const { params: { crypto } } = req;
      let user = await Member.findOne({
        where: {
          id: req.user.id
        }
      });
      if (!user) res.serverInternalError();
      if (!user.domain_name)
        user.domain_name = user.domain_id.toString().padStart(6, '0') + '.' + config.plutx.domain;
      await Member.update({
        domain_name: user.domain_name
      }, {
        where: {
          id: req.user.id
        }
      });
      return await PlutxContract.getSig(user.domain_name, crypto);
    }
    catch (err) {
      logger.error("get domain admin signature fail: ", err);
      next(err);
    }
  },
  updatePlutxAddress: async (req, res, next) => {
    try {
      const { body: { subdomain, crypto, address, sig, walletId, action } } = req;
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
          signedTx = await PlutxContract.userAddAddress(config.plutx.domain, subdomain, crypto, address, sig);
          response = await Plutx.sendRawTransaction({ rawTx: signedTx.rawTx, requestType: action });
          await MemberPlutx.create({
            ...record
          })
          break;
        case PlutxUserAddressAction.EDIT_ADDRESS:
          signedTx = await PlutxContract.userEditAddress(config.plutx.domain, subdomain, crypto, address, sig);
          response = await Plutx.sendRawTransaction({ rawTx: signedTx.rawTx, requestType: action });
          record.address = address;
          await MemberPlutx.update({
            ...record
          }, {
            where: {
              id: record.id
            }
          })
          break;
        case PlutxUserAddressAction.REMOVE_ADDRESS:
          signedTx = await PlutxContract.userRemoveAddress(config.plutx.domain, subdomain, crypto, sig);
          response = await Plutx.sendRawTransaction({ rawTx: signedTx.rawTx, requestType: action });
          await MemberPlutx.delete({
            where: {
              id: record.id
            }
          })
          break;
      }
      return response;
    }
    catch (err) {
      logger.error("update Plutx crypto addresses fail: ", err);
      next(err);
    }
  }
}
