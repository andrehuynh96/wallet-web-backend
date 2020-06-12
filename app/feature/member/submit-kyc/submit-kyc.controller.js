const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const memberMapper = require('app/feature/response-schema/member.response-schema');
const Kyc = require('app/lib/kyc');
const config = require("app/config");

module.exports = async (req, res, next) => {
  try {
    let params = { body: req.body, kycId: req.user.kyc_id };
    let result = await Kyc.submit(params);
    if (result.error) {
      throw result.error
    }
    return res.ok(true);
  }
  catch (err) {
    logger.error("verify member fail:", err);
    next(err);
  }
}