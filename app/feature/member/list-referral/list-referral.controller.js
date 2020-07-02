const logger = require("app/lib/logger");
const Member = require("app/model/wallet").members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const Affiliate = require('app/lib/reward-system/affiliate');

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
    const { count: total, rows: items } = await CosmosAccountContribution.findAndCountAll({
      limit,
      offset,
      attributes:['id', 'email', 'member_sts', 'fullname', 'kyc_level', 'kyc_status'],
      include: [{
        model: MembershipType,
        attributes: ['id','name']
      }],
      where: {
        referrer_code : member.referral_code,
        deleted_flg: false
      }
    })
    items.forEach((item) => {
      if(item.MembershipType){
        item.membership_name= item.MembershipType.name
        item.membership_id = item.MembershipType.id
      }
      delete item.MembershipType
    })
    return res.ok({
      offset: offset,
      limit: limit,
      items: items,
      total: total
    });
  }
  catch (err) {
    logger.error('create link kyc fail:', err);
    next(err);
  }
} 