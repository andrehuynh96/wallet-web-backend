const logger = require("app/lib/logger");
const Member = require("app/model/wallet").members;
const MembershipType = require("app/model/wallet").membership_types;
const MemberStatus = require('app/model/wallet/value-object/member-status');

module.exports = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        id: '8df81656-0ddb-472c-956e-b46a11bb9450' //req.user.id
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
    const { count: total, rows: items } = await Member.findAndCountAll({
      limit,
      offset,
      attributes:['id', 'email', 'member_sts', 'fullname', 'kyc_level', 'kyc_status', 'createdAt'],
      include: [{
        model: MembershipType,
        as: 'MembershipType', 
        attributes: ['id','name']
      }],
      where: {
        referrer_code : member.referral_code,
        deleted_flg: false
      },
      raw: true
    })
    result = []
    items.forEach((item) => {
      result.push({
        id: item.id,
        member_sts: item.member_sts,
        email: item.email,
        fullname: item.fullname,
        kyc_level: item.kyc_level,
        kyc_status: item.kyc_status,
        membership_type_id: item['MembershipType.id'],
        membership_type_name: item['MembershipType.name'],
        created_at: item.createdAt
      })
    })
    return res.ok({
      offset: offset,
      limit: limit,
      items: result,
      total: total
    });
  }
  catch (err) {
    logger.error('create link kyc fail:', err);
    next(err);
  }
} 