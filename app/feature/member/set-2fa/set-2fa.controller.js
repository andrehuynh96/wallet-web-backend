const logger = require('app/lib/logger');
const speakeasy = require("speakeasy");
const Member = require('app/model/wallet').members;


module.exports = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        id: req.user.id
      }
    })
    if (!member) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }
    if (req.body.disable) {
      var verified = speakeasy.totp.verify({
        secret: member.twofa_secret,
        encoding: 'base32',
        token: req.body.twofa_code,
      });

      if (!verified) {
        return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT");
      }

      let [_, response] = await Member.update({
        twofa_enable_flg: false,
        twofa_download_key_flg: false
      }, {
          where: {
            id: req.user.id
          },
          returning: true
        });
      if (!response || response.length == 0) {
        return res.serverInternalError();
      }
    }
    else {
      var verified = speakeasy.totp.verify({
        secret: req.body.twofa_secret,
        encoding: 'base32',
        token: req.body.twofa_code,
      });

      if (!verified) {
        return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT", { fields: ["twofa_secret"] });
      }

      let result = await Member.findOne({
        where: {
          twofa_secret: req.body.twofa_secret,
        }
      })

      if (result) {
        return res.badRequest(res.__("TWOFA_EXISTS_ALREADY"), "TWOFA_EXISTS_ALREADY", { fields: ["twofa_secret"] });
      }

      let [_, response] = await Member.update({
        twofa_secret: req.body.twofa_secret,
        twofa_enable_flg: true,
        twofa_download_key_flg: req.body.disable_twofa_download_key
      }, {
          where: {
            id: req.user.id
          },
          returning: true
        });
      if (!response || response.length == 0) {
        return res.serverInternalError();
      }
    }
    return res.ok(true);
  }
  catch (err) {
    logger.error('set 2fa fail:', err);
    next(err);
  }
}