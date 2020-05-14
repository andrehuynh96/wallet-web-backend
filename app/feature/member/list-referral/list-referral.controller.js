const logger = require("app/lib/logger");
const Member = require("app/model/wallet").members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const Affiliate = require('app/lib/affiliate');

module.exports = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        id: req.user.id
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
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    let result = await Affiliate.getReferrals({ email: member.email, offset: offset, limit: limit });
    return res.status(result.httpCode).send(result.data);
  }
  catch (err) {
    logger.error('create link kyc fail:', err);
    next(err);
  }
} 