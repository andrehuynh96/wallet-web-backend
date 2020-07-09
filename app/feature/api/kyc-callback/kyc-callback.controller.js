const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const KycStatus = require('app/model/wallet/value-object/kyc-status');

module.exports = async (req, res, next) => {
  try {
    let data = req.body;
    let member = await Member.findOne({
      where: {
        email: data.customer.email,
        kyc_id: data.customer.id,
        deleted_flg: false
      }
    });
    if (member && data.kyc) {
      let level = 0;
      if (data.kyc.status == KycStatus.APPROVED) {
        level = data.kyc.level;
      } else {
        level = data.kyc.level - 1;
      }
      await Member.update({
        kyc_level: level
      }, {
          where: {
            id: member.id
          }
        })
      if (req.session.authenticated && req.session.user.id == member.id) {
        req.session.user.kyc_level = level;
      }
    }
    return res.ok(true);
  } catch (error) {
    logger.error("kyc callback failed :", error);
    next(error);
  }

};
