const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const bcrypt = require('bcrypt');
const config = require("app/config");
const PluTXUserIdApi = require('app/lib/plutx-userid');

const IS_ENABLED_PLUTX_USERID = config.plutxUserID.isEnabled;

module.exports = async (req, res, next) => {
  try {
    if (req.body.new_password == req.body.password) {
      return res.badRequest(res.__("NEW_PASSWORD_SAME_CURRENT_PASSWORD"), "NEW_PASSWORD_SAME_CURRENT_PASSWORD");
    }

    const member = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });

    if (!member) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    if (IS_ENABLED_PLUTX_USERID && member.plutx_userid_id) {
      const registerMemberResult = await PluTXUserIdApi.changePassword(member.plutx_userid_id, req.body.password, req.body.new_password);

      if (registerMemberResult.httpCode !== 200) {
        return res.status(registerMemberResult.httpCode).send(registerMemberResult.data);
      }
    } else {
      const match = await bcrypt.compare(req.body.password, member.password_hash);
      if (!match) {
        return res.badRequest(res.__("PASSWORD_INVALID"), "PASSWORD_INVALID");
      }

      const passWord = bcrypt.hashSync(req.body.new_password, 10);
      const [_, user] = await Member.update({
        password_hash: passWord
      }, {
          where: {
            id: req.user.id,
          },
          returning: true
        });

      if (!user || user.length == 0) {
        return res.serverInternalError();
      }
    }

    return res.ok(true);
  }
  catch (err) {
    logger.error('changePassword fail:', err);
    next(err);
  }
};
