const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
  try {
    let result = await Member.findOne({
      where: {
        id: req.user.id
      }
    })

    if (!result) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    const match = await bcrypt.compare(req.body.password, result.password_hash);
    if (!match) {
      return res.badRequest(res.__("PASSWORD_INVALID"), "PASSWORD_INVALID");
    }
    if(req.body.new_password == req.body.password) {
      return res.badRequest(res.__("NEW_PASSWORD_SAME_CURRENT_PASSWORD"), "NEW_PASSWORD_SAME_CURRENT_PASSWORD");
    }
    let passWord = bcrypt.hashSync(req.body.new_password, 10);
    let [_, user] = await Member.update({
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

    return res.ok(true);
  }
  catch (err) {
    logger.error('changePassword fail:', err);
    next(err);
  }
};