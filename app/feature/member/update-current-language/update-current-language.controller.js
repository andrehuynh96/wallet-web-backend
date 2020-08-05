const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;

module.exports = async (req, res, next) => {
  try {
    const member = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });

    if (!member) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    const [_, user] = await Member.update({
      current_language: req.body.language.tolowercase()
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
    logger.error('change current language fail:', err);
    next(err);
  }
};
