const logger = require("app/lib/logger");
const Member = require("app/model/wallet").members;
const MembershipType = require("app/model/wallet").membership_types;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');
const MembershipOrder = require("app/model/wallet").membership_orders;
const MembershipOrderStatus = require('app/model/wallet/value-object/membership-order-status');

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
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const { count: total, rows: items } = await Member.findAndCountAll({
      limit,
      offset,
      attributes: ['id', 'email', 'member_sts', 'fullname', 'kyc_level', 'kyc_status', 'createdAt'],
      include: [{
        model: MembershipType,
        as: 'MembershipType',
        attributes: ['id', 'name']
      }],
      where: {
        referrer_code: member.referral_code,
        deleted_flg: false
      },
      raw: true
    })
    result = []
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      let status = ''
      if (item['MembershipType.name'] == MembershipTypeName.Paid) {
        status = MembershipTypeName.Paid
      }
      else if (item['MembershipType.name'] == MembershipTypeName.Free) {
        let orderCount = await MembershipOrder.count({
          where: {
            member_id: item.id,
            status: MembershipOrderStatus.Pending
          }
        })
        if (orderCount)
          status = 'Order pending'
        else
          status = 'No order'
      }
      result.push({
        id: item.id,
        member_sts: item.member_sts,
        email: item.email,
        fullname: item.fullname,
        kyc_level: item.kyc_level,
        kyc_status: item.kyc_status,
        membership_type_id: item['MembershipType.id'],
        membership_type_name: item['MembershipType.name'],
        created_at: item.createdAt,
        status: status
      })
    }
    console.log(result)
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