const logger = require('app/lib/logger');
const speakeasy = require("speakeasy");
const Member = require('app/model/wallet').members;


module.exports = async (req, res, next) => {
  try {
    var verified = speakeasy.totp.verify({
      secret: req.body.twofa_secret,
      encoding: 'base32',
      token: req.body.twofa_code,
    });

    if (!verified) {
      return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT");
    }

    let [_, response] = await Member.update({
      twofa_secret: req.body.twofa_secret,
      twofa_enable_flg: true
    }, {
        where: {
          id: req.user.id
        },
        returning: true
      });
    if (!response || response.length == 0) {
      return res.serverInternalError();
    }

    return res.ok(true);
  }
  catch (err) {
    logger.error('set 2fa fail:', err);
    next(err);
  }
}