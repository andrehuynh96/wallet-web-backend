const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const memberMapper = require('app/feature/response-schema/member.response-schema');

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

    return res.ok(memberMapper(result));
  }
  catch (err) {
    logger.error('getMe fail:', err);
    next(err);
  }
}