const _ = require('lodash');
const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet").otps;
const config = require("app/config");
const PluTXUserIdApi = require('app/lib/plutx-userid');

const IS_ENABLED_PLUTX_USERID = config.plutxUserID.isEnabled;

module.exports = async (req, res, next) => {
  try {
    let token = _.trim(req.params.token);

    if (IS_ENABLED_PLUTX_USERID) {
      const getTokenResult = await PluTXUserIdApi.getToken(token);

      if (getTokenResult.httpCode !== 200) {
        return res.status(getTokenResult.httpCode).send(getTokenResult.data);
      }

      return res.ok({
        token_sts: getTokenResult.data.status,
      });
    }

    let otp = await OTP.findOne({
      where: {
        code: req.params.token,
      }
    });
    if (!otp) {
      return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID");
    }

    let today = new Date();
    let tokenStatus = "VALID";
    if (otp.expired_at < today || otp.expired) {
      tokenStatus = "EXPIRED";
    }
    if (otp.used) {
      tokenStatus = "USED";
    }
    let member = await Member.findOne({
      where: {
        id: otp.member_id
      }
    });
    if (!member) {
      return res.badRequest(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND");
    }

    return res.ok({
      token_sts: tokenStatus,
      member_sts: member.member_sts
    });
  }
  catch (err) {
    logger.error("checktoken fail: ", err);
    next(err);
  }
};
