const logger = require("app/lib/logger");
const Member = require("app/model/wallet").members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const Affiliate = require('app/lib/reward-system/affiliate');

module.exports = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });

    if (!member) {
      return res.badRequest(res.__("NOT_FOUND_USER"), "NOT_FOUND_USER");
    }

    if (member.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
    }

    if (member.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
    }

    if (member.referrer_code) {
      return res.badRequest(res.__("REFERRER_CODE_SET_ALREADY"), "REFERRER_CODE_SET_ALREADY");
    }

    let result = await Affiliate.updateReferrer({ email: member.email, referrerCode: req.body.referrer_code });

    if (result.httpCode == 200) {
      if (!result.data.data.isSuccess) {
        return res.serverInternalError();
      }

      let [_, response] = await Member.update({
        referrer_code: req.body.referrer_code
      }, {
          where: {
            id: member.id
          },
          returning: true,
          plain: true
        });

      req.session.user = response;
      return res.ok(true)
    }

    return res.status(result.httpCode).send(result.data);
  }
  catch (err) {
    logger.error('create link kyc fail:', err);
    next(err);
  }
} 