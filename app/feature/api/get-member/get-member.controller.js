const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const memberMapper = require('app/feature/response-schema/member.response-schema');
const OTP = require('app/model/wallet').otps;
const OtpType = require('app/model/wallet/value-object/otp-type');



module.exports = async (req, res, next) => {
  try {

    return res.ok();
  }
  catch (err) {
    logger.error('login fail: ', err);
    next(err);
  }
};
