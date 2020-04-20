const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const KycStatus = require('app/model/wallet/value-object/kyc-status');

module.exports = async (req, res, next) => {
  try {
    let data = req.body;
    if (data.kyc && data.kyc.status == KycStatus.APPROVED) {
      let member = await Member.findOne({
        where: {
          email: data.customer.email,
          kyc_id: data.customer.id
        }
      });
      if (member) {
        await Member.update({
          kyc_level: data.kyc.level
        }, {
            where: {
              id: member.id
            }
          })
      }
      if (req.session.authenticated && req.session.user.id == member.id) {
        req.session.user.kyc_level = data.kyc.level;
      }
    }
    return res.ok(true);
  } catch (error) {
    logger.error("kyc callback failed :", error);
    next(error);
  }

};
