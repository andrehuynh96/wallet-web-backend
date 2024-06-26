const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const OTP = require("app/model/wallet").otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const config = require("app/config");
const PluTXUserIdApi = require('app/lib/plutx-userid');

const IS_ENABLED_PLUTX_USERID = config.plutxUserID.isEnabled;
const Op = Sequelize.Op;

module.exports = async (req, res, next) => {
  try {
    const token = req.body.verify_token;

    if (IS_ENABLED_PLUTX_USERID) {
      const resetNewPasswordResult = await PluTXUserIdApi.resetPassword(token, req.body.password);
      if (resetNewPasswordResult.httpCode !== 200) {
        return res.status(resetNewPasswordResult.httpCode).send(resetNewPasswordResult.data);
      }

      return res.ok(true);
    }

    let otp = await OTP.findOne({
      where: {
        code: req.body.verify_token,
        action_type: { [Op.in]: [OtpType.FORGOT_PASSWORD, OtpType.CREATE_ACCOUNT] }
      }
    });

    if (!otp) {
      return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ["verify_token"] });
    }

    let today = new Date();
    if (otp.expired_at < today || otp.expired || otp.used) {
      return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED");
    }


    let member = await Member.findOne({
      where: {
        id: otp.member_id,
        deleted_flg: false
      }
    });

    if (!member) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    if (member.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
    }

    if (member.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
    }

    let passWord = bcrypt.hashSync(req.body.password, 10);
    let [_, response] = await Member.update({
      password_hash: passWord,
      attempt_login_number: 0 // reset attempt login number after password resetting
    }, {
        where: {
          id: member.id
        },
        returning: true
      });
    if (!response || response.length == 0) {
      return res.serverInternalError();
    }

    await OTP.update({
      used: true
    }, {
        where: {
          id: otp.id
        },
      });

    return res.ok(true);
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
